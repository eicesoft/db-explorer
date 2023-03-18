<script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue';
  import { getIconRes } from '~/utils/res';
  import { IconDown, IconPlus, IconMoreVertical } from '@arco-design/web-vue/es/icon';

  import { SimpleNode } from './index';
  import { NodeType } from './index';
  import { useServerStore } from '~/store/modules/server';
  import { uuid } from '~/utils/index';
  import Manager from '~/utils/link_manager';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

  const props = defineProps({
    height: Number,
  });

  const emits = defineEmits<{
    (e: 'select-table', value: any): void;
    (e: 'menu-select', menu_key: string, value: any): void;
  }>();

  const manager: Manager = Manager.getInstance();
  let root: SimpleNode[] = reactive<SimpleNode[]>([
    {
      id: '_root',
      title: t('message.tree.connect'),
      icon: 'home',
      type: NodeType.Root,
      selectable: false,
      isLeaf: false,
      children: [],
    },
  ]);

  const loadMore = async (data: SimpleNode) => {
    if (data.type == NodeType.Database) {
      console.warn('Load database');

      try {
        const conn = manager.get(data.meta?.Param.serverKey);
        const resp = await conn.query('SELECT * FROM `information_schema`.`TABLES` WHERE `TABLE_SCHEMA` = ?', [
          data.title,
        ]);

        let tabGroup: SimpleNode = {
          id: 'tables_' + data.title + '_groups',
          title: '表格',
          icon: 'table',
          type: NodeType.TableGroup,
          isLeaf: false,
          selectable: false,
          meta: {
            NodeId: data.id,
            DatabaseName: data.title,
            Param: {
              serverId: data.id,
              serverKey: data.title,
            },
          },
          children: [],
        };
        const param = data.meta.Param;
        for (let row of resp.data) {
          tabGroup.children?.push({
            id: 'table_' + data.title + '_' + row.TABLE_NAME,
            title: row.TABLE_NAME,
            switcherIcon: '',
            type: NodeType.Table,
            icon: 'table',
            isLeaf: 2,
            selectable: true,
            meta: {
              NodeId: data.id,
              DatabaseName: data.title,
              Param: {
                serverId: param.serverId,
                serverKey: param.serverKey,
              },
            },
          });
        }
        // nodeMaps[data.id].runtime.load = true;
        // nodeMaps[data.id].children = [tabGroup];
        data.children = [tabGroup];
        // nodeMaps = reBuildNodes(root);
        // console.log(nodeMaps);
      } catch (err: any) {
        console.log(err.message);
      }
    } else if (data.type == NodeType.Server) {
      const conn = manager.get(data.title);

      try {
        const resp = await conn.query('SELECT * FROM `information_schema`.`SCHEMATA`', []);
        console.log(resp);
        // console.log(root[0]?.children[0]);
        data.children = [];
        // data.isLeaf = true;
        // data.runtime.load = true;
        for (let row of resp.data) {
          data.children.push({
            id: 'db_' + row.SCHEMA_NAME,
            icon: 'database',
            title: row.SCHEMA_NAME,
            type: NodeType.Database,
            runtime: { load: false },
            isLeaf: false,
            selectable: true,
            meta: {
              NodeId: 'db_' + row.SCHEMA_NAME,
              Param: {
                serverId: data.id,
                serverKey: data.title,
              },
            },
            children: [],
          });
        }
        // console.log(nodeMaps);
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };
  const reBuildNodes = (nodes: SimpleNode[] | undefined) => {
    let maps: Record<string, any> = {};
    for (let key in nodes) {
      const node: SimpleNode = nodes[key];
      maps[node.id] = node;
      Object.assign(maps, reBuildNodes(node.children));
    }

    return maps;
  };

  const serverStore = useServerStore();
  for (let key of Object.keys(serverStore.links)) {
    // console.log(key);
    const connect = serverStore.getConnect(key);
    let id = 'server_' + uuid();
    root[0].children?.push({
      id: id,
      icon: 'server',
      title: key,
      type: NodeType.Server,
      selectable: true,
      isLeaf: false,
      runtime: {
        load: false,
      },
      meta: {
        NodeId: id,
        Param: connect,
      },
      children: [],
    });
  }
  // console.log(nodeMaps);
  const context_item = ref<SimpleNode | null>(null);
  const activeItem = ref<SimpleNode | null>();
  const contextSelectItem = (data: SimpleNode) => {
    context_item.value = data;
    console.error(context_item.value);
  };

  //高亮当前数据库连接
  // watch(
  //   () => activeItem.value,
  //   (new_val, old_val) => {
  //     console.error(new_val, old_val);
  //     if (old_val?.type == NodeType.Table) {
  //       nodeMaps[old_val.meta.NodeId].runtime.isOpen = false;
  //     }

  //     if (new_val?.type == NodeType.Table) {
  //       nodeMaps[new_val.meta.NodeId].runtime.isOpen = true;
  //     }
  //   }
  // );

  const selectNode = async (key: any, data: any) => {
    // console.error(data);
    if (data.node.type == NodeType.Table) {
      emits('select-table', data.node);
    }
  };

  const searchKey = ref('');
  function getMatchIndex(title: string) {
    if (!searchKey.value) return -1;
    return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
  }

  const menuSelect = (key: any, node: any) => {
    console.log(key, node);
    emits('menu-select', key, node);
  };
</script>

<template>
  <div class="tree" v-contextmenu:contextmenu>
    <div class="search-div">
      <a-input-search class="search-text" placeholder="输入进行过滤" size="mini" v-model="searchKey" />
    </div>
    <a-tree
      @select="selectNode"
      blockNode
      size="mini"
      :fieldNames="{
        key: 'id',
        title: 'title',
        children: 'children',
        icon: 'customIcon',
      }"
      :animation="false"
      :virtualListProps="{
        height: height - 32,
        fixedSize: true,
        buffer: 20,
      }"
      :show-line="true"
      :load-more="loadMore"
      :data="root"
    >
      <template #extra="nodeData">
        <!-- <IconPlus
          v-if="nodeData.type == NodeType.Database"
          style="position: absolute; right: 8px; font-size: 12px; top: 10px"
          @click="() => onIconClick(nodeData)"
        /> -->

        <a-dropdown
          @select="
            (key:any) => {
              menuSelect(key, nodeData);
            }
          "
          v-if="nodeData.type == NodeType.Database"
        >
          <IconMoreVertical />
          <template #content>
            <a-doption value="new_query">新建查询</a-doption>
            <a-doption value="new_table">新建表格</a-doption>
          </template>
        </a-dropdown>
      </template>

      <template #title="nodeData">
        <template v-if="((index = getMatchIndex(nodeData?.title)), index < 0)">{{ nodeData?.title }}</template>
        <span v-else>
          {{ nodeData?.title?.substr(0, index) }}
          <span style="color: var(--color-primary-light-4)">
            {{ nodeData?.title?.substr(index, searchKey.length) }} </span
          >{{ nodeData?.title?.substr(index + searchKey.length) }}
        </span>
      </template>

      <template #icon="data">
        <img :src="getIconRes(data.node.icon + '.png')" />
      </template>

      <template #switcher-icon="node, { isLeaf }">
        <IconDown v-if="!isLeaf" />
        <!-- <IconStar v-if="isLeaf" /> -->
      </template>
    </a-tree>

    <!-- <TreeNode
      @connect="connect"
      @select="selectNode"
      @contextselect="contextSelectItem"
      v-for="(item, index) in root"
      :active="activeItem"
      :item="item"
    ></TreeNode> -->

    <v-contextmenu ref="contextmenu">
      <template v-if="context_item && context_item?.type == NodeType.Root">
        <v-contextmenu-item>添加连接</v-contextmenu-item>
        <v-contextmenu-divider />
        <v-contextmenu-item>系统设置</v-contextmenu-item>
      </template>

      <template v-if="context_item && context_item?.type == NodeType.Server">
        <v-contextmenu-item>添加数据库</v-contextmenu-item>
        <v-contextmenu-divider />
        <v-contextmenu-item>删除连接</v-contextmenu-item>
        <v-contextmenu-item v-if="context_item.runtime?.load">关闭连接</v-contextmenu-item>
        <v-contextmenu-item v-else>打开连接</v-contextmenu-item>
      </template>

      <template v-if="context_item && context_item?.type == NodeType.Database">
        <v-contextmenu-item>新建查询</v-contextmenu-item>
        <v-contextmenu-submenu title="添加">
          <v-contextmenu-item>表格</v-contextmenu-item>
          <v-contextmenu-item>视图</v-contextmenu-item>
          <v-contextmenu-item>存储过程</v-contextmenu-item>
        </v-contextmenu-submenu>

        <v-contextmenu-divider />

        <v-contextmenu-item>刷新</v-contextmenu-item>
        <v-contextmenu-divider />
        <v-contextmenu-item>导出</v-contextmenu-item>
        <v-contextmenu-item>导入</v-contextmenu-item>
      </template>

      <template v-if="context_item && context_item?.type == NodeType.TableGroup">
        <v-contextmenu-item>添加表格</v-contextmenu-item>
        <v-contextmenu-item>刷新</v-contextmenu-item>
      </template>

      <template v-if="context_item && context_item?.type == NodeType.Table">
        <v-contextmenu-item>打开表格</v-contextmenu-item>
        <v-contextmenu-item>设计表格</v-contextmenu-item>
        <v-contextmenu-divider />
        <v-contextmenu-item>重命名</v-contextmenu-item>
        <v-contextmenu-submenu title="更多操作">
          <v-contextmenu-item>截断</v-contextmenu-item>
          <v-contextmenu-item>删除</v-contextmenu-item>
          <v-contextmenu-item>优化表</v-contextmenu-item>
        </v-contextmenu-submenu>
        <v-contextmenu-divider />
        <v-contextmenu-item>导出</v-contextmenu-item>
        <v-contextmenu-item>导入</v-contextmenu-item>
      </template>
    </v-contextmenu>
  </div>
</template>

<style lang="scss">
  .arco-tree-node-disabled-selectable {
    .arco-tree-node-title {
      color: var(--color-text-1) !important;
      font-style: italic !important;
      cursor: default !important;
    }
  }
</style>

<style lang="scss" scoped>
  .tree {
    padding: 0px;
    margin: 0px;
    cursor: default;
    user-select: none;
    .search-div {
      width: 100%;
      .search-text {
        margin: 4px;
        width: calc(100% - 8px);
      }
    }
  }
</style>
