<template>
  <table :style="{ height: height }" class="ice-table">
    <thead>
      <tr>
        <template v-for="(field, index) in fields">
          <th :style="{ width: field.width + 'px' ?? 'auto' }"> {{ field.title }}</th>
        </template>
      </tr>
    </thead>
    <tbody :style="{ height: height }">
      <template :key="index" v-for="(data, index) in datas">
        <tr>
          <template :key="index + '-' + i" v-for="(field, i) in fields">
            <td
              :style="{ width: field.width + 'px' ?? 'auto', textAlign: field.center ? 'center' : 'left' }"
              :title="data[field.dataIndex]"
            >
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
    width: string;
    center?: boolean;
  }

  interface CompProp {
    fields?: Field[];
    datas?: Array<Record<string, any>>;
    height?: string;
  }
  withDefaults(defineProps<CompProp>(), { height: '200px', center: false });
</script>

<style lang="less" scoped>
  @border: 1px solid #cccccc;
  @header_bg_color: #efefef;
  .ice-table {
    border-top: @border;
    border-left: @border;
    border-collapse: collapse;
    border-spacing: 0px;
    // width: calc(100% - 8px);
    thead {
    }
    tbody {
      overflow: auto;
    }
    tr {
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
