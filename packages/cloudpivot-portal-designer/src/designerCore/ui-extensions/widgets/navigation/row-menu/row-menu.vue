<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="row-header" :class="outwardType" @click="textClick">
    <template v-if="showAction">
      <div class="logo">
        <img v-if="logoSrc" :src="logoSrc" alt="logo" />
        <img v-else src="../yslogo.png" alt="logo" />
      </div>
      <div id="navigatorList" ref="navigatorList" class="nav">
        <template v-for="(item, index) in navigatorView">
          <div
            :key="index"
            class="nav-item"
            :class="[getClass(item), outwardType]"
            @click="goTo(item)"
          >
            <div v-if="!!item.icon" class="nav-icon">
              <img
                v-if="item.icon.includes('http') || item.icon.includes('/api')"
                :src="item.icon"
                alt="icon"
              />
              <em v-else class="icon aufontAll" :class="item.icon"></em>
            </div>
            <div v-else class="nav-icon">
              <svg class="tabs-app-li-icon icon svgIcon" aria-hidden="true">
                <use xlink:href="#h-icon-all-application1" />
              </svg>
            </div>
            <!-- <span>{{ item.title }}</span> -->
            <span>{{ getTabTitle(item.title) }}</span>
          </div>
        </template>
        <div
          v-if="navigatorMore.length > 0"
          class="more-nav-item"
          :class="{
            active: navigatorMore.includes(curNavigatorInfo),
            expend: showNavigatorMoreList,
          }"
        >
          <a-popover
            :visible="showNavigatorMoreList"
            trigger="click"
            placement="bottomRight"
            overlayClassName="navigator-list"
          >
            <template slot="content">
              <div>
                <div
                  v-for="(item, index) in navigatorMore"
                  :key="index"
                  class="list-item"
                  :class="[getClass(item), outwardType]"
                  @click="goTo(item)"
                >
                  <!-- <div
                    class="item-name"
                    :title="
                      (item.title_i18n && item.title_i18n[$i18n.locale]) ||
                      item.title
                    "
                  > -->
                  <div
                    class="item-name"
                    :title="
                      (item.title_i18n && item.title_i18n[$i18n.locale]) ||
                      getTabTitle(item.title)
                    "
                  >
                    <div v-if="!!item.icon" class="nav-icon">
                      <img
                        v-if="
                          item.icon.includes('http') ||
                          item.icon.includes('/api')
                        "
                        :src="item.icon"
                        alt="icon"
                      />
                      <em v-else class="icon aufontAll" :class="item.icon"></em>
                    </div>
                    <div v-else class="nav-icon">
                      <svg
                        class="tabs-app-li-icon icon svgIcon"
                        aria-hidden="true"
                      >
                        <use xlink:href="#h-icon-all-application1" />
                      </svg>
                    </div>
                    <!-- <span>{{ item.title }}</span> -->
                    <span>{{ getTabTitle(item.title) }}</span>
                  </div>
                </div>
              </div>
            </template>
            <div
              class="nav-item-box"
              :class="[{ active: showNavigatorMoreList }, outwardType]"
              @click="showNavigatorMoreList = !showNavigatorMoreList"
            >
              <span class="icon aufontAll">&#xe7a9;</span>
              <span class="list-name">更多</span>
              <div
                v-show="showNavigatorMoreList"
                class="filter-mask"
                @click.stop="showNavigatorMoreList = false"
              ></div>
            </div>
          </a-popover>
        </div>
      </div>
    </template>
    <div v-else style="flex: 1"></div>
    <div class="right-operation">
      <template v-if="runMode === 'runtime'">
        <menuOperation />
      </template>

      <div v-else class="operation-wrapper">
        <div class="item">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>搜索</span>
            </template>
            <span>
              <em class="icon aufontAll h-icon-all-search"></em>
            </span>
          </a-tooltip>
        </div>

        <div class="item">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>更换主题</span>
            </template>
            <em class="icon aufontAll h-icon-all-palette-o"></em>
          </a-tooltip>
        </div>

        <div class="item">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>后台管理</span>
            </template>
            <em class="icon aufontAll h-icon-all-desktop1"></em>
          </a-tooltip>
        </div>

        <div class="item">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>消息通知</span>
            </template>
            <em class="icon aufontAll h-icon-all-bells-o"></em>
          </a-tooltip>
        </div>

        <div class="item">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>帮助中心</span>
            </template>
            <em class="icon aufontAll h-icon-all-book1"></em>
          </a-tooltip>
        </div>

        <div class="item">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>中英切换</span>
            </template>
            <span style="font-size: 14px">{{
              $i18n.locale === 'zh' ? 'EN' : '中文'
            }}</span>
          </a-tooltip>
        </div>

        <div>
          <span>
            {{ loginedUserName ? loginedUserName : 'admin' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Popover, Tooltip } from '@h3/antd-vue';
import { listApi } from 'cloudpivot/api';
import { utils } from 'cloudpivot/common';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {
    menuOperation: () => import('./menu-operation.vue'),
    ATooltip: Tooltip,
    APopover: Popover,
  },
})
export default class rowMenu extends Vue {
  @Prop()
  navigator!: any[];

  loginedUserName: string = '';

  textClick(text) {
    if (this.runMode === 'design') {
      this.$emit('click', text);
    }
  }

  getClass(item) {
    if (item.portalPage === this.$route.name) {
      return 'active';
    }
    if (this.$route.params.pageCode === item.portalPage && item.portalPage) {
      return 'active';
    }
  }

  get logoSrc() {
    const refId: string = this.$store.state.themsConfig.portalLogo;
    return refId ? this.getDownloadUrlByRefId(refId) : '';
  }

  getDownloadUrlByRefId(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId, 'logo');
  }

  // 当前设计区域的渲染态：design, preview, runtime
  get runMode() {
    return this.$uiEngine.runMode as 'design' | 'preview' | 'runtime';
  }

  created() {
    const user = sessionStorage.getItem('user');
    if (user) {
      this.loginedUserName = JSON.parse(user).username;
    }
  }

  @Watch('navigator')
  onNavigatorChange(val: string) {
    this.navigatorList = this.navigator;
    this.initNavigatorBoxInfo();
  }

  showAction: boolean = true;

  mounted() {
    this.navigatorList = this.navigator;
    this.navigatorList.forEach((el) => {
      el = this.calcNameLength(el);
    });
    this.initNavigatorBoxInfo();
    const resizeObserver = new ResizeObserver(() => {
      {
        this.initNavigatorBoxInfo();
      }
    });
    const navigatorList = this.$refs['navigatorList'] as HTMLElement;
    resizeObserver.observe(navigatorList);

    const that = this;
    this.$uiEngine.currentPage.documentApp.event.subscribe((evt) => {
      const data: any = this.$uiCurrentPage.snapshot().document;
      const values = Object.values(data);
      that.showAction = !values.some((el: any) => el.type === 'ColMenu');
    });

    that.showAction = !Object.values(
      this.$uiCurrentPage.snapshot().document,
    ).some((el: any) => el.type === 'ColMenu');

    if (this.runMode === 'runtime') {
      const widgets: any = document.querySelectorAll('.ui-grid-widget');
      if (widgets) {
        widgets.forEach((widget: any,index:any) => {
          if (widget.querySelector('.row-header')) {
            widget.classList.add('has-row-header');
          }
          if(index===1){
            widget.classList.add('swiper_box');
          }
          if(index===2){
            widget.classList.add('de_content');    
          }
          
        });
      }
    }
  }

  async goTo(item) {
    if (this.runMode !== 'runtime') {
      return;
    }
    const actionType = item.actionType;
    let url: string = '';
    switch (actionType) {
      case 'URL':
        // 链接到URL页面
        if (!item.URL) {
          return;
        }
        url = item.URL + '?return=' + location.pathname;
        break;
      case 'portalPage':
        // 链接到固定页面，分为系统固定的三种页面：工作台、流程中心、应用列表；
        // 这里通过固定链接URL打开，其他使用自定义页面编码打开
        switch (item.portalPage) {
          case 'defaultPortalDashboard':
            url =
              '/portal-page/defaultPortalDashboard' +
              '?return=' +
              location.pathname;
            break;
          case 'defaultWorkflowCenter':
            url = '/workflow-center' + '?return=' + location.pathname;
            break;
          case 'defaultApplicationList':
            url = '/app-list/applications' + '?return=' + location.pathname;
            break;
          default:
            // 自定义页面
            url = `/portal-page/${item.portalPage}`;
            break;
        }
        break;
      case 'app':
        // 链接到应用首页
        if (!item.app) {
          return;
        }
        url = `/application/${item.app}?return=${location.pathname}`;
        break;
      case 'bizModel':
        // 链接到模型
        if (!item.bizModel) {
          return;
        }
        const res: any = await listApi.getAppCodeByModelCode({
          schemaCode: item.bizModel as any,
        });
        if (res.errcode === 0) {
          if (res.data.type === 'Report') {
            url = `/application/${res.data.appCode}/application-report/${item.bizModel}?parentId=${res.data.parentId}&code=${res.data.code}&openMode=&pcUrl=&queryCode=&return=${location.pathname}`;
          } else {
            url = `/application/${res.data.appCode}/application-list/${item.bizModel}?parentId=${res.data.parentId}&code=${res.data.code}&openMode=&pcUrl=&queryCode=&return=${location.pathname}`;
          }
        }
        break;
      default:
        break;
    }

    if (item.openMode === 'curPage') {
      if (url.indexOf('https://') > -1 || url.indexOf('http://') > -1) {
        window.open(url, '_self');
      } else {
        this.$router.push(url);
      }
    } else {
      window.open(url, '_blank');
    }
  }

  get outwardType() {
    // 获取主题外观
    return this.$store.state.outwardType;
  }

  navigatorView: any[] = [];

  navigatorMore: any[] = [];

  navigatorList: any[] = [];

  navigatorListBox: number;

  showNavigatorMoreList: boolean = false;

  curNavigatorInfo: any = {};

  showIcon: boolean = false;

  initNavigatorBoxInfo() {
    const navigatorListEl = this.$refs['navigatorList'] as HTMLElement;
    if (navigatorListEl) {
      // console.log(navigatorListEl.offsetWidth);
      this.navigatorListBox = navigatorListEl.offsetWidth;
      this.getNavigatorListBox();
    }
  }

  calcNameLength(el: any) {
    if (el.title) {
      el.length = utils.calcStrLength(el.title);
      // console.log(el.title, el.length);
    }
    if (el.title_i18n) {
      el.length_i18n = {};
      for (const locale in el.title_i18n) {
        if (el.title_i18n.hasOwnProperty(locale)) {
          el.length_i18n[locale] = utils.calcStrLength(el.title_i18n[locale]);
        }
      }
    }
    return el;
  }

  getNavigatorListBox() {
    let conWidth = 0;
    this.navigatorView = [];
    this.navigatorMore = [...this.navigatorList];
    const navigatorMoreLength = this.navigatorMore.map(
      (el) => el.length_i18n?.[this.$i18n.locale] || el.length,
    );
    while (this.navigatorMore.length > 0) {
      const theListItem = this.navigatorMore.shift();
      const theListItemLength = navigatorMoreLength.shift();
      // console.log(theListItemLength);
      conWidth += theListItemLength > 16 ? 188 : theListItemLength * 8 + 60;
      if (conWidth + 94 > this.navigatorListBox) {
        this.navigatorMore.unshift(theListItem);
        break;
      } else {
        if(theListItem && theListItem.title && theListItem.title !== '流程中心'){
          this.navigatorView.push(theListItem);
        }
        
      }
      // console.log(this.navigatorView);
      // console.log(this.navigatorMore);
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

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.row-header {
  height: 100%;
  line-height: 60px;
  width: 100%;
  display: flex;
  border-bottom: 1px solid #eee;
  background: @headBGColor;
  .logo {
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding-left: 10px;
    padding-right: 50px;
    img {
      height: 30px;
    }
    flex-shrink: 0;
  }
  .nav {
    flex: 1;
    display: flex;
    overflow: hidden;
    .nav-item {
      position: relative;
      display: flex;
      align-items: center;
      height: 100%;
      border-bottom: 1px solid transparent;
      font-size: 16px;
      line-height: 57px;
      padding: 0 16px;
      max-width: 188px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      flex-shrink: 0;
      .nav-icon {
        width: 16px;
        height: 16px;
        line-height: 16px;
        margin-right: 12px;
        > img,
        > svg {
          width: 16px;
          height: 16px;
          vertical-align: unset;
        }
        > em {
          font-size: 16px;
        }
      }
      > span {
        max-width: 128px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &.active {
        color: @highlightColor;
        &::after {
          content: '';
          position: absolute;
          height: 0;
          width: 94px;
          bottom: 0;
          left: 50%;
          transform: translate(-50%);
          box-sizing: border-box;
          border-bottom: 3px solid @primaryColor;
        }
      }
      &:hover {
        color: @highlightColor;
      }
    }
    .more-nav-item {
      padding: 17px 10px;
      height: 64px;
      margin-bottom: 1px;
      .nav-item-box {
        position: relative;
        line-height: 30px;
        z-index: 1;
        display: flex;
        align-items: center;
        height: 30px;
        border-radius: 4px;
        padding: 4px 6px;
        .list-name {
          display: inline-block;
          font-size: 16px;
          font-weight: 400;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          height: 22px;
          line-height: 22px;
        }
        .icon {
          display: inline-block;
          font-size: 20px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          font-weight: 400;
          margin-right: 10px;
        }
        &:hover,
        &.active {
          cursor: pointer;
          background: @hoveBGColor;
          .list-name,
          .icon {
            color: @highlightColor;
          }
        }
      }
    }
  }
  .right-operation {
    // flex-basis: 410px;
    padding-right: 32px;
    padding-left: 40px;
    .operation-wrapper {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      .item {
        cursor: pointer;
        font-size: 20px;
        margin-left: 12px;
        margin-right: 12px;
        em {
          font-size: 20px;
        }
        &:hover {
          color: @hoverColor;
        }
      }
    }
  }
}
.dark {
  .nav {
    .nav-item {
      color: #fff;
      opacity: 0.8;
      &.active {
        background-color: @headMenuActiveColor;
        color: #fff;
        border-bottom: 3px solid transparent;
        opacity: 1;
        &::after {
          display: none;
        }
      }
      &:hover {
        color: #fff;
        opacity: 1;
      }
    }
    .more-nav-item {
      .nav-item-box {
        .list-name,
        .icon {
          color: @textColor;
          opacity: 0.8;
        }
        &:hover,
        &.active {
          .list-name,
          .icon {
            color: @textColor;
            opacity: 1;
          }
          background: rgba(17, 18, 24, 0.08);
        }
      }
    }
  }
}

.filter-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  z-index: 1;
}
</style>
<style lang="less">
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.navigator-list {
  padding: unset;
  .ant-popover-arrow {
    display: none;
  }
  .ant-popover-inner-content {
    padding: 4px 0;
    .list-item {
      width: 206px;
      height: 46px;
      padding: 12px 24px;
      .item-name {
        display: flex;
        align-items: center;
        .nav-icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          line-height: 20px;
          margin-right: 10px;
          > em {
            display: inline-block;
            width: 20px;
            height: 20px;
            line-height: 20px;
            font-size: 20px;
            color: #111218;
          }
          > svg,
          > img {
            width: 20px;
            height: 20px;
          }
        }
        > span {
          display: inline-block;
          height: 22px;
          font-size: 16px;
          font-weight: 400;
          color: #111218;
          line-height: 22px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      &.active {
        background: @activeBGColor;
      }
      &:hover {
        background: @hoveBGColor;
        cursor: pointer;
      }
    }
  }
}


</style>
