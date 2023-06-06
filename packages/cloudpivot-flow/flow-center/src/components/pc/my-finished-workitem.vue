<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Descripttion: 我的已办-新版
 * @version: v1.0
 * @Author: baidongsheng
 * @Date: 2021-11-10 16:33:04
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-03-04 14:40:06
-->
<template>
  <div ref="workItem" class="workitem-box">
    <!-- 顶部信息 -->
    <div style="padding-right: 12px; z-index: 10">
      <div class="workitem-box-top">
        <PageHeader
          :headerData="headerData"
          :queryConditionSource="queryConditionSource"
          :subTitle="$t('cloudpivot.flowCenter.pc.doneList')"
          :queryActive="queryActive"
          :isOpen="isShowQueryItem"
          :noData="isShowNoData"
          @search="isShowQueryItem = true"
        />

        <div v-show="isShowQueryItem" class="filters-box">
          <query-workitem
            ref="queryWorkitem"
            class="query-box"
            :fieldConfigs="queryFieldConfig"
            @reset="onReset"
            @search="onSearch"
            @hide="isShowQueryItem = false"
          />
        </div>
      </div>
    </div>

    <!-- 待阅列表 -->
    <div
      id="MyFinishedWorkitem"
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
            ? $t('cloudpivot.flowCenter.pc.showAllDone')
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

import QueryWorkitem from './components/query-condition/query-workitem.vue';

import {
  workflowCenterApi,
  workflowCenter as workflowCenterParams,
} from 'cloudpivot/api';

import * as WorkflowCenterTypes from './typings/workflow-center';
import {
  getWorkitemStatusConfig,
  getAllWorkflowQueryFieldConfig,
} from './typings/workflow-list-config';

import WorkItemMixin from './mixins/workitem';

import * as Helper from './helper/helper';

import * as utils from 'cloudpivot/common/src/utils/pc/utils';

import common from 'cloudpivot/common/pc';

import SetTimeTypeMixin from './common/index'; //公共处理模块

import moment from 'moment';

import { getAllWorkflowFieldConfig } from './typings/workflow-list-config';

interface PageHeaderData {
  total: number; //总数
  showTotal: number; //当前数
  type: number; // 类型
  batch: boolean; //是否批量
}

@Component({
  name: 'MyFinishedWorkitem',
  components: {
    PageHeader: common.components.PageHeader,
    PageData: common.components.PageData,
    PageLoadingNew: common.components.PageLoadingNew,
    PageNoData: common.components.PageNoData,
    PageLoadFail: common.components.LoadFail,
    QueryWorkitem,
  },
})
export default class MyFinishedWorkitem extends mixins(
  WorkItemMixin,
  SetTimeTypeMixin,
) {
  /**
   * 单应用集成属性,集成时不显示title
   */
  @Prop({
    default: true,
  })
  showTitle!: boolean;

  /**
   * 单应用集成属性,集成时表格高度
   */
  @Prop() scrollHeight!: number;

  /**
   * 单应用集成属性,单应用appCode
   */
  @Prop() appCode!: string;

  searchParams: workflowCenterParams.FinishedWorkItemParams = {
    workflowName: '',
    workflowCode: '',
    originator: '',
    unitType: '',
    instanceState: '',
    startTime: utils.timeStampToDate(
      'YY-MM-DD',
      (moment().add(-30, 'days') as any)._d,
    ),
    endTime: utils.timeStampToDate('YY-MM-DD', (moment() as any)._d),
    appCode: this.appCode,
  };

  queryActive: boolean = true; //是否筛选

  isShowQueryItem: boolean = false;

  get scrollYHeight() {
    if (this.scrollHeight) {
      return this.scrollHeight;
    }
    return this.scrollY;
  }

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
    type: 3,
    batch: true,
  };

  displayColumns: WorkflowCenterTypes.DisplayColumnsConfig[] = [];

  queryFieldConfig: any[] = [];

  /**
   * 滚动加载
   */
  handleInfiniteOnLoad() {
    if (this.loadingType !== 'init' || this.curPage === 1) {
      return;
    }
    this.getMyFinishWorkitem('pageChange');
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
      if (document.getElementById('MyFinishedWorkitem')) {
        (document.getElementById('MyFinishedWorkitem') as any).scrollTop =
          this.scrollTop + ispeed;
      }
      if (this.scrollTop === 0) {
        clearInterval(timer);
      }
    }, 16);
  }

  /**
   * 设置列表中的展示字段
   */
  setDisplayColumns() {
    //先将所有使用到的字段列举出来
    const {
      sequenceNo,
      resolveRzt,
      resolveNode,
      resolveTime,
      originatorName,
      initiationTime,
    } = getAllWorkflowFieldConfig(this);

    this.displayColumns = [
      sequenceNo,
      resolveRzt,
      resolveNode,
      resolveTime,
      originatorName,
      initiationTime,
    ];
  }

  setQueryFieldConfig() {
    const {
      sequenceNo,
      workflowName,
      flowTemplate,
      originatorName,
      time,
      flowStatus,
      approvalNode,
    } = getAllWorkflowQueryFieldConfig(this);
    time.label = this.$t('cloudpivot.flowCenter.pc.resolveTime');
    approvalNode.label = this.$t('cloudpivot.flowCenter.pc.resolveNode');
    this.queryFieldConfig = [
      sequenceNo,
      workflowName,
      flowTemplate,
      originatorName,
      time,
      flowStatus,
      approvalNode,
    ];
  }

  mounted() {
    if (document.getElementById('MyFinishedWorkitem')) {
      (document.getElementById('MyFinishedWorkitem') as any).addEventListener(
        'scroll',
        this.scrollToTop,
      );
    }
    this.setDisplayColumns();
    this.setQueryFieldConfig();
    setTimeout(() => {
      this.getMyFinishWorkitem();
    }, 500);
    // window.addEventListener('resize', this.setTableMaxHeight);
    window.addEventListener('message', this.reloadMessage, false);
  }

  reloadMessage(event: any) {
    if (event.source === window) {
      return;
    }
    if (
      event.data.indexOf('/workflow-center/my-finished-workitem') !== -1 ||
      event.data.indexOf('%2Fworkflow-center%2Fmy-finished-workitem') !== -1
    ) {
      this.reload();
    }
  }

  destroyed() {
    // window.removeEventListener('resize', this.setTableMaxHeight);
    window.removeEventListener('message', this.reloadMessage, false);
    if (document.getElementById('MyFinishedWorkitem')) {
      (
        document.getElementById('MyFinishedWorkitem') as any
      ).removeEventListener('scroll', this.scrollToTop);
    }
  }

  resetParams() {
    this.searchParams = {
      workflowName: '',
      workflowCode: '',
      originator: '',
      unitType: '',
      instanceState: '',
      startTime: utils.timeStampToDate(
        'YY-MM-DD',
        (moment().add(-30, 'days') as any)._d,
      ),
      endTime: utils.timeStampToDate('YY-MM-DD', (moment() as any)._d),
      appCode: this.appCode,
    };
  }

  onReset() {
    this.isShowQueryItem = false;
    this.queryActive = true;
    this.queryConditionSource = [];
    this.curPage = 1;
    this.resetParams();
    this.getMyFinishWorkitem();
  }

  onSearch(params: workflowCenterParams.FinishedWorkItemParams) {
    this.isShowQueryItem = false;
    this.queryActive = true;
    const vals: any = this.dataTranslateToFilterCard(params);
    this.queryConditionSource = vals;

    this.curPage = 1;
    this.searchParams = {
      ...params,
    };
    this.getMyFinishWorkitem('search');
  }

  // 分页改变
  onPaginationChange(page: number, size: number) {
    this.curPage = page;
    this.getMyFinishWorkitem('pageChange');
  }

  // 分页pageSize改变
  onSizeChange(current: number, size: number) {
    this.curPage = 1;
    this.pageSize = size;
    this.getMyFinishWorkitem('pageChange');
  }

  // 加载失败重新加载
  reload() {
    this.curPage = 1;
    this.pageSize = 20;
    this.data = [];
    this.loadingType = 'init';
    this.getMyFinishWorkitem();
  }

  // 获取已办列表
  async getMyFinishWorkitem(type?: string) {
    const p = {
      ...this.searchParams,
      page: this.curPage - 1,
      size: this.pageSize,
      appCode: this.appCode,
      isCustomized:true
    };

    // 数据处理函数
    this.dataHandler = (data: any) => {
      data.forEach((item: any, index: number) => {
        item.orderNumber = index + 1;
        item.key = index;
        // 处理结果

        item.finishTime = Helper.removeSeconds(item.finishTime);

        // 判断是否为委托任务
        item.beTrust = item.workItemTrust ? item.workItemTrust.trust : false;
        // 判断当前用户是否为委托人
        item.currentTrustor = item.workItemTrust
          ? item.workItemTrust.currentTrustor
          : false;

        // 设置高亮
        item.instanceName = utils.searchHighLight(
          this.searchParams.workflowName,
          item.instanceName,
        );

        // 国际化兼容
        item = utils.compatible(item, 'activityName');
      });
      return data;
    };

    this.isShowNoData = false;
    this.loadingType = 'loading';
    const res: any = await workflowCenterApi
      .listFinishedWorkitems(p)
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
            type: 3,
            batch: true,
          };
          return;
        }
        res.data.content.forEach((item) => {
          item.startTime = this.removeSeconds(item.startTime);
          this.data.push(item);
        });
      } else {
        //初始化
        this.data = res.data.content.map((item) => {
          item.startTime = this.removeSeconds(item.startTime);
          return item;
        });
        /**
         * 加载完毕
         */
        if (res.data.content.length < this.pageSize) {
          this.loadingType = 'done';
          this.headerData = {
            total: res.data.totalElements,
            showTotal: this.data.length,
            type: 3,
            batch: true,
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
      type: 3,
      batch: true,
    };
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.setLoadAllTxt();
    // this.setTableMaxHeight();
    this.setDisplayColumns();
    this.setQueryFieldConfig();
  }
}
</script>
<style lang="less" scoped>
@import './style/common.less';
</style>
