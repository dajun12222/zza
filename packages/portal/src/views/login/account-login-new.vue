<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="login-account"
    :class="{
      'login-err-box': passwordErr || userTips,
      'verification-err-box': verificationTips,
    }"
  >
    <div class="label">
      {{ languages === 'zh' ? '账号' : 'Account' }}
    </div>
    <a-input
      v-model="userName"
      :placeholder="
        languages === 'zh' ? '请输入账号' : 'Please enter the account number'
      "
      autocomplete="off"
      class="login-input"
      @change="becanLogin"
    />
    <p v-if="passwordErr" class="err-tips-2">
      {{
        languages === 'zh'
          ? '请输入正确的账号或密码'
          : 'Please enter the correct account number or password'
      }}
    </p>
    <p v-if="userTips" class="err-tips">
      {{ userTips }}
    </p>
    <div class="label">
      {{ languages === 'zh' ? '密码' : 'Password' }}
    </div>
    <a-input
      v-model="passWord"
      class="zkcustomer login-input"
      :placeholder="
        languages === 'zh' ? '请输入密码' : 'Please input a password'
      "
      :class="{ 'mb-41': !verificationType }"
      :type="passwordType"
      autocomplete="off"
      @change="becanLogin"
      @pressEnter="enterLogin"
    >
      <i
        slot="suffix"
        class="icon aufontAll"
        :class="{
          'h-icon-all-eye-close': !showPassword,
          'h-icon-all-eye-o': showPassword,
        }"
        @click="passwordVisible"
      ></i>
    </a-input>
    <template v-if="verificationType">
      <div class="label">
        {{ $t('languages.common.login.verificationCode') }}
      </div>
      <a-input
        v-model="verification"
        class="verification-input mb-41"
        :placeholder="$t('languages.common.login.verificationCodePlaceholder')"
        @change="becanLogin"
      >
        <template slot="suffix">
          <div
            v-if="!canSendMsg && !sendingMessage"
            class="send-verification send-verification-disable"
          >
            <span>{{
              $t('languages.common.login.sendVerificationCodeBtn')
            }}</span>
          </div>
          <div
            v-else-if="canSendMsg && !sendingMessage"
            class="send-verification send-verification-enable"
            @click="sendMessage"
          >
            <span>{{
              $t('languages.common.login.sendVerificationCodeBtn')
            }}</span>
          </div>
          <div v-else class="send-verification send-verification-timer">
            <span>{{ remainingTime }}s</span>
          </div>
        </template>
      </a-input>
      <p v-if="sendingMessageSuccess" class="send-success">
        <span class="icon aufontAll h-icon-all-check-circle1"></span>
        <span>{{
          $t('languages.common.login.verificationCodeTips', {
            phone: targetPhone,
          })
        }}</span>
      </p>
      <p v-if="verificationTips" class="err-tips-3">
        <span>{{ verificationTips }}</span>
      </p>
    </template>
    <div class="login-btn" @click="login">
      {{ languages === 'zh' ? '登 录' : 'Login' }}
    </div>
    <p class="login-account-forget" @click="tips('forgetPwd')">
      {{ languages === 'zh' ? '忘记密码？' : 'Forget the password?' }}
    </p>
    <iframe id="fineBIIframe" :src="fineBISrc" style="width:100px;height:100px;position:absolute;top:-100px;left:-100px;opacity:0;"></iframe>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from 'vue-property-decorator';

import OAuthApi from '@/apis/oauth';

import Axios from 'axios';

import env from '@/config/env';

import common from 'cloudpivot/common';
import { Modal, Input, Button, Tooltip, Icon } from '@h3/antd-vue';

@Component({
  name: 'login-account',
  components: {
    AInput: Input,
    AModal: Modal,
    AButton: Button,
    ATooltip: Tooltip,
    AIcon: Icon,
  },
})
export default class LoginAccount extends Vue {
  @Prop({
    default: false,
  })
  toggleMode!: boolean;

  @PropSync('corpId') syncCorpId!: string;

  @Prop({
    default: false,
  })
  verificationType!: boolean;

  redirectUrl: string = ''; // 登陆回跳地址

  getTokenParams: any = {
    code: '',
    url: '',
    client_secret: '',
    client_id: '',
    redirect_uri: '',
  };

  languages: string = localStorage.getItem('locale') || 'zh';

  passwordErr: boolean = false; // 账户密码错误

  passwordType: string = 'password'; // 密码的展示形式

  showPassword: boolean = false;

  overflowTips: boolean = false; // 密码输入已超过3次提示

  loginDisabled: boolean = false; // 登录禁用状态

  userName: string = ''; // 登录账号

  passWord: string = ''; // 登录密码

  visible: boolean = false; // 忘记密码提示窗

  unAuthed: boolean = false; // 未授权提示窗

  userTips: string = '';
  
  fineBISrc:string = '';//帆软登录

  verification: string = ''; // 验证码

  remainingTime: number = 0; // 验证码冷却时间

  sendingMessage: boolean = false; // 是否正在发送验证码

  verificationTips: string = ''; // 验证码错误提示

  sendingMessageSuccess: boolean = false;

  get canSendMsg() {
    return this.userName && this.passWord;
  }

  created() {
    localStorage.removeItem('singlePwd');
    this.generateUrls();
  }

  // 切换组织的时候需要重新初始化
  @Watch('syncCorpId')
  onSyncCorpIdChange(syncCorpId: any) {
    if (syncCorpId) {
      this.generateUrls();
    }
  }

  /**
   * 初始化地址和固定传参
   */
  generateUrls() {
    const { oauthHost, client_id, scope, secret, redirectHost } = env;
    // 回跳地址
    this.redirectUrl = `${oauthHost}/login?redirect_uri=${encodeURIComponent(
      `${oauthHost}/oauth/authorize?client_id=${client_id}&response_type=code&scope=${scope}&redirect_uri=${redirectHost}/oauth`,
    )}`;
    // 请求token参数
    this.getTokenParams = {
      code: '',
      url: oauthHost,
      client_secret: secret,
      client_id: client_id,
      redirect_uri: `${redirectHost}/oauth`,
    };
  }

  passwordVisible() {
    if (this.showPassword) {
      this.passwordType = 'password';
    } else {
      this.passwordType = 'text';
    }
    this.showPassword = !this.showPassword;
  }

  becanLogin() {
    if (this.userName && this.passWord) {
      this.loginDisabled = true;
    } else {
      this.loginDisabled = false;
    }
    if (this.verification) {
      this.verification = this.verification.slice(0, 6);
    }
  }

  /**
   * 回车登陆
   */
  enterLogin() {
    const { userName, passWord } = this;

    if (!passWord || !userName) {
      return;
    }

    this.login();
  }

  /**
   * 账户密码登录
   */
  async login() {
    if (!this.loginDisabled || !this.userName || !this.passWord) {
      this.passwordErr = true;
      return;
    }
    if (this.verificationType && !this.verification) {
      this.verificationTips = this.$t(
        'languages.common.login.verificationCodeErr1',
      ).toString();
      this.sendingMessageSuccess = false;
      return;
    }
    this.passwordErr = false;
    this.userTips = '';
    this.verificationTips = '';
    this.sendingMessageSuccess = false;
    const { password, index } = await this.encryption();
    const params: any = {
      username: this.userName,
      password,
      url: this.redirectUrl,
      portal: true,
      index,
      corpId: this.syncCorpId,
    };
    if (this.verificationType) {
      params.verification_code = this.verification;
    }
    
    const res = await OAuthApi.login(params);
    if (res.errcode === 200 && res.code) {
      this.getTokenParams.code = res.code;
      this.getToken(this.getTokenParams);
      if (res.data && res.data.defaultPassword) {
        localStorage.setItem('singlePwd', 'true');
      } else {
        localStorage.setItem('singlePwd', 'false');
      }
      this.fineBILogin(this.userName,this.passWord);
    } else if (res.errcode === 1000) {
      this.passwordErr = true;
      localStorage.removeItem('singlePwd');
    } else if (res.errcode === 10001) {
      this.passwordErr = true;
      this.tips('overflow', res.data);
      localStorage.removeItem('singlePwd');
    } else if (res.errcode === 10002) {
      this.tips('unauthed');
      localStorage.removeItem('singlePwd');
    } else if (res.errcode === 1001) {
      let msg = res.errmsg;
      if (
        msg === '当前用户不在组织内或者用户不存在' &&
        this.languages === 'en'
      ) {
        msg = 'The current user is not in the organization or does not exist';
      }
      this.userTips = msg;
      localStorage.removeItem('singlePwd');
    } else if (res.errcode === 100011) {
      this.verificationTips = this.$t(
        'languages.common.login.verificationCodeErr3',
      ).toString();
      localStorage.removeItem('singlePwd');
    } else if (res.errcode && typeof res.data === 'string') {
      this.tips('custom', res.data);
    } else {
      //Else Empty block statement
    }
  }
  
  /*
    fineBI登录
  */
 async fineBILogin(username?:string,password?:string){
  const { portalHost } = env;

  let username1:string = 'admin';
  let password1:string = 'gjhd888888.';

  
  let domin:string = portalHost;
  let apiUrl:string = '/api/fineBi/login/cross/domain';
  let query:string = '?fine_username=' + encodeURIComponent(username1) + '&fine_password=' + encodeURIComponent(password1) + "&validity=" + -1 + "&callback=callback";
  
  
  let fineMessage:any = await Axios.get(domin + apiUrl + query);
  let endIndex:number = fineMessage.indexOf(')');
  
  fineMessage = fineMessage.substring(9,endIndex);
  // fineMessage = fineMessage.replace(/callback/gi,'');
  // fineMessage = fineMessage.replace(/\(/gi,'');
  // fineMessage = fineMessage.replace(/\)/gi,'');
  fineMessage = JSON.parse(fineMessage);

  if(fineMessage && fineMessage['accessToken']){
    localStorage.setItem('fineBi_token',fineMessage['accessToken']);
  }


  //"/login/cross/domain?fine_username=" + username + "&fine_password=" + password + "&validity=-1"
        
        // {       //判断是否为ie浏览器  
        //        scr.attachEvent("onload", function(){                    //如果为ie浏览器则页面加载完成后立即执行  
        //            window.location="http://localhost:8080/webroot/decision"; //直接跳转到数据决策系统
        //        });  
        // } else {  
        //        scr.onload = function(){              //其他浏览器则重新加载onload事件  
                   
        //         window.location="http://localhost:8080/webroot/decision"; //直接跳转到数据决策系统
        //     };  
        // }  
       
    // document.getElementsByTagName("head")[0].appendChild(scr);   //将iframe标签嵌入到head中    
 }

  async encryption() {
    // rsa加密
    const result = await OAuthApi.getRsaKey();
    const flag: boolean =
      typeof result === 'object' &&
      result.hasOwnProperty('index') &&
      result.hasOwnProperty('key');
    if (!flag) {
      return;
    }
    const { index, key } = result;
    const password: any = common.utils.RsaEncrypt(this.passWord, key);
    // rsa加密结束
    return {
      password,
      index,
    };
  }

  /**
   * 获取token
   */
  async getToken(params: any) {
    const res = await OAuthApi.getToken(params);

    if (res && res.success) {
      const token = (res as any).access_token;
      const refresh_tokens = (res as any).refresh_token;
      const expireTime = (res as any).exp;
      const isAdmin = (res as any).user_name === 'admin';

      localStorage.setItem('refresh_token', refresh_tokens);
      localStorage.setItem('expireTime', expireTime);
      localStorage.setItem('token', token);
      localStorage.setItem('_isAdmin', isAdmin + '');

      //token有效时长,按秒
      localStorage.setItem('expires_in', (res as any).expires_in);

      const isShowEmailResquest = localStorage.getItem('isShowEmailResquest');
      if (isShowEmailResquest) {
        if (this.isDingTalk) {
          this.$router
            .push({
              path: isShowEmailResquest,
            })
            .catch((err: any) => {
              console.log(err);
            });
        } else {
          window.location.href = isShowEmailResquest;
        }
      } else {
        const copyUrl = localStorage.getItem('copy_link_url_path');
        if (copyUrl) {
          localStorage.removeItem('copy_link_url_path');
          window.open(copyUrl, '_self');
        }

        const returnURL: any = sessionStorage.getItem('loginReturnUrl');
        if (returnURL) {
          sessionStorage.removeItem('loginReturnUrl');
          window.location.href = returnURL;
        } else {
          // if (this.openApplicationPortal) {
          //   this.$router
          //     .push({ name: 'applicationPortal' })
          //     .catch((err: any) => {
          //       console.log(err);
          //     });
          // } else {
          //   this.$router.push({ name: 'workbench' }).catch((err: any) => {
          //     console.log(err);
          //   });
          // }
          this.$router
            .push({ name: 'defaultPortalDashboard' })
            .catch((err: any) => {
              console.error(err);
            });
        }
      }
    }
  }

  // @ts-ignore
  openApplicationPortal: boolean = window.config.openApplicationPortal || false;

  tips(tipType, message?) {
    const vm: any = this;
    let content;
    switch (tipType) {
      case 'forgetPwd':
        content =
          vm.languages === 'zh'
            ? '请联系系统管理员重置密码'
            : 'Please contact the system administrator to reset the password';
        break;
      case 'overflow':
        content =
          vm.languages === 'zh'
            ? `密码输入错误已超过${message?.failedCount || 3}次,请${
                message?.lockTime || 1
              }分钟后再尝试`
            : `Password input error has exceeded ${
                message?.failedCount || 3
              } times, please try again in ${message?.lockTime || 1} minute`;
        break;
      case 'unauthed':
        content =
          vm.languages === 'zh'
            ? '当前账号用户未被授权，请联系管理员'
            : 'The current account user is not authorized, please contact the administrator';
        break;
      case 'custom':
        content = message;
        break;
      default:
        break;
    }
    this.$confirm({
      title: vm.languages === 'zh' ? '提示' : 'tips',
      okText: vm.$t('languages.common.ok').toString(),
      icon: () =>
        vm.$createElement('a-icon', {
          props: {
            type: 'exclamation-circle',
            theme: 'filled',
          },
        }),
      // @ts-ignore
      cancelButtonProps: { style: { display: 'none' } },
      class: 'tip-modal',
      content: content,
    });
  }

  clickedSendBtn: boolean = false;

  targetPhone: string = '';

  /**
   * 获取验证码
   */
  async sendMessage() {
    if (this.clickedSendBtn) {
      return;
    } else {
      this.clickedSendBtn = true;
    }

    this.passwordErr = false;
    this.userTips = '';
    this.verificationTips = '';
    this.sendingMessageSuccess = false;
    const { password, index } = await this.encryption();
    const params: any = {
      username: this.userName,
      password,
      url: this.redirectUrl,
      portal: true,
      index,
      corpId: this.syncCorpId,
    };
    const res = await OAuthApi.getVerificationCode(params);
    if (res.errcode === 100000 || res.errcode === 100001) {
      this.passwordErr = true;
    } else if (res.errcode === 100003) {
      this.verificationTips = res.errmsg;
    } else if (res.errcode === 100005) {
      this.verificationTips = this.$t(
        'languages.common.login.verificationCodeErr2',
      ).toString();
    } else if (res.errcode === 100012) {
      this.verificationTips = this.$t(
        'languages.common.login.verificationCodeErr4',
      ).toString();
    } else if (res.errcode === 201006) {
      this.verificationTips = this.$t(
        'languages.common.login.verificationCodeErr5',
      ).toString();
    } else if (res.errcode === 999999) {
      this.verificationTips = this.$t(
        'languages.common.login.verificationCodeErr6',
      ).toString();
    } else {
      this.remainingTime = 60;
      this.sendingMessage = true;
      this.sendingMessageSuccess = true;
      this.targetPhone = res.data;
      const sendMessageInterval = setInterval(() => {
        this.remainingTime--;
        if (!this.remainingTime) {
          this.sendingMessage = false;
          this.sendingMessageSuccess = false;
          clearInterval(sendMessageInterval);
        }
      }, 1000);
    }

    this.clickedSendBtn = false;
  }
}
</script>
<style lang="less" scoped>
.login-account {
  // float: right;
  // margin-top: 110px;
  // width: 360px;
  // height: 400px;
  // position: relative;
  // background: #fff;
  // border-radius: 6px;
  // text-align: center;
  // padding: 0 40px;
  padding-top: 45px;
  position: relative;
  &-header {
    font-size: 30px;
    color: #333;
    line-height: 40px;
    margin: 50px 0 42px 0;
  }
  &-type {
    position: absolute;
    top: 32px;
    right: 32px;
    cursor: pointer;
    img {
      width: 44px;
    }
  }
  &-forget {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    text-align: right;
    cursor: pointer;
  }
  .label {
    height: 22px;
    font-size: 14px;
    font-weight: 400;
    color: #111218;
    line-height: 22px;
    margin-bottom: 6px;
  }
  .login-input,
  .verification-input {
    width: 100%;
    margin-bottom: 24px;
    height: 32px;
    background: #ffffff;
    border-radius: 2px;
    font-size: 14px;
    font-weight: 400;
    color: #111218;
    &.ant-input:not(.ant-input-disabled) {
      border: 1px solid #d4d5d6;
      &:focus {
        box-shadow: 0px 0px 0px 2px rgba(41, 112, 255, 0.2);
        border: 1px solid #2970ff;
      }
      &:hover {
        border: 1px solid #2970ff;
      }
    }
    /deep/.ant-input:not(.ant-input-disabled) {
      border-radius: 2px;
      border: 1px solid #d4d5d6;
      &:focus {
        box-shadow: 0px 0px 0px 2px rgba(41, 112, 255, 0.2);
        border: 1px solid #2970ff;
      }
      &:hover {
        border: 1px solid #2970ff;
      }
    }
  }
  .login-btn {
    width: 100%;
    height: 40px;
    background: #2970ff;
    border-radius: 2px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    margin-bottom: 8px;
    // margin: 42px auto;
    cursor: pointer;
    &:not(.loginDisabled):hover {
      background: #5291ff;
      color: rgba(255, 255, 255, 0.9);
    }
    &:not(.loginDisabled):active {
      background: #1852d9;
      color: rgba(255, 255, 255, 0.9);
    }
  }
  .loginDisabled {
    // color: rgba(255, 255, 255, 0.6);
    background: #f1f2f6;
    border: 1px solid #d4d5d6;
    color: rgba(17, 18, 24, 0.25);
    cursor: not-allowed;
  }
  .icon {
    cursor: pointer;
  }

  .login-account-forget {
    float: right;
    height: 20px;
    font-size: 12px;
    font-weight: 400;
    color: #2970ff;
    line-height: 20px;
  }

  .send-verification {
    height: 22px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    &-disable,
    &-timer {
      color: rgba(17, 18, 24, 0.25);
      cursor: not-allowed;
    }
    &-enable {
      color: #2970ff;
      cursor: pointer;
    }
  }

  .mb-41 {
    margin-bottom: 41px;
  }

  .send-success {
    position: absolute;
    top: 277px;
    left: 0;
    height: 20px;
    font-size: 12px;
    font-weight: 400;
    color: rgba(17, 18, 24, 0.65);
    line-height: 20px;
    .icon {
      font-size: 12px;
      margin-right: 4px;
      color: #00c293;
      &:hover {
        cursor: unset;
        color: #00c293;
      }
    }
  }
}
.login-err-box /deep/ .login-input.ant-input,
.login-err-box .login-input /deep/.ant-input,
.verification-err-box .verification-input /deep/.ant-input {
  border-color: #f0353f !important;
  &:focus {
    box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
  }
}
.login-err-box {
  position: relative;

  .err-tips,
  .err-tips-2 {
    text-align: left;
    position: absolute;
    top: 109px;
    left: 0;
    height: 20px;
    font-size: 12px;
    font-weight: 400;
    color: #f0353f;
    line-height: 20px;
  }
  .err-tips-2 {
    top: 193px;
  }
}
.verification-err-box .err-tips-3 {
  text-align: left;
  position: absolute;
  top: 277px;
  left: 0;
  height: 20px;
  font-size: 12px;
  font-weight: 400;
  color: #f0353f;
  line-height: 20px;
}
/deep/ .ant-modal {
  width: 520px !important;
}
/deep/ .ant-input-affix-wrapper {
  text-align: left;
}
.ant-modal-content {
  .ok-btn {
    background: #17bc94;
    border: 1px solid #17bc94;
  }
  .ant-modal-body {
    .img {
      margin-top: 26px;
    }
    .img-text {
      margin: 16px 0 18px 0;
    }
    .overflow-text {
      font-size: 16px;
    }
  }
}
</style>
