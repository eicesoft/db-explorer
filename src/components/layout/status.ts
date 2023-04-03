export interface StatusInfo {
  version: string;
  serverName?: string;
  database?: string;
  queryCount: number;
  language: string;
  window: {
    bodyHeight: number;
    bodyWidth: number;
  };
}
