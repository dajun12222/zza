/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { DateControl } from 'cloudpivot-forms';
import * as typings from '../.././../schema';
import { InputControl } from './input-control';
export abstract class DateInputControl extends InputControl<typings.DateOptions> {
  get showTime() {
    const format = [
      'YYYY-MM-DD HH:mm',
      'YYYY-MM-DD HH:mm:ss',
      'HH:mm:ss',
      'HH:mm',
    ];
    if (this.controlOpts.format1 === 'YYYY-MM-DD HH:mm') {
      return { format: 'HH:mm' };
    } else {
      return format.indexOf(this.controlOpts.format1) > -1;
    }
  }

  get timeType() {
    return ['HH:mm:ss', 'HH:mm'].indexOf(this.controlOpts.format1) > -1;
  }

  get showMonth() {
    return (
      (this.controlOpts.format1 || this.controlOpts.format).toUpperCase() ===
      'YYYY-MM'
    );
  }

  get format() {
    let format = this.controlOpts.format1;
    if (!format) {
      return 'YYYY-MM-DD';
    }

    if (this.timePicker) {
      return format;
    }

    const idx = format.indexOf(' ');
    if (idx === -1) {
      return format.toUpperCase();
    }
    format = format.substr(0, idx).toUpperCase() + format.substr(idx);
    return format;
  }

  get timePicker() {
    const format = this.controlOpts.format1;
    const type = ['HH:mm:ss', 'HH:mm'];
    return type.some((v) => v === format);
  }

  get dateCtrl() {
    return this.ctrl as DateControl;
  }

  // get text(){
  //   if(this.ctrl.value){
  //     return dateFormatter(this.ctrl.value, this.format);
  //   }
  // }
}
