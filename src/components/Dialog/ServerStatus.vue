<template>
  <a-modal
    modal-class="base-model"
    :mask="false"
    draggable
    hide-cancel
    ok-text="关闭"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleOk"
  >
    <template #title> {{ t('message.dialog.status.title') }} </template>

    <a-input-search class="search-text" :placeholder="t('message.base.filter')" size="mini" v-model="searchKey" />

    <a-table
      style="margin-top: 5px; overflow-x: hidden; overflow-x: auto"
      :virtual-list-props="{ height: 300 }"
      column-resizable
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

<style lang="scss" scoped></style>
