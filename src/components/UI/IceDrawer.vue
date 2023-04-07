<template>
  <Teleport to="body">
    <div :style="styleVars" class="ice-drawer" v-if="visible">
      <div v-if="title != ''" class="ice-drawer-header">
        <div class="ice-drawer-title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div class="ice-drawer-title-right">
          <slot name="tools"></slot>
          <div @click="hide" class="ice-drawer-close"><IceIcon :size="16" icon="close" /></div> </div
      ></div>
      <div class="ice-drawer-container"><slot name="body"></slot></div>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
  import { onMounted, onUnmounted, computed } from 'vue';

  interface CompProp {
    visible: boolean;
    title?: string;
    height?: string;
    listenOuter?: boolean;
  }

  const props = withDefaults(defineProps<CompProp>(), { visible: false, height: '200px', listenOuter: false });

  const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void;
    (e: 'hide'): void;
  }>();

  const styleVars = computed(() => {
    return {
      '--drawer-height': props.height,
    };
  });

  const testEle = (ele: HTMLElement): boolean => {
    // console.log(ele);
    if (ele.classList.contains('ice-drawer')) {
      return true;
    } else {
      if (ele.parentElement) {
        if (ele.parentElement.tagName == 'BODY') {
          return false;
        } else {
          return testEle(ele.parentElement);
        }
      } else {
        return false;
      }
    }
  };

  const closeListener = (evt: any) => {
    if (props.visible && props.listenOuter) {
      if (!testEle(evt.target)) {
        console.log('update:visible');

        emit('update:visible', false);
      }
    }
  };

  const hide = () => {
    emit('update:visible', false);
    emit('hide');
  };

  onMounted(() => {
    document.addEventListener('click', closeListener);
  });

  onUnmounted(() => {
    document.removeEventListener('click', closeListener);
  });
</script>

<style lang="less" scoped>
  .ice-drawer {
    position: fixed;
    display: block;
    left: 0;
    background-color: #ffffff;
    z-index: 1000;
    bottom: 30px;
    width: 100%;
    border-top: 1px solid #ececec;
    .ice-drawer-header {
      font-size: 12px;
      height: 24px;
      line-height: 24px;
      background-color: #fafafa;
      padding: 0 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 2px 1px #eeeeee;
      font-weight: 800;
      .ice-drawer-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .ice-drawer-title-right {
          display: flex;
          justify-content: space-between;
        }
      }
      .ice-drawer-close {
        display: flex;
        align-items: center;
      }
    }
    .ice-drawer-container {
      padding: 4px;
      height: var(--drawer-height);
      overflow-y: auto;
    }
  }
</style>
