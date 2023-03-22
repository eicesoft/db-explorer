import { defineStore } from 'pinia';
import { StatusInfo } from '~/components/layout/status';
import packageInfo from '~/../package.json';

export const useStatausStore = defineStore({
  id: 'app-status',
  state: (): StatusInfo => ({
    version: '',
    serverName: undefined,
    database: undefined,
    queryCount: 0,
    language: '',
  }),
  getters: {
    // language: (state) => {
    //   return state.lang;
    // },
  },
  actions: {
    init() {
      this.version = packageInfo.version;
    },
    setDatabase(database: string | undefined) {
      this.database = database;
    },
    setServer(sereverName: string | undefined) {
      this.serverName = sereverName;
    },
    addQuery() {
      this.queryCount++;
    },
  },
});
