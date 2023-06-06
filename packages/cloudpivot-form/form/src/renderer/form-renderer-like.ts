/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { FormControlErrorCodes, FormGroup } from 'cloudpivot-forms';
import { RendererFormControl } from './typings';

export interface FormRendererLike {
  readonly controller: FormGroup | undefined;

  formControlMap: { [key: string]: RendererFormControl };

  /**
   * 查找所有表单控件
   */
  findFormControls(keys?: string[]): RendererFormControl[];

  /**
   * 校验表单
   * @param excludes 不校验的控件
   */
  validate(excludes?: string[]): boolean;

  /**
   * 表单所有错误
   */
  getErrors(): any;

  /**
   * 获取错误
   * @param controlId 控件ID
   * @param errCode 错误码
   */
  getErrorMessage(controlId: string, errCode: FormControlErrorCodes): string;

  /**
   * 获取表单值对象
   */
  getValue(): any;

  /**
   * 表单重置
   */
  reset(): void;

  /**
   * 进入编辑状态
   * @param keys 指定的控件ID
   */
  edit(keys?: string[]): void;

  /**
   * 进入只读状态
   * @param keys 指定的控件ID
   */
  readonly(keys?: string[]): void;
}
