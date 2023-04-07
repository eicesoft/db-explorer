import { defineStore } from 'pinia';

export interface IHistory {
  sql: string;
  flag: boolean;
  error?: any;
  rows?: number;
  elapsed: number;
  date: Date;
}

export interface IHistoryState {
  historys: IHistory[];
}

export const useHistoryStore = defineStore({
  id: 'app-history',
  state: (): IHistoryState => ({
    historys: [],
  }),
  getters: {
    inverted(state) {
      return state.historys.reverse();
    },
  },
  actions: {
    clear() {
      this.historys = [];
    },
    add(history: IHistory) {
      this.historys.push(history);
    },
  },
});
