const prefix_app = '/api/runtime/app',
  prefix_workflow = '/api/runtime/workflow',
  prefix_form = '/api/runtime/form/',
  prefix_bizsheet = '/api/app/bizsheet/',
  prefix_urge = '/api/runtime/urge/',
  prefix_bizproperty = '/api/app/bizproperty/',
  prefix_bizmodels = '/api/app/bizmodels/',
  prefix_businessrule = '/api/app/businessrule/',
  prefix_convert = '/api/runtime/convert/',
  prefix_log = '/api/log/',
  prefix_runtime = '/api/runtime/';

export interface ApiMap {
  [name: string]: {
    [key: string]: string;
  };
}

const original: ApiMap = {
  /**
   * 应用中心
   */
  application: {
    appListAppsByGroup: prefix_app + '/list_apps_group',
    appListRecentlyUsedApp: '/api/runtime/favorites/list_recently_used_app',
    appListFavorite: '/api/runtime/favorites/list_favorites_app',
    appListCreateFavorite: '/api/runtime/favorites/create_favorites_app',
    appListDeleteFavorite: '/api/runtime/favorites/delete_favorites_app',
    appListApps: prefix_app + '/list_apps',
    appListFunctionsByCode: prefix_app + '/list_functions_by_appcode',
    appListFunctionsById: prefix_app + '/list_functions_by_id',
    appListRecentBizModels: prefix_app + '/list_recent_bizModel',
    appPackageGetSingleInfo: '/api/app/apppackage/get',
    appPackageTree: '/api/app/apppackage/trees',
    appPackageSearch: '/api/app/apppackage/search',
    searchWorkflowByName: '/api/runtime/workflow/search_workflow_by_name',
    appQueryGet: '/api/app/query/get',
    appQueryList: '/api/app/query/list',
    appSearchBizModels: prefix_app + '/search_bizModels',
    deleteListData: '/api/runtime/query/delete_data',
    deleteTemporaryFile: '/api/runtime/query/delete_temporary_file',
    getFormUrl: '/api/runtime/form/get_form_url',
    queryDownloadResult: '/api/runtime/query/download_result',
    downloadResult: '/api/runtime/query/download_import_error_info',
    queryExportData: '/api/runtime/query/export_data',
    queryAsyncExportData: '/api/runtime/query/export_data/async',
    queryExportTemplate: '/api/runtime/query/export_template',
    queryImportData: '/api/runtime/query/import_data',
    queryExportProgress: '/api/runtime/query/export_data/async/process',
    getExportData: '/api/runtime/query/export_data/async/export_file',
    getExportTaskList: '/api/export_task/query/list',
    deleteExportTaskList: '/api/export_task/query/delete',
    queryImportProgress: '/api/runtime/query/import_progress',
    queryUserImportProgress: '/api/runtime/query/user_import_progress',
    queryList: '/api/runtime/query/list',
    dynamicQuery: '/api/transfer/dynamicQuery',
    getOnlineLearnlist: '/api/onlineLearn/getOnlineLearnlist',
    selectOnlineExamList: '/api/onlineExam/selectOnlineExamList',
    selectOnlinePracticeList: '/api/onlineExam/selectOnlinePracticeList',
    selectTestPaperList: '/api/onlineExam/selectTestPaperList',
    getExamProportion: '/api/onlineExam/getExamProportion',
    queryGanttList: '/api/runtime/query/gantt/list',
    queryListReverseSheet: '/api/runtime/query/list_reverse_sheet',
    listSkipQueryList: '/api/runtime/query/listSkipQueryList',
    listSkipQueryListV2: '/api/runtime/query/listSkipQueryListV2',
    getExistItem: '/api/runtime/query/data_exist',
    importQueryField: '/api/app/bizproperty/list',
    checkDeleteItem: '/api/runtime/query/checkForRemoveBizObject',
    batchSavePaperQusetion: '/api/onlineExam/batchSavePaperQusetion',
    genShortCodes: '/api/runtime/query/genShortCodes',
    getReport: '/api/report/frontget',
    queryHeaders: '/api/runtime/query/getHeaders',
    secondImportData: '/api/runtime/query/second_import_data',
    sheetSecondImportData: '/api/runtime/query/form/second_import_data',
    bizobjects: '/api/runtime/query/bizobjects',
    objectIds: '/api/runtime/query/check/objectIds',
    appListAppsForTrust: '/api/runtime/app/list_apps_for_trust',
    getAppPackage: '/api/app/apppackage/appPackage',
    getBizFormPrint: prefix_runtime + 'query/getBizFormPrint',
    selectFormTitle: '/api/runtime/form/getConfigRelevanceFormColumn',
    getAppCodeByModelCode: '/api/app/folders/getByCode',
    getFormMarkingList: '/api/bizdata_track/searchBizDataTrack',
    getFormMarkingDetail: '/api/bizdata_track/getBizDataTrackByBizId',
    getFormMarkingSheet: '/api/bizdata_track/searchBizDataTrackChild',
    batchUpdate: '/api/runtime/query/batchUpdate',
    batchUpdateLog: '/api/runtime/query/batchUpdate/record',
  },
  /**
   * 流程相关
   */
  workflow: {
    abortInstance: prefix_workflow + '/abort_instance',
    activateActivity: prefix_workflow + '/activate_activity',
    adjustWorkitemParticipators:
      prefix_workflow + '/adjust_workItem_participators',
    assistWorkitem: prefix_workflow + '/assist_workItem',
    cancelActivity: prefix_workflow + '/cancel_activity',
    circulateWorkitem: prefix_workflow + '/circulate_workItem',
    createFavoriteWorkflow: '/api/runtime/favorites/create_favorites_workflow',
    getWorkflowHistory:
      '/api/runtime/favorites/list_favorites_workflow_recently_used',
    deleteFavoriteWorkflow: '/api/runtime/favorites/delete_favorites_workflow',
    deleteInstance: prefix_workflow + '/delete_instance',
    finishInstance: prefix_workflow + '/finish_instance',
    forwardWorkitem: prefix_workflow + '/forward_workItem',
    getComment: prefix_workflow + '/get_comment',
    getParticipants: prefix_workflow + '/get_participants',
    getWorkCount: prefix_workflow + '/get_work_count',
    listFavoritesWorkflow: '/api/runtime/favorites/list_favorites_workflow',
    listFinishedCirculates: prefix_workflow + '/list_finished_circulates',
    listFinishedWorkitems: prefix_workflow + '/list_finished_workitems',
    listInstances: prefix_workflow + '/list_instances',
    listMyInstances: prefix_workflow + '/list_my_instances',
    listMyWorkflow: prefix_workflow + '/list_my_workflow',
    listMyWorkflowByFolderId:
      prefix_workflow + '/list_my_workflow_by_folder_id',
    listMyWorkflowByName: prefix_workflow + '/list_my_workflow_by_name',
    listRejectActivities: prefix_workflow + '/list_reject_activities',
    listWorkitemApprovals: prefix_workflow + '/list_workitem_approvals',
    listWorkitems: prefix_workflow + '/list_workitems',
    rejectWorkitem: prefix_workflow + '/reject_workItem',
    revokeWorkitem: prefix_workflow + '/revoke_workitem',
    searchCirculates: prefix_workflow + '/search_circulates',
    searchWorkitems: prefix_workflow + '/search_workitems',
    updateCirculateReaded: prefix_workflow + '/update_circulate_readed',
    workflowList: '/api/workflow/list',
    listOperation: prefix_workflow + '/list_operation',
    getActivityPreprocessors: prefix_workflow + '/get_activity_preprocessors',
    adjustParticipantors: prefix_workflow + '/adjust_participantors',
    listWorkflowInstanceActivity:
      prefix_workflow + '/list_workflow_instance_activity',
    getInstanceBaseInfo: prefix_workflow + '/get_instance_baseinfo',
    listInstanceLogs: prefix_workflow + '/list_instance_logs',
    getWorkflowtemplateChart: prefix_workflow + '/get_workflowtemplate_chart',
    isRetrieve: prefix_workflow + '/is_retrieve',
    getWorkitemByInstanceid: prefix_workflow + '/get_workitem_by_instanceid',
    createWorkflowTrust: '/api/runtime/workflowTrust/createWorkflowTrust',
    deleteWorkflowTrust: '/api/runtime/workflowTrust/deleteWorkflowTrust',
    deleteCanceledWorkflowInstances:
      '/api/runtime/workflow/deleteCanceledWorkflowInstances',
    updateWorkflowTrust: '/api/runtime/workflowTrust/updateWorkflowTrust',
    queryWorkflowTrust: '/api/runtime/workflowTrust/queryWorkflowTrust',
    getWorkflowTrust: '/api/runtime/workflowTrust/getWorkflowTrust',
    listTrustOriginator: '/api/runtime/workflow/list_trust_originator',
    workflowListTrust: '/api/workflow/list_trust',
    workflowInstanceErr: prefix_log + 'detail_exception_by_wfInstId',
    saveCommonComment: '/api/runtime/common_comment/save',
    getCommonCommentList: '/api/runtime/common_comment/getCommonCommentList',
    deleteCommonComment: '/api/runtime/common_comment/deleteCommonComment',
    updateCommonComment: '/api/runtime/common_comment/updateSort',
    workflowPredict: '/api/runtime/workflow/predict',
  },
  /**
   * 用户信息
   */
  user: {
    getInfo: '/api/organization/user/info',
    departments: '/api/organization/user/departments',
    workflowFormDepartments:
      '/api/runtime/workflow/get_departments_by_workflow_permisson',
    orgLevel: '/api/organization/department/get_user_parent_depts',
    getDeptLeader: '/api/organization/user/getDeptLeaderInfoByUserId', // 根据用户id 获取部门主管信息
    verifyPersonSelectMapping: '/api/app/bizsheet/verifyPersonSelectMapping', //选人控件部门映射
    verifyPersonIsMapping: '/api/organization/department/orgRelationCheck',
    roleImportProgress: '/api/organization/role/import_progress',
  },
  /**
   * 机构
   */
  organization: {
    departmentTree: '/api/organization/department/tree',
    departmentListUser: '/api/organization/department/list_user',
    userTreeSearch: '/api/organization/user/tree/search',
    roleTree: '/api/organization/role/list',
    roleUsersByGroupid: '/api/organization/role/childs',
    getRolesByGroupParams: '/api/organization/role/page/childs',
    searchRoleByName: '/api/organization/role/get_role_by_name',
    roleGroupByCode: '/api/organization/role/get_rolegroup_by_code',
    roleGroupById: '/api/organization/role/get',
  },
  /**
   * 表单
   */
  form: {
    exist: '/api/aliyun/exist',
    getLatestHandSign: '/api/runtime/favorites/latest_hand_sign',
    load: prefix_form + 'load',
    save: prefix_form + 'save',
    getReplayToken: prefix_form + 'getReplayToken',
    submit: prefix_form + 'submit',
    delete: prefix_form + 'delete',
    workItemExist: prefix_form + 'workitem_exist',
    importData: prefix_form + 'import_data',
    importDataLimit: prefix_form + 'import_limit',
    exportData: prefix_form + 'export_data',
    exportTemplate: prefix_form + 'export_template',
    getMessageFormUrl: prefix_form + 'get_message_form_url',
    saveDing: prefix_urge + 'saveDing',
    getTodoUsers: prefix_urge + 'todoUser',
    getShortCode: prefix_bizsheet + 'getShortCode',
    updateSortkey: prefix_bizsheet + 'updateSortkey',
    get: prefix_bizsheet + 'get',
    list: prefix_bizsheet + 'list',
    toHtml: prefix_convert + 'tohtml',
    pdf: prefix_convert + 'pdf',
    getBizModelName: '/api/app/query/getBizModelName',
    getWorkFlowNode: prefix_form + 'getWorkItems',
    add: prefix_form + 'add',
    batchUnfinishWorkItem: prefix_form + 'batchSubmit',
    batchLoad: prefix_form + 'loadPrintDatas',
  },
  /**
   * 外链
   */

  externalLink: {
    sheet: '/externalLink/sheet',
    generateQrcode: '/api/qrcode/generate_qrcode',
    getShortCode: '/externalLink/getShortCode',
    generateShortCode: `${location.origin}/api/public/short_code/generate`,
    getCodeResource: `${location.origin}/api/public/short_code/resource`,
  },
  /**
   * 系统管理 api
   */
  systemManage: {
    getBizRuleLogDetail: prefix_log + 'getBizRuleLogDetail',
    listBizRuleLog: prefix_log + 'listBizRuleLog',
    businessRuleLogList: prefix_log + 'getBusinessRuleLogList',
    getBusinessRuleLog: prefix_log + 'getBusinessRuleLog',
    retryBusinessRule: prefix_log + 'retryBusinessRule',
  },

  /**
   * 业务模型
   */
  bizproperty: {
    sortkeys: prefix_bizproperty + 'sortkeys',
    getBusinessRuleEnable: prefix_bizmodels + 'getBusinessRuleEnable',
    setBusinessRuleEnable: prefix_bizmodels + 'setBusinessRuleEnable',
  },

  /**
   * 业务规则
   */
  bizRule: {
    listBySchemacode: prefix_businessrule + 'list_by_schemacode',
    delete: prefix_businessrule + 'delete',
    get: prefix_businessrule + 'get',
    quote: prefix_businessrule + 'list_quote',
    create: prefix_businessrule + 'create',
    updata: prefix_businessrule + 'update',
    getNodeRunMaps: prefix_businessrule + 'getNodeRunMaps',
    postNodeRunMaps: prefix_businessrule + 'node_run_map',
    changeDevelopmentMode: prefix_businessrule + 'change_development_mode',
  },

  dingTalk: {
    sign: '/api/dingtalk/sign',
    login: '/login/mobile/ajax',
    upload: '/api/aliyun/uploadImageForDingtalk',
  },
  wechat: {
    sign: '/api/auth/sign',
    login: '/login/wx/ajax',
  },

  common: {
    systemConfig: '/public/system/config',
    systemErrorCode: '',
  },
};

const api = Object.assign({}, original);

export function assign(source: ApiMap) {
  if (!source) {
    return;
  }

  Object.keys(source).forEach((key) => {
    if (api[key]) {
      api[key] = Object.assign({}, api[key], source[key]);
    } else {
      api[key] = source[key];
    }
  });
}

export default api;
