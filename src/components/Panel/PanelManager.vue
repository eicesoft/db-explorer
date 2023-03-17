<template>
  <div>
    <template v-for="(tab, index) in props.tabs">
      <template v-if="tab.type == TabType.Table">
        <TablePanel v-show="active?.id == tab.id" :node="tab.meta?.node" />
      </template>
    </template>
    <!--只有一个编辑器实例-->
    <EditorPanel v-show="active && active?.type == TabType.Query" :node="active" />
  </div>
</template>

<script setup lang="ts">
  import TablePanel from './TablePanel.vue';
  import EditorPanel from './EditorPanel.vue';

  import { Tab, TabType } from '~/components/Tabber/index'
  import { PropType } from 'vue';
  const props = defineProps({
    tabs: {
      type: Array<Tab>,
    },
    active: {
      type: Object as PropType<Tab>,
    }
  });
</script>

<style lang="scss" scoped></style>
