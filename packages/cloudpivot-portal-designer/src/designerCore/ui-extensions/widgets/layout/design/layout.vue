<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->

<template>
  <h3-layout
    :class="{[name]: true}"
    :style="style"
  >
    <h3-layout-sider
      v-if="east"
      :isLeft="true"
      :resizable="east.props.resizable"
      :collapsible="east.props.collapsible"
      :toggleOutside="!east.props.toggleInside"
      :value="east.props.basis"
      :minWidth="east.props.min"
      :maxWidth="east.props.max"
      :overflow="east.props.overflow.overflow"
      @resize="val => east.props.basis = val"
    >
      <ui-design-element
        :uid="east.id"
        :parentId="uid"
        :full="true"
        :draggable="false"
        :childIds="east.childIds"
      />
    </h3-layout-sider>

    <h3-layout-content style="overflow-x: hidden">
      <h3-layout-header
        v-if="north"
        :value="north.props.basis"
        :resizable="north.props.resizable"
        :min="north.props.min"
        :max="north.props.max"
        :collapsible="north.props.collapsible"
        :toggleOutside="!north.props.toggleInside"
        :overflow="north.props.overflow.overflow"
        @resize="val => north.props.basis = val"
      >
        <ui-design-element
          :uid="north.id"
          :parentId="uid"
          :draggable="false"
          :full="true"
          :childIds="north.childIds"
        />
      </h3-layout-header>

      <h3-layout-center
        v-if="center"
        :style="{
          overflow: center.props.overflow.overflow
        }"
      >
        <ui-design-element
          :uid="center.id"
          :parentId="uid"
          :full="true"
          :translateTo="uid"
          :childIds="center.childIds"
        />
      </h3-layout-center>

      <h3-layout-footer
        v-if="south"
        :isTop="false"
        :value="south.props.basis"
        :resizable="south.props.resizable"
        :minWidth="south.props.min"
        :maxWidth="south.props.max"
        :collapsible="south.props.collapsible"
        :toggleOutside="!south.props.toggleInside"
        :overflow="south.props.overflow.overflow"
        @resize="val => south.props.basis = val"
      >
        <ui-design-element
          :uid="south.id"
          :parentId="uid"
          :draggable="false"
          :full="true"
          :childIds="south.childIds"
        />
      </h3-layout-footer>
    </h3-layout-content>

    <h3-layout-sider
      v-if="west"
      :isLeft="false"
      :resizable="west.props.resizable"
      :minWidth="west.props.min"
      :maxWidth="west.props.max"
      :collapsible="west.props.collapsible"
      :toggleOutside="!west.props.toggleInside"
      :value="west.props.basis"
      :overflow="west.props.overflow.overflow"
      @resize="val => west.props.basis = val"
    >
      <ui-design-element
        :uid="west.id"
        :parentId="uid"
        :full="true"
        :draggable="false"
        :childIds="west.childIds"
      />
    </h3-layout-sider>
  </h3-layout>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import DesignerNodeVue from '../../../designer-node-vue';

import {
  H3Layout,
  H3LayoutContent,
  H3LayoutHeader,
  H3LayoutCenter,
  H3LayoutFooter,
  H3LayoutSider,
} from '../../../h3-components/h3-layout';

// import { ComponentType } from '../../../enums';

import LayoutBase from '../layout-base';

// const name = 'designer-layout';

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
export default class DesignerLayout extends Mixins(DesignerNodeVue, LayoutBase) {}
</script>

<style lang="less" scoped>
.designer-layout {
  display: flex;
  flex-direction: row;
  height: 100%;

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
