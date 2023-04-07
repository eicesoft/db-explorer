<template>
  <IceDialog
    width="500px"
    :visible="visible"
    @enter="handleOk"
    @close="handleOk"
    :buttons="DialogButton.Close"
    :title="t('message.dialog.status.title')"
  >
    <template #body>
      <IceInput class="search-text" :placeholder="t('message.base.filter')" v-model="searchKey" />
      <IceTable style="margin-top: 10px" :fields="columns" :datas="filter"></IceTable>
    </template>
  </IceDialog>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import Manager from '~/utils/link_manager';
  import { DialogButton } from '~/components/UI/dialog';

  const { t } = useI18n();

  const columns = computed(() => {
    return [
      {
        title: t('message.dialog.status.variableName'),
        dataIndex: 'Variable_name',
        ellipsis: true,
        tooltip: true,
      },
      {
        title: t('message.dialog.status.value'),
        dataIndex: 'Value',
        ellipsis: true,
        tooltip: true,
        width: 160,
      },
    ];
  });
  const manager: Manager = Manager.getInstance();

  const emit = defineEmits<{
    (e: 'update:visible', b: Boolean): void;
  }>();

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    serverKey: {
      type: String,
    },
  });

  const rows = ref([]);
  const searchKey = ref('');
  const filter = computed(() => {
    return rows.value.filter((item: any) => {
      return item.Variable_name.toLowerCase().indexOf(searchKey.value.toLowerCase()) != -1;
    });
  });

  watch(
    () => props.serverKey,
    async (newVal: any) => {
      if (newVal) {
        const conn = manager.get(newVal);
        let status = await conn.status();
        console.log(status);
        rows.value = status.data;
      }
    },
    { immediate: true }
  );

  const handleOk = () => {
    searchKey.value = '';
    emit('update:visible', false);
  };
</script>

<style lang="less" scoped>
  .search-text {
    height: 28px;
  }
</style>
