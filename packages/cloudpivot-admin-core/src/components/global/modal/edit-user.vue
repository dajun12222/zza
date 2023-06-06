<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-modal
    v-model="showEditUser"
    :title="$t('languages.Password.ChangePwd')"
    :width="422"
    :cancelText="$t('languages.Cancel')"
    :okText="$t('languages.Ok')"
    :maskClosable="false"
    @ok="editUser"
    @cancel="closeModel"
  >
    <a-form-model
      ref="ruleForm"
      :model="ruleForm"
      layout="horizontal"
      labelAlign="left"
      :rules="rules"
    >
      <a-form-model-item
        class="oldPwd"
        hasFeedback
        :label="$t('languages.Password.OldPwd')"
        prop="oldPwd"
        :required="true"
      >
        <a-input
          v-model="ruleForm.oldPwd"
          type="password"
          autocomplete="off"
          :placeholder="$t('languages.Password.PleaseInputOldPwd')"
        />
      </a-form-model-item>
      <a-form-model-item
        class="newPwd"
        hasFeedback
        :label="$t('languages.Password.ChangePwd')"
        :required="true"
        prop="newPwd"
      >
        <a-input
          v-model="ruleForm.newPwd"
          type="password"
          autocomplete="off"
          :placeholder="$t('languages.Password.PleaseInputNewPwd')"
          @change="newPwdChange"
        />
      </a-form-model-item>
      <a-form-model-item
        class="surePwd"
        :class="hasDiff ? 'has-error' : ''"
        hasFeedback
        :label="$t('languages.Password.SurePwd')"
        prop="surePwd"
        :required="true"
      >
        <a-input
          v-model="ruleForm.surePwd"
          type="password"
          autocomplete="off"
          :placeholder="$t('languages.Password.InputNewPwdAgain')"
          @change="surePwdChange"
        />
        <span v-if="hasDiff" class="error-icon">
          <a-icon type="close-circle" theme="filled" />
        </span>
        <div v-if="hasDiff" class="ant-form-explain mock">
          {{ $t('languages.common.passwordErrorTips6') }}
        </div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as OrganizationApi from 'cloudpivot-admin-core/src/apis/organization';
import { Form, Input, Modal, FormModel, Icon } from '@h3/antd-vue';
import OAuthApi from 'cloudpivot-admin-core/src/apis/oauth';
import common from 'cloudpivot/common';

@Component({
  name: 'eidt-user',
  components: {
    AModal: Modal,
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AFormModel: FormModel,
    AFormModelItem: FormModel.Item,
    AIcon: Icon,
  },
})
export default class EditUser extends Vue {
  @Prop() value!: boolean;

  form: any = {};

  showEditUser: boolean = false;

  oldPwdError: boolean = false;

  showError: boolean = false;

  formItemLayout: any = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 19,
    },
  };

  rules: any = {};

  ruleForm: any = {
    oldPwd: '',
    newPwd: '',
    surePwd: '',
  };

  beforeMount() {
    this.setRules();
  }

  setRules() {
    this.rules = {
      oldPwd: [{ validator: this.oldPwd, trigger: 'change' }],
      newPwd: [{ validator: this.newPwd, trigger: 'change' }],
      surePwd: [{ validator: this.surePwd, trigger: 'change' }],
    };
  }

  editUser() {
    if (this.hasDiff) {
      return;
    }
    const ruleForm: any = this.$refs['ruleForm'];
    const vm: any = this;
    ruleForm.validate(async (valid) => {
      if (valid) {
        // rsa加密
        const result = await OAuthApi.getRsaKey();
        const flag: boolean =
          typeof result === 'object' &&
          result.hasOwnProperty('index') &&
          result.hasOwnProperty('key');
        if (!flag) {
          return;
        }
        const { index, key } = result;
        const oldPassword: any = common.utils.RsaEncrypt(
          this.ruleForm.oldPwd,
          key,
        );
        const newPassword: any = common.utils.RsaEncrypt(
          this.ruleForm.newPwd,
          key,
        );
        const params = {
          username: 'admin',
          index,
          oldPassword,
          newPassword,
        };
        // rsa加密结束
        // const params = {
        //   username: 'admin',
        //   oldPassword: this.ruleForm.oldPwd,
        //   newPassword: this.ruleForm.newPwd,
        // };
        // OAuthApi.changePassword(params)
        OrganizationApi.modifyPassword(params).then((res) => {
          if (res.errcode === 0) {
            this.oldPwdError = false;
            this.$message.success(
              `${this.$t('languages.Password.ChangePwdSuccess')}`,
            );
            this.closeModel();
          } else if (res.errcode === 201019) {
            this.oldPwdError = true;
          } else if (res.errcode === 201020) {
            this.$message.error(
              `${this.$t('languages.Password.CanNotSamePwd')}`,
            );
          } else {
            //Else Empty block statement
          }
        });
      }
    });
  }

  closeModel() {
    this.$emit('input', false);
    this.form.resetFields();
    this.showError = false;
    this.oldPwdError = false;
  }

  @Watch('value')
  onValueChange(v: boolean) {
    this.showEditUser = v;
  }

  oldPwd(rule, value, callback) {
    if (value === '') {
      callback(new Error(`${this.$t('languages.common.passwordErrorTips1')}`));
    } else if (/[\u4e00-\u9fa5\s]/.test(value)) {
      // eslint-disable-next-line standard/no-callback-literal
      callback('密码中不能包含汉字和空格');
    } else {
      callback();
    }
  }

  newPwd(rule, value, callback) {
    if (value === '') {
      callback(new Error(`${this.$t('languages.common.passwordErrorTips2')}`));
    } else if (/[\u4e00-\u9fa5\s]/.test(value)) {
      // eslint-disable-next-line standard/no-callback-literal
      callback('密码中不能包含汉字和空格');
    } else if (
      value.length < 12 ||
      value.length > 14 ||
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[^\u4e00-\u9fa5\s]{12,14}$/.test(value)
    ) {
      callback(new Error(`${this.$t('languages.common.passwordErrorTips3')}`));
    } else if (value === this.ruleForm.oldPwd) {
      callback(new Error(`${this.$t('languages.common.passwordErrorTips4')}`));
    } else {
      callback();
    }
  }

  hasDiff: boolean = false;

  newPwdChange() {
    if (
      this.ruleForm.surePwd &&
      this.ruleForm.newPwd !== this.ruleForm.surePwd
    ) {
      this.hasDiff = true;
    } else {
      this.hasDiff = false;
    }
  }

  surePwd(rule, value, callback) {
    if (value === '') {
      callback(new Error(`${this.$t('languages.common.passwordErrorTips5')}`));
    } else {
      callback();
    }
  }

  surePwdChange() {
    if (
      this.ruleForm.surePwd &&
      this.ruleForm.newPwd !== this.ruleForm.surePwd
    ) {
      this.hasDiff = true;
    } else {
      this.hasDiff = false;
    }
  }
}
</script>
<style lang="less" scoped>
.err-form {
  .error-tip {
    color: #f4454e;
    font-size: 12px;
    margin-top: 2px;
  }
  .err-input {
    border-color: #f4454e;
    &:focus {
      border-color: #ff7073;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(244, 69, 78, 0.2);
      border-right-width: 1px !important;
    }
    &:hover {
      border-color: #f4454e;
    }
  }
  /deep/.ant-form-explain {
    display: none;
  }
}

.oldPwd {
  /deep/.has-success.has-feedback {
    span.ant-form-item-children-icon {
      display: none;
    }
  }
}
.surePwd.has-error {
  /deep/.has-feedback {
    span.ant-form-item-children-icon {
      display: none;
    }
  }
  .ant-form-explain.mock {
    position: absolute;
  }
  /deep/.ant-form-item-control .error-icon {
    position: absolute;
    top: calc(50% + 2px);
    right: 0;
    z-index: 1;
    width: 32px;
    height: 20px;
    margin-top: -10px;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    visibility: visible;
    pointer-events: none;
    color: #f4454e;
    animation-name: diffZoomIn2;
  }
}
.oldPwd,
.newPwd,
.surePwd {
  display: flex;
  /deep/.ant-form-item-label {
    width: 80px;
  }
  /deep/.ant-form-item-control-wrapper {
    width: calc(100% - 80px);
  }
}
</style>
