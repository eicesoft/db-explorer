import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { SimpleNode, NodeType } from '~/components/ConnectManager/index';
import { useServerStore } from '~/store/modules/server';
import { uuid } from '~/utils/index';

export interface ITreeState {
  root: SimpleNode | null;
  keyword: string;
}

const filterTree = (root: any, filterText: string) => {
  if (root.type == NodeType.Table) {
    console.error(root.title);
    if (root.title.includes(filterText)) {
      if (root.children) {
        const filteredChildren = root.children
          .map((child: any) => filterTree(child, filterText))
          .filter((child: any) => child !== null);
        return { ...root, children: filteredChildren };
      } else {
        return root;
      }
    } else {
      return null;
    }
  } else {
    // root.children = filteredChildren;
    const filteredChildren = root.children
      .map((child: any) => filterTree(child, filterText))
      .filter((child: any) => child !== null);
    return { ...root, children: filteredChildren };
  }
};

export const useTreeStore = defineStore({
  id: 'app-tree',
  state: (): ITreeState => ({
    root: null,
    keyword: '',
  }),
  getters: {
    filters: (state) => {
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

      this.root = {
        id: '_root',
        title: t('message.tree.connect'),
        icon: 'home',
        type: NodeType.Root,
        selectable: false,
        expand: true,
        isLeaf: false,
        children: [],
      };
      const serverStore = useServerStore();

      for (let key of Object.keys(serverStore.links)) {
        const connect = serverStore.getConnect(key);
        let id = 'server_' + uuid();
        this.root.children?.push({
          id: id,
          icon: 'server',
          title: key,
          type: NodeType.Server,
          selectable: true,
          isLeaf: false,
          expand: false,
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
    add(key: string) {
      const serverStore = useServerStore();
      const connect = serverStore.getConnect(key);
      let id = 'server_' + uuid();
      this.root?.children?.push({
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
    },
    remove(key: string) {
      for (let i in this.root.children) {
        let children = this.root?.children[i];
        if (children.title == key) {
          this.root.children.splice(i, 1);
        }
      }
    },
    setKeyword(key: string) {
      this.keyword = key;
    },
  },
});
