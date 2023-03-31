<template>
  <div class="tree-node" :style="styleVars">
    <div
      class="tree-node-row"
      :class="{ 'tree-node-float': rNode.icon == 'server', 'tree-node-active': rNode.id == active?.id }"
    >
      <div @click="onToggle" :class="{ 'tree-node-fold': !rNode.isLeaf, 'tree-node-fold-empty': rNode.isLeaf }">
        <IconFont
          v-show="!rNode.isLeaf"
          size="20"
          :type="rNode?.runtime?.isload ? 'icon-loading' : rNode.expanded ? 'icon-fold' : 'icon-unfold'"
        />
      </div>
      <div @click="changeNode(rNode)" :class="{}" class="tree-node-title">
        <div class="tree-node-icon">
          <slot name="icon"><IconFont :size="18" :type="'icon-' + rNode.icon" /></slot>
        </div>
        <div class="tree-node-text">
          <slot name="title">{{ rNode.title }}</slot>
        </div>
      </div>
    </div>

    <div class="tree-node-body" v-if="rNode.children && rNode.expanded">
      <div class="tree-node-line"></div>
      <div class="tree-node-children">
        <TreeNode
          :loadmore="loadmore"
          v-show="rNode.expanded"
          v-for="(child, index) in rNode.children"
          :node="child"
          :active="active"
        ></TreeNode
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Icon } from '@arco-design/web-vue';
  import { ref, watchEffect, computed, PropType, nextTick } from 'vue';
  import { getImageRes } from '~/utils/res';
  import emitter from '~/utils/bus';
  import type { TreeNode, TreeNodeProp } from './tree';

  const IconFont = Icon.addFromIconFontCn({
    src: getImageRes('iconfont/iconfont.js'),
  });

  const emits = defineEmits<{
    (e: 'change', node: TreeNode): void;
    (e: 'update:node', val: TreeNode): void;
  }>();

  const props = defineProps({
    node: {
      type: Object as PropType<TreeNode>,
    },
    active: {
      type: Object as PropType<TreeNode>,
    },
    loadmore: {
      type: Function,
      default: () => {},
    },
  });
  const rNode = ref<TreeNode>(props.node);

  watchEffect(() => {
    emits('update:node', rNode.value);
  }, [rNode]);

  const styleVars = computed(() => {
    return {
      '--iconWidth': '20px',
    };
  });

  const onToggle = async () => {
    if (!rNode.value.runtime) {
      rNode.value.runtime = {};
    }

    rNode.value.expanded = !rNode.value.expanded;
    rNode.value.runtime.isload = true;

    if (!rNode.value.runtime.finished) {
      await props.loadmore(rNode.value);

      rNode.value.runtime.finished = true;

      // nextTick(() => {
      rNode.value.runtime.isload = false;
      // });
    } else {
      nextTick(() => {
        rNode.value.runtime.isload = false;
      });
    }
  };

  const changeNode = (node: TreeNode) => {
    console.log('change node', node);
    if (node.selectable) {
      emitter.emit('change-node', node);
    }
  };
</script>

<style lang="less" scoped>
  @height: 24px;
  @icon-weight: var(--iconWidth);
  .tree-node {
    width: 100%;
  }

  .tree-node-float {
    position: sticky;
    left: 0px;
    top: 0px;
    width: 100%;
  }
  .tree-node-active {
    color: #3580f0;
  }
  .tree-node-row {
    display: flex;
    align-items: flex-start;
    width: 100%;
    cursor: pointer;
    background-color: #fff;
    .tree-node-fold {
      width: @icon-weight;
      min-width: @icon-weight;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .tree-node-fold-empty {
      width: 12px;
      min-width: 12px;
    }

    .tree-node-title {
      font-size: 13px;
      height: @height;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-radius: 4px;
      padding-left: 3px;
      width: 100%;

      &:hover {
        background-color: #eeeeee;
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
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        text-overflow: ellipsis;
      }
    }
  }
  .tree-node-body {
    display: flex;
    width: 100%;
    .tree-node-line {
      min-width: calc(var(--iconWidth) / 2);
      margin-left: calc(var(--iconWidth) / 2);
      border-left: 2px dotted #ececec;
      padding-bottom: 20px;
    }

    .tree-node-children {
      text-align: left;
      width: calc(100% - @icon-weight);
    }
  }
</style>
