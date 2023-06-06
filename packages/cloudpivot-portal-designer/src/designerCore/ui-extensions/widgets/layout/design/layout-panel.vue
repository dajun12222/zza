<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->

<template>
  <div :style="style">
    <ui-design-element
      v-for="(child, index) in children"
      :key="child.id"
      :uid="child.id"
      :parentId="uid"
      :index="index"
      :childIds="child.childIds"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

// import { Direction } from '@cloudpivot-shared/ui-engine-vue/document';

import DesignerNodeVue from '../../../designer-node-vue';

import {
  H3LayoutHeader,
  H3LayoutCenter,
  H3LayoutFooter,
  H3LayoutSider,
} from '../../../h3-components/h3-layout';

import LayoutPanelBase from '../layout-panel-base';

// const name = 'designer-layout-panel';

@Component({
  components: {
    H3LayoutCenter,
    H3LayoutHeader,
    H3LayoutFooter,
    H3LayoutSider,
  },
})
export default class DesignerLayoutPanel extends Mixins(DesignerNodeVue, LayoutPanelBase) {
  onResize (value: number) {
    this.node.props.basis = value;
  }
}
</script>

<style lang="less" scoped>
</style>
