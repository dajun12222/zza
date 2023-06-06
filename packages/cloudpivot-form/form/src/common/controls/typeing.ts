/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { DataItemType } from '../.././schema';
export interface RelevanceFormSearchParams {
  code: string;
  type: DataItemType;
  value: any;
}

export interface RelevanceFormSearchResult {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Segment<T> {
  total: number;

  data: T[];
}
