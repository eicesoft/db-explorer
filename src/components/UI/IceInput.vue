<template>
  <div class="input-item">
    <input
      @keydown.enter="doSearch"
      :style="{ width: '100%' }"
      :placeholder="placeholder"
      class="text-input"
      v-model="newValue"
      type="text"
    />

    <div class="clearable"> <IceIcon :size="16" icon="close" /> </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  const props = defineProps({
    modelValue: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    isClearable: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits<{
    (e: 'search'): void;
    (e: 'update:modelValue', val: string): void;
  }>();

  const doSearch = (evt: any) => {
    emits('search');
  };

  const newValue = computed({
    get() {
      return props.modelValue;
    },
    set(value: any) {
      emits('update:modelValue', value);
    },
  });
</script>

<style lang="less" scoped>
  .input-item {
    position: relative;
    height: 100%;
    &:hover {
      .clearable {
        visibility: inherit;
      }
    }

    .text-input {
      outline: none;
      border: 1px solid #efefef;
      height: calc(100% - 6px);
      padding: 0 8px;
      margin: auto;
      border-radius: 2px;
      background-color: #efefef;
      font-size: 12px;
      &:hover {
        background-color: #e4e4e4;
        border: 1px solid #eeeeee;
      }

      &:focus {
        background-color: #fff;
        border: 1px solid #cccccc;
      }
    }

    .clearable {
      position: absolute;
      right: -8px;
      top: 4px;
      z-index: 1000;
      cursor: pointer;
      border-radius: 12px;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      width: 20px;
      text-align: center;
      // visibility: hidden;
      &:hover {
        background-color: rgb(243, 243, 243);
      }
    }
  }
</style>
