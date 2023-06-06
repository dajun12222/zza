<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<!--
 * @Descripttion:
 * @version: v1.0
 * @Author: baidongsheng
 * @Date: 2021-09-17 17:24:00
 * @LastEditors: baidongsheng
 * @LastEditTime: 2021-12-18 17:39:10
-->
<template>
  <a-config-provider :locale="locale">
    <div id="app" :class="{ ie: isIe }">
      <div v-if="isOnlineDevelop" class="debug-tips">
        <a-icon type="bug" />
        当前为调试模式
      </div>
      <router-view class="bpm-container" />
      <modify-pwd
        :isShow="isModifyPwdShow"
        @closepop="closePop"
        @success="logout"
      />
    </div>
  </a-config-provider>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from 'vue-property-decorator';

import { ConfigProvider } from '@h3/antd-vue';

import OAuthApi from '@/apis/oauth';

import env from '@/config/env';

import zhCN from '@h3/antd-vue/lib/locale-provider/zh_CN';
import enUS from '@h3/antd-vue/lib/locale-provider/en_US';

import app from 'cloudpivot/common/src/constants/globalApplication';

import 'moment/locale/zh-cn';
import { updateTheme } from './tools/settingConfig';

import { themesApi } from 'cloudpivot/api';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
import RefreshToken from 'cloudpivot/common/src/utils/RefreshToken';
import { Icon } from '@h3/antd-vue';

import ModifyPassword from 'cloudpivot/common/src/components/pc/modify-pwd/modify-pwd';

@Component({
  components: {
    AConfigProvider: ConfigProvider,
    AIcon: Icon,
  },
})
export default class App extends Mixins(ModifyPassword) {
  refreshTokenObj: any = null;

  get locale() {
    switch (this.$i18n.locale) {
      case 'en':
        // return require('@h3/antd-vue/lib/locale-provider/en_US');
        return enUS;
      case 'zh':
      default:
        // return require('@h3/antd-vue/lib/locale-provider/zh_CN');
        return zhCN;
    }
  }

  get isIe() {
    if (window.Environment && window.Environment.isIe !== undefined) {
      return window.Environment.isIe;
    }
    return false;
  }

  @Watch('$route')
  routeChange(val) {
    if (val && val.name !== 'login') {
      this.showPop();
    }
  }

  async mounted() {
    this.debugMessageListen();

    //关闭标签页或者关闭整个浏览器窗口时销毁定时器
    window.onbeforeunload = () => {
      this.refreshTokenObj?.clearTimer();
    };

    const config = await OAuthApi.getSystemConfig();
    if (config) {
      config.apiHost = env.apiHost;
      this.$store.commit('setConfig', config);
      // if (config.forceChangeDefaultPassword) {
      //   this.showPop();
      // }
    }
    if (!(config && config.closeRefreshToken)) {
      this.refreshTokenObj = new RefreshToken();
    }
    app.errorManager.getErrorCode();
  }

  debugMessageListen() {
    var debugVirtulSpan = document.createElement('span');
    debugVirtulSpan.setAttribute('id', 'debug_virtul_span');
    debugVirtulSpan.addEventListener('click', () => {
      window.open('', window.opener.name);
    });
    // 防止反复添加
    if (!document.getElementById('debug_virtul_span')) {
      document.body.appendChild(debugVirtulSpan);
    }
    window.addEventListener('message', function (e) {
      // 监听 message 事件
      if (e.origin !== location.origin) {
        return;
      }
      let data: any = {};
      try {
        data = JSON.parse(e.data);
      } catch {}
      if (data.type === 'debugBack') {
        if (data.status === 'START') {
          debugVirtulSpan.click();
        } else if (data.status === 'END') {
          window.close();
        }
      }
    });
  }

  async created() {
    await themesApi.getThemesInfo().then((res: any) => {
      this.$store.commit('setThemsConfig', res);
      if (res.icon) {
        this.changeFavicon(this.getIcon(res.icon));
        if (res.name && document.title.indexOf('奥哲云枢-') !== -1) {
          document.title = document.title.replace('奥哲云枢-', res.name + '-');
        } else if (res.name && document.title.indexOf('云枢-') !== -1) {
          document.title = document.title.replace('云枢-', res.name + '-');
        } else {
          //Else Empty block statement
        }
      }
      if (res.name) {
        localStorage.setItem('themsInfo', JSON.stringify({ title: res.name }));
      } else {
        localStorage.removeItem('themsInfo');
      }

      updateTheme({
        color: res.color || 'default',
        outwardType: res.outward || 'light',
        store: this.$store,
      });
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

  getIcon(refId: string) {
    return refId ? this.getDownloadUrlByRefId(refId) : '';
  }

  getDownloadUrlByRefId(refId: string): string {
    return getDownloadUrlNew.getImageUrl(refId, 'logo');
  }

  get isOnlineDevelop() {
    const debugItem: any = this.getDebugLocalStorgeItem();
    const debugRuleCode = debugItem.ruleCode;
    const hasDebugId = this.$route.query.debugId;
    const schemaCode = debugItem.schemaCode;
    return debugRuleCode && hasDebugId && schemaCode;
  }

  /**
   * 获取localStorage中的调试数据
   */
  getDebugLocalStorgeItem() {
    const ruleCode = localStorage.getItem('debug_rule_code');
    const schemaCode = localStorage.getItem('debug_schema_code');
    return {
      ruleCode,
      schemaCode,
    };
  }
}
</script>

<style lang="less">
@import url(./styles/common/global.less);

.debug-tips {
  height: 40px;
  background: #fffbe6;
  text-align: center;
  line-height: 40px;
  color: #111218;
}
</style>
