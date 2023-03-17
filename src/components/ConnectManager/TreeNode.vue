<script setup lang="ts">
  import { ref, reactive, computed, PropType } from 'vue';
  import TreeNode from './TreeNode.vue';
  import { NodeType, SimpleNode } from './index';
  import { getIconRes, getImageRes } from '~/utils/res';

  const emits = defineEmits<{
    (e: 'contextselect', value: any): void;
    (e: 'select', value: any): void;
    (e: 'connect', value: any): void;
  }>();

  const props = defineProps({
    item: { type: Object as PropType<SimpleNode> },
    active: { type: Object as PropType<SimpleNode> },
  });

  const presentItem = ref(props.item);

  const iconImg = computed(() => {
    if (props.item?.icon) {
      return getIconRes(props.item?.icon + '.png');
    } else {
      return null;
    }
  });

  const isSelect = computed(() => {
    return (
      (props.item?.type == NodeType.Database ||
        props.item?.type == NodeType.Server ||
        props.item?.type == NodeType.Table) &&
      props.active?.id == props.item?.id
    );
  });

  const imgs = reactive({
    right: getImageRes('to_right.png'),
    fold: getImageRes('to_fold.png'),
  });
  const expand = () => {
    presentItem.value.is_fold = !presentItem.value.is_fold;
  };

  const contextmenuShow = (item: SimpleNode) => {
    // console.log(item);
    emits('contextselect', item);
  };

  const selectNode = (item: SimpleNode) => {
    // console.log(item);
    emits('select', item);
  };

  const clickNode = (item: SimpleNode) => {
    emits('select', item);
    // console.log('ddd');
  };

  const connect = (item: any = null) => {
    // console.log(props.item);
    if (item) {
      emits('connect', item);
    } else {
      emits('connect', presentItem);
    }
  };
</script>

<template>
  <div
    @click="
      (e) => {
        clickNode(presentItem);
        e.stopPropagation();
      }
    "
    :class="{
      active: isSelect,
    }"
    class="tree-node"
    @contextmenu.prevent="contextmenuShow(presentItem)"
  >
    <div class="main">
      <div class="fold" @click.stop="expand"
        ><img
          v-show="presentItem?.children && presentItem?.children.length > 0"
          :src="presentItem?.is_fold ? imgs.fold : imgs.right"
      /></div>
      <div class="icon" v-if="iconImg">
        <img :src="iconImg" />
      </div>
      <div :title="presentItem?.title" class="title" :style="{ fontWeight: item?.runtime?.isOpen ? 800 : null }">{{
        presentItem?.title
      }}</div>
    </div>
    <div class="toolbar">
      <template v-if="presentItem?.type == NodeType.Root">
        <img class="icon" :src="getIconRes('add.png')" />
      </template>
      <template v-else-if="presentItem?.type == NodeType.Server">
        <img
          v-if="!presentItem.runtime?.load"
          @click.stop="connect"
          style="width: 18px; height: 18px"
          class="icon"
          :src="getIconRes('play.png')"
        />
        <img
          v-else
          @click.stop="connect"
          style="width: 18px; height: 18px"
          class="icon"
          :src="getIconRes('stop.png')"
        />
      </template>
    </div>
  </div>
  <div v-show="presentItem?.children && presentItem.is_fold" class="tree-children">
    <TreeNode
      @connect="
        () => {
          connect(child);
        }
      "
      @select="selectNode"
      @contextselect="contextmenuShow"
      v-for="(child, index) in presentItem?.children"
      :active="active"
      :item="child"
      :key="'child' + index"
    ></TreeNode
  ></div>
</template>

<style scoped>
  .active {
    /* background-color: rgb(210, 230, 255); */
    font-weight: 800;
  }
  .tree-node {
    font-size: 12px;
    display: flex;
    /* justify-content: space-between; */
    align-items: center;
    user-select: none;
  }
  .tree-children {
    margin: 0 0 0 20px;
    border-left: 1px dashed #ececec;
  }
  .main {
    display: flex;
    align-items: center;
    margin: 2px 0;
  }

  .fold {
    cursor: pointer;
    width: 16px;
    height: 16px;
  }
  .toolbar {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .icon {
    width: 16px;
    height: 16px;
    margin: 0;
  }

  .icon img {
    width: 16px;
    height: 16px;
  }
  .title {
    margin: 0 4px;
    /* color: rgb(86, 17, 143); */
  }
</style>
