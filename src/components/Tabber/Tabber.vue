<template>
  <div class="m-tab" ref="tab">
    <div class="m-tab-list">
      <template v-for="(item, i) in tabStore.tabs">
        <div
          @contextmenu="onContextMenu(item, $event)"
          class="m-tab-item"
          :class="{ 'm-tab-item-active': tabStore.activeTab?.id == item.id }"
          @click="toggleTab(item)"
        >
          <div class="m-tab-title">
            <IceIcon style="color: #f18e27" v-if="item.lock" icon="lock" :size="14" />
            <IceIcon v-if="item.type == TabType.Database" icon="database" :size="12" />
            <IceIcon v-if="item.type == TabType.Table" icon="table" :size="12" />
            <IceIcon v-if="item.type == TabType.Query" icon="query" :size="16" />
            <IceIcon v-if="item.type == TabType.TableDesign" icon="design" :size="12" />

            <span style="margin: 0 4px">{{ item.title }}</span>
            <div v-if="!item.lock" @click.stop="close(item)" class="x-icon">
              <IceIcon icon="close" :size="14" />
            </div>
          </div>
        </div>
      </template>
    </div>
    <slot name="options"></slot>
  </div>
</template>

<script lang="ts" setup>
  import { useTabStore } from '~/store/modules/tab';
  import { onMounted, nextTick, ref, watch } from 'vue';
  import { Tab, Id, TabType } from './index';
  import { useI18n } from 'vue-i18n';
  import ContextMenu from '@imengyu/vue3-context-menu';
  const { t } = useI18n();

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

  const lock = (tab: Tab) => {
    tab.lock = !tab.lock;
  };

  const closeOther = (tab: Tab) => {
    emit('closeOther', tab);
  };

  const closeAll = () => {
    emit('closeAll');
  };

  const close = (tab: Tab) => {
    emit('close', tab);
  };

  const onContextMenu = (tab: Tab, e: any) => {
    //show our menu
    ContextMenu.showContextMenu({
      theme: 'win10 dark',
      x: e.x,
      y: e.y,
      zIndex: 1000,
      items: [
        {
          label: tab.lock ? t('message.tabber.contentMenu.ulock') : t('message.tabber.contentMenu.lock'),
          onClick: () => {
            lock(tab);
          },
          divided: true,
        },
        {
          label: t('message.tabber.contentMenu.close'),
          disabled: tab.lock,
          onClick: () => {
            close(tab);
          },
        },
        {
          label: t('message.tabber.contentMenu.closeOther'),
          onClick: () => {
            closeOther(tab);
          },
        },
        {
          label: t('message.tabber.contentMenu.closeAll'),
          onClick: () => {
            closeAll();
          },
        },
      ],
    });
  };

  onMounted(() => {
    tab.value.addEventListener('wheel', (event: any) => {
      const delta = Math.sign(event.deltaY);
      tab.value.scrollLeft += delta * 100;
    });
  });
</script>

<style lang="less" scoped>
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
      background-color: #fff4dbe7;
    }

    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #ffe6afe7;
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
