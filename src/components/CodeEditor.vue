<script setup lang="ts">
  import { nextTick, ref, onBeforeUnmount } from 'vue';
  import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
  import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
  import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
  import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
  import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
  import * as monaco from 'monaco-editor';
  import { editor } from 'monaco-editor/esm/vs/editor/editor.api.js';

  import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';
  import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js';

  // @ts-ignore
  let editor: editor.IStandaloneCodeEditor;
  const text = ref('SELECT count(0) as C FROM account;\n\nSELECT count(0) as C FROM account;');
  const language = ref('sql');

  onBeforeUnmount(() => {
    editor.dispose();
  });

  // @ts-ignore
  self.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (label === 'json') {
        return new jsonWorker();
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return new cssWorker();
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return new htmlWorker();
      }
      if (['typescript', 'javascript'].includes(label)) {
        return new tsWorker();
      }
      return new EditorWorker();
    },
  };
  const editorInit = () => {
    nextTick(() => {
      if (!editor) {
        editor = monaco.editor.create(document.getElementById('codeEditBox') as HTMLElement, {
          value: text.value, // 编辑器初始显示文字
          language: 'sql', // 语言支持自行查阅demo
          automaticLayout: true, // 自适应布局
          theme: 'vs', // 官方自带三种主题vs, hc-black, or vs-dark
          foldingStrategy: 'indentation',
          renderLineHighlight: 'gutter', // 行亮
          selectOnLineNumbers: true, // 显示行号
          minimap: {
            enabled: false,
          },
          glyphMargin: true,
          readOnly: false, // 只读
          fontSize: 14, // 字体大小
          scrollBeyondLastLine: true, // 取消代码后面一大段空白
          overviewRulerBorder: false, // 不要滚动条的边框
        });

        // monaco.languages.registerCompletionItemProvider('sql', {});
        monaco.editor.setModelMarkers(editor.getModel(), null, [
          {
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: 1,
            endColumn: 8,
            message: 'message',
            severity: 1,
          },
        ]);
        monaco.languages.registerCompletionItemProvider(language.value, {
          provideCompletionItems(model: any, position: any) {
            var textUntilPosition = model.getValueInRange({
              startLineNumber: position.lineNumber,
              startColumn: 1,
              endLineNumber: position.lineNumber,
              endColumn: position.column,
            });
            const suggestions: any = [];

            let tokens = textUntilPosition.split(' ');
            if (tokens.length >= 2) {
              let token = tokens[tokens.length - 2];

              if (token) {
                console.log(token.toLocaleLowerCase());
                // 这个keywords就是sql.js文件中有的
                if (token.toLocaleLowerCase() == 'from' || token.toLocaleLowerCase() == 'update') {
                  console.log(model, position);

                  ['account', 'hb_user'].forEach((item: any) => {
                    suggestions.push({
                      label: item,
                      kind: monaco.languages.CompletionItemKind.Module,
                      insertText: item,
                    });
                  });
                }
              }
            }

            sqlLanguage.keywords.forEach((item: any) => {
              suggestions.push({
                label: item,
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: item,
              });
            });
            sqlLanguage.operators.forEach((item: any) => {
              suggestions.push({
                label: item,
                kind: monaco.languages.CompletionItemKind.Operator,
                insertText: item,
              });
            });
            sqlLanguage.builtinFunctions.forEach((item: any) => {
              suggestions.push({
                label: item,
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: item,
              });
            });
            sqlLanguage.builtinVariables.forEach((item: any) => {
              suggestions.push({
                label: item,
                kind: monaco.languages.CompletionItemKind.Variable,
                insertText: item,
              });
            });
            console.log(suggestions.length);
            return {
              // 最后要返回一个数组
              suggestions,
            };
          },
        });
      }

      var decorations = editor.createDecorationsCollection([
        {
          range: new monaco.Range(1, 1, 1, 1),
          options: {
            isWholeLine: true,
            className: 'myContentClass',
            glyphMarginClassName: 'myGlyphMarginClass',
          },
        },
        // {
        //   range: new monaco.Range(3, 1, 3, 24),
        //   options: { inlineClassName: 'myInlineDecoration' },
        // },
      ]);
      var commandId = editor.addCommand(
        0,
        function () {
          // services available in `ctx`
          console.log(arguments);
          alert('my command is executing!');
        },
        ''
      );
      editor.onDidChangeModelContent((val: any) => {
        text.value = editor.getValue();

        console.log(commandId);

        monaco.languages.registerCodeLensProvider(language.value, {
          provideCodeLenses: function (model: any, token: any) {
            return {
              lenses: [
                {
                  range: {
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 2,
                    endColumn: 1,
                  },
                  id: 'Run1',
                  command: {
                    id: commandId,
                    title: 'Run Query',
                    arguments: [model, token],
                  },
                },
              ],
              dispose: () => {},
            };
          },
          resolveCodeLens: function (model, codeLens, token) {
            console.log(codeLens);
            return codeLens;
          },
        });
      });
    });
  };
  editorInit();
</script>

<template>
  <div id="codeEditBox"></div>
</template>

<style>
  .myGlyphMarginClass {
    /* background: red; */
    background: url('../assets/play_fill.png') no-repeat;
  }
  .myContentClass {
    background: lightblue;
  }
</style>

<style scoped>
  #codeEditBox {
    height: 300px;
    border: 1px solid #ececec;

    width: 100%;
    flex: 1;
    overflow-y: auto;
  }
</style>
