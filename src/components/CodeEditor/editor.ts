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
  provideCodeLenses: editor.IDisposable;
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
      this.value = this.editor.getValue();
      this.registerCodeLensProvider();
    });

    this.registerCodeLensProvider();

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

    // editor.onDidChangeModelContent((val: any) => {
    //   text.value = editor.getValue();

    //   console.log(commandId);

    // });
  }

  dispose() {
    this.editor.dispose();
  }

  registerCodeLensProvider() {
    if (this.provideCodeLenses) {
      this.provideCodeLenses.dispose();
    }

    var queryCommandId = this.editor.addCommand(
      0,
      (...args: any[]) => {
        // services available in `ctx`
        let model = args[1],
          range = args[2],
          tp = args[3];
        console.log(range);
        let val = model.getValueInRange(
          {
            startLineNumber: range.startLineNumber,
            startColumn: 1,
            endLineNumber: range.endLineNumber + 1,
            endColumn: 1,
          },
          0
        );
        if (tp == 1) {
          alert(`my sql [${val}] is executing!`);
        } else {
          alert(`my sql [${val}] is profile!`);
        }
      },
      '123'
    );
    let ranges = [
      {
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 1,
      },
      {
        startLineNumber: 3,
        startColumn: 1,
        endLineNumber: 3,
        endColumn: 1,
      },
    ];

    this.provideCodeLenses = monaco.languages.registerCodeLensProvider(this.lang, {
      provideCodeLenses: (model: any, token: any) => {
        let lenses = [];

        ranges.forEach((range: any, key: any) => {
          lenses.push({
            range: range,
            id: 'Run' + key,
            command: {
              id: queryCommandId,
              title: '▶️执行',
              arguments: [model, range, 1],
            },
          });

          lenses.push({
            range: range,
            id: 'Profile' + key,
            command: {
              id: queryCommandId,
              title: '🪄分析',
              arguments: [model, range, 2],
            },
          });
        });
        return {
          lenses: lenses,
          dispose: () => {},
        };
      },
      // resolveCodeLens: function (model, codeLens, token) {
      //   console.log(codeLens);
      //   return codeLens;
      // },
    });
    console.log(this.provideCodeLenses);
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
        startColumn: 27,
        endLineNumber: 1,
        endColumn: 34,
        message: '这个是一个数据表格',
        severity: 2,
      },
    ]);
  }

  registerCompletionItemProvider() {
    monaco.languages.registerCompletionItemProvider(this.lang, {
      provideCompletionItems(model: any, position: any) {
        const suggestions: any = [];

        var textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        let tokens = textUntilPosition.split(' ');
        if (tokens.length >= 2) {
          let token = tokens[tokens.length - 2];

          if (token) {
            console.log(token.toLocaleLowerCase());
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

        return {
          suggestions,
        };
      },
    });
  }
}
