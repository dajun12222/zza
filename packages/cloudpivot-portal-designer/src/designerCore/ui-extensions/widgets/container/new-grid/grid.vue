<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div :class="name" :style="wrapStyle">
    <ui-layout />
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';

import { Row, Col } from '@h3/antd-vue';

import GridBase from './grid-base';

@Component({
  components: {
    ARow: Row,
    ACol: Col,
  },
})
export default class UiGrid extends Mixins(GridBase) {
  @Prop({
    default: '',
  })
  backgroundColor!: string;

  @Prop({
    default: '',
  })
  backgroundImg!: string;

  @Prop({
    default: '',
  })
  borderRadius!: string;

  @Prop({
    default: '',
  })
  borderStyle!: string;

  @Prop({
    default: 0,
  })
  borderThickness!: number;

  @Prop({
    default: '',
  })
  borderColor!: string;

  get wrapStyle() {
    const style: any = {};

    if (this.backgroundImg) {
      // 背景颜色
      style['background-image'] = `url(${this.backgroundImg})`;
    }

    if (this.backgroundColor) {
      // 背景颜色
      style['background-color'] = this.backgroundColor;
    }

    if (this.borderRadius) {
      // 圆角
      const RadiusEnum = {
        none: '0px',
        small: '2px',
        medium: '4px',
        big: '8px',
      };
      style['border-radius'] = RadiusEnum[this.borderRadius];
    }

    if (this.borderStyle) {
      // 边框类型
      style['border-style'] = this.borderStyle;
    }
    // 边框粗细
    style['border-width'] =
      this.borderThickness > 0 ? this.borderThickness + 'px' : 0;

    if (this.borderColor) {
      // 边框颜色
      style['border-color'] = this.borderColor;
    }
    return style;
  }
}
</script>

<style lang="less" scoped>
.designer-grid {
  background-size: cover;
  background-position: center;
  background: none !important;
  border: none !important;
  .ui-grid--wrapper {
    /deep/.ui-grid {
      background: transparent !important;
      .ui-container-empty {
        background: transparent !important;
        p {
          color: rgba(17, 18, 24, 0.5);
          margin-top: 12px !important;
          font-size: 12px;
        }
      }
    }
  }
}
.ui-grid-widget{
  padding: 0px!important;
}
.ui-grid-widget.has-row-header{
  padding: 0px!important;
}
// /deep/ .slick-slider.slick-initialized {
//   @media screen and (max-width: 1450px) {
//     margin-top: -20px;
//   }
//   @media screen and (max-width: 1400px) {
//     margin-top: -30px!important;
//   }
// }
.ui-grid--wrapper {
  @media screen and (min-width: 1450px) {
    width: 1400px !important;
    background: none;
    margin: auto;
    // margin-top: -10px;
  }
  // @media screen and (max-width: 1450px) {
  //   margin-top: -40px;
  // }
  // @media screen and (max-width: 1400px) {
  //   margin-top: -40px;
  // }
}
</style>
