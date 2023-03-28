import { defineStore } from 'pinia';
// import Store from 'electron-store';
// const store = new Store();

// import { createStorage } from '@/utils/Storage';
export interface IConnectState {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  options?: any;
}

export interface IConnectsState {
  links: Record<string, IConnectState>;
}

const SERVER_KEY = 'servers';

export const useServerStore = defineStore({
  id: 'app-server',
  state: (): IConnectsState => ({
    links: {},
  }),
  getters: {
    connects: (state) => {
      return state.links;
    },
  },
  actions: {
    load() {
      // let links = store.get(SERVER_KEY);
      // if (links) {
      //   this.links = links;
      // }
    },
    save() {
      // store.set(SERVER_KEY, this.links);
    },
    addConnect(
      name: string,
      host: string,
      user: string,
      password: string,
      database: string,
      port: number = 3306,
      options: any = {}
    ): void {
      if (!this.links[name]) {
        this.links[name] = {
          host,
          user,
          password,
          database,
          port,
          options,
        };
        this.save();
      } else {
        throw new Error('服务器名称已存在');
      }
    },
    removeConnect(key: string) {
      delete this.links[key];
      this.save();
    },
    getConnect(name: string): IConnectState {
      return this.links[name];
    },
  },
});
