import moment from 'moment';

import * as utils from 'cloudpivot/common/src/utils/pc/utils';

import * as Helper from '../../helper/helper';

import {
  workflowCenterApi,
  // workflowCenter as workflowCenterParams,
} from 'cloudpivot/api';

export class UnreadWorkitemStrategy {
  processResultType: number = 2;

  processResultBatch: boolean = true;

  id: string = 'MyUnReadWorkItem';

  initData(vm) {
    vm.headerData = {
      //头部参数
      total: 0,
      showTotal: 0,
      type: 2,
      batch: true,
    };

    vm.queryActive = false;
  }

  async getWorkItem(vm, type?: string) {
    vm.loadingType = 'loading';
    const params = {
      ...vm.searchParams,
      page: vm.curPage - 1,
      size: vm.pageSize,
      appCode: vm.appCode,
    };

    //开始日期结束日期置为空
    params.startTime = '';
    params.endTime = '';

    // 重置全选、删除按钮
    vm.isSelectAll = false;
    vm.isCirculateSingle = true;

    // 数据处理函数
    vm.dataHandler = (data: any) => {
      // 生成key 以及序号
      data.forEach((item: any, index: number) => {
        item.orderNumber = index + 1;
        item.key = index;
        item.isChecked = false;
        item.departmentName = Helper.departmentNameTranslator(
          item.departmentName,
        );
        item.startTime = Helper.removeSeconds(item.startTime);

        // 设置高亮
        item.originatorName = utils.searchHighLight(vm.wd, item.originatorName);
        item.instanceName = utils.searchHighLight(
          vm.searchParams.workflowName,
          item.instanceName,
        );

        if (item.sourceName_i18n) {
          item.sourceName_i18n = JSON.parse(item.sourceName_i18n);
        }

        item = utils.compatible(item, 'sourceName', 'sourceName_i18n');

        // 国际化兼容
        item = utils.compatible(item, 'workflowName');
      });
      return data;
    };

    vm.isShowNoData = false;
    const res = await workflowCenterApi.searchCirculates(params);
    vm.processResult(res, type);
  }

  addListener(vm) {
    vm.$store.dispatch('WorkflowCenterStore/getWorkCount');

    // window.addEventListener('resize', vm.setTableMaxHeight);
    window.addEventListener('message', vm.reloadMessage, false);

    vm.$message.config({
      maxCount: 1,
      duration: 2,
    });
  }

  resetParams(vm) {
    vm.searchParams = {
      workflowName: '',
      workflowCode: '',
      originator: '',
      unitType: '',
      appCode: vm.appCode,
    };
  }

  tipText(vm) {
    return (
      vm.mode === 'standalone'
        ? vm.$t('cloudpivot.flowCenter.pc.noDataText')
        : '当前列表没有批量处理的任务，切换至单一模式'
    ) as string;
  }
}

import { Component, Vue } from 'vue-property-decorator';

@Component
export class UnreadWorkitemMixin extends Vue {
  wd: string = '';

  tableData: any[] = []; //表单列表

  // 控制已阅按钮置灰
  isCirculateSingle: boolean = true;

  /**
   * 选中列表
   */
  changeChecked(item) {
    if (item.isShow) {
      this.tableData = item.data;
    } else {
      this.tableData = item;
    }
  }

  /**
   * 批量操作
   */
  batchProcess(data) {
    const vm: any = this;
    switch (data.type) {
      case 'approve':
        vm.mode = 'batch';
        vm.curPage = 1;
        vm.data = [];
        vm.curStrategy.getWorkItem(vm, 'pageChange');
        break;
      case 'read':
        //批量已阅
        vm.batchConsent();
        break;
      default:
        break;
    }
  }

  /**
   * 批量已阅
   */
  batchConsent() {
    if (this.tableData.length < 1) {
      this.$message.error('请选择需要批量处理的数据');
      return;
    }
    this.updateCirculateReaded(false);
  }

  // 全选
  selectAll(e: Event) {
    const vm: any = this;
    const isChecked = (e.target as any).checked;

    if (isChecked) {
      vm.tableData.forEach((item: any, index: number) => {
        item.isChecked = true;
      });
      vm.isCirculateSingle = false;
    } else {
      vm.tableData.forEach((item: any, index: number) => {
        item.isChecked = false;
      });
      vm.isCirculateSingle = true;
    }
  }

  // 清空关键字
  clearKeyword() {
    const vm: any = this;
    vm.wd = '';
    vm.curPage = 1;
    vm.curStrategy.getWorkItem(vm);
  }

  /**
   * 更新已阅
   * isCirculateAll true 批量 false 一条或者多条
   * */
  async updateCirculateReaded(isCirculateAll: boolean) {
    const vm: any = this;
    const ids: string[] = [];
    if (!isCirculateAll) {
      // 一条或者多条
      vm.tableData.forEach((item: any) => {
        ids.push(item.id);
      });
    }
    const params: any = { circulateItemIds: ids };

    const res = await workflowCenterApi.updateCirculateReaded(params);
    vm.isSelectAll = false;
    if (res.errcode === 0) {
      vm.$message.success(
        vm.$t('languages.common.tip.operationSucceed') as string,
      );
      // 重新获取一下列表
      vm.backTop();
      vm.curPage = 1;
      vm.pageSize = 20;
      vm.loadingType = 'init';
      vm.curStrategy.getWorkItem(vm);

      // 重新获取一下消息数
      vm.$store.dispatch('WorkflowCenterStore/getWorkCount');
      vm.tableData = [];
    } else {
      vm.$message.error(
        vm.$t('languages.common.tip.operationFailed') as string,
      );
    }
  }

  reloadList() {
    const vm: any = this;
    vm.onReset();
    vm.$store.dispatch('WorkflowCenterStore/getWorkCount');
  }
}
