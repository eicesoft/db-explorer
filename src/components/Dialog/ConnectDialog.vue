<template>
  <IceDialog
    width="500px"
    :visible="visible"
    @enter="handleOk"
    @close="handleCancel"
    :buttons="DialogButton.Ok | DialogButton.Cancel"
    title="添加服务器"
  >
    <template #footer-buttons>
      <IceButton class="space" @click="test(true)" type="success">测试连接</IceButton>
    </template>
    <template #body>
      <div>
        <div class="row">
          <div class="label">名称:</div>
          <div class="item"> <IceInput v-model="form.name" placeholder="请输入服务器名称" /> </div
        ></div>

        <div class="row">
          <div class="label">Host:</div>
          <div class="item"><IceInput v-model="form.host" placeholder="请输入服务器地址" /> </div
        ></div>
        <div class="row">
          <div class="label">Username:</div>
          <div class="item"><IceInput v-model="form.username" placeholder="请输入服务器用户名" /></div
        ></div>
        <div class="row">
          <div class="label">Password:</div>
          <div class="item"><IceInput type="password" v-model="form.password" placeholder="请输入服务器用密码" /></div
        ></div>
        <div class="row">
          <div class="label">Host:</div>
          <div class="item"><IceInput v-model="form.database" placeholder="请输入数据库名称" /></div
        ></div>
        <div class="row">
          <div class="label">端口:</div>
          <div class="item"
            ><IceInput style="width: 100px" type="number" v-model="form.port" placeholder="请输入服务器端口" /></div
        ></div>
      </div>
    </template>
  </IceDialog>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useServerStore } from '~/store/modules/server';
  import { useTreeStore } from '~/store/modules/tree';
  import { DialogButton } from '~/components/UI/dialog';
  import { notify } from '@kyvg/vue3-notification';
  import MySQL from '~/utils/connect/MySQL';

  const serverStore = useServerStore();
  const treeStore = useTreeStore();

  const emit = defineEmits<{
    (e: 'update:visible', b: Boolean): void;
  }>();

  defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  });

  const rules = ref({
    name: [{ required: true, message: '服务器名称必须填写, 并且不能和之前的相同' }],
  });

  let form = reactive({
    name: '',
    host: '127.0.0.1',
    username: 'root',
    password: '',
    database: '',
    port: 3306,
  });

  const reset = () => {
    form = {
      name: '',
      host: '127.0.0.1',
      username: 'root',
      password: '',
      database: '',
      port: 3306,
    };
  };

  const test = async (showMsg: boolean = false) => {
    try {
      const conn = new MySQL(form.host, form.username, form.password, form.database, form.port);
      await conn.connect();
      if (showMsg) {
        notify({ title: '服务器连接成功.', type: 'success' });
      }
      return true;
    } catch (e) {
      if (showMsg) {
        notify({ title: e.toString(), type: 'error' });
      }
      return false;
    }
  };

  const handleOk = async () => {
    try {
      // if (await test()) {
      serverStore.addConnect(form.name, form.host, form.username, form.password, form.database, form.port, {});
      treeStore.add(form.name);
      reset();
      emit('update:visible', false);
      notify({ title: '添加服务器成功.', type: 'success' });
      // } else {
      //   notify({ title: '服务器连接失败', type: 'error' });
      // }
    } catch (e) {
      notify({ title: e.toString(), type: 'error' });
    }
  };

  const handleCancel = () => {
    reset();
    emit('update:visible', false);
  };
</script>

<style lang="less" scoped>
  .row {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 8px 0;
    .label {
      width: 100px;
      font-size: 12px;
      text-align: right;
      padding: 0 10px;
    }
    .item {
      width: calc(100% - 100px);
    }
  }
</style>
