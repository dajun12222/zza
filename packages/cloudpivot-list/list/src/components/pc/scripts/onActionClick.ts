/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { formApi, listApi, listParams } from 'cloudpivot/api';
import * as platform from 'cloudpivot-platform/platform';
import dataFormChange from './dataFormChange';
import printFormCode from './printFormCode';
import axios from 'axios';
import { message } from '@h3/antd-vue';

import { utils } from 'cloudpivot/common';

export default {
  /*
   * 新增按钮
   */
  async handleAdd(
    vm: any,
    obj: listParams.QueryActions,
    _schemaCode?: string,
    isRelationForm: boolean = false,
    parentForm?: any,
    customButton: boolean = false,
  ) {
    console.log(utils);
    //判断是否有权限发起流程表单
    const params: listParams.ApiImplicitParam = {
      schemaCode: obj.schemaCode,
      relativeCode: obj.associationCode,
      isMobile: false,
      queryActionType: obj.queryActionType,
      queryActionRelativeType: obj.associationType,
    };
    const res = await listApi.getJurisdiction(params);
    if (res.errcode === 700020) {
      vm.$message.warning(vm.$t('cloudpivot.list.pc.NoPermissionAdd'), 4);
      return;
    } else if (res.errcode === 401033) {
      vm.$message.warning(vm.$t('cloudpivot.list.pc.NoPublish'), 4);
      return;
    } else {
      //Else Empty block statement
    }
    console.log('新增按钮--------', obj);
    let url: string = '';
    const code = obj.associationCode;
    if (obj.associationType === 1) {
      // 关联流程
      url = `/form/detail?startWorkflowCode=${code}`;
    } else {
      // 关联表单
      // let { schemaCode } = vm.$route.params;
      let { schemaCode } = obj;
      schemaCode =
        schemaCode === undefined ? (_schemaCode as string) : schemaCode;
      url = `/form/detail?schemaCode=${schemaCode}&sheetCode=${code}&queryCode=${vm.curListCode}`;
    }
    //对于甘特图，添加子数据时在层级关系字段上赋值为父级的id
    if (parentForm) {
      url += `&key=${parentForm.key}&relId=${parentForm.value.id}&relPropertyCode=${parentForm.value.displayCode}&relSchemacode=${parentForm.value.schemaCode}`;
    }
    if (customButton) {
      url += `&customButtonOpen=${customButton}`;
    }
    if (vm.$route.query.debugId) {
      url += `&debugId=${vm.$route.query.debugId}`;
    }
    console.log('url--------', url);
    let search = location.search;
    search = search ? `${search}&iframeAction=add` : `?iframeAction=add`;
    url += `&return=${location.pathname + encodeURIComponent(search)}`;
    if (platform.IS_DINGTALK) {
      vm.$router.push(url).catch((err: any) => {
        console.log(err);
      });
    } else {
      // const opens = window.open(url);
      if (obj.actionCode === 'add' && obj.extend1 === 'load') {
        url = `/form/detail?startWorkflowCode=${code}&return=%2Fworkflow-center%2Fstart-workflow`;
      }
      //  alert(111)
      // vm.showIframeForm = true;
      vm.IframeFormUrl = url;
      let att:any = url.split('?');
      let params:any = utils.getParams(url);
      console.log('start....url....');
      console.log(att);
      console.log(url);
      console.log(params);
      let { href } = vm.$router.resolve({
        path: att[0],
        query: params
      });
    window.open(href,'_blank');
      //window.open(url);
    }
    if (isRelationForm) {
      let att:any = url.split('?');
      let params:any = utils.getParams(url);
      let { href } = vm.$router.resolve({
        path: att[0],
        query: params
      });
    window.open(href,'_blank');
      //window.open(url);
    }
  },

  /*
   * 存入试卷
   */
  async batchSavePaperQusetion(vm: any) {
    const _this = this;
    const { schemaCode } = vm.$route.params;
    let paperList: any = [];
    const allObject: any = [];
    let localHref: any = window.location.href
      .split('paperid=')[1]
      .split('&parentId')[0];
    let reg = true;
    vm.checkeds.forEach((c: boolean, index: number) => {
      if (c) {
        paperList.push(this.paperForm(localHref, index, vm));
      }
      allObject.push(this.paperForm(localHref, index, vm));
    });
    if (
      vm.modelType === 'TREE' ||
      (vm.queryPresentationType === 'GANTT' &&
        vm.listConfig.queryGanttModel.levelPropertyCode)
    ) {
      paperList = vm.treeCheck;
    }

    // 如果当前未勾选任何数据，默认全部生成
    if (paperList.length === 0) {
      paperList = allObject;
    }
    for (var i = 0; i < paperList.length; i++) {
      if (paperList[i].isForbidden === '是') {
        reg = false;
      }
    }
    if (reg === true) {
      vm.$confirm({
        title: '确定要存入试卷吗？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          _this.SavePaper(vm, paperList, localHref);
        },
      });
    } else {
      vm.$message.error('禁用的试题不能发布，请重新勾选');
    }

    // if (res.errcode === 0 && Array.isArray(res.data)) {
    //   const countObj: any = {
    //     releCount: 0,
    //   };
    //   vm.deleteData = [];
    //   res.data.forEach((data: any, index: any) => {
    //     if (data.relativeModel) {
    //       countObj.releCount++;
    //     }
    //     vm.deleteData.push({
    //       id: data.objectId,
    //       relativeModel: data.relativeModel || '--',
    //       type: data.resultDesc,
    //       seq: index + 1,
    //     });
    //   });
    //   const h = vm.$createElement;
    //   const _this = this;
    //   vm.$confirm({
    //     title: h('span', { class: 'delete-title' }, [
    //       h('i', { class: 'icon aufontAll h-icon-all-question-circle' }),
    //       vm
    //         .$t('cloudpivot.list.pc.deleteData.deleteDataTitle', {
    //           num: res.data.length,
    //         })
    //         .toString(),
    //     ]), // 以下数据删除后不能恢复，确定要删除吗？
    //     content: h('div', { class: 'delete-content' }, [
    //       h('div', { class: 'delete-content-box' }, [
    //         vm.$t('cloudpivot.list.pc.deleteData.deleteDataTips1').toString(),
    //         h('span', { class: [{ hidden: !countObj.releCount }] }, [
    //           vm.$t('cloudpivot.list.pc.deleteData.deleteDataTips2').toString(),
    //           h('span', { class: 'num' }, [`${countObj.releCount}`]),
    //           vm.$t('cloudpivot.list.pc.deleteData.deleteDataTips3').toString(),
    //         ]),
    //         h('br'),
    //         h(
    //           'a',
    //           {
    //             on: {
    //               click: () => {
    //                 vm.getDeleteDataName();
    //                 vm.pageChange(
    //                   vm.pageSizeParams.page,
    //                   vm.pageSizeParams.size,
    //                 );
    //                 vm.showDeleteDetail = true;
    //               },
    //             },
    //           },
    //           [vm.$t('cloudpivot.list.pc.deleteData.detail').toString()],
    //         ),
    //       ]),
    //     ]),
    //     width: '420px',
    //     okText: vm.$t('cloudpivot.list.pc.Delete').toString(),
    //     cancelText: vm.$t('cloudpivot.list.pc.Cancel').toString(),
    //     okType: 'danger',
    //     autoFocusButton: 'null',
    //     onOk() {
    //       window.postMessage('delete', origin);
    //       _this.deleteListItems(vm);
    //     },
    //     onCancel() {
    //       if (vm.eventHooksHandler) {
    //         vm.eventHooksHandler.exec(
    //           'onActionDone',
    //           vm.getAction('delete'),
    //           false,
    //         );
    //       }
    //     },
    //     class: 'test',
    //     className: 'test1',
    //     icon: 'none',
    //   } as any);
    // } else {
    //   vm.$message.error(res.errmsg);
    // }
  },

  async SavePaper(vm, paperList, localHref) {
    let res: any = await listApi.batchSavePaperQusetion(paperList);
    if (res.errcode === 0) {
      window.open(
        '/application/OnlineLearning/audit/examination?paperid=' +
          localHref +
          '&isOpenPage=true',
        '_self',
      );
    } else {
      vm.$message.error(res.errmsg);
    }
  },

  /*
   * 删除按钮
   */
  async handleDeleteListData(vm: any) {
    const { schemaCode } = vm.$route.params;
    let _ids: string[] = [];
    const allObjectIds: any = [];

    vm.checkeds.forEach((c: boolean, index: number) => {
      if (c) {
        _ids.push(vm.dataSource[index].id);
      }
      allObjectIds.push(vm.dataSource[index].id);
    });
    if (
      vm.modelType === 'TREE' ||
      (vm.queryPresentationType === 'GANTT' &&
        vm.listConfig.queryGanttModel.levelPropertyCode)
    ) {
      _ids = vm.treeCheck;
    }
    console.log(_ids, '_ids=----------------------------');

    // 如果当前未勾选任何数据，默认全部生成
    if (_ids.length === 0) {
      _ids = allObjectIds;
    }

    const params: listParams.DeleteListParams = {
      ids: _ids,
      schemaCode,
      queryId: vm.listConfig.queryGanttModel
        ? vm.listConfig.queryGanttModel.queryId
        : '',
    };

    const res = await listApi.checkDeleteItems(params);
    if (res.errcode === 0 && Array.isArray(res.data)) {
      const countObj: any = {
        releCount: 0,
      };
      vm.deleteData = [];
      res.data.forEach((data: any, index: any) => {
        if (data.relativeModel) {
          countObj.releCount++;
        }
        vm.deleteData.push({
          id: data.objectId,
          relativeModel: data.relativeModel || '--',
          type: data.resultDesc,
          seq: index + 1,
        });
      });
      const h = vm.$createElement;
      const _this = this;
      vm.$confirm({
        title: h('span', { class: 'delete-title' }, [
          h('i', { class: 'icon aufontAll h-icon-all-question-circle' }),
          vm
            .$t('cloudpivot.list.pc.deleteData.deleteDataTitle', {
              num: res.data.length,
            })
            .toString(),
        ]), // 以下数据删除后不能恢复，确定要删除吗？
        content: h('div', { class: 'delete-content' }, [
          h('div', { class: 'delete-content-box' }, [
            vm.$t('cloudpivot.list.pc.deleteData.deleteDataTips1').toString(),
            h('span', { class: [{ hidden: !countObj.releCount }] }, [
              vm.$t('cloudpivot.list.pc.deleteData.deleteDataTips2').toString(),
              h('span', { class: 'num' }, [`${countObj.releCount}`]),
              vm.$t('cloudpivot.list.pc.deleteData.deleteDataTips3').toString(),
            ]),
            h('br'),
            h(
              'a',
              {
                on: {
                  click: () => {
                    vm.getDeleteDataName();
                    vm.pageChange(
                      vm.pageSizeParams.page,
                      vm.pageSizeParams.size,
                    );
                    vm.showDeleteDetail = true;
                  },
                },
              },
              [vm.$t('cloudpivot.list.pc.deleteData.detail').toString()],
            ),
          ]),
        ]),
        width: '420px',
        okText: vm.$t('cloudpivot.list.pc.Delete').toString(),
        cancelText: vm.$t('cloudpivot.list.pc.Cancel').toString(),
        okType: 'danger',
        autoFocusButton: 'null',
        onOk() {
          window.postMessage('delete', origin);
          _this.deleteListItems(vm);
        },
        onCancel() {
          if (vm.eventHooksHandler) {
            vm.eventHooksHandler.exec(
              'onActionDone',
              vm.getAction('delete'),
              false,
            );
          }
        },
        class: 'test',
        className: 'test1',
        icon: 'none',
      } as any);
    } else {
      vm.$message.error(res.errmsg);
    }
  },

  /*
   * 删除列表项
   */
  async deleteListItems(vm: any) {
    vm.$message.loading(vm.$t('cloudpivot.list.pc.DeleteLoading'), 0);
    let _ids: string[] = [];
    vm.checkeds.forEach((c: boolean, index: number) => {
      if (c) {
        _ids.push(vm.dataSource[index].id);
      }
    });
    if (
      vm.modelType === 'TREE' ||
      (vm.queryPresentationType === 'GANTT' &&
        vm.listConfig.queryGanttModel.levelPropertyCode)
    ) {
      _ids = vm.treeCheck;
    }
    const { schemaCode } = vm.$route.params;

    const params: listParams.DeleteListParams = {
      ids: _ids,
      schemaCode,
    };

    const res = await listApi.deleteListData(params);
    if (res.errcode === 0) {
      //删除属性数据后，需要重置treeCheck数据
      vm.treeCheck = [];
      // 当前为最后一页时，且删除了所有数据，把当前页码减一
      if (
        _ids.length === vm.dataSource.length &&
        res.data.successCount === _ids.length &&
        vm.curPage > 1
      ) {
        vm.curPage -= 1;
      }

      if (res.data && res.data.errorCount > 0) {
        if (res.data.successCount === 0) {
          vm.$message.warning(
            vm.$t('cloudpivot.list.pc.NoPermissionDelete'),
            4,
          );
        } else {
          vm.$message.warning(
            vm.$t('cloudpivot.list.pc.DeleteItemsTips', {
              successCount: res.data.successCount,
              errorCount: res.data.errorCount,
            }),
            4,
          );
        }
      } else if (res.data && res.data.errorCount === 0) {
        if (res.data.successCount > 0) {
          vm.$message.success(vm.$t('cloudpivot.list.pc.DeleteSuccess'));
        }
      } else {
        //Else Empty block statement
      }

      vm.resetSelectAll(vm);
      vm.getQueryList('delete');
      if (vm.eventHooksHandler) {
        vm.eventHooksHandler.exec('onActionDone', vm.getAction('delete'), true);
      }
    } else if (res.errcode === 550006) {
      vm.$message.error(
        vm.$t('cloudpivot.form.runtime.tip.errTips13').toString(),
      );
      if (vm.eventHooksHandler) {
        vm.eventHooksHandler.exec(
          'onActionDone',
          vm.getAction('delete'),
          false,
        );
      }
    } else {
      // vm.$message.error(vm.$t('cloudpivot.list.pc.DeleteFailed'));
      // #42813 Delete中配置逻辑校验节点，不满足条件，在列表删除时返回后台返回错误信息
      if (res.errmsg) {
        vm.$message.error(res.errmsg);
      } else {
        vm.$message.error(vm.$t('cloudpivot.list.pc.DeleteFailed'));
      }
      if (vm.eventHooksHandler) {
        vm.eventHooksHandler.exec(
          'onActionDone',
          vm.getAction('delete'),
          false,
        );
      }
    }
  },

  /**
   * 开始导入数据
   */
  async import(vm: any) {
    const params: listParams.ImportParams = {
      fileName: vm.importFileName,
      originalFilename: '',
      schemaCode: vm.schemaCode,
      queryCode: vm.curListCode,
      queryField: vm.importrQueryField,
      languageType: this.$i18n.locale,
    };
    const res = await listApi.importData(params);
    if (res.errcode !== 0) {
      vm.isImporting = false;
      vm.importStatus = listParams.ImportResult.SystemError;
    } else {
      vm.isImporting = true;
      this.simulateImport(vm, false);
    }
  },

  /**
   * 导入结束（不管成功与失败）
   */
  importEnd(vm: any, data: any) {
    vm.isImporting = false;
    vm.isImportEnd = true;
    vm.importFileName = data.fileName;
    vm.successNum = data.successCount;
    vm.failNum = data.errorCount;
    vm.importStatus = data.errorType;
    vm.errorMsg = data.errorMsg;
    if (data.errorType === 0) {
      vm.getQueryList();
    } else if (data.errorType === 1 || data.errorType === 8) {
      if (data.headColumns && data.secondImportData && !vm.shrinkImportModal) {
        vm.openFixDataModal(data);
      } else if (data.errorType === 1) {
        vm.getQueryList();
      } else {
        //Else Empty block statement
      }
    } else if (data.errorType === 3) {
      vm.importSize = data.importSize;
    } else {
      //Else Empty block statement
    }
  },

  /**
   * 模拟导入处理进度
   */
  simulateImport(vm: any, isReset?: boolean) {
    let percent = 1;
    if (isReset) {
      clearInterval(vm.percentInterval);
      // 进度重置为0
      vm.importPercent = 0;
    } else {
      // const interval = setInterval(() => {
      vm.percentInterval = setInterval(() => {
        if (!vm.isImportEnd) {
          if (percent <= 90) {
            percent += this.random(5);
            vm.importPercent = percent;
          }
        } else {
          clearInterval(vm.percentInterval);
          // 进度重置为0
          vm.importPercent = 0;
        }
      }, 3000);
    }
  },

  /**
   * 产生随机整数
   */
  random(num: number) {
    return Math.ceil(Math.random() * 5);
  },

  /*
   * 导出列表
   */
  async handleExportData(vm: any, data: any, appendParam: any) {
    // const loading = vm.$message.loading(
    //   vm.$t("cloudpivot.list.pc.ExportLoading"),
    //   0
    // );

    const params: any = vm.queryParamsFormater();

    // utils.downloadFileByPost('/api/runtime/query/export_data', params);
    console.log('selectData', data);
    // 导出的数据项参数
    params.columns = data;

    // 20190604 导出一选中的项 isChecked
    params.objectIds = [];

    vm.checkeds.forEach((c: boolean, index: number) => {
      if (c) {
        params.objectIds.push(vm.dataSource[index].id);
      }
    });

    // 导出时传出所有的objectId
    params.allObjectId = [];

    vm.checkeds.forEach((c: boolean, index: number) => {
      params.allObjectId.push(vm.dataSource[index].id);
    });

    // 没有勾选，导出全部
    if (params.objectIds.length <= 0) {
      params.size = 0;
    }

    params.queryCondition = [vm.queryCondition];

    params.languageType = localStorage.getItem('locale') || 'zh';
    Object.assign(params, appendParam);
    console.log(JSON.stringify(params));
    let result = '';
    const res = await listApi.exportAsyncData(params);
    if (res.errcode !== 0) {
      vm.$message.error(vm.$t('cloudpivot.list.pc.ExportFailure'));
      result = '';
    } else {
      result = res.data.id;
    }
    // 导出结果: 因为是文件形式, 也会触发下载, 所以返回简单 true/false 即可?

    // if (res.errcode && res.errcode !== 0) {

    // } else {
    //   loading();
    //   const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
    //   const date = new Date();
    //   const mounth = date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    //   const days = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    //   const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
    //   const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
    //   const seconds = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;

    //   const stamp = `${date.getFullYear()}${mounth}${days}${hours}${minutes}${seconds}`;
    //   const fileName = `${vm.applicationPageTitle}导出${stamp}.xlsx`;

    //   if ((window as any).navigator.msSaveOrOpenBlob) {
    //     navigator.msSaveBlob(blob, fileName);
    //   } else {
    //     const a = document.createElement('a');
    //     const url = URL.createObjectURL(blob);
    //     a.download = fileName;
    //     a.href = url;
    //     a.click();
    //     URL.revokeObjectURL(url);
    //   }
    //   result = true;
    // }

    return result;
  },
  /*
   * 批量打印from表单
   */
  async handlePrintForm(vm: any, codeTemp: string) {
    const { schemaCode } = vm.$route.params;
    const queryCode = vm.curQueryListInfo.code;

    const sheetCode = codeTemp;

    const { data, errcode, errmsg } = await formApi.getPrintAttributesJson({
      sheetCode,
      schemaCode,
    });
    if (errcode !== 0) {
      vm.$message.error(errmsg, 3);
      return;
    }

    let _ids: string[] = [];
    const allObjectIds: any = [];
    vm.checkeds.forEach((c: boolean, index: number) => {
      if (c) {
        _ids.push(vm.dataSource[index].id);
      }
      allObjectIds.push(vm.dataSource[index].id);
    });
    // 如果当前未勾选任何数据，默认全部生成
    if (_ids.length === 0) {
      _ids = allObjectIds;
    }

    // if (_ids.length >= 10) {
    //   vm.$message.warning(
    //     vm.$t("cloudpivot.list.pc.printformTips", {
    //       size: 10,
    //     }),
    //     4
    //   );
    //   return false;
    // }
    const printHtmlCloseLoading = (vm.$message as any).loading(
      vm.$t('cloudpivot.list.pc.loading').toString(),
      0,
    );
    const list = await this.loopLoadInterface(_ids, schemaCode, queryCode);
    if (!list.arr) {
      vm.$message.error(list.errmsg, 4);
      return;
    }
    printFormCode.printBatchForm(vm, list, sheetCode, printHtmlCloseLoading);
  },
  async loopLoadInterface(
    _ids: string[],
    schemaCode: string,
    queryCode: string,
  ) {
    let arr: any = null;
    let errmsg: string = '';
    const params = {
      objectIds: _ids,
      schemaCode: schemaCode,
      queryCode,
    };
    await listApi.getLoadData(params).then((res: any) => {
      if (res.data && !res.errcode) {
        arr = res.data;
      } else {
        errmsg = res.errmsg;
      }
    });
    if (!arr) {
      return { errmsg };
    }
    const changeArr = arr.map((i: any) => {
      return dataFormChange.initSystemForm(i);
    });
    return { arr, changeArr };
  },
  /*
   * 试题库选题
   */
  paperForm(localHref, index, vm) {
    let obj: any = {};
    obj['paperId'] = localHref;
    obj['questionTitle'] = vm.dataSource[index].questionTitle;
    obj['questionType'] = vm.dataSource[index].questionType;
    obj['scoreNum'] = vm.dataSource[index].scoreNum
      ? vm.dataSource[index].scoreNum
      : 0;
    obj['orderNum'] = vm.dataSource[index].orderNum
      ? vm.dataSource[index].orderNum
      : 0;
    obj['paperOptionList'] = [];
    obj['isForbidden'] = vm.dataSource[index].isForbidden;
    vm.dataSource[index].optionList.forEach((ele) => {
      let newObj = {};
      newObj['describes'] = ele.describes;
      newObj['isTrue'] = ele.isTrue === '是' ? 1 : 0;
      newObj['optionCode'] = ele.optionCode;
      obj['paperOptionList'].push(newObj);
    });
    return obj;
  },
};
