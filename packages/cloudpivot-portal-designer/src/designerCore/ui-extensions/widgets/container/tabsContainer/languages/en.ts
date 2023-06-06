/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
const autoHeight = 'Auto Height';
export default {
  title: 'Tabs Container',
  properties: {
    activeKey: 'Active key',
    panels: 'Panel setting',
    tabPosition: 'Tab position',
    type: 'Tab type',
    sizeType: 'Tab size',
    size: 'Size',
    flex: 'alignment',
    background: 'Background',
    padding: 'Padding',
    overflow: 'overflow',
    visible: 'show',
    showMoreFlag: 'open more',
    showBadge: 'open badge',
    autoHeight,
    isHeightAuto: autoHeight,
  },
  panel: {
    checked: 'Checked',
    tab: 'Tab',
    add: 'Add',
  },
  groups: {
    panels: 'Panel Settings',
    autoHeight,
  },
  enum: {
    top: 'top',
    left: 'left',
    right: 'right',
    bottom: 'bottom',
    line: 'line',
    card: 'card',
    default: 'middle',
    small: 'small',
    large: 'large',
  },
  events: {
    change: 'change tab',
  },
};

export const TabsPanelGrid = {
  properties: {
    tab: 'Tab',
    size: 'Size',
    overflow: 'Overflow',
  },
};
