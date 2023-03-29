<template>
  <div class="menu">
    <a-dropdown class="menu-drop" @select="menuSelect" v-for="(menu, index) in menus">
      <div class="menu-item">{{ menu.title }}</div>
      <template #content>
        <a-doption
          :disabled="child.disabled && child.disabled()"
          :value="child.key"
          v-for="(child, index) in menu.children"
          >{{ child.title }}</a-doption
        >
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { Menu, MenuKeys } from './menu';

  const emits = defineEmits<{
    (e: 'trigger', key: MenuKeys): void;
  }>();

  defineProps({
    menus: {
      type: Array as PropType<Menu[]>,
    },
  });

  const menuSelect = (value: MenuKeys, evt: any) => {
    emits('trigger', value);
  };
</script>
<style lang="less">
  .menu-drop {
    .arco-dropdown-option-active,
    .arco-dropdown-option:not(.arco-dropdown-option-disabled):hover {
      // background-color: #e8f1fc !important;
    }
  }
</style>

<style lang="less" scoped>
  .menu {
    display: flex;
    user-select: none;
    height: 24px;
    line-height: 24px;

    .menu-item {
      cursor: pointer;
      //   margin: 0 6px;
      padding: 0 6px;
      min-width: 32px;
      text-align: center;
      border-radius: 2px;
      &:hover {
        color: #a1adc7;
        background-color: #404458;
      }
    }
  }
</style>
