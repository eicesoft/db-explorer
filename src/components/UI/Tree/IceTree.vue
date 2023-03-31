<template>
  <div class="tree">
    <TreeNode :loadmore="loadmore" v-if="node != null" :active="active" :node="node"></TreeNode>
  </div>
</template>

<script lang="ts" setup>
  import emitter from '~/utils/bus';
  import { ref, PropType } from 'vue';
  import type { TreeNode, TreeProp } from './tree';

  const emits = defineEmits<{
    (e: 'change', node: TreeNode): void;
  }>();

  const props = defineProps({
    node: {
      type: Object as PropType<TreeNode>,
    },
    loadmore: {
      type: Function,
      default: () => {},
    },
  });

  const active = ref(null);
  emitter.on('change-node', (node: any) => {
    console.log('change node', node);
    active.value = node;
    emits('change', node);
  });
</script>

<style lang="less" scoped>
  .tree {
    width: 300px;
    height: 700px;
    overflow: auto;
    border: 1px solid #ececec;

    background-color: #fff;
  }
</style>
