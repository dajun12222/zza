/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/* global CodeMirror  */
import * as SharedFormulaCompiler from '../../formula-compiler/index';
import CodeMirror from 'codemirror';

export interface MarkField {
  // @ts-ignore
  from: CodeMirror.Position;
  // @ts-ignore
  to: CodeMirror.Position;
  field: SharedFormulaCompiler.Formula.Field; // 字段
  invalid: boolean; // 是否是有效字段
}
// @ts-ignore
export interface FixCodeMirrorEditor extends CodeMirror.Editor {
  showHint: () => void;
  display: any;
}
