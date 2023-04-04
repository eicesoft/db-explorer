<script setup lang="ts">
  import { SimpleNode } from '~/components/ConnectManager/index';
  import { ref, computed, reactive, PropType, watch, onMounted } from 'vue';
  import Manager from '~/utils/link_manager';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { useStatausStore } from '~/store/modules/status';
  import { formatRow, formatField } from '~/components/Base/grid';

  const props = defineProps({
    node: {
      type: Object as PropType<SimpleNode>,
    },
  });

  const manager: Manager = Manager.getInstance();
  const condition = ref('');
  const loading = ref(false);

  // console.error('First show', props.node);

  const pageInfo = reactive({
    page: 1,
    page_size: 500,
  });
  const fields = ref([]);
  const rows = ref([]);
  const { t } = useI18n();

  const loadPage = async () => {
    loading.value = true;
    let start = (pageInfo.page - 1) * pageInfo.page_size;
    const conn = manager.get(props.node?.meta?.Param.serverKey);
    console.log('Load Page ' + pageInfo.page);

    let where = '';
    if (condition.value) {
      where = ' WHERE ' + condition.value;
    }

    try {
      const resp = await conn.query(
        'SELECT * FROM ' +
          props.node?.meta?.DatabaseName +
          '.' +
          props.node?.title +
          where +
          ' LIMIT ' +
          start +
          ',' +
          pageInfo.page_size,
        []
      );
      console.log(resp);
      rows.value = resp.data;

      const fieldsResp = await conn.getTableFields(props.node?.meta?.DatabaseName, props.node?.title);
      console.log(fieldsResp);
      fields.value = fieldsResp.data.map((field: any) => {
        return formatField(field);
      });

      console.log(fields);
      loading.value = false;
      // fields.value = resp.fields;
    } catch (e: any) {
      Message.error(e.toString());
    }
  };

  loadPage();
  const rowData = computed(() => {
    return rows.value.map((item: any) => {
      // console.warn(item);
      return formatRow(item);
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
    if (isNext.value) {
      pageInfo.page++;
      await loadPage();
    }
  };

  const refresh = async () => {
    await loadPage();
  };

  const statusStore = useStatausStore();

  const gridHeight = computed(() => {
    return statusStore.window.bodyHeight - 38 - 28 - 34;
  });

  const doSearch = () => {
    loadPage();
  };
</script>

<template>
  <div class="panel">
    <a-tabs size="mini" :position="'top'">
      <a-tab-pane key="data">
        <template #title>
          <div class="tab-title">
            <IceIcon :size="14" icon="table" />
            <span style="margin-left: 6px">{{ t('message.tablepanel.data') }}</span>
          </div>
        </template>
        <div class="toolbar">
          <div class="toolbar-left">
            <!-- -->

            <!-- <a-input
              v-model="condition"
              @press-enter="doSearch"
              size="mini"
              :style="{ width: '340px' }"
              placeholder="请输入过滤条件 id=?"
              allow-clear
            /> -->
            <IceInput
              @search="doSearch"
              :style="{ width: '440px' }"
              :placeholder="'请输入过滤条件 id=?'"
              v-model="condition"
            />
          </div>
          <div class="toolbar-right">
            <IceIcon @click="refresh" icon="refresh" :size="18" />

            <div :class="{ disable: pageInfo.page == 1 }" class="icon" @click="previous">◀</div>
            <input size="2" v-model="pageInfo.page" class="text-number" type="number" />
            <div :class="{ disable: !isNext }" class="icon" @click="next">▶</div>
          </div>
        </div>

        <GridTable
          :loading="loading"
          class="gridTable"
          :setting="{ height: gridHeight }"
          :columns="fields"
          :datas="rowData"
        />
      </a-tab-pane>

      <a-tab-pane key="info">
        <template #title>
          <!-- <icon-font class="iconfont" type="icon-infomation" size="14" /> -->
          <div class="tab-title">
            <IceIcon :size="14" icon="infomation" />
            <span style="margin-left: 6px">{{ t('message.tablepanel.info') }}</span>
          </div>
        </template>
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

<style lang="less">
  .panel {
    .arco-tabs-content {
      padding-top: 0px !important;
    }
  }
</style>

<style lang="less" scoped>
  :deep(.hljs) {
    border-radius: 6px;
    border: 1px solid #ececec;
  }

  .panel {
    height: calc(var(--bodyHeight) - 36px);
    width: var(--bodyWidth);
    .tab-title {
      display: flex;
      align-items: center;
    }

    .toolbar {
      height: 28px;
      line-height: 28px;
      display: flex;
      justify-content: space-between;
      background-color: rgb(245, 245, 245);
      color: #555555;
      &:hover {
        color: #838383;
      }
      .toolbar-left {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 28px;
        margin: 0 4px;
      }
      .toolbar-right {
        display: flex;
        align-items: center;
        .disable {
          color: rgb(207, 207, 207);
          cursor: not-allowed;
        }
      }
    }
  }
</style>
