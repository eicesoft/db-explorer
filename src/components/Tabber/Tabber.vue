<template>
  <div class="m-tab" ref="tab">
    <div class="m-tab-list">
      <div
        class="m-tab-item"
        v-for="(item, i) in tabStore.tabs"
        :class="{ 'm-tab-item-active': tabStore.activeTab?.id == item.id }"
        :key="i"
        @click="toggleTab(item)"
      >
        <a-dropdown size="mini" trigger="contextMenu" alignPoint :style="{ display: 'block' }">
          <div class="m-tab-title">
            <icon-font style="color: #f18e27" v-if="item.lock" type="icon-lock" :size="14" />

            <icon-font v-if="item.type == TabType.Database" type="icon-database" :size="12" />
            <icon-font v-if="item.type == TabType.Table" type="icon-table" :size="12" />
            <icon-font v-if="item.type == TabType.Query" type="icon-text" :size="16" />

            <span style="margin: 0 4px">{{ item.title }}</span>
            <div v-if="!item.lock" @click.stop="close(item)" class="x-icon"
              ><icon-font type="icon-close" :size="14" />
            </div>
          </div>
          <template #content>
            <a-doption @click="lock(item)">{{
              item.lock ? t('message.tabber.contentMenu.ulock') : t('message.tabber.contentMenu.lock')
            }}</a-doption>
            <a-divider margin="2px" />
            <a-doption v-if="!item.lock" @click="close(item)">{{ t('message.tabber.contentMenu.close') }}</a-doption>
            <a-doption @click="closeOther(item)">{{ t('message.tabber.contentMenu.closeOther') }}</a-doption>
            <a-doption @click="closeAll()">{{ t('message.tabber.contentMenu.closeAll') }}</a-doption>
          </template>
        </a-dropdown>
      </div>
    </div>
    <slot name="options"></slot>
  </div>
</template>

<script lang="ts" setup>
  import { useTabStore } from '~/store/modules/tab';
  import { onMounted, nextTick, ref, defineEmits, watch } from 'vue';
  import { Tab, Id, TabType } from './index';
  import { getImageRes } from '~/utils/res';
  import { Icon } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  const IconFont = Icon.addFromIconFontCn({
    src: getImageRes('iconfont/iconfont.js'),
  });
  // const props = defineProps({
  //   tabs: {
  //     type: Array<Tab>,
  //   },
  // });

  const tabStore = useTabStore();
  const tab = ref();

  watch(
    () => tabStore.tabs,
    (newVal, oldVal) => {
      console.log(newVal, oldVal);
      // if (newVal.length > oldVal.length) {
      nextTick(() => {
        tab.value.scrollLeft += tab.value.scrollWidth;
      });

      // }
    },
    { deep: true }
  );

  const emit = defineEmits<{
    (e: 'change', tab: Tab): void;
    (e: 'close', tab: Tab): void;
    (e: 'closeOther', tab: Tab): void;
    (e: 'closeAll'): void;
  }>();

  const toggleTab = (tab: Tab) => {
    // activeNode.value = tab;
    emit('change', tab);
    tabStore.active(tab);
    // emit('update:active', tab);
  };

  const lock = (item: Tab) => {
    item.lock = !item.lock;
  };

  const closeOther = (item: Tab) => {
    emit('closeOther', item);
  };

  const closeAll = () => {
    emit('closeAll');
  };

  const close = (item: Tab) => {
    emit('close', item);
  };

  onMounted(() => {
    tab.value.addEventListener('wheel', (event: any) => {
      const delta = Math.sign(event.deltaY);
      tab.value.scrollLeft += delta * 100;
    });
  });

  // const closeImg = ref(getIconRes('close.png'));
</script>

<style lang="scss">
  .arco-dropdown-option {
    line-height: 24px !important;
    font-size: 12px !important;
    min-width: 96px !important;
  }
  .arco-dropdown-option-active,
  .arco-dropdown-option:not(.arco-dropdown-option-disabled):hover {
    color: var(--color-text-1) !important;
    background-color: #e8f1fc !important;
    transition: all 0.1s cubic-bezier(0, 0, 1, 1);
  }
</style>

<style lang="scss" scoped>
  .x-icon {
    display: flex;
    align-items: center;
    margin: 0 4px;
    &:hover {
      background-color: #dddddd;
      color: #fff;
      border-radius: 4px;
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

      .m-tab-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 4px 8px;
      }
      .m-tab-item {
        // width: var(--width);
        // padding: 0 6px;
        color: #717171;
        font-size: 12px;
        // text-align: center;
        cursor: pointer;
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
    }
  }
</style>
