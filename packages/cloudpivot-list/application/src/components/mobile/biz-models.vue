<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="biz-models">
    <p v-if="title" class="biz-models__title" @click="collapse">
      {{ title }}
      <i
        v-if="collapsable"
        class="icon aufontAll h-icon-all-up-o"
        :class="!opened && 'closed'"
      ></i>
      <span v-else class="counts">{{
        $t('cloudpivot.application.mobile.WorkflowCount', {
          length: list.length,
        })
      }}</span>
    </p>
    <transition name="collapse">
      <grid-list
        v-show="opened"
        class="collapse-item"
        colorKey="code"
        :list="list"
        :grid="col"
        @onItem="$emit('onItem', $event)"
      />
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import common from 'cloudpivot/common/mobile';

@Component({
  name: 'biz-models',
  components: {
    GridList: common.components.GridList,
  },
})
export default class BizModels extends Vue {
  @Prop() title!: string;

  @Prop() collapsable?: boolean;

  @Prop({
    default: 3,
  })
  col!: number;

  @Prop() list!: Array<any>;

  opened: boolean = true;

  collapse() {
    if (!this.collapsable) {
      return;
    }
    this.opened = !this.opened;
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot/common/styles/mixins.less';
.biz-models {
  .px2rem(margin-top, @horizontal-padding-md);
  .px2rem(margin-bottom, @horizontal-padding-md);
  .px2rem(padding, @horizontal-padding-lg);
  .px2rem(border-radius, @border-radius-lg);
  padding-top: 0;
  text-align: left;
  background: @white-background;
  &__title {
    .px2rem(padding-top, 24px);
    .px2rem(line-height, 40px);
    .px2rem(font-size, 28px);
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    i {
      float: right;
      transition: all 0.3s;
      &.closed {
        transform: rotate(180deg);
      }
    }
    .counts {
      display: inline-block;
      .px2rem(margin-left, 20px);
      .px2rem(font-size, 24px);
      font-weight: 400;
      color: #999;
    }
  }
}
</style>
