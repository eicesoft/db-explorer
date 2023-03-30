<template>
  <div class="tree-node">
    <div class="tree-node-container">
      <div @click="fold" class="tree-node-fold">
        <IconFont v-show="!rNode.isLeaf" size="20" :type="rNode.fold ? 'icon-fold' : 'icon-unfold'" />
      </div>
      <div class="tree-node-body">
        <div class="tree-node-title">
          <div class="tree-node-icon"><IconFont :size="18" :type="'icon-' + rNode.icon" /></div>
          <div class="tree-node-text">{{ rNode.title }}</div>
        </div>
        <template v-if="rNode.children">
          <TreeNode v-show="rNode?.fold" v-for="(child, index) in rNode.children" :node="child"></TreeNode>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  //   import { TreeProp } from './IceTree.vue';
  import { Icon } from '@arco-design/web-vue';
  import { ref } from 'vue';
  import { getImageRes } from '~/utils/res';

  const IconFont = Icon.addFromIconFontCn({
    src: getImageRes('iconfont/iconfont.js'),
  });

  const emits = defineEmits<{
    (e: 'update:node', val: TreeNode): void;
  }>();

  interface TreeNode {
    id: string | number;
    title: string;
    icon: string;
    selectable: boolean;
    fold: boolean;
    isLeaf: boolean;
    children?: Array<TreeNode>;
    runtime?: Record<string, any>;
  }
  interface TreeProp {
    node?: TreeNode;
  }
  const props = withDefaults(defineProps<TreeProp>(), {});
  const rNode = ref<TreeNode>(props.node);

  const fold = () => {
    rNode.value.fold = !rNode.value?.fold;
    emits('update:node', rNode);
  };
</script>

<style lang="less" scoped>
  @height: 24px;
  @icon-weight: 20px;
  .tree-node {
    width: 100%;
  }
  .tree-node-container {
    display: flex;
    align-items: flex-start;
    width: 100%;
    cursor: pointer;
    // border-left: 2px dashed #ececec;
    outline-left: 2px dashed #ececec;
    .tree-node-fold {
      width: @icon-weight;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .tree-node-body {
      text-align: left;
      width: 100%;
    }

    .tree-node-title {
      font-size: 13px;
      height: @height;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-radius: 4px;
      padding-left: 3px;
      &:hover {
        background-color: #ececec;
      }

      .tree-node-icon {
        width: @icon-weight;
        height: @height;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .tree-node-text {
        user-select: none;
        font-size: 13px;
        height: @height;
        line-height: @height;
        margin-left: 3px;
      }
    }
  }
</style>
