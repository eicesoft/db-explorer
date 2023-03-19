<script setup lang="ts">
  import { SimpleNode } from '~/components/ConnectManager/index';
  import GridTable from '~/components/Base/GridTable.vue';
  import TableInformation from '~/components/Panel/TableInformation.vue';

  import { ref, computed, reactive, PropType, watch, nextTick } from 'vue';
  import Manager from '~/utils/link_manager';
  import { getImageRes } from '~/utils/res';
  import { useI18n } from 'vue-i18n';
  import { Icon } from '@arco-design/web-vue';

  const props = defineProps({
    node: {
      type: Object as PropType<SimpleNode>,
    },
  });

  const IconFont = Icon.addFromIconFontCn({
    src: getImageRes('iconfont/iconfont.js'),
  });
  const manager: Manager = Manager.getInstance();

  // console.error('First show', props.node);

  const pageInfo = reactive({
    page: 1,
    page_size: 500,
  });
  const fields = ref([]);
  const rows = ref([]);
  const { t } = useI18n();

  const loadPage = async () => {
    let start = (pageInfo.page - 1) * pageInfo.page_size;
    const conn = manager.get(props.node?.meta?.Param.serverKey);
    console.log('Load Page ' + pageInfo.page);

    const resp = await conn.query(
      'SELECT * FROM ' +
        props.node?.meta?.DatabaseName +
        '.' +
        props.node?.title +
        ' LIMIT ' +
        start +
        ',' +
        pageInfo.page_size,
      []
    );
    console.log(resp);

    fields.value = resp.fields;
    rows.value = resp.data;
    // gridApi.setRowData(resp.data);
    // nextTick(() => {
    //   autoResize();
    // });
  };

  loadPage();
  const rowData = computed(() => {
    return rows.value.map((item: any) => {
      return item;
    });
  });

  const isNext = computed(() => {
    if (rows.value.length == pageInfo.page_size) {
      return true;
    } else {
      return false;
    }
  });

  const previous = async () => {
    if (pageInfo.page != 1) {
      pageInfo.page--;
      await loadPage();
    }
  };

  const next = async () => {
    if (isNext) {
      pageInfo.page++;
      await loadPage();
    }
  };

  // watch(
  //   () => props.node,
  //   async () => {
  //     pageInfo.page = 1;
  //     await loadPage();
  //   },
  //   {
  //     immediate: true,
  //   }
  // );
</script>

<template>
  <div class="panel">
    <a-tabs size="mini" :position="'top'">
      <a-tab-pane key="data">
        <template #title>
          <icon-font class="iconfont" type="icon-table" size="14" /><span style="margin-left: 6px">{{
            t('message.tablepanel.data')
          }}</span></template
        >
        <div class="toolbar">
          <div></div>
          <div class="toolbar-right">
            <div :class="{ disable: pageInfo.page == 1 }" class="icon" @click="previous">◀</div>
            <input size="2" v-model="pageInfo.page" class="text-number" type="number" />
            <div :class="{ disable: !isNext }" class="icon" @click="next">▶</div>
          </div>
        </div>

        <GridTable :rows="rowData" :fields="fields" />
      </a-tab-pane>
      <a-tab-pane key="info">
        <template #title>
          <icon-font class="iconfont" type="icon-infomation" size="14" /><span style="margin-left: 6px">{{
            t('message.tablepanel.info')
          }}</span></template
        >
        <TableInformation
          :server-key="node?.meta?.Param.serverKey"
          :database="node?.meta?.DatabaseName"
          :table="node?.title"
        />
      </a-tab-pane>
    </a-tabs>

    <!-- <v-contextmenu ref="contextmenu">
      <v-contextmenu-item>删除选择行</v-contextmenu-item>
      <v-contextmenu-divider />
      <v-contextmenu-item @click="copyData">复制数据</v-contextmenu-item>
      <v-contextmenu-item>复制为SQL</v-contextmenu-item>
      <v-contextmenu-item>复制全部</v-contextmenu-item>
      <v-contextmenu-divider />
      <v-contextmenu-item @click="exportData">导出数据</v-contextmenu-item>
    </v-contextmenu> -->
  </div>
</template>

<style lang="scss">
  .panel {
    .arco-tabs-content {
      padding-top: 0px !important;
    }
  }
</style>

<style lang="scss" scoped>
  :deep(.hljs) {
    border-radius: 6px;
    border: 1px solid #ececec;
  }
  .panel {
    height: calc(var(--bodyHeight) - 36px);
    width: var(--bodyWidth);

    .toolbar {
      height: 28px;
      line-height: 28px;
      display: flex;
      justify-content: space-between;
      background-color: rgb(245, 245, 245);
      .toolbar-right {
        display: flex;
        .disable {
          color: rgb(207, 207, 207);
          cursor: not-allowed;
        }
      }
    }
  }
</style>
