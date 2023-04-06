<template>
  <div class="input-item">
    <input @keydown.enter="doSearch" :placeholder="placeholder" class="text-input" v-model="newValue" :type="type" />

    <div v-if="isClearable" @click="clear" class="clearable min-button"> <IceIcon :size="16" icon="close" /> </div>
    <!-- <div @click="clear" class="clearable2 min-button"> <IceIcon :size="16" icon="close" /> </div> -->
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  interface CompProp {
    modelValue: string | number;
    type?: string;
    placeholder?: string;
    isClearable?: boolean;
  }
  const props = withDefaults(defineProps<CompProp>(), {
    modelValue: '',
    type: 'text',
    placeholder: '',
    isClearable: false,
  });

  const emits = defineEmits<{
    (e: 'search'): void;
    (e: 'update:modelValue', val: string): void;
  }>();

  const doSearch = (evt: any) => {
    emits('search');
  };

  const clear = (evt: any) => {
    emits('update:modelValue', '');
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
    // width: calc(100% - 16px);
    &:hover {
      .clearable {
        visibility: inherit;
      }
    }

    .text-input {
      position: relative;
      outline: none;
      border: 1px solid #efefef;
      width: calc(100% - 16px);
      height: calc(100% - 4px);
      padding: 2px 8px;
      margin: auto;
      border-radius: 2px;
      background-color: #efefef;
      font-size: 12px;
      &:hover {
        border: 1px solid #bbcef8;
        background-color: #fefefe;
      }

      &:focus {
        background-color: #fff;
        border: 1px solid #6895f7;
      }
    }

    .min-button {
      display: flex;
      position: absolute;
      z-index: 1000;
      cursor: pointer;
      // border-radius: 12px;
      height: 100%;
      align-items: center;
      justify-content: center;
      &:hover {
        color: #6895f7;
        // background-color: rgb(243, 243, 243);
      }
    }

    .clearable {
      right: 2px;
      top: 0;
      // visibility: hidden;
    }
    .show-password {
      right: 10px;
      top: 4px;
      // visibility: hidden;
    }
  }
</style>
