<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <!-- <div
    class="h3-sider"
    :class="[options.direction]"
    :style="style"
  > -->
  <h3-size-slider
    class="h3-sider"
    :class="[options.direction, expended]"
    :style="style"
    :left="isLeft"
    :slider="options.slider"
    :right="isRight"
    :minWidth="options.minWidth"
    :maxWidth="options.maxWidth"
    @resize="onResize"
  >
    <div class="h3-sider-body">
      <slot></slot>
    </div>

    <div v-if="options.collapsible" class="h3-sider-toggle" @click="toggle">
      <img
        v-show="show === true"
        class="img"
        src="~cloudpivot-admin-core/src/assets/images/toleft.svg"
        alt="暂无图片"
      />
      <img
        v-show="show === true"
        class="img-hover"
        src="~cloudpivot-admin-core/src/assets/images/tolefthover.svg"
        alt="暂无图片"
      />
      <img
        v-show="show === false"
        class="img"
        src="~cloudpivot-admin-core/src/assets/images/toright.svg"
        alt="暂无图片"
      />
      <img
        v-show="show === false"
        class="img-hover"
        src="~cloudpivot-admin-core/src/assets/images/torighthover.svg"
        alt="暂无图片"
      />
    </div>
    <!-- </div> -->
  </h3-size-slider>
</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { SiderOptions } from './sider-options';

import common from 'cloudpivot/common/pc';
// addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
// addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

@Component({
  name: 'h3-sider',
  components: {
    H3SizeSlider: common.components.H3SizeSlider,
  },
})
export default class H3Sider extends Vue {
  @Prop({
    default: {},
  })
  options!: SiderOptions;

  style: any = {};

  show = true;

  lastWidth = 0;

  direction = '';

  isHover = false;

  el = null;

  expended = 'expended';

  get isLeft() {
    return this.show && this.options.direction === 'right';
  }

  get isRight() {
    return this.show && this.options.direction === 'left';
  }
  /**
   * @desc 左右展开时箭头的动画配合属性，暂时弃用
   */
  // @Watch('style')
  // lastWidthChange(val, old) {
  //   let width = parseInt(val.width);
  //   if (width) {
  //     this.expended = 'expended';
  //   } else {
  //     this.expended = ''
  //   }
  // }
  @Watch('options', {
    immediate: true,
  })
  setOptions(val: SiderOptions) {
    if (!val) {
      return;
    }

    if (val.width) {
      this.style.width = `${val.width}px`;
      this.lastWidth = val.width;
    }
  }

  onResize(data: { width: number }) {
    this.lastWidth = data.width;
    this.style = {
      width: `${data.width}px`,
    };
    setTimeout(() => {
      this.$emit('resize', data);
    }, 500);
  }

  toggle() {
    this.show = !this.show;
    const width = this.show ? this.lastWidth : 0;

    this.style = {
      width: `${width}px`,
    };

    setTimeout(() => {
      this.$emit('toggle', this.show);
      this.$emit('resize', {
        width,
      });
    }, 500);
  }
  // /**
  //  * 绑定事件，切换hover状态
  //  */
  // bindEvent () {
  //   this.el.addEventListener('mouseover', this.over, false)
  //   this.el.addEventListener('mouseout', this.out, false)
  // }
  // over() {
  //   this.isHover = true;
  // }
  // out() {
  //   this.isHover = false;
  // }

  // mounted() {
  //   // 获取dom

  //   this.$nextTick(() => {
  //     setTimeout(() => {
  //       this.el = document.querySelector(`.toggle-${this.options.direction}`);
  //       this.bindEvent()
  //     },200)
  //   })

  // }
  // destroyed() {
  //  this.el.removeEventListener('mouseover', this.over)
  //  this.el.removeEventListener('mouseout', this.out)
  // }
}
</script>

<style lang="less" scoped>
.h3-sider-body {
  position: relative;
}
.h3-sider {
  position: relative;
  display: flex;
  transition: width 0.3s ease;
  flex-shrink: 0;

  &.resizing {
    transition: width 1ms linear;
  }

  &.left {
    border-right: 1px solid #e4e4e4;

    & > .h3-sider-toggle {
      right: -14px;
    }
  }

  &.right {
    border-left: 1px solid #e4e4e4;
    & > .h3-sider-toggle {
      left: -14px;

      & > img {
        transform: rotate(180deg);
      }
    }
  }

  &-body {
    flex-grow: 1;
    overflow: auto;
  }

  &-toggle {
    position: absolute;
    width: 14px;
    height: 30px;
    z-index: 99;
    cursor: pointer;
    &:hover {
      .img {
        display: none;
      }
      .img-hover {
        display: inline-block;
      }
    }
    .img-hover {
      display: none;
    }
  }
}
</style>
