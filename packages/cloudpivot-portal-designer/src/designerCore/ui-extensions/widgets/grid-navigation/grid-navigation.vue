<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    ref="grid-card"
    class="designer-grid-navigation grid-navigation"
    :style="wrapStyle"
    @click="textClick"
  >
    <div class="header">
      <div v-if="!!componentIcon" class="header-icon">
        <img
          v-if="
            componentIcon.includes('http') || componentIcon.includes('/api')
          "
          :src="componentIcon"
          alt="icon"
        />
        <em
          v-else
          class="icon aufontAll"
          :class="componentIcon"
          :style="style"
        ></em>
      </div>
      <!-- <span class="title-text" :style="style">{{ componentTitle }}</span> -->
      <span class="title-text" :style="style">{{
        getTabTitle(componentTitle)
      }}</span>
    </div>
    <div v-if="navigator.length > 0" class="grid-navigation-wrapper">
      <template v-for="(item, index) in navigator">
        <div
          v-if="gridMoreCount >= navigator.length - 1 || index < gridMoreCount"
          :key="index"
          class="list-item"
          @click="jumpTo(item)"
        >
          <div v-if="!!item.icon" :class="['icon-area', navigatorIconSize]">
            <img
              v-if="item.icon.includes('http') || item.icon.includes('/api')"
              :src="item.icon"
              alt="icon"
            />
            <em v-else class="icon aufontAll" :class="item.icon"></em>
          </div>
          <div v-else :class="['icon-area', navigatorIconSize]">
            <svg class="img-first" aria-hidden="true">
              <use xlink:href="#h-icon-all-application1" />
            </svg>
          </div>
          <!-- <div class="navigator-title" :style="style" :title="item.title">
            {{ item.title }}
          </div> -->
          <div
            class="navigator-title"
            :style="style"
            :title="getTabTitle(item.title)"
          >
            {{ getTabTitle(item.title) }}
          </div>
        </div>
      </template>

      <div
        v-if="gridMoreCount < navigator.length - 1"
        key="more"
        class="list-item"
      >
        <a-popover placement="bottom" overlayClassName="more-navigator-popover">
          <template slot="content">
            <template v-for="(item, index) in navigator">
              <div
                v-if="index >= gridMoreCount"
                :key="index"
                class="more-list-item"
                @click="jumpTo(item)"
              >
                <div v-if="!!item.icon" class="icon-area">
                  <img
                    v-if="
                      item.icon.includes('http') || item.icon.includes('/api')
                    "
                    :src="item.icon"
                    alt="icon"
                  />
                  <em v-else class="icon aufontAll" :class="item.icon"></em>
                </div>
                <div v-else class="icon-area">
                  <svg class="img-first" aria-hidden="true">
                    <use xlink:href="#h-icon-all-application1" />
                  </svg>
                </div>
                <!-- <div class="navigator-title" :style="style" :title="item.title">
                  {{ item.title }}
                </div> -->
                <div
                  class="navigator-title"
                  :style="style"
                  :title="getTabTitle(item.title)"
                >
                  {{ getTabTitle(item.title) }}
                </div>
              </div>
            </template>
          </template>
          <div :class="['icon-area', 'more', navigatorIconSize]">
            <img src="../../../../assets/img/more-navigator.png" />
          </div>
          <div class="navigator-title" :style="style">更多</div>
        </a-popover>
      </div>
    </div>
    <div v-else class="grid-navigation-wrapper no-nav">
      <div v-if="runMode === 'runtime'" class="runtime-mode">
        <img
          v-if="!heightNoMoreThanMAX"
          :src="require('../../../../assets/img/no-navigator.png')"
          alt="暂无图片"
        />
        <span>暂无数据</span>
      </div>
      <EmptyDataSource v-else :emptyText="'您还没配置组件样式或展示内容哦～'" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Popover } from '@h3/antd-vue';
import { listApi } from 'cloudpivot/api';
import { EmptyDataSource } from '@portal-designer/toolbox';

interface SHORTCUT {
  appCode: string;
  appName: string;
  appName_i18n: string;
  code: string;
  icon: string;
  id: string;
  name: string;
  name_i18n: string;
  type: string;
}

@Component({
  components: {
    // AIcon: Icon
    APopover: Popover,
    EmptyDataSource,
  },
})
export default class GridNavigator extends Vue {
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

  @Prop({
    default: '宫格导航',
  })
  componentTitle!: string;

  @Prop({ default: 'h-icon-all-yingyong' })
  componentIcon!: string;

  @Prop({ default: 'medium' })
  navigatorIconSize!: string;

  @Prop()
  navigator!: any[];

  //超出区域显示更多
  gridMoreCount: number = Infinity;

  heightNoMoreThanMAX: boolean = false;

  moreItemBoxVisible: boolean = false;

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
    this.$emit('click', text);
  }

  // 当前设计区域的渲染态：design, preview, runtime
  get runMode() {
    return this.$uiEngine.runMode as 'design' | 'preview' | 'runtime';
  }

  mounted() {
    const resizeObserver = new ResizeObserver(() => {
      {
        this.resizeWindow();
      }
    });
    const gridContent: any = this.$refs['grid-card'];
    resizeObserver.observe(gridContent);

    this.resizeWindow();

    const Max = 230;
    if (gridContent && gridContent.clientHeight - 58 < Max) {
      this.heightNoMoreThanMAX = true;
    }
  }

  resizeWindow() {
    const gridContent: any = this.$refs['grid-card'];
    if (gridContent?.clientHeight) {
      this.gridMoreCount =
        Math.floor((gridContent.clientWidth - 24) / 144) *
          Math.floor((gridContent.clientHeight - 58) / 142) -
        1;
    }
  }

  /**
   * 导航跳转逻辑
   */
  async jumpTo(navigator) {
    if (this.runMode !== 'runtime') {
      return;
    }
    let jumpMethod = null;
    let jumpPath = '';
    //确定跳转方式
    if (navigator.openMode === 'curPage') {
      jumpMethod = (path) => {
        if (path.indexOf('https://') > -1 || path.indexOf('http://') > -1) {
          window.open(path, '_self');
        } else {
          this.$router.push(path);
        }
      };
    } else {
      jumpMethod = (path) => window.open(path, '_blank');
    }

    //确定导航地址
    if (navigator.actionType === 'app' && navigator.app) {
      jumpPath =
        location.origin +
        '/application/' +
        navigator.app +
        '?return=' +
        location.pathname;
    } else if (navigator.actionType === 'bizModel' && navigator.bizModel) {
      const res: any = await listApi.getAppCodeByModelCode({
        schemaCode: navigator.bizModel as any,
      });
      if (res.errcode === 0) {
        if (res.data.type === 'Report') {
          jumpPath = `/application/${res.data.appCode}/application-report/${navigator.bizModel}?parentId=${res.data.parentId}&code=${res.data.code}&openMode=&pcUrl=&queryCode=&return=${location.pathname}`;
        } else {
          jumpPath = `/application/${res.data.appCode}/application-list/${navigator.bizModel}?parentId=${res.data.parentId}&code=${res.data.code}&openMode=&pcUrl=&queryCode=&return=${location.pathname}`;
        }
      }
    } else if (navigator.actionType === 'portalPage' && navigator.portalPage) {
      // 链接到固定页面，分为系统固定的三种页面：工作台、流程中心、应用列表；
      // 这里通过固定链接URL打开，其他使用自定义页面编码打开
      switch (navigator.portalPage) {
        case 'defaultPortalDashboard':
          jumpPath =
            '/portal-page/defaultPortalDashboard' +
            '?return=' +
            location.pathname;
          break;
        case 'defaultWorkflowCenter':
          jumpPath = '/workflow-center' + '?return=' + location.pathname;
          break;
        case 'defaultApplicationList':
          jumpPath = '/app-list/applications' + '?return=' + location.pathname;
          break;
        default:
          // 自定义页面
          jumpPath = location.origin + '/portal-page/' + navigator.portalPage;
          break;
      }
    } else if (navigator.actionType === 'URL') {
      // 链接到URL页面
      if (!navigator.URL) {
        return;
      }
      jumpPath = navigator.URL + '?return=' + location.pathname;
    } else {
    }

    if (jumpMethod && jumpPath) {
      jumpMethod(jumpPath);
    }
  }

  getTabTitle(title) {
    try {
      const tabTitle = JSON.parse(title);
      return tabTitle[this.$i18n.locale] || tabTitle['zh'];
    } catch (e) {
      return title;
    }
  }
}
</script>

<style lang="less">
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.more-navigator-popover {
  .ant-popover-inner-content {
    width: 240px;
    padding: 10px 0;
    .more-list-item {
      &:hover {
        background: @hoveBGColor;
      }
      &:active {
        background: @activeBGColor;
      }
      display: flex;
      align-items: center;
      height: 36px;
      padding: 0 16px;
      cursor: pointer;
      .icon-area {
        width: 24px;
        height: 24px;
        text-align: center;
        margin-right: 8px;
        border: 1px solid #eeeeee;
        color: #2970ff;
        svg,
        img {
          height: 22px;
          width: 22px;
        }
        img {
          object-fit: cover;
        }
      }
      .navigator-title {
        text-align: center;
        color: #111218;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
      }
    }
  }
}
</style>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.ui-label {
  display: inline-flex;
}

.grid-navigation {
  border: 1px solid @primary-color;
  max-width: 100%;
  overflow: hidden;
  background-repeat: convert;
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 58px;
    line-height: 22px;
    font-size: 16px;
    color: @text-color;
    padding: 20px 24px 16px 24px;
    flex: 0;
    display: flex;
    align-items: center;
    max-width: 302px;
    .title-text {
      text-overflow: ellipsis;
      overflow: hidden;
      font-weight: 600 !important;
      white-space: nowrap;
    }
    .header-icon {
      width: 16px;
      height: 16px;
      line-height: 16px;
      margin-right: 8px;
      > img {
        width: 16px;
        height: 16px;
        vertical-align: unset;
      }
      > em {
        font-size: 16px;
        font-weight: 400 !important;
        color: @text-color;
      }
    }
  }
}
.grid-navigation-wrapper {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  padding-left: 24px;
  &.no-nav {
    padding-left: unset;
    .runtime-mode {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      img {
        width: 204px;
        height: 204px;
      }
      span {
        font-size: 12px;
        color: rgba(17, 18, 24, 0.5);
        line-height: 22px;
      }
    }
  }
  .list-item {
    width: 144px;
    height: 142px;
    border-radius: 8px;
    .icon-area {
      background: #fff;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #eeeeee;
      cursor: pointer;
      &.small {
        width: 48px;
        height: 48px;
        margin: 32px auto 8px auto;
        .icon {
          font-size: 30px;
        }
        img {
          width: 46px;
          height: 46px;
        }
        svg {
          width: 30px;
          height: 30px;
        }
      }
      &.medium {
        width: 56px;
        height: 56px;
        margin: 28px auto 8px auto;
        .icon {
          font-size: 34px;
        }
        img {
          width: 54px;
          height: 54px;
        }
        svg {
          width: 34px;
          height: 34px;
        }
      }
      &.big {
        width: 72px;
        height: 72px;
        margin: 20px auto 8px auto;
        .icon {
          font-size: 42px;
        }
        img {
          width: 70px;
          height: 70px;
        }
        svg {
          width: 42px;
          height: 42px;
        }
      }
      .icon {
        color: #2970ff;
      }
      img {
        object-fit: cover;
      }
    }
    .navigator-title {
      text-align: center;
      color: #111218;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 16px;
    }
    &:hover {
      cursor: pointer;
      background: @hoveBGColor;
    }
  }
}
</style>
