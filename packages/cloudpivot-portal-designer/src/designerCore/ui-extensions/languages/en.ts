/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { ComponentType, ComponentGroup } from '../enums';

export const component = {
  type: {
    [ComponentType.Page]: 'Page',
    [ComponentType.Master]: 'Master',
    [ComponentType.Demo]: 'Demo',
    [ComponentType.List]: 'List',
    [ComponentType.TextList]: 'TextList',
    [ComponentType.Label]: 'Label',
    [ComponentType.Card]: 'Card',
    [ComponentType.Avatar]: 'Avatar',
    [ComponentType.Calendar]: 'Calendar',
    [ComponentType.Badge]: 'Badge',
    [ComponentType.Icon]: 'Icon',
    [ComponentType.QRCode]: '二维码',
    [ComponentType.Chequer]: 'Chequer',
    [ComponentType.Img]: 'Img',
    [ComponentType.Scan]: 'Scan',
    [ComponentType.Carouselcomp]: 'Carousel',
    [ComponentType.Grid]: 'Grid',
    [ComponentType.Container]: 'Container',
    [ComponentType.StepsContainer]: 'StepsContainer',
    [ComponentType.StepsPanel]: 'StepsPanel',
    [ComponentType.TabsContainer]: 'TabsContainer',
    [ComponentType.TabsPanelContainer]: 'TabsPanelContainer',
    [ComponentType.CarouselContainer]: 'CarouselContainer',
    [ComponentType.CarouselPanel]: 'CarouselPanel',
    [ComponentType.Collapse]: 'Collapse',
    [ComponentType.CollapsePanel]: 'Collapse Panel',
    [ComponentType.PanelContainer]: 'PanelContainer',
    [ComponentType.Layout]: 'Layout',
    [ComponentType.LayoutPanel]: 'Layout Panel',
    [ComponentType.LayoutSider]: 'Layout Sider',
    [ComponentType.Tabs]: 'Tabs',
    [ComponentType.Tag]: 'Tag',
    [ComponentType.Tree]: 'Tree',
    [ComponentType.Empty]: 'Empty',
    [ComponentType.Statistic]: 'Statistic',
    [ComponentType.Comment]: 'Comment',
    [ComponentType.Table]: 'Table',
    [ComponentType.Menu]: 'Menu',
    [ComponentType.Pagination]: 'Pagination',
    [ComponentType.Breadcrumb]: 'Breadcrumb',
    [ComponentType.Dropdown]: 'Dropdown',
    [ComponentType.Input]: 'Input',
    [ComponentType.InputNumber]: 'InputNumber',
    [ComponentType.InputNumberRange]: 'InputNumberRange',
    [ComponentType.Textarea]: 'Textarea',
    [ComponentType.Select]: 'Select',
    [ComponentType.TreeSelect]: 'TreeSelect',
    [ComponentType.Cascader]: 'Cascader',
    [ComponentType.CityPicker]: 'CityPicker',
    [ComponentType.Upload]: 'Upload',
    [ComponentType.PictureUpload]: 'Picture Upload',
    [ComponentType.Rate]: 'Rate',
    [ComponentType.Transfer]: 'Transfer',
    [ComponentType.Buttons]: 'Buttons',
    [ComponentType.DatePicker]: 'DatePicker',
    [ComponentType.DateRangePicker]: 'DateRangePicker',
    [ComponentType.MonthPicker]: 'MonthPicker',
    [ComponentType.TimePicker]: 'TimePicker',
    [ComponentType.WeekPickerker]: 'WeekPicker',
    [ComponentType.RadioGroup]: 'Radio',
    [ComponentType.CheckBox]: 'CheckBox',
    [ComponentType.Switch]: 'Switch',
    [ComponentType.Slider]: 'Slider',
    [ComponentType.Steps]: 'Step',
    [ComponentType.Timeline]: 'Timeline',
    [ComponentType.Spin]: 'Spin',
    [ComponentType.Skeleton]: 'Skeleton',
    [ComponentType.ModelQueryForm]: 'QueryForm',
    [ComponentType.ModelPicker]: 'ModelPicker',
    [ComponentType.ModelPickerTree]: 'ModelPickerTree',
    [ComponentType.FormList]: 'FormList',
    [ComponentType.AssociateList]: 'AssociateList',
    [ComponentType.FormModel]: 'FormModel',
    [ComponentType.FormModelItem]: 'FormModelItem',
    [ComponentType.FormActionBar]: 'FormActionBar',
    [ComponentType.FormSheet]: 'FormSheet',
    [ComponentType.FormSheetItem]: 'FormSheetItem',
    [ComponentType.ModelTable]: 'Model table',
    [ComponentType.ModelTableColumn]: 'Model table column',
    [ComponentType.Alert]: 'Alert',
    [ComponentType.Drawer]: 'Drawer',
    [ComponentType.Modal]: 'Modal',
    [ComponentType.ModalMobile]: 'ModalMobile',
    [ComponentType.ModelTableGroup]: 'ModalFormSheet',
    [ComponentType.Progress]: 'Progress',
    [ComponentType.Popconfirm]: 'Popconfirm',
    [ComponentType.Divider]: 'Divider',
    [ComponentType.Amap]: 'map',
    [ComponentType.Address]: 'Address',
    [ComponentType.RichText]: 'Rich Text',
    [ComponentType.ModelDataSource]: 'Model Datasource',
    [ComponentType.AppMenu]: 'Application Menu',
    [ComponentType.StaffSelector]: 'StaffSelector',
    [ComponentType.ModelCardView]: 'ModelCardView',
    [ComponentType.ModelCardViewMobile]: 'ModelCardView',
    [ComponentType.ModelCardGroupMobile]: 'ModelCard',
    [ComponentType.ModelCardGroup]: 'ModelCardGroup',
    [ComponentType.ModelCardItemText]: 'ModelCardItemText',
    [ComponentType.ModelCardItemImage]: 'ModelCardItemImage',
    [ComponentType.ColumnAction]: 'ColumnAction',
    [ComponentType.Iframe]: 'Iframe',
    [ComponentType.Dashboard]: 'Dashboard',
  },
  group: {
    [ComponentGroup.Basic]: 'Basic',
    [ComponentGroup.Layout]: 'Layout',
    [ComponentGroup.Nav]: 'Nav',
    [ComponentGroup.Form]: 'Data Entry',
    [ComponentGroup.View]: 'Data Display',
    [ComponentGroup.Feedback]: 'Feedback',
    [ComponentGroup.ModelDrive]: 'Model Drive',
    [ComponentGroup.AppMenu]: 'App Menu',
    [ComponentGroup.Frequently]: 'Frequently used',
    [ComponentGroup.Business]: 'Business',
    [ComponentGroup.FrequentlyUsed]: '常用组件',
    public: '公共组件',
  },
};
export const action = {
  actionColumn: 'add Action cloumn',
  addBtn: 'addBtn',
  btnName: 'btnName',
  btnDisplayRule: 'Btn Display Rule',
};

export const base = {
  name: 'Name',
  ID: 'ID',
  visible: 'Visible',
};

export const pageOpt = {
  pageRoute: 'Route',
  pageRouteTip: 'Please input a right route name！',
  pageName: 'Name',
  pageNameTip: 'Please input page name！',
  pageGroupCode: 'Group',
  desc: 'Description',
  pageSuport: 'Suport',
  pageTpl: 'Template',
  new: 'New page',
  editPage: 'Edit page',
  copyPage: 'Copy page',
  confirm: 'Ok',
  cancel: 'Cancel',
  newGroup: 'New group',
  noNamedGroup: 'No named group',
  editGroup: 'Edit group',
  edit: 'Edit',
  delete: 'Delete',
  placeHolder: 'Please input',
  groupName: 'Group Name',
  groupTitle: 'Group Title',
  exportText: 'Export',
};

export const tips = {
  dragIn: 'drag in here',
  copySuccess: 'Copy Success',
  input: 'input',
  sureDelete: 'Sure to delete?',
  IDExists: '{id} already exists',
};

export const panel = {
  customStyle: 'Page Style',
  pureStyle: 'Component Style',
  appStyle: 'Application Style',
  appAction: 'Application Action',
  preview: 'Preview',
  save: 'Save',
  export: 'Export',
  pageOptions: 'Page options',
  componentOptions: 'Component options',
  page: 'Page',
  component: 'Component',
  domainModel: 'Model',
  componentTree: 'Component tree',
  systemComponent: 'System',
  customComponent: 'Custom',
  pcDesign: 'PC Design',
  mobileDesign: 'Mobile Design',
  no: 'No.',
  frozen: 'Frozen',
  unFrozen: 'UnFrozen',
  delete: 'Delete',
  move: 'Move',
  copy: 'Copy',
  reName: 'ReName',
  hidden: 'Hidden',
  visible: 'Visible',
  event: 'Events',
  addEvent: 'Add event',
  systemAction: 'System action',
  customAction: 'Custom action',
  editCustomAction: 'Edit custom action',
  eventType: 'Event type',
  eventHandler: 'Event handler',
  parameterSettings: 'Parameter settings',
  eventName: 'Event Name',
  menu: 'Menu',
  masterExplorer: 'Master',
  datasourceExplorer: 'Datasource',
  edit: 'edit',
  exitEdit: 'Exit editing',
  editTips:
    'The current operation cannot be saved. Please click the "Edit" button to add the edit mode',
  know: 'I know',
  changeRecord: 'Change Record',
  messagePop:
    'The current content has changed, you can update to view the latest content',
  messagePopDel:
    'This page has been deleted，please click update button to update',
  update: 'update',
  notSave: 'Not save',
  isViewStatus: 'The current operation cannot be saved,',
  toEditModel: 'Please click the "Edit" button to enter the edit mode',
  quitTips: 'Exit prompt',
  quitInfo:
    'There are unsaved changes. Do you want to exit editing after saving?',
  // eslint-disable-next-line max-len
  publicPage:
    'When the page is set to public, the page does not need to log in with an account to access all contents of the page, including the fields of the page, and data and operations are not restricted by permissions.',
};

export const themeSet = {
  default: 'default',
  addTheme: 'add theme',
  add: 'add',
  delete: 'delete',
  customTheme: 'custom theme',
  themeName: 'theme name',
  deleteTheme: 'delete theme',
  globalColor: 'global color',
  successColor: 'success color',
  warningColor: 'warning color',
  mainFontSize: 'main font size',
  errorColor: 'error color',
  titleColor: 'title color',
  MainTextColor: 'main text color',
  secondaryTextColor: 'secondary text color',
  invalidColor: 'invalid color',
  fillet: 'Component / floating fillet',
  borderColor: 'border color',
  reset: 'reset',
};

export const formTip = {
  input: 'please input',
  select: 'select',
};

export const system = {
  actions: {
    openUrl: {
      properties: {
        siteType: 'Url type',
        siteUrl: 'Site Url',
        openType: 'Open type',
      },
    },
  },
};

export const gridProperty = {
  xs: 'lt576',
  sm: 'ge576',
  md: 'ge768',
  lg: 'ge992',
  xl: 'ge1200',
  xxl: 'ge1600',
};

export const boardControl = {
  cancel: 'cancel',
  redo: 'redo',
  zoomOut: 'zoom out',
  zoomIn: 'zoom in',
};

export const bindingModel = {
  domainCode: 'domainCode',
  schemaCode: 'schemaCode',
  primaryKey: 'primaryKey',
};

export const icon = {
  type: 'type',
  theme: 'theme',
  color: 'color',
  size: 'size',
};

export const dataSource = {
  items: 'list data',
};

export const alignment = {
  display: 'display',
  flexDirection: 'flexDirection',
  justifyContent: 'justifyContent',
  alignItems: 'alignItems',
};

export const Menu = {
  enum: {
    vertical: 'vertical',
    horizontal: 'horizontal',
    inline: 'inline',
    light: 'light',
    dark: 'dark',
  },
};
