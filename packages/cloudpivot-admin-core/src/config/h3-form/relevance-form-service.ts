/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { externalLinkApi, formApi, listApi } from 'cloudpivot/api';
import { renderer } from 'cloudpivot-form/form';
import * as platform from 'cloudpivot-platform/platform';
import axios from 'axios';

export const isDingtalk = /DingTalk/.test(navigator.userAgent);

export class DefaultRelevanceFormService
  implements renderer.RelevanceFormService
{
  search(
    schemaCode: string,
    queryCode: string,
    params: renderer.RelevanceFormSearchParams[],
    columns: string[],
  ) {
    const data = new Array(10).fill(0).map((_, i) => ({
      id: i.toString(),
      name: 'form' + i,
    }));

    return Promise.resolve({
      total: 0,
      data,
    });

    // // schemaCode = 'api1';
    // // queryCode = 'api1';

    // const filters = params.map((x) => {
    //   let val: any = x.value;

    //   if (x.value) {
    //     switch (x.type) {
    //       case DataItemType.RelevanceForm:
    //         val = x.value.id || '';
    //         break;
    //       case DataItemType.StaffSingle:
    //         val = x.value.map((v: any) => ({
    //           id: v.id,
    //           type: v.unitType || v.type
    //         }));
    //         val = JSON.stringify(val);
    //         break;
    //       default:
    //         if (Array.isArray(x.value)) {
    //           val = x.value.map(v => v.toString()).join(';');
    //         } else {
    //           val = x.value;
    //         }
    //         break;
    //     }
    //   }

    //   return ({
    //     propertyCode: x.code,
    //     propertyType: x.type,
    //     propertyValue: val
    //   });
    // });

    // const obj: any = {
    //   queryCode,
    //   schemaCode,
    //   mobile: false,
    //   page: 0,
    //   size: 1000,
    //   filters
    // };

    // if (columns && columns.length > 0) {
    //   obj.options = {
    //     customDisplayColumns: columns,
    //     queryDisplayType: listParams.QueryDisplayType.Append
    //   };
    // }

    // return listApi.getQueryList(obj).then((res) => {
    //   if (res.errcode === 0) {
    //     const data = res.data.content.map((x: any) => x.data);
    //     return {
    //       total: res.data.totalElements,
    //       data
    //     };
    //   }
    //   return {
    //     total: 0,
    //     data: []
    //   };
    // });
  }

  open(schemaCode: string, queryCode: string, value: any) {
    const params = {
      bizObjectId: value.id,
      schemaCode,
    };
    listApi.getFormUrl(params).then((res: any) => {
      if (isDingtalk) {
        res += '&T=' + localStorage.getItem('token');
      }
      window.open(res);
    });
  }

  dataitemsOf(schemaCode: string) {
    return axios
      .get('/api/app/bizproperty/list', {
        params: {
          schemaCode,
          isPublish: true,
        },
      })
      .then((res: any) => {
        if (res.errcode === 0) {
          return res.data;
        }
        return [];
      });
  }

  getBizmodelTitle(schemaCode: string) {
    return formApi.getBizModelName(schemaCode).then((res) => {
      if (res.errcode === 0) {
        return res.data;
      }
      return null;
    });
  }

  scan(successFn: (data: string) => void, failFn?: Function) {
    const params = {
      successFn,
    };
    platform.service.scan(params);
  }

  uploadImageFromCamera(
    successFn: (data: string[]) => void,
    failFn?: Function,
  ) {
    // todo
  }

  loadForm(params: any) {
    return formApi.load(params).then((res) => {
      return res;
    });
  }

  externalLinkSheet(id: string, type: string) {
    const params = {
      id,
      type,
    };
    return externalLinkApi.sheet(params).then((res) => {
      return res;
    });
  }

  shortCodeConfig(sCode: string) {
    return Promise.resolve(null);
  }
}
