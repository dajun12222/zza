<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="form-forward">
    <div
      class="field"
      :class="{
        error: form.comment.hasError,
        required: form.comment.required,
      }"
    >
      <div class="field__label top field__label-title">
        意见
        <span v-show="form.comment.required" style="color: #f0353f">*</span>
      </div>
      <div class="field__control">
        <a-tooltip>
          <template v-if="form.comment.hasError" slot="title">
            <p>
              {{
                $t('cloudpivot.form.runtime.modal.pleaseInputExplain', {
                  text: text,
                })
              }}
            </p>
          </template>

          <div class="h3-textarea-box">
            <h3-textarea
              v-model="form.comment.value"
              :placeholder="$t('cloudpivot.form.runtime.modal.pleaseInput')"
              :maxLength="500"
            />
          </div>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Input, Tooltip } from '@h3/antd-vue';
import { FormBuilder, FormControlType } from 'cloudpivot-forms';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import pc from '../../../renderer/components/pc';
import {
  FormActionComponent,
  FormActionModalOptions,
} from '../../form-action-modal';

@Component({
  name: 'form-forward',
  components: {
    ATextarea: Input.TextArea,
    ATooltip: Tooltip,
    StaffSelector: pc.StaffSelector,
    H3Textarea: pc.H3Textarea,
  },
})
export default class FormForward extends Vue implements FormActionComponent {
  @Prop()
  options!: FormActionModalOptions;

  comment = '';

  formGroup = this.createFormGroup();

  get text() {
    return this.options ? this.options.title : '';
  }

  get form() {
    return this.formGroup ? this.formGroup.children : null;
  }

  get workflowInstanceId() {
    return this.options.data.workflowInstanceId
      ? this.options.data.workflowInstanceId
      : '';
  }

  get activityCode() {
    return this.options.data.activityCode ? this.options.data.activityCode : '';
  }

  createFormGroup() {
    const group = FormBuilder.build({
      comment: {
        type: FormControlType.Radio,
        options: {
          required: true,
        },
      },
    });

    return group;
  }

  // /**
  //  * 选人控件placeholder多语言
  //  */
  // placeHolderLang(){
  //   this.staffSelectorOpts.placeholder = this.$t('cloudpivot.flowCenter.pc.plzSelect') as string;
  // }

  // @Watch('$i18n.locale')
  // onLanguageChange(l:string) {
  //   this.placeHolderLang();
  // }

  @Watch('options', {
    immediate: true,
  })
  setOptions(opts: FormActionModalOptions) {
    if (!opts) {
      return;
    }

    if (this.form) {
      (this.form.comment as any).required = true;
    }
  }

  submit() {
    if (this.formGroup && this.formGroup.validate() === false) {
      if (this.form && (this.form.comment as any).hasError) {
        this.$message.error(
          this.$t('cloudpivot.form.runtime.modal.pleaseInputExplain', {
            text: this.text,
          }) as string,
        );
        return;
      }
      return;
    }

    const data = this.formGroup.value;

    return data;
  }

  // mounted(){
  //   this.placeHolderLang();
  // }
}
</script>

<style lang="less">
.field__label.field__label-title {
  margin-bottom: 6px;
  color: #111218;
  font-size: 14px;
  font-weight: 400;
}
.field__label.top {
  padding-top: 7px;
}

.form-forward {
  min-height: 268px;
  .field {
    padding-top: 0;
    .h3-textarea-box .h3-textarea {
      border-radius: 2px;
    }
  }

  .field__label:before {
    display: none;
  }

  textarea {
    resize: none;
    min-height: 75px;
    max-height: 75px;
  }
}
</style>
