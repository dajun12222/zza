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
    <div class="header" :style="style ">
      <b></b>
      <span>{{ $t('languages.common.workBenchInfo.myApplications') }}</span>
      <span
        v-if="runMode === 'runtime' && navigator.length > 0"
        class="manage-app"
        @click="openSelectAppModel"
        >{{ $t('languages.common.workBenchInfo.manage') }}</span>
    </div>
    <div
      v-if="navigator.length > 0"
      ref="grid-content"
      :class="{
        'grid-navigation-wrapper': true,
        opacity: runMode !== 'runtime',
      }"
    >
      <template v-for="(item, index) in navigator">
        <div
          v-if="gridMoreCount >= navigator.length - 1 || index < gridMoreCount"
          :key="index"
          class="list-item"
          @click="jumpTo(item)"
        >
          <app-icon :appData="item" />
          <div
            class="navigator-title"
            :style="style"
            :title="getDisplayName(item)"
          >
            {{ getDisplayName(item) }}
          </div>
        </div>
      </template>

      <div
        v-if="gridMoreCount < navigator.length - 1"
        key="more"
        ref="moreApplication"
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
                <app-icon :appData="item" />
                <div
                  class="navigator-title"
                  :style="style"
                  :title="getDisplayName(item)"
                >
                  {{ getDisplayName(item) }}
                </div>
              </div>
            </template>
          </template>
          <div :class="['app-icon', navigatorIconSize]">
            <img src="../../../../assets/img/more-navigator.png" />
          </div>
          <div class="navigator-title" :style="style">
            {{ $t('languages.common.workBenchInfo.more') }}
          </div>
        </a-popover>
      </div>
    </div>

    <default-content
      v-if="navigator.length === 0 || runMode !== 'runtime'"
      :class="{
        float: runMode !== 'runTime',
      }"
      :runMode="runMode"
      @openManageModal="openSelectAppModel"
    />

    <a-modal
      v-model="modalVisible"
      :title="$t('languages.common.workBenchInfo.appManagement')"
      wrapClassName="app-manage-modal"
      width="800px"
      centered
      @cancel="onCancel"
      @ok="onOk"
    >
      <SelectApp
        :allApps="allApps"
        :selectedApps="backData"
        @select="addSelectedApp"
        @unSelect="deleteSelectedApp"
      />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Popover, Button, Modal } from '@h3/antd-vue';
import { listApi } from 'cloudpivot/api';
import InputSearch from 'cloudpivot/common/src/components/shared/inputSearch.vue';
import SelectApp from './component/select-app.vue';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
import AppIcon from './component/app-icon.vue';
import DefaultContent from './component/default-content.vue';

@Component({
  components: {
    // AIcon: Icon
    APopover: Popover,
    InputSearch,
    SelectApp,
    AppIcon,
    AButton: Button,
    DefaultContent,
    AModal: Modal,
  },
})
export default class MyApplication extends Vue {
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

  @Prop({ default: 'medium' })
  navigatorIconSize!: string;

  navigator: any[] = [];

  backData: any[] = [];

  //超出区域显示更多
  gridMoreCount: number = Infinity;

  allApps: any[] = [];

  field: string = '';

  modalVisible: boolean = false;

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
    style['box-shadow'] ='0px 0px 5px #e5e5e5';
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
    // style['border-bottom'] = '0.5px solid #e5e5e5';
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
  }

  created() {
    this.initNavigator();
  }

  initNavigator() {
    if (this.runMode !== 'runtime') {
      this.navigator = [
        {
          icon: 'h-icon-all-simple-kanban-o',
          name: '应用1',
        },
        {
          icon: 'h-icon-all-simple-kanban-o',
          name: '应用2',
        },
        {
          icon: 'h-icon-all-simple-kanban-o',
          name: '应用3',
        },
      ];
    } else {
      this.listFavorite().then((res: any) => {
        if (res.errcode === 0) {
          this.navigator = res.data || [];
        }
      });
    }
  }

  /**
   * 获取所有能看到的应用
   */
  async listAllApp() {
    return listApi.list({ isMobile: false, isPortal: true });
  }

  /**
   * 获取所有已添加到我的应用的应用
   */
  async listFavorite() {
    return listApi.listFavorite({ isMobile: false });
  }

  resizeWindow() {
    const gridContent: any = this.$refs['grid-card'];
    if (gridContent?.clientHeight) {
      this.gridMoreCount =
        Math.floor((gridContent.clientWidth - 14) / 98) *
          Math.floor((gridContent.clientHeight - 58) / 98) -
        1;

    }
  }

  /**
   * 导航跳转逻辑
   */
  async jumpTo(navigator) {
    window.open(
      location.origin +
        '/application/' +
        navigator.code +
        '?return=' +
        location.pathname,
      '_self',
    );
  }

  openSelectAppModel() {
    this.backData = [...this.navigator];
    if (this.allApps.length === 0) {
      this.listAllApp().then((res: any) => {
        if (res.errcode === 0) {
          this.allApps = res.data.map((item, index) =>
            Object.assign(item, {
              selected: this.navigator.some((nav) => {
                if (nav.code === item.code) {
                  nav.index = index;
                }
                return nav.code === item.code;
              }),
            }),
          );
        }
      });
    }
    this.modalVisible = true;
  }

  onCancel() {
    this.modalVisible = false;
    this.allApps.forEach((item, index) => {
      if (this.navigator.some((el) => el.index === index)) {
        this.$set(item, 'selected', true);
      } else {
        this.$set(item, 'selected', false);
      }
    });
    this.backData = [];
  }

  onOk() {
    this.modalVisible = false;
    this.navigator = [...this.backData];
    this.backData = [];
    this.updateFavorite();
  }

  addSelectedApp(item) {
    this.backData.push(item);
  }

  deleteSelectedApp(index) {
    this.backData.splice(index, 1);
  }

  getDownloadUrlNew(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId);
  }

  updateFavorite() {
    listApi.createFavorite({
      appCodeList: this.navigator.map((item) => item.code),
    });
  }

  getDisplayName(item) {
    let name: string = item.name;
    if (item.name_i18n) {
      const name_i18n =
        typeof item.name_i18n === 'object'
          ? item.name_i18n
          : JSON.parse(item.name_i18n);
      name = name_i18n[this.$i18n.locale] || name;
    }
    return name;
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
      .app-icon {
        width: 24px;
        height: 24px;
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #eeeeee;
        img,
        svg {
          height: 16px;
          width: 16px;
        }
      }
      .navigator-title {
        text-align: center;
        color: #111218;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

.app-manage-modal {
  .ant-modal-close-x {
    height: 72px !important;
    width: 72px !important;
    i {
      font-size: 20px;
    }
  }
  .ant-modal-body {
    padding: 0px;
    margin: 0 24px;
    border: 1px solid #dddddd;
    border-radius: 2px;
  }
  .ant-modal-header {
    border-bottom: none;
    padding: 24px;
    font-weight: 600;
    color: #111218;
    line-height: 24px;
    font-size: 16px;
    .ant-modal-title {
      font-weight: 600;
      color: #111218;
      line-height: 24px;
      font-size: 16px;
    }
  }
  .ant-modal-footer {
    border-top: none;
    height: 80px;
    padding: 24px;
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
  position: relative;
  .header {
    height: 50px;
    line-height: 22px;
    font-size: 16px;
    font-weight: 600 !important;
    color: @text-color;
    padding: 20px 24px 16px 24px;
    flex: 0;
    display: flex;
    align-items: center;
    border-bottom: 0.5px solid #e5e5e5;
    margin-bottom: 8px;
    > b {
      display: inline-block;
      width: 3px;
      height: 14px;
      background: linear-gradient(180deg, #017CC6 0%, #004E92 100%);
      margin-right: 8px;
      margin-top: 1px;
    }
    .manage-app {
      cursor: pointer;
      color: #2970ff;
      font-size: 14px;
      padding-left: 8px;
      font-weight: 400;
    }
  }
  .float {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }
}
.grid-navigation-wrapper {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  padding-left: 14px;
  &.opacity {
    opacity: 0.2;
  }
  .list-item {
    // width: 144px;
    // height: 142px;
    width: 96px;
    height: 96px;
    border-radius: 8px;
    .navigator-title {
      text-align: center;
      color: #111218;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 4px;
      font-size: 12px;
    }
    /deep/.app-icon {
      cursor: pointer;
      // width: 56px;
      // height: 56px;
      width: 30px;
      height: 30px;
      margin: 20px auto 8px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #eeeeee;
      background: #fff;
      border-radius: 2px;
      img {
        height:36px;
        width:36px;
      }

      svg {
        height: 38px;
        width: 38px;
      }
    }
    &:hover {
      cursor: pointer;
      background: @hoveBGColor;
    }
  }
}

.my-app-design-mode {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .text-area {
    padding-bottom: 24px;
    .icon {
      color: #faad14;
      font-size: 14px;
      margin-right: 8px;
    }
  }
  /deep/button {
    border-radius: 2px;
    border: 1px solid #2970ff;
    span {
      color: #2970ff;
    }
  }
}
</style>
