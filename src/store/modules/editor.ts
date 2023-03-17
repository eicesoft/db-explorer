import { defineStore } from 'pinia';
import { Tab, Id } from '~/components/Tabber/index';

export interface IEditorState {
  tabs: Array<Tab>;
  active_id: Id;
}

export const useEditorStore = defineStore({
  id: 'app-editor',
  state: (): IEditorState => ({
    tabs: [],
    active_id: null,
  }),
  getters: {
    tabs: (state) => {
      return state.tabs;
    },
  },
  actions: {
    add(tab: Tab) {
      let ids = this.tabs.map((i) => i.id);
      if (!ids.includes(tab.id)) {
        this.tabs.push(tab);
      }
    },
    active(tab: Tab) {
      this.active_id = tab.id;
    },
  },
});
