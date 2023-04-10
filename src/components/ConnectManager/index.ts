export enum NodeType {
  Root,
  Server,
  Database,
  TableGroup,
  Table,
  EmptyTable,
  ViewGroup,
  View,
}

type Id = string | number;

export interface Meta {
  NodeId?: Id;
  DatabaseName?: string;
  Param: any;
}

export interface SimpleNode {
  id: Id;
  title: string;
  icon: string;
  type: NodeType;
  selectable: boolean;
  expand: boolean;
  isLeaf: boolean;
  switcherIcon?: Function;
  children?: Array<SimpleNode>;
  meta?: Meta;
}

export interface MetaNode {
  id: string;
  tableName?: string;
  database?: string;
  serverKey: string;
}
