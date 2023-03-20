import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { SimpleNode, NodeType } from '~/components/ConnectManager/index';
import { useServerStore } from '~/store/modules/server';
import { uuid } from '~/utils/index';

export interface ITreeState {
  root: SimpleNode[];
  keyword: string;
}

const filterTree = (tree: any, keyword: string) => {
  return tree.filter((node: any) => {
    const title = node.title.toLowerCase();
    const type = node.type;
    console.log('title', title, type, title.includes(keyword.toLowerCase()));
    const filteredChildren = filterTree(node.children || [], keyword);
    console.log('filteredChildren', title, filteredChildren);
    if (type == NodeType.Table) {
      if (title.includes(keyword.toLowerCase())) {
        return {
          ...node,
          children: filteredChildren,
        };
      }
      return [];
    } else {
      return node;
    }
  });
};

export const useTreeStore = defineStore({
  id: 'app-tree',
  state: (): ITreeState => ({
    root: [],
    keyword: '',
  }),
  getters: {
    filters: (state) => {
      console.log('filters', state.keyword);
      if (state.keyword != '') {
        return filterTree(state.root, state.keyword);
      } else {
        return state.root;
      }
    },
  },
  actions: {
    init() {
      const { t } = useI18n();

      this.root = [
        {
          id: '_root',
          title: t('message.tree.connect'),
          icon: 'home',
          type: NodeType.Root,
          selectable: false,
          isLeaf: false,
          children: [],
        },
      ];

      const serverStore = useServerStore();
      for (let key of Object.keys(serverStore.links)) {
        const connect = serverStore.getConnect(key);
        let id = 'server_' + uuid();
        this.root[0].children?.push({
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
    },
    setKeyword(key: string) {
      this.keyword = key;
    },
  },
});
