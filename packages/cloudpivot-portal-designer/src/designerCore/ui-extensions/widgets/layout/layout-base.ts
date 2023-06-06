/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import { Component, Prop, Vue } from 'vue-property-decorator';

import { Direction } from '@cloudpivot-shared/ui-engine-vue/document';

import { getCamelCaseStyle } from '@cloudpivot-shared/ui-property-editor';

const name = 'designer-layout';

@Component
export default class LayoutBase extends Vue {
  @Prop({
    default: () => ({}),
  })
  size!: any;

  @Prop({
    default: () => ({}),
  })
  margin!: any;

  @Prop({
    default: () => ({}),
  })
  background!: any;

  get name () {
    return name;
  }

  get east () {
    return this.$uiChildren?.find(c => c.props.direction === Direction.East);
  }

  get west () {
    return this.$uiChildren?.find(c => c.props.direction === Direction.West);
  }

  get north () {
    return this.$uiChildren?.find(c => c.props.direction === Direction.North);
  }

  get center () {
    const c = this.$uiChildren?.find(ac => ac.props.direction === Direction.Center);
    return c;
  }

  get south () {
    return this.$uiChildren?.find(c => c.props.direction === Direction.South);
  }

  get style () {
    const style: any = {};
    const complexStyle = ['margin', 'background'];
    complexStyle.forEach((item) => {
      getCamelCaseStyle(item, this[item], style);
    });
    Object.assign(style, this.size);
    return style;
  }

  getPanelStyle (panel: any) {
    let style: any = {};
    const complexStyle = ['padding', 'border', 'background'];
    complexStyle.forEach((item) => {
      getCamelCaseStyle(item, panel.props[item], style);
    });
    Object.assign(style, panel.props.overflow);
    style = this.$uiContext.pxToRem(style);
    return style;
  }
}
