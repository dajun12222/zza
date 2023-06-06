/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
// import { ActionContext } from 'vuex';

import {
  RunMode,
  Page,
  UiDocumentNodeLike,
} from '@cloudpivot-shared/ui-engine-vue';

import {
  PageInfo,
  PageGroupInfo, // DocumentApplicationLike,
  ScreenSizes,
  DeviceScreenSize,
  DesignerEnv,
  StoreKey,
  UiDesignerResource,
  DocumentNodeDto,
} from '@cloudpivot-shared/ui-designer-common';

export { StoreKey, RunMode, DesignerEnv };

export interface Counter {
  [type: string]: number;
}

export function findDeviceScreenSize(width: number) {
  const size = Object.keys(ScreenSizes).find((k) => {
    const [min, max] = ScreenSizes[k as DeviceScreenSize];
    if (width >= min && width < max) {
      return k;
    }
  });
  return size as DeviceScreenSize;
}

export interface DesignerState {
  active: UiDocumentNodeLike | null;

  hoverActive: DocumentNodeDto | null;

  dragoverId: string;

  showGridOprations: boolean;

  page: Page;

  customAction: {
    names: string[];
    script: string;
  } | null;

  customStyle: string;

  // 应用全局自定义样式
  appStyle: string;

  // 应用全局自定义事件
  appAction: {
    names: string[];
    script: string;
  } | null;

  pages: PageInfo[];

  currentPage: PageInfo | null;

  groups: PageGroupInfo[];

  counter: Counter;

  idPrefix: string;

  env: DesignerEnv | null;

  allPages: any;

  appMenus: any;

  dirty: boolean;

  isMaster: boolean;

  // context: UiDesignerContext | null;

  /**
   * 当前打开的资源
   */
  opening: UiDesignerResource | null;

  /**
   * 协同编辑-是否抢到锁
   */
  getLock: boolean;
  /**
   * 协同编辑-是否可编辑
   */
  teamEditNotEnable: boolean;

  /**
   * 协同编辑-用户编辑信息
   */
  userEditInfo: string;

  /**
   * 协同编辑-过期时间
   */
  editExpireTime: number;
  /**
   * 协同编辑-元数据更新
   */
  editUpdateData: boolean;

  /**
   * 是否有绑定流程
   */
  bindFlow: boolean;
}

const storeState = () => {
  return {
    active: null,
    hoverActive: null,
    dragoverId: '',
    showGridOprations: false,
    page: null as any,
    customAction: null,
    customStyle: '',
    pages: [],
    currentPage: null,
    groups: [],
    counter: {},
    env: null,
    allPages: [],
    appMenus: [],
    dirty: false,
    isMaster: false,
    appStyle: '',
    appAction: null,
    // context: null,
    opening: null,
    getLock: true, // 协同编辑-是否抢到锁
    teamEditNotEnable: true, // 协同编辑-是否可编辑
    userEditInfo: '',
    editExpireTime: 600, // 协同编辑-默认刷新时间
    editUpdateData: false,
    idPrefix: '',
    bindFlow: false,
  } as DesignerState;
};

const mutations = {
  setDirty(state: DesignerState, value: boolean) {
    state.dirty = value;
  },

  setActive(state: DesignerState, node: UiDocumentNodeLike | null) {
    state.active = node;
  },

  setHoverActive(state: DesignerState, node: DocumentNodeDto | null) {
    state.hoverActive = node;
  },

  setDragoverId(state: DesignerState, id: string) {
    state.dragoverId = id;
  },

  setShowGridOprations(state: DesignerState, show: boolean) {
    state.showGridOprations = show;
  },

  setCounter(state: DesignerState, counter: Counter) {
    state.dirty = false;
    state.counter = counter;
  },

  setPrefix(state: DesignerState, prefix: string) {
    state.idPrefix = prefix;
  },

  setPages(state: DesignerState, pages: PageInfo[]) {
    state.pages = pages;
  },

  setGroups(state: DesignerState, groups: PageGroupInfo[]) {
    state.groups = groups;
  },

  setCurrentPage(state: DesignerState, page: PageInfo) {
    state.currentPage = page;
  },

  // initApp (state: DesignerState, payload: any) {
  //   if (state.page?.documentApp) {
  //     state.page?.documentApp.destroy();
  //   }
  //   state.page?.documentApp = new DocumentApplication(widgetStore.widgets, payload.data, payload.cb);
  // },

  [StoreKey.SetPage](state: DesignerState, page: Page) {
    state.page = page;
  },

  [StoreKey.SetOpening](
    state: DesignerState,
    resource: UiDesignerResource | null,
  ) {
    state.opening = resource;
  },

  // [StoreKey.SetContext] (
  //   state: DesignerState,
  //   context: UiDesignerContext | null,
  // ) {
  //   state.context = context;
  // },

  [StoreKey.SetIsMaster](state: DesignerState, isMaster: boolean) {
    state.isMaster = isMaster;
  },

  [StoreKey.SetNodeProps](
    state: DesignerState,
    payload: {
      id: string;
      props: any;
    },
  ) {
    const node = state.page?.documentApp.get(payload.id);
    if (!node) {
      return;
    }
    // node.props = payload.props;
    for (const key in node.props) {
      if (Reflect.has(node.props, key)) {
        const value = payload.props[key];
        if (value !== undefined) {
          node.props[key] = value;
        }
      }
    }
    // state.dirty = true;
  },

  [StoreKey.SetNodeProp](
    state: DesignerState,
    payload: {
      id: string;
      key: string;
      value: any;
    },
  ) {
    const node = state.page?.documentApp.get(payload.id);
    if (node) {
      node.props[payload.key] = payload.value;
    }
  },

  setCustomAction(
    state: DesignerState,
    customAction: {
      names: string[];
      script: string;
    } | null,
  ) {
    state.customAction = customAction;
    // state.dirty = true;
  },

  setCustomStyle(state: DesignerState, customStyle: string) {
    state.customStyle = typeof customStyle === 'object' ? '' : customStyle;
    // state.dirty = true;
  },

  setAppAction(
    state: DesignerState,
    appAction: {
      names: string[];
      script: string;
    },
  ) {
    state.appAction = appAction;
  },

  setAppStyle(state: DesignerState, appStyle: string) {
    state.appStyle = appStyle;
  },

  setAllPages(state: DesignerState, pages: any[]) {
    state.allPages = pages;
  },

  [StoreKey.SetEnv](state: DesignerState, env: DesignerEnv) {
    state.env = env;
  },

  [StoreKey.setLockStatus](state: DesignerState, value: boolean) {
    state.getLock = value;
  },

  [StoreKey.setTeamEditStatus](state: DesignerState, value: boolean) {
    state.teamEditNotEnable = value;
  },

  [StoreKey.setTeamEditInfo](state: DesignerState, value: string) {
    state.userEditInfo = value;
  },

  [StoreKey.setTeamEditTime](state: DesignerState, value: number) {
    state.editExpireTime = value;
  },

  [StoreKey.setTeamEditUpdate](state: DesignerState, value: boolean) {
    state.editUpdateData = value;
  },

  setBindFlow(state: DesignerState, value: boolean) {
    state.bindFlow = value;
  },
};

export const vuexStore = {
  namespaced: true,
  state: storeState,
  mutations,
  modules: {},
};
