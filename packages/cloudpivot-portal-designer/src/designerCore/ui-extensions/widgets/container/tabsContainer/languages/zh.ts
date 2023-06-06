/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
// 还有 vertical 垂直标签页
export default {
  title: '横向标签页容器',
  properties: {
    activeKey: '高亮面板',
    panels: '',
    tabPosition: '页签位置',
    type: '页签类型',
    sizeType: '尺寸类型',
    size: '尺寸',
    flex: '对齐',
    background: '背景样式',
    padding: '内边距',
    visible: '可见',
    showMoreFlag: '查看全部',
    showBadge: '开启徽标',
    autoHeight: '高度自适应',
    isHeightAuto: '内容高度自适应',
  },
  panel: {
    checked: '选中',
    tab: '标签名称',
    add: '新增',
  },
  groups: {
    panels: '面板设置',
    autoHeight: '内容高度自适应',
  },
  enum: {
    top: '头部',
    left: '左边',
    right: '右边',
    bottom: '底部',
    line: '线条',
    card: '卡片',
    default: '中',
    small: '小',
    large: '大',
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
