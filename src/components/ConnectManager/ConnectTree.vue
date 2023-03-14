<script setup lang="ts">
  import { ref } from 'vue';
  import TreeNode from './TreeNode.vue';
  import { SimpleNode } from './index';
  import { NodeType } from './index';
  import { useConnectStore } from '~/store/modules/connect';
  const connects = useConnectStore();
  console.error(connects.getConnect('qqq'));
  let data = ref<SimpleNode[]>([
    {
      id: 0,
      title: '连接',
      icon: 'home',
      type: NodeType.Root,
      children: [
        {
          id: 1,
          icon: 'server',
          title: 'Test',
          type: NodeType.Server,
          runtime: {
            load: false,
          },
          meta: {
            NodeId: 1,
            Param: {
              host: '192.168.1.25',
              user: 'root',
              password: 'HundyG63gF%42sdf',
              database: 'charge',
            },
          },
          children: [
            // {
            //   id: 4,
            //   icon: 'database',
            //   title: 'hb_bi',
            //   type: NodeType.Database,
            //   children: [
            //     {
            //       id: 5,
            //       icon: 'table',
            //       title: '表格',
            //       type: NodeType.TableGroup,
            //       children: [
            //         {
            //           id: 12,
            //           icon: 'table',
            //           title: 'account',
            //           type: NodeType.Table,
            //         },
            //       ],
            //     },
            //     { id: 6, icon: 'view', title: '视图', type: NodeType.ViewGroup, children: [] },
            //   ],
            // },
          ],
        },
        {
          id: 2,
          icon: 'server',
          title: 'Dev',
          type: NodeType.Server,
          runtime: { load: false },
        },
      ],
    },
  ]);
  const context_item = ref<SimpleNode | null>(null);
  const activeItem = ref<SimpleNode | null>();
  const contextSelectItem = (data: SimpleNode) => {
    context_item.value = data;
    console.error(context_item.value);
  };

  const selectNode = (data: SimpleNode) => {
    activeItem.value = data;
    console.error(data);
  };
</script>

<template>
  <div class="tree" v-contextmenu:contextmenu>
    <TreeNode
      @select="selectNode"
      @contextselect="contextSelectItem"
      v-for="(item, index) in data"
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
