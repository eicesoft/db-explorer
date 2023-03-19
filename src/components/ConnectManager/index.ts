export enum NodeType {
  Root,
  Server,
  Database,
  TableGroup,
  Table,
  ViewGroup,
  View,
}

type Id = string | number;

export interface NodeRuntime {
  load: boolean;
  isOpen?: boolean;
}

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
  isLeaf: boolean;
  children?: Array<SimpleNode>;
  runtime?: NodeRuntime;
  meta?: Meta;
}
