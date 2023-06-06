<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="login-qrcode">
    <div id="qrcode-box" class="qrcode"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from 'vue-property-decorator';

import { Tooltip } from '@h3/antd-vue';

import env from '@/config/env';

@Component({
  name: 'ExclusiveDing',
  components: {
    ATooltip: Tooltip,
  },
})
export default class ExclusiveDing extends Vue {
  @Prop({
    default: false,
  })
  toggleMode!: boolean;

  @PropSync('corpId') syncCorpId!: string;

  @Prop() appId!: string;

  @Prop({
    default: '',
  })
  appCode!: string;

  redirectUrl: string = ''; // 登陆成功回调地址

  shortCode: any = '';

  @Watch('appId', { immediate: true })
  onAppIdChange(v: any) {
    if (v) {
      this.appId = v;
      this.$nextTick(() => {
        this.initLoginQrcode();
      });
    }
  }

  @Watch('syncCorpId', { immediate: true })
  onCorpIdChange(syncCorpId: any) {
    if (syncCorpId) {
      this.$nextTick(() => {
        this.initLoginQrcode();
      });
    }
  }

  beforeDestroy() {
    if (typeof window.removeEventListener !== 'undefined') {
      window.removeEventListener('message', this.handleMessage);
    } else if (typeof (window as any).detachEvent !== 'undefined') {
      (window as any).detachEvent('onmessage', this.handleMessage);
    } else {
    }
  }

  /**
   * 初始化登陆二维码
   */
  async initLoginQrcode() {
    function qd(a) {
      const c: any = document.createElement('iframe');
      let d = 'https://login.dg-work.cn/qrlogin/webAppLogin.htm?' + a.goto;
      c.src = d;
      c.frameBorder = '0';
      c.allowTransparency = 'true';
      c.scrolling = 'no';
      c.width = a.width ? a.width + 'px' : '365px';
      c.height = a.height ? a.height + 'px' : '400px';
      const e = document.getElementById(a.id);
      e.innerHTML = '';
      e.appendChild(c);
    }

    const govdingtalk = env.redirectHost;
    let gotoUrl = `APP_NAME=${
      this.appCode
    }&protocolKey=${+new Date()}&protocol=oauth2&BACK_URL=${encodeURIComponent(
      govdingtalk,
    )}&scope=get_user_info&state=&embedMode=true`;

    qd({
      id: 'qrcode-box',
      goto: gotoUrl,
      width: '280',
      height: '300',
    });

    if (typeof window.addEventListener !== 'undefined') {
      window.addEventListener('message', this.handleMessage, false);
    } else if (typeof (window as any).attachEvent !== 'undefined') {
      (window as any).attachEvent('onmessage', this.handleMessage);
    } else {
    }
  }

  /**
   * 扫码结果处理
   */
  async handleMessage(event: any) {
    const { origin } = event;
    if (origin === 'https://login.dg-work.cn') {
      const { scope, client_id, redirectHost, oauthHost, portalHost } = env;
      const failUrl: string = `${portalHost}/login`;
      const redirect_uri = encodeURIComponent(
        `${oauthHost}/oauth/authorize?client_id=${client_id}&response_type=code&scope=${scope}&redirect_uri=${redirectHost}/oauth`,
      );
      window.location.href = `${
        env.apiHost
      }/login/govdingtalk?redirect_uri=${redirect_uri}&login_fail_redirect_uri=${encodeURIComponent(
        failUrl,
      )}&corpId=${this.syncCorpId}&corpId=${this.syncCorpId}&code=${
        event.data.code
      }`;
    }
  }
}
</script>
<style lang="less" scoped>
#qrcode-box {
  width: 200px;
  height: 200px;
  overflow: hidden;
  position: relative;
  /deep/iframe {
    position: absolute;
    left: -40px;
    top: -86px;
  }
}
.login-qrcode {
  display: flex;
  justify-content: center;
  padding-top: 77px;
  &-header {
    font-size: 30px;
    color: #333;
    line-height: 40px;
    margin: 50px 0 0 0;
  }
  &-type {
    position: absolute;
    top: 32px;
    right: 32px;
    cursor: pointer;
  }
  .qrcode {
    text-align: center;
  }
}
</style>
