<template>
  <Captionbar :title="title"></Captionbar>
  <div class="main" :style="cssVars">
    <Toolbar @trigger="toolbarTrigger" />

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
          <ConnectTree
            :height="height - 40 - 28 * 2"
            @menu-select="menuSelect"
            @select-database="selectDatabase"
            @select-table="selectTable"
            @open-database="openDatabase"
          />
        </template>

        <template #second>
          <div style="overflow: hidden" v-if="!tabStore.isEmpty">
            <Tabber @closeOther="closeOther" @closeAll="closeAll" @close="closeTab" @change="changeTab" />
            <PanelManager></PanelManager>
          </div>

          <div v-else style="padding-top: calc(var(--bodyHeight) / 3)">
            <!-- <a-empty description="请在左侧选择服务器, 数据库或者表" /> -->
            <IceTabs
              :tabs="[
                { key: 'a1', title: 'tab1', icon: 'table' },
                { key: 'a2', title: 'tab2' },
                { key: 'a3', title: 'tab3' },
                { key: 'a4', title: 'tab3' },
                { key: 'a5', title: 'tab3' },
                { key: 'a6', title: 'tab3' },
                { key: 'a7', title: 'tab3' },
                { key: 'a8', title: 'tab3524354233' },
                { key: 'a9', title: '3464326324663263246' },
                { key: 'a19', title: '3464326324663263246' },

                { key: 'a11', title: '3464326324663263246' },
                { key: 'a12', title: '3464326324663263246' },
                { key: 'a13', title: '3464326324663263246' },
                { key: 'a14', title: '3464326324663263246' },
              ]"
            >
              <template #title="{ tab }">
                <IceIcon v-if="tab.icon" :size="14" :icon="tab.icon" />
                <span style="margin: 0 4px">{{ tab.title }}</span></template
              >
              <template #a1>sdgsagsas</template>
              <template #a2>123</template>
              <template #a3>456</template>
            </IceTabs>
          </div>
        </template>
      </a-split>
    </div>

    <Statusbar @trigger="toolbarTrigger" />

    <!-- Dialogs start -->
    <ConnectDialog v-model:visible="visibles.connectVisible" />
    <ServerStatus :serverKey="statusStore?.serverName" v-model:visible="visibles.statusVisible" />
    <ProcessList :serverKey="statusStore?.serverName" v-model:visible="visibles.processVisible" />
    <!-- Dialogs end-->

    <notifications :duration="1500" position="bottom right" />
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
  import { SimpleNode } from './ConnectManager';
  import { uuid } from '~/utils';
  import { ToolCommand } from './layout/tool';
  import IceTabs from './UI/IceTabs.vue';

  let bodyWidth = ref(0);
  let bodyHeight = ref(0);
  let width = ref(0);
  let height = ref(0);
  const size = ref('248px');

  const serverStore = useServerStore();
  const setupStore = useSetupStore();
  const tabStore = useTabStore();
  const statusStore = useStatausStore();
  const treeStore = useTreeStore();

  statusStore.init();
  setupStore.init();
  serverStore.load();
  // serverStore.addConnect('Dev', '192.168.1.25', 'root', 'HundyG63gF%42sdf', 'charge');
  // serverStore.addConnect('Dev', '127.0.0.1', 'root', 'root', 'charge');
  // serverStore.addConnect('Hr', '192.168.1.21', 'root', 'as$s3%hYb3fgv&r2', '');

  const cssVars = computed(() => {
    return {
      '--windowWidth': width.value + 'px',
      '--windowHeight': height.value + 'px',
      '--bodyHeight': bodyHeight.value + 'px',
      '--bodyWidth': bodyWidth.value + 'px',
      '--sideWidth': sideWidth.value + 'px',
    };
  });
  const node = ref<SimpleNode | null>(null);
  // const title = ref(BASE_TITLE);

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

  const selectTable = (n: SimpleNode) => {
    node.value = n;
    statusStore.setDatabase(n.meta?.DatabaseName);
    statusStore.setServer(n.meta?.Param.serverKey);
    let newTab: Tab = {
      id: n.id,
      title: n.title,
      type: TabType.Table,
      lock: false,
      meta: {
        node: n,
      },
    };

    tabStore.active(newTab);
    tabStore.add(newTab);
  };

  const selectDatabase = (n: SimpleNode) => {
    node.value = n;
    statusStore.setDatabase(n.title);
    statusStore.setServer(n.meta?.Param.serverKey);
  };

  const openDatabase = (n: SimpleNode) => {
    node.value = n;
    statusStore.setDatabase(n.title);
    statusStore.setServer(n.meta?.Param.serverKey);

    let newTab: Tab = {
      id: n.id,
      title: n.title,
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

  const sideWidth = computed(() => {
    return parseInt(size.value.substring(0, size.value.length - 2));
  });

  const menuSelect = (menu_key: string, node: SimpleNode) => {
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
        // console.log(node);
        treeStore.remove(node.title);
        serverStore.removeConnect(node.title);
        break;
      case 'table-design':
        newTab = {
          id: 'design_table_' + node.title,
          title: node.title,
          type: TabType.TableDesign,
          meta: {
            node: node,
          },
        };
        tabStore.active(newTab);
        tabStore.add(newTab);
        break;
    }
  };

  const resize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
    bodyWidth.value = width.value - sideWidth.value - 7;
    bodyHeight.value = height.value - 28 * 2 - 36;
    statusStore.setWindow(bodyWidth.value, bodyHeight.value);
  };

  // const list = ref<TreeNodeOptions[]>([]);
  // const virTree = ref<TreeContext>();

  // function recursion(path = '0', level = 3): TreeNodeOptions[] {
  //   const list = [];
  //   for (let i = 0; i < 10; i += 1) {
  //     const nodeKey = `${path}-${i}`;
  //     const treeNode: TreeNodeOptions = {
  //       nodeKey,
  //       name: nodeKey,
  //       children: [],
  //       hasChildren: true,
  //     };

  //     if (level > 0) {
  //       treeNode.children = recursion(nodeKey, level - 1);
  //     } else {
  //       treeNode.hasChildren = false;
  //     }

  //     list.push(treeNode);
  //   }
  //   return list;
  // }
  onMounted(() => {
    window.onresize = () => {
      resize();
    };
    resize();
    // console.log(virTree);
  });

  /** Dialog visible */
  const visibles = reactive({
    statusVisible: false,
    connectVisible: false,
    processVisible: false,
  });

  const toolbarTrigger = (key: ToolCommand) => {
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
    }
  };

  // const loadData = (node: any, callback: (children: TreeNodeOptions[]) => void) => {
  //   console.log('loadData', node);
  //   const result: TreeNodeOptions[] = [];
  //   for (let i = 0; i < 5; i += 1) {
  //     const nodeKey = `${node.nodeKey}-${i}`;
  //     const treeNode: TreeNodeOptions = {
  //       nodeKey: nodeKey,
  //       name: nodeKey,
  //       children: [],
  //       hasChildren: true,
  //     };
  //     result.push(treeNode);
  //   }
  //   setTimeout(() => {
  //     callback(result);
  //   }, 100);
  // };
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
  }
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
</style>
