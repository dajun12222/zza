
export default {
    regulation: {
        path: '/audit/regulation',
        name: 'regulation',
        component: () => import('./views/regulation/index/index.vue'),
    },
    regulationInfo: {
        path: '/audit/regulationInfo',
        name: 'regulationInfo',
        component: () => import('./views/regulation/index/info.vue'),
    },
    problem:{
        path: '/audit/problem',
        name: 'problem',
        component: () => import('./views/problem/index/index1.vue'),
    },
    //在线学习预览
    studyView: {
        path: '/audit/studyView',
        name: 'studyView',
        component: () => import('./views/onlineLearning/studyView.vue'),
    },
    //在线考试
    lineExamView: {
        path: '/audit/lineExamView',
        name: 'lineExamView',
        component: () => import('./views/onlineExam/index/index.vue'),
    },
    //考试历史记录
    historyExam: {
        path: '/audit/historyExam',
        name: 'historyExam',
        component: () => import('./views/onlineExam/index/historyExam.vue')
    },
    //考试历史记录
    examInfo: {
        path: '/audit/examInfo',
        name: 'examInfo',
        component: () => import('./views/onlineExam/index/examInfo.vue')
    },
    formIndex: {
        path: '/form/formIndex',
        name: 'formIndex',
        component: () => import('@/../extends/components/form/quoteData.vue'),
    },
} as any;
