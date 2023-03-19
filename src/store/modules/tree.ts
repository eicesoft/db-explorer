import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { SimpleNode, NodeType } from '~/components/ConnectManager/index';
import { useServerStore } from '~/store/modules/server';
import { uuid } from '~/utils/index';

export interface ITreeState {
  root: SimpleNode[];
}

export const useTreeStore = defineStore({
  id: 'app-tree',
  state: (): ITreeState => ({
    root: [],
  }),
  getters: {
    // language: (state) => {
    //   return state.lang;
    // },
  },
  actions: {
    init() {
      const { t } = useI18n();

      this.root.push({
        id: '_root',
        title: t('message.tree.connect'),
        icon: 'home',
        type: NodeType.Root,
        selectable: false,
        isLeaf: false,
        children: [],
      });

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
    // set(language: string) {
    //   this.lang = language;
    // },
  },
});
