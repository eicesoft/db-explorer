<template>
  <ag-grid-vue
    @grid-ready="onGridReady"
    class="ag-theme-balham container"
    :gridOptions="gridOptions"
    :columnDefs="columnDefs"
    :rowData="rows"
  >
  </ag-grid-vue>
</template>

<script lang="ts" setup>
  import 'ag-grid-community/styles/ag-grid.css';
  import 'ag-grid-community/styles/ag-theme-balham.css';
  import { GridOptions, GridApi, ColumnApi } from 'ag-grid-community';
  import { AgGridVue } from 'ag-grid-vue3';
  import { ref, computed } from 'vue';
  import DefaultRenderer from './render.js';
  import { FIELD_TYPE_MAP } from '~/utils/constants';

  const props = defineProps({
    fields: Array,
    rows: Array,
  });

  let gridApi = ref<GridApi | null>(null);
  let gridColumnApi = ref<ColumnApi | null>(null);

  const gridOptions = ref<GridOptions>({
    components: {
      DefaultRenderer: DefaultRenderer,
    },
    tooltipShowDelay: 500,
    defaultColDef: { flex: 1, sortable: false, resizable: true },
    // debounceVerticalScrollbar: true,
    suppressRowClickSelection: true,
    rowSelection: 'multiple',
  });

  const columnDefs = computed(() => {
    return props.fields?.map((item: any, index: any) => {
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
        minWidth: 60,
        maxWidth: 240,
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

  const autoResize = () => {
    const allColumnIds: any[] = [];
    if (gridColumnApi.value != null) {
      gridColumnApi.value?.getColumns()?.forEach((column: any) => {
        allColumnIds.push(column.getId());
      });
      gridColumnApi.value.autoSizeColumns(allColumnIds, false);
    }
  };

  const copyData = () => {
    const selectedRows = gridApi.value?.getSelectedRows();

    let rows: string[] = [];
    selectedRows?.forEach((element: any) => {
      let tab = [];
      for (let k in element) {
        tab.push(`"${element[k]}"`);
      }
      rows.push(tab.join('\t'));
    });
    console.log(rows.join('\n'));
  };

  const exportData = () => {
    gridApi.value?.exportDataAsCsv();
  };

  const onGridReady = (params: any) => {
    gridApi = params.api;
    gridColumnApi = params.columnApi;
    autoResize();
  };
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: calc(var(--bodyHeight) - 38px - 36px - 28px - 32px);
  }
</style>
