export interface Column {
  name: string;
  data: string;
  label: string;
  desc?: string;
  type: string;
  source?: string[];
  renderer?: any;
  dateFormat?: string;
  timeFormat?: string;
  numericFormat?: any;
  datePickerConfig?: any;
}

export function formatRow(row: any) {
  let result: Record<string, any> = {};
  for (let key of Object.keys(row)) {
    let val = row[key];
    // console.error(key, val);
    if (typeof val == 'object') {
      if (val instanceof Date) {
        result[key] = val.toLocaleDateString();
      } else if (val instanceof Buffer) {
        result[key] = val.readInt8();
      } else {
        result[key] = val;
      }
    } else {
      result[key] = val;
    }
  }

  return result;
}

export function formatField(field: any) {
  let f: Column = { name: field.Field, data: field.Field, type: 'text', desc: field.Comment, label: field.Field };
  let extparam = '';
  let reg = new RegExp(/\((.+)\)/g);
  let regRe = reg.exec(field.Type);
  let type = '';
  if (regRe) {
    type = field.Type.substring(0, regRe.index);
    extparam = regRe[1];
  } else {
    type = field.Type;
  }

  if (type == 'timestamp' || type == 'date' || type == 'datetime') {
    f.type = 'date';
    f.dateFormat = 'YYYY/MM/DD';
  } else if (type == 'time') {
    f.type = 'time';
    f.timeFormat = 'hh:mm:ss';
    // f.correctFormat = true;
  } else if (type == 'enum') {
    f.type = 'dropdown';
    let dropdownList = extparam.split(',').map((item: string) => {
      return item.substring(1, item.length - 1);
    });
    f.source = dropdownList;
  }

  return f;
}
