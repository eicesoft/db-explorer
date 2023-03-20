export enum TabType {
  Query = 1,
  Table,
  TableDesign,
  Database,
  ViewDesign,
}

export type Id = string | number | null;

export interface Tab {
  id: Id;
  title: string;
  type: TabType;
  lock?: boolean;
  meta?: Record<string, any>;
}
