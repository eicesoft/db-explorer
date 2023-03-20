<template>
  <div>
    <template v-for="(tab, index) in tabStore.tabs">
      <template v-if="tab.type == TabType.Table">
        <TablePanel v-show="tabStore.activeTab?.id == tab.id" :node="tab.meta?.node" />
      </template>

      <template v-else-if="tab.type == TabType.Database">
        <DatabasePanel v-show="tabStore.activeTab?.id == tab.id" :node="tab.meta?.node" />
      </template>
    </template>

    <!--只有一个编辑器实例-->
    <EditorPanel v-show="tabStore.activeTab && tabStore.activeTab?.type == TabType.Query" :node="tabStore.activeTab" />
  </div>
</template>

<script setup lang="ts">
  import TablePanel from './TablePanel.vue';
  import EditorPanel from './EditorPanel.vue';
  import { useTabStore } from '~/store/modules/tab';

  import { TabType } from '~/components/Tabber/index';

  const tabStore = useTabStore();
</script>

<style lang="scss" scoped></style>
