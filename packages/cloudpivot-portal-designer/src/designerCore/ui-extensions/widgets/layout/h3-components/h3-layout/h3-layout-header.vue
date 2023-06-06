<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <h3-size-slider
    :top="!collapse && resizable && !isTop"
    :bottom="!collapse && resizable && isTop"
    :minHeight="minHeight"
    :maxHeight="maxHeight"
    :class="css"
    :style="style"
    @resize="onResize"
  >
    <div
      :class="[`${name}--body`]"
      :style="{
        overflow: overflow,
      }"
    >
      <slot></slot>
    </div>

    <div v-if="collapsible" :class="toggleCss" @click="toggle">
      <a-icon :type="toggleIcon" />
    </div>
  </h3-size-slider>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Model, Watch,
} from 'vue-property-decorator';

// import H3SizeSlider from '../size-slider.vue';

import { Icon } from '@h3/antd-vue';

const name = 'h3-layout-sider';

@Component({
  components: {
    AIcon: Icon,
    H3SizeSlider: () => import('../size-slider.vue'),
  },
})
export default class H3LayoutHeader extends Vue {
  @Prop({
    default: 'hidden',
  })
  overflow!: string;

  @Prop({
    default: true,
  })
  isTop!: boolean;

  @Prop({
    default: false,
  })
  resizable!: boolean;

  @Prop() min?: number;

  @Prop() max?: number;

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
    default: 60,
  })
  value!: number;

  /**
   * 最小宽度
   */
  @Prop({
    default: 0,
  })
  minHeight!: number;

  /**
   * 最大宽度
   */
  @Prop({
    default: -1,
  })
  maxHeight!: number;

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

  get name () {
    return name;
  }

  get css () {
    const css = [name];
    if (this.collapse) {
      const temp = `${name}__collapsed`;
      css.push(temp);
      css.push(this.isTop ? `${temp}__top` : `${temp}__bottom`);
    }
    return css;
  }

  get outside () {
    return this.minHeight < 24;
  }

  get toggleCss () {
    const tn = name + '--toggle';
    const css = [tn];
    css.push(this.isTop ? `${tn}__top` : `${tn}__bottom`);
    if (this.toggleOutside || (this.collapse && this.outside)) {
      const temp = tn + '__outside';
      css.push(temp);
      css.push(this.isTop ? `${temp}__top` : `${temp}__bottom`);
    }
    return css;
  }

  get toggleIcon () {
    const top = this.toggleIconPrefix ? this.toggleIconPrefix + '-up' : 'up';
    const bottom = this.toggleIconPrefix
      ? this.toggleIconPrefix + '-down'
      : 'down';
    if (this.isTop) {
      return this.collapse ? bottom : top;
    } else {
      return this.collapse ? top : bottom;
    }
  }

  get style () {
    const height = this.basis;

    const style = {
      height: height + 'px',
    } as any;

    if (this.collapse) {
      if (this.minHeight) {
        style.height = this.minHeight + 'px';
      } else {
        style[this.isTop ? 'margin-top' : 'margin-bottom'] = `-${height}px`;
      }
    }
    if (this.resizable) {
      style.minHeight = `${this.min}px`;
      style.maxHeight = `${this.max}px`;
    }

    return style;
  }

  onResize (data: { height: number }) {
    this.basis = data.height;
    this.$emit('resize', data.height);
  }

  toggle () {
    this.collapse = !this.collapse;
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
    z-index: 9;
    cursor: pointer;
    left: 10px;
    width: 2em;
    height: 1em;
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

    &__top {
      bottom: 0;
      // color: #fff;
      border-radius: 8px 8px 0 0;
    }

    &__bottom {
      top: 0;
      border-radius: 0 0 8px 8px;
    }

    &__outside {
      &__top {
        bottom: -1em;
        border-radius: 0 0 8px 8px;
      }
      &__bottom {
        top: -1em;
        border-radius: 8px 8px 0 0;
      }
    }
  }
}
</style>
