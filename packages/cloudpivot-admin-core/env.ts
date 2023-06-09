/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
const enableProxy = process.env.NODE_ENV === 'debug';

let env: any = (window as any).config;

const marketPortalSwitch = process.env.VUE_APP_MARKET_PORT_SWITCH === 'true';
if (enableProxy) {
  // env = {
  //   enableProxy,
  //   client_id: process.env.VUE_APP_OAUTH_CLINET_ID,
  //   secret: process.env.VUE_APP_OAUTH_SECRET,
  //   redirectHost: process.env.VUE_APP_OAUTH_REDIRECT,
  //   oauthHost: process.env.VUE_APP_OAUTH_HOST,
  //   apiHost: process.env.VUE_APP_API,
  //   scope: process.env.VUE_APP_OAUTH_SCOPE,
  //   portalHost: process.env.VUE_APP_PORTAL_HOST
  // }
  env = Object.assign({}, env, {
    enableProxy,
    marketPortalSwitch,
    client_id: process.env.VUE_APP_OAUTH_CLINET_ID,
    secret: process.env.VUE_APP_OAUTH_SECRET,
    redirectHost: process.env.VUE_APP_OAUTH_REDIRECT,
    oauthHost: process.env.VUE_APP_OAUTH_HOST,
    apiHost: process.env.VUE_APP_API,
    scope: process.env.VUE_APP_OAUTH_SCOPE,
    portalHost: process.env.VUE_APP_PORTAL_HOST,
    marketPortalHost: process.env.VUE_APP_MARKET_PORT_HOST,
  });

  (window as any).config = env;
} else {
  env = (window as any).config || {};
}

export default env;
