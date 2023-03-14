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

export const useConnectStore = defineStore({
  id: 'app-connects',
  state: (): IConnectsState => ({
    links: {},
  }),
  getters: {},
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
    getConnect(name: string): IConnectState | null {
      return this.links[name] ?? null;
    },
  },
  persist: {
    enabled: true,
  },
});
