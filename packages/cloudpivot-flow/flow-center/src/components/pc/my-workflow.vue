<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Descripttion: 我的流程
 * @version: v1.0
 * @Author: baidongsheng
 * @Date: 2021-11-11 14:28:59
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-03-04 14:43:33
-->
<template>
  <div ref="workItem" class="workitem-box my-workflow">
    <!-- 顶部信息 -->
    <div style="padding-right: 12px; z-index: 10">
      <div class="workitem-box-top-2">
        <PageHeader
          :headerData="headerData"
          :queryConditionSource="queryConditionSource"
          :tabsList="tabs"
          :subTitle="$t('cloudpivot.flowCenter.pc.myFlow')"
          :queryActive="queryActive"
          :isOpen="isShowQueryItem"
          :noData="isShowNoData"
          @search="isShowQueryItem = true"
          @changeTabs="changeTabs"
        />

        <div v-show="isShowQueryItem" class="filters-box">
          <query-workitem
            ref="queryWorkitem"
            class="query-box"
            :fieldConfigs="queryFieldConfig"
            :hasTabs="true"
            @reset="onReset"
            @search="onSearch"
            @hide="isShowQueryItem = false"
          />
        </div>
      </div>
    </div>
    <!-- 待阅列表 -->
    <div
      id="MyWorkflow"
      v-show="!isShowNoData"
      v-infinite-scroll="handleInfiniteOnLoad"
      class="content-data"
      :infinite-scroll-disabled="busy"
      :infinite-scroll-distance="10"
    >
      <PageData
        :listData="data"
        :type="headerData.type"
        :displayColumns="displayColumns"
        :allDisplayColumnsConfig="allDisplayColumnsConfig"
        @refreshData="reload"
      />
      <PageLoadingNew
        :loading="loadingType === 'loading'"
        :loadingText="
          loadingType === 'done'
            ? $t('cloudpivot.flowCenter.pc.showAllResult')
            : ''
        "
      />
    </div>

    <!-- 空页面 -->
    <div class="workitem-box-nodata">
      <PageNoData
        :isShowNoData="isShowNoData"
        :type="queryConditionSource.length ? 'search' : 'show'"
        :tipText="
          queryConditionSource.length
            ? $t('cloudpivot.flowCenter.pc.searchNoDataText')
            : $t('cloudpivot.flowCenter.pc.noContent')
        "
      />
    </div>

    <!-- 返回顶部 -->
    <div v-if="btnFlag" class="return-top" @click="backTop">
      <em class="icon aufontAll h-icon-all-shape"></em>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator';

import { mixins } from 'vue-class-component';

import {
  workflowCenterApi,
  workflowCenter as workflowCenterParams,
} from 'cloudpivot/api';

import * as utils from 'cloudpivot/common/src/utils/pc/utils';

import WorkItemMixin from './mixins/workitem';
import * as Helper from './helper/helper';

import common from 'cloudpivot/common/pc';

import SetTimeTypeMixin from './common/index'; //公共处理模块

import QueryWorkitem from './components/query-condition/query-workitem.vue';

import moment from 'moment';

import { workflowEnum } from 'cloudpivot-flow/flow';

import * as WorkflowCenterTypes from './typings/workflow-center';

import {
  getAllWorkflowFieldConfig,
  getAllWorkflowQueryFieldConfig,
} from './typings/workflow-list-config';

interface PageHeaderData {
  total: number; //总数
  showTotal: number; //当前数
  type: number; // 类型
  batch: boolean; //是否批量
}

@Component({
  name: 'my-workflow',
  components: {
    PageHeader: common.components.PageHeader,
    PageData: common.components.PageData,
    PageLoadingNew: common.components.PageLoadingNew,
    PageNoData: common.components.PageNoData,
    PageLoadFail: common.components.LoadFail,
    QueryWorkitem,
  },
})
export default class MyWorkflow extends mixins(
  WorkItemMixin,
  SetTimeTypeMixin,
) {
  searchParams: workflowCenterParams.FinishedWorkItemParams = {
    workflowName: '',
    workflowCode: '',
    startTime: utils.timeStampToDate(
      'YY-MM-DD',
      (moment().add(-30, 'days') as any)._d,
    ),
    endTime: utils.timeStampToDate('YY-MM-DD', (moment() as any)._d),
  };

  instanceState: string = ''; // 流程实例状态

  isResetFields: boolean = false;

  /**
   * 通用变量
   */
  busy: boolean = false;

  mode: string = 'standalone';

  data: any[] = []; //列表数据

  isLoading: boolean = false;

  loadingType: string = 'init'; //init 初始化 // loading 加载中, done加载完毕,

  isSelectShow: boolean = false;

  isSelectAll: boolean = false;

  scrollTop: number = 0;

  btnFlag: boolean = false;

  curPage: number = 1;

  queryConditionSource: any[] = []; //查询条件

  tipText: string = ''; //提示语

  noDataType: string = 'show'; //结果页类型

  headerData: PageHeaderData = {
    //头部参数
    total: 0,
    showTotal: 0,
    type: 5,
    batch: false,
  };

  queryActive: boolean = true; //是否筛选

  isShowQueryItem: boolean = false;

  // 所有tab按钮
  tabs: Array<any> = [];

  curKey: string = '';

  currentKey: string = '';

  allDisplayColumnsConfig: {
    [key: string]: WorkflowCenterTypes.DisplayColumnsConfig[];
  } = {};

  displayColumns: WorkflowCenterTypes.DisplayColumnsConfig[] = [];

  queryFieldConfig: any[] = [];

  /**
   * 滚动加载
   */
  handleInfiniteOnLoad() {
    if (this.loadingType !== 'init' || this.curPage === 1) {
      return;
    }
    this.getMyInstanceList('pageChange');
  }

  /**
   * 返回顶部
   */
  scrollToTop(e) {
    const scrollTop = e.target.scrollTop || e.srcElement.scrollTop;
    this.scrollTop = scrollTop;
    if (this.scrollTop > 60) {
      this.btnFlag = true;
    } else {
      this.btnFlag = false;
    }
  }

  backTop() {
    const timer = setInterval(() => {
      const ispeed = Math.floor(-this.scrollTop / 5);
      if (document.getElementById('MyWorkflow')) {
        (document.getElementById('MyWorkflow') as any).scrollTop =
          this.scrollTop + ispeed;
      }
      if (this.scrollTop === 0) {
        clearInterval(timer);
      }
    }, 16);
  }

  /**
   * 切换tabs
   */
  changeTabs(obj) {
    this.instanceState = obj.instanceState;
    this.curPage = 1;
    this.data = [];
    this.loadingType = 'init';
    this.tabChange(obj.instanceState);
  }

  mounted() {
    if (document.getElementById('MyWorkflow')) {
      (document.getElementById('MyWorkflow') as any).addEventListener(
        'scroll',
        this.scrollToTop,
      );
    }
    //  this.changeTabs({instanceState:'PROCESSING,EXCEPTION,DRAFT'});

    setTimeout(() => {
      this.getMyInstanceList();
    }, 500);
    this.setTabBtns();
    this.curKey = this.tabs[0].key;

    // window.addEventListener('resize', this.setTableMaxHeight);
    window.addEventListener('message', this.reloadMessage, false);
  }

  reloadMessage(event: any) {
    if (event.source === window) {
      return;
    }
    if (
      event.data.indexOf('/workflow-center/my-workflow') !== -1 ||
      event.data.indexOf('%2Fworkflow-center%2Fmy-workflow') !== -1
    ) {
      this.reload();
    }
  }

  destroyed() {
    // window.removeEventListener('resize', this.setTableMaxHeight);
    window.removeEventListener('message', this.reloadMessage, false);
    if (document.getElementById('MyWorkflow')) {
      (document.getElementById('MyWorkflow') as any).removeEventListener(
        'scroll',
        this.scrollToTop,
      );
    }
  }

  /**
   * 设置tab按钮
   */
  setTabBtns() {
    this.tabs = [
      {
        label: this.$t('cloudpivot.flowCenter.pc.all'),
        value: '',
        key: 0,
      },
    ].concat(
      Object.keys(workflowEnum.WorkflowState).map((state, index) => {
        return {
          label: this.$t(`cloudpivot.flow.pc.WorkflowState.${state}`),
          value: state,
          key: index + 1,
        };
      }),
    );
  }

  setDisplayColumns() {
    //title：字段标题
    //valueType: 字段值类型
    //valueMap: 字段值映射属性（object为数组）

    //先将所有使用到的字段列举出来
    const {
      sequenceNo,
      flowStatus,
      curResolver,
      curActivity,
      initiationTime,
      usedTime,
      costTime,
      finishedTime,
      cancelTime,
      createdTime,
    } = getAllWorkflowFieldConfig(this);
    if (this.instanceState === '') {
      this.allDisplayColumnsConfig = {
        PROCESSING: [
          sequenceNo,
          flowStatus,
          curResolver,
          curActivity,
          initiationTime,
          usedTime,
        ],
        APPROVED: [
          sequenceNo,
          flowStatus,
          initiationTime,
          finishedTime,
          costTime,
        ],
        TOPPING_OFF: [
          sequenceNo,
          flowStatus,
          initiationTime,
          finishedTime,
          costTime,
        ],
        CANCELED: [
          sequenceNo,
          flowStatus,
          initiationTime,
          cancelTime,
          costTime,
        ],
        EXCEPTION: [
          sequenceNo,
          flowStatus,
          initiationTime,
          curActivity,
          usedTime,
        ],
        DRAFT: [curActivity, flowStatus, createdTime],
      };
      this.displayColumns = [];
    } else {
      this.allDisplayColumnsConfig = {};
      switch (this.instanceState) {
        case workflowEnum.WorkflowState.PROCESSING:
          this.displayColumns = [
            sequenceNo,
            curActivity,
            curResolver,
            initiationTime,
            usedTime,
          ];
          break;
        case workflowEnum.WorkflowState.APPROVED:
          this.displayColumns = [
            sequenceNo,
            costTime,
            initiationTime,
            finishedTime,
          ];
          break;
        case workflowEnum.WorkflowState.TOPPING_OFF:
          this.displayColumns = [
            sequenceNo,
            costTime,
            initiationTime,
            finishedTime,
          ];
          break;
        case workflowEnum.WorkflowState.CANCELED:
          this.displayColumns = [
            sequenceNo,
            costTime,
            initiationTime,
            cancelTime,
          ];
          break;
        case workflowEnum.WorkflowState.EXCEPTION:
          this.displayColumns = [
            sequenceNo,
            curActivity,
            initiationTime,
            usedTime,
          ];
          break;
        case workflowEnum.WorkflowState.DRAFT:
          this.displayColumns = [curActivity, createdTime];
          break;
        default:
          break;
      }
    }
  }

  setQueryFieldConfig() {
    const { sequenceNo, workflowName, flowTemplate, time } =
      getAllWorkflowQueryFieldConfig(this);
    this.queryFieldConfig = [sequenceNo, workflowName, flowTemplate];
    if (this.instanceState !== 'DRAFT') {
      this.queryFieldConfig.push(time);
    }
  }

  /*
   * 重新加载
   */
  reload() {
    this.curPage = 1;
    this.pageSize = 20;
    this.data = [];
    this.loadingType = 'init';
    this.getMyInstanceList();
  }

  /*
   * tab页栏切换
   */
  tabChange(key: any) {
    this.queryConditionSource = [];
    this.curKey = key;
    this.isResetFields = true;
    this.instanceState = key;
    this.curPage = 1;
    this.pageSize = 20;
    this.setDisplayColumns();
    this.setQueryFieldConfig();
    if (this.instanceState === 'DRAFT') {
      delete this.searchParams.startTime;
      delete this.searchParams.endTime;
    } else {
      this.searchParams.startTime =
        this.searchParams.startTime ||
        utils.timeStampToDate(
          'YY-MM-DD',
          (moment().add(-30, 'days') as any)._d,
        );
      this.searchParams.endTime =
        this.searchParams.endTime ||
        utils.timeStampToDate('YY-MM-DD', (moment() as any)._d);
    }
    this.getMyInstanceList();

    setTimeout(() => {
      this.isResetFields = false;
    }, 100);
  }

  /*
   * 分页改变
   */
  onPaginationChange(page: number, size: number) {
    this.curPage = page;
    this.getMyInstanceList('pageChange');
  }

  /*
   * 分页pageSize改变
   */
  onSizeChange(current: number, size: number) {
    this.curPage = 1;
    this.pageSize = size;
    this.getMyInstanceList('pageChange');
  }

  /*
   * 重置查询参数
   */
  resetParams() {
    this.searchParams = {
      workflowName: '',
      workflowCode: '',
      startTime: utils.timeStampToDate(
        'YY-MM-DD',
        (moment().add(-30, 'days') as any)._d,
      ),
      endTime: utils.timeStampToDate('YY-MM-DD', (moment() as any)._d),
    };
  }

  /*
   * 查询条件重置事件
   */
  onReset() {
    this.isShowQueryItem = false;
    this.queryActive = true;
    this.queryConditionSource = [];
    this.curPage = 1;
    this.resetParams();
    this.getMyInstanceList();
  }

  /*
   * 查询条件搜索事件
   */
  onSearch(params: workflowCenterParams.FinishedWorkItemParams) {
    this.isShowQueryItem = false;
    this.queryActive = true;
    let type: string = '';

    const vals: any = this.dataTranslateToFilterCard(params, type);
    this.queryConditionSource = vals;

    this.curPage = 1;

    this.searchParams = {
      ...params,
    };
    this.getMyInstanceList('search');
  }

  /*
   * 获取我的流程列表
   */
  async getMyInstanceList(type?: string) {
    const params = {
      ...this.searchParams,
      instanceState: this.instanceState,
      page: this.curPage - 1,
      size: this.pageSize,
    };

    // 数据处理函数
    this.dataHandler = (data: any) => {
      data.forEach((item: any, index: number) => {
        item.index = index + 1;
        item.key = index;
        item.stayTime = Helper.timeTranslate(item.stayTime);
        item.costTime = Helper.timeTranslate(item.costTime);
        // 去掉秒钟
        if (item.startTime) {
          item.startTime = Helper.removeSeconds(item.startTime);
        }
        if (item.finishTime) {
          item.finishTime = Helper.removeSeconds(item.finishTime);
        }

        // 国际化兼容
        item = utils.compatible(item, 'workflowName');

        // 设置高亮
        item.instanceName = utils.searchHighLight(
          this.searchParams.workflowName,
          item.instanceName,
        );
      });
      return data;
    };

    this.isShowNoData = false;
    this.loadingType = 'loading';
    const res: any = await workflowCenterApi
      .getMyInstanceList(params)
      .then((res) => {
        this.loadingType = 'init';
        return res;
      });
    this.processResult(res, type);
  }

  /**
   * 接口数据后续处理
   */
  processResult(res: any, type?: string) {
    this.loadingType = 'init';
    if (res.data && res.data.totalElements > 0) {
      if (type === 'pageChange') {
        //加载更多
        if (res.data.content.length < 1) {
          this.loadingType = 'done';
          this.headerData = {
            total: res.data.totalElements,
            showTotal: this.data.length,
            type: 5,
            batch: false,
          };
          return;
        }
        res.data.content.forEach((item) => {
          item.startTime = this.removeSeconds(item.startTime);
          item.finishTime = this.removeSeconds(item.finishTime);
          item.costTime = this.getTimerNumber(item.costTime);
          this.data.push(this.SetTimeType(item));
        });
      } else {
        //初始化
        this.data = res.data.content.map((item) => {
          item.startTime = this.removeSeconds(item.startTime);
          item.finishTime = this.removeSeconds(item.finishTime);
          item.costTime = this.getTimerNumber(item.costTime);
          return this.SetTimeType(item);
        });
        /**
         * 加载完毕
         */
        if (res.data.content.length < this.pageSize) {
          this.loadingType = 'done';
          this.headerData = {
            total: res.data.totalElements,
            showTotal: this.data.length,
            type: 5,
            batch: false,
          };
          return;
        }
      }
      this.curPage++;
    } else {
      //无数据
      this.isShowNoData = true;
      this.total = 0;
      this.curPage = 1;
      if (type === 'search') {
        this.noDataType = 'search';
        this.tipText = '搜索无结果';
      } else {
        this.noDataType = 'show';
        this.tipText = '暂无内容';
      }
    }
    this.headerData = {
      total: res.data.totalElements,
      showTotal:
        this.curPage === 1 ? res.data.content.length : this.data.length,
      type: 5,
      batch: false,
    };
  }

  @Watch('$i18n.locale', { immediate: true })
  onLanguageChange() {
    this.setLoadAllTxt();
    // this.setTableMaxHeight();
    this.setTabBtns();
    this.setDisplayColumns();
    this.setQueryFieldConfig();
  }
}
</script>

<style lang="less" scoped>
@import './style/common.less';
</style>
