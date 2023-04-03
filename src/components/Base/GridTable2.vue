<template>
  <hot-table ref="hotTableComponent" :settings="mergeSetting"></hot-table>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { HotTable } from '@handsontable/vue3';
  import Handsontable from 'handsontable';
  import { timeRenderer, TIME_RENDERER } from 'handsontable/renderers/index';
  import Core from 'handsontable/core';
  import { CellProperties } from 'handsontable/settings';

  import { registerAllModules } from 'handsontable/registry';
  import 'handsontable/dist/handsontable.full.css';
  import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';

  import { Column } from './grid';

  function customRenderer(
    instance: Core,
    td: HTMLTableCellElement,
    row: number,
    col: number,
    prop: string | number,
    value: any,
    cellProperties: CellProperties
  ) {
    let columnMeta = props.columns[col];
    if (value) {
      if (columnMeta.type == 'date') {
        td.classList.add('cell-value-date');
        td.innerHTML = `<span">${value}</span>`;
      } else if (columnMeta.type == 'dropdown') {
        td.classList.add('cell-value-string');
        td.innerHTML = `<span">${value} * </span>`;
      } else {
        if (typeof value == 'number') {
          td.classList.add('cell-value-number');
          td.innerHTML = `<span >${value}</span>`;
        } else if (typeof value == 'boolean') {
          td.classList.add('cell-value-boolean');
          td.innerHTML = `<span >${value}</span>`;
        } else {
          td.classList.add('cell-value-string');
          td.innerHTML = `<span >${value}</span>`;
        }
      }
    } else {
      td.classList.add('cell-value-null');
      td.innerHTML = '<span class="cell-value-null">null</span>';
    }
    // Handsontable.renderers.TextRenderer.apply(this, arguments);
  }

  Handsontable.renderers.registerRenderer('custome', customRenderer);
  registerAllModules();
  registerLanguageDictionary(zhCN);

  let changeData: Record<string, any> = {};

  const props = defineProps({
    setting: {
      type: Object,
      default() {
        return {};
      },
    },
    datas: {
      type: Array<any>,
    },
    columns: {
      type: Array<Column>,
      default() {
        return [];
      },
    },
  });

  watch(
    () => props.datas,
    (newVal) => {
      hotTableComponent.value.hotInstance.loadData(newVal);
    }
  );

  const hotTableComponent = ref();

  const rows = computed(() => {
    if (props.datas) {
      return props.datas;
    } else {
      return null;
    }
  });

  const calcColumns = computed(() => {
    if (props.columns) {
      return props.columns.flatMap((item: Column) => {
        if (item.type == 'date') {
          item.datePickerConfig = {
            i18n: {
              previousMonth: '上个月',
              nextMonth: '下个月',
              months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
              weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
              weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
            },
          };
        }

        if (!item.renderer) {
          item.renderer = 'custome';
        }
        // delete item['title'];
        return item;
      });
    } else {
      return [];
    }
  });

  const mergeSetting = computed(() => {
    return {
      licenseKey: 'non-commercial-and-evaluation',
      language: zhCN.languageCode,
      locale: zhCN.languageCode,
      rowHeaders: true,
      customBorders: true,
      // dropdownMenu: true,
      autoColumnSize: { syncLimit: 300 },
      multiColumnSorting: true,
      manualColumnResize: true,
      stretchH: 'all',
      autoWrapRow: false,
      rowHeaderWidth: 40,
      // filters: true,
      manualRowMove: true,
      manualRowResize: true,
      undo: true,
      rowHeights: 24,
      fillHandle: false,
      // contextMenu: {
      //   callback(key: any, selection: any[], clickEvent: Event) {
      //     // Common callback for all options
      //     console.log(key, selection, clickEvent);
      //   },
      //   items: {
      //     copy: {
      //       name: '复制',
      //       submenu: {
      //         items: [
      //           {
      //             key: 'copy:value',
      //             name: '复制值',
      //           },
      //           {
      //             key: 'copy:row',
      //             name: '复制行',
      //           },
      //           {
      //             key: 'copy:all',
      //             name: '复制全部',
      //           },
      //         ],
      //       },
      //     },
      //     sp1: '---------',
      //     row_below: 'row_below',
      //     remove_row: 'remove_row',
      //     sp2: '---------',

      //     export: {
      //       name: '导出',
      //       submenu: {
      //         items: [
      //           {
      //             // Key must be in the form 'parent_key:child_key'
      //             key: 'export:csv',
      //             name: '导出 CSV',
      //           },
      //           {
      //             // Key must be in the form 'parent_key:child_key'
      //             key: 'export:sql',
      //             name: '导出 SQL',
      //           },
      //         ],
      //       },
      //     },
      //   },
      // },

      colHeaders(col: number) {
        const column = calcColumns.value[col];
        // console.error(column.desc || column.label);
        return '<b title="' + (column.desc || column.label) + '">' + column.label + '</b>';
      },
      columns: calcColumns.value,
      ...props.setting,
    };
  });
</script>

<style lang="scss" scoped></style>
