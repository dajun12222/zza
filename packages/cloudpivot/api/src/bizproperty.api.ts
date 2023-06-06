import axios from './axios';

import Mappings from './api.mappings';

import * as bizproperty from './bizproperty-params';

import { HttpResponse } from './response';

const newPath = '/api/app/bizdatarule';

export class BizpropertyApi {
  sortkeys(params: bizproperty.SortkeysParams): Promise<HttpResponse<any>> {
    return axios.post(Mappings.bizproperty.sortkeys, params);
  }

  listBySchemacode(params: bizproperty.SchemaCode): Promise<HttpResponse<any>> {
    return axios.get(Mappings.bizRule.listBySchemacode, {
      params,
    });
  }

  businessruleDelete(params: bizproperty.Id): Promise<HttpResponse<any>> {
    const Params: any = [];
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        Params.push(`${key}=${params[key]}`);
      }
    }
    return axios.post(`${Mappings.bizRule.delete}?${Params.join('&')}`);
  }

  businessruleDetails(params: bizproperty.Id): Promise<HttpResponse<any>> {
    return axios.get(Mappings.bizRule.get, {
      params,
    });
  }

  // 查看引用
  businessruleQuote(params: bizproperty.Id): Promise<HttpResponse<any>> {
    return axios.get(Mappings.bizRule.quote, {
      params,
    });
  }

  businessruleCreate(params: any): Promise<HttpResponse<any>> {
    return axios.post(Mappings.bizRule.create, params);
  }

  businessruleUpdata(params: any): Promise<HttpResponse<any>> {
    return axios.post(Mappings.bizRule.updata, params);
  }

  changeBusinessMode(params: any): Promise<HttpResponse<any>> {
    return axios.post(Mappings.bizRule.changeDevelopmentMode, params);
  }

  getBusinessRuleEnable(params: any): Promise<HttpResponse<any>> {
    return axios.get(Mappings.bizproperty.getBusinessRuleEnable, {
      params,
    });
  }

  setBusinessRuleEnable(params: any): Promise<HttpResponse<any>> {
    return axios.post(Mappings.bizproperty.setBusinessRuleEnable, params);
  }

  /**
   * 校验子表映射接口
   * @param params
   */
  checkSheetMapping(params: bizproperty.CheckSheetMappingParam) {
    return axios.post(
      '/api/app/bizmethod/compare_mapping?schemaCode=' +
        params.schemaCode +
        '&relativeCode=' +
        params.relativeCode,
      params.mappings,
    );
  }

  // 获取业务规则节点运行轨迹
  getNodeRunMaps(params: any): Promise<HttpResponse<any>> {
    return axios.get(Mappings.bizRule.getNodeRunMaps, {
      params,
    });
  }

  postNodeRunMap(params: any): Promise<HttpResponse<any>> {
    return axios.post(Mappings.bizRule.postNodeRunMaps, params);
  }

  getDataRules(params: bizproperty.dataRlueParam): Promise<HttpResponse<any>> {
    return axios.get(`${newPath}/list`, { params });
  }
}
