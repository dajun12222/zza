<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <h3-size-slider
    :left="!collapse && resizable && !isLeft"
    :right="!collapse && resizable"
    :minWidth="minWidth"
    :maxWidth="maxWidth"
    :class="css"
    :style="style"
    @resize="onResize"
    @resizeEnd="onResizeEnd"
  >
    <div
      :class="[`${name}--body`]"
      :style="{
        overflow: overflow,
      }"
    >
      <slot></slot>
    </div>

    <div
      v-if="collapsible"
      :class="toggleCss"
      @click="toggle"
    >
      <a-icon :type="toggleIcon" />
    </div>
  </h3-size-slider>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Model, Watch,
} from 'vue-property-decorator';

import { Icon } from '@h3/antd-vue';

// import H3SizeSlider from '../size-slider.vue';

const name = 'h3-layout-sider';

@Component({
  components: {
    AIcon: Icon,
    H3SizeSlider: () => import('../size-slider.vue'),
  },
})
export default class H3LayoutSider extends Vue {
  @Prop({
    default: 'hidden',
  })
  overflow!: string;

  @Prop({
    default: true,
  })
  isLeft!: boolean;

  @Prop({
    default: false,
  })
  resizable!: boolean;

  @Prop({
    default: false,
  })
  toggleOutside!: boolean;

  @Prop({
    default: '',
  })
  toggleIconPrefix!: string;

  /**
   * 初始宽度
   */
  @Model('resize', {
    default: 100,
  })
  // @Prop()
  value!: number;

  /**
   * 最小宽度
   */
  @Prop({
    default: 0,
  })
  minWidth!: number;

  /**
   * 最大宽度
   */
  @Prop({
    default: -1,
  })
  maxWidth!: number;

  /**
   * 可收缩的
   */
  @Prop({
    default: false,
  })
  collapsible!: boolean;

  /**
   * 是否收起
   */
  @Prop({
    default: false,
  })
  collapsed!: boolean;

  @Watch('collapsed', {
    immediate: true,
  })
  onCollapsedChange () {
    this.collapse = this.collapsed;
  }

  @Watch('value', {
    immediate: true,
  })
  onValueChange (val: number) {
    this.basis = val;
  }

  basis = 0;

  collapse = false;

  toggleClick = false;

  get name () {
    return name;
  }

  get css () {
    const css = [name];
    if (this.collapse) {
      const temp = `${name}__collapsed`;
      css.push(temp);
      css.push(this.isLeft ? `${temp}__left` : `${temp}__right`);
    }
    return css;
  }

  get toggleCss () {
    const tn = name + '--toggle';
    const css = [tn];
    css.push(this.isLeft ? `${tn}__left` : `${tn}__right`);
    if (this.toggleOutside || (this.collapse && this.outside)) {
      const temp = tn + '__outside';
      css.push(temp);
      css.push(this.isLeft ? `${temp}__left` : `${temp}__right`);
    }
    return css;
  }

  get toggleIcon () {
    const right = this.toggleIconPrefix
      ? this.toggleIconPrefix + '-right'
      : 'right';
    const left = this.toggleIconPrefix
      ? this.toggleIconPrefix + '-left'
      : 'left';
    if (this.isLeft) {
      return this.collapse ? right : left;
    } else {
      return this.collapse ? left : right;
    }
  }

  get style () {
    let width = this.basis;

    // toggleClick-true 表示点击了展开按钮，直接展开默认宽度
    if (this.toggleClick) {
      this.toggleClick = false;
      width = this.isLeft ? 220 : 270;
    }

    const style = {
      width: width + 'px',
    } as any;
    if (this.collapse) {
      if (this.minWidth) {
        style.width = this.minWidth + 'px';
      } else {
        const margin = this.isLeft ? width - 70 : width;
        style[this.isLeft ? 'margin-left' : 'margin-right'] = `-${margin}px`;
      }
    }

    if (this.resizable) {
      style.minWidth = `${this.minWidth}px`;
      style.maxWidth = `${this.maxWidth}px`;
    }

    return style;
  }

  get outside () {
    return this.minWidth < 24;
  }

  onResize (data: { width: number }) {
    // 宽度小于2px时默认收起
    if (data.width <= 2) {
      this.collapse = true;
      this.toggleClick = true;
      this.$emit('collapse', true);
    }

    this.toggleClick = false;
    this.basis = data.width;
    if (this.minWidth) {
      this.basis = Math.max(data.width, this.minWidth);
    }
    this.$emit('resize', this.basis);
  }

  onResizeEnd () {
    this.$emit('resizeEnd');
  }

  toggle () {
    this.collapse = !this.collapse;
    this.toggleClick = true;
    this.$emit('collapse', this.collapse);
  }
}
</script>

<style lang="less" scoped>
.h3-layout-sider {
  flex-shrink: 0;

  &:not(.resizing) {
    transition: all 0.3s ease;
  }

  &.resizing {
    transition: all 1ms linear;
  }

  &--body {
    height: 100%;
    overflow: hidden;
  }

  &--toggle {
    position: absolute;
    z-index: 12;
    cursor: pointer;
    top: calc(50% - 21px);
    width: 1em;
    height: 2em;
    font-size: 14px;
    // background: hsla(0, 0%, 100%, 0.3);
    opacity: 0.8;
    // background-color: #ccc;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background: rgba(0, 0, 0, 0.3) !important;

    & > i {
      transform: scale(0.7);
    }

    &__left {
      right: 0;
      border-radius: 8px 0 0 8px;
    }

    &__right {
      left: 0;
      border-radius: 0 8px 8px 0;
    }

    &__outside {
      &__left {
        right: -1em;
        border-radius: 0 8px 8px 0;
      }
      &__right {
        left: -1em;
        border-radius: 8px 0 0 8px;
      }
    }
  }
}
</style>
