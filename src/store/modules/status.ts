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
    window: {
      bodyHeight: 0,
      bodyWidth: 0,
    },
  }),
  getters: {
    // language: (state) => {
    //   return state.lang;
    // },
  },
  actions: {
    init() {
      this.version = packageInfo.version;
      this.language = localStorage.getItem('sql-locale') || 'zh';
    },
    setDatabase(database: string | undefined) {
      this.database = database;
    },
    setServer(sereverName: string | undefined) {
      this.serverName = sereverName;
    },
    setLang(val: string) {
      this.language = val;
    },
    setWindow(width: number, height: number) {
      this.window = {
        bodyWidth: width,
        bodyHeight: height,
      };
    },
    addQuery() {
      this.queryCount++;
    },
  },
});
