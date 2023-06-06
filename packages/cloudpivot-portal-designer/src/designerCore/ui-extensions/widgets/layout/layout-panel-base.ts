/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/

import { Component, Prop, Vue } from 'vue-property-decorator';

import { Direction } from '@cloudpivot-shared/ui-engine-vue/document';

import * as changeRem from '../../change-rem';

import { getCamelCaseStyle } from '@cloudpivot-shared/ui-property-editor';
import { register } from '@cloudpivot-shared/ui-designer-common';
// import { getImgUrl } from '../../file-service';

// const name = 'designer-layout-panel';

@Component
export default class LayoutPanelBase extends Vue {
  get isNorth () {
    return this.direction === Direction.North;
  }

  get isCenter () {
    return this.direction === Direction.Center;
  }

  get isSouth () {
    return this.direction === Direction.South;
  }

  get isEast () {
    return this.direction === Direction.East;
  }

  get isWest () {
    return this.direction === Direction.West;
  }

    @Prop()
    basis!: number;

    @Prop()
    min!: number;

    @Prop()
    max!: number;

    @Prop({
      default: false,
    })
    resizable!: boolean;

    @Prop({
      default: false,
    })
    collapsible!: boolean;

    @Prop()
    direction!: Direction;

    @Prop({
      default: () => ({}),
    })
    background!: any;

    @Prop({
      default: () => ({}),
    })
    border!: any;

    @Prop({
      default: () => ({}),
    })
    padding!: any;

    // @Prop({
    //     default: () => ({})
    // })
    // padding!: any;

    @Prop({
      default: () => ({}),
    })
    overflow!: any;

    get style () {
      let style: any = {
        width: '100%',
        height: '100%',
      };

      const complexStyle = ['padding', 'border', 'background', 'overflow'];
      complexStyle.forEach((item) => {
        getCamelCaseStyle(item, this[item], style);
      });
      const bgPic = style.backgroundImage;
      if (bgPic && (bgPic.startsWith('/api/file/') || bgPic.includes('access_token'))) {
        const appCode = this.$uiEngine.currentApp?.info?.appCode || 'common';
        // const src = getImgUrl(bgPic, appCode);
        // style.backgroundImage = `url("${src}")`;
      }
      Object.assign(style, this.min, this.max);
      style = changeRem.toChangeRem(style);
      return style;
    }
}
