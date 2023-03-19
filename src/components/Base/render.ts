interface Renderer {
  eGui: HTMLSpanElement;
}

export default class DefaultRenderer implements Renderer {
  eGui: HTMLSpanElement | undefined;
  //   eGui: HTMLSpanElement;
  init(params: any) {
    this.eGui = document.createElement('span');
    // console.log(params);
    let displayValue;
    if (params.value !== null) {
      if (typeof params.value == 'number') {
        displayValue = params.value;
        this.eGui.classList.add('cell-value-number');
      } else if (typeof params.value == 'object') {
        if (params.value instanceof Date) {
          displayValue = params.value.toLocaleString();
          this.eGui.classList.add('cell-value-date');
        } else if (params.value instanceof Buffer) {
          displayValue = params.value.readUint8();
          this.eGui.classList.add('cell-value-boolean');
        } else {
          displayValue = params.value;
        }
      } else if (typeof params.value == 'string') {
        displayValue = params.value;
        this.eGui.classList.add('cell-value-string');
      } else if (typeof params.value == 'boolean') {
        displayValue = params.value;
        this.eGui.classList.add('cell-value-boolean');
      } else {
        displayValue = params.value;
      }
    } else {
      displayValue = '(NULL)';
      this.eGui.classList.add('cell-value-null');
    }
    this.eGui.innerHTML = displayValue;
  }

  getGui() {
    return this.eGui;
  }

  refresh(params: any) {
    return false;
  }
}
