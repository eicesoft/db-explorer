<script setup lang="ts">
  import { UseVirtualList } from '@vueuse/components';

  //   import { computed, watch, ref, toRefs } from 'vue';
  const props = defineProps({
    rows: Array,
    fields: Array,
  });
</script>

<template>
  <div class="table">
    <div class="tr">
      <div class="th tr-cell" v-for="(field, index) in fields">{{ field.name }}</div>
    </div>

    <UseVirtualList :list="rows" :options="{ itemHeight: 16, overscan: 10 }" height="300px">
      <template #="props">
        <div class="tr">
          <div :contenteditable="field.type == 8 ? false : true" class="td tr-cell" v-for="(field, index) in fields">{{
            props.data[field.name] ?? ''
          }}</div>
        </div>
      </template>
    </UseVirtualList>
  </div>
</template>

<style lang="scss" scoped>
  .table {
    margin: 8px;
    display: table;
    border-collapse: collapse;
    .tr {
      display: table-row;

      .tr-cell {
        padding: 2px 4px;
        font-size: 11px;
        border: 1px solid rgb(201, 201, 201);
        display: table-cell;
      }
      .th {
        background: #efefef;
        max-width: 240px;
        min-width: 32px;
        cursor: default;
      }
      .td {
        overflow: hidden;
        max-width: 240px;
        min-width: 32px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
</style>
