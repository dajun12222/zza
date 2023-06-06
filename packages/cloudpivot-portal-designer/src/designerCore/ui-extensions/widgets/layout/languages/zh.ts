/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  title: '布局',
  properties: {
    size: '尺寸设置',
    margin: '外边距',
    background: '背景',
  },
};

export const LayoutPanel = {
  title: '布局面板',
  properties: {
    background: '背景',
    border: '边框',
    margin: '外边距',
    padding: '内边距',
    overflow: '滚动',
  },
};

export const LayoutSider = {
  title: '布局边栏',
  properties: Object.assign(
    {
      basis: '初始',
      min: '最小',
      max: '最大',
      collapsible: '可折叠',
      resizable: '可调整大小',
      toggleInside: '折叠按钮内置',
    },
    LayoutPanel.properties,
  ),

  groups: {
    sizes: '大小',
    switchs: '开关',
  },
};
