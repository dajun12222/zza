<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <h3-textarea
      v-model="comment"
      :required="true"
      :rows="8"
      type="text"
      :title="'协办意见'"
      :placeholder="$t('cloudpivot.form.runtime.modal.pleaseInput')"
      :maxLength="500"
      :error="commentError"
    />
  </div>
</template>

<script lang="ts">
import { H3Textarea } from 'h3-mobile-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  FormActionComponent,
  FormActionModalOptions,
} from '../../form-action-modal';

@Component({
  name: 'form-forward',
  components: {
    H3Textarea,
  },
})
export default class FormForward extends Vue implements FormActionComponent {
  @Prop()
  options!: FormActionModalOptions;

  comment = '';

  commentError = false;

  get text() {
    return `${this.options ? this.options.title : ''}`;
  }

  @Watch('options', {
    immediate: true,
  })
  setOptions(opts: FormActionModalOptions) {
    if (!opts) {
      return;
    }

    this.comment = '';
  }

  submit() {
    if (this.commentError) {
      if (this.commentError) {
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
    };
  }
}
</script>
