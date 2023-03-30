<template>
  <div class="tree">
    <TreeNode v-if="node != null" :active="active" :node="node"></TreeNode>
  </div>
</template>

<script lang="ts" setup>
  import emitter from '~/utils/bus';
  import { ref } from 'vue';
  // import type { TreeNode, TreeProp } from './tree';
  export interface TreeProp {
    node?: TreeNode;
  }

  export interface TreeNode {
    id: string | number;
    title: string;
    icon: string;
    selectable: boolean;
    fold: boolean;
    isLeaf: boolean;
    children?: Array<TreeNode>;
    runtime?: Record<string, any>;
  }

  const props = withDefaults(defineProps<TreeProp>(), {});

  const active = ref(null);
  emitter.on('change-node', (node: any) => {
    console.log('change node', node);
    active.value = node;
  });
</script>

<style lang="less" scoped>
  .tree {
    width: 400px;
    border: 1px solid #ececec;
    padding: 4px;
  }
</style>
