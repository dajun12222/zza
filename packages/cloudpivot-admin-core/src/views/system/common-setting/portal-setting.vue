<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="portal-setting">
    <div class="guide">
      <div class="portal-setting__header">
        <span>门户访问设置</span>
        <span class="header__tips">门户钉钉扫码登录配置，若未配置，系统门户扫码不可用</span>
        <slot name="settingTips"></slot>
      </div>
      <div class="portal-setting__form">
        <a-row class="portal-setting__item">
          <a-col :span="layout.left" class="portal-setting__left">
            <span class="required">*</span>
            <span>企业名称</span>
            <a-tooltip>
              <div slot="title">
                <span>tips：企业名称的修改会改变license动态码</span>
              </div>
              <a-icon type="question-circle-o" />
            </a-tooltip>
            <span>:</span>
          </a-col>
          <a-col :span="layout.right" class="portal-setting__right">
            <span v-if="edit" class="check-dingtalk__right--edit">{{
              params.name
            }}</span>
            <a-input v-else v-model="params.name" @change="saveParams" />
          </a-col>
        </a-row>
        <a-row class="portal-setting__item">
          <a-col :span="layout.left" class="portal-setting__left">
            <span class="required">*</span>
            <span>
              CorpId
              <a-tooltip
                :title="'tips：钉钉企业的唯一标识，获取地址：钉钉后台，工作台-自建应用-开发信息-开发账号管理-企业自用账号信息'"
              >
                <a-icon type="question-circle-o" /> </a-tooltip>:
            </span>
          </a-col>
          <a-col :span="layout.right" class="portal-setting__right">
            <span v-if="syncEdit" class="check-dingtalk__right--edit">
              {{ params.corpId }}
            </span>
            <a-input v-else v-model="params.corpId" @change="corpIdChange" />
            <!-- <div class="empty-tip" v-if="!params.keyId">AccessKeyId不可为空</div> -->
          </a-col>
        </a-row>

        <a-row class="portal-setting__item">
          <a-col :span="layout.left" class="portal-setting__left">
            <span class="required">*</span>
            <span>SSOSecret :</span>
          </a-col>
          <a-col :span="layout.right" class="portal-setting__right">
            <span v-if="syncEdit" class="check-dingtalk__right--edit">
              <password-span :value="params.corpSecret" :fn="showSecret" />
            </span>
            <a-input v-else v-model="params.corpSecret" />
          </a-col>
        </a-row>

        <a-row class="portal-setting__item">
          <a-col :span="layout.left" class="portal-setting__left">
            <span class="required">*</span>
            <span>
              扫码登录 appID
              <a-tooltip
                :title="'tips：移动介入应用的标识，获取地址：钉钉后台，\
                    工作台-自建应用--应用设置-移动介入应用-扫码登录使用的appID、appSecret获取'"
              >
                <a-icon type="question-circle-o" /> </a-tooltip>:
            </span>
          </a-col>
          <a-col :span="layout.right" class="portal-setting__right">
            <span v-if="syncEdit" class="check-dingtalk__right--edit">
              {{ params.scanAppId }}
            </span>
            <a-input v-else v-model="params.scanAppId" />
          </a-col>
        </a-row>

        <a-row class="portal-setting__item">
          <a-col :span="layout.left" class="portal-setting__left">
            <span class="required">*</span>
            <span>扫码登录 appSecret :</span>
          </a-col>
          <a-col :span="layout.right" class="portal-setting__right">
            <span v-if="syncEdit" class="check-dingtalk__right--edit">
              <password-span :value="params.scanAppSecret" :fn="showSecret" />
            </span>
            <a-input v-else v-model="params.scanAppSecret" />

            <!-- <span v-if="edit" class="check-dingtalk__right--edit"> {{ params.scanAppSecret }} </span>
            <a-input v-else v-model= "params.scanAppSecret"/>-->
          </a-col>
        </a-row>

        <!-- <a-row class="portal-setting__item">
          <a-col :span="layout.left" class="portal-setting__left">
            <span class="required">*</span>
            <span>
              回调域名
              :
            </span>
          </a-col>
          <a-col :span="layout.right" class="portal-setting__right">
            <span v-if="edit" class="check-dingtalk__right--edit">{{ params.redirectUri }}</span>
            <a-input v-else v-model="params.redirectUri"/>
          </a-col>
        </a-row>

        <a-row class="portal-setting__item">
          <a-col :span="layout.left" class="portal-setting__left">
            <span class="required">*</span>
            <span>
              SSO 地址
              :
            </span>
          </a-col>
          <a-col :span="layout.right" class="portal-setting__right">
            <span v-if="edit" class="check-dingtalk__right--edit">{{ params.ssoServerUrl }}</span>
            <a-input v-else v-model="params.ssoServerUrl"/>
          </a-col>
        </a-row>-->

        <!-- <a-row class="portal-setting__item">
          <a-col :span="layout.left" class="portal-setting__left">
            <span class="required">*</span>
            <span>
              后台管理地址
              :
            </span>
          </a-col>
          <a-col :span="layout.right" class="portal-setting__right">
            <span v-if="edit" class="check-dingtalk__right--edit">{{ params.adminServerUrl }}</span>
            <a-input v-else v-model="params.adminServerUrl"/>
          </a-col>
        </a-row>-->
      </div>
    </div>
    <a-row v-if="isSuperAdmin" class="portal-setting__item">
      <a-col :span="layout.left" class="portal-setting__left" />
      <a-col :span="layout.right" class="portal-setting__right">
        <!-- <btn-group @save="save" @connect="connect"/> -->
        <div class="btn-group">
          <a-button
            v-if="isSuperAdmin"
            type="primary"
            class="btn-group__btn"
            @click="saveDate"
          >
            {{ btnText[0] }}
          </a-button>
          <a-button @click="connect">
            {{ btnText[1] }}
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script lang="ts">
import OrgApi from 'cloudpivot-admin-core/src/apis/organization';
import systemApi from 'cloudpivot-admin-core/src/apis/system/system-manager.api';
import PasswordSpan from 'cloudpivot-admin-core/src/components/global/password-span.vue';
import env from 'cloudpivot-admin-core/env';
import { Row, Col, Input, Tooltip, Icon, Button } from '@h3/antd-vue';
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import BtnGroup from './btn-group.vue';

const UserModule = namespace('System/User');

@Component({
  name: 'portal-setting',
  components: {
    BtnGroup,
    PasswordSpan,
    ARow: Row,
    ACol: Col,
    AInput: Input,
    ATooltip: Tooltip,
    AIcon: Icon,
    AButton: Button,
  },
})
export default class PortaleSetting extends Vue {
  @UserModule.State('loginedUserInfo') loginedUserInfo!: any;

  @Prop() info!: any;

  @PropSync('edit') syncEdit!: any;

  @PropSync('cloudPivot') syncCloudPivot!: any;

  layout = {
    left: 5,
    right: 10,
  };

  params = {
    appSecret: '',
    appkey: '',
    agentId: '',
    syncType: '',
    orgType: 0,
    name: '',
    corpId: '', // 企业id
    corpSecret: '', // 企业密钥
    scanAppId: '', // 移动端接入应用————应用id
    scanAppSecret: '', // 移动端接入应用————应用密钥
    adminServerUrl: '',
    ssoServerUrl: '',
    redirectUri: '', // 回调域名
    pcServerUrl: env.portalHost, // pc端首页地址
  };

  btnText = ['保存', '连接测试'];

  @Watch('info')
  infoChange(info) {
    this.initParams();
  }

  get isJustAdmin() {
    return this.$store.state.System.User.isJustAdmin;
  }
  // pcServerUrl: string = env.portalHost;

  get isSuperAdmin() {
    return (
      this.loginedUserInfo.username === 'admin' ||
      this.loginedUserInfo.username === 'Admin'
    );
  }

  mounted() {
    this.initParams();
  }

  // 初始化参数
  initParams() {
    const {
      name,
      corpId,
      scanAppId,
      appSecret,
      corpSecret,
      scanAppSecret,
      redirectUri,
      agentId,
      synRedirectUri,
      pcServerUrl,
      appkey,
    } = this.info;

    const { oauthHost, redirectHost } = env;

    // @ts-ignore
    this.params = {
      ...this.params,
      name,
      corpId,
      scanAppId,
      corpSecret,
      syncType: 'PUSH',
      orgType: 0,
      scanAppSecret,
    };

    appkey ? (this.params.appkey = appkey) : (this.params.appkey = '');
    appSecret
      ? (this.params.appSecret = appSecret)
      : (this.params.appSecret = '');
    agentId ? (this.params.agentId = agentId) : (this.params.agentId = '');
    synRedirectUri
      ? (this.params.redirectUri = synRedirectUri)
      : (this.params.redirectUri = oauthHost + '/login');
    pcServerUrl
      ? (this.params.pcServerUrl = pcServerUrl)
      : (this.params.pcServerUrl = env.portalHost);

    this.params.adminServerUrl = redirectHost;
    this.params.ssoServerUrl = oauthHost + '/login';

    this.$emit('changeEdit', true);
    this.btnText[0] = '编辑';
  }

  /**
   * @desc 保存cropid到localstorage， check-dingtalk.vue组件会用到
   */
  corpIdChange(e) {
    window.localStorage.setItem('$$_corpId', e.target.value);
  }

  // 保持配置数据
  saveDate() {
    const vm: any = this;
    if (vm.edit) {
      vm.$emit('changeEdit', false);
      vm.btnText[0] = '保存';
      return;
    }
    // if (!vm.pcServerUrl) {
    //   vm.$message.warning('请先配置pc端首页地址!', 2);
    //   return;
    // }
    /* 修改扫码传参参数来源，从env环境变量中读取 */
    // vm.params.adminServerUrl = `${vm.pcServerUrl}/admin`;
    // const reg = /^(http:\/\/|https:\/\/)(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/g;
    // if (reg.test(vm.pcServerUrl)) {
    //   vm.params.ssoServerUrl = `${vm.pcServerUrl}:8888/login`;
    //   vm.params.redirectUri = `${vm.pcServerUrl}:8888/login`;
    // } else {
    //   vm.params.ssoServerUrl = `https://sso.${vm.pcServerUrl.replace('https://', '')}/login`;
    //   vm.params.redirectUri = `https://api.${vm.pcServerUrl.replace('https://', '')}`;
    // }
    /* 设置传参 */
    const { oauthHost, redirectHost, apiHost } = env;
    vm.params.relatedType = 'DINGTALK';
    vm.params.syncType = 'PUSH';
    let otherParms: any = window.localStorage.getItem('$_orgParams');
    const syncType = this.syncCloudPivot;
    otherParms = !!otherParms ? JSON.parse(otherParms) : {};
    // @ts-ignore
    const params: any = {
      ...this.info,
      ...this.params,
      ...otherParms,
      syncType,
    };

    // 20200402 synRedirectUri can't be null, if null, use env.apihost, same with check-dingtalk.vue line 131
    params.synRedirectUri = !params.synRedirectUri
      ? apiHost
      : params.synRedirectUri;

    // 重置保单数据
    Object.keys(this.params).forEach((key: string) => {
      if (typeof this.params[key] === 'string') {
        this.params[key] = this.params[key].trim();
        if (typeof params[key] === 'string') {
          params[key] = params[key].trim();
        }
      }
    });

    params.appKey = params.appkey;

    delete params.parentDept;

    // 如果info有值，则update，没有值则add
    if (this.info && this.info.id) {
      this.update(params);
    } else {
      this.save(params);
    }

    // systemApi.creatPortalSetting(vm.params).then((res: any) => {
    //   if (res.errcode === 0) {
    //     vm.$message.success('保存成功!', 2);
    //     vm.edit = true;
    //     vm.btnText[0] = '编辑';
    //   } else {
    //     vm.$message.error(res.errmsg, 2);
    //   }
    // });
  }

  // 新增保存
  async save(params) {
    // @ts-ignore
    const { errcode, errmsg, data } = await OrgApi.addOrgan(params);

    if (errcode === 0) {
      this.$message.success(errmsg);
      this.close();
    } else {
      this.$message.error(errmsg);
    }
  }

  close() {
    this.btnText[0] = '编辑';
    this.$emit('changeEdit', true);
    this.$emit('close');
  }

  // 编辑保存
  async update(params) {
    // @ts-ignore
    const { errcode, errmsg, data } = await OrgApi.updateOrgan(params);
    if (errcode === 0) {
      this.$message.success(errmsg);
      this.close();
    } else {
      this.$message.error(errmsg);
    }
  }

  // 连接测试
  connect() {
    const vm: any = this;
    // if (!vm.pcServerUrl) {
    //   vm.$message.warning('请先配置pc端首页地址!', 2);
    //   return;
    // }
    /* 修改扫码传参参数来源，从env环境变量中读取 */
    // vm.params.adminServerUrl = `${vm.pcServerUrl}/admin`;
    // const reg = /^(http:\/\/|https:\/\/)(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/g;
    // if (reg.test(vm.pcServerUrl)) {
    //   vm.params.ssoServerUrl = `${vm.pcServerUrl}:8888/login`;
    //   vm.params.redirectUri = `${vm.pcServerUrl}:8888/login`;
    // } else {
    //   vm.params.ssoServerUrl = `https://sso.${vm.pcServerUrl.replace('https://', '')}/login`;
    //   vm.params.redirectUri = `https://api.${vm.pcServerUrl.replace('https://', '')}`;
    // }
    /* 设置传参 */

    let otherParms: any = window.localStorage.getItem('$_orgParams');
    otherParms = !!otherParms ? JSON.parse(otherParms) : {};

    const params: any = { ...vm.info, ...vm.params, ...otherParms };
    // ;
    systemApi.checkPortalSetting(params).then((res: any) => {
      if (res.errcode === 0) {
        vm.$message.success('连接成功！', 2);
      } else {
        vm.$message.error(res.errmsg, 2);
      }
    });
  }

  // 查看appSecret
  showSecret(success: Function) {
    const vm = this;
    if (this.isJustAdmin) {
      this.$confirm({
        title:
          '该信息属于企业高保密信息，相当于个人银行卡及密码，请勿随意传播，请避免企业信息泄露。',
        okText: this.$t('languages.Apps.Continue').toString(),
        cancelText: this.$t('languages.Apps.Cancel').toString(),
        onOk() {
          success();
        },
      });
    } else {
      this.$warning({
        title: '该信息属于企业保密项，如有需要，请联系超级管理员。',
        okText: this.$t('languages.Apps.Good').toString(),
      });
    }
  }
}
</script>

<style lang="less" scoped>
.portal-setting {
  text-align: left;
  margin-left: 6px;
  &__header {
    a {
      display: inline-block;
      font-size: 12px;
      color: @primary-color;
      padding-left: 8px;
    }
    padding-bottom: 20px;
    position: relative;
    // font-size:18px;
    color: #111218;
    font-weight: 600;
    span {
      line-height: 26px;
      height: 26px;
      // padding-left: 14px;
      // &:before{
      // 	content: "";
      // 	position: absolute;
      // 	height: 20px;
      // 	width: 0;
      // 	top: 3px;
      // 	left: 0;
      // 	border-left: 3px solid @primary-color;
      // }
    }
    .header__tips {
      display: inline-block;
      font-size: 12px;
      color: rgba(17, 18, 24, 0.5);
      padding-left: 8px;
    }
  }
  &__form {
    .portal-setting__item {
      margin-bottom: 20px;
      div {
        float: left;
      }
      .portal-setting__left {
        span {
          color: rgba(17, 18, 24, 0.5);
        }
        position: relative;
        .required {
          left: -6px;
          color: #f5222d;
          position: absolute;
        }
        /deep/.anticon {
          color: rgba(17, 18, 24, 0.5);
          padding-left: 4px;
        }
        line-height: 32px;
      }
      .portal-setting__right {
        line-height: 32px;
        color: #111218;
        &--edit {
          line-height: 32px;
        }
      }
    }
  }
}
</style>
