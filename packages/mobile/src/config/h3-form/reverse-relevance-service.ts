/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { listApi } from 'cloudpivot/api';
import { renderer } from 'cloudpivot-form/form';
import * as platform from 'cloudpivot-platform/platform';

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
      propertyCode?: string;
      propertyType?: number;
      propertyValue?: any;
    }[],
  ) {
    const filters = field.map((f) => {
      return {
        propertyCode: f.code || f.propertyCode,
        propertyType: f.type || f.propertyType,
        propertyValue: f.value || f.propertyValue,
      };
    });

    const obj: any = {
      schemaCode,
      reverseCode,
      reverseSchemaCode,
      formCode,
      mobile: false,
      page: 0,
      size: 1000,
      filters,
    };

    return listApi.queryReverse(obj).then((res: any) => {
      if (res.errcode === 0 && res.data) {
        const data = res.data.content;
        // const data = res.data.content.map((x: any) => x.data);
        return data;
      }
      return [];
    });
  }

  open(schemaCode: string, item: any) {
    listApi
      .getFormUrl({
        bizObjectId: item.id,
        schemaCode,
      })
      .then((res: any) => {
        const hash = window.location.hash.substr(1);
        const url = window.location.href.replace(hash, res);

        platform.service.openLink(url);
        // if (common.isDingtalk) {
        //   dingtalk.openLink(url);
        // } else {
        //   window.open(url);
        // }
      });
  }

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
    const queryCondition = params;
    const obj: any = {
      formCode,
      mobile: true,
      reverseCode,
      reverseSchemaCode,
      schemaCode,

      page: page - 1,
      size: pageSize,
      queryCondition,
    };

    if (columns && columns.length > 0) {
      obj.options = {
        customDisplayColumns: columns,
        queryDisplayType: QueryDisplayType.Append,
      };
    }

    return listApi.queryReverse(obj).then((res: any) => {
      if (res.errcode === 0 && res.data) {
        // const data = res.data.content.map((x: any) => x.data);
        const data = res.data.content;
        return {
          total: res.data.totalElements,
          data,
        };
      }
      return {
        total: 0,
        data: [],
      };
    });
  }
}

export enum QueryDisplayType {
  /**
   * 默认展示查询列表配置的显示字段
   */
  Default = '0',

  /**
   * 覆盖展示查询列表配置的显示字段
   */
  Override = '1',

  /**
   * 在查询列表配置的显示字段的基础上新增显示字段
   */
  Append = '2',
}
