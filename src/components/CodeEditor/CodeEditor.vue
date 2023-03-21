<script setup lang="ts">
  import { nextTick, watch, ref, onBeforeUnmount, PropType } from 'vue';
  import { Tab } from '~/components/Tabber/index';
  import Editor from './editor';

  const props = defineProps({
    node: {
      type: Object as PropType<Tab>,
    },
  });

  let editor: Editor;
  const text = ref('');
  const language = ref('sql');
  watch(
    () => props.node,
    (newVal, oldVal) => {
      console.error(newVal, oldVal);
      if (newVal) {
        text.value = newVal?.meta.editor.context;
        editor.setValue(newVal?.meta.editor.context);
      } // editor.setValue(newVal?.meta.editor.context);
      // if (oldVal) {
      //   let { newModel, old } = editor.createModel(newVal?.meta.editor.context);
      //   newVal.meta.editor.model = newModel;

      //   oldVal.meta.editor.state = old.state;
      //   oldVal.meta.editor.model = old.model;
      // }
      // const newModel = monaco.editor.createModel(fileItem.content, fileItem.language);
    },
    {
      deep: true,
      immediate: true,
    }
  );

  onBeforeUnmount(() => {
    editor.dispose();
  });

  const editorInit = () => {
    nextTick(() => {
      if (!editor) {
        editor = new Editor(document.getElementById('codeEditBox'), text.value, language.value);
        // editor.registerCompletionItemProvider();
        // editor.createMarker();
        // editor.createWidget();
      }
    });
  };
  editorInit();
</script>

<template>
  <div class="codeEditBox" id="codeEditBox"></div>
</template>

<style scoped>
  .codeEditBox {
    height: 500px;
    border: 1px solid #ececec;

    width: 99%;
    flex: 1;
    overflow-y: none;
  }
</style>
