<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="form-urge">
    <component :is="curComp" ref="component" :options="options" />
    <a-checkbox v-show="showCheckbox" v-model="checked">应用内DING催办（仅给专有钉的审批人发送）</a-checkbox>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Common from 'cloudpivot/common';
import { Checkbox } from '@h3/antd-vue';
import {
  FormActionComponent,
  FormActionModalOptions,
} from '../../../form-action-modal';
import Content from './content.vue';
import Record from './record.vue';

@Component({
  name: 'form-urge',
  components: {
    Content,
    Record,
    ACheckbox: Checkbox,
  },
})
export default class FormUrge extends Vue implements FormActionComponent {
  @Prop()
  options!: FormActionModalOptions;

  curComp: string = 'Content';

  checked: boolean = false;

  submit() {
    const content = (this.$refs.component as any).urgeContent;
    const instanceId = Common.utils.parseUrlParam(
      window.location.href,
      'workflowInstanceId',
    );
    const data = {
      content,
      instanceId,
      type: 'pc',
      exclusiveDing: this.checked,
    };
    return data;
  }

  showCheckbox: boolean = false;

  created() {
    const user: any = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.showCheckbox =
      user.relatedType === 'CUSTOMIZE' &&
      user.customizeRelateType === 'GovDingtalk';
  }
}
</script>
<style lang="less">
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.form-urge {
  .header {
    position: absolute;
    left: 24px;
    bottom: 29px;
    font-size: 14px;
    color: @highlightColor;
    font-weight: 400;
    & > span {
      color: @highlightColor;
      cursor: pointer;
      &.disabled {
        color: rgba(0, 0, 0, 0.25);
        pointer-events: none;
      }
    }
  }
}
</style>
