/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import portalDesignApi from '../apis/portal-designer';
/**
 * 使用函数初始化state，方便后续清空state
 * @returns
 */
const getDefaultState = () => {
  return {
    //选中的设计区域类型
    viewType: 'design',
    //页面数据
    pagesData: [],
    currentPage: null,
    status: 'DISABLED',
    pageType: 'PORTAL',
  };
};

// const state = getDefaultState();
const paramsTemplate = () => {
  return {
    appCode: undefined,
    code: undefined,
    createdBy: undefined,
    createdTime: undefined,
    defaultPage: false,
    deleted: false,
    draftPortalJson: undefined,
    id: undefined,
    modifiedBy: undefined,
    modifiedTime: undefined,
    name: undefined,
    published: false,
    publishedPortalJson: undefined,
    remarks: undefined,
    status: undefined,
    type: undefined,
  };
};

const state = getDefaultState();

const mutations = {
  setView(state: any, viewType: string) {
    state.viewType = viewType;
  },

  setPagesData(state: any, pageList: any[]) {
    state.pagesData = pageList;
  },

  setCurrentPage(state: any, currentPage: any) {
    state.currentPage = currentPage;
  },

  setPageType(state: any, pageType: string) {
    state.pageType = pageType;
  },

  setStatus(state: any, status: string) {
    state.status = status;
  },

  setDefaultAppPage(state: any, params: any) {
    const pageData = Object.assign(paramsTemplate(), params, {
      defaultPage: true,
      status: 'ENABLE',
    });
    state.currentPage = pageData;
    state.status = 'ENABLE';
  },

  /**
   * 清空state数据
   * @param state
   */
  RESET_STATE(state) {
    Object.assign(state, getDefaultState());
  },
};

const actions = {
  async loadPageList({ state, commit }: any, params: any) {
    const res: any = await portalDesignApi.queryPageList(params);
    if (res.errcode === 0 && res.data) {
      commit('setPagesData', res.data);
      return res;
    }
  },

  async getPageDetail({ state, commit }: any, params: any) {
    const res: any = await portalDesignApi.queryPageDetail(params);
    if (res.errcode === 0 && res.data) {
      commit('setCurrentPage', res.data);
      commit('setStatus', res.data.status);
      return res;
    }
  },

  async savePage({ state, commit }: any, params?: any) {
    const Params = Object.assign(
      paramsTemplate(),
      params ? params : state.currentPage,
      { type: state.pageType },
    );
    const res: any = await portalDesignApi.savePage(Params);
    if (res.errcode === 0 && res.data) {
      commit('setCurrentPage', res.data);
    }
    return res;
  },
  async publishPage({ state, commit }: any, params?: any) {
    const Params = Object.assign(
      paramsTemplate(),
      params ? params : state.currentPage,
      { type: state.pageType },
    );
    const res: any = await portalDesignApi.publishPage(Params);
    if (res.errcode === 0 && res.data) {
      commit('setCurrentPage', res.data);
      commit('setStatus', res.data.status);
    }
    return res;
  },

  async deletePage({ state, commit }: any, params?: any) {
    const res: any = await portalDesignApi.deletePage(params);
    return res;
  },

  async disabledPage({ state, commit }: any, params?: any) {
    const res: any = await portalDesignApi.disabledPage(params);
    if (res.errcode === 0 && res.data) {
      commit('setCurrentPage', res.data);
      commit('setStatus', res.data.status);
    }
    return res;
  },

  async enabledPage({ state, commit }: any, params?: any) {
    const res: any = await portalDesignApi.enablePage(params);
    if (res.errcode === 0 && res.data) {
      commit('setCurrentPage', res.data);
      commit('setStatus', res.data.status);
    }
    return res;
  },

  async createPage({ state, commit }: any, params?: any) {
    const Params = Object.assign(paramsTemplate(), params, {
      type: state.pageType,
    });
    const res: any = await portalDesignApi.createPage(Params);
    return res;
  },

  async createDefaultPortalPage({ state, commit }: any, params?: any) {
    const Params = Object.assign(paramsTemplate(), params, {
      type: state.pageType,
    });
    const res: any = await portalDesignApi.createDefaultPortalPage(Params);
    if (res.errcode === 0 && res.data) {
      commit('setCurrentPage', res.data);
      commit('setStatus', res.data.status);
      return res;
    }
  },

  async createDefaultAppPage({ state, commit }: any, params?: any) {
    const Params = Object.assign(paramsTemplate(), params, {
      type: state.pageType,
    });
    const res: any = await portalDesignApi.createDefaultAppPage(Params);
    if (res.errcode === 0 && res.data) {
      return res;
    }
  },

  async getDefaultPortalPage({ state, commit }: any, params?: any) {
    const res: any = await portalDesignApi.getDefaultPortalPage(params);
    if (res.errcode === 0 && res.data) {
      commit('setCurrentPage', res.data);
      commit('setStatus', res.data.status);
    }
    return res;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
