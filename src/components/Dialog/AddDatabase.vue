<template>
  <IceDialog
    width="500px"
    :visible="visible"
    @enter="handleOk"
    @close="handleCancel"
    :buttons="DialogButton.Ok | DialogButton.Cancel"
    title="添加数据库"
  >
    <template #body>
      <!-- {{ collations }} -->
      <div class="from-row">
        <div class="label">数据库名称: </div>
        <div class="value"><IceInput v-model="form.datanbaseName" style="width: 100%" /></div>
      </div>
      <div class="from-row">
        <div class="label">Collation:</div>
        <div class="value">
          <IceSelect
            v-model="form.collation"
            :options="
              collations.map((item) => {
                return { label: item.COLLATION_NAME, value: item.COLLATION_NAME };
              })
            "
            :select="collation_server"
          />
        </div>
      </div>
    </template>
  </IceDialog>
</template>

<script lang="ts" setup>
  import { DialogButton } from '~/components/UI/dialog';
  import Manager from '~/utils/link_manager';
  import { computed, ref, watch, reactive } from 'vue';
  import { useStatausStore } from '~/store/modules/status';
  const statusStore = useStatausStore();

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    serverKey: {
      type: String,
    },
  });

  const collations = ref([]);
  const form = reactive({
    collation: '',
    datanbaseName: '',
  });

  const variables = ref({});
  watch(
    () => props.visible,
    async (newVal: any) => {
      if (newVal) {
        const conn = manager.get(statusStore.serverName);
        let resp = await conn.getCollations();
        collations.value = resp.data;

        resp = await conn.showVariables();
        variables.value = resp;
      }
    },
    { immediate: true }
  );

  const emit = defineEmits<{
    (e: 'update:visible', b: Boolean): void;
  }>();

  const manager: Manager = Manager.getInstance();
  const collation_server = computed(() => {
    if (variables.value['collation_server']) {
      return variables.value['collation_server'];
    } else {
      return null;
    }
  });
  const handleOk = async () => {
    const conn = manager.get(statusStore.serverName);
    let resp = await conn.createDatabase(form.datanbaseName, form.collation);
    console.log(resp);
    emit('update:visible', false);
  };
  const handleCancel = () => {
    emit('update:visible', false);
  };
</script>

<style lang="less" scoped></style>
