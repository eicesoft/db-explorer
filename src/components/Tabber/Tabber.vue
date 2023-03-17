<template>
  <div class="m-tab">
    <div class="m-tab-list">
      <div
        class="m-tab-item"
        v-for="(item, i) in tabs"
        :class="{ 'm-tab-item-active': activeNode?.id == item.id }"
        :key="i"
        @click="toggleTab(i, item)"
        >{{ item.title }} <div @click.stop="close(item)" class="x-icon"><img :src="closeImg" /> </div>
      </div>
    </div>
    <slot name="options"></slot>
  </div>
</template>

<script lang="ts" setup>
  import { getIconRes } from '~/utils/res';

  import { onMounted, defineProps, ref, defineEmits, computed, watch, PropType } from 'vue';
  import { Tab, Id, TabType } from './index'
  const props = defineProps({
    tabs: {
      type: Array<Tab>
    },
    active: {
      type: Object as PropType<Tab>
    }
  });

  watch(
    () => props.active,
    () => {
      activeNode.value = props.active;
    });

  const emit = defineEmits<{
    (e: 'change', index: number, tab: Tab): void;
    (e: 'close', tab: Tab): void;
    // (e: 'update:active', Tab: Tab): void
  }>();

  let tabIndex = ref();
  let activeNode = ref<Tab>();

  const toggleTab = (index: number, tab: Tab) => {
    tabIndex.value = index;
    activeNode.value = tab;
    emit('change', index, tab);
    // emit('update:active', tab);
  };

  const close = (item:Tab) => {
    emit('close', item);
  }

  const closeImg = ref(getIconRes('close.png'))
</script>

<style lang="scss" scoped>
  .x-icon {
    display: flex;
    align-items: center;
    margin: 0 4px;

    img {
      width: 14px;
      height: 14px;
      border-radius: 4px;
      padding: 2px;

      &:hover {
        background-color: #accff1;
      }
    }
  }

  .m-tab {
    overflow-x: auto;
    position: relative;
    user-select: none;
    width: var(--bodyWidth);
    background-color: #f7f7f7;
    border-bottom: 1px solid #e8e8e8;
    padding: 2px;
    box-shadow: 0 1px 3px 1px #eeeeee;
    border-top: 1px solid #bfbfbf;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &::-webkit-scrollbar {
      width: 2px;
      height: 2px;
    }

    /* 滚动槽 */
    &::-webkit-scrollbar-track {
      border-radius: 10px;
      background-color: rgba(233, 226, 226, 0.5);
    }

    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: rgba(114, 114, 114, 0.2);
    }

    .m-tab-list {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      min-width: 80%;

      .m-tab-item {
        // width: var(--width);
        // padding: 0 6px;
        color: #717171;
        font-size: 12px;
        text-align: center;
        cursor: pointer;
        padding: 4px 12px 4px 12px;
        border-radius: 2px;
        white-space: nowrap;
        display: flex;

        &:hover {
          background-color: #eaeaea;
          color: #1b1b1b;
        }
      }

      .m-tab-item-active {
        background-color: #ffffff;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        border-bottom: 2px solid #0078d7;

        &:hover {
          background-color: #ffffff;
          color: #717171;
        }
      }

      // .tab-line {
      //   height: 2px;
      //   width: var(--width);
      //   left: var(--left);

      //   background: #0078d7;
      //   position: absolute;
      //   bottom: 0px;
      //   transition: all 0.4s ease;
      // }
    }
  }
</style>
