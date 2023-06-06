/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  title: '文本列表',
  properties: {
    backgroundColor: '背景颜色',
    backgroundImg: '背景图片',
    borderRadius: '圆角',

    borderStyle: '边框样式',
    borderThickness: '边框粗细',
    borderColor: '边框颜色',

    textColor: '文字颜色',
    textThickness: '文字粗细',
    title: '组件标题',
    icon: '组件图标',
    dataSource: '数据源',
    bizModel: '',
    displayField: '展示字段',
    sortField: '排序字段',
    sortRule: '排序规则',
    listIcon: '列表符号',
    showFieldTitle: '显示字段标题',
    queryConditions: '数据范围',
  },
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
    bizModel: '业务模型',
    myUnfinished: '我的待办',
    myFinished: '我的已办',
    myRead: '我的已阅',
    myUnread: '我的待阅',
    myStart: '我发起的',
    Shortcut: '最近使用',
    ascending: '升序',
    descending: '降序',
    noIcon: '无符号',
    dot: '圆点',
    diamond: '菱形',
  },
  events: {
    click: '单击时',
  },
};
