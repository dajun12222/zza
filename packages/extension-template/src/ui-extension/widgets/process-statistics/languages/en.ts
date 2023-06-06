/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  title: 'ProcessStatistics',
  properties: {
    backgroundColor: 'Background Color',
    backgroundImg: 'Background Image',
    borderRadius: 'Border Radius',

    borderStyle: 'Border Style',
    borderThickness: 'Border Thickness',
    borderColor: 'Border Color',

    textColor: 'Text Color',
    textThickness: 'Text Thickness',
  },
  groups: {
    backgroudStyle: 'Backgroud Style',
    borderStyle: 'Border Style',
    textStyle: 'Text Style',
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
  },
  events: {
    click: 'Click',
  },
  processStatistics: {
    ProcessStatistics: 'Process Statistics',
    Today: 'Today',
    ThisWeek: 'Week',
    ThisMonth: 'Month',
    Items: '{num}',
    FinishedTask: 'Finished Task',
    TimeoutTask: 'Timeout Task',
    MyInitiated2: 'My New Workflow',
    Status: 'Status',
    Template: 'Template',
    noData: 'No Data',
    WorkItemStatus: {
      NotStarted: 'Not Started',
      Processing: 'Processing',
      Completed: 'Completed',
      Canceled: 'Canceled',
      Draft: 'Draft',
      BeCanceled: 'Be Canceled',
      Invalid: 'Abandoned',
      Exception: 'Exception',
    },
  },
};
