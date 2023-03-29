<template>
  <div class="container-info">
    <div style="margin: 5px 15px; user-select: auto">字段信息:</div>
    <a-table
      :bordered="{ cell: true }"
      column-resizable
      style="margin: 5px 15px; user-select: auto"
      :pagination="false"
      size="mini"
      :columns="columns"
      :data="tableInfos"
    >
      <template #Pk="{ record }">
        <IconStar style="color: cf1322" v-if="record.Key == 'PRI'" />
        <IconThunderbolt style="color: #ffc53d" v-if="record.Key == 'MUL'" />
      </template>
    </a-table>
    <div style="margin: 15px 15px 5px 15px; user-select: auto">Table DDL:</div>

    <div class="code">
      <highlightjs language="sql" :autodetect="false" :code="createSQL" />
      <div class="copy"><IconCopy size="22" @click="copySQL" /></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Notification } from '@arco-design/web-vue';
  import { IconCopy, IconInfoCircleFill, IconStar, IconThunderbolt } from '@arco-design/web-vue/es/icon';
  import { format } from 'sql-formatter';
  import Manager from '~/utils/link_manager';
  import { TableFields } from './table';
  import useClipboard from 'vue-clipboard3';

  const props = defineProps({
    serverKey: {
      type: String,
      default: '',
    },
    database: {
      type: String,
      default: '',
    },
    table: {
      type: String,
      default: '',
    },
  });

  const manager: Manager = Manager.getInstance();
  const tableInfos = ref(null);
  const createSQL = ref('');
  // const { copy } = useClipboard({ source: createSQL });

  const loadTableInfo = async () => {
    const conn = manager.get(props.serverKey);
    // console.log('Load table info ' + pageInfo.page);

    const resp = await conn.query('SHOW FULL FIELDS FROM `' + props.database + '`.`' + props.table + '`', []);
    console.log(resp);
    tableInfos.value = resp.data;

    const tableResp = await conn.query('SHOW CREATE TABLE `' + props.database + '`.`' + props.table + '`', []);
    createSQL.value = format(tableResp.data[0]['Create Table']);
  };

  const columns = ref(TableFields);
  const { toClipboard } = useClipboard();

  const copySQL = async () => {
    await toClipboard(createSQL.value);
    Notification.info({
      title: '复制成功',
      content: '',
    });
  };
  loadTableInfo();
</script>

<style lang="less" scoped>
  .container-info {
    background-color: #fafafa;
    width: 100%;
    height: calc(var(--bodyHeight) - 36px - 36px - 32px);
    overflow-y: auto;
    .code {
      margin: 0 15px 15px 15px;
      user-select: text;

      font-size: 13px;
      position: relative;
      &:hover {
        .copy {
          display: block;
          color: #424242;
          &:hover {
            color: #5975f5;
          }
        }
      }
      .copy {
        display: none;
        position: absolute;
        cursor: pointer;
        right: 8px;
        top: 8px;
        z-index: 100;
      }
    }
  }
</style>
