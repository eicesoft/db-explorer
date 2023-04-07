<template>
  <div class="statusbar">
    <div class="left-bar">
      <div class="info"> {{ statusStore.productName }} {{ statusStore.version }}</div>
      <div class="info" v-if="statusStore.serverName">
        {{ t('message.statusbar.server') }}: {{ statusStore.serverName }}</div
      >
      <div class="info" v-if="statusStore.database">
        {{ t('message.statusbar.database') }}: {{ statusStore.database }}</div
      >
      <div @click.stop="showHistory" class="info pointer"
        >{{ t('message.statusbar.history') }}: {{ historyStore.historys.length }}</div
      >
    </div>

    <div class="right-bar">
      <div class="info">
        <IceIcon @click="showStatus" class="icon-font pointer" icon="infomation" :size="18" />
      </div>
      <div class="info">
        <div class="icon-font pointer" @click="showLangs($event)">
          <IceIcon icon="yuyan-kong" :size="20" /> {{ statusStore.language }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { ToolCommand } from '~/components/layout/tool';
  import { useStatausStore } from '~/store/modules/status';
  import { useHistoryStore } from '~/store/modules/history';

  import ContextMenu from '@imengyu/vue3-context-menu';

  const emit = defineEmits<{
    (e: 'trigger', key: ToolCommand): void;
  }>();

  const { t, locale: i18nLanguage } = useI18n();
  const statusStore = useStatausStore();
  const historyStore = useHistoryStore();

  const selectLang = (val: any) => {
    statusStore.setLang(val);
    i18nLanguage.value = val; // zh en
    localStorage.setItem('sql-locale', val);
  };

  const showLangs = (e: any) => {
    ContextMenu.showContextMenu({
      theme: 'win10 dark',
      x: e.x,
      y: e.y,
      zIndex: 1000,
      items: [
        {
          label: (statusStore.language == 'zh' ? '*' : ' ') + '中文',
          onClick: () => {
            selectLang('zh');
          },
        },
        {
          label: (statusStore.language == 'en' ? '*' : ' ') + '英文',
          onClick: () => {
            selectLang('en');
          },
        },
      ],
    });
  };

  const showStatus = async () => {
    emit('trigger', ToolCommand.ServerInfomation);
  };

  const showHistory = () => {
    emit('trigger', ToolCommand.History);
  };
</script>

<style lang="less" scoped>
  .statusbar {
    position: fixed;
    left: 0;
    bottom: 2px;
    z-index: 1000;
    border-top: 1px solid #b3b6c9;
    background-color: #efefef;
    height: 28px;
    line-height: 28px;
    font-size: 11px;
    color: #2f3241;
    width: 100%;
    // padding: 0 10px;
    user-select: none;
    display: flex;
    justify-content: space-between;
    .info {
      // margin: 0 10px 0 0;
      padding: 0 10px 0 10px;
      border-right: 1px solid #ccdbfd;
      display: flex;
      align-items: center;
      height: 30px;
    }

    .left-bar {
      display: flex;
    }
    .right-bar {
      display: flex;
    }
  }
</style>
