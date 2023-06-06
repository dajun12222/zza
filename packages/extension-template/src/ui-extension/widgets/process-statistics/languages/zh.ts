/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  title: '流程统计',
  properties: {
    backgroundColor: '背景颜色',
    backgroundImg: '背景图片',
    borderRadius: '圆角',

    borderStyle: '边框样式',
    borderThickness: '边框粗细',
    borderColor: '边框颜色',

    textColor: '文字颜色',
    textThickness: '文字粗细',
  },
  groups: {
    props: '文本属性',
    text: '文字',
    Business: '业务组件',

    backgroudStyle: '背景样式',
    borderStyle: '边框样式',
    textStyle: '文字样式',
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
  processStatistics: {
    ProcessStatistics: '流程统计',
    Today: '今天',
    ThisWeek: '本周',
    ThisMonth: '本月',
    Items: '{num}条',
    FinishedTask: '我处理的任务',
    TimeoutTask: '我的待办超时',
    MyInitiated2: '我发起的流程',
    Status: '状态',
    Template: '流程模板',
    noData: '暂无数据',
    WorkItemStatus: {
      NotStarted: '未启动',
      Processing: '进行中',
      Completed: '已完成',
      Canceled: '被取消',
      Draft: '草稿',
      BeCanceled: '被取消',
      Invalid: '作废',
      Exception: '异常',
    },
  },
};
