/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import Axios from 'axios';
import env from '@/config/env';
import qs from 'qs';

const loginUrl = `${env.oauthHost}/login/Authentication/get_code`;
const getTokenUrl = `${env.oauthHost}/login/Authentication/get_token`;

const refreshTokenUrl = `${env.oauthHost}/login/Authentication/get_refresh_token`;

const oAuthTokenUrl = `${env.oauthHost}/oauth/token`;
const userInfoUrl = `${env.apiHost}/api/organization/user/info_login`;
const oauthLogin: string = `${env.oauthHost}/login/mobile/ajax`;
const formUrl = `${env.apiHost}/api/runtime/form/get_message_form_url`;
const configUrl = `${env.apiHost}/public/system/config`;

const signDingTalkUrl: string = `${env.oauthHost}/api/dingtalk/sign`;

export default {
  /**
   * 获取钉钉签名信息
   * @param url 当前获取签名的url
   */
  getDingTalkSignature(params: { url: string }): Promise<any> {
    return Axios.get(`${signDingTalkUrl}`, {
      params,
    });
  },
  getSSOToken(params: OAuth.RequestParams): Promise<any> {
    // 解决跨端口访问时跨域的问题
    return Axios.post(`${oAuthTokenUrl}`, qs.stringify(params), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  getRefreshToken(params: OAuth.GetTokenParams): Promise<OAuth.Config> {
    return Axios.get(`${refreshTokenUrl}`, { params });
  },
  getUserInfo(): Promise<any> {
    return Axios.get(`${userInfoUrl}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  login(params: OAuth.LoginParams): Promise<any> {
    return Axios.post(`${loginUrl}`, params);
  },
  getToken(params: OAuth.GetTokenParams): Promise<OAuth.Config> {
    return Axios.get(`${getTokenUrl}`, { params });
  },
  /**
   * 获取系统环境配置
   */
  getSystemConfig(): Promise<any> {
    return Axios.get(`${configUrl}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }) as any;
  },
  /**
   * 使用钉钉授权码进行登陆
   * @param params
   */
  oauthLogin(
    params: OAuth.LoginRequestParams,
  ): Promise<OAuth.LoginResponse | any> {
    return Axios.get(`${oauthLogin}`, {
      params,
    });
  },

  /**
   * 获取消息打开表单跳转地址
   * @param params
   */
  getFormUrl(params: OAuth.FormUrlParams): any {
    return Axios.get(`${formUrl}`, {
      params,
    });
  },

  /**
   * 获取加密公钥
   */
  getRsaKey(): Promise<any> {
    return Axios.get(`${env.oauthHost}/public/getKey`);
  },

  /**
   * 获取企业组织列表
   */
  getDepts() {
    return Axios.get(`${env.apiHost}/public/relatedcorp/all_corp_info`);
  },
  loginValidate(params:any) {
    return Axios.get(`/api/user/exit/loginValidate`,{ params });
  },
  // OAuthLoginUrl: `${oAuthLoginUrl}?client_id=${env.client_id}&response_type=${response_type}&scope=${env.scope}&state=${state}&redirect_uri=${redirect_uri}`

  /**
   * 获取验证码
   */
  getVerificationCode(params: OAuth.GetVerificationCodeParams): Promise<any> {
    return Axios.post(
      `${env.oauthHost}/login/Authentication/get_verification_code`,
      params,
    );
  },
};
