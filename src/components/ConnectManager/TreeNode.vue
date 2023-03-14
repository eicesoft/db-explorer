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
    isFold: {
      type: Boolean,
      default: false,
    },
  });

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

  let is_fold = ref(props.isFold);
  let is_load = ref<Boolean>(false);

  const imgs = reactive({
    right: getImageRes('to_right.png'),
    fold: getImageRes('to_fold.png'),
  });
  const doFold = () => {
    is_fold.value = !is_fold.value;
  };

  const contextmenuShow = (item: SimpleNode) => {
    // console.log(item);
    emits('contextselect', item);
  };

  const selectNode = (item: SimpleNode) => {
    console.log(item);
    emits('select', item);
  };

  const clickNode = (item: SimpleNode) => {
    emits('select', item);
    console.log('ddd');
  };

  const connect = (item: any = null) => {
    // console.log(props.item);
    if (item) {
      emits('connect', item);
    } else {
      emits('connect', props.item);
    }
  };
</script>

<template>
  <div
    @click="
      (e) => {
        clickNode(item);
        e.stopPropagation();
      }
    "
    :class="{
      active: isSelect,
    }"
    class="tree-node"
    @contextmenu.prevent="contextmenuShow(item)"
  >
    <div class="main">
      <div class="fold" @click="doFold"
        ><img v-show="item?.children && item?.children.length > 0" :src="is_fold ? imgs.fold : imgs.right"
      /></div>
      <div class="icon" v-if="iconImg">
        <img :src="iconImg" />
      </div>
      <div class="title">{{ item?.title }}</div>
    </div>
    <div class="toolbar">
      <template v-if="item?.type == NodeType.Root">
        <img class="icon" :src="getIconRes('add.png')" />
      </template>
      <template v-else-if="item?.type == NodeType.Server">
        <img
          v-if="!item.runtime?.load"
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
  <div v-show="item?.children && is_fold" class="tree-children">
    <TreeNode
      @connect="
        () => {
          connect(child);
        }
      "
      @select="selectNode"
      @contextselect="contextmenuShow"
      v-for="(child, index) in item?.children"
      :active="active"
      :item="child"
    ></TreeNode
  ></div>
</template>

<style scoped>
  .active {
    background-color: rgb(210, 230, 255);
  }
  .tree-node {
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    user-select: none;
  }
  .tree-children {
    margin: 0 0 0 20px;
    /* border-left: 1px dashed #ececec; */
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
  }

  .icon img {
    width: 16px;
    height: 16px;
  }
  .title {
    margin: 0 4px;
  }
</style>
