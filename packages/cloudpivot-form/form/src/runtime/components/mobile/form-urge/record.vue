<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="urge-record">
    <div v-for="(item, index) in urgeList" :key="index" class="record-item">
      <div class="date">
        {{ item.opTime }}
      </div>
      <div class="text">
        {{ item.text }}
      </div>
    </div>

    <div v-if="!isEmpty" class="load-all">
      {{ $t('cloudpivot.form.runtime.urge.loadAll') }}
    </div>

    <Empty v-show="isEmpty" />
  </div>
</template>
<script lang="ts">
import common from 'cloudpivot/common/mobile';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'urge-record',
  components: {
    Empty: common.components.Empty,
  },
})
export default class UrgeRecord extends Vue {
  @Prop() urgeList!: Array<any>;

  get isEmpty() {
    return this.urgeList.length <= 0;
  }
}
</script>
<style lang="less">
@import '~cloudpivot/common/styles/mixins.less';
.urge-record {
  background: rgba(247, 248, 252, 1);
  max-height: 100%;
  overflow: auto;
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: calc(100% - 55px);
  z-index: 9;
  .px2rem(padding, 20px);
  .record-item {
    .px2rem(margin-bottom, 20px);
    .date {
      display: inline-block;
      .px2rem(padding-top, 10px);
      .px2rem(padding-bottom, 10px);
      .px2rem(padding-left, 20px);
      .px2rem(padding-right, 20px);
      .px2rem(font-size, 20px);
      .px2rem(line-height, 48px);
      .px2rem(border-radius, 16px);
      background: rgba(0, 0, 0, 0.08);
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      margin: 0 auto;
    }
    .text {
      .px2rem(padding, 30px);
      .px2rem(font-size, 32px);
      .px2rem(border-radius, 16px);
      .px2rem(margin-top, 20px);
      background: white;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      text-align: left;
    }
  }
  .load-all {
    .px2rem(font-size, 24px);
    .px2rem(margin-top, 40px);
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    text-align: center;
  }
}
</style>
