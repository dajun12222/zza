/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
declare namespace BizMethod {
  interface ListParam {
    schemaCode: string;
  }
  interface MethodItem {
    code: string;
    defaultMethod: boolean;
    description: string;
    id: string;
    methodCount: number;
    methodType?: number;
    methodTypeName: string;
    name: string;
    // remarks: string,
    modifiedTime?: string;
    schemaCode: string;
    serviceList?: any[];
  }
  interface CreateParam {
    code: string;
    description: string;
    name: string;
    schemaCode: string;
  }
  interface DeleteParam {
    schemaCode: string;
    methodCode: string;
  }

  interface InputMapping {
    bizCode: string;
    codeType: number;
    codeTypeName: string;
    id: string;
    propertyName: string;
    remarks: string;
    serviceMethodParameterCode: string;
  }

  interface OutputMapping extends InputMapping {}

  interface CreateInputMapping {
    bizCode: string;
    codeType: number;
    serviceMethodParameterCode: string;
    externParameterType?: number;
  }
  interface CreateOutputMapping extends CreateInputMapping {}

  interface CreateBindParam {
    // bizMethodId: string,
    methodCode: string;
    inputMappings: CreateInputMapping[];
    outputMappings: CreateOutputMapping[];
    schemaCode: string;
    serviceMethodCode: string;
    serviceCode: string;
  }

  interface DeleteBindParam {
    id: string;
  }

  interface ListBindServicesParam {
    schemaCode: string;
    // bizMethodId: string,
    methodCode: string;
  }

  interface GetBindDetailParam {
    methodMappingId: string;
  }

  interface BindDetailItem extends CreateBindParam {
    id: string;
    serviceName?: string;
    serviceMethodName?: string;
    // remarks?: string,
  }
}
