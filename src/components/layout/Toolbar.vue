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
          <a-button :disabled="status?.database == null" @click="clickBtn(ToolCommand.UserManager)" size="mini">
            <template #icon><icon-user-group :size="iconSize" /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip :content="t('message.toolbar.serverInfo')">
          <a-button :disabled="status?.database == null" @click="clickBtn(ToolCommand.ServerInfomation)" size="mini">
            <template #icon><icon-info-circle :size="iconSize" /></template>
          </a-button>
        </a-tooltip>
      </a-button-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { IconPlus, IconUserGroup, IconInfoCircle } from '@arco-design/web-vue/es/icon';
  import { ref, PropType } from 'vue';
  import { ToolCommand } from './tool';
  import { useI18n } from 'vue-i18n';
  import { StatusInfo } from './status';

  const props = defineProps({
    status: Object as PropType<StatusInfo>,
  });

  const { t } = useI18n();

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
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid #ececec;
    background-color: #fefefe;
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
