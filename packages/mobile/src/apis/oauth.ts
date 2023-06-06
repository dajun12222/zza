/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import Axios from '@/config/axios';
import env from '@/config/env';


const userInfoUrl = `${env.apiHost}/api/organization/user/info_login`;
const signDingTalkUrl: string = `${env.oauthHost}/api/dingtalk/sign`;
const oauthLogin: string = `${env.oauthHost}/login/mobile/ajax`;
const configUrl = `${env.apiHost}/public/system/config`;
const getShortCode: string = `${env.apiHost}/api/runtime/query`;
export default {
  /**
   * 获取钉钉签名信息
   * @param url 当前获取签名的url
   */
  getDingTalkSignature(params: { url: string }): Promise<Common.Data> {
    return Axios.get(`${signDingTalkUrl}`, {
      params,
    });
  },
  /**
   * 使用钉钉授权码进行登陆
   * @param params
   */
  oauthLogin(params: OAuth.RequestParams): Promise<OAuth.Response | any> {
    return Axios.get(`${oauthLogin}`, {
      params,
    });
  },
  /**
   * 获取消息对应表单跳转地址
   * @param params
   */
  getMessageFormUrl(params: OAuth.FormUrlParams): Promise<Common.Data> {
    return Axios.get('/api/runtime/form/get_message_form_url', {
      params,
    });
  },

  getUserInfo(): Promise<any> {
    return Axios.get(`${userInfoUrl}`, { 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },

  /**
   * 获取打印二维码对应表单跳转地址
   * @param params
   */
  getFormUrl(params: OAuth.GetFormUrlParams): Promise<any> {
    return Axios.get('/api/runtime/form/get_form_url', {
      params,
    });
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
   * 根据短码获取相关数据
   */
  getShortCode(pairCode: string) {
    return Axios.get(`${getShortCode}/getShortCode`, {
      params: {
        pairCode,
      },
    });
  },
};
