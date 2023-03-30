export enum DialogButton {
  Ok = 1 << 0,
  Cancel = 1 << 1,
  Close = 1 << 2,
}

export enum DialogResult {
  Enter = 1,
  Cancel,
  Close,
}
