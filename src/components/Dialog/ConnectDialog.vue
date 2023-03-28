<template>
  <a-modal :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <template #title> 添加服务器 </template>
    <a-form :rules="rules" size="mini" :model="form">
      <a-form-item field="name" tooltip="请输入服务器名称" label="名称">
        <a-input v-model="form.name" placeholder="请输入服务器名称" />
      </a-form-item>
      <a-form-item field="host" tooltip="请输入服务器地址" label="Host">
        <a-input v-model="form.host" placeholder="请输入服务器地址" />
      </a-form-item>
      <a-form-item field="username" tooltip="请输入服务器用户名" label="Username">
        <a-input v-model="form.username" placeholder="请输入服务器用户名" />
      </a-form-item>
      <a-form-item field="password" tooltip="请输入服务器用密码" label="Password">
        <a-input-password v-model="form.password" placeholder="请输入服务器用密码" />
      </a-form-item>
      <a-form-item field="database" tooltip="请输入数据库名称" label="Database">
        <a-input-password v-model="form.database" placeholder="请输入数据库名称" />
      </a-form-item>
      <a-form-item field="port" label="端口" tooltip="请输入服务器端口">
        <a-input-number v-model="form.port" :precision="0" placeholder="请输入服务器端口" :min="100" :max="65000" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useServerStore } from '~/store/modules/server';
  import { useTreeStore } from '~/store/modules/tree';
  import { Message } from '@arco-design/web-vue';

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

  const form = reactive({
    name: '',
    host: '127.0.0.1',
    username: 'root',
    password: '',
    database: '',
    port: 3306,
  });

  const handleOk = () => {
    try {
      serverStore.addConnect(form.name, form.host, form.username, form.password, form.database, form.port, {});
      treeStore.add(form.name);
      emit('update:visible', false);
    } catch (e) {
      Message.error(e.toString());
    }
  };

  const handleCancel = () => {
    emit('update:visible', false);
  };
</script>

<style lang="scss" scoped></style>
