<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-modal
    v-model="visible"
    :title="options.title"
    :maskClosable="false"
    :keyboard="false"
    :okText="$t('languages.common.ok')"
    :cancelText="$t('languages.common.cancel')"
    :destroyOnClose="true"
    wrapClassName="form-btn-modal"
    :class="modalClass"
    :width="width"
    @ok="ok"
  >
    <component
      :is="modal"
      ref="component"
      :options="options"
      @nodeOk="handleNextNodeOk"
    />
  </a-modal>
</template>

<script lang="ts">
import { Modal } from '@h3/antd-vue';
import { Component, Vue } from 'vue-property-decorator';
import { FormAction } from '../../form-action';
import {
  FormActionComponent,
  FormActionModalOptions,
} from '../../form-action-modal';
import FormDeptSelect from './form-dept-select.vue';
import FormForward from './form-forward.vue';
import EditOwner from './form-modify-owner.vue';
import FormNextNode from './form-next-node.vue';
import FormReject from './form-reject.vue';
import FormUrge from './form-urge/index.vue';
import FormAssist from './form-assist.vue';

@Component({
  name: 'form-reject-modal',
  components: {
    AModal: Modal,
    FormDeptSelect,
    FormReject,
    FormForward,
    FormUrge,
    EditOwner,
    FormNextNode,
    FormAssist,
  },
})
export default class FormActionModal extends Vue {
  // @Prop()
  options: FormActionModalOptions = {} as any;

  visible = false;

  modal = '';

  get modalClass() {
    return {
      'form-action-model_urge': this.modal === 'FormUrge',
      'form-action-model_common': !(this.modal === 'FormUrge'),
      'form-dept-select-model': this.modal === 'FormDeptSelect',
    };
  }

  show(opts: FormActionModalOptions) {
    this.options = opts;

    switch (opts.code) {
      case FormAction.ChangeNextNodeUser:
        this.modal = 'FormNextNode';
        break;
      case FormAction.Reject:
        this.modal = 'FormReject';
        break;
      case FormAction.Assist:
      case FormAction.Circulate:
      case FormAction.Forward:
      case FormAction.AdjustParticipant:
        this.modal = 'FormForward';
        break;
      case FormAction.Submit:
        if (opts.submitFormAssist) {
          this.modal = 'FormAssist';
        } else {
          this.modal = 'FormDeptSelect';
        }
        break;
      case FormAction.Agree:
      case FormAction.DisAgree:
        this.modal = 'FormDeptSelect';
        break;
      case FormAction.Urge:
        this.modal = 'FormUrge';
        break;
      case FormAction.EditOwner:
        this.modal = 'EditOwner';
        break;
      default:
        this.modal = '';
        break;
    }

    this.visible = !!this.modal;
  }

  close() {
    this.visible = false;
  }

  ok() {
    if (!this.modal) {
      return;
    }
    const modal = this.$refs.component as any as FormActionComponent;
    const data = modal.submit();
    if (data === null || data === undefined) {
      return false;
    }
    this.$emit(
      'ok',
      {
        code:
          this.options.showNextNode &&
          this.options.code !== 'changeNextNodeUser'
            ? 'changeNextNodeUser'
            : this.options.code === 'changeNextNodeUser'
            ? 'submit'
            : this.options.code,
        text: this.options.title,
      },
      data,
    );
    this.close();
  }

  handleNextNodeOk(data: any) {
    this.$emit(
      'ok',
      {
        code:
          this.options.showNextNode &&
          this.options.code !== 'changeNextNodeUser'
            ? 'changeNextNodeUser'
            : this.options.code === 'changeNextNodeUser'
            ? 'submit'
            : this.options.code,
        text: this.options.title,
      },
      data,
    );
    this.close();
  }

  get width() {
    switch (this.modal) {
      case 'FormReject':
        return '800px';
      default:
        return '480px';
    }
  }
}
</script>

<style lang="less">
.form-action-model_urge {
  .ant-modal-header {
    border-bottom: 0;
  }
  .ant-modal-footer {
    border-top: 0;
  }
}

.form-action-model_common {
  .ant-modal-body {
    max-height: calc(100vh - 56px - 70px - 100px);
    overflow-y: auto;
  }
}
.form-dept-select-model {
  .field__control {
    max-height: 600px !important;
  }
  width: 520px;
  .ant-radio-wrapper {
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
  }
  .ant-radio-wrapper > span + span {
    display: block;
    padding-left: 25px;
    margin-top: -20px;
  }
}

.form-btn-modal {
  .ant-modal-header {
    padding: 24px;
  }
  .ant-modal-close-x {
    width: 60px;
    height: 72px;
  }
  .ant-modal-body {
    padding-top: 0;
  }
  .ant-modal-title {
    color: #111218;
    font-size: 16px;
    font-weight: 700;
    height: 24px;
    line-height: 24px;
  }
  .ant-btn {
    height: 32px;
  }
  .ant-modal-footer {
    padding-bottom: 24px;
  }
}
</style>
