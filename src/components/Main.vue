<template>
  <div>
    <CodeEditor></CodeEditor>
    <!-- <div v-for="(item, i) in list"> {{ item }}</div> -->
  </div>
</template>

<script lang="ts">
  import CodeEditor from './CodeEditor.vue';
  import MySQL from '../utils/connect/MySQL';
  import { ref } from 'vue';
  export default {
    components: { CodeEditor },
    async setup() {
      const conn = new MySQL('127.0.0.1', 'root', 'root', 'charge');
      const list = ref<Array<any>>();
      try {
        const connResp = await conn.connect();
        console.log(connResp);
        const resp = await conn.query('SELECT * FROM account_item;SELECT * FROM account;', []);
        console.log(resp);
        list.value = resp;
      } catch (err: any) {
        console.log(err.message);
      } finally {
        conn.close();
      }
      return { list };
    },
  };
</script>
