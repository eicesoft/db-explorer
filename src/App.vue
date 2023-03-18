<script setup lang="ts">
  import Main from './components/Main.vue';
  // import { ref } from 'vue';

  console.log('[App.vue]', `Hello world from Electron ${process.versions.electron}!`);
</script>

<template>
  <Suspense>
    <template #default>
      <Main></Main>
    </template>
    <template #fallback>
      <a-spin tip="加载中">
        <div class="loading"></div>
      </a-spin>
    </template>
  </Suspense>
</template>

<style>
  .loading {
    background-color: #efefef;
    width: 100%;
    height: 100vh;
  }
</style>
