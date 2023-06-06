/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { PropertyTypes } from './enums';

/**
 * 查询字段
 */
export interface QueryCondition {
  choiceType: number;
  defaultValue: string;
  displayType: number;
  endValue: string;
  name: string;
  name_i18n: string;
  options: string;
  propertyCode: string;
  propertyType: PropertyTypes;
  schemaCode: string;
  sortKey: number;
  startValue: string;
  [key: string]: any;
}
