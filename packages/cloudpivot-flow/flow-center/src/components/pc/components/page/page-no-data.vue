<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="page-no-data">
    <div v-show="isShowNoData">
      <img src="./images/no-data.png" alt="" />
      <p>{{ tipText }}</p>
    </div>

    <div v-show="isShowSearchNoData">
      <img src="./images/search-no-data.png" alt="" />
      <p>暂无搜索结果</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'page-no-data',
})
export default class PageNoData extends Vue {
  @Prop({ default: false }) isShowNoData!: boolean;

  @Prop({ default: false }) isShowSearchNoData!: boolean;

  @Prop() tipText!: string;
}
</script>

<style lang="less" scoped>
// @import '../../../styles/themes/default.less';
.page-no-data {
  text-align: center;
  p {
    font-size: @font-size-14;
    color: @light-color-3;
  }
}
</style>
