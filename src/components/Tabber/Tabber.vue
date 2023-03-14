<script setup lang="ts">
  import { Tab, TabType } from './index';

  defineProps({
    tabs: { type: Array<Tab> },
  });
</script>

<template>
  <div class="tabber">
    <div class="tab" v-for="(tab, index) in tabs">
      {{ tab.title }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
  $border-color: #ececec;
  .tabber {
    display: flex;
    height: 30px;
    align-items: flex-end;
    justify-content: flex-start;
    font-size: 12px;
    .tab {
      height: 24px;
      line-height: 24px;
      border-top: 1px solid $border-color;
      border-right: 1px solid $border-color;
      border-left: 1px solid $border-color;
      min-width: 50px;
      text-align: center;
    }
  }
</style>
