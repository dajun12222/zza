<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <FileValidateTemplate :importVM="_self">
    <ErrorMessage slot="error-message" :errorParam="errorParam" />
    <UpdateCode slot="update-code" ref="updateCode" :list="updateList" />
  </FileValidateTemplate>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import MixinValidate from '../../../../../components/global/modal/import/mixins/file-validate';
import serviceApi from '../../../../..//apis/biz-service/service.api';
import FileValidateTemplate from '../../../../../components/global/modal/import/templates/file-validate-template.vue';
import ErrorMessage from './error-message.vue';
import UpdateCode from './update-code.vue';
@Component({
  name: 'FileValidate',
  components: {
    FileValidateTemplate,
    ErrorMessage,
    UpdateCode,
  },
})
export default class FileValidate extends mixins(MixinValidate) {
  serviceCodes: any[] = [];

  /**
   * 校验文件
   * */
  async checkApp() {
    if (this.serviceCodes && this.serviceCodes.length) {
      const DataSource: any[] = [];
      this.serviceCodes.forEach((item) => {
        if (item.newCode && item.newCode.replace(/\s*/g, '')) {
          DataSource.push(item.newCode);
        }
      });

      if (DataSource.length < this.serviceCodes.length) {
        (this as any).$message.error('请输入有效的新编码!');
        return true;
      }

      if (new Set(DataSource).size !== DataSource.length) {
        (this as any).$message.error('请勿填写重复编码!');
        return true;
      }
    }

    const { fileName, modifyServiceCodes } = this;

    const params: any = {
      fileName,
      overWrite: false,
      modifyServiceCodes,
    };

    this.isValidated = false;
    const tempShowUpdateCode = this.isShowUpdateCode;
    this.isShowUpdateCode = false;
    const res: any = await serviceApi.checkService(params);
    this.isValidated = true;

    const { errcode, data, errmsg } = res;

    if (errcode === 0) {
      this.serviceCodes = data.modifyServiceCodes.map((item) => {
        return {
          groupName: item.groupName,
          isRepeated: item.isRepeated,
          newCode: item.newServiceCode,
          oldCode: item.oldServiceCode,
          serviceName: item.serviceName,
        };
      });

      if (tempShowUpdateCode) {
        this.serviceCodes.forEach((item) => {
          item.isShow = item.isRepeated;
        });
      }

      this.fileInvalid = this.serviceCodes.some((item) => item.isRepeated);
      this.isFileOk = true;
      return this.fileInvalid;
    } else {
      this.isFileOk = false;
      return true;
    }
  }

  get errorParam() {
    const {
      isFileOk,
      fileInvalid,
      isShowUpdateCode,
      fileErrMsg,
      coreRepeatErrMsg,
    } = this;
    return {
      isFileOk,
      fileInvalid,
      isShowUpdateCode,
      fileErrMsg,
      coreRepeatErrMsg,
    };
  }

  get updateList() {
    return this.serviceCodes;
  }

  get modifyServiceCodes() {
    return this.serviceCodes.map((item) => {
      return {
        newServiceCode: item.newCode || '',
        oldServiceCode: item.oldCode,
      };
    });
  }

  get validResult() {
    return {
      modifyServiceCodes: this.modifyServiceCodes,
    };
  }
}
</script>

<style lang="less"></style>
