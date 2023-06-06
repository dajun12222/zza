/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  title: 'Layout',
  properties: {
    sizeType: 'Size Setting',
    margin: 'Margin',
    background: 'Background',
  },
};

export const LayoutPanel = {
  title: 'Layout Panel',
  properties: {
    background: 'Background',
    border: 'Border',
    margin: 'Margin',
    padding: 'Padding',
    overflow: 'Overflow',
  },
};

export const LayoutSider = {
  title: 'Layout Sider',
  properties: Object.assign(
    {
      basis: 'Basis',
      min: 'Min',
      max: 'Max',
      collapsible: 'Collapsible',
      resizable: 'Resizable',
      toggleInside: 'Toggle inside',
    },
    LayoutPanel.properties,
  ),

  groups: {
    sizes: 'Sizes',
    switchs: 'Switchs',
  },
};
