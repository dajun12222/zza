<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="app-home-header">
    <div class="app-home-header--left">
      <slot name="left"></slot>
    </div>
    <div class="app-home-header--right">
      <slot name="right"> </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppSearch from './app-search.vue';

@Component({
  name: 'app-home-header',
  components: {
    AppSearch,
  },
})
export default class AppHomeHeader extends Vue {}
</script>
<style lang="less" scoped>
.app-home-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /deep/ .app-search {
    width: 300px;
  }
}
</style>
