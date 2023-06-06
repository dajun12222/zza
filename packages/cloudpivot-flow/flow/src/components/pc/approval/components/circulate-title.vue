<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="special-status">
    <!--传阅节点-->
    <div class="circulate-approve-item">
      <span class="icon aufontAll h-icon-all-symbol_read"></span>
      <span class="left">{{ $t('cloudpivot.flow.pc.approval.component.circulate')
        }}<span class="num">{{ circulateNum }}</span>{{ $t('cloudpivot.flow.pc.approval.content.person') }}</span>
      <CirculatePopover :node="contentData" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import CirculatePopover from '../components/circulatePopover.vue';

@Component({
  name: 'special-status',
  components: {
    CirculatePopover,
  },
})
export default class SpecialStatus extends Vue {
  @Prop()
  approval!: any;

  @Prop()
  contentData!: any;

  get circulateNum() {
    return (
      (this.contentData.circulations && this.contentData.circulations.length) ||
      ''
    );
  }

  getCirculations(circulations, type) {
    return circulations.filter((item) => item.workActionType === type);
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common.less';
.special-status {
  .circulate-approve-item {
    .h-icon-all-symbol_read {
      padding-left: 12px;
      color: #1890ff;
    }
    .left {
      padding-left: 8px;
      font-size: 13px;
      color: #707481;
      line-height: 22px;
      padding-right: 26px;
    }
    .right {
      font-size: 13px;
      color: #2970ff;
      line-height: 22px;
    }
    .num {
      padding: 0 2px;
    }
  }
}
</style>
