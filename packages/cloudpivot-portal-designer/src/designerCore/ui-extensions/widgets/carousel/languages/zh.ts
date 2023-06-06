/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  title: '轮播图',
  properties: {
    backgroundColor: '背景颜色',
    backgroundImg: '背景图片',
    borderRadius: '圆角',

    borderStyle: '边框样式',
    borderThickness: '边框粗细',
    borderColor: '边框颜色',

    textColor: '文字颜色',
    textThickness: '文字粗细',

    photos: '轮播图',
    autoplay: '自动轮播',
    autoplaySpeed: '轮播间隔',
  },
  groups: {
    props: '文本属性',
    text: '文字',
    Business: '业务组件',

    backgroudStyle: '背景样式',
    borderStyle: '边框样式',

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
  },
  events: {
    click: '单击时',
  },
};
