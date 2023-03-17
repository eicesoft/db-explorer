export enum TabType {
  Query = 1,
  Table,
  TableDesign,
  Database,
}

export type Id = string | number | null;

export interface Tab {
  id: Id;
  title: string;
  type: TabType;
  meta?: Record<string, any>;
}