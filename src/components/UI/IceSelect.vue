<template>
  <select class="ice-select" v-model="modelValue">
    <option class="ice-select-option" :selected="option.label == select" v-for="option in options" :value="option.value"
      >{{ option.label }}
    </option>
  </select>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  interface Option {
    label: string;
    value: string | number;
  }
  interface CompProp {
    options: Option[];
    select?: string | number;
  }

  defineProps<CompProp>();

  const modelValue = ref();
</script>

<style lang="less" scoped>
  .ice-select {
    border: 1px solid #efefef;
    border-radius: 2px;
    background-color: #efefef;
    height: 26px;
    line-height: 26px;
    outline: none;

    .ice-select-option {
      height: 24px;
      line-height: 24px;
    }
  }
</style>
