/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  getCamelCaseStyle,
  filter,
  rotate,
} from '@cloudpivot-shared/ui-property-editor';

@Component
export default class WidgetBase extends Vue {
  /**
   * 尺寸
   */
  @Prop({
    default: () => ({}),
  })
  size!: any;

  @Prop({
    default: false,
  })
  borderless!: boolean;

  /**
   * 尺寸限制
   */
  @Prop({
    default: () => ({}),
  })
  sizeLimit!: any;

  /**
   * 内边距设置
   */
  @Prop({
    default: () => ({}),
  })
  padding!: any;

  /**
   * 外边距设置
   */
  @Prop({
    default: () => ({}),
  })
  margin!: any;

  /**
   * 文本设置
   */
  @Prop({
    default: () => ({}),
  })
  text!: any;

  /**
   * 边框设置
   */
  @Prop({
    default: () => ({}),
  })
  border!: any;

  /**
   * 阴影设置
   */
  @Prop({
    default: () => ({}),
  })
  shadow!: any;

  /**
   * 滤镜设置
   */
  @Prop({
    default: () => ({}),
  })
  filter!: any;

  /**
   * 旋转设置
   */
  @Prop({
    default: () => ({}),
  })
  rotate!: any;

  /**
   * 可见性设置
   */
  @Prop({
    default: () => ({}),
  })
  visible!: any;

  /**
   * 背景设置
   */
  @Prop({
    default: () => ({}),
  })
  background?: any;

  /**
   * 字体设置
   */
  @Prop({
    default: () => ({}),
  })
  font?: any;

  @Prop() designMode?: any;

  @Prop() env: any;

  get style() {
    let style: any = {};
    filter.toStyle(this.filter, style);
    rotate.toStyle(this.rotate, style);
    // 处理复合样式，类似h3ui.widgets.xxx.background.background属性冗余
    const complexStyle = [
      'padding',
      'margin',
      'border',
      'background',
      'shadow',
      'visible',
      'font',
    ];
    complexStyle.forEach((item) => {
      getCamelCaseStyle(item, this[item], style);
    });
    Object.assign(style, this.sizeLimit, this.size, this.text);

    // 如果是在设计态
    if (this.$uiEngine?.isDesignMode) {
      // 既然父容器已经设置了width, 这里只需要100% 继承即可
      if (style.width && style.width.indexOf('%') !== -1) {
        style.width = '100%';
      }
      if (style.height && style.height.indexOf('%') !== -1) {
        style.height = '100%';
      }
    }

    style = this.$uiEngine.pxToRem(style);
    return style;
  }

  get outerStyle() {
    const style: any = {};
    Object.assign(style, this.size);
    return style;
  }
}
