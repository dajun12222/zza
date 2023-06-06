import axios from 'axios';
const qs = require('qs');
export default {
  queryAuditTypeList(params?: any) {
    return axios.get('/api/transfer/data-dictionary/queryAuditTypeList', {
      params,
    });
  },
  queryPotencyList(params?: any) {
    return axios.get('/api/transfer/data-dictionary/queryPotencyList', {
      params,
    });
  },
  queryDeptList(params?: any) {
    return axios.get('/api/transfer/data-dictionary/queryDeptList', { params });
  },
  queryYearList(params?: any) {
    //   api/data-dictionary/queryYearList
    return axios.get('/api/transfer/data-dictionary/queryYearList', { params });
  },
  queryTypeList(params?: any) {
    //
    return axios.get('/api/transfer/data-dictionary/queryTypeList', { params });
  },
  queryCaseDirectory(params?: any) {
    //
    return axios.get('/api/transfer/audit-case/caseDirectory', { params });
  },
  queryPageQuery(params: any, page?: any) {
    //
    return axios.post('/api/transfer/regulations/pageQuery?' + page, params);
  },
  queryInfo(params?: any) {
    //
    return axios.post('/api/transfer/regulations/queryInfo', params);
  }, //
  questionsQueryInfo(params?: any) {
    //
    return axios.post('/api/questions/info', params);
  }, //
  tagsTreeQuery(params?: any) {
    //
    return axios.get('/api/transfer/audit-question/tagsTreeQuery', params);
  },
  queryTemplateTypeList(params?: any) {
    //
    return axios.get('/api/transfer/data-dictionary/queryTemplateTypeList', {
      params,
    });
  },
  queryTemplate(params: any, page?: any) {
    return axios.post(
      '/api/transfer/audit-template/queryTemplate?' + page,
      params,
    );
  },
  queryProjectTemplateDetails(params: any) {
    return axios.post(
      '/api/transfer/audit-template/queryProjectTemplateDetails?',
      params,
    );
  },
  queryDetails(params?: any) {
    return axios.post('/api/transfer/audit-template/queryDetails', params);
  },
  queryQuestionDetails(params?: any) {
    return axios.post('/api/transfer/audit-question/queryDetails', params);
  },
  downLoadTemplate(params?: any) {
    return axios.request({
      method: 'POST',
      url: '/api/transfer/audit-template/downLoadTemplate?' + params,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      responseType: 'blob',
    });
  },

  downLoadTemplate1(params?: any) {
    return axios.request({
      method: 'POST',
      url: '/api/transfer/audit-template/downLoadTemplate?' + params,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      responseType: 'arraybuffer',
    });
  },
  queryDocumentTemplateTypeList(params?: any) {
    return axios.get(
      '/api/transfer/data-dictionary/queryDocumentTemplateTypeList',
      { params },
    );
  },
  queryDocumentTemplate(params: any, page?: any) {
    return axios.post(
      '/api/transfer/audit-template/queryDocumentTemplate?' + page,
      params,
    );
  },
  queryDocumentTemplateDetails(params: any) {
    return axios.post(
      '/api/transfer/audit-template/queryDocumentTemplateDetails?',
      params,
    );
  },
  investmentArchivesQuery(params: any, page?: any) {
    return axios.post(
      '/api/transfer/audit-archives/investmentArchivesQuery?' + page,
      params,
    );
  },
  investmentPagingQuery(params: any, page?: any) {
    // 投资
    return axios.post(
      '/api/transfer/audit-archives/investmentPagingQuery?' + page,
      params,
    );
  },
  financialPagingQuery(params: any, page?: any) {
    // 财务
    return axios.post(
      '/api/transfer/audit-archives/financialPagingQuery?' + page,
      params,
    );
  },
  economicPagingQuery(params: any, page?: any) {
    // 经济
    return axios.post(
      '/api/transfer/audit-archives/economicPagingQuery?' + page,
      params,
    );
  },
  investmentArchivesDetails(params: any) {
    // 投资详情
    return axios.post(
      '/api/transfer/audit-archives/investmentArchivesDetails',
      params,
    );
  },
  financialArchivesDetails(params: any) {
    // 财务详情
    return axios.post(
      '/api/transfer/audit-archives/financialArchivesDetails',
      params,
    );
  },
  economicArchivesDetails(params: any) {
    // 经济详情
    return axios.post(
      '/api/transfer/audit-archives/economicArchivesDetails',
      params,
    );
  },
  findById(params: any) {
    return axios.get('/api/transfer/ext/review/findById', { params });
  },
  queryQuestionTypeList(params?: any) {
    //
    return axios.get('/api/questions/directory', {
      params,
    });
  },
  queryQuestion(params: any, page?: any) {
    return axios.post(
      '/api/transfer/audit-question/queryQuestion?' + page,
      params,
    );
  },
  save(params?: any) {
    return axios.post('/api/audit/problem/save', params);
  },
  getList(params?: any) {
    return axios.get('/api/audit/problem/list?' + params);
  },
  similarQuestionMatch(params?: any) {
    return axios.post(
      '/api/transfer/audit-question/similarQuestionMatch',
      params,
    );
  },
  getPersonPermission(params?: any) {
    return axios.get('/api/audit/public/getPersonPermission?' + params);
  },
  getWorkItemCheckUserId(params?: any) {
    return axios.get('/api/audit/public/getWorkItemCheckUserId?' + params);
  },

  //
  queryDictList() {
    return axios.get('/api/transfer/dict/queryDictList');
  },
  //
  queryInfoDetails(params?: any) {
    return axios.post('/api/transfer/dict/queryInfo?' + params);
  },
  //
  queryTopList() {
    return axios.get('/api/transfer/dynamic/queryTopList');
  },
  //
  queryActInfo(params?: any) {
    return axios.post('/api/transfer/dynamic/queryInfo?' + params);
  },
  //
  pageActQuery(params: any, page?: any) {
    return axios.post('/api/transfer/dynamic/pageQuery?' + page, params);
  },
  //
  queryDynamicTypeList() {
    return axios.get('/api/transfer/data-dictionary/queryDynamicTypeList');
  },
  //
  pageAgentQuery(params: any) {
    return axios.post('/api/transfer/agent/pageQuery?' + params);
  },
  //
  queryAgentInfo(params: any) {
    return axios.post('/api/transfer/agent/queryInfo?' + params);
  },
  //
  queryProjectTypeList() {
    return axios.get('/api/transfer/data-dictionary/queryProjectTypeList');
  },
  //
  queryProClassTypeList() {
    return axios.get(
      '/api/transfer/data-dictionary/queryProjectClassification',
    );
  },
  //
  queryMethodTypeList() {
    return axios.get('/api/transfer/data-dictionary/queryPurchaseMethodList');
  },
  //
  queryLevelList() {
    return axios.get('/api/transfer/data-dictionary/queryProjectLevelList');
  },
  //
  queryMatters(params: any, page?: any) {
    return axios.post(
      '/api/transfer/audit-matters/queryMatters?' + page,
      params,
    );
  },
  //
  queryMattersDetails(params: any) {
    return axios.post('/api/transfer/audit-matters/queryDetails?' + params);
  },
  //
  queryCourseList() {
    return axios.get('/api/transfer/data-dictionary/queryAuditCourseList');
  },
  //
  pageCourseQuery(params: any, page?: any) {
    return axios.post('/api/transfer/course/pageQuery?' + page, params);
  },
  //
  queryCourseDetails(params: any) {
    return axios.post('/api/transfer/course/queryCourseInfo?' + params);
  },
  //
  queryCatalogueByCourseId(params: any) {
    return axios.post(
      '/api/transfer/course/queryCatalogueByCourseId?' + params,
    );
  },
  //
  queryByCourseId(params: any) {
    return axios.post('/api/transfer/course/queryByCourseId?' + params);
  },
  //
  examinationQuestionsInfo(params: any) {
    return axios.post(
      '/api/transfer/course/examinationQuestionsInfo?' + params,
    );
  },
  //
  queryList() {
    return axios.get('/api/transfer/cloud-department/queryList');
  },
  //
  submitDepartmentList() {
    return axios.get('/api/transfer/cloud-department/submitDepartmentList');
  },
  //
  queryDepartmentList(params: any) {
    return axios.post('/api/transfer/data-dictionary/queryDictList?' + params);
  },
  //内部
  talentPageQuery(params: any, page?: any) {
    return axios.post('/api/transfer/inside-talent/pageQuery?' + page, params);
  },
  // /inside-talent/queryInfo
  talentQueryInfo(params?: any) {
    return axios.post('/api/transfer/inside-talent/queryInfo?' + params);
  },
  //
  outsidePageQuery(params: any, page?: any) {
    return axios.post('/api/transfer/outside-talent/pageQuery?' + page, params);
  },
  // /inside-talent/queryInfo
  outsideQueryInfo(params?: any) {
    return axios.post('/api/transfer/outside-talent/queryInfo?' + params);
  },
  //
  queryTagsList(params?: any) {
    return axios.get('/api/transfer/tags/queryTagsList?', params);
  },
  //agent/queryList
  agentQueryList(params?: any) {
    return axios.get('/api/transfer/agent/queryList?', params);
  },
  //
  queryTalentById(params?: any) {
    return axios.post('/api/transfer/tags/queryTalentById?' + params);
  },
  //
  fileDirectory(params?: any) {
    return axios.post('/api/transfer/audit-archives/fileDirectory?' + params);
  },
  //
  getAuditWorkFlowCount(params?: any) {
    return axios.get('/api/audit/public/getAuditWorkFlowCount?' + params);
  },
  //
  fileDownload(params?: any) {
    return axios.request({
      method: 'POST',
      url: '/api/transfer/audit-archives/fileDownload?' + params,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      responseType: 'blob',
    });
  },
  //
  fileExport(params?: any) {
    return axios.request({
      method: 'POST',
      url: '/api/transfer/audit-archives/fileExport?' + params,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      responseType: 'blob',
    });
  },
  //
  queryBusinessTypeList(params?: any) {
    return axios.get(
      '/api/transfer/data-dictionary/queryBusinessTypeList?' + params,
    );
  },
  //
  queryDataBatch(params: any, page?: any) {
    return axios.post('/api/transfer/data-batch/queryDataBatch?' + params);
  },
  //
  queryModel(params: any) {
    return axios.post('/api/transfer/model/queryModel?' + params);
  },
  //
  // queryByCode(params:any){
  //     return axios.post('/api/transfer/model/queryByCode?'+ params);
  // },
  //
  queryCategory() {
    return axios.get('/api/transfer/data-dictionary/queryCategory');
  },
  //
  queryName(params: any) {
    return axios.post('/api/transfer/data-dictionary/queryName?' + params);
  },
  //
  dataQueryDictList(params: any) {
    return axios.post('/api/transfer/data-dictionary/queryDictList?' + params);
  },

  //
  queryByCode(params: any, page?: any) {
    return axios.post('/api/transfer/model/queryByCode?' + params);
  },
  //
  queryByBatch(params: any, page?: any) {
    return axios.post('/api/transfer/data-batch/queryByBatch?' + page, params);
  },
  //
  executeResult(params: any) {
    return axios.post('/api/transfer/data-batch/executeResult?' + params);
  },
  queryDataThresholdConditions(params: any) {
    return axios.post(
      '/api/transfer/data-batch/queryDataThresholdConditions?' + params,
    );
  },
  queryDataById(page?: any) {
    return axios.post('/api/transfer/data-batch/queryDataById?' + page);
  },
  queryDataThreshold(page?: any) {
    return axios.post('/api/transfer/data-batch/queryDataThreshold?' + page);
  },
  queryThresholdType() {
    return axios.get('/api/transfer/model/queryThresholdType');
  },
  queryThresholdNameByType(page?: any) {
    return axios.post('/api/transfer/model/queryThresholdNameByType?' + page);
  },
  insertDataThreshold(page?: any) {
    return axios.post('/api/transfer/data-batch/insertDataThreshold?' + page);
  },
  updateDataThreshold(page?: any) {
    return axios.post('/api/transfer/data-batch/updateDataThreshold?' + page);
  },
  //查询数据阈值
  // queryDataThreshold(params:any){
  //     return axios.post('/api/transfer/data-batch/queryDataThreshold?' + params );
  // },
  //批次执行
  batchExecute(params: any) {
    return axios.post(
      '/api/transfer/data-batch/analysisBatchExecute?' + params,
    );
  },
  queryGroupDataById(params?: any) {
    return axios.post('/api/transfer/data-batch/queryGroupDataById?' + params);
  },
  analysisQuery(params?: any) {
    return axios.post('/api/transfer/data-analysis/analysisQuery?' + params);
  },
  queryFieldValueGroup(params?: any) {
    return axios.post(
      '/api/transfer/data-batch/queryFieldValueGroup?' + params,
    );
  },
  analysisExecuteResult(params: any, page?: any) {
    return axios.post(
      '/api/transfer/data-batch/analysisExecuteResult?' + page,
      params,
    );
  },
  deleteByBatch(params?: any) {
    return axios.post('/api/transfer/data-batch/deleteByBatch?' + params);
  },
  deleteDataThreshold(params?: any) {
    return axios.post('/api/transfer/data-batch/deleteDataThreshold?' + params);
  },
  queryAnalysisType() {
    return axios.get('/api/transfer/model-analysis/queryAnalysisType');
  },
  queryAnalysisNameByType(page?: any) {
    return axios.post(
      '/api/transfer/model-analysis/queryAnalysisNameByType?' + page,
    );
  },
  queryConditionById(page?: any) {
    return axios.post('/api/transfer/data-analysis/queryConditionById?' + page);
  },
  query_tree(dictionaryId: string, withs: boolean) {
    let url = `/api/transfer/data-dictionary/query_tree/${dictionaryId}/${withs}`;
    return axios.get(url);
  },
  keywordSuggest(field: string, size: number, keyWord: any) {
    return axios.request({
      method: 'POST',
      url: `/api/transfer/audit-question/keyword_suggest/${field}/${size}`,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      params: { keyWord: keyWord },
    });
    // return axios.post(`/api/transfer/audit-question/keyword_suggest/${field}/${size}` , params);
  },
  similar(params?: any) {
    return axios.post('/api/questions/similarSearch', params);
  },
  similarBasis(data?: any) {
    return axios.post(`/api/transfer/audit-question/similar`,data);
  },
  search(params: any, page?: any) {
    return axios.post('/api/questions/search?' + page, params);
  },
  queryBasisDetails(params?: any) {
    return axios.post(
      '/api/transfer/audit-question/query_basis_details',params,
    );
  },
  queryProcessStage() {},
  caseFilePagingQuery(params: any, page?: any) {
    return axios.post(
      '/api/transfer/audit-case/localQuery?' + page,
      params,
    );
  },
  basicPagingQuery(params: any, page?: any) {
    return axios.post(
      '/api/transfer/audit-case/baseQuery?' + page,
      params,
    );
  },
  dataResourceCounts() {
    return axios.get('/api/transfer/data-resource/dataResourceCounts');
  },
  auditTypeProblemsNum() {
    return axios.get('/api/audit/report/auditTypeProblemsNum');
  },
  auditTypeProjectsNum() {
    return axios.get('/api/audit/report/auditTypeProjectsNum');
  },
  auditTypeProjectsDetails() {
    return axios.get('/api/audit/report/auditTypeProjectsDetails');
  },
  projectsTimeThrend() {
    return axios.get('/api/audit/report/projectsTimeThrend');
  },
  rectifyProblemsDone() {
    return axios.get('/api/audit/report/rectifyProblemsDone');
  },
  talentResourceCounts(page?: any) {
    return axios.post(
      '/api/transfer/data-resource/talentResourceCounts?' + page,
    );
  },
  // 审计成果
  auditTalentInfo(params:any) {
      return axios.get('/api/transfer/data-resource/auditTalentInfo?'+ params);
  },
  localAuditReportQuery(params: any, page?: any) {
    return axios.post(
      '/api/transfer/auditResults/localAuditReportQuery?' + page,
      params,
    );
  },
  localAuditQuestionQuery(params: any, page?: any) {
    return axios.post(
      '/api/transfer/auditResults/localAuditQuestionQuery?' + page,
      params,
    );
  },
  CasefileDownload(params?: any) {
    return axios.request({
      method: 'POST',
      url: '/api/transfer/auditCase/download?' + params,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      responseType: 'blob',
    });
  },
  projectStartInfo() {
    return axios.get('/api/audit/report/projectStartInfo');
  },
  projectArchiveInfo() {
    return axios.get('/api/audit/report/projectArchiveInfo');
  },
  reviewAmountInfo() {
    return axios.get('/api/audit/report/reviewAmountInfo');
  },
  auditProjectsInfo(params:any) {
    return axios.get('/api/audit/report/auditProjectsInfo',{ params });
  },
  rectifyProjectsDone() {
    return axios.get('/api/audit/report/rectifyProjectsDone');
  },
  rectifyProjectsOverdue() {
    return axios.get('/api/audit/report/rectifyProjectsOverdue');
  },
  auditRectifyInfoOne(params:any) {
    return axios.get('/api/audit/report/auditRectifyInfoOne',{ params });
  },
  auditTypeReportDist() {
    return axios.get('/api/audit/report/auditTypeReportDist');
  },
  auditResultInfoCount(params:any) {
    return axios.get('/api/audit/report/auditResultInfoCount',{ params });
  },
  problemAmountDist(){
    return axios.get('/api/audit/report/problemAmountDist');
  },
  saveOnlineLearn(params: any, page?: any) {
    return axios.post(
      '/api/onlineLearn/saveOnlineLearn?' + page,
      params,
    );
  },
  getCourseType() {
    return axios.get(
      '/api/onlineLearn/getCourseType',
    );
  },
  getOnlineLearnlist(params: any){
    return axios.get('/api/onlineLearn/getOnlineLearnlist?'+params);
  },
  auditProjectsInfoParams(params?: any){
    return axios.get('/api/audit/report/auditProjectsInfoParams?'+params);
  },
  getOnlinePaperByID(params: any){
    return axios.get('/api/onlineExam/getOnlinePaperByID?'+params);
  },
  saveOnlinePaper(params: any, page?: any) {
    return axios.post(
      '/api/onlineExam/saveOnlinePaper?' + page,
      params,
    );
  },
  delete_data(params: any,page?: any) {
    return axios.delete(
      '/api/runtime/query/delete_data', {
        data: params,
      }
    );
  },
  import_data(params: any) {
    return axios.get(
      // '/api/onlineExam/import_data?' + params,
      '/api/runtime/query/import_data?' + params,
    );
  },
  import_progress(params: any) {
    return axios.get(
      // '/api/onlineExam/import_data?' + params,
      '/api/runtime/query/import_progress?' + params,
    );
  },
  selectOnlineExamList(params: any){
    return axios.get(
      '/api/onlineExam/selectOnlineExamList?' + params,
    );
  },
  getOnlineExamByid(params: any) {
    return axios.get(
      '/api/onlineExam/getOnlineExamByid?' + params,
    );
  },
  saveOnlineExam(params: any, page?: any) {
    return axios.post(
      '/api/onlineExam/saveOnlineExam?' + page,
      params,
    );
  },
  importQuestionData(params: any) {
    return axios.get(
      '/api/onlineExam/importQuestionData?' + params,
    );
  },
  customize(params: any) {
    return axios.post(
      '/api/transfer/customize',
      params,
    );
  },
  selectExperienceBylearnId(params: any) {
    return axios.get(
      '/api/onlineLearn/selectExperienceBylearnId?' + params,
    );
  },
  saveExperience(params: any) {
    return axios.post(
      '/api/onlineLearn/saveExperience',
      params,
    );
  },
  selectExamHistoryList(params: any) {
    return axios.get(
      '/api/onlineExam/selectExamHistoryList?' + params,
    );
  },
  getExamHistoryByid(params: any) {
    return axios.get(
      '/api/onlineExam/getExamHistoryByid?' + params,
    );
  },
  selectOnlinePracticeList(params: any){
    return axios.get(
      '/api/onlineExam/selectOnlinePracticeList?' + params,
    );
  },
  getExamProportion(params: any){
    return axios.get(
      '/api/onlineExam/getExamProportion?' + params,
    );
  },
  selectTestPaperList(){
    return axios.get(
      '/api/onlineExam/selectTestPaperList',
    );
  },
  selectPassRateList(){
    return axios.get(
      '/api/onlineExam/selectPassRateList',
    );
  },
  selectParticipationRateList(){
    return axios.get(
      '/api/onlineExam/selectParticipationRateList',
    );
  },
  matterQueryDirectory(params: any) {
    return axios.post(
      '/api/audit/matter/queryDirectory',
      params,
    );
  },
  queryMatterInfo(params: any) {
    return axios.post(
      '/api/audit/matter/matterInfo',
      params,
    );
  },
  // /api/tags/queryTalentById   api/data-batch/queryDataBatch
  //api/ext/review/findById
  // workflow : {
  //     searchWorkitems : '/aaaa'
  // },

  // fff:{
  //     f : 'ff'
  // }
};
