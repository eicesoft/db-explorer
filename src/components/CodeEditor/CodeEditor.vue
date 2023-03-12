<script setup lang="ts">
  import { nextTick, ref, onBeforeUnmount } from 'vue';
  import Editor from './editor';

  let editor: Editor;
  const text = ref('SELECT count(0) as C FROM account;\n\nSELECT count(0) as C FROM account;');
  const language = ref('sql');
  onBeforeUnmount(() => {
    editor.dispose();
  });

  const editorInit = () => {
    nextTick(() => {
      if (!editor) {
        editor = new Editor(text.value, language.value);
        editor.registerCompletionItemProvider();
        editor.createMarker();
        // editor.createWidget();
      }
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
    height: 500px;
    border: 1px solid #ececec;

    width: 99%;
    flex: 1;
    overflow-y: none;
  }
</style>
