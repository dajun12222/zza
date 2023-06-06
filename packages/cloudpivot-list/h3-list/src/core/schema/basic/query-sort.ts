/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { PropertyTypes } from './enums';

/**
 * 排序字段
 */
export interface QuerySort {
  //名称
  name: string;
  name_i18n: string;
  //数据项编码
  propertyCode: string;
  //数据项类型
  propertyType: PropertyTypes;
  //排序
  sortKey: number;
  //其他
  [key: string]: any;
}
