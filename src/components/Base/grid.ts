export interface Column {
  name: string;
  label: string;
  desc?: string;
  type: string;
  renderer?: any;
  dateFormat?: string;
  numericFormat?: any;
  datePickerConfig?: any;
}
