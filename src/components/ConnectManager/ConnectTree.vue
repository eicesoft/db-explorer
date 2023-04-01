<script setup lang="ts">
  import { ref, h, computed } from 'vue';
  import { getImageRes } from '~/utils/res';

  import { Icon } from '@arco-design/web-vue';

  import { SimpleNode, NodeType } from './index';
  import { useTreeStore } from '~/store/modules/tree';
  import { useStatausStore } from '~/store/modules/status';

  import Manager from '~/utils/link_manager';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const props = defineProps({
    height: { type: Number, default: 24 },
  });

  const rootNode = computed(() => {
    return [treeStore.filters];
  });

  const emits = defineEmits<{
    (e: 'select-table', value: any): void;
    (e: 'select-database', value: any): void;
    (e: 'open-database', value: any): void;
    (e: 'menu-select', menu_key: string, value: any): void;
  }>();

  const IconFont = Icon.addFromIconFontCn({
    src: getImageRes('iconfont/iconfont.js'),
  });
  // console.log(IconFont);
  const manager: Manager = Manager.getInstance();
  const treeStore = useTreeStore();
  const statusStore = useStatausStore();
  treeStore.init();

  const loadMore = async (data: any) => {
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
            selectable: true,
            meta: {
              NodeId: data.id,
              DatabaseName: data.title,
              Param: {
                serverId: param.serverId,
                serverKey: param.serverKey,
              },
            },
            children: null,
          });
        }
        data.children = [tabGroup];
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
        data.children = [];
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

  const selectNode = async (key: any, data: any) => {
    // console.error(data);
    if (data.node.type == NodeType.Table) {
      emits('select-table', data.node);
    } else if (data.node.type == NodeType.Database) {
      emits('select-database', data.node);
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

  const openDatabase = (node: SimpleNode) => {
    emits('open-database', node);
  };

  const addDatabase = (node: any) => {};
  const removeServer = (node: any) => {
    emits('menu-select', 'remove-server', node);
  };
</script>

<template>
  <div class="tree">
    <div class="search-div">
      <a-input-search
        @search="searchTree"
        @press-enter="searchTree"
        class="search-text"
        placeholder="输入进行过滤"
        size="mini"
        v-model="searchKey"
      />
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
        buffer: 15,
      }"
      :show-line="true"
      :load-more="loadMore"
      :data="rootNode"
    >
      <template #title="nodeData">
        <a-dropdown size="mini" trigger="contextMenu" alignPoint :style="{ display: 'block' }">
          <template
            v-if="
              nodeData.type == NodeType.Server ||
              (nodeData.type == NodeType.TableGroup && nodeData.children?.length != 0)
            "
          >
            <div>{{ nodeData?.title }}</div>
          </template>
          <template v-else-if="nodeData.type == NodeType.Database">
            <div @dblclick="openDatabase(nodeData)">{{ nodeData?.title }}</div>
          </template>
          <template v-else>
            <div>{{ nodeData?.title }}</div>
          </template>

          <template #content>
            <template v-if="nodeData.type == NodeType.Table">
              <a-doption>打开表格</a-doption>
              <a-doption>设计表结果</a-doption>
              <a-doption>重命名</a-doption>
              <a-divider margin="4px" />

              <a-dsubmenu value="more" trigger="hover">
                <template #default>更多操作</template>
                <template #content>
                  <a-doption>截断</a-doption>
                  <a-doption>删除</a-doption>
                  <a-doption>优化表</a-doption>
                </template>
              </a-dsubmenu>
              <a-divider margin="4px" />
              <a-doption>导出</a-doption>
              <a-doption>导入</a-doption>
            </template>

            <template v-else-if="nodeData.type == NodeType.Database">
              <a-doption>新建查询</a-doption>
              <a-dsubmenu value="more" trigger="hover">
                <template #default>添加</template>
                <template #content>
                  <a-doption>表格</a-doption>
                  <a-doption>视图</a-doption>
                  <a-doption>存储过程</a-doption>
                </template>
              </a-dsubmenu>
            </template>

            <template v-else-if="nodeData.type == NodeType.Server">
              <a-doption @click="addDatabase(nodeData)">添加数据库</a-doption>
              <a-doption @click="removeServer(nodeData)"> 移除服务器</a-doption>
            </template>
          </template>

          <template v-if="nodeData.type == NodeType.Database"> </template>
        </a-dropdown>
      </template>
      <!-- </template> -->

      <template #icon="data">
        <!-- <img :src="getIconRes(data.node.icon + '.png')" /> -->
        <icon-font v-if="data.node.icon" :type="'icon-' + data.node.icon" :size="20" />
      </template>
    </a-tree>
  </div>
</template>

<style lang="less">
  .arco-tree-node-disabled-selectable {
    .arco-tree-node-title {
      color: var(--color-text-1) !important;
      font-style: italic !important;
      cursor: default !important;
    }
  }
</style>

<style lang="less" scoped>
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
