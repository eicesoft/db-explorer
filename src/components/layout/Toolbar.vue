<template>
  <div class="header">
    <div class="icon-list">
      <IceIconButton
        :title="t('message.toolbar.addTip')"
        @click.prevent="clickBtn(ToolCommand.Add)"
        icon="plus"
        :size="iconSize"
      />

      <div class="tool-group">
        <IceIconButton
          :title="t('message.toolbar.userManager')"
          :disabled="statusStore.serverName == null"
          @click.prevent="clickBtn(ToolCommand.UserManager)"
          icon="user-group"
          is-divider
          :size="iconSize"
        />

        <IceIconButton
          :title="t('message.toolbar.serverInfo')"
          :disabled="statusStore.serverName == null"
          @click.prevent="clickBtn(ToolCommand.ServerInfomation)"
          icon="infomation"
          is-divider
          :size="iconSize"
        />

        <IceIconButton
          :title="t('message.toolbar.serverInfo')"
          :disabled="statusStore.serverName == null"
          @click.prevent="clickBtn(ToolCommand.ProcessList)"
          icon="process"
          :size="iconSize"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { ToolCommand } from './tool';
  import { useI18n } from 'vue-i18n';
  import { useStatausStore } from '~/store/modules/status';

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

<style lang="less" scoped>
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
      .tool-group {
        display: flex;
        margin-left: 10px;
      }
    }
  }
</style>
