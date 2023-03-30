<template>
  <div class="tree">
    <TreeNode v-if="node != null" :node="node"></TreeNode>
  </div>
</template>

<script lang="ts" setup>
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
</script>

<style lang="less" scoped>
  .tree {
    width: 400px;
    border: 1px solid #ececec;
    padding: 4px;
  }
</style>
