<template>
  <table class="ice-table">
    <thead>
      <tr>
        <template v-for="(field, index) in fields">
          <th> {{ field.title }}</th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template :key="index" v-for="(data, index) in datas">
        <tr>
          <template :key="index + '-' + i" v-for="(field, i) in fields">
            <td :title="data[field.dataIndex]">
              <slot :field="field" :row="data" :value="data[field.dataIndex]" :name="field.dataIndex">
                {{ data[field.dataIndex] }}
              </slot>
            </td>
          </template>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
  interface Field {
    title: string;
    dataIndex: string;
  }

  interface CompProp {
    fields?: Field[];
    datas: Record<string, any>;
  }
  defineProps<CompProp>();
</script>

<style lang="less" scoped>
  @border: 1px solid #cccccc;
  @header_bg_color: #efefef;
  .ice-table {
    // width: calc(100% - 2px);
    border-top: @border;
    border-left: @border;
    border-collapse: collapse;
    user-select: text;
    border-spacing: 0px;
    width: calc(100% - 8px);
    thead {
      width: calc(100% + 8px);
    }
    tbody {
      display: block;
      width: calc(100% + 8px);
      height: 200px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    tr {
      //   border: @border;
      box-sizing: border-box;
      table-layout: fixed;
      display: table;
      border-collapse: collapse;
      width: 100%;

      &:nth-child(even) {
        background-color: #f8f8f8;
      }

      &:hover {
        background-color: #f8f8f8;
      }
      td {
        border-right: @border;
        border-bottom: @border;
        // text-align: center;
        font-size: 12px;
        padding: 2px 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      th {
        font-size: 12px;
        text-align: center;
        font-weight: bold;
        padding: 4px;

        border-right: @border;
        border-bottom: @border;
        background-color: @header_bg_color;
      }
    }
  }
</style>
