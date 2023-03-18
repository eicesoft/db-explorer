<template>
  <div class="header">
    <div class="icon-list">
      <a-button-group>
        <a-tooltip :content="t('message.toolbar.addTip')">
          <a-button status="warning" size="mini">
            <template #icon><icon-plus /></template>
          </a-button>
        </a-tooltip>
      </a-button-group>

      <a-dropdown @select="selectLang" :popup-max-height="false">
        <a-button> {{ lang }} <icon-down /></a-button>
        <template #content>
          <a-doption value="zh">中文</a-doption>
          <a-doption value="en">英文</a-doption>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { IconPlus } from '@arco-design/web-vue/es/icon';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  const { t, locale: i18nLanguage } = useI18n();

  const lang = ref('zh');

  const selectLang = (val: any) => {
    lang.value = val;
    console.log(val);
    i18nLanguage.value = val; // zh en
    localStorage.setItem('sql-locale', val);
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
