import { defineStore } from 'pinia';
import { Tab, Id } from '~/components/Tabber/index';

export interface ITabState {
  tabs: Array<Tab>;
  active_id: Id;
}
export const useTabStore = defineStore({
  id: 'app-tab',
  state: (): ITabState => ({
    tabs: [],
    active_id: null,
  }),

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
