/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/**
 * AST 语法树转换声明
 */

export interface ElementAttr {
  name: string;
  value: string;
}

export interface ActionElement {
  text: string;
  code: string;
  class?: string;
  sort: number;
}
