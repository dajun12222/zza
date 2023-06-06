/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
// 还有 vertical 垂直标签页
export default {
  title: '页签布局',
  properties: {
    backgroundColor: '背景颜色',
    backgroundImg: '背景图片',
    borderRadius: '圆角',

    borderStyle: '边框样式',
    borderThickness: '边框粗细',
    borderColor: '边框颜色',

    textColor: '文字颜色',
    textThickness: '文字粗细',

    heads: '页签',
    tabDirection: '页签方向',
    tabTitlePosition: '页签标题位置',
  },
  panel: {
    checked: '选中',
    tab: '标签名称',
    add: '新增',
  },
  groups: {
    panels: '面板设置',
    autoHeight: '内容高度自适应',

    backgroudStyle: '背景样式',
    borderStyle: '边框样式',
    textStyle: '文字样式',

    advancedConfig: '高级配置',
  },
  enums: {
    none: '无',
    small: '小',
    medium: '中',
    big: '大',
    dashed: '虚线',
    solid: '实线',
    normal: '正常',
    bold: '加粗',
    row: '横向',
    column: '纵向',
    left: '居左',
    center: '居中',
    right: '居右',
  },
  events: {
    change: '切换面板',
  },
};

export const TabsPanelGrid = {
  title: '标签页面板',
  properties: {
    tab: '页签',
    size: '尺寸设置',
    overflow: '内容溢出设置',
  },
};
