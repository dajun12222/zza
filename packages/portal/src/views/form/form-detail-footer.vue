<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="footer footerStyle">
    <div>
      <div class="footer-left">
        <slot name="isSaveData"></slot>
      </div>

      <div class="footer-right">
        <slot></slot>
        <slot name="upAndCreate"></slot>
        <!-- 提交并继续 -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import OAuthApi from '@/apis/oauth';
import site from '@/config/site';
import { externalLinkApi } from 'cloudpivot/api';
import { Button, Checkbox, Dropdown, Icon, Menu } from '@h3/antd-vue';
import dd from 'dingtalk-jsapi';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class';

@Component({
  name: 'form-detail-footer',
  components: {
    AButton: Button,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    AIcon: Icon,
    ACheckbox: Checkbox,
  },
})
export default class FormDetailFppter extends Vue {
  @Getter('getAntLocale') locale!: string;

  @Prop() formObj!: any;

  @Prop() nodes!: any;

  showBigQrcode = false;

  url = '';

  get logo() {
    return site.logo;
  }

  /**
   * 是否是外链
   */
  get isEl(): boolean {
    return !!(window as any).externalLinkToken;
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

  copyURL() {
    // 复制链接
    try {
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
      this.$message.success('复制成功');
    } catch (error) {
      this.$message.error('复制失败');
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

    window.open(url, '_blank');
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
}
</script>

<style lang="less" scoped>
@import '~@/styles/themes/default.less';

.footer {
  padding: 0 16px !important;
  position: fixed;
  z-index: 999;
  left: 0;
  right: 0;
  bottom: 0;
  height: 52px;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid rgba(232, 232, 232, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  &-left {
    display: flex;
    align-items: center;
    h4 {
      font-size: 16px;
      color: #000;
      margin-bottom: 0;
    }
  }

  /deep/ .ant-btn {
    padding: 0 16px;
  }

  .footer-right {
    display: flex;
    & > div {
      margin-left: 8px;
      color: rgba(0, 0, 0, 0.65);
      i {
        margin-right: 8px;
      }
      &:hover {
        span {
          color: #2970ff;
        }
        cursor: pointer;
      }
      &.icon-close {
        margin-right: -16px;
        font-size: 16px;
        color: #d8d8d8;
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
