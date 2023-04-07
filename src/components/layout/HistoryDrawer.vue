<template>
  <IceDrawer @hide="hide" :visible="visible">
    <template #title>
      SQL 历史<div class="icon-center"><IceIcon @click="clear" icon="clear" /></div>
    </template>
    <template #body>
      <div class="history-row" v-for="(history, index) in store.inverted">
        <div @click="copy(history.sql)" :title="history.error ?? history.sql" class="history-row-sql">
          <div class="elapsed" :class="history.flag ? 'success' : 'error'">{{ history.elapsed }}</div>
          <div class="statement">{{ history.sql }}</div>
        </div>
        <div class="history-row-date">{{ history.date.toLocaleString() }}</div>
      </div>
    </template>
  </IceDrawer>
</template>

<script lang="ts" setup>
  import { useHistoryStore } from '~/store/modules/history';
  import useClipboard from 'vue-clipboard3';
  import { notify } from '@kyvg/vue3-notification';

  const { toClipboard } = useClipboard();
  const store = useHistoryStore();

  interface CompProp {
    visible: boolean;
  }
  const props = withDefaults(defineProps<CompProp>(), { visible: false });

  const emit = defineEmits<{
    (e: 'update:visible', v: boolean): void;
  }>();

  const hide = () => {
    emit('update:visible', false);
  };
  const copy = (str: any) => {
    toClipboard(str);
    notify({
      title: '复制成功',
    });
  };

  const clear = () => {
    store.clear();
    notify({
      title: '日志历史已清理',
    });
  };
</script>

<style lang="less" scoped>
  @date_width: 108px;
  @elapsed-width: 24px;
  .history-row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    cursor: pointer;
    margin: 2px 0;
    .history-row-sql {
      width: calc(100% - @date_width);
      color: rgb(11, 96, 172);
      display: flex;
      justify-content: flex-start;

      .statement {
        padding: 0 6px;
        width: calc(100% - @elapsed-width);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .success {
        background-color: rgb(92, 194, 33);
      }
      .error {
        background-color: rgb(177, 28, 28);
      }
      .elapsed {
        color: #fff;
        padding: 2px 4px;
        font-size: 10px;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: @elapsed-width;
        min-width: @elapsed-width;
      }
    }
    .history-row-date {
      width: @date_width;
      color: rgb(102, 18, 77);
    }
  }

  .icon-center {
    display: flex;
    align-items: center;
    margin-left: 10px;
    color: #968f8f;
    &:hover {
      color: #2f7fda;
    }
  }
</style>
