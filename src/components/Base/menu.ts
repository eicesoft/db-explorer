export enum MenuKeys {
  /** 系统 */
  NewConnection = 1,
  LoadFile,

  /** 编辑 */
  Refresh,

  /** 数据库 */
  NewDatabase,

  /** 工具 */
  Option,

  /** 帮助 */
  About,
  Unknonw,
}

export interface Menu {
  title: string;
  children: Menu[];
  key?: MenuKeys;
  disabled?: Function;
  icon?: string;
}
