<template>
  <div class="statusbar">
    <div class="left-bar">
      <div class="info"> MySQL Explorer {{ status?.version }}</div>
      <div class="info" v-if="status?.serverName"> {{ t('message.statusbar.server') }}: {{ status.serverName }}</div>
      <div class="info" v-if="status?.database"> {{ t('message.statusbar.database') }}: {{ status.database }}</div>
      <div class="info">{{ t('message.statusbar.history') }}: {{ status?.queryCount }}</div>
    </div>

    <div class="right-bar">
      <div class="info">
        <icon-font @click="showStatus" class="icon-font pointer" type="icon-infomation" :size="20"
      /></div>
      <div class="info">
        <a-dropdown @select="selectLang" :popup-max-height="false">
          <div class="icon-font pointer"> <icon-font type="icon-yuyan-kong" :size="20" /> {{ lang }} </div>
          <template #content>
            <a-doption value="zh">中文(zh)</a-doption>
            <a-doption value="en">英文(en)</a-doption>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Icon } from '@arco-design/web-vue';
  import { PropType, ref } from 'vue';
  import { getImageRes } from '~/utils/res';
  import { StatusInfo } from './status';
  import { useI18n } from 'vue-i18n';
  import { ToolCommand } from '~/components/layout/tool';

  const props = defineProps({
    status: Object as PropType<StatusInfo>,
  });
  const emit = defineEmits<{
    (e: 'trigger', key: ToolCommand): void;
  }>();

  const IconFont = Icon.addFromIconFontCn({
    src: getImageRes('iconfont/iconfont.js'),
  });
  const { t, locale: i18nLanguage } = useI18n();

  const lang = ref(props.status?.language);

  const selectLang = (val: any) => {
    lang.value = val;
    i18nLanguage.value = val; // zh en
    localStorage.setItem('sql-locale', val);
  };

  const showStatus = async () => {
    emit('trigger', ToolCommand.ServerInfomation);
  };
</script>

<style lang="scss" scoped>
  .statusbar {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1000;
    border-top: 1px solid #ececec;
    background-color: #fefefe;
    height: 28px;
    line-height: 28px;
    font-size: 11px;
    color: #707070;
    width: 100%;
    // padding: 0 10px;
    user-select: none;
    display: flex;
    justify-content: space-between;
    .info {
      // margin: 0 10px 0 0;
      padding: 0 10px 0 10px;
      border-right: 1px solid #ececec;
      display: flex;
      align-items: center;
    }

    .left-bar {
      display: flex;
    }
    .right-bar {
      display: flex;
    }
  }
</style>
