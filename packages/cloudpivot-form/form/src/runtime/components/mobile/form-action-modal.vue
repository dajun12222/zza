<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div v-show="visible" v-control-back class="form-action-modal">
    <div v-if="isShow">
      <component
        :is="modal"
        ref="component"
        :options="options"
        class="content"
        :formObj="formObj"
        @nodeOk="handleNextNodeOk"
      />
    </div>

    <div v-if="isShow" class="border-top">
      <h3-button @click="ok">
        {{ btnText }}
      </h3-button>
    </div>
  </div>
</template>

<script lang="ts">
import common from 'cloudpivot/common';
import { H3Button } from 'h3-mobile-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FormAction } from '../../form-action';
import {
  FormActionComponent,
  FormActionModalOptions,
} from '../../form-action-modal';
import FormDeptSelect from './form-dept-select.vue';
import FormForward from './form-forward.vue';
import FormNextNodeMobile from './form-next-node-mobile.vue';
import FormReject from './form-reject.vue';
import FormUrge from './form-urge/index.vue';
import FormAssist from './form-assist.vue';
import FormComment from './formComment/index.vue';

@Component({
  name: 'form-reject-modal',
  components: {
    H3Button,
    FormDeptSelect,
    FormReject,
    FormForward,
    FormUrge,
    FormComment,
    FormNextNodeMobile,
    FormAssist,
  },
  directives: {
    ControlBack: common.directives.controlBack,
  },
})
export default class FormActionModal extends Vue {
  @Prop() formObj!: any;

  @Prop({ default: true }) approvalOpen!: boolean;

  // @Prop()
  options: FormActionModalOptions = {} as any;

  visible = false;

  modal = '';

  // 只针对我的评论模块
  // 当点击的时候，如果出现评论modal,则重载这个组件
  // todo 如何应用到所有同类组件上
  isShow: boolean = true;

  get btnText() {
    return this.modal === 'FormUrge'
      ? this.$t('cloudpivot.form.runtime.action.urge')
      : this.$t('cloudpivot.form.runtime.biz.ok');
  }

  show(opts: FormActionModalOptions) {
    this.options = opts;

    switch (opts.code) {
      case FormAction.ChangeNextNodeUser:
        this.modal = 'FormNextNodeMobile';
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
      case FormAction.Comment:
        {
          this.modal = 'FormComment';
          this.isShow = false;
          setTimeout(() => {
            this.isShow = true;
          }, 300);
          // this.$refs.co.reload();
        }

        break;
      default:
        this.modal = '';
        break;
    }

    this.visible = true;
  }

  close() {
    this.visible = false;
    this.$emit('closeModal', this.modal);
  }

  ok() {
    //如果审批意见必填校验没有过，则点确定不关闭弹窗
    const checkApproval: any = (this.$parent as any).checkApproval;
    if (
      !this.modal ||
      !checkApproval ||
      !checkApproval.call(this.$parent, this.options.code)
    ) {
      //如果审批意见必填校验没有过，则点确定不关闭弹窗
      const checkApproval: any = (this.$parent as any).checkApproval;
      if (
        !this.modal ||
        !checkApproval ||
        !checkApproval.call(this.$parent, this.options.code)
      ) {
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

      setTimeout(() => {
      if (this.approvalOpen) {
        this.close();
      }
    }, 40);
    }
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
}
</script>

<style lang="less">
@import '~cloudpivot/common/styles/mixins.less';

.form-action-modal {
  // position: absolute;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f8f8;
  .px2rem(font-size, @font-size-base);

  & > div:first-child {
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
  }

  .content {
    background-color: #fff;
    height: 100%;
    display: flex;
    flex-flow: column;
    & > * {
      background-color: #fff;
    }
    .h3-list-body {
      max-height: 100%;
      display: flex;
      flex-flow: column;
    }
  }

  & > div:last-child {
    flex-basis: 0;
    color: @primary-color;
    // border-top:1px #eee solid;
    .hairline(border-top,#eee);
    // .px2rem(padding-top, @font-size-base);
    // .px2rem(padding-bottom, @font-size-base);

    .h3-button {
      color: @primary-color;
      .px2rem(font-size, @font-size-base);
      .px2rem(height, 88px);
      .px2rem(line-height, 88px);
      .px2rem(bottom, 88px);
      border-radius: 0;

      &:before {
        border: none;
        border-radius: 0;
      }
    }
  }
}

/deep/ .h3-popover-item-content {
  .px2rem(width, 211px);
  .px2rem(padding-top,20px);
  .px2rem(padding-bottom,20px);
}
</style>
