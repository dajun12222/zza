/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  title: '按钮',
  properties: {
    mode: '按钮类型',
    content: '按钮文本',
    code: '编码',
    margin: '外边距',
    rotate: '旋转',
    border: '边框',
    shadow: '阴影',
    filter: '滤镜',
    size: '尺寸',
    sizeLimit: '尺寸限制',
    visible: '显示',
    icon: '显示图标',
    background: '背景',
    font: '字体',
    disabled: '禁用',
    showIcon: '显示图标',
    permissionControl: '控制按钮权限',
    showPermissionControl: '控制按钮权限',
  },
  groups: {
    props: '按钮属性',
  },
  events: {
    click: '单击',
  },
  enum: {
    default: '默认',
    primary: '重要',
    dashed: '虚线',
    danger: '危险',
    link: '链接',
  },
};
