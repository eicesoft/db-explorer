<template>
  <div>
    <template v-for="(tab, index) in tabStore.tabs">
      <component v-show="tabStore.activeTab?.id == tab.id" :is="activeComponent(tab)" :node="tab.meta?.node" />
    </template>

    <!--只有一个编辑器实例-->
    <!-- <EditorPanel v-show="tabStore.activeTab && tabStore.activeTab?.type == TabType.Query" :node="tabStore.activeTab" /> -->
  </div>
</template>

<script setup lang="ts">
  import { useTabStore } from '~/store/modules/tab';
  import { TabType, Tab } from '~/components/Tabber/index';
  import TablePanel from '~/components/Panel/TablePanel.vue';
  import DatabasePanel from '~/components/Panel/DatabasePanel.vue';
  import TableDesignPanel from '~/components/Panel/TableDesignPanel.vue';

  const tabStore = useTabStore();

  const activeComponent = (tab: Tab) => {
    switch (tab.type) {
      case TabType.Table:
        return TablePanel;
      case TabType.Database:
        return DatabasePanel;
      case TabType.TableDesign:
        return TableDesignPanel;
    }
  };
</script>

<style lang="less" scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
