<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="designer-label ui-label" :style="wrapStyle">
    <span
      :style="style"
      :title="content"
      v-text="content"
      @click="textClick"
    ></span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  rotate,
  getCamelCaseStyle,
} from '@cloudpivot-shared/ui-property-editor';
import * as changeRem from '../../change-rem';

// import { Icon } from '@h3/antd-vue';

// import { ComponentItem } from '@cloudpivot-shared/ui-engine-vue/document';

@Component({
  components: {
    // AIcon: Icon
  },
})
export default class UiLabel extends Vue {
  @Prop({
    default: '',
  })
  content!: string;

  @Prop({
    default: '',
  })
  textAlign!: string;

  @Prop({
    default: '',
  })
  verticalAlign!: string;

  @Prop({
    default: '',
  })
  wordBreak!: string;

  @Prop({
    default: true,
  })
  lineFeed!: boolean;

  @Prop({
    default: true,
  })
  userSelect!: boolean;

  @Prop({
    default: '',
  })
  wordSpacing!: string;

  @Prop({
    default: '',
  })
  letterSpacing!: string;

  @Prop({
    default: '',
  })
  lineHeight!: string;

  @Prop({
    default: '',
  })
  textIndent!: string;

  @Prop({
    default: () => ({}),
  })
  border!: any;

  @Prop({
    default: () => ({}),
  })
  text!: any;

  @Prop({
    default: () => ({}),
  })
  background!: any;

  @Prop({
    default: () => ({}),
  })
  margin!: any;

  @Prop({
    default: () => ({}),
  })
  padding!: any;

  @Prop({
    default: () => ({}),
  })
  rotate!: any;

  @Prop({
    default: () => ({}),
  })
  shadow!: any;

  @Prop({
    default: () => ({}),
  })
  size!: any;

  @Prop({
    default: () => ({}),
  })
  sizeLimit!: any;

  @Prop()
  visible!: any;

  @Prop({
    default: () => ({}),
  })
  fontStyle!: any;

  @Prop({
    default: '',
  })
  fontFamily!: string;

  @Prop({
    default: '',
  })
  fontSize!: string;

  @Prop({
    default: '',
  })
  fontColor!: string;

  @Prop({
    default: '',
  })
  textOverflow!: string;

  get wrapStyle() {
    let style: any = {};
    const complexStyle = [
      'padding',
      'margin',
      'border',
      'background',
      'shadow',
      'visible',
    ];
    complexStyle.forEach((item) => {
      getCamelCaseStyle(item, this[item], style);
    });
    Object.assign(style, this.text, this.size, this.sizeLimit, this.fontStyle);
    rotate.toStyle(this.rotate, style);

    // console.log('text', this.text);

    style.userSelect = this.userSelect ? 'text' : 'none';

    style.whiteSpace = this.lineFeed ? 'pre-wrap' : 'pre';
    style.wordBreak =
      this.wordBreak === 'normal' ? 'break-all' : this.wordBreak;

    style.fontFamily = this.fontFamily;
    style.fontSize = this.fontSize;
    style.color = this.fontColor;

    if (this.textAlign) {
      style.textAlign = this.textAlign;
      const textAlignMap = {
        left: 'flex-start',
        right: 'flex-end',
      };
      style.justifyContent = textAlignMap[this.textAlign] || 'center';
    }

    if (this.verticalAlign) {
      const verticalAlignMap = {
        top: 'flex-start',
        bottom: 'flex-end',
      };
      style.alignItems = verticalAlignMap[this.verticalAlign] || 'center';
    }
    if (this.lineHeight) {
      style.lineHeight = parseInt(this.lineHeight, 10) + 'px';
    }
    style = changeRem.toChangeRem(style);
    return style;
  }

  get style() {
    let style: any = {};
    if (this.textIndent) {
      style.textIndent = this.textIndent;
    }
    if (this.letterSpacing) {
      style.letterSpacing = this.letterSpacing;
    }
    if (this.wordSpacing) {
      style.wordSpacing = this.wordSpacing;
    }

    if (this.textOverflow !== 'overflow') {
      style.overflow = 'hidden';
      style.textOverflow = this.textOverflow;
    }

    style = changeRem.toChangeRem(style);
    return style;
  }

  textClick(text) {
    this.$emit('click', text);
  }
}
</script>

<style lang="less" scoped>
.ui-label {
  display: inline-flex;
  // color: @text-color-secondary;
}
</style>
