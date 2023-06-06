/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { ComponentType, ComponentGroup } from '../enums';

export const component = {
  type: {
    [ComponentType.Page]: '页面',
    [ComponentType.Master]: '母版',
    [ComponentType.Demo]: 'Demo',
    [ComponentType.List]: '列表',
    [ComponentType.Buttons]: '按钮',
    [ComponentType.Divider]: '分割线',
    [ComponentType.Video]: '视频',
    [ComponentType.Label]: '文本',
    [ComponentType.QRCode]: '二维码',
    [ComponentType.TextList]: '文本列表',
    [ComponentType.Card]: '卡片',
    [ComponentType.Avatar]: '头像',
    [ComponentType.Anchor]: '锚点',
    [ComponentType.AnchorLink]: '锚点链接',
    [ComponentType.Calendar]: '日历',
    [ComponentType.Badge]: '徽标',
    [ComponentType.Icon]: '图标',
    [ComponentType.Chequer]: '宫格',
    [ComponentType.Carouselcomp]: '轮播图',
    [ComponentType.Img]: '图片',
    [ComponentType.Scan]: '扫一扫',
    [ComponentType.Grid]: '栅格',
    [ComponentType.GridCol]: '栅格列',
    [ComponentType.Container]: '容器',
    [ComponentType.StepsContainer]: '步骤条容器',
    [ComponentType.StepsPanel]: '步骤条面板',
    [ComponentType.NavContainer]: '导航页容器',
    [ComponentType.NavPanel]: '导航页面板',
    [ComponentType.TabsContainer]: '标签页容器',
    [ComponentType.TabsPanelContainer]: '标签页面板',
    [ComponentType.CarouselContainer]: '轮播容器',
    [ComponentType.CarouselPanel]: '轮播面板',
    [ComponentType.Collapse]: '折叠面板容器',
    [ComponentType.CollapsePanel]: '折叠子面板',
    [ComponentType.PanelContainer]: '面板容器',
    [ComponentType.Layout]: '布局',
    [ComponentType.LayoutPanel]: '布局面板',
    [ComponentType.LayoutSider]: '布局边栏',
    [ComponentType.Tabs]: '标签页',
    [ComponentType.Tag]: '标签',
    [ComponentType.Empty]: '空状态',
    [ComponentType.Statistic]: '统计数值',
    [ComponentType.Comment]: '评论',
    [ComponentType.Tree]: '树形控件',
    [ComponentType.TabPanel]: '标签页面板',
    [ComponentType.Table]: '表格',
    [ComponentType.Menu]: '导航菜单',
    [ComponentType.Steps]: '步骤条',
    [ComponentType.Pagination]: '分页',
    [ComponentType.Breadcrumb]: '面包屑',
    [ComponentType.Dropdown]: '下拉菜单',
    [ComponentType.Input]: '输入框',
    [ComponentType.InputNumber]: '数字输入框',
    [ComponentType.InputNumberRange]: '数值范围',
    [ComponentType.Textarea]: '文本域',
    [ComponentType.Select]: '下拉框',
    [ComponentType.TreeSelect]: '树选择',
    [ComponentType.Cascader]: '级联选择',
    [ComponentType.CityPicker]: '省市区选择',
    [ComponentType.Upload]: '上传',
    [ComponentType.PictureUpload]: '图片上传',
    [ComponentType.Rate]: '评分',
    [ComponentType.Transfer]: '穿梭框',
    [ComponentType.DatePicker]: '日期选择框',
    [ComponentType.DateRangePicker]: '日期范围选择框',
    [ComponentType.MonthPicker]: '年月选择框',
    [ComponentType.TimePicker]: '时间选择框',
    [ComponentType.WeekPickerker]: '年周选择框',
    [ComponentType.RadioGroup]: '单选框',
    [ComponentType.CheckBox]: '多选框',
    [ComponentType.Switch]: '开关',
    [ComponentType.Timeline]: '时间轴',
    [ComponentType.Slider]: '滑动输入条',
    [ComponentType.Amap]: '地图',
    [ComponentType.Address]: '地址选择',
    [ComponentType.RichText]: '富文本',
    [ComponentType.Spin]: '加载中',
    [ComponentType.Skeleton]: '骨架屏',
    [ComponentType.ModelPicker]: '关联表单',
    [ComponentType.ModelPickerTree]: '树状关联表单',
    [ComponentType.ModelQueryForm]: '查询表单',
    [ComponentType.FormModel]: '表单',
    [ComponentType.FormModelMobile]: '表单',
    [ComponentType.FormModelItem]: '表单项',
    [ComponentType.FormActionBar]: '表单操作栏',
    [ComponentType.FormSheet]: '子表',
    [ComponentType.FormSheetItem]: '子表表单项',
    [ComponentType.FormSheetMobile]: '子表',
    [ComponentType.FormList]: '列表',
    [ComponentType.AssociateList]: '关联列表',
    [ComponentType.ModelTable]: '模型表格',
    [ComponentType.ModelTableColumn]: '模型表格列',
    [ComponentType.ModelTableGroup]: '模型子表',
    [ComponentType.Alert]: '警告提示',
    [ComponentType.Drawer]: '抽屉',
    [ComponentType.Modal]: '对话框',
    [ComponentType.ModalMobile]: '模态框',
    [ComponentType.Progress]: '进度条',
    [ComponentType.Popconfirm]: '气泡确认框',
    [ComponentType.ModelDataSource]: '模型数据源',
    [ComponentType.ModelCardView]: '卡片视图',
    [ComponentType.ModelCardViewMobile]: '卡片视图',
    [ComponentType.ModelCardGroupMobile]: '卡片容器',
    [ComponentType.ModelCardGroup]: '卡片组',
    [ComponentType.ModelCardItemText]: '卡片文本',
    [ComponentType.ModelCardItemImage]: '卡片图片',
    [ComponentType.AppMenu]: '应用菜单',
    [ComponentType.StaffSelector]: '选人控件',
    [ComponentType.ColumnAction]: '动作按钮',
    [ComponentType.Iframe]: 'iframe 组件',
    [ComponentType.Dashboard]: '报表',
  },
  group: {
    [ComponentGroup.Layout]: '布局组件',
    [ComponentGroup.Basic]: '基础组件',
    [ComponentGroup.Nav]: '导航组件',
    [ComponentGroup.Form]: '数据录入组件',
    [ComponentGroup.View]: '数据展示组件',
    [ComponentGroup.Feedback]: '反馈组件',
    [ComponentGroup.ModelDrive]: '模型驱动组件',
    [ComponentGroup.AppMenu]: '应用菜单组件',
    [ComponentGroup.Frequently]: '常用组件',
    [ComponentGroup.ThridParty]: '第三方组件',
    [ComponentGroup.Business]: '业务组件',
    [ComponentGroup.FrequentlyUsed]: '常用组件',
    public: '公共组件',
  },
};

export const base = {
  name: '名称',
  ID: 'ID',
  visible: '显示',
};

export const pageOpt = {
  pageRoute: '页面编码',
  pageRouteTip: '请输入正确的页面编码',
  pageName: '页面名称',
  pageNameTip: '请输入正确的页面名称',
  pageGroupCode: '页面分组',
  desc: '描述',
  pageSuport: '支持终端',
  pageTpl: '页面模板',
  new: '新建页面',
  editPage: '修改页面',
  copyPage: '复制页面',
  confirm: '确定',
  cancel: '取消',
  newGroup: '新建分组',
  noNamedGroup: '未命名分组',
  editGroup: '编辑分组',
  groupName: '分组名称',
  groupTitle: '分组标题',
  edit: '编辑',
  delete: '删除',
  exportText: '导出',
};

export const tips = {
  dragIn: '拖拽组件到此处',
  copySuccess: '复制成功',
  input: '',
  sureDelete: '确认删除？',
  IDExists: '{id}已存在',
  loadMore: '加载更多',
};

export const panel = {
  customStyle: '页面样式',
  pureStyle: '组件样式',
  appStyle: '应用样式',
  appAction: '应用动作',
  preview: '预览',
  save: '保存',
  cancel: '取消',
  search: '搜索',
  export: '导出',
  publish: '发布',
  pageOptions: '页面属性',
  componentOptions: '属性',
  page: '页面',
  component: '组件',
  domainModel: '模型',
  datasource: '数据源',
  componentTree: '组件树',
  systemComponent: '组件库',
  sharedComponent: '共享',
  customComponent: '自定义',
  pcDesign: 'PC端设计',
  mobileDesign: '移动端设计',
  no: '序号',
  frozen: '冻结此列',
  unFrozen: '取消冻结',
  delete: '删除',
  move: '移动',
  copy: '复制',
  reName: '重命名',
  hidden: '隐藏',
  visible: '可见',
  event: '动作事件',
  addEvent: '添加事件',
  systemAction: '系统动作',
  customAction: '自定义动作',
  editCustomAction: '编辑自定义动作',
  addCustomAction: '添加自定义动作',
  eventType: '触发事件',
  eventHandler: '响应事件',
  parameterSettings: '参数设置',
  eventName: '事件名称',
  appMenu: '菜单',
  menu: '菜单',
  masterExplorer: '母版',
  datasourceExplorer: '数据源',
  edit: '编辑',
  exitEdit: '退出编辑',
  editTips:
    '现在是查看状态，当前的操作不能保存，请点击“编辑”按钮后加入编辑模式',
  know: '知道了',
  changeRecord: '变更记录',
  messagePop: '当前内容已变更，可更新查看最新内容',
  messagePopDel: '当前页面已被删除，请点击更新按钮刷新',
  update: '更新',
  notSave: '不保存',
  isViewStatus: '现在是查看状态，当前的操作不能保存，',
  toEditModel: '请点击“编辑”按钮进入编辑模式',
  quitTips: '离开提示',
  quitInfo: '存在未保存的修改，是否保存后再离开？',
  // publicPage: '将页面设置为公开时，页面不需要账号登录就可访问页面全部内容，包括页面的字段，数据、操作都不受权限限制。',
};

export const themeSet = {
  default: '默认',
  addTheme: '增加主题',
  add: '增加',
  delete: '删除',
  customTheme: '定制主题',
  themeName: '主题名称',
  deleteTheme: '删除主题',
  globalColor: '全局主色',
  successColor: '成功色',
  warningColor: '警告色',
  errorColor: '错误色',
  mainFontSize: '主字号',
  titleColor: '标题颜色',
  MainTextColor: '主文本颜色',
  secondaryTextColor: '次文本颜色',
  invalidColor: '失效颜色',
  fillet: '组件/浮层圆角',
  borderColor: '边框色',
  reset: '重置',
};

export const formTip = {
  input: '请输入',
  select: '请选择',
};

export const system = {
  actions: {
    OpenUrl: {
      properties: {
        siteType: '地址类型',
        outerUrl: '页面地址',
        innerUrl: '页面地址',
        openType: '打开类型',
      },
      enums: {
        outer: '外部链接',
        inner: '内部链接',
        _blank: '新窗口打开',
        _self: '当前窗口打开',
      },
    },
  },
};

export const gridProperty = {
  xs: '窗口宽≤576',
  sm: '576<窗口宽≤768',
  md: '768<窗口宽≤992',
  lg: '992<窗口宽≤1200',
  xl: '1200<窗口宽≤1600',
  xxl: '1600<窗口宽',
};

export const boardControl = {
  cancel: '撤销',
  redo: '取消撤销',
  zoomOut: '缩小',
  zoomIn: '放大',
};

export const bindingModel = {
  domainCode: '领域模型编码',
  schemaCode: '模型编码',
  primaryKey: '主键',
};

export const icon = {
  type: '类型',
  theme: '主题',
  color: '颜色',
  size: '尺寸',
};

export const dataSource = {
  items: '列表数据',
};

export const alignment = {
  display: '显示',
  flexDirection: 'flexDirection',
  justifyContent: 'justifyContent',
  alignItems: 'alignItems',
};

export const Menu = {
  enum: {
    vertical: '垂直',
    horizontal: '水平',
    inline: '行内',
    light: '亮',
    dark: '暗',
  },
};