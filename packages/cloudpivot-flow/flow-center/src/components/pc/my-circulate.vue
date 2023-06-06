<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Descripttion: 我的待阅-新版
 * @version: v1.0
 * @Author: baidongsheng
 * @Date: 2021-11-10 16:33:04
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-03-04 14:43:21
-->
<template>
  <div ref="workItem" class="workitem-box my-workflow">
    <!-- 顶部信息 -->
    <div style="padding-right: 12px; z-index: 10">
      <div class="workitem-box-top">
        <PageHeader
          :headerData="headerData"
          :queryConditionSource="queryConditionSource"
          :queryActive="queryActive"
          :subTitle="$t('cloudpivot.flowCenter.pc.readingTask')"
          :disabled="tableData.length > 0 ? false : true"
          :isOpen="isShowQueryItem"
          :tabsList="tabs"
          :noData="isShowNoData"
          :activeKey="activeKey"
          @batch="batchProcess"
          @search="isShowQueryItem = true"
          @changeTabs="changeTabs"
        />

        <div v-show="isShowQueryItem" class="filters-box">
          <query-workitem
            ref="queryWorkitem"
            :fieldConfigs="queryFieldConfig"
            :hasTabs="true"
            @reset="onReset"
            @search="onSearch"
            @hide="isShowQueryItem = false"
          />
        </div>
      </div>
    </div>

    <div
      id="MyCirculateItem"
      v-show="!isShowNoData"
      v-infinite-scroll="handleInfiniteOnLoad"
      class="content-data"
      :infinite-scroll-disabled="busy"
      :infinite-scroll-distance="10"
    >
      <PageData
        :listData="data"
        :batch="headerData.batch"
        :type="headerData.type"
        :displayColumns="displayColumns"
        @changeChecked="changeChecked"
        @closeModal="reloadList"
        @refreshData="reload"
      />
      <PageLoadingNew
        :loading="loadingType === 'loading'"
        :loadingText="
          loadingType === 'done'
            ? $t('cloudpivot.flowCenter.pc.showAllToRead')
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
            : $t('cloudpivot.flowCenter.pc.noDataText')
        "
      />
    </div>

    <!-- 返回顶部 -->
    <div v-if="btnFlag" class="return-top" @click="backTop">
      <i class="icon aufontAll h-icon-all-shape"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator';

import {
  Button,
  Input,
  Pagination,
  Icon,
  Checkbox,
  Tooltip,
} from '@h3/antd-vue';

import { mixins } from 'vue-class-component';

import 'cloudpivot/common/src/config/portal/h3-form'; // 不清楚原因，否则发起人节点service null

import WorkItemMixin from './mixins/workitem';

import CommonDrawer from './components/modals/drawer.vue';

import common from 'cloudpivot/common/pc';

import filterCard from 'cloudpivot-list/list/src/components/pc/components/filter-card/filter-card.vue';

import QueryWorkitem from './components/query-condition/query-workitem.vue';

import CommonTable from './components/common-table/table.vue';

import SetTimeTypeMixin from './common/index'; //公共处理模块

import {
  UnreadWorkitemMixin,
  UnreadWorkitemStrategy,
} from './strategy/my-circulate/unread-workitem';

import { ReadWorkitemStrategy } from './strategy/my-circulate/read-workitem';

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
  name: 'MyUnReadWorkItem',
  components: {
    filterCard: filterCard,
    QueryWorkitem,
    ATooltip: Tooltip,
    AButton: Button,
    AInputSearch: Input.Search,
    AInput: Input,
    APagination: Pagination,
    AIcon: Icon,
    ACheckbox: Checkbox,
    CommonDrawer,
    PageLoadingNew: common.components.PageLoadingNew,
    PageNoData: common.components.PageNoData,
    PageLoadFail: common.components.LoadFail,
    CommonTable,
    PageHeader: common.components.PageHeader,
    PageData: common.components.PageData,
  },
})
export default class MyUnReadWorkItem extends mixins(
  WorkItemMixin,
  SetTimeTypeMixin,
  UnreadWorkitemMixin,
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

  /**
   * 策略
   */
  curStrategy: any = new UnreadWorkitemStrategy();

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

  headerData: any = {};

  searchParams: any = {};

  queryActive: boolean = false; //是否筛选

  isShowQueryItem: boolean = false;

  tabs: any[] = [];

  displayColumns: WorkflowCenterTypes.DisplayColumnsConfig[] = [];

  queryFieldConfig: any[] = [];

  activeKey: number;

  setTabsBtn() {
    this.tabs = [
      {
        label: this.$t('cloudpivot.flowCenter.pc.toreadList'),
        value: 'MyUnread',
        key: 0,
      },
      {
        label: this.$t('cloudpivot.flowCenter.pc.readList'),
        value: 'MyRead',
        key: 1,
      },
    ];
  }

  setDisplayColumns() {
    //先将所有使用到的字段列举出来
    const { sequenceNo, sourceName, originatorName, receiveTime } =
      getAllWorkflowFieldConfig(this);

    this.displayColumns = [sequenceNo, sourceName, originatorName, receiveTime];
  }

  setQueryFieldConfig() {
    const { sequenceNo, workflowName, flowTemplate, originatorName, time } =
      getAllWorkflowQueryFieldConfig(this);
    time.label = this.$t('cloudpivot.flowCenter.pc.receiveTime');
    this.queryFieldConfig = [
      sequenceNo,
      workflowName,
      flowTemplate,
      originatorName,
    ];
    if (this.curStrategy.id === 'MyReadWorkitem') {
      this.queryFieldConfig.push(time);
    }
  }

  @Watch('$i18n.locale', { immediate: true })
  onLocaleChange() {
    this.setTabsBtn();
    this.setDisplayColumns();
    this.setQueryFieldConfig();
    this.setLoadAllTxt();
  }

  get scrollYHeight() {
    if (this.scrollHeight) {
      return this.scrollHeight;
    }
    return this.scrollY;
  }

  /**
   * 滚动加载
   */
  handleInfiniteOnLoad() {
    if (this.loadingType !== 'init' || this.curPage === 1) {
      return;
    }
    this.curStrategy.getWorkItem(this, 'pageChange');
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
      if (document.getElementById('MyCirculateItem')) {
        (document.getElementById('MyCirculateItem') as any).scrollTop =
          this.scrollTop + ispeed;
      }
      if (this.scrollTop === 0) {
        clearInterval(timer);
      }
    }, 16);
  }

  inited() {
    this.curStrategy.initData(this);

    if (document.getElementById('MyCirculateItem')) {
      (document.getElementById('MyCirculateItem') as any).addEventListener(
        'scroll',
        this.scrollToTop,
      );
    }
    setTimeout(() => {
      this.curStrategy.getWorkItem(this);
    }, 500);

    this.curStrategy.addListener(this);
  }

  mounted() {
    const { type } = this.$route.query;

    this.activeKey = Number((type as string) || 0);

    this.loadingType = 'init';
    this.data = [];
    this.total = 0;
    this.curPage = 1;
    if (this.activeKey === 1) {
      this.curStrategy = new ReadWorkitemStrategy();
    } else {
      this.curStrategy = new UnreadWorkitemStrategy();
    }
    this.inited();
  }

  reloadMessage(event: any) {
    if (event.source === window) {
      return;
    }
    if (
      event.data.indexOf('/workflow-center/my-circulate-workitem') !== -1 ||
      event.data.indexOf('%2Fworkflow-center%2Fmy-circulate-workitem') !== -1
    ) {
      this.reload();
    }
  }

  destroyed() {
    this.onDestroy();
  }

  onDestroy() {
    // window.removeEventListener('resize', this.setTableMaxHeight);
    window.removeEventListener('message', this.reloadMessage, false);
    if (document.getElementById('MyCirculateItem')) {
      (document.getElementById('MyCirculateItem') as any).removeEventListener(
        'scroll',
        this.scrollToTop,
      );
    }
    this.$message.destroy();
  }

  onItemCheckboxChange() {
    const isCheckedItems = this.tableData.filter((d: any) => d.isChecked);
    if (isCheckedItems.length > 0) {
      this.isCirculateSingle = false;
    } else {
      this.isCirculateSingle = true;
    }
    if (isCheckedItems.length < this.tableData.length) {
      this.isSelectAll = false;
    } else {
      this.isSelectAll = true;
    }
  }

  // 点击搜索
  onSearch(params) {
    this.isShowQueryItem = false;
    this.queryActive = true;
    const vals: any = this.dataTranslateToFilterCard(params, 'myReadWorkItem');

    /**
     * 过滤掉无效数据，TO 还不知道为什么会产生无效数据
     */
    // if(Array.isArray(vals)){
    //   vals = vals.filter(item=> !item.content.includes('undefined'));
    // }

    this.queryConditionSource = vals;
    this.curPage = 1;
    this.searchParams = {
      ...params,
    };
    this.curStrategy.getWorkItem(this, vals.length > 0 ? 'search' : '');
  }

  onReset() {
    this.isShowQueryItem = false;
    this.queryActive = false;
    this.queryConditionSource = [];
    this.curStrategy.resetParams(this);
    this.reload();
  }

  reload() {
    this.wd = '';
    this.curPage = 1;
    this.pageSize = 20;
    this.isSelectAll = false;
    this.data = [];
    this.loadingType = 'init';
    this.curStrategy.getWorkItem(this);
  }

  // 分页改变
  onPaginationChange(page: number, size: number) {
    this.curPage = page;
    this.curStrategy.getWorkItem(this, 'pageChange');
  }

  // 分页pageSize改变
  onSizeChange(current: number, size: number) {
    this.curPage = 1;
    this.pageSize = size;
    this.curStrategy.getWorkItem(this, 'pageChange');
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
            type: this.curStrategy.processResultType,
            batch: this.curStrategy.processResultBatch,
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
            type: this.curStrategy.processResultType,
            batch: this.curStrategy.processResultBatch,
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
        this.tipText = this.curStrategy.tipText(this);
      }
    }
    this.headerData = {
      total: res.data.totalElements,
      showTotal:
        this.curPage === 1 ? res.data.content.length : this.data.length,
      type: this.curStrategy.processResultType,
      batch: this.curStrategy.processResultBatch,
    };
  }

  changeTabs(obj) {
    this.loadingType = 'init';
    this.data = [];
    this.total = 0;
    this.curPage = 1;
    if (obj.instanceState === 'MyRead') {
      this.curStrategy = new ReadWorkitemStrategy();
    } else {
      this.curStrategy = new UnreadWorkitemStrategy();
    }
    this.onDestroy();
    this.setQueryFieldConfig();
    this.inited();
  }
}
</script>

<style lang="less" scoped>
@import './style/common.less';
</style>
