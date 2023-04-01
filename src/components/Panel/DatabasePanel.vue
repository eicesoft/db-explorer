<template>
  <div class="panel">
    <a-table
      :virtual-list-props="{ height: 400 }"
      column-resizable
      style="user-select: auto"
      :pagination="false"
      size="mini"
      :columns="columns"
      :data="rows"
    >
      <template #length="{ column, record }">
        {{ formatLength(record[column['dataIndex']]) }}
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive, PropType, onMounted } from 'vue';
  import { SimpleNode } from '~/components/ConnectManager/index';
  import { useI18n } from 'vue-i18n';
  import { Icon } from '@arco-design/web-vue';
  import Manager from '~/utils/link_manager';
  import { formatLength } from '~/utils/index';

  const props = defineProps({
    node: {
      type: Object as PropType<SimpleNode>,
    },
  });

  const manager: Manager = Manager.getInstance();
  const { t } = useI18n();

  const conn = manager.get(props.node?.meta?.Param.serverKey);
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

  onMounted(async () => {
    const resp = await conn.getTableInfomations(props.node.title);
    rows.value = resp.data;
  });
</script>

<style lang="less" scoped>
  .panel {
    height: calc(var(--bodyHeight) - 36px);
    width: var(--bodyWidth);
  }
</style>
