import MySQL from '~/utils/connect/MySQL';
import { useServerStore } from '~/store/modules/server';

export default class Manager {
  links: Record<string, MySQL>;
  constructor() {
    this.links = {};
  }

  get(name: string): MySQL {
    if (!this.links[name]) {
      const serverStore = useServerStore();
      const connect = serverStore.getConnect(name);
      this.links[name] = new MySQL(connect.host, connect.user, connect.password, connect.database, connect.port);
      this.links[name].connect();
    }

    return this.links[name];
  }
}
