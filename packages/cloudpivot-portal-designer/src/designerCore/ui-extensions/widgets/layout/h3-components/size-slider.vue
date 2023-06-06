<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="h3-size-slider">
    <span
      v-show="left"
      class="h3-size-slider__sider h3-size-slider__sider-left"
      :class="{'h3-size-slider__sider--forbidden': forbidden}"
      @mousedown="e => onMousedown(e, 'left')"
    ></span>

    <span
      v-show="right"
      class="h3-size-slider__sider h3-size-slider__sider-right"
      :class="{'h3-size-slider__sider--forbidden': forbidden,'h3-size-slider__sider-right__resizing': resizing}"
      @mousedown="e => onMousedown(e, 'right')"
    ></span>

    <span
      v-show="top"
      class="h3-size-slider__sider h3-size-slider__sider-top"
      :class="{'h3-size-slider__sider--forbidden': forbidden}"
      @mousedown="e => onMousedown(e, 'top')"
    ></span>

    <span
      v-show="bottom"
      class="h3-size-slider__sider h3-size-slider__sider-bottom"
      :class="{'h3-size-slider__sider--forbidden': forbidden}"
      @mousedown="e => onMousedown(e, 'bottom')"
    ></span>

    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class H3SizeSlider extends Vue {
  @Prop({
    default: false,
  })
  left!: boolean;

  @Prop({
    default: false,
  })
  right!: boolean;

  @Prop({
    default: false,
  })
  top!: boolean;

  @Prop({
    default: false,
  })
  bottom!: boolean;

  @Prop({
    default: 1,
  })
  minWidth!: number;

  @Prop({
    default: -1,
  })
  maxWidth!: number;

  @Prop({
    default: 1,
  })
  minHeight!: number;

  @Prop({
    default: -1,
  })
  maxHeight!: number;

  @Prop({
    default: false,
  })
  forbidden!: boolean;

  /**
   * 原点
   */
  base: number | null = null;

  sum = 0;

  resizing: boolean = false; // 是否正在拖拽

  isHorizontal (direction: string) {
    return direction === 'left' || direction === 'right';
  }

  isReverse (direction: string) {
    return direction === 'left' || direction === 'top';
  }

  onMousedown (evt: MouseEvent, direction: string) {
    if (this.forbidden) {
      return;
    }
    evt.preventDefault();
    const horizontal = this.isHorizontal(direction);

    const _el = this.$el as HTMLElement;

    this.base = horizontal ? evt.screenX : evt.screenY;
    this.sum = horizontal ? _el.offsetWidth : _el.offsetHeight;

    const sider = evt.target as HTMLSpanElement;
    sider.classList.add('active');
    this.$el.classList.add('resizing');

    const bodyCursor = document.body.style.cursor;

    const moveFn = (e: MouseEvent) => {
      e.preventDefault();

      this.onMousemove(e, direction);
    };

    const upFn = (e: MouseEvent) => {
      e.preventDefault();

      this.base = null;
      this.sum = 0;

      sider.classList.remove('active');
      this.$el.classList.remove('resizing');

      document.body.style.cursor = bodyCursor;
      document.removeEventListener('mousemove', moveFn);
      document.removeEventListener('mouseup', upFn);
      this.resizing = false;
      this.$emit('resizeEnd');
    };

    document.body.style.cursor = horizontal ? 'e-resize' : 'n-resize';

    document.addEventListener('mousemove', moveFn);
    document.addEventListener('mouseup', upFn);
    this.resizing = true;
    this.$emit('resizeStart');
  }

  getMove (evt: MouseEvent, direction: string) {
    const horizontal = this.isHorizontal(direction);
    const move = horizontal ? evt.screenX : evt.screenY;
    return move;
  }

  onMousemove (evt: MouseEvent, direction: string) {
    if (this.base === null) {
      return;
    }
    const horizontal = this.isHorizontal(direction);
    const move = this.getMove(evt, direction);
    const offset = this.isReverse(direction)
      ? this.base - move
      : move - this.base;
    this.base = move;
    if (horizontal) {
      let width = this.sum + offset;
      if (width < this.minWidth) {
        width = this.minWidth;
      } else if (this.maxWidth !== -1 && width > this.maxWidth) {
        width = this.maxWidth;
      } else {
        width = this.sum + offset;
      }

      this.sum = width;
      this.$emit('resize', {
        width,
      });
    } else {
      let height = this.sum + offset;
      if (height < this.minHeight) {
        height = this.minHeight;
      } else if (this.maxHeight !== -1 && height > this.maxHeight) {
        height = this.maxHeight;
      } else {
        height = this.sum + offset;
      }

      this.sum = height;
      this.$emit('resize', {
        height,
      });
    }
  }
}
</script>

<style lang="less" scoped>
@size: 2px;
@offset: @size / 2 * -1;
@primary-color: red;

.h3-size-slider {
  position: relative;

  &__sider {
    cursor: e-resize;
    display: inline-block;
    position: absolute;
    user-select: none;

    z-index: 10;

    &:hover,
    &.active {
      background-color: @primary-color !important;
    }

    &-left,
    &-right {
      top: 0;
      width: @size;
      height: 100%;

      &:hover,
      &.active {
        cursor: e-resize;
      }
    }

    &-left {
      left: @offset;
    }

    &-right {
      right: @offset;
    }

    &-top,
    &-bottom {
      left: 0;
      height: @size;
      width: 100%;
      cursor: n-resize !important;

      &:hover,
      &.active {
        cursor: n-resize !important;
      }
    }

    &-top {
      top: @offset;
    }

    &-bottom {
      bottom: @offset;
    }
  }
  &__sider&__sider--forbidden {
    cursor: auto;
    &:hover,
    &.active {
      background-color: #e8e8e8 !important;
    }
  }
}
</style>
