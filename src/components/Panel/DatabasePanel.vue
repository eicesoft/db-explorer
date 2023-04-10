<template>
  <div class="panel">
    <IceTable :fields="columns" :datas="rows">
      <template #TABLE_NAME="{ row, value }">
        <a @click="openTable(value)" href="#">{{ value }}</a></template
      >
      <template #DATA_LENGTH="{ row, value }"> {{ formatLength(value) }}</template>
      <template #INDEX_LENGTH="{ row, value }"> {{ formatLength(value) }}</template>
    </IceTable>
    {{ columns }}
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive, PropType, onMounted } from 'vue';
  import { MetaNode } from '~/components/ConnectManager/index';
  import { useI18n } from 'vue-i18n';
  import Manager from '~/utils/link_manager';
  import { formatLength } from '~/utils/index';

  interface CompProp {
    node: MetaNode;
  }

  const props = defineProps<CompProp>();

  const manager: Manager = Manager.getInstance();
  const { t } = useI18n();

  const conn = manager.get(props.node.serverKey);
  const rows = ref([]);
  const columns = computed(() => {
    return [
      {
        title: t('message.databasepanel.fields.tableName'),
        dataIndex: 'TABLE_NAME',
        ellipsis: true,
        tooltip: true,
        width: 180,
      },
      {
        title: t('message.databasepanel.fields.engine'),
        dataIndex: 'ENGINE',
        ellipsis: true,
        tooltip: true,
        width: 80,
      },
      {
        title: t('message.databasepanel.fields.rows'),
        dataIndex: 'TABLE_ROWS',
        ellipsis: true,
        tooltip: true,
        width: 90,
      },
      {
        title: t('message.databasepanel.fields.dataLength'),
        dataIndex: 'DATA_LENGTH',
        slotName: 'length',
        ellipsis: true,
        tooltip: true,
        width: 120,
      },
      {
        title: t('message.databasepanel.fields.indexLength'),
        dataIndex: 'INDEX_LENGTH',
        slotName: 'length',
        ellipsis: true,
        tooltip: true,
        width: 120,
      },
      {
        title: t('message.databasepanel.fields.autoIncrement'),
        dataIndex: 'AUTO_INCREMENT',
        ellipsis: true,
        tooltip: true,
        width: 80,
      },
      {
        title: t('message.databasepanel.fields.comment'),
        dataIndex: 'TABLE_COMMENT',
        ellipsis: true,
        tooltip: true,
        width: 160,
      },
    ];
  });

  const openTable = (table: string) => {};

  onMounted(async () => {
    const resp = await conn.getTableInfomations(props.node.database ?? '');
    rows.value = resp.data;
  });
</script>

<style lang="less" scoped>
  .panel {
    height: calc(var(--bodyHeight) - 36px);
    width: calc(var(--bodyWidth) - 16px);
    padding: 8px;
  }
</style>
