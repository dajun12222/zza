import templateComponents from 'extension-template/index';
import RouterView from '@/views/common-view/index.vue';
export default {
  formDetail: {
    path: '/form/detail',
    name: 'form-detail',
    component: () => import('@/views/form/form-detail.vue'),
  },
  formIndex: {
    path: '/form/formIndex',
    name: 'formIndex',
    component: () => import('@/../extends/components/form/auditModal.vue'),
  },
  iframePage: {
      path: '/audit/iframePage',
      name: 'iframePage',
      component: () => import('./views/iframePage/index/index.vue'),
  },
  comparisonIndex: {
    path: '/comparison/comparisonIndex',
    name: 'comparisonIndex',
    component: () => import('@/../extends/views/comparison/index/index.vue'),
  },

  audit: {
    root: {
      path: '/application/:appCode',
      name: 'auditIndex',
      component: RouterView,
    },
    regulation: {
      path: 'audit/regulation',
      name: 'regulation',
      component: () => import('./views/regulation/index/index.vue'),
    },
    
    dynamic: {
      path: 'audit/dynamic',
      name: 'dynamic',
      component: () => import('./views/dynamic/index/index.vue'),
    },
    dictionaries: {
      path: 'audit/dictionaries',
      name: 'dictionaries',
      component: () => import('./views/dynamic/index/dictionaries.vue'),
    },
    matter: {
      path: 'audit/matter',
      name: 'matter',
      component: () => import('./views/dynamic/index/matter.vue'),
    },
    intermediary: {
      path: 'audit/intermediary',
      name: 'intermediary',
      component: () => import('./views/dynamic/index/intermediary.vue'),
    },
    class: {
      path: 'audit/class',
      name: 'class',
      component: () => import('./views/dynamic/index/class.vue'),
    },
    catalogue: {
      path: 'audit/catalogue',
      name: 'catalogue',
      component: () => import('./views/dynamic/index/catalogue.vue'),
    },
    problem: {
      path: 'audit/problem',
      name: 'problem',
      component: () => import('./views/problem/index/index1.vue'),
    },

    Case: {
      path: 'audit/Case',
      name: 'Case',
      component: () => import('./views/Case/index/index.vue'),
    },
    support: {
      path: 'audit/support',
      name: 'support',
      component: () => import('./views/support/index/index.vue'),
    },
    aduitFiles: {
      path: 'audit/aduitFiles',
      name: 'aduitFiles',
      component: () => import('./views/aduitFiles/index/index.vue'),
    },
    aduitFilesInveInfo: {
      path: 'audit/aduitFilesInveInfo',
      name: 'aduitFilesInveInfo',
      component: () => import('./views/aduitFiles/index/InveInfo.vue'),
    },
    aduitFilesInfo: {
      path: 'audit/aduitFilesInfo',
      name: 'aduitFilesInfo',
      component: () => import('./views/aduitFiles/index/info.vue'),
    },
    aduitVolume: {
      path: 'audit/aduitVolume',
      name: 'aduitVolume',
      component: () => import('./views/aduitFiles/index/volume.vue'),
    },
    talentList: {
      path: 'audit/talentList',
      name: 'talentList',
      component: () => import('./views/talentList/index/index.vue'),
    },
    talentLabel: {
      path: 'audit/talentLabel',
      name: 'talentLabel',
      component: () => import('./views/talentLabel/index/index.vue'),
    },
    modelManage: {
      path: 'audit/modelManage',
      name: 'modelManage',
      component: () => import('./views/modelManage/index.vue'),
    },
    modelManageList: {
      path: 'audit/modelManageList',
      name: 'modelManageList',
      component: () => import('./views/modelManage/modelManageList.vue'),
    },
    dataBatch: {
      path: 'audit/dataBatch',
      name: 'dataBatch',
      component: () => import('./views/dataBatch/index/index.vue'),
    },
    dataBatchInfo: {
      path: 'audit/dataBatchInfo',
      name: 'dataBatchInfo',
      component: () => import('./views/dataBatch/index/info.vue'),
    },
    dataDictionary: {
      path: 'audit/dataDictionary',
      name: 'dataDictionary',
      component: () => import('./views/manage/index.vue'),
    },
    threshold: {
      path: 'audit/threshold',
      name: 'threshold',
      component: () => import('./views/dataBatch/index/threshold.vue'),
    },
    execution: {
      path: 'audit/execution',
      name: 'execution',
      component: () => import('./views/dataBatch/index/execution.vue'),
    },
    analyse: {
      path: 'audit/analyse',
      name: 'analyse',
      component: () => import('./views/dataBatch/index/analyse.vue'),
    },
    echarts: {
      path: 'audit/echarts',
      name: 'echarts',
      component: () => import('./views/echarts/home.vue'),
    },
    people: {
      path: 'audit/people',
      name: 'people',
      component: () => import('./views/echarts/people.vue'),
    },
    project: {
      path: 'audit/project',
      name: 'project',
      component: () => import('./views/echarts/project.vue'),
    },
    achievement: {
      path: 'audit/achievement',
      name: 'achievement',
      component: () => import('./views/echarts/achievement.vue'),
    },
    resources: {
      path: 'audit/resources',
      name: 'resources',
      component: () => import('./views/echarts/resources.vue'),
    },
    // 数据采集任务看板
    data_c: {
      path: 'audit/data_c',
      name: 'data_c',
      component: () => import('./views/dataCollection/index/index.vue'),
    },
    // 数据资源数据质量报告看板
    data_r: {
      path: 'audit/data_r',
      name: 'data_r',
      component: () => import('./views/dataCollection/index/index1.vue'),
    },
    dataResource: {

      path: '/visualiz/dataResource',
      name: 'dataResource',
      component: () => import('./views/echarts/home.vue'),
    },
    // 审计成果
    results: {
      path: 'audit/results',
      name: 'results',
      component: () => import('./views/Case1/index/index.vue'),
    },
    // 组成试卷
    examination: {
      path: 'audit/examination',
      name: 'examination',
      component: () => import('./views/examination/index/index.vue'),
    },
    //考试历史记录
    examHistory: {
      path: 'audit/examHistory',
      name: 'examHistory',
      component: () => import('./views/onlineExam/index/examHistory.vue')
    },
    //查看考试
    examInfo: {
      path: 'audit/examInfo',
      name: 'examInfo',
      component: () => import('./views/onlineExam/index/examInfo.vue')
    },
  },
  regulationInfo: {
    path: '/audit/regulationInfo',
    name: 'regulationInfo',
    component: () => import('./views/regulation/index/info.vue'),
  },
  problemInfo: {
    path: '/audit/problemInfo',
    name: 'problemInfo',
    component: () => import('./views/problem/index/info.vue'),
  },
  //在线学习预览
  studyView: {
    path: '/audit/studyView',
    name: 'studyView',
    component: () => import('./views/onlineLearning/components/studyView.vue'),
  },
  //在线考试
  lineExamView: {
    path: '/audit/lineExamView',
    name: 'lineExamView',
    component: () => import('./views/onlineExam/index/index.vue')
  },
  //课程练习
  courseList: {
    path: '/audit/courseList',
    name: 'courseList',
    component: () => import('./views/onlineExam/index/courseList.vue')
  },
  //在线考试
  analysisExamView: {
    path: '/audit/analysisExamView',
    name: 'analysisExamView',
    component: () => import('./views/onlineExam/index/analysisExam.vue')
  },

} as any;
