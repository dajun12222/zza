/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
const autoHeight = 'Auto Height';
export default {
  title: 'Tabs Container',
  properties: {
    backgroundColor: 'Background Color',
    backgroundImg: 'Background Image',
    borderRadius: 'Border Radius',

    borderStyle: 'Border Style',
    borderThickness: 'Border Thickness',
    borderColor: 'Border Color',

    textColor: 'Text Color',
    textThickness: 'Text Thickness',

    heads: 'Heads',
    tabDirection: 'Tab Direction',
    tabTitlePosition: 'Tab Title Position',
  },
  panel: {
    checked: 'Checked',
    tab: 'Tab',
    add: 'Add',
  },
  groups: {
    panels: 'Panel Settings',
    autoHeight,

    backgroudStyle: 'Backgroud Style',
    borderStyle: 'Border Style',
    textStyle: 'Text Style',

    advancedConfig: 'Advanced Config',
  },
  enums: {
    none: 'None',
    small: 'Small',
    medium: 'Medium',
    big: 'Big',
    dashed: 'Dashed',
    solid: 'Solid',
    normal: 'Normal',
    bold: 'Bold',
    row: 'Row',
    column: 'Column',
    left: 'Left',
    center: 'Center',
    right: 'Right',
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
