<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="app-portal-runtime">
    <designRuntime :key="pageKey" :pageCode="pageCode" runMode="runtime" />

    <!-- 详情弹出层 -->
    <IframeModal
      :showIframeForm="showIframeForm"
      :IframeFormUrl="IframeFormUrl"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from 'vue-property-decorator';
import designRuntime from 'cloudpivot-portal-designer/src/portal-design-runtime/runtime.vue';
import IframeModal from 'cloudpivot-flow/flow-center/src/components/pc/components/iframe-modal/iframe-modal.vue';
@Component({
  name: 'AppPortalRuntime',
  components: {
    designRuntime,
    IframeModal,
  },
})
export default class AppPortalRuntime extends Vue {
  pageKey: number = +new Date();

  get pageCode() {
    this.pageKey = +new Date();
    return this.$route.params.appCode + 'HomePage';
  }

  // 弹窗显示表单详情start
  showFormDetailCb: any = null; // 弹窗关闭回调

  @Provide()
  showFormDetail(IframeFormUrl: string, showFormDetailCb: Function) {
    this.IframeFormUrl = IframeFormUrl;
    // alert(111)
    // this.showIframeForm = true;
    window.open(IframeFormUrl, '_blank');
    this.showFormDetailCb = showFormDetailCb;
  }

  showIframeForm: boolean = false;

  IframeFormUrl: string = '';

  closeModal() {
    this.showFormDetailCb && this.showFormDetailCb();
    this.showIframeForm = false;
    this.IframeFormUrl = '';
    this.showFormDetailCb = null;
  }

  mounted() {
    window.addEventListener('message', this.reloadMessage, false);
  }

  beforeDestroy() {
    window.removeEventListener('message', this.reloadMessage, false);
  }

  reloadMessage(event: any) {
    if (event.data === 'close' && this.IframeFormUrl) {
      this.closeModal();
    }
  }
  // 弹窗显示表单详情end
}
</script>

<style lang="less">
.app-portal-runtime {
  position: relative;
  height: 100%;
  background-color: #f7f8fa;
  .ui-page {
    .ui-page-widget {
      padding: 0;
      height: 100%;
      background: #f6f7f9 !important;
    }
    .ui-grid {
      background: #f6f7f9 !important;
      height: 100%;
      .ui-container-empty {
        display: none;
      }
    }
    .fixed {
      position: absolute;
      left: 20px;
      top: 20px;
      right: 20px;
      width: calc(100% - 40px);
      bottom: 0;
      z-index: 2 !important;
    }
  }
}
</style>
