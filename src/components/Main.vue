<template>
  <div class="main" :style="cssVars">
    <div class="header"></div>
    <div class="container">
      <div class="side"><ConnectTree @select-table="selectTable" /></div>
      <div class="body"
        ><Tabber :tabs="tabs" /><TablePanel v-if="fields" :rows="rows" :fields="fields" /><CodeEditor></CodeEditor
      ></div>
    </div>
    <div class="statusbar">MySQL Explorer {{ pp.version }}</div>

    <!-- <div v-for="(item, i) in list"> {{ item }}</div> -->
  </div>
</template>

<script lang="ts">
  import CodeEditor from './CodeEditor/CodeEditor.vue';
  import ConnectTree from './ConnectManager/ConnectTree.vue';
  import Tabber from './Tabber/Tabber.vue';
  import TablePanel from './Panel/TablePanel.vue';

  import MySQL from '../utils/connect/MySQL';
  import pp from '../../package.json';
  import { ref, computed } from 'vue';
  import { useServerStore } from '~/store/modules/server';
  import { Tab, TabType } from './Tabber';

  export default {
    components: { CodeEditor, ConnectTree, Tabber, TablePanel },
    data() {
      return {
        width: 0,
        height: 0,
        rows: [],
        fields: [],
      };
    },
    async setup() {
      let width = ref(0);
      let height = ref(0);
      const serverStore = useServerStore();
      // serverStore.addConnect('Dev', '192.168.1.25', 'root', 'HundyG63gF%42sdf', 'charge');

      const cssVars = computed(() => {
        return {
          '--windowWidth': width.value + 'px',
          '--windowHeight': height.value + 'px',
        };
      });
      const resize = () => {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
      };
      window.onresize = () => {
        resize();
      };
      resize();
      // console.log(window.innerHeight);
      const conn = new MySQL('192.168.1.25', 'root', 'HundyG63gF%42sdf', 'charge');
      const list = ref<Array<any>>();
      try {
        const connResp = await conn.connect();
        console.log(connResp);
        const resp = await conn.query('SELECT * FROM `SCHEMATA`', []);
        console.log(resp);
        list.value = resp;
      } catch (err: any) {
        console.log(err.message);
      } finally {
        conn.close();
      }

      const tabs: Tab[] = [
        { id: '123', title: 'test', type: TabType.Query },
        { id: '234', title: 'account', type: TabType.Table },
        { id: '567', title: 'users', type: TabType.TableiInformation },
      ];

      const selectTable = (rows: any, fields: any) => {};

      return { list, pp, cssVars, tabs };
    },
    methods: {
      resize() {},
      async selectTable({ data, fields }) {
        console.log(data, fields);
        this.rows = data;
        this.fields = fields;
      },
    },
  };
</script>

<style scoped>
  .main {
    overflow: hidden;
    height: calc(var(--windowHeight) - 28px);
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
    /* height: 100%; */
    width: var(--windowWidth);
    top: 28px;
  }
  .side {
    width: 20%;
    height: calc(var(--windowHeight) - 28px * 2);

    overflow: auto;
  }
  .body {
    width: 80%;
    height: calc(var(--windowHeight) - 28px * 2);

    overflow: auto;
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
