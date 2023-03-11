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
      <span>Loading...</span>
    </template>
  </Suspense>
</template>

<style>
  .ss {
    color: #efefef;
  }
</style>
