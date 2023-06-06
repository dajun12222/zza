<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="menu-operation">
    <div v-if="isDingTalk" class="op-item" style="width: 98px">
      <!-- 在浏览器中打开 -->
      <a v-if="isDingTalk" class="open-blank" @click.prevent="openBlank">{{
        $t('languages.common.openInBrowser')
      }}</a>
    </div>

    <!-- 搜索 -->
    <div class="op-item">
      <a-popover
        v-model="searchVisible"
        trigger="click"
        overlayClassName="search-wrapper"
      >
        <template slot="content">
          <div class="search-wrapper-in" @click.stop.self="() => {}">
            <SearchResulte
              :moveIn="moveIn"
              @goToDetail="goToDetail"
              @close="closeSearchResulte"
            />
          </div>
        </template>
        <!-- <a-tooltip placement="bottom">
          <template slot="title">
            <span>{{ $t('languages.common.search') }}</span>
          </template>
          <span class="icon-wrapper">
            <em
              class="icon aufontAll h-icon-all-search"
              @click.stop.self="toggleSearchVisible"
            ></em>
          </span>
        </a-tooltip> -->
      </a-popover>
    </div>

    <!-- 主题设置 -->
    <div v-if="admin" class="op-item">
      <a-tooltip placement="bottom">
        <template slot="title">
          <span>{{ $t('languages.common.changeTheme') }}</span>
        </template>
        <span class="icon-wrapper" @click="toChangeTheme">
          <em class="icon aufontAll h-icon-all-palette-o"></em>
        </span>
      </a-tooltip>
    </div>

    <!-- 后台管理 -->
    <div v-if="isAdmin" class="op-item">
      <a-tooltip placement="bottom">
        <template slot="title">
          <span>{{ $t('languages.common.backStageManager') }}</span>
        </template>
        <span class="icon-wrapper" @click="toAdmin">
          <em class="icon aufontAll h-icon-all-desktop1"></em>
        </span>
      </a-tooltip>
    </div>

    <!-- 消息通知 -->
    <div class="op-item">
      <a-popover
        overlayClassName="help-center"
        placement="bottom"
        trigger="hover"
        @visibleChange="noticeTipsVisibleChange"
      >
        <template slot="content">
          <noticeTips ref="noticeTips" />
        </template>
        <span class="notice-icon-wrapper">
          <span v-if="noticesCount" class="font-ele"></span>
          <em class="icon aufontAll h-icon-all-bells-o"></em>
        </span>
      </a-popover>
    </div>

    <!-- 帮助中心 -->
    <div class="op-item">
      <a-popover
        overlayClassName="help-center"
        placement="bottom"
        trigger="hover"
      >
        <template slot="content">
          <div class="help-placeholder"></div>
          <div class="help-content">
            <a
              class="content-li"
              href="https://zhsj.yuque.com/org-wiki-zhsj-gtls6e/hefaat?# "
              target="_blank"
              :title="$t('languages.common.helpList.userManual')"
            >
              <span>{{ $t('languages.common.helpList.userManual') }}</span>
            </a>
            <!-- <a
              class="content-li"
              href="https://www.yuque.com/skwme4/grmb6s"
              target="_blank"
              :title="$t('languages.common.helpList.video')"
            >
              <span>{{ $t('languages.common.helpList.video') }}</span>
            </a>
            <a
              class="content-li"
              href="https://www.yuque.com/skwme4/hzo079"
              target="_blank"
              :title="$t('languages.common.helpList.developer')"
            >
              <span>{{ $t('languages.common.helpList.developer') }}</span>
            </a>
            <a
              v-if="isAdmin"
              class="content-li"
              href="http://service.authine.com:90"
              target="_blank"
              :title="$t('languages.common.helpList.customerService')"
            >
              <span>{{ $t('languages.common.helpList.customerService') }}</span>
            </a> -->
          </div>
        </template>
        <span class="icon-wrapper">
          <em class="icon aufontAll h-icon-all-book1"></em>
        </span>
      </a-popover>
    </div>

    <!-- 中英文切换 -->
    <!-- <div class="op-item">
      <a-tooltip placement="bottom">
        <template slot="title">
          <span>{{ $t('languages.common.switch') }}</span>
        </template>
        <span class="icon-wrapper" @click="toggleLanguage">{{
          $i18n.locale === 'zh' ? 'EN' : '中文'
        }}</span>
      </a-tooltip>
    </div> -->

    <div class="op-item">
      <a-popover
        v-model="visible"
        placement="bottomRight"
        trigger="hover"
        overlayClassName="help-center2"
      >
        <template slot="content">
          <div class="content-box">
            <div class="content-user-top">
              <div class="userInfo">
                <img
                  v-if="userInfo.imgUrl && userInfo.imgUrl.includes('http')"
                  :src="userInfo.imgUrl"
                />
                <img
                  v-else-if="userInfo.imgUrl || userInfo.imgUrlId"
                  :src="getDownloadUrlNew(userInfo.imgUrl || userInfo.imgUrlId)"
                />
                <em
                  v-else
                  class="icon aufontAll h-icon-all-normal_smile default-avatar"
                ></em>
                <div class="userInfo-right">
                  <h3>{{ userInfo.name }}</h3>
                  <div class="userInfo-right-cn">
                    <em class="icon aufontAll h-icon-all-tablet"></em>
                    <span>{{ userInfo.mobile || '--' }}</span>
                  </div>
                </div>
              </div>

              <div class="userInfo-organ">
                <a-tooltip>
                  <div slot="title">
                    {{ userInfo.parentDepartmentName }}
                  </div>
                  <span>
                    <em class="icon aufontAll h-icon-all-insert-row-left"></em>
                    {{ userInfo.departmentName }}
                  </span>
                </a-tooltip>
                <span v-if="isAppAdmin" class="sub-title">{{
                  $t('languages.common.ide.appAdmin')
                }}</span>
                <span v-else-if="isSysAdmin" class="sub-title">{{
                  $t('languages.common.ide.sysAdmin')
                }}</span>
              </div>
            </div>
            <div class="content-user-bottom">
              <span @click="mySetting">{{
                $t('languages.common.personalSetting')
              }}</span>
              <span @click="logout">{{ $t('languages.common.exitSys') }}</span>
            </div>
          </div>
        </template>

        <span class="icon-wrapper">{{ userInfo.name }}</span>
        <em
          v-if="visible"
          class="icon aufontAll h-icon-all-up-o small icon-wrapper"
        ></em>
        <em
          v-else
          class="icon aufontAll h-icon-all-down-o small icon-wrapper"
        ></em>
      </a-popover>
    </div>

    <a-drawer
      placement="right"
      :width="420"
      :closable="false"
      :visible="openSettintTheme"
      :zIndex="1032"
      wrapClassName="theme-setting-wrapper"
      @close="openSettintTheme = false"
    >
      <themeSetting
        :openSettintTheme="openSettintTheme"
        @close="openSettintTheme = false"
      />
    </a-drawer>

    <!-- 个人设置 -->
    <MySetting
      :userInfo="userInfo"
      :isShow="isShow"
      @closepop="isShow = false"
      @success="logout"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { FormCommentApi } from 'cloudpivot/api';

import Application from 'cloudpivot-list/application/pc';

const SystemModule = namespace('System/System');

import themeSetting from 'cloudpivot/common/src/components/pc/setting/theme-seting.vue';
import noticeTips from 'cloudpivot/common/src/components/pc/templates/noticeTips.vue';
import MySetting from 'cloudpivot/common/src/components/pc/setting/my-setting.vue';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

import { listApi, workbenchApi } from 'cloudpivot/api';

import {
  Dropdown,
  Modal,
  Input,
  Row,
  Col,
  Menu,
  Popover,
  Icon,
  Tooltip,
  Drawer,
} from '@h3/antd-vue';

@Component({
  name: 'menuOperation',
  components: {
    APopover: Popover,
    ADrawer: Drawer,
    ATooltip: Tooltip,
    ADropdown: Dropdown,
    AModal: Modal,
    AInput: Input,
    ARow: Row,
    ACol: Col,
    AMenu: Menu,
    AIcon: Icon,
    SearchResulte: Application.SearchResulte,
    themeSetting,
    noticeTips,
    MySetting,
  },
})
export default class menuOperation extends Vue {
  @SystemModule.State('isAdmin') isAdmin: any;

  @SystemModule.Mutation('setIsAdmin') setIsAdmin: any;

  @SystemModule.Mutation('setRootAdmin') setRootAdmin: any;

  @SystemModule.Mutation('setAdmin') setAdmin: any;

  @SystemModule.Mutation('setUserInfo') setUserInfo: any;

  @SystemModule.Mutation('setIsPrivilegedPerson') setIsPrivilegedPerson: any;

  @SystemModule.Mutation('setIsAppAdmin') setIsAppAdmin: any;

  @SystemModule.State('admin') admin: any;

  searchVisible: boolean = false;

  moveIn: boolean = false;

  toggleSearchVisible() {
    this.searchVisible = !this.searchVisible;
  }

  goToDetail() {}

  closeSearchResulte() {}

  @Watch('searchVisible')
  onSearchVisibleChange(val) {
    this.$nextTick(() => {
      this.moveIn = val;
    });
  }

  getDownloadUrlNew(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId);
  }

  // 主题修改
  openSettintTheme: boolean = false;

  toChangeTheme() {
    this.openSettintTheme = true;
  }

  // 后台管理

  isAppAdmin: boolean = false;

  isSysAdmin: boolean = false;

  toAdmin() {
    // 跳转后台管理
    const token = localStorage.getItem('token');
    if (this.isDingTalk && token) {
      window.open(`/admin/?admin_token=${token}`, '_blank');
    } else {
      window.open(`/admin/`, '_blank');
    }
  }

  // 用户信息
  userInfo: any = {};

  // 只有自维护的用户并且不是admin这个账户才能有修改密码入口 #39826
  isShowUpdatePwdBtn: boolean = true;

  // 获取当前用户信息
  async getUserInfo() {
    const res: any = await FormCommentApi.getUserInfo();
    if (res.errcode === 0) {
      const info: any = res.data;
      this.userInfo = info;
      // this.setUserId(info);
      this.isShowUpdatePwdBtn =
        (res.data.relatedSyncType === 'PUSH' ||
          this.$store.state.config.loginType === 0 ||
          this.$store.state.config.loginType === 2) &&
        res.data.username !== 'admin'; // admin这个账号 hide || 或者开启了账号密码登陆的时候

      this.userInfo.isShowUpdatePwdBtn = this.isShowUpdatePwdBtn;
      sessionStorage.setItem('user', JSON.stringify(info));
      if (localStorage.getItem('temp')) {
        const tempArr = JSON.parse(localStorage.getItem('temp') || '[]');
        if (tempArr > 2) {
          tempArr.shift();
        }
        localStorage.setItem('temp', JSON.stringify(tempArr));
      } else if (localStorage.getItem('daily')) {
        const dailyArr = JSON.parse(localStorage.getItem('daily') || '[]');
        if (dailyArr > 2) {
          dailyArr.shift();
        }
        localStorage.setItem('daily', JSON.stringify(dailyArr));
      } else {
        //Else Empty block statement
      }
      localStorage.setItem(
        'userId',
        JSON.parse(sessionStorage.getItem('user') || '').id,
      ); //用户ID
      // 判断当前用户角色
      const isAppAdmin: boolean = info.permissions.includes('APP_MNG');
      this.isAppAdmin = isAppAdmin;
      const isSysAdmin: boolean = info.permissions.includes('SYS_MNG');
      this.isSysAdmin = isSysAdmin;
      const isRootAdmin: boolean = info.permissions.includes('ADMIN');
      const isAdmin: boolean = isAppAdmin || isSysAdmin || isRootAdmin;
      this.setIsAdmin(isAdmin);
      this.setRootAdmin(isRootAdmin);
      this.setAdmin(isSysAdmin || isRootAdmin);
      this.setUserInfo(info);
      // 设置是否特权人
      const isWORKFLOW_ADMIN: boolean =
        info.permissions.includes('WORKFLOW_ADMIN');
      this.setIsPrivilegedPerson(isWORKFLOW_ADMIN);

      this.setIsAppAdmin(isAppAdmin);

      // 禁止无权限访问流程查询页面
      if (
        !isSysAdmin &&
        !isRootAdmin &&
        this.$route.name &&
        ['queryInstance', 'queryParticipantWorkItem'].includes(this.$route.name)
      ) {
        this.$router.replace({ name: 'myUnfinishedWorkItem' });
      }
      // 禁止超管访问流程委托页面
      if (
        isRootAdmin &&
        this.$route.name &&
        ['delegationWorkflow'].includes(this.$route.name)
      ) {
        this.$router.replace({ name: 'myUnfinishedWorkItem' });
      }
      if (info.lastLoginTime) {
        const login_jump = localStorage.getItem('login_jump');
        if (!login_jump || login_jump === 'false') {
          localStorage.setItem('login_jump', 'true');
          const vm = this;
          this.$message.info({
            content: `${this.$t('languages.common.lastLoginTime').toString()}${
              info.lastLoginTime
            }`,
            icon: () => {
              return vm.$createElement('span', {
                class: 'aufontAll h-icon-all-clock-circle',
                style: {
                  color: 'rgba(17,18,24,0.25)',
                  'margin-right': '8px',
                },
              });
            },
          });
        }
      }
    }
  }

  // 消息通知
  noticeTipsVisibleChange(visible) {
    if (visible) {
      // @ts-ignore
      this.$refs.noticeTips && this.$refs.noticeTips.paltformSearch();
    }
  }

  noticesCount: number = 0;

  noticesTimer: any = null;

  // 获取消息通知数量
  async paltformSearch() {
    const res: any = await workbenchApi.paltformSearch({
      searchword: '',
      size: 1,
      page: 0,
      tab: 'MESSAGE',
      readState: 'UNREADED',
    });
    if (res.errcode === 0) {
      this.noticesCount = res.data.MESSAGE.totalElements;
      this.autoGetNoticesCount();
    }
  }

  autoGetNoticesCount() {
    this.noticesTimer = setTimeout(() => {
      this.paltformSearch();
    }, 60000);
  }

  // 中英文切换
  toggleLanguage() {
    if (!(this.$i18n.locale && this.$i18n.locale === 'en')) {
      this.$i18n.locale = 'en';
    } else {
      this.$i18n.locale = 'zh';
    }
    this.$forceUpdate();
    localStorage.setItem('locale', this.$i18n.locale);
  }

  // 用户设置
  visible: boolean = false;

  isShow: boolean = false;

  mySetting() {
    this.visible = false;
    this.isShow = true;
  }

  // 退出登录
  logout() {
    const token: string = localStorage.getItem('token') || '';
    const user:any = JSON.parse(sessionStorage.getItem('user')) || {};
    //corpId
 
    FormCommentApi.logout({
      redirect_uri: `/login`,
      T: token,
    }).then((res: any) => {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('expireTime');
      sessionStorage.removeItem('user');
      localStorage.removeItem('login_jump');
      // this.$router.replace({ 
      //   name: 'login',
      //   query: { 
      //     'corpId': user['corpId'] || 'main'
      //   }
      // });
      let { href } = this.$router.resolve({
        path: '/login',
        query: {
          corpId: user['corpId'] || 'main'
        }
      });
      window.location.href = href;



    });
  }

  created() {
    this.getUserInfo();
    this.paltformSearch();
  }

  beforeDestroy() {
    clearTimeout(this.noticesTimer);
  }

  get outwardType() {
    // 获取主题外观
    return this.$store.state.outwardType;
  }

  openBlank() {
    let href: any = location.href;
    const iframeAction: any = href.match(/%26iframeAction%3Ddetail/g);
    if (Array.isArray(iframeAction) && iframeAction.length > 1) {
      for (let i = 0; i < iframeAction.length - 1; i++) {
        href = href.replace('%26iframeAction%3Ddetail', '');
      }
    }

    const url = `${href}${
      href.indexOf('?') > -1 ? '&' : '?'
    }T=${localStorage.getItem('token')}`;

    window.open(url, '_blank');
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';

.menu-operation {
  height: 64px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .op-item {
    height: 20px;
    min-width: 20px;
    line-height: 20px;
    display: flex;
    align-items: center;
    margin-right: 24px;
    .icon-wrapper,
    .notice-icon-wrapper,
    .open-blank {
      cursor: pointer;
      em {
        font-size: 20px;
      }
      &:hover {
        color: @highlightColor;
        em {
          color: @highlightColor;
        }
      }
      .font-ele {
        top: -4px;
      }
    }
    em.icon-wrapper {
      font-size: 12px;
      margin-left: 5px;
    }
    > span {
      white-space: nowrap;
      &:hover {
        color: @highlightColor;
        em {
          color: @highlightColor;
        }
      }
    }
    &:last-child {
      margin-right: unset;
    }
  }
}
.help-content {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
  display: flex;
  flex-direction: column;
  a {
    display: block;
    white-space: nowrap;
    width: 120px;
    padding: 0 8px;
    height: 32px;
    line-height: 32px;
    color: #111218;
    :hover {
      color: #2970ff;
      background-color: #f1f2f6;
    }
  }
}
.help-center2 {
  padding-top: 0 !important;
  .ant-popover-inner {
    background-color: transparent;
    box-shadow: none;
  }
  .content-placeholder {
    height: 4px;
    width: 100%;
    background: transparent;
  }
  .content-box {
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    background-color: #fff;
  }
  .ant-popover-inner-content {
    padding: 15px 0 0;
  }
  .ant-popover-arrow {
    display: none;
  }
}
.ant-popover-inner-content {
  padding: 0;
  .content-li {
    width: 120px;
    height: 36px;
    cursor: pointer;
    line-height: 36px;
    padding-left: 20px;
    box-sizing: border-box;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    > span {
      font-weight: 400;
      color: #111218;
      font-size: 14px;
    }
    &:hover {
      background-color: @hoveBGColor;
      > span {
        color: @primaryColor;
      }
    }
    &:active {
      background-color: @activeBGColor;
      > span {
        color: @primaryColor;
      }
    }
  }
  .content-user-top {
    width: 240px;
    height: auto;
    padding: 20px 20px 0;
    > .userInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > img {
        vertical-align: middle;
        width: 42px;
        height: 42px;
        overflow: hidden;
        border-radius: 50%;
        margin-right: 16px;
        object-fit: cover;
      }
      > em {
        margin-right: 16px;
        width: 42px;
        height: 42px;
        line-height: 42px;
        border-radius: 50%;
        font-size: 42px;
        text-align: center;
        color: #ffb131;
      }
      .userInfo-right {
        flex: 1;
        > h3 {
          color: #111218;
          font-weight: 400;
          font-size: 14px;
        }
        > .userInfo-right-cn {
          color: rgba(17, 18, 24, 0.5);
          font-weight: 400;
          font-size: 14px;
          display: flex;
          align-items: center;
          margin-top: 4px;
          > em {
            color: rgba(17, 18, 24, 0.5);
            margin-right: 9px;
            overflow: inherit;
            width: auto;
            height: auto;
          }
        }
      }
    }
    > .userInfo-organ {
      margin-top: 12px;
      border-bottom: 1px solid #eee;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 15px;

      > span {
        font-size: 14px;
        color: rgba(17, 18, 24, 0.5);
        font-weight: 400;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 5px;
        > em {
          margin-right: 7px;
          position: relative;
          top: 1px;
          vertical-align: baseline;
        }
        &.sub-title {
          color: rgba(17, 18, 24, 0.25);
          text-align: right;
        }
      }
    }
  }
  .content-user-bottom {
    width: 240px;
    color: #111218;
    font-size: 14px;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    padding: 12px 0 20px;
    > span {
      // margin-top: 7px;
      height: 36px;
      line-height: 36px;
      display: block;
      width: 100%;
      padding: 0 20px;
      &:hover {
        background-color: @activeBGColor;
        color: @highlightColor;
      }
      &:active {
        background-color: @hoveBGColor;
        color: @highlightColor;
      }
    }
  }
}

.dark {
  .menu-operation {
    .op-item {
      .icon-wrapper,
      .notice-icon-wrapper,
      .open-blank {
        color: #fff;
        opacity: 0.8;
        em {
          color: #fff;
        }
        &:hover {
          opacity: 1;
        }
        span {
          color: #fff;
        }
      }
    }
  }
}
</style>
