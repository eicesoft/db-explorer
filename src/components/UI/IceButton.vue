<template>
  <button @click="clickHandler" :class="className">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
  //   import { ButtonProp } from './index';
  import { computed } from 'vue';
  const emits = defineEmits<{
    (e: 'click', evt: any, callback: any): any;
  }>();

  interface ButtonProp {
    type?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  }

  const props = withDefaults(defineProps<ButtonProp>(), {
    type: 'default',
  });

  const className = computed(() => {
    return `ice-${props.type}-button ice-button`;
  });

  const clickHandler = (evt: any) => {
    emits('click', evt, (evt: any, result: any) => {
      console.log(result);
    });
  };
</script>

<style lang="less" scoped>
  .ice-button {
    border: none;
    outline: none;
    padding: 0px 24px;
    min-width: 30px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    border-radius: 3px;
    cursor: pointer;
    text-align: center;
    user-select: none;
    vertical-align: bottom;
    &:active {
      outline: none;
    }
  }
  .ice-default-button {
    background-color: #d6d6d6;
    display: inline-block;
    &:hover {
      background-color: #e7e7e7;
    }
    &:active {
      background-color: #b6b6b6;
    }
  }

  .ice-primary-button {
    background-color: #165dff;
    color: #fff;
    display: inline-block;
    &:hover {
      background-color: #4080ff;
    }
    &:active {
      background-color: #0e42d2;
    }
  }
</style>
