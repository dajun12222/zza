<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <FileValidateTemplate :importVM="_self">
    <ErrorMessage slot="error-message" :errorParam="errorParam" />
    <UpdateCode
      slot="update-code"
      ref="updateCode"
      :isCode="isShowUpdateCode"
      :list="updateList"
    />
    <template slot="invalid-buttons">
      <template v-if="fileCodeInvalid">
        <!-- 修改编码对应footer -->
        <template v-if="isShowUpdateCode">
          <a-button @click="closeUpdateCode"> 返回 </a-button>
          <a-button type="primary" @click="saveAndReturn">
            保存并返回
          </a-button>
        </template>

        <template v-if="!isShowUpdateCode">
          <a-button @click="updateCode"> 修改编码 </a-button>
          <a-button type="primary" @click="coverAndImport"> 直接覆盖 </a-button>
        </template>
      </template>

      <template v-else-if="fileNameInvalid">
        <!-- 修改编码对应footer -->
        <template v-if="isShowUpdateName">
          <a-button @click="closeUpdateName"> 返回 </a-button>
          <a-button type="primary" @click="saveNameAndReturn">
            保存并返回
          </a-button>
        </template>

        <template v-if="!isShowUpdateName">
          <a-button type="primary" @click="showUpdateName"> 修改名称 </a-button>
        </template>
      </template>

      <template v-else>
        <a-button @click="prevStep"> 返回 </a-button>
        <a-button type="primary" @click="directImport"> 导入 </a-button>
      </template>
    </template>
  </FileValidateTemplate>
</template>

<script lang="ts">
import { Button } from '@h3/antd-vue';
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import UpdateCode from './update-code.vue';
import MixinValidate from '../../../../components/global/modal/import/mixins/file-validate';
import FileValidateTemplate from '../../../../components/global/modal/import/templates/file-validate-template.vue';
import ErrorMessage from './error-message.vue';
import dataDictionaryApi from 'cloudpivot-admin-core/src/apis/system/data-dictionary.api';

@Component({
  name: 'FileValidate',
  components: {
    AButton: Button,
    ErrorMessage,
    UpdateCode,
    FileValidateTemplate,
  },
})
export default class FileValidate extends mixins(MixinValidate) {
  serviceCodes: any[] = [];

  fileCodeInvalid: boolean = false;

  fileNameInvalid: boolean = false;

  isShowUpdateName: boolean = false;

  coreRepeatErrMsg: string = '数据字典编码已存在，是否要覆盖已有编码？';

  /**
   * 校验文件
   * */
  async checkApp() {
    //先校验本地输入的数据是否合法，如为空以及所有新编码有多个重复编码
    if (this.localCheck()) {
      return true;
    }

    const { fileName, modifiedCodes } = this;

    const params: any = {
      fileName: fileName,
      overWrite: false,
      modifiedCodes,
    };

    this.isValidated = false;
    const tempShowUpdateCode = this.isShowUpdateCode;
    const tempShowUpdateName = this.isShowUpdateName;
    this.isShowUpdateCode = false;
    this.isShowUpdateName = false;
    const res: any = await dataDictionaryApi.importCheck(params);
    this.isValidated = true;

    const { errcode, data, errmsg } = res;

    if (errcode === 0) {
      this.serviceCodes = data;

      this.fileCodeInvalid = this.serviceCodes.some(
        (item) => item.codeDuplication,
      );
      this.fileNameInvalid = this.serviceCodes.some(
        (item) => item.nameDuplication,
      );
      this.isFileOk = true;
      return (
        this.remoteCheckCode(tempShowUpdateCode) ||
        this.remoteCheckName(tempShowUpdateName)
      );
    } else {
      this.isFileOk = false;
      return true;
    }
  }

  get errorParam() {
    const {
      isFileOk,
      fileCodeInvalid,
      fileNameInvalid,
      isShowUpdateCode,
      isShowUpdateName,
      fileErrMsg,
      coreRepeatErrMsg,
    } = this;
    return {
      isFileOk,
      isShowUpdateCode,
      isShowUpdateName,
      fileCodeInvalid,
      fileNameInvalid,
      fileErrMsg,
      coreRepeatErrMsg,
    };
  }

  get updateList() {
    return this.serviceCodes;
  }

  get modifiedCodes() {
    return this.serviceCodes.map((item) => {
      return {
        name: item.name,
        newName: item.newName || '',
        code: item.code,
        newCode: item.newCode || '',
      };
    });
  }

  get validResult() {
    return {
      modifiedCodes: this.modifiedCodes,
    };
  }

  closeUpdateName() {
    this.$emit('resetTitle');
    this.isShowUpdateName = false;
  }

  showUpdateName() {
    this.serviceCodes.forEach(
      (item) => (item.newCode = item.newCode || item.code),
    );
    this.$emit('setModalTitle', '导入-修改名称');
    this.isShowUpdateName = true;
  }

  async saveNameAndReturn() {
    this.checkApp().then((res) => {
      if (res) {
        this.showUpdateName();
      }
    });
  }

  //调用后台校验接口前，先本地校验
  localCheck() {
    if (this.fileCodeInvalid) {
      return this.localCheckNewCode();
    } else if (this.fileNameInvalid) {
      return this.localCheckNewName();
    }
  }

  localCheckNewCode() {
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
  }

  localCheckNewName() {
    if (this.serviceCodes && this.serviceCodes.length) {
      const DataSource: any[] = [];
      this.serviceCodes.forEach((item) => {
        if (item.newName && item.newName.replace(/\s*/g, '')) {
          DataSource.push(item.newName);
        }
      });

      if (DataSource.length < this.serviceCodes.length) {
        (this as any).$message.error('请输入有效的新名称!');
        return true;
      }

      if (new Set(DataSource).size !== DataSource.length) {
        (this as any).$message.error('请勿填写重复名称!');
        return true;
      }
    }
  }

  remoteCheckCode(tempShowUpdateCode) {
    if (tempShowUpdateCode && this.fileCodeInvalid) {
      this.serviceCodes.forEach((item) => {
        if (item.codeDuplication) {
          item.isShow = true;
        }
      });
      this.$message.error('存在编码重复，请重修修改');
      return true;
    }
    return false;
  }

  remoteCheckName(tempShowUpdateName) {
    if (tempShowUpdateName && this.fileNameInvalid) {
      this.serviceCodes.forEach((item) => {
        if (item.nameDuplication) {
          item.isShow = true;
        }
      });
      this.$message.error('存在名称重复，请重修修改');
      return true;
    }
    return false;
  }

  get showUpdateCodeView() {
    return this.isShowUpdateName || this.isShowUpdateCode;
  }
}
</script>

<style lang="less"></style>
