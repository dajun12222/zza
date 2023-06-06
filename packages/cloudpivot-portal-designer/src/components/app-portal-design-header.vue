<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <div class="app-portal-design-header">
      <div class="header-left">
        <div class="left-icon">
          <em class="icon aufontAll h-icon-all-arrow-left-o"></em>
        </div>
        <div class="left-content">
          <div class="app-info">
            <div class="app-icon">
              <template v-if="appInfo.logoUrl">
                <img
                  v-if="appInfo.logoUrl.indexOf('http') > -1"
                  :src="appInfo.logoUrl"
                  class="item-icon"
                />
                <img
                  v-else
                  :src="getDownloadUrlNew(appInfo.logoUrl)"
                  class="item-icon"
                />
              </template>
              <template v-else>
                <svg class="svg-icon svgIcon" aria-hidden="true">
                  <use xlink:href="#h-icon-all-application1" />
                </svg>
              </template>
            </div>
            <div class="app-name">
              <span>{{ appInfo.name }}</span>
            </div>
            <em class="icon aufontAll h-icon-all-caret-down"></em>
          </div>
        </div>
      </div>
      <div class="header-right">
        <div class="menu-right">
          <ul>
            <!-- 搜索 -->
            <li>
              <em class="icon aufontAll h-icon-all-search"></em>
            </li>

            <!-- 更换主题 -->
            <li>
              <em class="icon aufontAll h-icon-all-palette-o"></em>
            </li>

            <!-- 后台管理 -->
            <li>
              <em class="icon aufontAll h-icon-all-desktop1"></em>
            </li>

            <!-- 消息通知 -->
            <li>
              <em class="icon aufontAll h-icon-all-bells-o"></em>
            </li>

            <!-- 帮助中心 -->
            <li>
              <em class="icon aufontAll h-icon-all-book1"></em>
            </li>

            <!-- 中英切换 -->
            <li>
              <span>{{ $i18n.locale === 'zh' ? 'EN' : '中文' }}</span>
            </li>

            <li>
              <span>{{ loginedUserName ? loginedUserName : 'admin' }}</span>
              <em class="icon aufontAll h-icon-all-down-o small"></em>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const AppCenterModule = namespace('Apps/AppCenter');

@Component({
  name: 'app-portal-design-header',
  components: {},
})
export default class appPortalDesignHeader extends Vue {
  @Prop() appCode!: string;

  @AppCenterModule.State('appInfo') appInfo: any;

  @AppCenterModule.Action('getAppDetail') getAppDetail: any;

  loginedUserName: string = '';

  created() {
    const user = sessionStorage.getItem('user');
    if (user) {
      this.loginedUserName = JSON.parse(user).username;
    }
  }

  beforeMount() {
    const params: Apps.AppCenter.AppInfoParams = {
      appCode: this.appCode,
    };
    if (this.appCode) {
      this.getAppDetail(params);
    }
  }

  getDownloadUrlNew(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId);
  }
}
</script>

<style lang="less">
.app-portal-design-header {
  display: flex;
  height: 60px;
  line-height: 60px;
  background: #fff;
  border-bottom: 1px solid #eee;
  .header-left {
    display: flex;
    flex: 1;
    .left-icon {
      margin-right: 10px;
      margin-left: 21px;
      font-size: 17px;
      font-weight: 600;
    }
    .left-content {
      padding: 4px 8px;
      border-radius: 2px;
      .app-info {
        display: flex;
        align-items: center;
        margin-top: -2px;
        .app-icon {
          background: #ffffff;
          border-radius: 1px;
          border: 1px solid #eeeeee;
          width: 20px;
          height: 20px;
          .item-icon {
            width: 100%;
            height: 100%;
            display: inherit;
          }
          .svg-icon {
            padding: 2px;
            width: 100%;
            height: 100%;
            display: inherit;
          }
        }
        .app-name {
          margin-left: 6px;
          margin-right: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #111218;
          line-height: 22px;
          max-width: 130px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        > .aufontAll {
          font-size: 12px;
          color: #a5a5a5;
          margin-top: 1px;
        }
      }
    }
  }
  .header-right {
    padding-right: 32px;
    .menu-right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      height: 60px;
      line-height: 60px;
      ul {
        display: flex;
        align-items: center;
        margin-bottom: 0 !important;
        li {
          margin-right: 21px;
          font-weight: 400;
          height: 20px;
          min-width: 20px;
          color: #111218;
          font-size: 14px;
          text-align: center;
          cursor: pointer;
          display: flex;
          align-items: center;
          em {
            font-size: 20px;
            &.small {
              margin-left: 6px;
              font-size: 12px;
            }
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
