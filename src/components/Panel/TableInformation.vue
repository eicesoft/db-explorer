<template>
  <div class="container-info">
    <div style="margin: 5px 15px; user-select: auto">字段信息:</div>

    <IceTable style="margin: 5px 15px; user-select: auto" :fields="columns" :datas="tableInfos">
      <template #Pk="{ row }">
        <IceIcon style="color: #cf1322" v-if="row.Key == 'PRI'" icon="primary" />
        <IceIcon style="color: #ffc53d" v-if="row.Key == 'MUL'" icon="index"
      /></template>
    </IceTable>

    <div style="margin: 15px 15px 5px 15px; user-select: auto">Table DDL:</div>

    <div class="code">
      <highlightjs language="sql" :autodetect="false" :code="createSQL" />
      <div class="copy">
        <IceIcon :size="22" icon="copy" @click="copySQL" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { notify } from '@kyvg/vue3-notification';
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

    const resp = await conn.getTableFields(props.database, props.table);
    console.log(resp);
    tableInfos.value = resp.data;

    const tableResp = await conn.query('SHOW CREATE TABLE `' + props.database + '`.`' + props.table + '`', []);
    createSQL.value = format(tableResp.data[0]['Create Table']);
  };

  const columns = ref(TableFields);
  const { toClipboard } = useClipboard();

  const copySQL = async () => {
    await toClipboard(createSQL.value);
    // Notification.info({
    //   title: '复制成功',
    //   content: '',
    // });

    notify({
      // title: 'DB Explorer',
      title: '复制成功',
    });
  };
  loadTableInfo();
</script>

<style lang="less" scoped>
  .container-info {
    background-color: #fafafa;
    width: 100%;
    height: calc(var(--bodyHeight) - 36px - 32px);
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
