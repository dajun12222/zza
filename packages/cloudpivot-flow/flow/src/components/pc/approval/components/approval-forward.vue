<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="approval-forward">
    <div v-if="type === 'from'">
      <tempalte v-if="isChinese">
        <span class="action-from-left">来自</span>
        <span class="person">{{ personText }}</span>
        <span class="action-from-right">{{ '的' + action }} </span>
      </tempalte>
      <template v-else>
        <span class="action-from-left">{{ action + ' from ' }} </span>
        <span class="person">{{ personText }}</span>
      </template>
    </div>
    <div v-else>
      <template v-if="isChinese">
        <span class="action-to">{{ '已' + action + '给' }}</span>
        <span class="person">{{ personText }}</span>
      </template>
      <tempalet v-else>
        <span class="action-to">{{ action + ' to ' }} </span>
        <span class="person">{{ personText }}</span>
      </tempalet>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'approval-forward',
  components: {},
})
export default class ApprovalForward extends Vue {
  @Prop()
  person!: any[];

  @Prop()
  action!: string;

  @Prop({ default: 'from' })
  type!: 'from' | 'to';

  get personText() {
    return this.person
      .reduce((prev, cur) => {
        return prev + '、' + cur;
      }, '')
      .slice(1);
  }

  get isChinese() {
    return !(this.$i18n.locale && this.$i18n.locale === 'en');
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common.less';
.approval-forward {
  font-size: 13px;
  font-weight: 400;
  color: #111218;
  line-height: 22px;
  .action-from-left {
    color: rgba(17, 18, 24, 0.5);
    padding-right: 4px;
  }
  .action-from-right {
    color: rgba(17, 18, 24, 0.5);
    padding-left: 4px;
  }
  .action-to {
    padding-right: 4px;
    color: rgba(17, 18, 24, 0.5);
  }
}
</style>
