<script setup lang="ts">
  import 'ag-grid-community/styles/ag-grid.css';
  import 'ag-grid-community/styles/ag-theme-balham.css';
  import { AgGridVue } from 'ag-grid-vue3';
  import { SimpleNode } from '~/components/ConnectManager/index';
  import { ref, computed, reactive, PropType, watch, nextTick } from 'vue';
  import Manager from '~/utils/link_manager';
  import DefaultRenderer from './render.js';
  import { FIELD_TYPE_MAP } from '~/utils/constants';
  import { format } from 'sql-formatter';
  import { useClipboard } from '@vueuse/core';
  import { IconCopy, IconInfoCircleFill, IconStar, IconThunderbolt } from '@arco-design/web-vue/es/icon';
  import { Notification } from '@arco-design/web-vue';
  import { getIconRes } from '~/utils/res';
  import { TableFields } from './table';
  import { useI18n } from 'vue-i18n';

  const manager: Manager = Manager.getInstance();
  let gridApi = reactive({});
  let gridColumnApi = reactive({});

  const props = defineProps({
    node: {
      type: Object as PropType<SimpleNode>,
    },
  });
  console.error('First show', props.node);

  const pageInfo = reactive({
    page: 1,
    page_size: 500,
  });
  const fields = ref([]);
  const rows = ref([]);
  const tableInfos = ref(null);
  const createSQL = ref('');
  const { text, copy, copied, isSupported } = useClipboard({ createSQL });
  const { t } = useI18n();

  const loadTableInfo = async () => {
    const conn = manager.get(props.node?.meta?.Param.serverKey);
    console.log('Load table info ' + pageInfo.page);

    const resp = await conn.query(
      'SHOW FULL FIELDS FROM `' + props.node.meta?.DatabaseName + '`.`' + props.node.title + '`',
      []
    );
    console.log(resp);
    tableInfos.value = resp.data;

    const tableResp = await conn.query(
      'SHOW CREATE TABLE `' + props.node.meta?.DatabaseName + '`.`' + props.node.title + '`',
      []
    );
    createSQL.value = format(tableResp.data[0]['Create Table']);
  };

  const loadPage = async () => {
    let start = (pageInfo.page - 1) * pageInfo.page_size;
    const conn = manager.get(props.node?.meta?.Param.serverKey);
    console.log('Load Page ' + pageInfo.page);

    const resp = await conn.query(
      'SELECT * FROM ' +
        props.node.meta?.DatabaseName +
        '.' +
        props.node.title +
        ' LIMIT ' +
        start +
        ',' +
        pageInfo.page_size,
      []
    );
    console.log(resp);

    fields.value = resp.fields;
    rows.value = resp.data;
    gridApi.setRowData(resp.data);
    nextTick(() => {
      autoResize();
    });
  };

  const columnDefs = computed(() => {
    return fields.value.map((item: any, index: any) => {
      let tip = '';
      tip += 'Type: ' + FIELD_TYPE_MAP[item.type] ?? item.type;
      if ((item.flags & 2) != 0) {
        if ((item.flags & 512) != 0) {
          tip += '  主键(A)';
        } else {
          tip += '  主键';
        }
      }
      let field: Record<string, any> = {
        headerName: item.name,
        headerTooltip: tip,
        field: item.name,
        width: 90,
        minWidth: 40,
        maxWidth: 200,
        editable: item.name == 'id' ? false : true,
        suppressMenu: true,
        sort: null,
        cellRenderer: 'DefaultRenderer',
      };

      if (index == 0) {
        //主键
        field.sort = 'asc';
        field.headerCheckboxSelection = true;
        field.checkboxSelection = true;
        field.showDisabledCheckboxes = true;
      }
      return field;
    });
  });

  const gridOptions = reactive({
    components: {
      DefaultRenderer: DefaultRenderer,
    },
    tooltipShowDelay: 500,
    defaultColDef: { flex: 1, sortable: false, resizable: true },
    // debounceVerticalScrollbar: true,
    suppressRowClickSelection: 'always',
    rowSelection: 'multiple',
  });

  const rowData = computed(() => {
    // console.warn(rows.value);
    return rows.value.map((item: any) => {
      return item;
    });
  });

  const rowValueChange = () => {
    console.log(arguments);
  };

  const autoResize = () => {
    const allColumnIds = [];
    gridColumnApi.getColumns().forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    gridColumnApi.autoSizeColumns(allColumnIds, false);
  };

  const onGridReady = (params: any) => {
    gridApi = params.api;
    gridColumnApi = params.columnApi;
    autoResize();
  };

  const isNext = computed(() => {
    if (rows.value.length == pageInfo.page_size) {
      return true;
    } else {
      return false;
    }
  });

  const previous = async () => {
    if (pageInfo.page != 1) {
      pageInfo.page--;
      await loadPage();
    }
  };

  const next = async () => {
    if (isNext) {
      pageInfo.page++;
      await loadPage();
    }
  };

  const onSelectionChanged = () => {};

  const copyData = () => {
    // const selectedNodes = gridApi.getSelectedNodes();
    // console.log(selectedNodes);
    const selectedRows = gridApi.getSelectedRows();

    let rows: string[] = [];
    selectedRows.forEach((element: any) => {
      let tab = [];
      for (let k in element) {
        tab.push(`"${element[k]}"`);
      }
      rows.push(tab.join('\t'));
    });
    console.log(rows.join('\n'));
  };

  const exportData = () => {
    gridApi.exportDataAsCsv();
  };

  watch(
    () => props.node,
    async () => {
      pageInfo.page = 1;
      await loadPage();
    },
    {
      immediate: true,
    }
  );

  const columns = ref(TableFields);

  const copySQL = () => {
    copy(createSQL.value);
    Notification.info({
      title: '复制成功',
      content: '',
    });
  };
  loadTableInfo();
</script>

<template>
  <div class="panel">
    <a-tabs size="mini" :position="'top'">
      <a-tab-pane key="data">
        <template #title>
          <img style="width: 8px; height: 8px" :src="getIconRes('table.png')" />{{
            t('message.tablepanel.data')
          }}</template
        >
        <div class="toolbar">
          <div></div>
          <div class="toolbar-right">
            <div :class="{ disable: pageInfo.page == 1 }" class="icon" @click="previous">◀</div>
            <input size="2" v-model="pageInfo.page" class="text-number" type="number" />
            <div :class="{ disable: !isNext }" class="icon" @click="next">▶</div>
          </div>
        </div>

        <ag-grid-vue
          v-contextmenu:contextmenu
          @grid-ready="onGridReady"
          @onRowValueChanged="rowValueChange"
          class="ag-theme-balham container"
          :gridOptions="gridOptions"
          :columnDefs="columnDefs"
          :rowData="rowData"
          @selection-changed="onSelectionChanged"
        >
        </ag-grid-vue>
      </a-tab-pane>
      <a-tab-pane key="info">
        <template #title> <IconInfoCircleFill />{{ t('message.tablepanel.info') }}</template>

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
      </a-tab-pane>
    </a-tabs>

    <!-- <v-contextmenu ref="contextmenu">
      <v-contextmenu-item>删除选择行</v-contextmenu-item>
      <v-contextmenu-divider />
      <v-contextmenu-item @click="copyData">复制数据</v-contextmenu-item>
      <v-contextmenu-item>复制为SQL</v-contextmenu-item>
      <v-contextmenu-item>复制全部</v-contextmenu-item>
      <v-contextmenu-divider />
      <v-contextmenu-item @click="exportData">导出数据</v-contextmenu-item>
    </v-contextmenu> -->
  </div>
</template>

<style lang="scss">
  .panel {
    .arco-tabs-content {
      padding-top: 0px !important;
    }
  }
</style>

<style lang="scss" scoped>
  :deep(.hljs) {
    border-radius: 6px;
    border: 1px solid #ececec;
  }
  .panel {
    height: calc(var(--bodyHeight) - 36px);
    width: var(--bodyWidth);
    .container {
      width: 100%;
      height: calc(var(--bodyHeight) - 36px - 28px - 32px);
    }
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
    .toolbar {
      height: 28px;
      line-height: 28px;
      display: flex;
      justify-content: space-between;
      background-color: rgb(245, 245, 245);
      .toolbar-right {
        display: flex;
        .disable {
          color: rgb(207, 207, 207);
          cursor: not-allowed;
        }
      }
    }
  }
</style>
