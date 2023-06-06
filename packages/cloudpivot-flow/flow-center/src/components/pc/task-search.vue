<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Descripttion: 
 * @version: v1.0
 * @Author: baidongsheng
 * @Date: 2021-11-11 19:30:48
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-03-04 14:43:54
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
          :queryActive="queryActive"
          :subTitle="$t('cloudpivot.flowCenter.pc.taskSearch')"
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
      id="TaskSearch"
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

import * as WorkflowCenterTypes from './typings/workflow-center';

import * as utils from 'cloudpivot/common/src/utils/pc/utils';

import WorkItemMixin from './mixins/workitem';
import * as Helper from './helper/helper';

import common from 'cloudpivot/common/pc';
import SetTimeTypeMixin from './common/index'; //公共处理模块

import QueryWorkitem from './components/query-condition/query-workitem.vue';

import moment from 'moment';

import { workflowEnum } from 'cloudpivot-flow/flow';

import {
  getAllWorkflowFieldConfig,
  getAllWorkflowQueryFieldConfig,
} from './typings/workflow-list-config';

interface PageHeaderData {
  total: number; //总数
  showTotal: number; //当前数
  type: number; // 类型
  batch: boolean; //是否批量
  isChange: boolean; //是否tab页切换
}

@Component({
  name: 'task-search',
  components: {
    PageHeader: common.components.PageHeader,
    PageData: common.components.PageData,
    PageLoadingNew: common.components.PageLoadingNew,
    PageNoData: common.components.PageNoData,
    PageLoadFail: common.components.LoadFail,
    QueryWorkitem,
  },
})
export default class TaskSearch extends mixins(
  WorkItemMixin,
  SetTimeTypeMixin,
) {
  @Prop({ default: false }) isShowCurResolver!: boolean; // 是否展示当前处理人

  searchParams: workflowCenterParams.ListInstancesParams = {
    workflowName: '',
    workflowCode: '',
    startTime: utils.timeStampToDate(
      'YY-MM-DD',
      (moment().add(-30, 'days') as any)._d,
    ),
    endTime: utils.timeStampToDate('YY-MM-DD', (moment() as any)._d),
    originator: '',
    unitType: '',
  };

  instanceState: string = 'PENDING'; // 流程实例状态

  isResetFields: boolean = false;

  queryActive: boolean = true; //是否筛选

  isShowQueryItem: boolean = false;

  currentKey: string = '';

  timeLable: string = '';

  // 所有tab按钮
  tabs: Array<any> = [];

  curKey: string = 'PENDING';

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
    type: 8,
    batch: false,
    isChange: false,
  };

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
    this.listWorkitems('pageChange');
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
      if (document.getElementById('TaskSearch')) {
        (document.getElementById('TaskSearch') as any).scrollTop =
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
    this.curKey = obj.instanceState;
    this.loadingType = 'init';
    this.tabChange(obj.instanceState);
    this.setQueryFieldConfig();
  }

  mounted() {
    // this.changeTabs({instanceState:this.instanceState});
    if (document.getElementById('TaskSearch')) {
      (document.getElementById('TaskSearch') as any).addEventListener(
        'scroll',
        this.scrollToTop,
      );
    }
    setTimeout(() => {
      this.listWorkitems();
    }, 500);

    // window.addEventListener('resize', this.setTableMaxHeight);
    window.addEventListener('message', this.reloadMessage, false);
  }

  reloadMessage(event: any) {
    if (event.source === window) {
      return;
    }
    if (
      event.data.indexOf('/workflow-center/query-participant-workItem') !==
        -1 ||
      event.data.indexOf('%2Fworkflow-center%2Fquery-participant-workItem') !==
        -1
    ) {
      this.reload();
    }
  }

  destroyed() {
    // window.removeEventListener('resize', this.setTableMaxHeight);
    if (document.getElementById('TaskSearch')) {
      (document.getElementById('TaskSearch') as any).removeEventListener(
        'scroll',
        this.scrollToTop,
      );
    }
    window.removeEventListener('message', this.reloadMessage, false);
  }

  /**
   * 设置tab按钮
   */
  setTabBtns() {
    this.tabs = Object.keys(workflowEnum.WorkItemStatus).map((state, index) => {
      return {
        label: this.$t(`cloudpivot.flow.pc.WorkItemStatus.${state}`),
        value: state,
        key: index,
      };
    });
  }

  setDisplayColumns() {
    //先将所有使用到的字段列举出来
    const {
      sequenceNo,
      originatorName,
      curResolver,
      curActivity,
      receiveTime,
      resolver,
      resolveNode,
      resolveTime,
    } = getAllWorkflowFieldConfig(this);

    switch (this.instanceState) {
      case workflowEnum.WorkItemStatus.PENDING:
        this.displayColumns = [
          sequenceNo,
          originatorName,
          curResolver,
          curActivity,
          receiveTime,
        ];
        break;
      case workflowEnum.WorkItemStatus.AGREED:
      case workflowEnum.WorkItemStatus.DISAGREED:
      case workflowEnum.WorkItemStatus.TRANSFERRED:
      case workflowEnum.WorkItemStatus.SUBMITTED:
      case workflowEnum.WorkItemStatus.ABORTED:
      case workflowEnum.WorkItemStatus.CANCELED:
      case workflowEnum.WorkItemStatus.VOIDED:
        this.displayColumns = [
          sequenceNo,
          originatorName,
          resolver,
          resolveNode,
          resolveTime,
        ];
        break;
      default:
        break;
    }
  }

  setQueryFieldConfig() {
    const {
      sequenceNo,
      workflowName,
      flowTemplate,
      curResolver,
      originatorName,
      time,
    } = getAllWorkflowQueryFieldConfig(this);

    switch (this.curKey) {
      case 'PENDING':
        time.label = this.$t('cloudpivot.flowCenter.pc.receiveTime') as string;
        break;
      default:
        time.label = this.$t('cloudpivot.flowCenter.pc.resolveTime') as string;
        break;
    }
    this.queryFieldConfig = [
      sequenceNo,
      workflowName,
      flowTemplate,
      curResolver,
      originatorName,
      time,
    ];
  }

  /*
   * tab页栏切换
   */
  tabChange(key: any) {
    this.queryConditionSource = [];
    this.curKey = key;
    this.curPage = 1;
    this.pageSize = 20;
    this.isResetFields = true;
    this.instanceState = key;
    // this.resetParams();
    this.listWorkitems();
    this.setDisplayColumns();
    setTimeout(() => {
      this.isResetFields = false;
    }, 100);
  }

  /*
   * 分页改变
   */
  onPaginationChange(page: number, size: number) {
    this.curPage = page;
    this.listWorkitems('search');
  }

  /*
   * 分页pageSize改变
   */
  onSizeChange(current: number, size: number) {
    this.curPage = 1;
    this.pageSize = size;
    this.listWorkitems('search');
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
      originator: '',
      unitType: '',
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
    this.listWorkitems();
  }

  /*
   * 查询条件搜索事件
   */
  onSearch(params: workflowCenterParams.ListInstancesParams) {
    this.isShowQueryItem = false;
    this.queryActive = true;
    let vals: any = this.dataTranslateToFilterCard(params);

    //过滤掉name为空数据
    if (Array.isArray(vals)) {
      vals = vals.filter((item) => item.name);
    }
    this.queryConditionSource = vals;

    this.curPage = 1;
    this.searchParams = {
      ...params,
    };
    this.listWorkitems('search');
  }

  /*
   * 重新加载
   */
  reload() {
    this.curPage = 1;
    this.pageSize = 20;
    this.data = [];
    this.loadingType = 'init';
    this.listWorkitems();
  }

  /*
   * 获取我的流程列表
   */
  async listWorkitems(type?: string) {
    const params = {
      ...this.searchParams,
      status: this.instanceState,
      page: this.curPage - 1,
      size: this.pageSize,
    };

    // 数据处理函数
    this.dataHandler = (data: any) => {
      data.forEach((item: any, index: number) => {
        item.index = index + 1;
        item.key = index;
        if (
          item.workItemTimeoutStatus === 'NORMAL' ||
          item.workItemTimeoutStatus === 'TIMEOUT'
        ) {
          item.time = Helper.timeTranslate(item.stayTime);
        } else if (
          item.workItemTimeoutStatus === 'ORANGE' ||
          item.workItemTimeoutStatus === 'RED'
        ) {
          item.time = Helper.timeTranslate(item.remainingTime);
        } else {
          //Else Empty block statement
        }
        item.receiveTime = Helper.removeSeconds(item.receiveTime);
        item.startTime = Helper.removeSeconds(item.startTime);
        item.finishTime = Helper.removeSeconds(item.finishTime);

        // 设置高亮
        item.instanceName = utils.searchHighLight(
          this.searchParams.workflowName,
          item.instanceName,
        );

        // 国际化兼容
        item = utils.compatible(item, 'workflowName');
      });
      return data;
    };

    this.isShowNoData = false;
    const res: any = await workflowCenterApi.listWorkitems(params);
    this.processResult(res, type);
    // this.commonHandler(res, type);
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
            type: 8,
            batch: false,
            isChange: type === 'pageChange' ? true : false,
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
            type: 8,
            batch: false,
            isChange: type === 'pageChange' ? true : false,
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
      type: 8,
      batch: false,
      isChange: type === 'pageChange' ? true : false,
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
