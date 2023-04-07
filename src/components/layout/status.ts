export interface StatusInfo {
  version: string;
  productName: string;
  serverName?: string;
  database?: string;
  queryCount: number;
  language: string;
  window: {
    bodyHeight: number;
    bodyWidth: number;
  };
}
