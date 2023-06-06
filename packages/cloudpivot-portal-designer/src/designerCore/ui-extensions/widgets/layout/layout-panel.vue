<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->

<template>
  <div :style="style">
    <ui-element
      v-for="(child, index) in $uiChildren"
      :key="child.id"
      :uid="child.id"
      :index="index"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import LayoutPanelBase from './layout-panel-base';

// const name = 'designer-layout-panel';

@Component({
  components: {
  },
})
export default class UiLayoutPanel extends Mixins(LayoutPanelBase) {
  onResize () {}
  // onResize (value: number) {
  //     this.properties.basis.value = value;
  // }
}
</script>

<style lang="less" scoped>
</style>
