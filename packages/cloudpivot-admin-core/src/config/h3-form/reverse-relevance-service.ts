/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import { renderer } from 'cloudpivot-form/form';

export class DefaultReverseRelevanceService
  implements renderer.ReverseRelevanceService
{
  getAll(
    schemaCode: string,
    reverseCode: string,
    reverseSchemaCode: string,
    formCode: string,
    field: {
      code: string;
      type: number;
      value: any;
    }[],
  ) {
    return Promise.resolve([]);
  }

  open(schemaCode: string, item: any) {}

  search(
    schemaCode: string,
    formCode: string,
    reverseCode: string,
    reverseSchemaCode: string,
    params: renderer.RelevanceFormSearchParams[],
    columns: string[],
    page: number,
    pageSize: number,
    query?: any[],
  ) {
    const data = new Array(10).fill(0).map((_, i) => ({
      id: i.toString(),
      name: 'form' + i,
    }));
    return Promise.resolve({
      total: 0,
      data,
    });
  }
}
