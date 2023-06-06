<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="form-urge">
    <div class="tab-content">
      <component :is="curComp" ref="component" :options="options" />
      <div v-show="showCheckbox" class="checkbox-wrapper">
        <h3-checkbox-item @onClick="checkboxChange">应用内DING催办（仅给专有钉的审批人发送）</h3-checkbox-item>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { FormActionComponent } from '../../../form-action-modal';
import Content from './content.vue';
import Record from './record.vue';
import { H3Checkbox } from 'h3-mobile-vue';

@Component({
  name: 'form-urge',
  components: {
    Content,
    Record,
    H3CheckboxItem: H3Checkbox.Item,
  },
})
export default class FormUrge extends Vue implements FormActionComponent {
  @Prop()
  options!: any;

  curComp: string = 'Content';

  checked: boolean = false;

  submit() {
    const content = (this.$refs.component as any).urgeContent;
    (this.$refs.component as any).resetUrgeCount();
    const instanceId = this.$route.query.workflowInstanceId;
    const data = {
      content,
      instanceId,
      type: 'mobile',
      exclusiveDing: this.checked,
    };
    return data;
  }

  checkboxChange() {
    this.checked = !this.checked;
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
@import '~cloudpivot/common/styles/mixins.less';
.form-urge {
  background: #f8f8f8 !important;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-flow: column;
  .urge-tab {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom: 1px solid rgba(228, 228, 228, 1);
    background: white;
    span {
      display: inline-block;
      .px2rem(height, 84px);
      .px2rem(line-height, 84px);
      .px2rem(font-size, 30px);
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      &.cur {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        position: relative;
        &:after {
          content: '';
          display: block;
          .px2rem(width, 48px);
          .px2rem(height, 6px);
          .px2rem(border-radius, 3px);
          background: rgba(41, 112, 255, 1);
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .tab-content {
    background: white;
    overflow: hidden;
    .px2rem(margin-top, 20px);
    .checkbox-wrapper .h3-list-content {
      .px2rem(font-size,28px) !important;
      margin-left: 8px;
    }
  }
}
</style>
