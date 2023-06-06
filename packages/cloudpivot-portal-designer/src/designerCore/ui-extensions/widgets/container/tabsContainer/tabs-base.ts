/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Prop, Vue } from 'vue-property-decorator';

import { getCamelCaseStyle } from '@cloudpivot-shared/ui-property-editor';

@Component
export default class TabsBase extends Vue {
  @Prop({
    default: '',
  })
  tabPosition!: string;

  @Prop({
    default: '',
  })
  type!: string;

  @Prop({
    default: '',
  })
  sizeType!: string;

  @Prop({
    default: () => ({}),
  })
  size!: any;

  @Prop()
  visible!: any;

  @Prop({
    default: () => ({}),
  })
  background!: any;

  @Prop({
    default: () => ({}),
  })
  padding!: any;

  @Prop()
  overflow!: any;

  @Prop()
  isHeightAuto!: any;

  get headerGrid() {
    return this.$uiChildren?.find((child) => child.type === 'NewGrid');
  }

  get style() {
    const style: any = {};
    const complexStyle = ['padding', 'background', 'overflow', 'visible'];
    complexStyle.forEach((item) => {
      getCamelCaseStyle(item, this[item], style);
    });
    // const h = this.isHeightAuto
    //   ? { height: 'auto' }
    //   : { minHeight: '180px', overflow: 'auto' };
    let minHeight = {};
    if (!this.$uiChildren?.length) {
      minHeight = { minHeight: '180px' };
    }

    Object.assign(style, this.size, { position: 'relative' }, minHeight);
    return style;
  }

  get isHorizontal() {
    // 页签是否水平排列
    return ['top', 'bottom'].includes(this.tabPosition);
  }
}
