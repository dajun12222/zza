/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import 'babel-polyfill';
import Vue from 'vue';
import cloudpivotAdminCore from 'cloudpivot-admin-core';
import router from 'cloudpivot-admin-core/src/router/';
import store from 'cloudpivot-admin-core/src/store/';
import Filters from 'cloudpivot-admin-core/src/common/filters';
import { i18n } from 'cloudpivot-admin-core/src/config/i18n';
import 'cloudpivot-admin-core/src/config/print';
import 'cloudpivot-admin-core/src/config/index';
import 'cloudpivot-admin-core/src/config/h3-form';

import 'cloudpivot-admin-core/src/styles/index.less';

import 'cloudpivot-admin-core/src/directives/hight-light';
import 'cloudpivot-admin-core/src/directives/ellipsis';
import setDevToken from '../../../config/dev-token';
import uiEngine from 'cloudpivot-portal-designer/src/designerCore/ui-engine';
import IconFont from '@cloudpivot-shared/ui-engine-vue/iconfont';
// IconFont.loadingIconFont(Vue, '../iconfont.min.js');
IconFont.loadingIconFont(
  Vue,
  'cloudpivot-admin-core/src/assets/iconfont.min.js',
);

//引入svg
import 'cloudpivot-icons/src/iconfont.js';
setDevToken();
import env from 'cloudpivot-admin-core/env';
Vue.config.devtools = true;

import {
  parseSearch,
  parseUrlParam,
  getParamObj,
} from 'cloudpivot-admin-core/src/common/utils';

import OAuthApi from 'cloudpivot-admin-core/src/apis/oauth';
import { getUserInfoLogin } from 'cloudpivot-admin-core/src/apis/organization';

import initFormComponent from 'cloudpivot-form/form/registerComponent';
// 二开组件
// import extendComponents from 'cloudpivot-form-extend';

import { utils } from 'cloudpivot/common';

import { initMapSecret } from 'cloudpivot/common/src/config/common/common-config';

// 甘特图插件的注册代码
 import initViewComponent from 'cloudpivot-list/list/registerView';
 import GanttExport from 'cloudpivot-gantt';
/**
 * 初始化甘特图视图
 */
initViewComponent({
  Gantt: GanttExport,
});

initFormComponent();

initMapSecret();

// initFormComponent(extendComponents);
// 配置全局的校验默认规则
(window as any).$defaultRuleOptions = {
  // 语言 默认中文 （暂时不支持）
  local: 'cn',
  errMsg: () => ({
    // 默认的错误提示
    required: '字段不能为空',
    noRegexp: '没有找到正则规则',
  }),
  // 中文字节 true 算两个字节，false算一个字节
  cnChart: false,
  formRegexp: {},
  error: () => {},
  success: () => {},
};

/**
 * 下拉元素绑定再元素节点下
 */
Vue.prototype.getPopupContainer = (triggerNode: any) => triggerNode.parentNode;

// 钉钉应用跳转后台免登
const adminToken =
  parseUrlParam(window.location.href, 'admin_token') ||
  getParamObj(window.location.href, 'T');

const query = utils.parseQuery();
query.T = adminToken;
utils.copyURL(query, 'admin');

if (window.location.hash.endsWith('/oauth')) {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('expireTime');
  getTokenInfo();
} else {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = OAuthApi.OAuthLoginUrl;
  } else {
    getUserInfoLogin().then((res) => {
      if (res.errcode === 0) {
        setUserInfo(res.data);
        mount();
      } else {
        console.error(res.errmsg);
      }
    });
  }
}

async function getTokenInfo() {
  const queryTemp = parseSearch(window.location.search);

  if (!env.secret) {
    // 获取配置文件
    await OAuthApi.getSystemConfig();
  }

  const params: OAuth.RequestParams = {
    client_id: `${env.client_id}`,
    client_secret: `${env.secret}`,
    grant_type: 'authorization_code',
    redirect_uri: `${env.redirectHost}`,
    code: queryTemp.code,
  };

  await OAuthApi.getSSOToken(params).then((res) => {
    const token = (res as any).access_token;
    const refreshTokens = (res as any).refresh_token;
    const expireTime = (res as any).exp;

    localStorage.setItem('refresh_token', refreshTokens);
    localStorage.setItem('expireTime', expireTime);
    localStorage.setItem('token', token);
    localStorage.setItem('login_jump', 'false');

    //token有效时长,按秒
    localStorage.setItem('expires_in', (res as any).expires_in);
    window.location.href = env.redirectHost + queryTemp.state;

    initMapSecret();
  });
}

function setUserInfo(info: any) {
  const isAppAdmin: boolean = info.permissions.includes('APP_MNG');
  const isSysAdmin: boolean = info.permissions.includes('SYS_MNG');
  const isRootAdmin: boolean = info.permissions.includes('ADMIN');
  // staff-selectot-base.ts 需要使用这个内容
  window.sessionStorage.setItem('user', JSON.stringify(info));

  const isAdmin: boolean = isAppAdmin || isSysAdmin || isRootAdmin;
  const isOnlyAppAdmin: boolean = isAppAdmin && !isSysAdmin && !isRootAdmin;

  const isRoleManage: boolean = info.roleManage;

  store.commit('System/User/setOnlyAppAdmin', isOnlyAppAdmin);
  store.commit('System/User/setIsAdmin', isAdmin);
  store.commit(
    'System/User/setIsJustAdmin',
    info.permissions.includes('ADMIN'),
  );
  store.commit('System/User/setIsRoleManage', isRoleManage);
}

function mount() {
  Object.entries(Filters).forEach(([k, v]) => {
    Vue.filter(k, v);
  });
  Vue.config.productionTip = false;

  const vm = new Vue({
    router,
    i18n,
    store,
    uiEngine,
    render: (h) => h(cloudpivotAdminCore.App),
  }).$mount('#app');
}
