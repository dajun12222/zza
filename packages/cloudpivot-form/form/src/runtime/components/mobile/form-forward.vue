<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <!-- <approve-opinion v-if="options.approval" :control="options.approval"></approve-opinion> -->

    <mobile-staff-selector
      v-model="staff"
      :required="true"
      :options="staffSelectorOpts"
      :params="{
        sourceType: 'portal',
        workflowInstanceId: !['转办', '传阅'].includes(text)
          ? $route.query.workflowInstanceId
          : undefined,
        activityCode: !['转办', '传阅'].includes(text)
          ? options.data.activityCode
          : undefined,
      }"
      :title="
        $t('cloudpivot.form.runtime.modal.pleaseSelectUser', { text: text })
      "
      :class="{ error: staffError }"
    />

    <h3-textarea
      v-model="comment"
      :required="!isCirculate"
      type="text"
      :title="$t('cloudpivot.form.runtime.modal.explain', { text: text })"
      :placeholder="$t('cloudpivot.form.runtime.modal.pleaseInput')"
      :maxLength="500"
      :error="commentError"
    />
  </div>
</template>

<script lang="ts">
import MobileStaffSelector from 'cloudpivot-form/form/src/common/components/form-staff-selector/mobile/mobile-staff-selector.vue';
import { H3List, H3ListItem, H3Textarea } from 'h3-mobile-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import components from '../../../renderer/components/mobile';
import { FormAction } from '../../form-action';
import {
  FormActionComponent,
  FormActionModalOptions,
} from '../../form-action-modal';

@Component({
  name: 'form-forward',
  components: {
    H3List,
    H3ListItem,
    H3Textarea,
    MobileStaffSelector,
    ApproveOpinion: components.ApproveOpinion,
  },
})
export default class FormForward extends Vue implements FormActionComponent {
  @Prop()
  options!: FormActionModalOptions;

  comment = '';

  commentError = false;

  staff = '' as any;

  staffError = false;

  staffSelectorOpts = {
    selectOrg: false,
    selectUser: true,
    mulpitle: false,
    showModel: true,
    showSelect: true,
    placeholder: '',
  };

  get text() {
    return `${this.options ? this.options.title : ''}`;
  }

  get isCirculate() {
    return this.options && this.options.code === FormAction.Circulate;
  }

  // get isForward() {
  //   return this.options && this.options.code === FormAction.Forward;
  // }

  @Watch('options', {
    immediate: true,
  })
  setOptions(opts: FormActionModalOptions) {
    if (!opts) {
      return;
    }

    this.comment = '';
    this.staff = [];

    this.$set(
      this.staffSelectorOpts,
      'mulpitle',
      opts.code !== FormAction.Forward,
    );
    this.$set(
      this.staffSelectorOpts,
      'placeholder',
      this.$t('cloudpivot.form.runtime.modal.pleaseChoose'),
    );
  }

  submit() {
    this.staffError = !this.staff || !this.staff.length;
    if (!this.isCirculate) {
      this.commentError = !this.comment;
    }

    if (this.staffError || this.commentError) {
      if (this.staffError) {
        this.$h3.toast.show({
          text: this.$t('cloudpivot.form.runtime.modal.pleaseSelectUser', {
            text: this.text,
          }),
          iconType: '',
        });
      } else if (this.commentError) {
        this.$h3.toast.show({
          text: this.$t('cloudpivot.form.runtime.modal.pleaseInputExplain', {
            text: this.text,
          }),
          iconType: '',
        });
      } else {
      }

      return;
    }

    return {
      comment: this.comment,
      participantors: this.staff,
    };
  }
}
</script>
