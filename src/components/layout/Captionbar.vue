<template>
  <div class="caption-title">
    <div class="title-icon"><img class="icon-img" :src="iconImg" /></div>
    <Menu @trigger="menuTrigger" :menus="menus" />
    <div class="title">{{ title }}</div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { MenuKeys } from '../Base/menu';
  import { useI18n } from 'vue-i18n';
  import { getImageRes } from '~/utils/res';

  const iconImg = getImageRes('icon.png');
  const { t } = useI18n();
  const { ipcRenderer } = require('electron');

  defineProps({
    title: { type: String, default: 'SQL Explorer' },
  });

  const menus = computed(() => {
    return [
      {
        title: t('message.menus.system'),
        children: [
          {
            title: t('message.menus.addConnect'),
            key: MenuKeys.NewConnection,
            children: [],
          },
          {
            title: t('message.menus.loadFile'),
            key: MenuKeys.LoadFile,
            children: [],
          },
        ],
      },
      {
        title: t('message.menus.edit'),
        children: [{ title: t('message.menus.refresh'), key: MenuKeys.Refresh, children: [] }],
      },
      {
        title: t('message.menus.database'),
        children: [{ title: t('message.menus.createDatabase'), key: MenuKeys.NewDatabase, children: [] }],
      },
      {
        title: t('message.menus.tool'),
        children: [{ title: t('message.menus.option'), key: MenuKeys.Option, children: [] }],
      },
      {
        title: t('message.menus.help'),
        children: [{ title: t('message.menus.about'), key: MenuKeys.About, children: [] }],
      },
    ];
  });

  const menuTrigger = (key: MenuKeys) => {
    console.log(key);
    switch (key) {
      case MenuKeys.About:
        ipcRenderer.invoke('about');
        break;
      case MenuKeys.LoadFile:
        ipcRenderer.invoke('open_file');
        break;
    }
  };
</script>

<style lang="less" scoped>
  @menuBackColor: #2f3241;
  @menuColor: #ccdbfd;
  .title-icon {
    display: flex;
    align-items: center;
    app-region: drag;
    -webkit-app-region: drag;
    .icon-img {
      height: 18px;
      width: 18px;
    }
  }
  .caption-title {
    display: flex;
    align-items: center;
    height: 36px;
    line-height: 36px;
    padding: 0 15px;
    background-color: @menuBackColor;
    color: @menuColor;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    width: 100%;
    font-size: 12px;

    .title {
      user-select: none;
      app-region: drag;
      -webkit-app-region: drag;
      width: 65%;
      text-align: center;
    }
  }
</style>
