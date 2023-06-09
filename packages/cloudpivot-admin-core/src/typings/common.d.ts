/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
declare namespace Common {
  export interface App {
    name: string;
    code: string;
    icon: string;
  }

  export interface FormHistoryParam {
    page?: number;
    size?: number;
    schemaCode: string;
    sheetCode: string;
  }

  export interface AppModule {
    name?: string | any;
    code: string;
    active?: boolean;
    url: string;
    count?: number;
  }

  export interface Data {
    errcode?: number;
    errmsg?: string;
    data: any;
  }
  export interface Response {
    data: Data;
  }

  export interface Res<T> {
    errcode?: number;

    errmsg?: string;

    data?: T;
  }

  // 分页数据返回
  export interface PageResponse {
    data: {
      content: any;
    };
  }

  // 数据项model
  export interface DataItems {
    data: {
      order: number;
      labelName: string;
      uiformId: any;
      uiType: number;
      required: boolean;
      maxLength: number;
      minLength: number;
      pattern: string;
      ruleMsg: string;
      placeholder: string;
      selectCollection?: any;
    };
  }
  // 表格的头
  export interface TableHead {
    title?: string;
    dataIndex: string;
    scopedSlots?: Action;
    filteredValue?: string;
    key?: string;
    onFilter?: any;
    slots?: object;
    align?: string;
    width?: any;
    fixed?: string;
    ellipsis?: boolean;
  }
  // 表格操作
  export interface Action {
    customRender: string;
    filterDropdown?: string;
    filterIcon?: string;
    scopedSlots?: any;
  }
  export interface ChuanyunPrintModel {
    fieldCode: string;
    fieldName: string;
    fieldType: string;
    children: any;
  }
  /* 表单配置 */
  interface FormItemLayout {
    labelCol: {
      span: number;
    };
    wrapperCol: {
      span: number;
    };
  }
}
