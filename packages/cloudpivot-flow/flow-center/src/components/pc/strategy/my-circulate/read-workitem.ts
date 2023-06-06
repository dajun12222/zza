import moment from 'moment';

import * as utils from 'cloudpivot/common/src/utils/pc/utils';

import * as Helper from '../../helper/helper';

import {
  workflowCenterApi,
  // workflowCenter as workflowCenterParams,
} from 'cloudpivot/api';

export class ReadWorkitemStrategy {
  processResultType: number = 4;

  processResultBatch: boolean = false;

  id: string = 'MyReadWorkitem';

  initData(vm) {
    vm.searchParams.startTime =
      vm.searchParams.startTime ||
      utils.timeStampToDate('YY-MM-DD', (moment().add(-30, 'days') as any)._d);
    vm.searchParams.endTime =
      vm.searchParams.endTime ||
      utils.timeStampToDate('YY-MM-DD', (moment() as any)._d);

    vm.headerData = {
      //头部参数
      total: 0,
      showTotal: 0,
      type: 4,
      batch: false,
    };

    vm.queryActive = true;
  }

  async getWorkItem(vm, type?: string) {
    const p = {
      ...vm.searchParams,
      page: vm.curPage - 1,
      size: vm.pageSize,
      appCode: vm.appCode,
    };

    // 数据处理函数
    vm.dataHandler = (data: any) => {
      data.forEach((item: any, index: number) => {
        item.orderNumber = index + 1;
        item.key = index;
        item.departmentName = Helper.departmentNameTranslator(
          item.departmentName,
        );

        // 去掉秒钟
        if (item.receiveTime) {
          item.receiveTime = Helper.removeSeconds(item.receiveTime);
        }

        // 设置高亮
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
    vm.loadingType = 'loading';
    const res: any = await workflowCenterApi
      .listReadWorkitems(p)
      .then((res) => {
        vm.loadingType = 'init';
        return res; //回调链数据返回
      });
    vm.processResult(res, type);
    // vm.commonHandler(res, type);
  }

  addListener(vm) {
    window.addEventListener('message', vm.reloadMessage, false);
  }

  resetParams(vm) {
    vm.searchParams = {
      workflowName: '',
      workflowCode: '',
      originator: '',
      unitType: '',
      startTime: utils.timeStampToDate(
        'YY-MM-DD',
        (moment().add(-30, 'days') as any)._d,
      ),
      endTime: utils.timeStampToDate('YY-MM-DD', (moment() as any)._d),
      appCode: vm.appCode,
    };
  }

  tipText(vm) {
    return '暂无内容';
  }
}
