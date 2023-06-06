<template>
  <div
    class="designer-custom-text custom-text"
    :style="wrapStyle"
    @click="textClick"
  >
    <div class="header">
      <div v-if="!!icon" class="header-icon">
        <img
          v-if="icon.includes('http') || icon.includes('/api')"
          :src="icon"
          alt="icon"
        />
        <em v-else class="icon aufontAll" :class="icon" :style="style"></em>
      </div>
      <div class="header-title" :style="style">
        <span>{{ title }}</span>
      </div>
    </div>
    <div class="designer-warp" :style="style">
      {{ textValue }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class CustomText extends Vue {
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

  @Prop({
    default: '',
  })
  textColor!: string;

  @Prop({
    default: '',
  })
  textThickness!: string;

  @Prop({
    default: '自定义文本',
  })
  title!: string;

  @Prop({
    default: '',
  })
  icon!: string;

  @Prop({
    default: '',
  })
  textValue!: string;

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

  get style() {
    const style: any = {};
    if (this.textColor) {
      style['color'] = this.textColor;
    }
    if (this.textThickness) {
      style['font-weight'] = this.textThickness;
    }
    return style;
  }

  textClick(text) {
    this.$emit('click', text);
  }

  // 当前设计区域的渲染态：design, preview, runtime
  get runMode() {
    return this.$uiEngine.runMode as 'design' | 'preview' | 'runtime';
  }

  created() {}
}
</script>

<style lang="less" scoped>
.custom-text {
  border: 1px solid @primary-color;
  max-width: 100%;
  overflow: hidden;
  background-repeat: convert;
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 58px;
    line-height: 58px;
    min-height: 58px;
    display: flex;
    padding: 0 24px;
    align-items: center;
    .header-icon {
      width: 16px;
      height: 16px;
      line-height: 16px;
      margin-right: 8px;
      > img {
        width: 16px;
        height: 16px;
        vertical-align: unset;
      }
      > em {
        font-size: 16px;
        font-weight: 400 !important;
        color: @text-color;
      }
    }
    .header-title {
      height: 24px;
      font-size: 16px;
      font-weight: 600 !important;
      color: @text-color;
      line-height: 24px;
    }
  }
  .designer-warp {
    padding: 0 24px 24px 24px;
  }
}
</style>
