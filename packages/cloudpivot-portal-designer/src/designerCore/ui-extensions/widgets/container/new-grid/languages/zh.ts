/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  title: '容器',
  properties: Object.assign({
    backgroundColor: '背景颜色',
    backgroundImg: '背景图片',
    borderRadius: '圆角',

    borderStyle: '边框样式',
    borderThickness: '边框粗细',
    borderColor: '边框颜色',

    isHeightAuto: '内容高度自适应',
    cols: '栅格属性',
    size: '尺寸设置',
    sizeLimit: '尺寸限制',
    margin: '外边距',
    border: '边框',
    padding: '内边距',
    overflow: '滚动',
    background: '背景',
    visible: '可见',
  }),
  groups: {
    props: '文本属性',
    text: '文字',
    Business: '业务组件',

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
  },
};
