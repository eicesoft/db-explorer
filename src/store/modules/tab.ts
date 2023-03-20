import { defineStore } from 'pinia';
import { Tab } from '~/components/Tabber/index';

export interface ITabState {
  tabs: Tab[];
  activeTab: Tab | null;
}
export const useTabStore = defineStore({
  id: 'app-tab',
  state: (): ITabState => ({
    tabs: [],
    activeTab: null,
  }),
  getters: {
    // tabs(state: ITabState) {
    //   return state.tabs;
    // },
    isEmpty(): boolean {
      return this.tabs.length === 0;
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
      this.activeTab = tab;
    },
    remove(tab: Tab) {
      for (let i in this.tabs) {
        let t = this.tabs[i];
        if (t.id == tab.id) {
          console.error('remove', i, tab.id, t.id);
          this.tabs.splice(i, 1);
          if (this.tabs.length != 0) {
            if (i != 0) {
              this.activeTab = this.tabs[i - 1];
            } else {
              this.activeTab = this.tabs[0];
            }
          }
        }
      }
    },
    removeOther(tab: Tab) {
      let newTabs: Tab[] = [];
      for (let i in this.tabs) {
        let t = this.tabs[i];
        if (t.id == tab.id || t.lock) {
          newTabs.push(t);
        }
      }
      this.tabs = newTabs;

      if (this.tabs.length != 0) {
        this.activeTab = this.tabs[this.tabs.length - 1];
      }
    },
    removeAll() {
      let newTabs: Tab[] = [];
      for (let i in this.tabs) {
        let t = this.tabs[i];
        // console.log(t);
        if (t.lock) {
          newTabs.push(t);
        }
      }
      this.tabs = newTabs;

      if (this.tabs.length != 0) {
        this.activeTab = this.tabs[this.tabs.length - 1];
      }
    },
  },
});
