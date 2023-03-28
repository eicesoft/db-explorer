import { defineStore } from 'pinia';
// import Store from 'electron-store';

// const store = new Store();

export interface ISetupState {
  lang: string;
}

export const useSetupStore = defineStore({
  id: 'app-setup',
  state: (): ISetupState => ({
    lang: 'zh',
  }),
  getters: {
    language: (state) => {
      return state.lang;
    },
  },
  actions: {
    init() {
      // console.log(Object.keys(this));
    },
    save() {},
    set(language: string) {
      this.lang = language;
    },
  },
});
