/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { InputControlOptions } from '../.././../schema';
import { BaseControl } from '../base-control';
export abstract class InputControl<
  T extends InputControlOptions,
> extends BaseControl<T> {
  get placeholder() {
    //只读状态下不显示提示文字
    return !this.readonlyFormula
      ? (this.controlOpts as any).placeholder || '请选择'
      : '';
  }
}
