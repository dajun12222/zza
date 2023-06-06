<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <h3-layout
    :class="{
      [name]: true,
    }"
    :style="style"
  >
    <h3-layout-sider
      v-if="east"
      class="relative"
      style="height:100%"
      :isLeft="true"
      :collapsible="east.props.collapsible"
      :toggleOutside="!east.props.toggleInside"
      :resizable="east.props.resizable"
      :value="east.props.basis"
      :minWidth="east.props.min"
      :maxWidth="east.props.max"
      :overflow="east.props.overflow.overflow"
      @resize="val => (east.props.basis = val)"
    >
      <ui-element
        :uid="east.id"
        :full="true"
        :draggable="false"
      />
    </h3-layout-sider>

    <h3-layout-content>
      <h3-layout-header
        v-if="north"
        class="relative"
        :value="north.props.basis"
        :resizable="north.props.resizable"
        :min="north.props.min"
        :max="north.props.max"
        :collapsible="north.props.collapsible"
        :toggleOutside="!north.props.toggleInside"
        :overflow="north.props.overflow.overflow"
        @resize="val => (north.props.basis = val)"
      >
        <ui-element
          v-if="north"
          :uid="north.id"
          :full="true"
          :draggable="false"
        />
      </h3-layout-header>

      <h3-layout-center
        v-if="center"
        class="relative"
        :style="{overflow: center.props.overflow.overflow}"
      >
        <ui-element
          :uid="center.id"
          :full="true"
          :draggable="false"
        />
      </h3-layout-center>

      <h3-layout-footer
        v-if="south"
        :isTop="false"
        :value="south.props.basis"
        :resizable="south.props.resizable"
        :min="south.props.min"
        :max="south.props.max"
        :collapsible="south.props.collapsible"
        :toggleOutside="!south.props.toggleInside"
        :overflow="south.props.overflow.overflow"
        @resize="val => (south.props.basis = val)"
      >
        <ui-element
          :uid="south.id"
          :full="true"
          :draggable="false"
        />
      </h3-layout-footer>
    </h3-layout-content>

    <h3-layout-sider
      v-if="west"
      class="relative"
      :isLeft="false"
      :collapsible="west.props.collapsible"
      :resizable="west.props.resizable"
      :minWidth="west.props.min"
      :maxWidth="west.props.max"
      :toggleOutside="!west.props.toggleInside"
      :value="west.props.basis"
      style="height:100%"
      :overflow="west.props.overflow.overflow"
      @resize="val => (west.props.basis = val)"
    >
      <ui-element
        :uid="west.id"
        :full="true"
        :draggable="false"
      />
    </h3-layout-sider>
  </h3-layout>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import {
  H3Layout,
  H3LayoutContent,
  H3LayoutHeader,
  H3LayoutCenter,
  H3LayoutFooter,
  H3LayoutSider,
} from './h3-components/h3-layout';
import LayoutBase from './layout-base';
// import RuntimeNode from '../runtime-node';

@Component({
  components: {
    H3Layout,
    H3LayoutContent,
    H3LayoutCenter,
    H3LayoutHeader,
    H3LayoutFooter,
    H3LayoutSider,
  },
})
export default class UiLayout extends Mixins(LayoutBase) {
}
</script>

<style lang="less" scoped>
.relative {
  position: relative;
}
.designer-layout {
  display: flex;
  flex-direction: row;
  height: 100%;
  // 应用市场还原时添加
  .h3-layout-header--body > div {
    height: 100%;
  }

  .h3-layout-sider--body > div {
    height: 100%;
  }

  &--content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  &--center {
    flex-grow: 1;
  }
}
</style>
