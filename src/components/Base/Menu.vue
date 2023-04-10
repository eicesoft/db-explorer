<template>
  <div class="menu">
    <!--*@click="onShowMenu($event, menu.children)" -->
    <div v-for="(menu, index) in menus" class="menu-item"
      >{{ menu.title }}
      <!-- <Teleport to="body">
        <div class="sub-menu">
          <div v-for="(child, index) in menu.children"> {{ child.title }}</div>
        </div>
      </Teleport> -->
    </div>
  </div> </template
>nmmm

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { Menu, MenuKeys } from './menu';
  import ContextMenu from '@imengyu/vue3-context-menu';

  const emits = defineEmits<{
    (e: 'trigger', key: MenuKeys): void;
  }>();

  defineProps({
    menus: {
      type: Array as PropType<Menu[]>,
    },
  });

  const menuSelect = (value: MenuKeys) => {
    emits('trigger', value);
  };

  const onShowMenu = (e: any, children: Menu[]) => {
    let items = children.map((item: Menu) => {
      return {
        label: item.title,
        preserveIconWidth: false,
        disabled: item.disabled ? item.disabled() : false,
        onClick: () => {
          menuSelect(item.key ?? MenuKeys.Unknonw);
        },
      };
    });
    ContextMenu.showContextMenu({
      theme: 'win10 dark',
      x: e.x,
      y: e.y,
      zIndex: 1000,
      items: items,
    });
  };
</script>

<style lang="less" scoped>
  .menu {
    display: flex;
    user-select: none;
    height: 24px;
    margin-left: 8px;
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
