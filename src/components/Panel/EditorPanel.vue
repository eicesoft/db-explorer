<template>
  <CodeEditor :node="calcNode"></CodeEditor>
</template>

<script lang="ts" setup>
  import CodeEditor from '~/components/CodeEditor/CodeEditor.vue';
  import { Tab } from '~/components/Tabber/index';
  import { ref, computed, reactive, PropType, watch, nextTick } from 'vue';

  const props = defineProps({
    node: {
      type: Object as PropType<Tab>,
    },
  });

  const calcNode = ref();

  watch(
    () => props.node,
    (newVal, oldVal) => {
      calcNode.value = newVal;
    }
  );
</script>
