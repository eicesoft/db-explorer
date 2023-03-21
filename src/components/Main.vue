<template>
  <Captionbar :title="title"></Captionbar>
  <div class="main" :style="cssVars">
    <Toolbar :status="statusInfo" @trigger="toolbarTrigger" />

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
          />
        </template>

        <template #second>
          <div style="overflow: hidden" v-if="!tabStore.isEmpty">
            <Tabber @closeOther="closeOther" @closeAll="closeAll" @close="closeTab" @change="changeTab" />
            <PanelManager></PanelManager>
          </div>

          <div v-else style="padding-top: calc(var(--bodyHeight) / 3)">
            <a-empty />
          </div>
        </template>
      </a-split>
    </div>

    <Statusbar @trigger="toolbarTrigger" :status="statusInfo" />
  </div>

  <!-- Dialogs start -->
  <ConnectDialog v-model:visible="visibles.connectVisible" />
  <ServerStatus :serverKey="statusInfo?.serverName" v-model:visible="visibles.statusVisible" />
  <!-- Dialogs end-->
</template>

<script lang="ts" setup>
  import packageInfo from '../../package.json';
  import { ref, computed, reactive, onMounted, nextTick } from 'vue';
  import { StatusInfo } from '~/components/layout/status';

  import { useServerStore } from '~/store/modules/server';
  import { useSetupStore } from '~/store/modules/setup';
  import { useTabStore } from '~/store/modules/tab';

  import { Tab, TabType } from './Tabber';
  import { NodeType, SimpleNode } from './ConnectManager';
  import { uuid } from '~/utils';
  import { ToolCommand } from './layout/tool';

  let bodyWidth = ref(0);
  let width = ref(0);
  let height = ref(0);
  const serverStore = useServerStore();
  const setupStore = useSetupStore();
  const tabStore = useTabStore();
  setupStore.init();
  serverStore.addConnect('Dev', '192.168.1.25', 'root', 'HundyG63gF%42sdf', 'charge');
  // serverStore.addConnect('Dev', '127.0.0.1', 'root', 'root', 'charge');
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
  const node = ref<SimpleNode | null>(null);
  const BASE_TITLE = 'MySQL Explorer';
  const title = ref(BASE_TITLE);
  const selectTable = (n: SimpleNode) => {
    node.value = n;
    if (n.type == NodeType.Database) {
      title.value = `${BASE_TITLE} - Server: ${n.meta?.Param.serverKey}, Db: ${n.title}`;
    } else if (n.type == NodeType.Table) {
      title.value = ` ${BASE_TITLE} - Server: ${n.meta?.Param.serverKey}, Db: ${n.meta?.DatabaseName}`;
    }
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

    title.value = `${BASE_TITLE} - Server: ${n.meta?.Param.serverKey}, Db: ${n.title}`;
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
  const size = ref('248px');
  const sideWidth = computed(() => {
    return parseInt(size.value.substring(0, size.value.length - 2));
  });

  const menuSelect = (menu_key: string, node: SimpleNode) => {
    switch (menu_key) {
      case 'new_query': //新建查询
        let queryTabs = tabStore.tabs.filter((i: any) => {
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
        tabStore.active(newTab);
        tabStore.add(newTab);
        break;
    }
  };

  const statusInfo = computed((): StatusInfo => {
    return {
      version: packageInfo.version,
      serverName: node.value?.meta?.Param.serverKey ?? undefined,
      database: node.value?.meta?.DatabaseName ?? undefined,
      queryCount: 0,
      language: 'zh',
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
  // const connectVisible = ref(false);
  const visibles = reactive({
    statusVisible: false,
    connectVisible: false,
  });

  const toolbarTrigger = (key: ToolCommand) => {
    switch (key) {
      case ToolCommand.Add:
        visibles.connectVisible = true;
        break;
      case ToolCommand.ServerInfomation:
        visibles.statusVisible = true;
        break;
    }
  };
</script>

<style lang="scss" scoped>
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
