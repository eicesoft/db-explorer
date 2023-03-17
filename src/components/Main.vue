<template>
  <div class="main" :style="cssVars">
    <div class="header"></div>
    <div ref="box" class="container">
      <a-split
        @move-end="resize"
        :style="{
          height: cssVars['--bodyHeight'],
          width: '100%',
          minWidth: '200px',
        }"
        v-model:size="size"
        min="80px"
      >
        <template #first>
          <ConnectTree :height="height - 28 * 2" @menu-select="menuSelect" @select-table="selectTable" />
        </template>
        <template #second>
          <Tabber @close="closeTab" @change="changeTab" :active.sync="activeTab" :tabs="tabs" />
          <PanelManager :active="activeTab" :tabs="tabs"></PanelManager>
          <!-- <CodeEditor></CodeEditor> -->
        </template>
      </a-split>
    </div>
    <div class="statusbar">
      <div class="info"> MySQL Explorer {{ packageInfo.version }}</div>
      <div class="info" v-if="node"> Server: {{ node.meta?.Param.serverKey }}</div>
      <div class="info" v-if="node"> Database: {{ node.meta?.DatabaseName }}</div>
      <div class="info">History: {{ 20 }}</div>
    </div>
  </div>
</template>

<script lang="ts">
  import packageInfo from '../../package.json';
  import { ref, computed, reactive, onMounted, nextTick } from 'vue';
  import ConnectTree from './ConnectManager/ConnectTree.vue';
  import PanelManager from './Panel/PanelManager.vue';

  import TablePanel from './Panel/TablePanel.vue';
  import { useServerStore } from '~/store/modules/server';
  import Tabber from './Tabber/Tabber.vue';
  import { Tab, TabType } from './Tabber';
  import { NodeType, SimpleNode } from './ConnectManager';
  import { uuid } from '~/utils';

  export default {
    components: { ConnectTree, Tabber, TablePanel, PanelManager },
    async setup() {
      const side = ref(null);
      // const split = ref(null);
      // const body = ref(null);
      let bodyWidth = ref(0);
      // let sideWidth = ref(248);
      let width = ref(0);
      let height = ref(0);
      const serverStore = useServerStore();
      serverStore.addConnect('Dev', '192.168.1.25', 'root', 'HundyG63gF%42sdf', 'charge');
      // serverStore.addConnect('Hr', '192.168.1.21', 'root', 'as$s3%hYb3fgv&r2', '');

      const cssVars = computed(() => {
        return {
          '--windowWidth': width.value + 'px',
          '--windowHeight': height.value + 'px',
          '--bodyHeight': height.value - 28 * 2 + 'px',
          '--bodyWidth': bodyWidth.value + 'px',
          '--sideWidth': sideWidth.value + 'px',
        };
      });
      const resize = () => {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
        bodyWidth.value = width.value - sideWidth.value - 7;
      };
      onMounted(() => {
        window.onresize = () => {
          resize();
        };
        resize();
      });

      const tabs: Tab[] = reactive([]);

      const node = ref<SimpleNode | null>(null);
      const activeTab = ref<Tab>();
      const selectTable = (n: SimpleNode) => {
        node.value = n;
        let title = 'MySQL Explorer';
        if (n.type == NodeType.Database) {
          document.title = `${title} - Server: ${n.meta?.Param.serverKey}, Db: ${n.title}`;
        } else if (n.type == NodeType.Table) {
          document.title = `${title} - Server: ${n.meta?.Param.serverKey}, Db: ${n.meta?.DatabaseName}`;
        }
        console.log(n);
        let newTab: Tab = {
          id: n.id,
          title: n.title,
          type: TabType.Table,
          meta: {
            node: n,
          },
        };
        activeTab.value = newTab;

        for (let tab of tabs) {
          if (tab.id == n.id) {
            return;
          }
        }
        tabs.push(newTab);
      };

      const changeTab = (index: number, tab: Tab) => {
        console.log(tab);
        if (tab.type == TabType.Table) {
          selectTable(tab.meta.node);
        } else if (tab.type == TabType.Query) {
          activeTab.value = tab;
        }
      };

      const closeTab = (tab: Tab) => {
        for (let i in tabs) {
          let t = tabs[i];
          if (t.id == tab.id) {
            console.error('remove', i, tab.id, t.id);
            tabs.splice(i, 1);
          }
        }
      };
      //split resize
      // const mousedown = (e) => {
      // console.log(arguments);
      // var startX = e.clientX;
      // let startWidth = side.value.clientWidth;
      // document.onmousemove = function (e) {
      //   var endX = e.clientX;
      //   var moveLen = startWidth + endX - startX;
      //   var maxT = box.value?.clientWidth - split.value.offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
      //   if (moveLen < 160) moveLen = 160; // 左边区域的最小宽度为32px
      //   if (moveLen > maxT - 600) moveLen = maxT - 600; //右边区域最小宽度为150px
      //   side.value.style.width = moveLen + 'px';
      //   body.value.style.width = box.value.clientWidth - moveLen - 4 + 'px';
      //   side.value.style.cursor = 'col-resize';
      //   body.value.style.cursor = 'col-resize';
      //   sideWidth.value = moveLen;
      // };
      // document.onmouseup = function (evt) {
      //   document.onmousemove = null;
      //   document.onmouseup = null;
      //   side.value.style.cursor = 'default';
      //   body.value.style.cursor = 'default';
      //   split?.releaseCapture && split?.releaseCapture();
      //   bodyWidth.value = width.value - side.value?.clientWidth - 14;
      // };
      // };
      const size = ref('248px');
      const sideWidth = computed(() => {
        return parseInt(size.value.substring(0, size.value.length - 2));
      });

      const menuSelect = (menu_key: string, node: SimpleNode) => {
        switch (menu_key) {
          case 'new_query': //新建查询
            let queryTabs = tabs.filter((i: any) => {
              return i.type == TabType.Query;
            });
            let newTab: Tab = {
              id: 'Query' + uuid(),
              title: 'Query ' + (queryTabs.length + 1),
              type: TabType.Query,
              meta: {
                node: node,
                editor: {
                  context: '',
                  model: null,
                  state: null,
                },
              },
            };
            activeTab.value = newTab;
            tabs.push(newTab);
            break;
        }
      };

      return {
        // box,
        // side,
        // split,
        resize,
        sideWidth,
        size,
        node,
        packageInfo,
        cssVars,
        tabs,
        selectTable,
        activeTab,
        // mousedown,
        changeTab,
        closeTab,
        menuSelect,
        height,
      };
    },
  };
</script>

<style lang="scss" scoped>
  $resize-width: 2px;
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
    width: calc(var(--sideWidth) - $resize-width);
    height: var(--bodyHeight);
    overflow: auto;
  }
  .split-border {
    // border: 1px solid #b1d5f8;
    width: $resize-width;
    background-color: #d6e9fc;
    height: calc(var(--bodyHeight) - 2px);
    cursor: col-resize;
    background-size: cover;
    background-position: center;
    &:hover {
      background-color: #95bfe9;
      // border: 1px solid #87b7e7;
    }
  }
  .body {
    // width: 80%;
    width: calc(var(--windowWidth) - 248px);
    height: var(--bodyHeight);
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
    // padding: 0 10px;
    user-select: none;
    display: flex;
    .info {
      // margin: 0 10px 0 0;
      padding: 0 10px 0 10px;
      border-right: 1px solid #ececec;
    }
  }
</style>
