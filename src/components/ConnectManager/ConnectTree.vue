<script setup lang="ts">
  import { ref, h, computed } from 'vue';
  import { SimpleNode, NodeType, MetaNode } from './index';
  import { useTreeStore } from '~/store/modules/tree';
  import { useStatausStore } from '~/store/modules/status';
  import ContextMenu from '@imengyu/vue3-context-menu';
  import Manager from '~/utils/link_manager';
  import { useI18n } from 'vue-i18n';
  import Vtree, { TreeNode, VTreeSearch } from '@wsfe/vue-tree';
  import IceIcon from '~/components/UI/IceIcon.vue';
  const { t } = useI18n();

  const props = defineProps({
    height: { type: Number, default: 24 },
  });

  const rootNode = computed(() => {
    return [treeStore.root];
  });

  const toMetaNode = (data: any, mode: number): MetaNode => {
    // console.log(data);
    if (mode == 1) {
      return {
        id: data.id,
        serverKey: data.title,
      };
    } else if (mode == 2) {
      return {
        id: data.id,
        database: data.title,
        serverKey: data.meta.Param.serverKey,
      };
    } else {
      return {
        id: data.id,
        tableName: data.title,
        database: data.meta.DatabaseName,
        serverKey: data.meta.Param.serverKey,
      };
    }
  };
  const renderNode = (node: TreeNode) => {
    return h(
      'div',
      {
        class: 'node-title',
        onDblclick: (evt: any) => {
          if (node.type == NodeType.Database) {
            let metaNode = toMetaNode(node, 2);
            openDatabase(metaNode);
          }
        },
        onContextmenu: (evt: any) => {
          let metaNode;

          if (node.type == NodeType.Server) {
            metaNode = toMetaNode(node, 1);

            onContextServerMenu(metaNode, evt);
          } else if (node.type == NodeType.Database) {
            metaNode = toMetaNode(node, 2);
            onContextDatabaseMenu(metaNode, evt);
          } else if (node.type == NodeType.Table) {
            metaNode = toMetaNode(node, 3);
            onContextTableMenu(metaNode, evt);
          }
        },
      },
      [
        h(IceIcon, { icon: node.icon, size: 20 }),
        h(
          'div',
          {
            style: {
              fontSize: '12px',
              padding: '0 6px',
            },
          },
          node.title
        ),
      ]
    );
  };

  const emits = defineEmits<{
    (e: 'select-table', value: any): void;
    (e: 'select-database', value: any): void;
    (e: 'open-database', value: any): void;
    (e: 'menu-select', menu_key: string, value: any): void;
  }>();

  // console.log(IconFont);
  const manager: Manager = Manager.getInstance();
  const treeStore = useTreeStore();
  const statusStore = useStatausStore();
  treeStore.init();

  const loadMore = async (data: any, resolve: Function) => {
    if (data.type == NodeType.Database) {
      console.warn('Load database');

      try {
        const conn = manager.get(data.meta?.Param.serverKey);
        const resp = await conn.getTables(data.title);
        // console.error(resp);
        let tabGroup: SimpleNode = {
          id: 'tables_' + data.title + '_groups',
          title: t('message.tree.table'),
          icon: 'table',
          type: NodeType.TableGroup,
          isLeaf: false,
          selectable: false,
          expand: true,
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
        const param = data.meta?.Param;
        for (let row of resp.data) {
          const tableName = row['Tables_in_' + data.title];
          tabGroup.children?.push({
            id: 'table_' + data.title + '_' + tableName,
            title: tableName,
            switcherIcon: () => h('span', {}),
            type: NodeType.Table,
            icon: 'table',
            isLeaf: true,
            expand: false,
            selectable: true,
            meta: {
              NodeId: data.id,
              DatabaseName: data.title,
              Param: {
                serverId: param.serverId,
                serverKey: param.serverKey,
              },
            },
            children: [],
          });
        }
        // data.children = [tabGroup];
        resolve([tabGroup]);
      } catch (err: any) {
        console.log(err.message);
      }
    } else if (data.type == NodeType.Server) {
      const conn = manager.get(data.title);
      console.log(data);

      try {
        const resp = await conn.getDatabases();
        console.log(resp);
        // data.title += '(' + resp.data.length + ')';
        let children = [];
        for (let row of resp.data) {
          children.push({
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
        resolve(children);
        // console.log(nodeMaps);
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  const selectNode = async (data: any) => {
    if (data.type == NodeType.Table) {
      let metaNode = toMetaNode(data, 3);
      emits('select-table', metaNode);
    } else if (data.type == NodeType.Database) {
      let metaNode = toMetaNode(data, 2);
      emits('select-database', metaNode);
    }
  };

  const searchKey = ref('');
  const searchTree = () => {
    treeStore.setKeyword(searchKey.value);
  };

  const menuSelect = (key: any, node: any) => {
    console.log(key, node);
    emits('menu-select', key, node);
  };

  const openDatabase = (node: MetaNode) => {
    emits('open-database', node);
  };

  const addDatabase = (node: any) => {
    emits('menu-select', 'add-database', node);
  };
  const removeServer = (node: any) => {
    emits('menu-select', 'remove-server', node);
  };

  const tableDesign = (node: any) => {
    emits('menu-select', 'table-design', node);
  };

  const onContextTableMenu = (node: any, e: any) => {
    ContextMenu.showContextMenu({
      theme: 'win10',
      x: e.x,
      y: e.y,
      zIndex: 1000,
      items: [
        {
          label: '设计表结构',
          onClick: () => {
            console.error(node);
            tableDesign(node);
          },
        },
        {
          label: '重命名',
          onClick: () => {},
          divided: true,
        },
        {
          label: '更多操作',
          onClick: () => {},
          children: [
            {
              label: '截断',
            },
            {
              label: '删除',
            },
            {
              label: '优化表',
            },
          ],
          divided: true,
        },
        {
          label: '导出',
          onClick: () => {},
        },
        {
          label: '导入',
          onClick: () => {},
        },
      ],
    });
  };

  const onContextServerMenu = (node: any, e: any) => {
    ContextMenu.showContextMenu({
      theme: 'win10',
      x: e.x,
      y: e.y,
      zIndex: 1000,
      items: [
        {
          label: '添加数据库',
          onClick: () => {
            addDatabase(node);
          },
        },
        {
          label: '移除服务器',
          onClick: () => {
            removeServer(node);
          },
        },
      ],
    });
  };

  const onContextDatabaseMenu = (node: any, e: any) => {
    ContextMenu.showContextMenu({
      theme: 'win10',
      x: e.x,
      y: e.y,
      zIndex: 1000,
      items: [
        {
          label: '新建查询',
          onClick: () => {
            emits('menu-select', 'new_query', node);
          },
        },
        {
          label: '添加',
          children: [
            {
              label: '表格',
            },
            {
              label: '视图',
            },
            {
              label: '存储过程',
            },
          ],
        },
      ],
    });
  };
</script>

<template>
  <div class="tree" style="height: var(--bodyHeight)">
    <div class="search-div">
      <IceInput isClearable @search="searchTree" class="search-text" placeholder="输入进行过滤" v-model="searchKey" />
    </div>
    <Vtree
      style="height: calc(100% - 36px)"
      :unselectOnClick="false"
      :render="renderNode"
      selectable
      :renderNodeAmount="30"
      :load="loadMore"
      ref="tree"
      :data="rootNode"
      @select="selectNode"
    ></Vtree>
  </div>
</template>

<style>
  .node-title {
    display: flex;
    align-items: center;
  }
</style>
<style lang="less" scoped>
  .tree {
    padding: 0px;
    margin: 0px;
    cursor: default;
    width: 100%;
    user-select: none;
    .search-div {
      width: 100%;
      .search-text {
        margin: 4px;
        height: 24px;
        width: calc(100% - 8px);
      }
    }
  }
</style>
