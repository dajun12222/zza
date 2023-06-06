<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="icon-box" :style="boxStyle">
    <a-icon :type="icon.type" :theme="icon.theme" :style="iconStyle" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Icon } from '@h3/antd-vue';

import {
  icon,
  filter,
  rotate,
  getCamelCaseStyle,
} from '@cloudpivot-shared/ui-property-editor';

@Component({
  components: {
    AIcon: Icon,
  },
})
export default class UiIcon extends Vue {
  @Prop({
    default: () => ({}),
  })
  icon!: any;

  @Prop({
    default: () => ({}),
  })
  border!: any;

  @Prop({
    default: () => ({}),
  })
  size!: any;

  @Prop({
    default: () => ({}),
  })
  sizeLimit!: any;

  @Prop({
    default: () => ({}),
  })
  shadow!: any;

  @Prop({
    default: () => ({}),
  })
  filter!: any;

  @Prop({
    default: () => ({}),
  })
  rotate!: any;

  @Prop({
    default: () => ({}),
  })
  margin!: any;

  @Prop()
  visible!: any;

  get iconStyle() {
    const style = {};
    icon.toStyle(this.icon, style);
    // NOTE:  this.icon = { color: xxx, size: xxx, theme:xxx, type: xxx }
    Object.assign(style, this.size);
    return style;
  }

  get boxStyle() {
    let style: any = {};
    filter.toStyle(this.filter, style);
    rotate.toStyle(this.rotate, style);
    const complexStyle = ['margin', 'border', 'shadow', 'visible'];
    complexStyle.forEach((item) => {
      getCamelCaseStyle(item, this[item], style);
    });
    Object.assign(style, this.sizeLimit);
    style = this.$uiContext.pxToRem(style);
    return style;
  }
}
</script>

<style lang="less" scoped>
.icon-box {
  display: inline-block;
}
.icon-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
