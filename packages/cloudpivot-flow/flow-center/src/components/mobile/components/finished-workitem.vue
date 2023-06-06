<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div @click="goForm">
    <base-item
      class="work-item"
      :title="workitem.instanceName"
      :searchWord="searchWord"
      :summary="summary"
      :beTrust="workitem.beTrust"
      :currentTrustor="workitem.currentTrustor"
      :time="workitem.finishTime"
      :avatar="workitem.imgUrl"
      :username="workitem.originatorName"
      :avatarPlacehold="true"
    >
      <span slot="badge" class="item-status" :class="status.classname">
        {{ status.name }}
      </span>
      <span slot="time">{{ $t('cloudpivot.flowCenter.mobile.resolveTime') }}:&nbsp;&nbsp;</span>
    </base-item>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BaseItem from './base-item.vue';

import { mobileHome } from 'cloudpivot/api';

@Component({
  name: 'finishedWorkItem',
  components: {
    BaseItem,
  },
})
export default class finishedWorkItem extends Vue {
  @Prop() workitem!: mobileHome.FinishWorkitem;

  @Prop() searchWord?: string;

  status: object = {
    name: '',
    classname: '',
  };

  classname: string = '';

  get summary() {
    if (this.$i18n) {
      const locale: string = this.$i18n.locale as string;
      return !(this.$i18n.locale && this.$i18n.locale === 'en')
        ? this.workitem.activityName
        : this.workitem.name_i18n[locale];
    }
    return '';
  }

  goForm() {
    this.$emit('openForm');
  }

  beforeMount() {
    switch (this.workitem.state) {
      case 'PENDING': // 待处理
        this.status = {
          // name: this.$t('cloudpivot.flowCenter.mobile.agree'),
          name: this.$t(`cloudpivot.flow.pc.WorkItemStatus.PENDING`),
          classname: 'pending',
        };
        break;
      case 'AGREED': // 已同意
        this.status = {
          // name: this.$t('cloudpivot.flowCenter.mobile.reject'),
          name: this.$t(`cloudpivot.flow.pc.WorkItemStatus.AGREED`),
          classname: 'agreed',
        };
        break;
      case 'DISAGREED': // 已拒绝
        this.status = {
          // name: this.$t('cloudpivot.flowCenter.mobile.forward'),
          name: this.$t(`cloudpivot.flow.pc.WorkItemStatus.DISAGREED`),
          classname: 'disagreed',
        };
        break;
      case 'TRANSFERRED': // 已转办
        this.status = {
          name: this.$t(`cloudpivot.flow.pc.WorkItemStatus.TRANSFERRED`),
          classname: 'transferred',
        };
        break;
      case 'SUBMITTED': // 已提交
        this.status = {
          name: this.$t(`cloudpivot.flow.pc.WorkItemStatus.SUBMITTED`),
          classname: 'submitted',
        };
        break;
      case 'ABORTED': // 已中止
        this.status = {
          name: this.$t(`cloudpivot.flow.pc.WorkItemStatus.ABORTED`),
          classname: 'aborted',
        };
        break;
      case 'CANCELED': // 已取消
        this.status = {
          name: this.$t(`cloudpivot.flow.pc.WorkItemStatus.CANCELED`),
          classname: 'canceled',
        };
        break;
      case 'VOIDED': // 已作废
        this.status = {
          name: this.$t(`cloudpivot.flow.pc.WorkItemStatus.VOIDED`),
          classname: 'voided',
        };
        break;
      default:
        break;
    }
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot/common/styles/mixins.less';
@status-radius: 68px;
@status-margin-left: 30px;
@status-cancelled: rgba(0, 0, 0, 0.45);

.work-item {
  /deep/.item-content-summary {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .px2rem(height, 36px);
    span {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .item-status {
    transform: scale(0.818);
    .px2rem(margin-left, @status-margin-left);
    .px2rem(padding-left, 12px);
    .px2rem(padding-right, 12px);
    .px2rem(line-height, 40px);
    text-align: center;
    .px2rem(font-size, 24px);
    border-style: solid;
    .px2rem(border-width, 2px);
    .px2rem(border-radius, @status-radius);
    border-color: currentColor;
    box-sizing: border-box;
    white-space: nowrap;
  }
  .pending {
    color: #faad14;
    background-color: #fffbe6;
    border-color: #ffe58f;
  }
  .agreed {
    color: #00c293;
    background-color: #e6fff4;
    border-color: #6fe8be;
  }
  .disagreed {
    color: #ff3640;
    background-color: #fff1f0;
    border-color: #ffb6b3;
  }
  .transferred {
    color: #2970ff;
    background-color: #f0f7ff;
    border-color: #a3cbff;
  }
  .submitted {
    color: #00c293;
    background-color: #e6fff4;
    border-color: #6fe8be;
  }
  .aborted {
    color: rgba(17, 18, 24, 0.5);
    background-color: #f5f6f9;
    border-color: rgba(17, 18, 24, 0.25);
  }
  .canceled {
    color: #ff3640;
    background-color: #fff1f0;
    border-color: #ffb6b3;
  }
  .voided {
    color: rgba(17, 18, 24, 0.5);
    background-color: #f5f6f9;
    border-color: rgba(17, 18, 24, 0.25);
  }
}
</style>
