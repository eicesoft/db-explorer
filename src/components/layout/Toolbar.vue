<template>
  <div class="header">
    <div class="icon-list">
      <a-button-group>
        <a-tooltip :content="t('message.toolbar.addTip')">
          <a-button @click="clickBtn(ToolCommand.Add)" size="mini">
            <template #icon><icon-plus :size="iconSize" /></template>
          </a-button>
        </a-tooltip>
      </a-button-group>

      <a-button-group style="margin-left: 10px">
        <a-tooltip :content="t('message.toolbar.userManager')">
          <a-button :disabled="statusStore.serverName == null" @click="clickBtn(ToolCommand.UserManager)" size="mini">
            <template #icon><icon-user-group :size="iconSize" /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip :content="t('message.toolbar.serverInfo')">
          <a-button
            :disabled="statusStore.serverName == null"
            @click="clickBtn(ToolCommand.ServerInfomation)"
            size="mini"
          >
            <template #icon><icon-info-circle :size="iconSize" /></template>
          </a-button>
        </a-tooltip>

        <a-tooltip :content="t('message.toolbar.serverInfo')">
          <a-button :disabled="statusStore.serverName == null" @click="clickBtn(ToolCommand.ProcessList)" size="mini">
            <template #icon><icon-font type="icon-process" :size="iconSize" /></template>
          </a-button>
        </a-tooltip>
      </a-button-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { IconPlus, IconUserGroup, IconInfoCircle } from '@arco-design/web-vue/es/icon';
  import { ref } from 'vue';
  import { ToolCommand } from './tool';
  import { useI18n } from 'vue-i18n';
  import { Icon } from '@arco-design/web-vue';
  import { getImageRes } from '~/utils/res';
  import { useStatausStore } from '~/store/modules/status';

  const IconFont = Icon.addFromIconFontCn({
    src: getImageRes('iconfont/iconfont.js'),
  });

  const { t } = useI18n();
  const statusStore = useStatausStore();
  const iconSize = ref(18);

  const emit = defineEmits<{
    (e: 'trigger', key: ToolCommand): void;
  }>();

  const clickBtn = (key: ToolCommand) => {
    emit('trigger', key);
  };
</script>

<style lang="scss" scoped>
  .header {
    position: fixed;
    left: 0;
    top: 36px;
    z-index: 1000;
    border-bottom: 1px solid #ececec;
    background-color: #fafafa;
    height: 28px;
    line-height: 28px;
    color: #707070;
    width: 100%;
    user-select: none;
    .icon-list {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 28px;
      margin: 0 4px;
    }
  }
</style>
