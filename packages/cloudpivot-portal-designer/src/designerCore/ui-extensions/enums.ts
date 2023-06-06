/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
// 组件名称
export enum ComponentType {
  Master = 'Master',

  Anchor = 'Anchor',

  AnchorLink = 'AnchorLink',

  Demo = 'Demo',

  Buttons = 'Button',

  Divider = 'Divider',

  Video = 'Video',

  Label = 'Label',

  Img = 'Img',

  Scan = 'Scan',

  QRCode = 'QRCode',

  // 面板容器，功能包括上拉刷新及下拉刷新
  PanelContainer = 'PanelContainer',

  TextList = 'TextList',

  Page = 'Page',

  Card = 'Card',

  Avatar = 'Avatar',

  Calendar = 'Calendar',

  Badge = 'Badge',

  Grid = 'Grid',

  GridCol = 'GridCol',

  Container = 'Container',

  StepsContainer = 'StepsContainer',

  StepsPanel = 'StepsPanel',

  NavContainer = 'NavContainer',

  NavPanel = 'NavPanel',

  TabsContainer = 'TabsContainer',

  TabsPanelContainer = 'TabsPanelContainer',

  CarouselContainer = 'CarouselContainer',

  CarouselPanel = 'CarouselPanel',

  Layout = 'Layout',

  LayoutPanel = 'LayoutPanel',

  LayoutSider = 'LayoutSider',

  Tabs = 'Tabs',

  TabPanel = 'TabPanel',

  Collapse = 'Collapse',

  CollapsePanel = 'CollapsePanel',

  Iframe = 'Iframe',

  Table = 'Table',

  Icon = 'Icon',

  Chequer = 'Chequer',

  Carouselcomp = 'Carouselcomp',

  Menu = 'Menu',

  Pagination = 'Pagination',

  MobilePagination = 'MobilePagination',

  Breadcrumb = 'Breadcrumb',

  Dropdown = 'Dropdown',

  Tag = 'Tag',

  Tree = 'Tree',

  Empty = 'Empty',

  Statistic = 'Statistic',

  Comment = 'Comment',
  Amap = 'Amap',
  Address = 'Address',

  List = 'List',

  /**
   * ===表单类组件====
   */
  FormModel = 'FormModel',

  ModelQueryForm = 'ModelQueryForm',

  FormModelMobile = 'FormModelMobile',

  QueryFormModelMobile = 'QueryFormModelMobile',

  FormModelItem = 'FormModelItem',

  QueryFormModelItem = 'QueryFormModelItem',

  FormActionBar = 'FormActionBar',

  FormSheet = 'FormSheet',

  FormSheetMobile = 'FormSheetMobile',

  FormSheetItem = 'FormSheetItem',

  // FormSheetItemAdaptive = 'FormSheetItemAdaptive',
  // FormSheetItemAdaptiveDes = 'FormSheetItemAdaptiveDes',

  FormItem = 'FormItem',

  FormList = 'FormList',

  AssociateList = 'AssociateList', // 关联列表组件

  ModelTable = 'ModelTable',

  ChildTable = 'ChildTable', // 子表表格

  ModelTableColumn = 'ModelTableColumn',

  ModelTableGroup = 'ModelTableGroup',

  Input = 'Input',

  InputNumber = 'InputNumber',

  InputNumberRange = 'InputNumberRange',

  InputUpload = 'InputUpload',

  Textarea = 'Textarea',

  Select = 'Select',

  TreeSelect = 'TreeSelect',

  Cascader = 'Cascader',

  CityPicker = 'CityPicker',

  Upload = 'Upload',

  PictureUpload = 'PictureUpload',

  Rate = 'Rate',

  Transfer = 'Transfer',

  DatePicker = 'DatePicker',

  DateRangePicker = 'DateRangePicker',

  MonthPicker = 'MonthPicker',

  WeekPickerker = 'WeekPickerker',

  TimePicker = 'TimePicker',

  RadioGroup = 'RadioGroup',

  CheckBox = 'CheckBox',

  Switch = 'FormSwitch',

  Slider = 'Slider',

  Steps = 'Steps',

  Timeline = 'Timeline',

  RichText = 'RichText',

  /**
   * 反馈类组件
   */
  Alert = 'Alert',

  Drawer = 'Drawer',

  Progress = 'Progress',

  Modal = 'Modal',

  ModalMobile = 'ModalMobile',

  Spin = 'Spin',

  Skeleton = 'Skeleton',

  Popconfirm = 'Popconfirm',

  /**
   *  数据源
   */
  ModelDataSource = 'ModelDataSource',

  DataSource = 'UiDataSource',
  UiDataSource = 'UiDataSource',

  /**
   *  模型驱动
   */
  ModelPicker = 'ModelPicker',

  ModelPickerTree = 'ModelPickerTree',

  ModelCardView = 'ModelCardView',

  ModelCardGroup = 'ModelCardGroup',

  ModelCardItemText = 'ModelCardItemText',

  ModelCardItemImage = 'ModelCardItemImage',

  /**
   * 模型驱动卡片移动端
   */
  ModelCardViewMobile = 'ModelCardViewMobile',

  ModelCardGroupMobile = 'ModelCardGroupMobile',

  /**
   * 菜单驱动UI
   */
  AppMenu = 'AppMenu',

  StaffSelector = 'StaffSelector',

  ColumnAction = 'ColumnAction',

  /**
   * 图表类组件
   */
  Dashboard = 'Dashboard', // 报表

  // 业务组件
  ShortcutList = 'ShortcutList', // 最近使用

  GridNavigation = 'GridNavigation', // 宫格导航

  Chart = 'Chart', // 图表组件

  MyUnfinished = 'MyUnfinished', // 我的待办

  TabTextList = 'TabTextList', // 多页签文本列表

  Carousel = 'Carousel', // 跑马灯

  MyApplication = 'MyApplication', // 我的应用

  RowMenu = 'RowMenu', // 横向导航组件

  ColMenu = 'ColMenu', // 纵向导航组件

  NewGrid = 'NewGrid', // 容器组件

  TabsGrid = 'TabsGrid', // 容器组件

  TabsPanelGrid = 'TabsPanelGrid',

  VerticalTabs = 'VerticalTabs',

  HorizTabs = 'HorizTabs',
}

// 组件分组
export enum ComponentGroup {
  /**
   * 常用组件
   */
  Frequently = 'frequently',
  /**
   * 其他
   */
  ModelDrive = 'modelDrive',
  /**
   * 布局
   */
  Layout = 'layout',

  /**
   * 基础
   */
  Basic = 'basic',

  /**
   * 导航
   */
  Nav = 'nav',

  /**
   * 表单
   */
  Form = 'form',

  /**
   * 数据展示、视图
   */
  View = 'view',

  /**
   * 反馈
   */
  Feedback = 'feedback',

  /**
   * 应用菜单
   * */
  AppMenu = 'appMenu',

  /**
   * 第三方组件
   */
  ThridParty = 'thirdParty',

  /**
   * 导航组件
   */
  Navigation = 'Navigation',

  /**
   * 常用组件
   */
  FrequentlyUsed = 'FrequentlyUsed',

  /**
   * 业务组件
   */
  Business = 'Business',
}
