<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="table-import"
    :class="{
      'not-full-screen': shrinkImportModal && !importReportsVisible,
    }"
  >
    <a-modal
      :maskClosable="false"
      :title="
        isWorkflowImport
          ? $t('cloudpivot.list.pc.ImportWorkflow')
          : $t('cloudpivot.list.pc.ImportData')
      "
      :visible="!shrinkImportModal"
      width="640px"
      centered
      :wrapClassName="wrapClassName"
      :zIndex="998"
      @cancel="handleCancel"
    >
      <div>
        <!--导入弹窗组件-->
        <ImportInput
          v-if="importInputShow"
          ref="importInput"
          :dataItems="dataItems"
          :isFormSheet="isFormSheet"
          :modelInfo="modelInfo"
          :queryCode="queryCode"
          :isWorkflowImport="isWorkflowImport"
          @resetUpLoad="reupload"
          @setCoverCode="setCoverCode"
          @setImportAble="setImportAble"
          @uploadComplete="uploadComplete"
          @exportTemplate="exportTemplate"
        />

        <!--校验状态 错误信息码-->
        <!--        <ValidateStatus-->
        <!--          :isFormSheet="isFormSheet"-->
        <!--          :modelInfo="modelInfo"-->
        <!--          @reupload="reupload"-->
        <!--          @success="dataImport"-->
        <!--          ref="validateStatus"-->
        <!--          v-if="validateStatusShow"-->
        <!--        />-->

        <!--导入状态-->
        <template>
          <img src="./img/import-status.svg" style="display: none" />
          <ImportStatus
            v-if="importStatusShow"
            ref="importStatus"
            :isFormSheet="isFormSheet"
            :queryCode="queryCode"
            :schemaCode="modelInfo.schemaCode"
            :statusParams="statusParams"
            :taskId="taskId"
            @reupload="reupload"
            @setRenderData="setRenderData"
            @shrinkWindow="shrinkWindow"
            @exportTemplate="exportTemplate"
            @downloadErrorFile="onDownloadErrorFile"
          />
        </template>
      </div>

      <template slot="footer">
        <div class="import-table-footer">
          <div class="import-history" @click="setImportReportsVisible(true)">
            <span
              class="icon aufontAll h-icon-all-Components_Timeselector"
            ></span>
            <a-popover
              v-if="importPopVisible"
              :defaultVisible="true"
              overlayClassName="import-tip-pop"
              trigger="click"
            >
              <template slot="content">
                <img src="./img/bigLight.png" />
                {{ $t('cloudpivot.list.pc.importRecord.importRecordTips') }}
              </template>
              {{ $t('cloudpivot.list.pc.importRecord.importRecords') }}
            </a-popover>
            <span v-else>
              {{ $t('cloudpivot.list.pc.importRecord.importRecords') }}
            </span>
          </div>
          <div class="button-list">
            <a-button @click="handleCancel">
              {{ $t('cloudpivot.list.pc.Cancel') }}
            </a-button>
            <a-button
              :disabled="forbiddenImport"
              type="primary"
              @click="handleImport"
            >
              {{ $t('cloudpivot.list.pc.Import') }}
            </a-button>
          </div>
        </div>
      </template>
    </a-modal>

    <BigDialog
      :title="$t('cloudpivot.list.pc.importRecord.importRecords')"
      :show="importReportsVisible"
      @cancel="setImportReportsVisible(false)"
    >
      <import-reports
        @successImport="successImport"
        @exportTemplate="exportTemplate"
        @modifyData="modifyData"
        @downloadErrorFile="onDownloadErrorFile"
      />
    </BigDialog>

    <import-reports-simple
      :show="shrinkImportModal"
      @successImport="successImport"
      @jump="jumpToReports"
      @close="closeReportsSimple"
      @downloadErrorFile="onDownloadErrorFile"
    />
  </div>
</template>
<script lang="ts">
import { Button, Modal } from '@h3/antd-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { listApi, listParams } from 'cloudpivot/api';
import ImportInput from './import-input.vue';
import ImportStatus from './import-status.vue';
import ValidateStatus from './import-validate-status.vue';
import BigDialog from 'cloudpivot/common/src/components/shared/bigDialog.vue';
import ImportReports from './import-reports.vue';
import ImportReportsSimple from './import-reports-simple.vue';
import { namespace } from 'vuex-class';

const WorkflowCenterModule = namespace('WorkflowCenter/WorkflowCenter');

@Component({
  components: {
    AModal: Modal,
    AButton: Button,
    ImportStatus,
    ImportInput,
    ValidateStatus,
    BigDialog,
    ImportReports,
    ImportReportsSimple,
  },
})
export default class Import extends Vue {
  @Prop()
  isFormSheet!: any;

  @Prop({
    type: String,
    required: true,
  })
  schemaCode!: string;

  @Prop({
    type: String,
  })
  queryCode!: string;

  @Prop()
  isWorkflowImport!: boolean;

  @Prop()
  statusParams!: any;

  @Prop()
  visible!: any;

  @Prop()
  importData!: any;

  @WorkflowCenterModule.State('applicationPageTitle') applicationPageTitle: any;

  @WorkflowCenterModule.State('applicationPageTitleI18n')
  applicationPageTitleI18n: any;

  @WorkflowCenterModule.State('shrinkImportModal')
  shrinkImportModal: any;

  @WorkflowCenterModule.Mutation('setShrinkImportModal')
  setShrinkImportModal: any;

  showDataFix = false;

  dataItems: any[] = [];

  dataList: any[] = [];

  // 控制弹框显示内容
  importInputShow = true;

  importStatusShow = false;

  validateStatusShow = false;

  uploadCompleteStatus = false; // 是否有文件

  coverStatus = false; // 是否覆盖

  coverCode = false; // 覆盖字段

  // 模型基础信息
  appCode = this.queryCode;

  // bizGroupCode = '';

  // bizModuleCode = '';

  inputData: any = {};

  interval: any = null;

  importReportsVisible: any = false;

  // renderData: any = []; // 导入成功后用来渲染数据

  importPopVisible: boolean = false;

  taskId: string = ''; //点击导入按钮后服务器生成的导入任务的id

  originalFileName: string = ''; //初始文件名称

  static typeOf(obj: any): string {
    return Object.prototype.toString
      .call(obj)
      .split(' ')[1]
      .toLocaleLowerCase()
      .slice(0, -1);
  }

  get modelInfo() {
    return {
      appCode: this.appCode,
      // bizGroupCode: this.bizGroupCode,
      // bizModuleCode: this.bizModuleCode,
      schemaCode: this.schemaCode,
    };
  }

  get forbiddenImport() {
    if (this.uploadCompleteStatus && this.coverStatus && this.coverCode) {
      return false;
    } else if (
      this.uploadCompleteStatus &&
      !this.coverStatus &&
      this.coverCode
    ) {
      return false;
    } else if (
      this.uploadCompleteStatus &&
      !this.coverStatus &&
      !this.coverCode
    ) {
      return false;
    } else {
      //Else Empty block statement
    }
    return true;
  }

  reupload() {
    this.importInputShow = true;
    this.importStatusShow = false;
    this.validateStatusShow = false;
    this.taskId = '';
    this.showDataFix = false;
    this.uploadCompleteStatus = false;
    this.$emit('reset');
  }

  // 判断是否有覆盖字段 禁止导入
  setImportAble(val: boolean) {
    this.coverStatus = val;
  }

  setCoverCode(code: any) {
    if (!code) {
      this.coverCode = false;
    } else {
      this.coverCode = code;
    }
  }

  // 导入成功后的渲染
  setRenderData(data: any) {
    this.$emit('setData', data);
    this.$emit('close');
  }

  // 上传完成
  uploadComplete(val: boolean) {
    this.uploadCompleteStatus = val;
  }

  // 取消修正数据重新导入
  closeDataFix() {
    this.reupload();
  }

  created() {}

  handleCancel() {
    this.uploadCompleteStatus = false;
    this.coverStatus = false;
    this.coverCode = false;
    this.$emit('close');
  }

  // 导入文件
  handleImport() {
    this.dataImport();
  }

  // 重置数据
  resetData(data: any) {
    this.dataList = data;
  }

  // 修正后导入
  handleImportFixed(data: any) {
    this.validateStatusShow = false;
    this.showDataFix = false;
    this.importStatusShow = true;
    this.$nextTick(() => {
      // this.renderData = data;
      // NOTE: 这里导入时传送的数据格式需要精简下，减少无用的数据传输
      // const params = data;
      const params = data.map((row: any[]) => {
        return row.map((item: any) => ({
          value: item.value,
          propertyCode: item.propertyCode,
          propertyName: item.propertyName,
          subModelRecords: item.subModelRecords,
        }));
      });
    });
  }

  handleProgress(taskId?: string) {
    this.interval = setInterval(() => {
      this.getImportProgress(taskId);
    }, 5000);
    //设置定时任务5分钟;

    setTimeout(() => {
      if (this.interval) {
        clearInterval(this.interval);
        this.$message.error('连接超时');
      }
    }, 300000);
  }

  async getImportProgress(taskId?: string) {
    const res = await listApi.getImportingProgress({ taskId });
    if (res.errcode === 0) {
      if (res.data.operationResult) {
        clearInterval(this.interval);
        this.interval = false;
        this.$emit('importEnd', res.data);
      }
    }
  }

  // 校验成功后导入
  dataImport() {
    const importInput: any = this.$refs.importInput as ImportInput;
    if (importInput) {
      this.importInputShow = false;
      this.importStatusShow = true;
      this.validateStatusShow = false;
      this.originalFileName = importInput.file.name;
      this.$nextTick(() => {
        const importStatus: any = this.$refs.importStatus as ImportStatus;
        const data: any = importInput.getTheData();
        //  导入
        const params: listParams.ImportParams = {
          fileName: data.file,
          originalFilename: this.originalFileName,
          schemaCode: this.schemaCode,
          queryCode: this.queryCode,
          queryField: this.coverCode,
          languageType: (this as any).$i18n.locale,
        };
        listApi
          .importData(params)
          .then((res: any) => {
            if (res.errcode !== 0) {
              const msg: any = res.errmsg;
              importStatus.setSate('fail', 0, 0, [], msg);
            } else {
              this.taskId = res.data.taskId || '';
              this.handleProgress(this.taskId);
            }
          })
          .catch(() => {
            importStatus.setSate('fail', 0, 0, [], '导入失败');
          });
      });
    }
  }

  setImportReportsVisible(visible: boolean) {
    this.importPopVisible = false;
    this.importReportsVisible = visible;
  }

  shrinkWindow() {
    clearInterval(this.interval);
    this.importStatusShow = false;
    this.importInputShow = true;
    this.uploadCompleteStatus = false;
    this.interval = false;
    const modelEl: any = document.querySelector(
      '.model-table-import .ant-modal',
    );
    modelEl.style.transformOrigin = 'calc(100vw - 8px) calc(100vh - 64px)';

    this.setShrinkImportModal({
      sign: true,
      taskId: this.taskId,
      fileName: this.originalFileName,
      percent: 80,
    });
  }

  jumpToReports() {
    this.importReportsVisible = true;
  }

  closeReportsSimple() {
    this.setShrinkImportModal(false);
    this.handleCancel();
  }

  get wrapClassName() {
    let result = 'model-table-import';
    if (this.importStatusShow) {
      result = result + ' hide-footer';
      if (
        this.statusParams &&
        this.statusParams.importStatus === listParams.ImportResult.Unspecified
      ) {
        result = result + ' hide-closeX';
      }
    }
    return result;
  }

  async exportTemplate() {
    const params = {
      schemaCode: this.schemaCode,
      queryCode: this.queryCode,
      languageType: (this as any).$i18n.locale,
    };
    const res = await listApi.exportTemplate(params);
    if ((res.errcode && res.errcode !== 0) || res.byteLength < 100) {
      this.$message.error(
        this.$t('cloudpivot.list.pc.DownloadFailed') as string,
      );
    } else {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
      const { date, mounth, days, hours, minutes, seconds } =
        this.generateDate();

      const fileNameEng = this.applicationPageTitleI18n
        ? typeof this.applicationPageTitleI18n === 'string'
          ? JSON.parse(this.applicationPageTitleI18n).en
          : this.applicationPageTitleI18n.en
        : this.applicationPageTitle;

      const stamp = `${date.getFullYear()}${mounth}${days}${hours}${minutes}${seconds}`;
      const fileName = this.isChinese
        ? `${this.applicationPageTitle}导入模板${stamp}.xlsx`
        : `${fileNameEng} import template ${stamp}.xlsx`;
      this.downloadFile(blob, fileName);
    }
  }

  generateDate() {
    const date = new Date();
    const mounth =
      date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const days = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
    const minutes =
      date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds =
      date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
    return {
      date,
      mounth,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  get isChinese() {
    return !(this.$i18n.locale && this.$i18n.locale === 'en');
  }

  modifyData(data) {
    this.$emit('modifyData', data);
  }

  downloadFile(blob: any, fileName: string) {
    if ((window as any).navigator.msSaveOrOpenBlob) {
      (navigator as any).msSaveBlob(blob, fileName);
    } else {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.download = fileName;
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  /**
   * 下载错误信息文档
   */
  async onDownloadErrorFile(importFileName?: any) {
    const res = await listApi.downErrorResult(
      importFileName || this.statusParams.importFileName,
    );
    if ((res.errcode && res.errcode !== 0) || res.byteLength < 100) {
      this.$message.error(
        this.$t('cloudpivot.list.pc.DownloadFailed') as string,
      );
    } else {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
      const fileName = `${
        this.applicationPageTitle
      }错误信息${this.getTime()}.xlsx`;

      this.downloadFile(blob, fileName);
    }
  }

  getTime() {
    const date = new Date();
    const mounth =
      date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const days = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
    const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
    const minutes =
      date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
    const seconds =
      date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;

    const stamp = `${date.getFullYear()}${mounth}${days}${hours}${minutes}${seconds}`;
    return stamp;
  }

  mounted() {
    setTimeout(() => {
      if (localStorage.getItem('importPopVisible')) {
        this.importPopVisible = false;
      } else {
        localStorage.setItem('importPopVisible', 'true');
        this.importPopVisible = true;
      }
    }, 500);
  }

  successImport() {
    this.$emit('refreshList');
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.table-import {
  &.not-full-screen {
    position: fixed;
    right: 8px;
    bottom: 64px;
    z-index: 10;
  }
}
/deep/.model-table-import {
  &.hide-footer {
    .ant-modal-footer {
      display: none;
    }
  }
  &.hide-closeX {
    .ant-modal-close-x {
      display: none;
    }
  }

  .ant-modal {
    padding-bottom: 0px;
  }
  .ant-modal-content {
    background: #ffffff;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
  }
  .ant-modal-header {
    border-bottom: none;
    padding: 24px;
    .ant-modal-title {
      height: 24px;
      font-size: 16px;
      font-weight: 600;
      color: #111218;
      line-height: 24px;
    }
  }
  .ant-modal-close-x {
    width: 57px;
    height: 72px;
    line-height: 72px;
  }
  .ant-modal-footer {
    border-top: none;
    padding: 24px;
    .ant-btn:not(:disabled) {
      height: 32px;
      > span {
        height: 22px;
        font-size: 14px;
        line-height: 22px;
      }
    }
    .import-table-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .import-history {
        font-size: 14px;
        font-weight: 400;
        color: @highlightColor;
        cursor: pointer;
        .icon {
          font-size: 14px;
        }
      }
    }
  }
  .ant-modal-body {
    padding-top: 0;
    padding-bottom: 16px;
  }

  .ant-modal-footer .ant-btn-primary:disabled {
    height: 32px;
    background: #f1f2f6;
    border-color: #d4d5d6;
    > span {
      height: 22px;
      font-size: 14px;
      color: rgba(17, 18, 24, 0.25);
      line-height: 22px;
    }
  }
}
</style>

<style lang="less">
.import-tip-pop {
  .ant-popover-arrow {
    display: block;
  }
  .ant-popover-inner-content {
    img {
      height: 18px;
      vertical-align: top;
    }
  }
}
</style>
