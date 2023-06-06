/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { TimeControl } from 'cloudpivot-forms';
import * as typings from '../.././../schema';
import { InputControl } from './input-control';
export abstract class TimeInputControl extends InputControl<typings.TimeOptions> {
  get format() {
    const format = this.controlOpts.format1;
    if (!format) {
      return 'HH:mm:ss';
    }
    return format;
  }

  get timeCtrl() {
    return this.ctrl as TimeControl;
  }

  // get text(){
  //   if(this.ctrl.value){
  //     return dateFormatter(this.ctrl.value, this.format);
  //   }
  // }
}
