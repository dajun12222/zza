/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Store } from 'vuex';

import {
  DeviceType,
  DesignerStoreLike,
  register,
  PageInfo,
  PageListParams,
  DocumentNodeDto,
  UiDesignerResource,
} from '@cloudpivot-shared/ui-designer-common';

import {
  Subscription,
  UiDocumentNodeLike,
  Page,
} from '@cloudpivot-shared/ui-engine-vue';

import * as forms from '@cloudpivot-shared/ui-engine-vue/schema';

import {
  DesignerState,
  StoreKey,
  DesignerEnv,
  vuexStore,
} from './designer-store';

export interface SetRootPayload {
  id: string;
  type: string;
  // data: PropertiesData
  data: forms.FormGroup;
}

/**
 * 继承自定义组件定制化的方法，对当前设计器状态管理不做过多侵入
 */
export class DesignerStore implements DesignerStoreLike {
  private _namespace: string;

  private _$store: Store<any>;

  private _subscription: Subscription | null = null;

  private _parent?: DesignerStoreLike;

  constructor(
    namespace: string,
    $store: Store<any>,
    parent?: DesignerStoreLike,
  ) {
    this._$store = $store;
    this._parent = parent;
    if (parent) {
      this._namespace = `${parent.namespace}-${namespace}`;
    } else {
      this._namespace = namespace;
    }
    $store.registerModule(this._namespace, vuexStore);
  }

  get parent() {
    return this._parent;
  }

  get namespace() {
    return this._namespace;
  }

  get $store() {
    return this._$store;
  }

  get state() {
    const state = (this._$store.state as any)[this.namespace] || {};
    return state as DesignerState;
  }

  get active(): UiDocumentNodeLike | null {
    return this.state.active;
  }

  get hoverActive(): DocumentNodeDto | null {
    return this.state.hoverActive;
  }

  get dragoverId(): string {
    return this.state.dragoverId;
  }

  get showGridOprations(): boolean {
    return this.state.showGridOprations;
  }

  set active(node: UiDocumentNodeLike | null) {
    if (this.active) {
      // (this.active.props as forms.FormGroup).destroy();
    }

    const name = this.namespace + '/' + StoreKey.SetActive;
    if (node) {
      // const active = this.nodeToActive(node);
      const active = node;
      this._$store.commit(name, active);
    } else {
      this._$store.commit(name, null);
    }
  }

  // get context () {
  //   return this.state.context;
  // }

  // set context (value: UiDesignerContext | null) {
  //   this.commit(StoreKey.SetContext, value);
  // }

  get opening() {
    return this.state.opening;
  }

  set opening(value: UiDesignerResource | null) {
    this.commit(StoreKey.SetOpening, value);
  }

  unregister() {
    this._$store.unregisterModule(this.namespace);
  }

  nodeToActive(node: DocumentNodeDto) {
    const { id, type, props, parentId, childIds, cloneable, removable } = node;
    const ctrl = this.app.widgetStore.createPropsForm(type, id, props);
    return {
      id,
      type,
      props: ctrl,
      parentId,
      childIds,
      cloneable,
      removable,
    };
  }

  get page() {
    return this.state.page;
  }

  set page(page: Page) {
    this.state.page = page;
    this.commit(StoreKey.SetPage, page);
  }

  get app() {
    return this.state.page?.documentApp;
  }

  get currentPage() {
    return this.state.currentPage;
  }

  set currentPage(page: PageInfo | null) {
    this.commit(StoreKey.SetCurrentPage, page);
  }

  get pages() {
    return this.state.pages;
  }

  get groups() {
    return this.state.groups;
  }

  // 应用下的所有页面
  get allPages() {
    return this.state.allPages;
  }

  // 应用下的所有菜单
  get appMenus() {
    return this.state.appMenus;
  }

  get repository() {
    const repository = register.pageDataProvider;
    if (!repository) {
      throw new Error('register.pageDataProvider');
    }

    return repository;
  }

  get customAction() {
    return this.state.customAction;
  }

  get customStyle() {
    return this.state.customStyle;
  }

  get appAction() {
    return this.state.appAction;
  }

  get appStyle() {
    return this.state.appStyle;
  }

  get firstLevel() {
    return this._$store.getters[this.namespace + '/firstLevel'];
  }

  get isMaster() {
    return this.state.isMaster;
  }

  set isMaster(val: boolean) {
    this.commit(StoreKey.SetIsMaster, val);
  }

  get getLock() {
    return this.state.getLock;
  }

  set getLock(val: boolean) {
    this.commit(StoreKey.setLockStatus, val);
  }

  get teamEditNotEnable() {
    return this.state.teamEditNotEnable;
  }

  set teamEditNotEnable(val: boolean) {
    this.commit(StoreKey.setTeamEditStatus, val);
  }

  get userEditInfo() {
    return this.state.userEditInfo;
  }

  set userEditInfo(val: string) {
    this.commit(StoreKey.setTeamEditInfo, val);
  }

  get editExpireTime() {
    return this.state.editExpireTime;
  }

  set editExpireTime(val: number) {
    this.commit(StoreKey.setTeamEditTime, val);
  }

  get editUpdateData() {
    return this.state.editUpdateData;
  }

  set editUpdateData(val: boolean) {
    this.commit(StoreKey.setTeamEditUpdate, val);
  }

  get env() {
    return this.state.env;
  }

  set env(env: DesignerEnv | null) {
    this.commit(StoreKey.SetEnv, env);
  }

  /**
   * 是否可设计
   */
  get canDesign() {
    // // 母版中的节点不可设计
    // if (this.isMaster) {
    //   return false;
    // }

    // 当页面是响应式设计区为mobile时不可设计
    if (
      this.currentPage?.support === 'responsive' &&
      this.env?.device.type === DeviceType.Mobile
    ) {
      return false;
    }

    return true;
  }

  get isDesign() {
    return false;
  }

  get isMobile() {
    return this.env?.device.type === DeviceType.Mobile;
  }

  get dirty() {
    return this.state.dirty;
  }

  set dirty(value: boolean) {
    this.commit(StoreKey.SetDirty, value);
  }

  get bindFlow() {
    return this.state.bindFlow;
  }

  set bindFlow(value: boolean) {
    // TODO
    this.commit('setBindFlow' as any, value);
  }

  get(id: string) {
    if (this.app) {
      return this.app.get(id);
    }
    return null;
  }

  [StoreKey.SetNodeProp](id: string, key: string, value: any) {
    this.commit(StoreKey.SetNodeProp, {
      id,
      key,
      value,
    });
  }

  [StoreKey.SetCustomAction](customAction: {
    names: string[];
    script: string;
  }) {
    this.commit(StoreKey.SetCustomAction, customAction);
  }

  [StoreKey.SetCustomStyle](customStyle: string) {
    this.commit(StoreKey.SetCustomStyle, customStyle);
  }

  /**
   * 保存应用全局样式
   * @param appStyle 应用全局样式
   */

  [StoreKey.SetAppStyle](appStyle: string) {
    this.commit(StoreKey.SetAppStyle, appStyle);
  }

  /**
   * 保存应用全局事件
   * @param appAction 应用全局自定义事件
   */
  [StoreKey.SetAppAction](appAction: { names: string[]; script: string }) {
    this.commit(StoreKey.SetAppAction, appAction);
  }

  getChildren(id: string) {
    return this.app.getChildren(id);
  }

  getParent(id: string) {
    return this.app.getParent(id);
  }

  commit(key: StoreKey, payload?: any) {
    const name = this.namespace + '/' + key;
    return this._$store.commit(name, payload);
  }

  setActiveNode(node: UiDocumentNodeLike | null) {
    // 如果组件属性有错误，不让切走属性面板
    if (this.active && this.active.props.invalid) {
      return;
    }

    this.active = node;
  }

  setActive(id: string | null) {
    const node = id ? this.get(id) : null;
    if (node) {
      this.setActiveNode(node);
    }
  }

  setHoverActiveNode(node: DocumentNodeDto | null) {
    const name = this.namespace + '/' + StoreKey.SetHoverActive;
    this._$store.commit(name, node);
  }

  setDragoverId(id: string) {
    // @ts-ignore
    this.commit(StoreKey.SetDragoverId, id);
  }

  setShowGridOprations(show: boolean) {
    // @ts-ignore
    this.commit(StoreKey.SetShowGridOprations, show);
  }

  setHoverActive(id: string | null) {
    const node = id ? this.get(id) : null;
    this.setHoverActiveNode(node);
  }

  initPage(data: any) {
    this.setCustomAction(data?.customAction || null);
    this.setCustomStyle(data?.customStyle || '');
    this.commit(StoreKey.SetCounter, (data && data.counter) || {});
  }

  loadPages(params: PageListParams) {
    this.commit(StoreKey.SetPages, []);
    return this.repository.list(params).then((res) => {
      this.commit(StoreKey.SetPages, res);
      return res;
    });
  }

  /**
   * 初始化获取应用的自定义信息
   * @param appInfo
   */
  initAppCustomInfo(app: any) {
    // 从应用信息中获取应用的自定义事件和自定义样式，仅适用于设计时
    if (app.customAction) {
      try {
        const action = JSON.parse(app.customAction);
        this.setAppAction(action);
      } catch (error) {
        console.error('全局动作解析失败：', app.customAction);
      }
    }
    if (app.customStyle) {
      this.setAppStyle(app.customStyle || '');
    }
  }

  serializeData() {
    const state = this.state;
    return {
      activeId: state.active ? state.active.id : null,
      customAction: state.customAction,
      customStyle: state.customStyle,
      counter: state.counter,
    };
  }
}
