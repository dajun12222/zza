<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="header" :style="getFormDBoxStyle()">
    <div>
      <div class="header-left">
        <a v-if="isDingTalk" class="aback" @click="back">{{
          $t('languages.common.back')
        }}</a>
        <!-- <img class="logo" :src="logo" @click="goHome" /> -->

        <slot name="h4"></slot>
        <!-- <h4>发起流程</h4> -->

        <a v-if="isDingTalk" class="open-blank" @click.prevent="openBlank">{{
          $t('languages.common.openInBrowser')
        }}</a>

        <div v-if="nodes.length > 0" class="header-dropdown">
          <a-dropdown :trigger="['click']">
            <div>
              <span>{{ activeNodes }}</span>
              <a-icon type="down" />
            </div>
            <!-- <a class="ant-dropdown-link" href="#">  <a-icon type="down" /> </a> -->
            <a-menu slot="overlay">
              <a-menu-item
                v-for="(node, index) in nodes"
                :key="node.activityCode"
                :class="{ 'a-menu-item-active': node.selected }"
                class="node-switch-menu-item"
              >
                <a href="javascript:;" @click="nodesSwitch(index)">{{
                  node.activityName
                }}</a>
              </a-menu-item>
              <!-- <a-menu-item>
                <a href="javascript:;">2nd menu item</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;">3rd menu item</a>
              </a-menu-item>-->
            </a-menu>
          </a-dropdown>
        </div>
      </div>

      <!-- <div
        class="header-right"
        :class="isInIframe ? '' : 'header-right-padding'"
      >


        <div
          v-if="
            !isEl &&
            ['DINGTALK', 'WECHAT'].includes(relatedType) &&
            (formObj.bizSheet.qrCodeAble === 'open' ||
              !formObj.bizSheet.qrCodeAble)
          "
          class="qrcode"
          @mouseover="showBigQrcode = true"
          @mouseout="showBigQrcode = false"
          @click.stop="showBigQrcode = true"
        >

          <span>
            <i class="icon aufontAll h-icon-all-qrcode"></i>{{ $t('languages.common.form.qrcode') }}
          </span>
          <div v-show="showBigQrcode" class="qrcode-enlarge">
            <img :src="url" />
            <p v-if="isAdd">
              {{
                $t('languages.common.form.scanCodeView', {
                  equip:
                    relatedType === 'WECHAT'
                      ? $t('languages.common.form.enterpriseWechet')
                      : $t('languages.common.form.dingtalk'),
                })
              }}
            </p>
            <p v-else>
              {{
                $t('languages.common.form.scanCodeFill', {
                  equip:
                    relatedType === 'WECHAT'
                      ? $t('languages.common.form.enterpriseWechet')
                      : $t('languages.common.form.dingtalk'),
                })
              }}
            </p>
          </div>
        </div>

        <div @click="copyURL">
          <span><i class="icon aufontAll h-icon-all-file-copy"></i>{{ $t('languages.common.form.CopyLink') }}</span>
        </div>

        <div v-if="isInIframe" @click.prevent="openBlank">
          <span>
            <a-icon type="select" />
            {{ $t('languages.common.form.OpenInNewPage') }}
          </span>
        </div>


      </div> -->
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts">
import OAuthApi from '@/apis/oauth';
import site from '@/config/site';
import { externalLinkApi } from 'cloudpivot/api';
import { Button, Dropdown, Icon, Menu } from '@h3/antd-vue';
import { ConfigType } from '@h3/antd-vue/types/message';
import dd from 'dingtalk-jsapi';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

@Component({
  name: 'form-detail-header',
  components: {
    AButton: Button,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    AIcon: Icon,
  },
})
export default class FormDetailHeader extends Vue {
  @Getter('getAntLocale') locale!: string;

  @Prop() formObj!: any;

  @Prop() nodes!: any;

  showBigQrcode = false;

  url = '';

  getFormDBoxStyle() {
    if (window.top !== window.self) {
      return {
        padding: '0 32px 0 32px',
      };
    }
    return {
      padding: '0 64px 0 64px',
    };
  }

  // showTrack: boolean = true;

  get logo() {
    return site.logo;
  }

  isInIframe: boolean = false;

  /**
   * 是否是外链
   */
  get isEl(): boolean {
    return !!(window as any).externalLinkToken;
  }

  async getUserInfo() {
    const res = await OAuthApi.getUserInfo();
    if (res.errcode === 0) {
      const info: any = res.data;
      sessionStorage.setItem('user', JSON.stringify(info));
      this.onFormObjChange(this.formObj);
    }
  }

  // 跳转到首页
  goHome() {
    const appCode = (window as any).Environment
      ? (window as any).Environment.appCode
      : null;
    if (appCode) {
      this.$router
        .push({
          name: 'singleApp',
          params: {
            appCode,
          },
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      this.$router.push({ name: 'myUnfinishedWorkItem' }).catch((err: any) => {
        console.log(err);
      });
    }
  }

  isAdd = false;

  proxyAction() {
    this.$emit('action', {
      code: 'formTrack',
      disabled: false,
      loading: false,
      text: '表单留痕',
      visible: true,
    });
  }

  back() {
    const url = this.$route.query.return as string;
    if (url) {
      this.$router
        .push({
          path: url,
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      this.isHistory() ? this.$router.go(-1) : dd.biz.navigation.close({});
    }
    // const back = sessionStorage.getItem('backList');
    // if (back) {
    //   const url : any = sessionStorage.getItem('backListUrl');
    //   sessionStorage.removeItem('backList');
    //   this.$router.push(url);
    //   this.$router.go(-1);
    // } else {
    //   const url : any = sessionStorage.getItem('backListUrl');
    //   this.$router.go(-1);
    // }
  }

  /**
   * 判断是否有history记录
   * @return boolean
   */
  isHistory(): boolean {
    if (
      navigator.userAgent.indexOf('MSIE') >= 0 &&
      navigator.userAgent.indexOf('Opera') < 0
    ) {
      // IE
      if (history.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      //非IE浏览器
      if (
        navigator.userAgent.indexOf('Firefox') >= 0 ||
        navigator.userAgent.indexOf('Opera') >= 0 ||
        navigator.userAgent.indexOf('Safari') >= 0 ||
        navigator.userAgent.indexOf('Chrome') >= 0 ||
        navigator.userAgent.indexOf('WebKit') >= 0
      ) {
        if (window.history.length > 1) {
          return true;
        } else {
          return false;
        }
      } else {
        //未知的浏览器
        return true;
      }
    }
  }

  closeIframe() {
    let user: any = sessionStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
    }
    localStorage.removeItem(`${user.name}_latestSign`);

    window.parent.postMessage('hidden-close', origin);
  }

  copyURL() {
    // 复制链接
    try {
      const vm = this;
      let href: any = location.href;
      const iframeAction: any = href.match(/%26iframeAction%3Ddetail/g);
      if (Array.isArray(iframeAction) && iframeAction.length > 1) {
        for (let i = 0; i < iframeAction.length - 1; i++) {
          href = href.replace('%26iframeAction%3Ddetail', '');
        }
      }
      const oInput = document.createElement('input');
      oInput.value = href;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand('Copy');
      oInput.style.display = 'none';
      this.$message.success(
        vm.$t('languages.common.form.CopySuccess') as ConfigType,
      );
    } catch (error) {
      const vm = this;
      this.$message.error(
        vm.$t('languages.common.form.CopyFailed') as ConfigType,
      );
    }
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

    const parent = window.parent;
    parent.open(url, '_blank');
  }

  // get url() {
  //   // const config:any = this.$store.state.config;
  //   // const corpId = config.corpId;
  //   // const agentId = config.agentId;

  //   // const locHref = window.location.pathname + window.location.search;

  //   // const signinUrl = '47.107.160.206' + "/mobile/?meetingId="+"&corpId=ding6a0a954b9b413bcf35c2f4657eb6378f&agentId=235111190&mode=create&schemaCode=meeting_signin&sheetCode=signin&num=" + new Date().getTime();
  //   //

  //   return src;
  // }

  get isEL() {
    return (window as any).externalLinkToken;
  }

  get activeNodes() {
    const theNode = this.nodes.find((res) => res.selected);
    if (theNode) {
      return theNode.activityName;
    }
    return '';
  }

  nodesSwitch(index: number) {
    if (this.nodes[index].selected) {
      return;
    }
    let theNode = '';
    this.nodes.forEach((res, idx) => {
      if (idx === index) {
        res.selected = true;
        theNode = res.activityCode;
      } else {
        res.selected = false;
      }
    });
    this.nodes = this.nodes.slice();

    this.$emit('nodesSwitch', theNode);
  }

  get showQrcode() {
    let user: any = sessionStorage.getItem('user');
    if (!user) {
      return;
    }
    user = JSON.parse(user);

    const syncTypeIsCloudPivot =
      user.relatedType === 'DINGTALK' || user.relatedType === 'WECHAT';
    if (!syncTypeIsCloudPivot) {
      return false;
    }
    // ;
    if (!this.formObj.bizSheet) {
      return false;
    }
    // 表单二维码码默认开启
    if (
      this.formObj.bizSheet.qrCodeAble === 'open' ||
      !this.formObj.bizSheet.qrCodeAble
    ) {
      return true;
    }
    return false;
  }

  created() {
    const user = sessionStorage.getItem('user');
    if (!user) {
      this.getUserInfo();
    }

    this.isInIframe = window.top !== window.self;

    // this.showTrack= (this.formObj.bizObject.loadedFromDb && this.formObj.formPermission.actionPermission.formTrack) ? true : false ;
  }

  get showTrack() {
    return this.formObj.bizObject.loadedFromDb &&
      this.formObj.formPermission.actionPermission.formTrack
      ? true
      : false;
  }

  mounted() {
    document.addEventListener('click', this.outFocus);
  }

  destoryed() {
    document.removeEventListener('click', this.outFocus);
  }

  outFocus() {
    this.showBigQrcode = false;
  }

  relatedType: string = '';

  @Watch('formObj', {
    immediate: true,
  })
  onFormObjChange(formObj: any) {
    if (!formObj.bizSheet) {
      return;
    }

    const { workflowInstanceId, workItemId, workflowCode } = formObj;

    const { id, schemaCode, sheetCode, loadedFromDb } = formObj.bizObject;

    if (!this.$store) {
      return;
    }
    let user: any = sessionStorage.getItem('user');
    if (!user) {
      return;
    }
    user = JSON.parse(user);
    const config = {
      corpId: user.corpId,
      agentId: user.agentId,
      mobileServerUrl: user.mobileServerUrl,
      relatedType: user.relatedType,
    };
    // const { config } = this.$store.state;

    // if (!config) {

    // }

    const { corpId } = config;

    const { agentId } = config;

    const { relatedType } = config;

    this.relatedType = relatedType;

    this.isAdd = loadedFromDb;

    let signinUrl = '';
    // 数据来自数据库 生成查看表单
    if (loadedFromDb) {
      // 流程表单
      if (workflowInstanceId && workItemId) {
        // 新增
        signinUrl = `${config.mobileServerUrl}/?workflowInstanceId=${workflowInstanceId}&workItemId=${workItemId}&corpId=${corpId}&agentId=${agentId}&mode=form`;
        if (this.nodes.length > 0) {
          signinUrl += '&isWorkFlow=true';
        }
      } else {
        // 业务表单
        signinUrl = `${config.mobileServerUrl}/?corpId=${corpId}&agentId=${agentId}&schemaCode=${schemaCode}&sheetCode=${sheetCode}&id=${id}&mode=form`;
      }

      // signinUrl =`${config.mobileServerUrl}/?workflowInstanceId=${workflowInstanceId}&workItemId=${workItemId}&id=${id}&schemaCode=${schemaCode}&sheetCode=${sheetCode}&corpId=${corpId}&agentId=${agentId}`;
    } else {
      // 查看
      // 数据无数据，生成新表单或者发起流程

      if (workflowCode) {
        // 发起流程
        signinUrl = `${config.mobileServerUrl}/?workflowCode=${workflowCode}&corpId=${corpId}&agentId=${agentId}&mode=form`;
      } else {
        // 新增业务表单
        signinUrl = `${config.mobileServerUrl}/?corpId=${corpId}&agentId=${agentId}&schemaCode=${schemaCode}&sheetCode=${sheetCode}&mode=form`;
      }
      // signinUrl =`${config.mobileServerUrl}/?workflowInstanceId=${workflowInstanceId}&workItemId=${workItemId}&schemaCode=${schemaCode}&sheetCode=${sheetCode}&corpId=${corpId}&agentId=${agentId}`;
    }
    if (relatedType === 'WECHAT') {
      this.relatedType = 'WECHAT';
      // 企业微信端
      signinUrl = encodeURIComponent(signinUrl);
      signinUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corpId}&redirect_uri=${signinUrl}&state=STATE&scope=snsapi_base#wechat_redirect`;
    }
    const that = this;
    // const text: string = decodeURI(encodeURIComponent(signinUrl));
    // this.url= `${env.apiHost}/api/qrcode/generate_qrcode?text=${text}`;

    const params: OAuth.ShortCodeParams = {
      url: signinUrl,
      type: this.getType(formObj), //type为5表示扫码登陆
      expireTime: -1, //五分钟失效
      uniqueCode: this.formObj.bizSheet.id + '_' + this.getType(formObj),
    };

    if (loadedFromDb) {
      params.uniqueCode = params.uniqueCode + '_' + id;
    }
    OAuthApi.getShortCode(params).then((result) => {
      if (result.errcode === 0) {
        // 将图片二进制流转成base64，兼容IE11
        externalLinkApi
          .generateQrcode(
            `${location.origin}/api/public/short_code/to/${result.data}`,
          )
          .then((res: any) => {
            const bytes = new Uint8Array(res);
            let data = '';
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
              data += String.fromCharCode(bytes[i]);
            }
            that.url = 'data:image/png;base64,' + window.btoa(data);
          });
      } else {
        this.$message.warning('获取短码失败');
      }
    });

    //
  }

  getType(formObj) {
    const { workflowInstanceId, workItemId } = formObj;

    const { loadedFromDb } = formObj.bizObject;
    if (loadedFromDb && workflowInstanceId && workItemId) {
      return 10;
    } else {
      return this.isAdd ? 7 : 6;
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/styles/themes/default.less';
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';

.header {
  box-shadow: 0px -4px 12px rgba(0, 0, 0, 0.15) !important;
  background-color: #fff;
  &-left {
    display: flex;
    align-items: center;
    h4 {
      font-size: 20px;
      color: #000;
      margin-bottom: 0;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    padding-right: 40px;
    &-padding {
      padding-right: 40px;
    }
    & > div {
      margin-left: 32px;
      color: #111218;
      i {
        margin-right: 5px;
      }
      &:hover {
        span {
          color: @highlightColor;
        }
        cursor: pointer;
      }
      &.icon-close {
        margin-right: -16px;
        font-size: 16px;
        top: 11px;
        cursor: pointer;
        color: rgba(17, 18, 24, 0.5);
        vertical-align: baseline;
        &:hover {
          color: @highlightColor;
        }
      }
    }
  }
  &-dropdown {
    display: flex;
    align-items: center;
    margin-left: 16px;
    padding-left: 16px;
    height: 32px;
    border-left: 1px solid rgba(217, 217, 217, 1);
    .ant-dropdown-trigger {
      & > span {
        display: inline-block;
        max-width: 140px;
        margin-right: 3px;
        // width: 140px;
      }
    }
  }
  .qrcode {
    // margin-left: 33px;
    // margin-right: 16px;
    position: relative;
    & > img {
      width: 26px;
      cursor: url('~@/assets/images/enlarge-o.png'), pointer;
      margin: 2px;
    }
    .qrcode-enlarge {
      position: absolute;
      top: 28px;
      border: 1px solid rgba(221, 221, 221, 1);
      background: #fff;
      img {
        width: 250px;
        height: 250px;
        // max-height: 250px !important;
      }
      p {
        text-align: center;
        padding-bottom: 16px;
      }
      // left: 0;
      right: -1px;
    }
  }
  img.logo {
    cursor: pointer;
    max-height: 30px !important;
  }

  & > div:first-child {
    // border-right: 1px solid rgba(217, 217, 217, 1);
    flex-grow: 1;
    display: flex;
    justify-content: space-between;

    a.aback {
      font-size: 18px;
      margin-right: 8px;

      &::after {
        content: '';
        height: 18px;
        width: 1px;
        background-color: #d8d8d8;
        display: inline-block;
        position: relative;
        top: 3px;
        margin-left: 8px;
      }
    }
  }
}
</style>

<style lang="less">
.node-switch-menu-item {
  width: 180px;
  &.a-menu-item-active {
    background: rgba(240, 247, 255, 1);
    font-weight: 600;
  }
}
</style>
