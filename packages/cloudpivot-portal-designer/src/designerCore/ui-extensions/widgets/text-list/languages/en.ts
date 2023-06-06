/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
export default {
  title: 'TextList',
  properties: {
    backgroundColor: 'Background Color',
    backgroundImg: 'Background Image',
    borderRadius: 'Border Radius',

    borderStyle: 'Border Style',
    borderThickness: 'Border Thickness',
    borderColor: 'Border Color',

    textColor: 'Text Color',
    textThickness: 'Text Thickness',

    title: 'Component Title',
    icon: 'Component Icon',
    dataSource: 'Data Source',
    bizModel: '',
    displayField: 'Display Field',
    sortField: 'Sort Field',
    sortRule: 'Sort Rule',
    listIcon: 'List Icon',
    showFieldTitle: 'Show Field Title',
    queryConditions: 'Query Conditions',
  },
  groups: {
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
    bizModel: 'Biz-model',
    myUnfinished: 'To-do Task',
    myFinished: 'Finished Task',
    myRead: 'Finished Read',
    myUnread: 'To-read Task',
    myStart: 'My Workflow',
    Shortcut: 'Shortcust',
    ascending: 'Ascending',
    descending: 'Descending',
    noIcon: 'No-icon',
    dot: 'Dot',
    diamond: 'Diamond',
  },
  events: {
    click: 'Click',
  },
};
