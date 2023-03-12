// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api.js';

import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution';
import { language as sqlLanguage } from 'monaco-editor/esm/vs/basic-languages/sql/sql.js';

/**
 * SQL Editor class
 */
export default class Editor {
  editor: editor.IStandaloneCodeEditor;
  lang: string;
  value: string;
  /**
   *
   * @param text
   * @param lang
   */
  constructor(text: string, lang: string) {
    this.lang = lang;
    this.value = text;
    self.MonacoEnvironment = {
      getWorker(_: string, label: string) {
        // if (label === 'json') {
        //   return new jsonWorker();
        // }
        // if (label === 'css' || label === 'scss' || label === 'less') {
        //   return new cssWorker();
        // }
        // if (label === 'html' || label === 'handlebars' || label === 'razor') {
        //   return new htmlWorker();
        // }
        // if (['typescript', 'javascript'].includes(label)) {
        //   return new tsWorker();
        // }
        return new EditorWorker();
      },
    };

    this.editor = monaco.editor.create(document.getElementById('codeEditBox') as HTMLElement, {
      value: text, // 编辑器初始显示文字
      language: lang, // 语言支持自行查阅demo
      automaticLayout: true, // 自适应布局
      theme: 'vs', // 官方自带三种主题vs, hc-black, or vs-dark
      foldingStrategy: 'indentation',
      renderLineHighlight: 'gutter', // 行亮
      selectOnLineNumbers: true, // 显示行号
      minimap: {
        enabled: false,
      },
      glyphMargin: false,
      readOnly: false, // 只读
      fontSize: 14, // 字体大小
      scrollBeyondLastLine: true, // 取消代码后面一大段空白
      overviewRulerBorder: false, // 不要滚动条的边框
    });

    this.editor.onDidChangeModelContent((val: any) => {
      //   text.value = this.editor.getValue();
      this.value = this.editor.getValue();
    });

    // var decorations = editor.createDecorationsCollection([
    //   {
    //     range: new monaco.Range(1, 1, 1, 1),
    //     options: {
    //       isWholeLine: true,
    //       className: 'myContentClass',
    //       glyphMarginClassName: 'myGlyphMarginClass',
    //     },
    //   },
    //   // {
    //   //   range: new monaco.Range(3, 1, 3, 24),
    //   //   options: { inlineClassName: 'myInlineDecoration' },
    //   // },
    // ]);
    // var commandId = editor.addCommand(
    //   0,
    //   function () {
    //     // services available in `ctx`
    //     console.log(arguments);
    //     alert('my command is executing!');
    //   },
    //   ''
    // );
    // editor.onDidChangeModelContent((val: any) => {
    //   text.value = editor.getValue();

    //   console.log(commandId);

    //   monaco.languages.registerCodeLensProvider(language.value, {
    //     provideCodeLenses: function (model: any, token: any) {
    //       return {
    //         lenses: [
    //           {
    //             range: {
    //               startLineNumber: 1,
    //               startColumn: 1,
    //               endLineNumber: 2,
    //               endColumn: 1,
    //             },
    //             id: 'Run1',
    //             command: {
    //               id: commandId,
    //               title: 'Run Query',
    //               arguments: [model, token],
    //             },
    //           },
    //         ],
    //         dispose: () => {},
    //       };
    //     },
    //     resolveCodeLens: function (model, codeLens, token) {
    //       console.log(codeLens);
    //       return codeLens;
    //     },
    //   });
    // });
  }

  dispose() {
    this.editor.dispose();
  }

  createWidget() {
    var contentWidget = {
      domNode: null,
      getId: function () {
        return 'my.content.widget';
      },
      getDomNode: function () {
        let domNode = document.createElement('div');
        domNode.innerHTML =
          'My content widget<br/>My content widget<br/>My content widget<br/>My content widget<br/>My content widget<br/>';
        domNode.style.background = 'grey';
        domNode.style.maxHeight = '100px';
        domNode.style.maxWidth = '200px';
        domNode.style.overflow = 'scroll';
        domNode.onwheel = function (e) {
          e.stopPropagation();
        };
        return domNode;
      },
      getPosition: function () {
        return {
          position: {
            lineNumber: 7,
            column: 8,
          },
          preference: [
            monaco.editor.ContentWidgetPositionPreference.ABOVE,
            monaco.editor.ContentWidgetPositionPreference.BELOW,
          ],
        };
      },
    };
    this.editor.addContentWidget(contentWidget);
  }

  createMarker() {
    monaco.editor.setModelMarkers(this.editor.getModel(), null, [
      {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 7,
        message: 'message',
        severity: 2,
      },
    ]);
  }

  registerCompletionItemProvider() {
    monaco.languages.registerCompletionItemProvider(this.lang, {
      provideCompletionItems(model: any, position: any) {
        const suggestions: any = [];

        // var textUntilPosition = model.getValueInRange({
        //   startLineNumber: position.lineNumber,
        //   startColumn: 1,
        //   endLineNumber: position.lineNumber,
        //   endColumn: position.column,
        // });

        // let tokens = textUntilPosition.split(' ');
        // if (tokens.length >= 2) {
        //   let token = tokens[tokens.length - 2];

        //   if (token) {
        //     console.log(token.toLocaleLowerCase());
        //     // 这个keywords就是sql.js文件中有的
        //     if (token.toLocaleLowerCase() == 'from' || token.toLocaleLowerCase() == 'update') {
        //       console.log(model, position);

        //       ['account', 'hb_user'].forEach((item: any) => {
        //         suggestions.push({
        //           label: item,
        //           kind: monaco.languages.CompletionItemKind.Module,
        //           insertText: item,
        //         });
        //       });
        //     }
        //   }
        // }

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

        return {
          suggestions,
        };
      },
    });
  }
}
