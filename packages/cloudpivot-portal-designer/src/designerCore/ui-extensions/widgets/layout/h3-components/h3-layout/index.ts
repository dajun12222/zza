/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
const H3Layout = () => import(/* webpackChunkName: "h3-layout" */'./h3-layout.vue');
const H3LayoutContent = () => import(/* webpackChunkName: "h3-layout-content" */'./h3-layout-content.vue');
const H3LayoutCenter = () => import(/* webpackChunkName: "h3-layout-center" */'./h3-layout-center.vue');
const H3LayoutHeader = () => import(/* webpackChunkName: "h3-layout-header" */'./h3-layout-header.vue');
const H3LayoutFooter = () => import(/* webpackChunkName: "h3-layout-header" */'./h3-layout-header.vue');
const H3LayoutSider = () => import(/* webpackChunkName: "h3-layout-sider" */'./h3-layout-sider.vue');

export {
  H3Layout,
  H3LayoutContent,
  H3LayoutCenter,
  H3LayoutHeader,
  H3LayoutFooter,
  H3LayoutSider,
};
