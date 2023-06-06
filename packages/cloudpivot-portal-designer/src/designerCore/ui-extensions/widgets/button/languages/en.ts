/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  title: 'Button',
  properties: {
    mode: 'Mode',
    content: 'Content',
    code: 'Code',
    margin: 'Margin',
    rotate: 'Rotate',
    border: 'Border',
    shadow: 'Shadow',
    filter: 'Filter',
    size: 'Size',
    sizeLimit: 'Size limit',
    visible: 'Visible',
    icon: 'Icon',
    background: 'Background',
    font: 'Font',
    disabled: 'disabled',
    showIcon: 'showIcon',
  },
  events: {
    click: 'Click',
  },
  enum: {
    default: 'default',
    primary: 'primary',
    dashed: 'dashed',
    danger: 'danger',
    link: 'link',
  },
};
