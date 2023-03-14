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
}

export interface Meta {
  NodeId?: Id;
  DatabaseName?: String;
  Param: any;
}

export interface SimpleNode {
  id: Id;
  title: string;
  icon: string;
  type: NodeType;
  children?: Array<SimpleNode>;
  runtime?: NodeRuntime;
  meta?: Meta;
}
