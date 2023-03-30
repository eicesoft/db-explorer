export interface TreeProp {
  node?: TreeNode;
}

export interface TreeNode {
  id: string | number;
  title: string;
  icon: string;
  selectable: boolean;
  isLeaf: boolean;
  children?: Array<TreeNode>;
  runtime?: Record<string, any>;
}
