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
      <a-form-item field="port" label="端口" tooltip="请输入服务器端口">
        <a-input-number v-model="form.port" :precision="0" placeholder="请输入服务器端口" :min="100" :max="65000" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
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
    name: [{ required: true, message: 'name is required' }],
  });

  const form = reactive({
    name: '',
    host: '127.0.0.1',
    username: 'root',
    password: '',
    port: 3306,
  });

  const handleOk = () => {
    emit('update:visible', false);
  };

  const handleCancel = () => {
    emit('update:visible', false);
  };
</script>

<style lang="scss" scoped></style>
