<template>
  <div class="main">
    <div class="header"></div>
    <div class="container">
      <div class="side">{{ pp }}</div>
      <div class="body"><CodeEditor></CodeEditor></div>
    </div>
    <div class="statusbar">MySQL Explorer {{ pp.version }}</div>

    <!-- <div v-for="(item, i) in list"> {{ item }}</div> -->
  </div>
</template>

<script lang="ts">
  import CodeEditor from './CodeEditor/CodeEditor.vue';
  import MySQL from '../utils/connect/MySQL';
  import pp from '../../package.json';
  import { ref } from 'vue';
  export default {
    components: { CodeEditor },
    async setup() {
      console.log(window.innerHeight);
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
      return { list, pp };
    },
  };
</script>

<style scoped>
  .main {
    overflow: hidden;
    height: 100%;
    width: 100%;
  }
  .header {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid #ececec;
    background-color: #fefefe;
    height: 28px;
    line-height: 28px;
    color: #707070;
    width: 100%;
    user-select: none;
  }
  .container {
    display: flex;
    position: absolute;
    height: calc(100%-28 * 2);
    top: 28px;
  }
  .side {
    width: 15%;
    height: 100%;
  }
  .body {
    width: 85%;
    height: 100%;
    overflow: hidden;
  }
  .statusbar {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1000;
    border-top: 1px solid #ececec;
    background-color: #fefefe;
    height: 28px;
    line-height: 28px;
    font-size: 11px;
    color: #707070;
    width: 100%;
    padding: 0 10px;
    user-select: none;
  }
</style>
