import { defineStore } from 'pinia';
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
    addConnect(
      name: string,
      host: string,
      user: string,
      password: string,
      database: string,
      port: number = 3306,
      options: any = {}
    ): void {
      this.links[name] = {
        host,
        user,
        password,
        database,
        port,
        options,
      };
    },
    getConnect(name: string): IConnectState {
      return this.links[name];
    },
  },
  persist: {
    enabled: true,
  },
});
