/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Prop, Vue } from 'vue-property-decorator';

import { getCamelCaseStyle } from '@cloudpivot-shared/ui-property-editor';

@Component
export default class TabPanelBase extends Vue {
  @Prop({
    default: () => ({}),
  })
  size!: any;

  @Prop({
    default: () => ({}),
  })
  alignment!: any;

  @Prop()
  overflow!: any;

  get style() {
    const style = {} as any;
    let h: any = { minHeight: '180px' };

    const parent = this.$uiNode.parent;
    if (
      parent &&
      parent.type === 'TabsContainer' &&
      parent.props.isHeightAuto
    ) {
      if (this.$uiChildren?.length) {
        h = {};
      } else {
        h = { minHeight: '180px' };
      }
    }
    getCamelCaseStyle('overflow', this.overflow, style);
    Object.assign(
      style,
      this.size,
      this.alignment,
      { position: 'relative' },
      h,
    );
    return style;
  }
}
