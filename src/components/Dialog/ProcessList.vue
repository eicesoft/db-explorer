<template>
  <IceDialog
    width="800px"
    :visible="visible"
    @enter="handleEnter"
    @close="handleOk"
    :buttons="DialogButton.Close"
    :title="t('message.dialog.processlist.title')"
  >
    <template #title> {{ t('message.dialog.processlist.title') }}({{ rows.length }}) </template>

    <template #body>
      <IceInput style="height: 26px" :placeholder="t('message.base.filter')" v-model="searchKey" />

      <IceTable style="margin-top: 10px" :fields="columns" :datas="filter"></IceTable>
    </template>
  </IceDialog>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { DialogButton } from '~/components/UI/dialog';

  import Manager from '~/utils/link_manager';
  const { t } = useI18n();

  const columns = computed(() => {
    return [
      {
        title: 'Id',
        dataIndex: 'Id',
        ellipsis: true,
        tooltip: true,
        width: 100,
        sort: true,
      },
      {
        title: 'Info',
        dataIndex: 'Info',
        ellipsis: true,
        tooltip: true,
        width: 160,
      },
      {
        title: 'User',
        dataIndex: 'User',
        ellipsis: true,
        tooltip: true,
        width: 120,
      },
      {
        title: 'Host',
        dataIndex: 'Host',
        ellipsis: true,
        tooltip: true,
        width: 160,
      },
      {
        title: 'Db',
        dataIndex: 'db',
        ellipsis: true,
        tooltip: true,
        width: 100,
      },
      {
        title: 'Command',
        dataIndex: 'Command',
        tooltip: true,
        width: 90,
      },
      {
        title: 'Time',
        dataIndex: 'Time',
        tooltip: true,
        width: 80,
      },
      {
        title: 'State',
        dataIndex: 'State',
        ellipsis: true,
        tooltip: true,
        width: 120,
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
      return (
        new String(item.User).toLocaleLowerCase().indexOf(searchKey.value.toLocaleLowerCase()) != -1 ||
        new String(item.Id).toLocaleLowerCase().indexOf(searchKey.value.toLocaleLowerCase()) != -1 ||
        new String(item.db).toLocaleLowerCase().indexOf(searchKey.value.toLocaleLowerCase()) != -1 ||
        new String(item.Host).toLocaleLowerCase().indexOf(searchKey.value.toLocaleLowerCase()) != -1 ||
        new String(item.Info).toLocaleLowerCase().indexOf(searchKey.value.toLocaleLowerCase()) != -1
      );
    });
  });

  watch(
    () => props.serverKey,
    async (newVal: any) => {
      if (newVal) {
        const conn = manager.get(newVal);
        let processList = await conn.processList();
        // console.log(processList);
        rows.value = processList.data;
      }
    },
    { immediate: true }
  );

  const handleOk = (button: any) => {
    console.log(button);
    searchKey.value = '';
    emit('update:visible', false);
  };

  const handleEnter = (button: any) => {
    // searchKey.value = '';
    // emit('update:visible', false);
    emit('update:visible', false);
  };
</script>

<style lang="less"></style>
