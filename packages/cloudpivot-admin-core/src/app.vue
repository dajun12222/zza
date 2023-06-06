<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Descripttion:
 * @version: v1.0
 * @Author: baidongsheng
 * @Date: 2021-11-27 10:23:06
 * @LastEditors: Fu Zhuohang
 * @LastEditTime: 2022-04-13 15:40:26
-->
<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <template v-if="showHeader">
        <div v-show="!switchHeader" class="head-wrap">
          <Header />
        </div>
        <div v-show="switchHeader"></div>
      </template>

      <router-view
        :class="{ container: !this.$route.fullPath.includes('pre-view') }"
      />
      <modify-pwd
        :isShow="isModifyPwdShow"
        @closepop="closePop"
        @success="logout"
      />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { Component, Vue, Watch, Provide, Mixins } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { ConfigProvider } from '@h3/antd-vue';
import Header from './components/global/header/index.vue';
import OAuthApi from 'cloudpivot-admin-core/src/apis/oauth';
import app from 'cloudpivot/common/src/constants/globalApplication';
import zhCN from '@h3/antd-vue/lib/locale-provider/zh_CN';
import enUS from '@h3/antd-vue/lib/locale-provider/en_US';
import 'moment/locale/zh-cn';
import { themesApi } from 'cloudpivot/api';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
import RefreshToken from 'cloudpivot/common/src/utils/RefreshToken';
import { getUserInfoLogin } from 'cloudpivot-admin-core/src/apis/organization';

import ModifyPassword from 'cloudpivot/common/src/components/pc/modify-pwd/modify-pwd';

const env = (window as any).config;
@Component({
  name: 'apps',
  components: {
    Header,
    AConfigProvider: ConfigProvider,
  },
})
export default class Apps extends Mixins(ModifyPassword) {
  switchHeader = false;

  showHeader: boolean = false;

  refreshTokenObj: any = null;

  created() {
    themesApi.getThemesInfo().then((res: any) => {
      this.$store.commit('setThemsConfig', res);
      if (res.icon) {
        this.changeFavicon(this.getIcon(res.icon));
      }
      if (res.name) {
        localStorage.setItem('themsInfo', JSON.stringify({ title: res.name }));
      } else {
        localStorage.removeItem('themsInfo');
      }

      if (res.name && document.title.indexOf('云枢-') !== -1) {
        document.title = document.title.replace('云枢-', res.name + '-');
      }
    });
  }

  // 修改浏览器标签页上的小图标
  changeFavicon(link) {
    if (!link) {
      return;
    }
    let $favicon: any = document.querySelector('link[rel="icon"]');
    if ($favicon !== null) {
      $favicon.href = link;
    } else {
      $favicon = document.createElement('link');
      $favicon.rel = 'icon';
      $favicon.href = link;
      // @ts-ignore
      document.head.appendChild($favicon);
    }
  }

  //清除控制台报错
  @Provide()
  emitScrollTop(top: number) {
    this.$emit('scrollTop', top);
  }

  //清除控制台报错
  @Provide()
  showTimeRanges() {
    return true;
  }

  getIcon(refId: string) {
    return refId ? this.getDownloadUrlByRefId(refId) : '';
  }

  getDownloadUrlByRefId(refId: string): string {
    return getDownloadUrlNew.getImageUrl(refId, 'logo');
  }

  //@Getter('getAntLocale') locale!: string;

  get locale() {
    switch (this.$i18n.locale) {
      case 'en':
        return enUS;
      case 'zh':
      default:
        return zhCN;
    }
  }

  async mounted() {
    getUserInfoLogin().then((res) => {
      if (res.errcode === 0) {
        const info = res.data;
        if (info.lastLoginTime) {
          const login_jump = localStorage.getItem('login_jump');
          if (!login_jump || login_jump === 'false') {
            localStorage.setItem('login_jump', 'true');
            const vm = this;
            this.$message.info({
              content: `上次登录时间：${info.lastLoginTime}`,
              icon: () => {
                return this.$createElement('span', {
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
      } else {
        console.error(res.errmsg);
      }
    });
    //token刷新对象初始化操作
    // this.refreshTokenObj = new RefreshToken();

    //关闭标签页或者关闭整个浏览器窗口时销毁定时器
    window.onbeforeunload = () => {
      this.refreshTokenObj.clearTimer();
    };

    // 获取配置文件
    const config = await OAuthApi.getSystemConfig();
    if (config) {
      this.$store.commit('setConfig', config);
      // if (config.forceChangeDefaultPassword) {
      //   this.showPop();
      // }
    }
    if (!(config && config.closeRefreshToken)) {
      //token刷新对象初始化操作
      this.refreshTokenObj = new RefreshToken();
    }
    app.errorManager.getErrorCode();
  }

  @Watch('$route', {
    immediate: true,
  })
  routeChange(n: Route, o: Route) {
    if (n && n.name !== 'login') {
      this.showPop();
    }
    // eslint-disable-next-line
    this.switchHeader =
      n.fullPath.includes('print-template') || n.fullPath.includes('pre-view');

    this.showHeader = ![
      'dataModel',
      'busRules',
      'dataPermission',
      'dataRuleCalculation',
      'list-design',
      'form-design',
      'workflowDesign',
      'workflowEmpty',
      'biz-rule',
      'dispatcher',
      'portal-design-preview',
      'app-portal-design-preview',
      'biz-rule-coding',
    ].includes(this.$route.name);
  }
}
</script>

<style>
.ant-calendar-range-middle {
  padding: 0 !important;
}
</style>
<style lang="less" scoped>
@sub-bg-color: #e5efff; //基础背景色
</style>
