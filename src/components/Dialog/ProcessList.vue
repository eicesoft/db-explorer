<template>
  <a-modal
    width="800px"
    modal-class="base-model"
    :mask="false"
    :maskClosable="false"
    renderToBody
    draggable
    hide-cancel
    ok-text="关闭"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleOk"
  >
    <template #title> {{ t('message.dialog.processlist.title') }} </template>

    <a-input-search class="search-text" :placeholder="t('message.base.filter')" size="mini" v-model="searchKey" />

    <a-table
      style="margin-top: 5px; overflow-x: hidden; overflow-x: auto"
      :virtual-list-props="{ height: 300 }"
      :pagination="false"
      size="mini"
      :columns="columns"
      :data="filter"
    >
    </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
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
      //   console.log(
      //     item.User.indexOf(searchKey.value) != -1 ||
      //       item.Id.toString().indexOf(searchKey.value) != -1 ||
      //       item.db.indexOf(searchKey.value) != -1 ||
      //       item.Host.indexOf(searchKey.value) != -1
      //   );
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

  const handleOk = () => {
    searchKey.value = '';
    emit('update:visible', false);
  };
</script>

<style lang="scss"></style>
