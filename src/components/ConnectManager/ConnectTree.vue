<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import TreeNode from './TreeNode.vue';
  import { SimpleNode } from './index';
  import { NodeType } from './index';
  import { useServerStore } from '~/store/modules/server';
  import { uuid } from '~/utils/index';
  import Manager from '~/utils/link_manager';
  const emits = defineEmits<{
    (e: 'select-table', value: any): void;
  }>();

  const manager = new Manager();

  // console.error(serverStore.getConnect('Dev'));
  let root: SimpleNode[] = reactive<SimpleNode[]>([
    {
      id: 0,
      title: '连接',
      icon: 'home',
      type: NodeType.Root,
      children: [
        // {
        //   id: 1,
        //   icon: 'server',
        //   title: 'Test',
        //   type: NodeType.Server,
        //   runtime: {
        //     load: false,
        //   },
        //   meta: {
        //     NodeId: 1,
        //     Param: {
        //       host: '192.168.1.25',
        //       user: 'root',
        //       password: 'HundyG63gF%42sdf',
        //       database: 'charge',
        //     },
        //   },
        //   children: [
        //     // {
        //     //   id: 4,
        //     //   icon: 'database',
        //     //   title: 'hb_bi',
        //     //   type: NodeType.Database,
        //     //   children: [
        //     //     {
        //     //       id: 5,
        //     //       icon: 'table',
        //     //       title: '表格',
        //     //       type: NodeType.TableGroup,
        //     //       children: [
        //     //         {
        //     //           id: 12,
        //     //           icon: 'table',
        //     //           title: 'account',
        //     //           type: NodeType.Table,
        //     //         },
        //     //       ],
        //     //     },
        //     //     { id: 6, icon: 'view', title: '视图', type: NodeType.ViewGroup, children: [] },
        //     //   ],
        //     // },
        //   ],
        // },
        // {
        //   id: 2,
        //   icon: 'server',
        //   title: 'Dev',
        //   type: NodeType.Server,
        //   runtime: { load: false },
        // },
      ],
    },
  ]);

  const getNodes = (nodes: SimpleNode[] | undefined) => {
    let maps: Record<string, any> = {};
    for (let key in nodes) {
      const node: SimpleNode = nodes[key];
      maps[node.id] = node;
      Object.assign(maps, getNodes(node.children));
    }

    return maps;
  };

  const serverStore = useServerStore();
  for (let key of Object.keys(serverStore.links)) {
    console.log(key);
    const connect = serverStore.getConnect(key);
    let id = 'server_' + uuid();
    root[0].children?.push({
      id: id,
      icon: 'server',
      title: key,
      type: NodeType.Server,
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
  let nodeMaps = getNodes(root);
  // console.log(nodeMaps);
  const context_item = ref<SimpleNode | null>(null);
  const activeItem = ref<SimpleNode | null>();
  const contextSelectItem = (data: SimpleNode) => {
    context_item.value = data;
    console.error(context_item.value);
  };

  const selectNode = async (data: SimpleNode) => {
    activeItem.value = data;
    // const conn = manager.get(data.meta?.Param.serverKey);

    if (data.type == NodeType.Database && !data.runtime?.load) {
      console.warn('Load database');

      try {
        const conn = manager.get(data.meta?.Param.serverKey);

        // console.log("SELECT * FROM `information_schema`.`TABLES` WHERE `TABLE_SCHEMA` = '" + data.title + "'");
        const resp = await conn.query(
          "SELECT * FROM `information_schema`.`TABLES` WHERE `TABLE_SCHEMA` = '" + data.title + "'",
          []
        );
        let tabGroup: SimpleNode = {
          id: 'tables_' + data.title + '_groups',
          title: '表格',
          icon: 'table',
          type: NodeType.TableGroup,
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

        const param = nodeMaps[data.id].meta.Param;
        for (let row of resp.data) {
          tabGroup.children?.push({
            id: 'table_' + row.TABLE_NAME,
            title: row.TABLE_NAME,
            type: NodeType.Table,
            icon: 'table',
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
        nodeMaps[data.id].runtime.load = true;
        nodeMaps[data.id].children = [tabGroup];

        nodeMaps = getNodes(root);
        console.log(nodeMaps);
      } catch (err: any) {
        console.log(err.message);
      }
    } else if (data.type == NodeType.Table) {
      const conn = manager.get(data.meta?.Param.serverKey);

      const resp = await conn.query('SELECT * FROM ' + data.meta?.DatabaseName + '.' + data.title + ' LIMIT 10', []);
      emits('select-table', resp);
    }
  };

  const connect = async (data: SimpleNode) => {
    console.error(data);
    const base = root[0];

    if (nodeMaps[data.id].runtime.load) {
      nodeMaps[data.id].runtime.load = false;
      nodeMaps[data.id].children = [];
    } else {
      const conn = manager.get(data.title);

      try {
        const resp = await conn.query('SELECT * FROM `information_schema`.`SCHEMATA`', []);
        console.log(resp);
        // console.log(root[0]?.children[0]);
        nodeMaps[data.id].children = [];
        for (let row of resp.data) {
          nodeMaps[data.id].children.push({
            id: 'db_' + row.SCHEMA_NAME,
            icon: 'database',
            title: row.SCHEMA_NAME,
            type: NodeType.Database,
            runtime: { load: false },
            meta: {
              NodeId: 'db_' + row.SCHEMA_NAME,
              Param: {
                serverId: data.id,
                serverKey: data.title,
              },
            },
            children: [],
          });
          nodeMaps[data.id].runtime.load = true;
        }
        nodeMaps = getNodes(root);
        console.log(nodeMaps);
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };
</script>

<template>
  <div class="tree" v-contextmenu:contextmenu>
    <TreeNode
      @connect="connect"
      @select="selectNode"
      @contextselect="contextSelectItem"
      v-for="(item, index) in root"
      isFold
      :active="activeItem"
      :item="item"
    ></TreeNode>

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

<style scoped>
  .tree {
    /* width: calc(100% - 2px); */
    /* border-right: 1px solid #ececec; */

    padding: 4px;
    margin: 0px;
    cursor: default;
  }
</style>
