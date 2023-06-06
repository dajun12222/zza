<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <FileImportTemplate :importVM="_self" />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import * as FileValidateNS from 'cloudpivot-admin-core/src/typings/app-error';

import AppsApi from 'cloudpivot-admin-core/src/apis/apps';

import ImportStrategy from './importStrategy/importStrategy';

import { mixins } from 'vue-class-component';
import MixinImport from '../../../../components/global/modal/import/mixins/file-import';
import FileImportTemplate from '../../../../components/global/modal/import/templates/file-import-template.vue';

@Component({
  name: 'FileImport',
  components: {
    FileImportTemplate,
  },
})
export default class FileImport extends mixins(MixinImport) {
  @Prop() strategy!: ImportStrategy;

  importStatus: string = 'process'; // 导入状态

  errmsg: string = ''; // 导入状态

  @Watch('importStatus')
  onImportStatusChange(v: string) {
    switch (v) {
      case FileValidateNS.ImportStatus.Importing:
        this.importStatusTxt = this.$t('languages.Apps.Importing') as string;
        this.importHint = this.$t(
          'languages.Apps.NoCloseWindowUntillImportFinished',
        ) as string;
        break;
      case FileValidateNS.ImportStatus.ImportSuccess:
        this.importStatusTxt = this.$t(
          'languages.Apps.ImportSuccess',
        ) as string;
        this.importHint = this.$t(
          'languages.Apps.PlzRepublishDataModelAndProcess',
        ) as string;
        break;
      case FileValidateNS.ImportStatus.ImportError:
        this.importStatusTxt = this.$t('languages.Apps.ImportError') as string;
        this.importHint =
          this.errmsg ||
          (this.$t('languages.Apps.PlzReimportCauseNetworkError') as string);
        this.progressStatus = 'exception';
        break;
      default:
        break;
    }
  }

  handleCancel() {
    this.$emit('handleCancel');
  }

  /**
   * 直接导入
   */

  doImport(uploadResult, validResult) {
    this.importFile(
      validResult.schemaCode,
      uploadResult.fileName,
      validResult.coverAble,
      validResult.isImportDataRule,
    );
  }

  /**
   * 文件导入
   * @parms
   * fileName 文件名称
   * coverAble 是否覆盖
   * schemaCode 模型编码
   */

  importFile(
    schemaCode: string,
    fileName: string,
    coverAble: boolean,
    isImportDataRule: any,
  ) {
    // 进度条
    this.simulateImport();

    const params = this.strategy.generateImportParam({
      validResult: this.validResult,
      schemaCode,
      fileName,
      coverAble,
      uploadResult: this.uploadResult,
      isImportDataRule,
    });

    setTimeout(() => {
      AppsApi.import_package(params).then((importRes: any) => {
        this.isImportEnd = true;
        if (importRes.errcode === 0) {
          const { data } = importRes;
          if (data.result) {
            this.percent = 100;
            this.importStatus = FileValidateNS.ImportStatus.ImportSuccess;
            this.$emit('importEnd');
          } else {
            this.percent = 75;
            this.errmsg = importRes.errmsg;
            this.importStatus = FileValidateNS.ImportStatus.ImportError;
          }
        } else {
          this.percent = 75;
          this.errmsg = importRes.errmsg;
          this.importStatus = FileValidateNS.ImportStatus.ImportError;
        }
      });
      // this.isImportEnd = true;
    }, 5000);
  }
}
</script>

<style lang="less" scoped></style>
