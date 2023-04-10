<template>
  <Captionbar :title="title"></Captionbar>
  <div class="main" :style="cssVars">
    <Toolbar @trigger="toolbarTrigger" />

    <div ref="box" class="container">
      <IceSplit ref="split" @on-move-end="sideResize" :value="leftSplit">
        <template #left>
          <ConnectTree
            :height="height - 40 - 28 * 2"
            @menu-select="menuSelect"
            @select-database="selectDatabase"
            @select-table="selectTable"
            @open-database="openDatabase"
        /></template>
        <template #right
          ><div style="overflow: hidden" v-if="!tabStore.isEmpty">
            <Tabber @closeOther="closeOther" @closeAll="closeAll" @close="closeTab" @change="changeTab" />
            <PanelManager></PanelManager>
          </div>

          <div v-else style="padding-top: calc(var(--bodyHeight) / 3)">
            <div class="empty"
              ><div><img style="width: 48px; height: 48px" :src="emptyIcon" /></div
              ><div>请在左侧选择服务器, 数据库或者表</div></div
            >
          </div></template
        >
      </IceSplit>
    </div>

    <Statusbar @trigger="toolbarTrigger" />

    <!-- Dialogs start -->
    <ConnectDialog v-model:visible="visibles.connectVisible" />
    <ServerStatus :serverKey="statusStore?.serverName" v-model:visible="visibles.statusVisible" />
    <ProcessList :serverKey="statusStore?.serverName" v-model:visible="visibles.processVisible" />
    <AddDatabase v-model:visible="visibles.addDialogVisible" />
    <!-- Dialogs end-->

    <notifications :duration="2000" position="bottom right" />
    <HistoryDrawer v-model:visible="visibles.historyVisible" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive, onMounted } from 'vue';

  import { useServerStore } from '~/store/modules/server';
  import { useSetupStore } from '~/store/modules/setup';
  import { useTreeStore } from '~/store/modules/tree';
  import { useTabStore } from '~/store/modules/tab';
  import { useStatausStore } from '~/store/modules/status';

  import packageInfo from '~/../package.json';
  import { Tab, TabType } from './Tabber';
  import { MetaNode } from './ConnectManager';
  import { uuid } from '~/utils';
  import { ToolCommand } from './layout/tool';
  import { getImageRes } from '~/utils/res';
  import { nextTick } from 'process';
  import '@wsfe/vue-tree/dist/style.css';

  let bodyWidth = ref(0);
  let bodyHeight = ref(0);
  let width = ref(0);
  let height = ref(0);
  const emptyIcon = getImageRes('empty.png');

  const serverStore = useServerStore();
  const setupStore = useSetupStore();
  const tabStore = useTabStore();
  const statusStore = useStatausStore();
  const treeStore = useTreeStore();

  statusStore.init();
  setupStore.init();
  serverStore.load();

  const cssVars = computed(() => {
    return {
      '--windowWidth': width.value + 'px',
      '--windowHeight': height.value + 'px',
      '--bodyHeight': bodyHeight.value + 'px',
      '--bodyWidth': bodyWidth.value + 'px',
      '--sideWidth': sideWidth.value + 'px',
    };
  });
  const node = ref<MetaNode | null>(null);
  const leftSplit = ref(0.22);
  const sideWidth = ref(235);
  const split = ref();

  const title = computed(() => {
    let t = packageInfo.productName;
    if (statusStore.serverName) {
      t += ` - Server: ${statusStore.serverName}`;
    }

    if (statusStore.database) {
      t += `, Db: ${statusStore.database}`;
    }

    return t;
  });

  const selectTable = (n: MetaNode) => {
    node.value = n;
    statusStore.setDatabase(n.database);
    statusStore.setServer(n.serverKey);
    let newTab: Tab = {
      id: n.id,
      title: n.tableName ?? '',
      type: TabType.Table,
      lock: false,
      meta: {
        node: n,
      },
    };

    tabStore.active(newTab);
    tabStore.add(newTab);
  };

  const selectDatabase = (n: MetaNode) => {
    node.value = n;
    statusStore.setDatabase(n.database);
    statusStore.setServer(n.serverKey);
  };

  const openDatabase = (n: MetaNode) => {
    node.value = n;
    statusStore.setDatabase(n.database);
    statusStore.setServer(n.serverKey);

    let newTab: Tab = {
      id: n.id,
      title: n.database ?? '',
      type: TabType.Database,
      lock: false,
      meta: {
        node: n,
      },
    };

    tabStore.active(newTab);
    tabStore.add(newTab);
  };

  const changeTab = (tab: Tab) => {
    console.log(tab);
    if (tab.type == TabType.Table) {
      selectTable(tab.meta?.node);
    } else if (tab.type == TabType.Query) {
      tabStore.active(tab);
    }
  };

  const closeTab = (tab: Tab) => {
    tabStore.remove(tab);
  };

  const closeOther = (item: Tab) => {
    tabStore.removeOther(item);
  };

  const closeAll = () => {
    tabStore.removeAll();
  };

  const menuSelect = (menu_key: string, node: MetaNode) => {
    let newTab: Tab;
    switch (menu_key) {
      case 'new_query': //新建查询
        let queryTabs = tabStore.tabs.filter((i: any) => {
          return i.type == TabType.Query;
        });
        newTab = {
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
        tabStore.active(newTab);
        tabStore.add(newTab);
        break;
      case 'remove-server':
        console.log(node);
        treeStore.remove(node.serverKey);
        serverStore.removeConnect(node.serverKey);
        break;
      case 'table-design':
        console.log(node);
        newTab = {
          id: 'design_table_' + node.tableName,
          title: node.tableName ?? '',
          type: TabType.TableDesign,
          meta: {
            node: node,
          },
        };
        tabStore.active(newTab);
        tabStore.add(newTab);
        break;
      case 'add-database':
        statusStore.setServer(node.serverKey);
        visibles.addDialogVisible = true;
        break;
    }
  };

  const sideResize = (e: any, width: any) => {
    console.log(width);
    sideWidth.value = width;
    resize();
  };

  const resize = () => {
    console.log('resize window');

    sideWidth.value = split.value.getSideWidth() == 0 ? 235 : split.value?.getSideWidth();
    console.log(sideWidth.value);
    width.value = window.innerWidth;
    height.value = window.innerHeight;
    bodyWidth.value = width.value - sideWidth.value - 5;
    bodyHeight.value = height.value - 28 * 2 - 36;
    statusStore.setWindow(bodyWidth.value, bodyHeight.value);
  };

  onMounted(() => {
    window.onresize = () => {
      resize();
    };
    nextTick(() => {
      resize();
    });
  });

  /** Dialog visible */
  const visibles = reactive({
    statusVisible: false,
    connectVisible: false,
    processVisible: false,
    historyVisible: false,
    addDialogVisible: false,
  });

  const toolbarTrigger = (key: ToolCommand) => {
    console.log('toolbarTrigger', key);
    switch (key) {
      case ToolCommand.Add:
        visibles.connectVisible = true;
        break;
      case ToolCommand.ServerInfomation:
        visibles.statusVisible = true;
        break;
      case ToolCommand.ProcessList:
        visibles.processVisible = true;
        break;
      case ToolCommand.History:
        visibles.historyVisible = !visibles.historyVisible;
        break;
    }
  };
</script>

<style lang="less" scoped>
  .main {
    overflow: hidden;
    height: calc(var(--windowHeight) - 28px);
    width: 100%;
    position: fixed;
    left: 0;
    top: 36px;
    z-index: 1000;
  }
  .container {
    display: flex;
    position: absolute;
    width: var(--windowWidth);
    top: calc(28px);
    height: var(--bodyHeight);
  }
  .empty {
    text-align: center;
    font-size: 16px;
    user-select: none;
    color: rgb(151, 151, 151);
  }
</style>
