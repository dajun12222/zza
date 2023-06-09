/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
declare namespace OAuth {
  export interface RequestParams {
    // 定义请求参数结构
    client_id: string;
    client_secret?: string;
    grant_type?: string;
    redirect_uri?: string;
    refresh_token?: string | null;
    code: string;
    scope?: string;
  }

  export interface LoginParams {
    username: string;
    password: string;
    url: string;
    portal: boolean;
  }

  export interface GetVerificationCodeParams {
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
}
