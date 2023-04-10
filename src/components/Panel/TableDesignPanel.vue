<template>
  <div>
    <IceTabs
      :tabs="[
        { key: 'basic', title: '基本', icon: 'table' },
        { key: 'index', title: '索引' },
        { key: 'option', title: '选项' },
      ]"
    >
      <template #basic>
        {{ node }}
      </template>
      <template #index>
        <!-- {{ tableInfos }} -->
      </template>
      <template #option>
        {{ 'test' }}
      </template>
    </IceTabs>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive, PropType, onMounted } from 'vue';
  import { SimpleNode } from '~/components/ConnectManager/index';
  import Manager from '~/utils/link_manager';
  import { format } from 'sql-formatter';

  const props = defineProps({
    node: {
      type: Object,
    },
  });

  // const manager: Manager = Manager.getInstance();
  // const tableInfos = ref(null);
  // const createSQL = ref('');

  // const loadTableInfo = async () => {
  //   const conn = manager.get(props.node?.meta?.Param.serverKey);
  //   // console.log('Load table info ' + pageInfo.page);
  //   let database = props.node?.meta?.DatabaseName ?? '';
  //   let table = props.node?.title ?? '';
  //   const resp = await conn.getTableFieldInfomation(database, table);
  //   // console.log(resp);
  //   tableInfos.value = resp.data;

  //   const tableResp = await conn.getTableDDL(database, table);
  //   createSQL.value = format(tableResp.data[0]['Create Table']);
  // };

  // loadTableInfo();
</script>

<style lang="less" scoped></style>
