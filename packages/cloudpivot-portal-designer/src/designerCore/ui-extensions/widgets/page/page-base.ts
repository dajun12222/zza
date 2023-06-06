/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import { Component, Prop, Vue } from 'vue-property-decorator';

import { getCamelCaseStyle } from '@cloudpivot-shared/ui-property-editor';
@Component
export default class PageBase extends Vue {
  @Prop({
    default: () => ({}),
  })
  size!: any;

  @Prop({
    default: () => ({}),
  })
  padding!: any;

  @Prop({
    default: () => ({}),
  })
  alignment!: any;

  @Prop({
    default: () => ({}),
  })
  visible!: any;

  @Prop({
    default: () => ({}),
  })
  background!: any;

  @Prop({
    default: () => ({}),
  })
  overflow!: any;

  get style() {
    const style: any = {};
    const complexStyle = ['padding', 'background', 'overflow', 'visible'];
    complexStyle.forEach((item) => {
      getCamelCaseStyle(item, this[item], style);
    });
    // const paddingTop = parseInt(this.padding.paddingTop); // 第一个组件碰到边沿的处理
    // Object.assign(style, this.alignment, this.background, this.overflow, this.visible, this.padding, this.size, {
    //   paddingTop: Math.max(20, paddingTop) + 'px',
    // });
    Object.assign(style, this.alignment, this.size);

    return style;
  }
}
