<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->

<template>
  <a-modal
    :visible="isShow"
    :title="modalTitle"
    :keyboard="false"
    :cancelText="'取消'"
    :okText="'确定'"
    :footer="null"
    class="edit-page-info"
    :destroyOnClose="true"
    :width="'480px'"
    @cancel="onClose"
    @ok="submit"
  >
    <div v-if="!type" class="create-tips">{{ createTips }}</div>
    <a-form-model
      ref="pageForm"
      :model="pageData"
      :rules="rules"
      layout="vertical"
      class="page-edit-box"
    >
      <a-form-model-item :label="'页面标题'" prop="name" :required="true">
        <a-input v-model="pageData.name" placeholder="请输入标题" />
      </a-form-model-item>
      <a-form-model-item :label="'页面编码'" prop="code" :required="true">
        <a-input
          v-model="pageData.code"
          placeholder="请输入编码"
          :disabled="!!type"
        />
      </a-form-model-item>
      <div class="page-edit-box-footer">
        <a-form-model-item class="model-item-btn">
          <a-button style="margin-right: 8px" @click="onClose"> 取消 </a-button>
          <a-button type="primary" @click="submitForm"> 确定 </a-button>
        </a-form-model-item>
      </div>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal, FormModel, Input, Button } from '@h3/antd-vue';
import {
  bizModelNameValidator,
  pattern,
} from 'cloudpivot-admin-core/src/common/utils';
import { namespace } from 'vuex-class';

const PortalDesignModule = namespace('PortalDesign');

@Component({
  name: 'edit-page',
  components: {
    AModal: Modal,
    AFormModel: FormModel,
    AFormModelItem: FormModel.Item,
    AInput: Input,
    AButton: Button,
  },
})
export default class EditPage extends Vue {
  @PortalDesignModule.Action('savePage') savePage: any;

  @PortalDesignModule.Action('createPage') createPage: any;

  @Prop() value!: any;

  @Prop() type!: number; // 0：新增，1：编辑

  @Prop() thePageData: any;

  // 显示控制
  isShow: boolean = false;

  modalTitle: string = '新建页面';

  createTips: string = '新建的页面，将沿用工作台的全局导航';

  pageData: any = {
    appCode: undefined,
    code: undefined,
    createdBy: undefined,
    createdTime: undefined,
    deleted: false,
    draftPortalJson: undefined,
    id: undefined,
    modifiedBy: undefined,
    modifiedTime: undefined,
    name: undefined,
    published: false,
    publishedPortalJson: undefined,
    remarks: undefined,
    status: undefined,
    type: undefined,
  };

  rules: any = {};

  @Watch('value')
  onValueChange(v) {
    this.isShow = v;
    if (!v) {
      return;
    }
    if (this.type === 1) {
      this.pageData = Object.assign(this.pageData, this.thePageData);
      this.modalTitle = '修改页面信息';
    } else {
      this.resetData();
      this.modalTitle = '新建页面';
    }
  }

  beforeMount() {
    this.setRules();
  }

  /**
   * 自定义表单验证
   */
  setRules() {
    this.rules = {
      name: [
        {
          required: true,
          message: '请输入页面标题',
        },
        {
          validator: bizModelNameValidator,
          message: this.$t('languages.Apps.BizModelNameRule'),
        },
      ],
      code: [
        {
          required: true,
          message: '请输入页面编码',
        },
        {
          pattern: pattern('modelcode'),
          message: this.$t('languages.Apps.ModelCodeRule'),
        },
      ],
    };
  }

  resetData() {
    this.pageData = {
      appCode: undefined,
      code: undefined,
      createdBy: undefined,
      createdTime: undefined,
      deleted: false,
      draftPortalJson: undefined,
      id: undefined,
      modifiedBy: undefined,
      modifiedTime: undefined,
      name: undefined,
      published: false,
      publishedPortalJson: undefined,
      remarks: undefined,
      status: undefined,
      type: undefined,
    };
  }

  // 抽屉关闭事件
  onClose() {
    this.resetData();
    this.$emit('input', false);
  }

  submitForm() {
    const pageForm: any = this.$refs['pageForm'];
    pageForm.validate((valid) => {
      if (valid) {
        this.savePageInfo(this.pageData);
      } else {
        return false;
      }
    });
  }

  submit() {
    this.$emit('savePage', this.pageData);
    this.onClose();
  }

  savePageInfo(val) {
    if (this.type === 1) {
      this.savePage(val).then((res) => {
        if (res.errcode === 0) {
          this.$message.success('编辑成功');
          this.$emit('savePage', { type: this.type, pageValue: res.data });
          this.onClose();
          // this.loadPageList({
          //   type: this.pageType,
          // });
        } else {
          this.$message.error(res.errmsg || '编辑失败');
        }
      });
    } else {
      this.createPage(val).then((res) => {
        if (res.errcode === 0) {
          this.$emit('savePage', { type: this.type, pageValue: res.data });
          this.onClose();
        } else {
          this.$message.error(res.errmsg || '新建失败');
        }
        // this.goToPage(val);
      });
    }
  }
}
</script>

<style lang="less" scoped>
.edit-page-info {
  position: relative;
  .create-tips {
    position: absolute;
    top: 29px;
    left: 96px;
    height: 14px;
    font-size: 10px;
    font-weight: 400;
    color: rgba(17, 18, 24, 0.5);
    line-height: 14px;
  }
  .page-edit-box {
    /deep/.ant-form-item {
      margin-bottom: 0;
      & + .ant-form-item {
        margin-top: 10px;
      }
      &:last-child {
        margin-top: 64px;
        padding: 24px 0;
      }
      .ant-form-item-label {
        padding-bottom: 6px;
        & > label {
          height: 20px;
          font-size: 14px;
          font-weight: 400;
          color: #111218;
          line-height: 20px;
        }
      }
      .ant-form-item-required {
        &::before {
          display: none;
        }
        &::after {
          display: inline-block;
          margin-left: 2px;
          color: #f5222d;
          font-size: 14px;
          font-family: SimSun, sans-serif;
          line-height: 1;
          content: '*';
        }
      }
      .ant-input-disabled {
        height: 32px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(17, 18, 24, 0.25);
        line-height: 32px;
      }
    }
  }

  /deep/.ant-modal-close-x {
    width: 57px !important;
    height: 72px !important;
    line-height: 72px !important;
    svg {
      display: none;
    }
    // height: 54px;
    // width: 54px;
    line-height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      i {
        color: rgba(17, 18, 24, 0.5);
      }
    }
    i {
      width: 16px;
      height: 16px;
      font-family: 'aufontAll' !important;
      font-size: 16px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: rgba(17, 18, 24, 0.5);
      display: flex;
      align-items: center;
      &::after {
        content: '\e996';
      }
    }
  }
}
.model-item-btn {
  display: flex;
  justify-content: flex-end;
  padding: 24px 0;
}
</style>
