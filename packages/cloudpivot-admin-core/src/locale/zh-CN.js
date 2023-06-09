import form from 'cloudpivot-form/form/locales/zh-CN';
import list from 'cloudpivot-list/list/locales/zh-CN';
import flow from 'cloudpivot-flow/flow/locales/zh-CN';
import system from 'cloudpivot-admin-core/src/locale/system/system.zh-CN';
import apps from './apps.zh-CN';
import appSettings from './app-settings.zh-CN';
import formDesign from './form-design.zh-CN';
import listDesign from './list-design.zh-CN';
import integration from './integration.zh-CN';
import report from './report-settings.zh-CN';
import flowCenter from 'cloudpivot-flow/flow-center/locales/zh-CN';

import widgets_zh from 'cloudpivot-portal-designer/src/designerCore/ui-extensions/widgets/languages/zh';
import uiProperty_zh from '@cloudpivot-shared/ui-property-editor/src/languages/zh';
import * as base_zh from 'cloudpivot-portal-designer/src/designerCore/ui-extensions/languages/zh';

export default {
  cloudpivot: {
    form,
    list,
    flow,
    report,
    flowCenter,
  },
  languages: {
    system,
    integration,
    appSettings,
    Apps: {
      ...apps,
      FormDesignPage: formDesign,
      listDesignPage: listDesign,
    },
    ConsoleManager: '后台管理',
    PortalManager: '门户首页',
    HelpCenter: '帮助中心',
    PersonalInformation: '个人信息',
    ChangePwd: '修改密码',
    OppositeLanguage: 'English',
    Exit: '退出系统',
    AppManager: '应用管理',
    PortalDesigner: '门户管理',
    Organization: '组织机构',
    BizIntegration: '业务集成',
    SystemManager: '系统管理',
    OrganizationRole: '组织角色',
    OrganizationSync: '组织同步',
    UserInfoExt: '用户信息拓展表',
    NoUser: '暂无用户',
    Ok: '确定',
    Cancel: '取消',
    DeleteSuccess: '删除成功',
    PublishSuccess: '发布成功',
    versionChanged: '版本$已更新，发布后将会覆盖新版本。',
    SaveSuccess: '保存成功',
    RestoreSuccess: '还原成功',
    ImportDepartment: '导入部门',
    ExportDepartment: '导出部门',
    ImportPerson: '导入人员',
    ExportPerson: '导出人员',
    Modal: {
      ImportData: '导入数据',
      StartImport: '开始导入',
      ImportTips1: '为确保上传数据与组织匹配，请先',
      ImportTips2: '下载部门示例文件、人员示例文件',
      ImportTips3: '支持csv/xlsx格式，文件大小不限，一次最多能导入10000条',
      ImportLocalFaile: '上传本地文件',
      ClickToImport: '点击或拖拽上传',
      DownloadFailed: '文件下载失败',
    },
    User: {
      UserInformation: '用户信息',
      BaseInfo: '基本信息',
      Avatar: '头像',
      UserAccount: '用户账号',
      UserDepartment: '所属部门',
      UserMainDepartment: '所属主部门',
      UserName: '用户姓名',
      Gender: '性别',
      Manager: '主管',
      Role: '角色',
      PersonInfo: '个人信息',
      Birthday: '出生日期',
      IdentityNumber: '身份证号',
      Contact: '联系方式',
      department: '所属部门',
      MobilePhone: '手机号',
      OfficePhone: '办公电话',
      DingTalk: '钉钉',
      Email: '邮箱',
      OrganizationInfo: '组织信息',
      EmployeeInfo: '员工信息',
      EmployeeNumber: '员工编号',
      EmployeeRank: '职级',
      Appellation: '称谓',
      Secretary: '秘书',
      EntryDate: '入职时间',
      DepartureDate: '离职时间',
      PartTimeDepartment: '兼职部门',
      SettingMainDepartment: '设置主部门',
      MainDepartment: '当前主部门',
      StudentInfo: '学生信息',
      ChildsInfo: '孩子信息',
      TeachersInfo: '老师信息',
      StudentId: '学号',
      Class: '所在班级',
      Parents: '家长',
      IsHeadTeacher: '是否班主任',
      ChildName: '孩子姓名',
    },
    PlaceHolder: {
      SearchByName: '请输入姓名/账号搜索',
      SearchByNameDept: '姓名/账号/部门搜索',
      SearchByCodeOrName: '请输入编码或名称搜索',
      Select: '请选择',
      InputCode: '请输入编码',
      InputName: '请输入名称',
      BizType: '业务类型',
      InputDefaultVal: '请输入默认值',
      InputAppName: '请输入应用名称',
      InputAppCode: '请输入应用编码，例：bpmH3_01',
      InputFolderName: '请输入目录名称',
      Input: '请输入',
      InputRole: '请输入角色名称',
    },
    Password: {
      ChangePwd: '更改密码',
      OldPwd: '原密码',
      PleaseInputOldPwd: '请输入原密码',
      OldPwdError: '原密码输入错误',
      PleaseInputNewPwd: '请输入新密码',
      SurePwd: '确认密码',
      InputNewPwdAgain: '请再输入一次新密码',
      SurePwdError: '修改密码和确认密码不一致',
      PwdIsNullTip: '密码不允许为空',
      ChangePwdSuccess: '密码修改成功！',
      CanNotSamePwd: '原密码和新密码不能一样！',
    },
    Name: '姓名',
    NO: '序号',
    Roles: '所属角色',
    Department: '部门',
    ManagementScope: '管理范围',
    Operation: '操作',
    WorkHandover: '工作交接',
    HistoryRec: '历史记录',
    ResetPassWord: '重置密码',
    Delete: '删除',
    NoRelevantData: '暂无相关数据',
    NoSearchData: '暂无搜索结果',
    NoRelevantDataTips: '未找到相关数据，请重新输入关键词',
    ClickToLoadMore: '点击加载更多',
    LoadMore: '加载更多...',
    HasLoadedAllData: '已加载完所有数据！',
    // 组织同步
    Synching: '同步中',
    SynchronizeNow: '立即同步',
    Query: '查询',
    ProcessName: '流程名称',
    DeptOfOriginator: '发起人组织',
    ReceiveTime: '接收时间',
    TaskNode: '流程节点',
    TaskTransfer: {
      TaskTransfer: '{name} 的工作交接',
      WorkerFlow: '流程模板',
      BizModel: '业务模型',
      SequenceStatus: '单据状态',
      Originator: '发起人',
      Delegatee: '接收人',
      DelegateeOrg: '接收部门',
      HandoverRole: '接收人角色',
      SearchWorkerFlow: '请输入流程模板名称',
      SearchByOriginator: '请选择发起人',
      SelectDelegatee: '请选择任务交接人',
      Selected: '已选中',
      TransferAll: '交接当前{num}条任务',
      TransferAll2: '交接当前{num}条数据',
      TransferSelected: '交接已选任务',
      TransferSelected2: '交接已选数据',
      Name: '数据标题',
      OwnerDept: '拥有者部门',
      CreatedTime: '创建时间',
      SchemaCode: '所属模型',
      TranferTips: '确定要交接当前 {num} 条任务吗？',
      TranferTips2: '确定要交接当前 {num} 条数据吗？',
      TranferTips3: '交接完成后不可撤回，请谨慎操作',
      TranferTips4: '确定交接全部应用下当前用户的所有数据？',
      TransferAllAppData: '确定要交接全部数据吗？',
      TransferAllContent:
        '当前交接数据量过大，将会耗时较长，系统将会在后台执行交接动作',
      ContinueTransfer: '继续交接',
    },
    Save: '保存',
    UserAction: '用户活动',
    BizAction: '系统活动',
    SubInstance: '子流程',
    Connection: '连接点',
    Notify: '传阅',
    Switch: '切换',
    Prompt: '提示',
    Iknow: '我知道了',
    common: {
      ok: '确定',
      cancel: '取消',
      clear: '清除',
      reset: '重置',
      search: '搜索',
      approval: '审批记录',
      passwordErrorTips1: '原密码不能为空',
      passwordErrorTips2: '新密码不能为空',
      passwordErrorTips3:
        '新密码长度应为12-14位，且新密码中必须包含大、小写字母和数字',
      passwordErrorTips4: '新密码不能与原密码相同',
      passwordErrorTips5: '确认密码不能为空',
      passwordErrorTips6: '两次输入密码不一致',
      passwordErrorTips7:
        '新密码长度应为8-14位，且新密码中必须包含大、小写字母和数字',
      lastLoginTime: '上次登录时间：',
      changePwd: '修改密码',
      passwordSafeTips: '系统检测账号安全性低，请修改密码。',
      oldPwd: '原密码',
      newPwd: '新密码',
      surePwd: '确认新密码',
      placeholder: '请输入',
      LoadMore: '查看更多',
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
      workBenchInfo: {
        FavoriteApps: '收藏应用',
        ToDoTask: '我的待办',
        ToReadTask: '我的待阅',
        FinishedTask2: '我的已办',
        FinishedRead: '我的已阅',
        MyInitiated: '我发起的',
        createWorkflow: '发起流程',
        MyDraft: '我的草稿',
        Previous: '上一条',
        Next: '下一条',
        Shortcut: '最近使用',
        Belong: '所属应用：',
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
        Urge: '催办',
        Timeout: '超时',
        Duration: '停留时间：',
        total: '共',
        item1: '条，',
        currentlyShow: '当前展示',
        item2: '条',
        createTime: '创建时间：',
        loadedAll: '已展示加载完全部内容',
        deleteTips1: '确定删除此草稿？',
        deleteTips2: '确定删除所选{num}条草稿？',
        myApplications: '我的应用',
        tips1: '由用户在前台对自己有权限的应用进行管理',
        tips5: '业务组件带有业务逻辑，仅可以自定义样式',
        workflow: '流程',
      },
    },
  },

  widgets: {
    ...widgets_zh.widgets,
  },

  objects: {
    ...uiProperty_zh,
  },

  designer: {
    ...base_zh,
  },
};
