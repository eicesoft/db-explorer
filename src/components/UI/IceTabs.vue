<template>
  <div>
    <div class="m-tab" ref="tabComp">
      <div class="m-tab-list">
        <template v-for="(tab, i) in tabs">
          <div class="m-tab-item" :class="{ 'm-tab-item-active': activeTab?.key == tab.key }" @click="toggleTab(tab)">
            <div class="m-tab-title">
              <slot :tab="tab" name="title">
                <IceIcon v-if="tab.icon" :size="14" :icon="tab.icon" />
                <span style="margin: 0 4px">{{ tab.title }}</span>
              </slot>
            </div>
          </div>
        </template>
      </div>

      <slot name="options"></slot>
    </div>

    <div class="m-tab-container" v-if="is_show_panel">
      <template v-for="(tab, i) in tabs">
        <div v-if="activeTab?.key == tab.key" class="m-tab-panel"> <slot :tab="tab" :name="tab.key"></slot> </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, nextTick, onMounted } from 'vue';
  interface Tab {
    key: string | number;
    title: string;
    icon?: string;
  }

  interface CompProp {
    tabs: Tab[];
    active?: Tab;
    is_show_panel?: boolean;
  }

  const props = withDefaults(defineProps<CompProp>(), { is_show_panel: true });

  const emit = defineEmits<{
    (e: 'change', tab: Tab): void;
  }>();

  const activeTab = ref();
  const tabComp = ref();

  watch(
    () => props.tabs,
    (newVal, oldVal) => {
      //   console.log(newVal, oldVal);
      // if (newVal.length > oldVal.length) {
      nextTick(() => {
        tabComp.value.scrollLeft += tabComp.value.scrollWidth;
      });

      // }
    },
    { deep: true }
  );

  onMounted(() => {
    tabComp.value.addEventListener('wheel', (event: any) => {
      const delta = Math.sign(event.deltaY);
      tabComp.value.scrollLeft += delta * 100;
    });
  });

  if (!props.active) {
    if (props.tabs.length > 0) {
      activeTab.value = props.tabs[0];
    }
  } else {
    activeTab.value = props.active;
  }

  const toggleTab = (tab: Tab) => {
    activeTab.value = tab;
    emit('change', tab);
  };
</script>

<style lang="less" scoped>
  .m-tab {
    overflow-x: auto;
    position: relative;
    user-select: none;
    width: var(--bodyWidth);
    background-color: #f7f7f7;
    border-bottom: 1px solid #e8e8e8;
    padding: 2px;
    box-shadow: 0 1px 3px 1px #eeeeee;
    // border-top: 1px solid #bfbfbf;
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

  .m-tab-panel {
    width: calc(100% - 14px);
    border: 1px solid #ececec;
    padding: 6px;
  }
</style>
