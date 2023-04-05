<template>
  <div>
    <a-tabs>
      <a-tab-pane key="1" title="基本"> {{ node }} </a-tab-pane>
      <a-tab-pane key="2" title="索引"> {{ tableInfos }} </a-tab-pane>
      <a-tab-pane key="3" title="选项"> Content of Tab Panel 3 </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive, PropType, onMounted } from 'vue';
  import { SimpleNode } from '~/components/ConnectManager/index';
  import Manager from '~/utils/link_manager';
  import { format } from 'sql-formatter';

  const props = defineProps({
    node: {
      type: Object as PropType<SimpleNode>,
    },
  });

  const manager: Manager = Manager.getInstance();
  const tableInfos = ref(null);
  const createSQL = ref('');

  const loadTableInfo = async () => {
    const conn = manager.get(props.node?.meta?.Param.serverKey);
    // console.log('Load table info ' + pageInfo.page);

    const resp = await conn.getTableFieldInfomation(props.node?.meta?.DatabaseName, props.node?.title);
    // console.log(resp);
    tableInfos.value = resp.data;

    const tableResp = await conn.query(
      'SHOW CREATE TABLE `' + props.node?.meta?.DatabaseName + '`.`' + props.node?.title + '`',
      []
    );
    createSQL.value = format(tableResp.data[0]['Create Table']);
  };

  loadTableInfo();
</script>

<style lang="less" scoped></style>
