/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import axios from 'axios';

const PORTAL_DESIGNER_PATH = '/api/portal/page';

interface PoralDesignerParams {
  appCode?: string;
  code?: string;
  createdBy?: string;
  createdTime?: string;
  defaultPage?: boolean;
  deleted?: boolean; // 删除状态：false——可删除，true——不可删除
  draftPortalJson?: string;
  id?: string;
  modifiedBy?: string;
  modifiedTime?: string;
  name?: string;
  published?: boolean;
  publishedPortalJson?: boolean;
  remarks?: string;
  status?: string; // 页面状态：DISABLED——禁用；ENABLE——启用
  type: string; // 页面类型：APP——应用首页；PORTAL——门户设计
}

interface ResData {
  errcode: number;
  errmsg: string;
  traceId: string;
  data?: any;
}

export default {
  queryPageList(params: PoralDesignerParams): Promise<ResData> {
    return axios.get(`${PORTAL_DESIGNER_PATH}/list`, { params });
  },

  queryPageDetail(params: PoralDesignerParams): Promise<ResData> {
    return axios.get(`${PORTAL_DESIGNER_PATH}/getByCode`, { params });
  },

  publishPage(params: PoralDesignerParams): Promise<ResData> {
    return axios.post(`${PORTAL_DESIGNER_PATH}/publish`, params);
  },

  savePage(params: PoralDesignerParams): Promise<ResData> {
    return axios.post(`${PORTAL_DESIGNER_PATH}/save`, params);
  },

  deletePage(params: PoralDesignerParams): Promise<ResData> {
    return axios.post(`${PORTAL_DESIGNER_PATH}/delete`, params);
  },

  disabledPage(params: PoralDesignerParams): Promise<ResData> {
    return axios.post(`${PORTAL_DESIGNER_PATH}/disable`, params);
  },

  enablePage(params: PoralDesignerParams): Promise<ResData> {
    return axios.post(`${PORTAL_DESIGNER_PATH}/enable`, params);
  },

  createPage(params: PoralDesignerParams): Promise<ResData> {
    return axios.post(`${PORTAL_DESIGNER_PATH}/create`, params);
  },

  createDefaultPortalPage(params: PoralDesignerParams): Promise<ResData> {
    return axios.post(`${PORTAL_DESIGNER_PATH}/createDefaultPortal`, params);
  },

  createDefaultAppPage(params: PoralDesignerParams): Promise<ResData> {
    return axios.post(`${PORTAL_DESIGNER_PATH}/createDefaultApp`, params);
  },

  getDefaultPortalPage(params: PoralDesignerParams): Promise<ResData> {
    return axios.get(`${PORTAL_DESIGNER_PATH}/getDefaultPage`, { params });
  },
};
