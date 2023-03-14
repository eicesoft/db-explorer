export enum TabType {
  Query = 1,
  Table,
  TableDesign,
  TableiInformation,
  Database,
}

export interface Tab {
  id: string;
  title: string;
  type: TabType;
  meta?: Record<string, any>;
}
