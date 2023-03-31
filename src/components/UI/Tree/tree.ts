export interface TreeProp {
  node?: TreeNode;
  loadmore?: Function;
}

export interface TreeNodeProp {
  node: TreeNode;
  active?: TreeNode;
  loadmore?: Function;
}

export interface TreeNode {
  id: string | number;
  title: string;
  icon: string;
  type: any;
  selectable: boolean;
  expanded: boolean;
  isLeaf: boolean;
  children?: Array<TreeNode>;
  runtime?: Record<string, any>;
}
