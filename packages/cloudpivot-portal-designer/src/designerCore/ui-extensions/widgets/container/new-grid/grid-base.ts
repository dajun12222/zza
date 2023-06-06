/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Prop, Vue } from 'vue-property-decorator';

import { getCamelCaseStyle } from '@cloudpivot-shared/ui-property-editor';

// import { getImgUrl } from '../../file-service';
import * as changeRem from '../../../change-rem';

const name = 'designer-grid';

@Component
export default class GridBase extends Vue {
  get name() {
    return name;
  }

  @Prop({
    default: () => ({}),
  })
  isHeightAuto!: any;

  @Prop({
    default: () => ({}),
  })
  size!: any;

  @Prop({
    default: () => ({}),
  })
  sizeLimit!: any;

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
  border!: any;

  @Prop({
    default: () => ({}),
  })
  background!: any;

  @Prop({
    default: () => ({}),
  })
  visible!: any;

  get style() {
    let style: any = {};
    const complexStyle = [
      'padding',
      'margin',
      'border',
      'background',
      'visible',
    ];
    complexStyle.forEach((item) => {
      getCamelCaseStyle(item, this[item], style);
    });
    Object.assign(style, this.size, this.sizeLimit);
    if (!style.height) {
      style.height = '100px';
    }
    if (this.isHeightAuto && this.$uiChildren?.length) {
      this.size.height && (this.size.height = 'auto');
    }
    if (style.backgroundSize === 'contain') {
      style.backgroundSize = 'cover';
    }

    style = changeRem.toChangeRem(style);
    return style;
  }

  getColStyle(colData: any) {
    let style: any = {};
    if (!colData) {
      return style;
    }
    const complexStyle = ['padding', 'border', 'background', 'visible'];
    complexStyle.forEach((item) => {
      getCamelCaseStyle(item, colData[item], style);
    });

    if (colData.height) {
      style.height = colData.height;
    }
    // 兼容栅格背景图片旧数据
    // const bgPic = style.backgroundImage;
    // if (bgPic && (bgPic.startsWith('url("/api/file') || bgPic.includes('accessToken'))) {
    //   const appCode = this.$uiEngine.currentApp?.info?.appCode || 'common';
    //   const src = getImgUrl(bgPic, appCode);
    //   style.backgroundImage = `url("${src}")`;
    // }

    style = changeRem.toChangeRem(style);
    style.maxHeight = '100%';
    return style;
  }

  getColSpan(colData: any) {
    const span = colData.span;
    return span;
  }
}
