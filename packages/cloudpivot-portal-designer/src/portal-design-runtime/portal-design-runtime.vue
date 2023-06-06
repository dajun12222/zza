<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="portal-design-runtime" :class="runMode" @resize="onResize">
    <div v-if="runMode !== 'runtime'" class="preview-tips">
      <span class="preview-icon aufontAll">&#xed1c;</span>
      <span class="preview-content">门户预览</span>
    </div>
    <designRuntime
      :key="pageCode"
      ref="content"
      :pageCode="pageCode"
      :runMode="runMode"
      :class="{ preview: runMode !== 'runtime' }"
    />

    <!-- 详情弹出层 -->
    <IframeModal
      :showIframeForm="showIframeForm"
      :IframeFormUrl="IframeFormUrl"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Provide } from 'vue-property-decorator';
import designRuntime from './runtime.vue';

import { RunMode } from '@cloudpivot-shared/ui-engine-vue';

import IframeModal from 'cloudpivot-flow/flow-center/src/components/pc/components/iframe-modal/iframe-modal.vue';
import { utils } from 'cloudpivot/common';
@Component({
  name: 'portalDesignRuntime',
  components: {
    designRuntime,
    IframeModal,
  },
})
export default class portalDesignRuntime extends Vue {
  @Watch('$route.params')
  onRouteChange(val, oldVal) {
    if (this.$store.hasModule(oldVal.pageCode)) {
      this.$store.unregisterModule(oldVal.pageCode);
    }
  }

  beforeCreate() {
    if (this.$store.hasModule('defaultPortalDashboard')) {
      this.$store.unregisterModule('defaultPortalDashboard');
    }
  }

  // 弹窗显示表单详情start
  showFormDetailCb: any = null; // 弹窗关闭回调

  @Provide()
  showFormDetail(IframeFormUrl: string, showFormDetailCb: Function) {
    this.IframeFormUrl = IframeFormUrl;
    // this.showIframeForm = true;
    // alert(111)

    //window.open(IframeFormUrl, '_blank');
    let att:any = IframeFormUrl.split('?');
      let params:any = utils.getParams(IframeFormUrl);
        let { href } = this.$router.resolve({
          path: att[0],
          query: params
        });
      window.open(href,'_blank');
    this.showFormDetailCb = showFormDetailCb;
  }

  showIframeForm: boolean = false;

  IframeFormUrl: string = '';

  time: any = null;

  closeModal() {
    this.showFormDetailCb && this.showFormDetailCb();
    this.showIframeForm = false;
    this.IframeFormUrl = '';
    this.showFormDetailCb = null;
  }

  mounted() {
    window.addEventListener('message', this.reloadMessage, false);
    window.addEventListener('storage', this.reload1);
  }




  reload1(event: any) {
    if (event.key === 'refreshToDo' && event['newValue']) {
      window.localStorage.setItem('refreshToDo', '');
      window.location.reload();
    }
  }

  beforeDestroy() {
    window.removeEventListener('message', this.reloadMessage, false);
    window.removeEventListener('storage', this.reload1);
  }

  reloadMessage(event: any) {
    if (event.data === 'close' && this.IframeFormUrl) {
      this.closeModal();
    }
  }
  // 弹窗显示表单详情end

  get runMode() {
    return this.$route.name === 'portal-design-preview'
      ? RunMode.Preview
      : RunMode.Runtime;
  }

  get pageCode() {
    return this.$route.params.pageCode || 'defaultPortalDashboard';
  }
}
</script>

<style lang="less">
#app .portal-design-runtime.preview {
  margin-top: -60px;
  overflow: hidden;
  padding-bottom: 40px;
}
.portal-design-runtime {
  display: flex;
  flex-flow: column;
  .ui-page {
    top: 0 !important;
    .fixed {
      z-index: 999;
    }
    .ui-page-widget {
      padding: 0;
      height: 100%;
      .row-header .right-operation .operation-wrapper .item:hover {
        color: #2970ff;
      }
    }
    .ui-grid-widget,
    .ui-page-widget {
      // background: #f6f7f9 !important;
      // padding: 0!important;
      // height: auto!important;
    }
    .ui-grid-widget.swiper_box,
    .ui-grid-widget.has-row-header {
      padding: 0 !important;
      height: auto;
      position: static!important;
    }
    // .ui-grid-widget.swiper_box{
    //   position: static!important;
    //  padding-top: 72px;
    // }
    .de_content.ui-grid-widget{
      position: static!important;
      padding-top: 0px!important;
      
    }
    .ui-grid-widget.swiper_box {
      // @media screen and (max-width: 1441px) {
      //           }
      height: auto !important;
    }

    .ui-grid {
      background: #f6f7f9 !important;
    }
    .ui-container-empty {
      display: none;
    }
    &.preview {
      top: 40px !important;
      background: #f6f7f9 !important;
      .fixed {
        top: 40px;
        height: calc(100% - 40px);
      }
    }
  }
  .preview-tips {
    height: 40px;
    width: 100%;
    text-align: center;
    background: #f0f7ff;
    line-height: 40px;
    .preview-icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-right: 8px;
      color: #111218;
      font-size: 14px;
    }
    .preview-content {
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #111218;
      line-height: 22px;
    }
  }
}
.fixed .ui-grid {
  background-color: #fafafa !important;
}
</style>
