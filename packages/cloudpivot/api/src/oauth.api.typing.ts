/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export declare namespace OAuth {
  export interface RequestParams {
    // 定义请求参数结构
    client_id: string;
    client_secret?: string;
    grant_type?: string;
    redirect_uri?: string;
    refresh_token?: string | null;
    code?: string | null;
    scope?: string;
  }

  export interface LoginParams {
    username: string;
    password: string;
    index: string;
    url: string;
    portal: boolean;
  }

  export interface GetTokenParams {
    code: string;
    url: string;
    client_secret: string;
    client_id: string;
    redirect_uri: string;
  }

  export interface LoginRequestParams {
    // 定义请求参数结构
    client_id: string;
    code: string;
    scope?: string;
    state?: string;
  }
  export interface Data {
    token_type: string;
    expires_in: number;
    scope: string;
    client: string;
    username: string;
    jti: string;
    T: string;
    refresh_token: string;
  }

  export interface Response {
    data: Data;
  }

  export interface ConfigData {
    pcServerUrl: string;
    ssoServerUrl: string;
    adminServerUrl: string;
    mobileServerUrl: string;
    scanAppId: string;
    loginType: number;
  }

  export interface Config {
    data: ConfigData;
    success?: boolean;
  }

  export interface UserInfo {
    id: string;
    name: string;
    username: string;
  }

  export interface LoginResponse {
    errcode: number;
    T: string;
    refresh_token: string;
    user_id: string;
    scope: string[];
    mobile: boolean;
    expiration: number;
    token_type: string;
    expires_in: number;
    userinfo: UserInfo;
  }

  export interface FormUrlParams {
    messageId: string;
  }

  export interface PasswordParams {
    // username: string,
    oldPassword: string;
    newPassword: string;
  }

  export interface LogoutParams {
    redirect_uri: string;
    T: string;
  }

  export interface ShortCodeParams {
    url: string;
    type: number;
    expireTime: number;
    uniqueCode?: string;
  }
}

export interface LogoutParams {
  redirect_uri: string;
  T: string;
}

export interface Data {
  errcode?: number;
  errmsg?: string;
  data?: any;
}

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
