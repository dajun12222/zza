<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="designer-carousel carousel" :style="wrapStyle" @click="textClick">
    <a-carousel arrows :autoplay="autoplay" :autoplaySpeed="autoplaySpeed">
      <template #prevArrow>
        <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
          <span>
            <em class="icon aufontAll h-icon-all-left"></em>
          </span>
        </div>
      </template>
      <template #nextArrow>
        <div class="custom-slick-arrow" style="right: 10px">
          <span>
            <em class="icon aufontAll h-icon-all-right"></em>
          </span>
        </div>
      </template>
      <div
        v-for="(item, index) in photos"
        :key="index"
        class="img-wrapper"
        @click="gotoLink(item)"
      >
        <img
          :src="getSrc(item.refId) || item.tempUrl || defaultImg"
          :class="item.fillType || 'Scale'"
          alt=""
        />
      </div>
    </a-carousel>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Carousel } from '@h3/antd-vue';
import { listApi } from 'cloudpivot/api';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

type openType = '_self' | '_blank';

@Component({
  components: {
    ACarousel: Carousel,
  },
})
export default class shortcutList extends Vue {
  @Prop({
    default: '',
  })
  backgroundColor!: string;

  @Prop({
    default: '',
  })
  backgroundImg!: string;

  @Prop({
    default: '',
  })
  borderRadius!: string;

  @Prop({
    default: '',
  })
  borderStyle!: string;

  @Prop({
    default: 0,
  })
  borderThickness!: number;

  @Prop({
    default: '',
  })
  borderColor!: string;

  @Prop({
    default: '',
  })
  textColor!: string;

  @Prop({
    default: '',
  })
  textThickness!: string;

  @Prop()
  photos!: any[];

  @Prop()
  autoplay!: boolean;

  @Prop({ default: 3000 })
  autoplaySpeed!: number;

  list: any[] = [];

  defaultImg: any = '';

  get wrapStyle() {
    const style: any = {};

    if (this.backgroundImg) {
      // 背景颜色
      style['background-image'] = `url(${this.backgroundImg})`;
    }

    if (this.backgroundColor) {
      // 背景颜色
      style['background-color'] = this.backgroundColor;
    }

    if (this.borderRadius) {
      // 圆角
      const RadiusEnum = {
        none: '0px',
        small: '2px',
        medium: '4px',
        big: '8px',
      };
      style['border-radius'] = RadiusEnum[this.borderRadius];
    }

    if (this.borderStyle) {
      // 边框类型
      style['border-style'] = this.borderStyle;
    }
    // 边框粗细
    style['border-width'] =
      this.borderThickness > 0 ? this.borderThickness + 'px' : 0;

    if (this.borderColor) {
      // 边框颜色
      style['border-color'] = this.borderColor;
    }
    return style;
  }

  get style() {
    const style: any = {};
    if (this.textColor) {
      style['color'] = this.textColor;
    }
    if (this.textThickness) {
      style['font-weight'] = this.textThickness;
    }
    return style;
  }

  textClick(text) {
    if (this.runMode === 'design') {
      this.$emit('click', text);
    }
  }

  // 当前设计区域的渲染态：design, preview, runtime
  get runMode() {
    return this.$uiEngine.runMode as 'design' | 'preview' | 'runtime';
  }

  created() {
    this.defaultImg = require('./default.jpg');
  }

  gotoLink(item) {
    if (this.runMode !== 'runtime') {
      return;
    }
    switch (item.gotoType) {
      case 0:
        // 链接到模型
        if (!item.bizModel) {
          return;
        }
        this.gotoBizModel(item.bizModel, item.openType);
        break;
      case 1:
        // 链接到应用首页
        if (!item.app) {
          return;
        }
        this.gotoApp(item.app, item.openType);
        break;
      case 2:
        this.gotoPage(item.gotoPage, item.openType);
        break;
      case 3:
        // 链接到URL页面
        if (!item.linkUrl) {
          return;
        }
        this.gotoURL(item.linkUrl, item.openType);
        break;

      default:
        break;
    }
  }

  async gotoBizModel(bizModel: string, openType: openType) {
    // 跳转模型
    const res: any = await listApi.getAppCodeByModelCode({
      schemaCode: bizModel,
    });
    if (res.errcode === 0) {
      if (res.data.type === 'Report') {
        window.open(
          `/application/${res.data.appCode}/application-report/${bizModel}?parentId=${res.data.parentId}&code=${res.data.code}&openMode=&pcUrl=&queryCode=&return=${location.pathname}`,
          openType,
        );
      } else {
        window.open(
          `/application/${res.data.appCode}/application-list/${bizModel}?parentId=${res.data.parentId}&code=${res.data.code}&openMode=&pcUrl=&queryCode=&return=${location.pathname}`,
          openType,
        );
      }
    }
  }

  gotoApp(app: string, openType: openType) {
    // 跳转应用
    window.open(`/application/${app}?return=${location.pathname}`, openType);
  }

  gotoPage(page: string, openType: openType) {
    // 跳转页面
    const mappings = {
      defaultPortalDashboard: '/portal-page/defaultPortalDashboard',
      defaultWorkflowCenter: '/workflow-center/my-unfinished-workitem',
      defaultApplicationList: '/app-list/applications',
    };
    if (mappings[page]) {
      window.open(mappings[page] + '?return=' + location.pathname, openType);
    } else {
      if (openType === '_blank') {
        window.open(`/portal-page/${page}`, openType);
      } else {
        this.$router.push({
          name: 'portalPage',
          params: {
            pageCode: page,
          },
        });
      }
    }
  }

  gotoURL(linkUrl: string, openType: openType) {
    // 跳转URL
    window.open(linkUrl + '?return=' + location.pathname, openType);
  }

  getSrc(refId) {
    if (!refId) {
      return '';
    }
    return getDownloadUrlNew.getImageUrl(refId);
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.carousel {
  width: 100%;
  overflow: hidden;
  // min-height: 100px;
  height: 100%;
}

.img-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  img {
    // padding: 0 1px;
    // width: 100%;
    // height: 100%;
    // object-fit: contain;
    // position: absolute;
    left: 50%;
    top: 50%;
    // transform: translate(-50%, -50%);
    &.FitHeight {
      height: 100%;
    }
    &.FitWidth {
      width: 100%;
    }
    &.FillAll {
      height: 100%;
      width: 100%;
    }
    &.Scale {
      //height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }
}

.ant-carousel {
  height: 100%;
  /deep/.slick-slider {
    height: 100%;
    .slick-list {
      height: 100%;
      .slick-track {
        height: 100%;
      }
    }
  }
  /deep/.slick-slide {
    text-align: center;
    overflow: hidden;
    height: 100%;
    & > div {
      height: 100%;
    }
  }
  /deep/.slick-slide h3 {
    color: #fff;
  }
  /deep/.slick-dots {
    li {
      margin: 0 3px;
      button {
        width: 6px;
        height: 6px;
        border-radius: 4px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.65);
      }
    }
  }
  /deep/.custom-slick-arrow {
    display: none !important;
    span {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background-color: rgba(0, 0, 0, 0.25);
      display: flex;
      justify-content: center;
      align-items: center;
      em {
        color: #fff;
        font-size: 12px;
      }
      // &:hover {
      //   em {
      //     color: @primaryColor;
      //   }
      // }
    }
  }
  &:hover {
    /deep/.custom-slick-arrow {
      display: block !important;
    }
  }
}
</style>
