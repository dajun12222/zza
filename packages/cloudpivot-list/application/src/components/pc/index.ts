/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
/*
 * @Descripttion:
 * @version: v1.0
 * @Author: baidongsheng
 * @Date: 2021-11-02 10:59:02
 * @LastEditors: baidongsheng
 * @LastEditTime: 2021-12-18 15:13:31
 */
export default {
  ApplicationHeader: () => import('./header.vue'),
  AppsMenu: () => import('./apps-menu.vue'),
  AppHomeContent: () => import('./single-app/app-home-content.vue'),
  AppHomeHeader: () => import('./single-app/app-home-header.vue'),
  AppList: () => import('./components/app-list.vue'),
  SearchResulte: () => import('./components/search-resulte.vue'),
};
