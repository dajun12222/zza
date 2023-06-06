<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="app-portal-design-runtime">
    <app-portal-design-header :appCode="appCode" />
    <div class="portal-designer-content">
      <app-portal-design-aside :appCode="appCode" />
      <designRuntime :key="pageCode" :pageCode="pageCode" :runMode="runMode" />
    </div>
  </div>
</template>

<script lang="ts">
import { RunMode } from '@cloudpivot-shared/ui-engine-vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import appPortalDesignAside from '../components/app-portal-design-aside.vue';
import appPortalDesignHeader from '../components/app-portal-design-header.vue';
import designRuntime from './runtime.vue';

@Component({
  name: 'appPortalDesignRuntime',
  components: {
    designRuntime,
    appPortalDesignHeader,
    appPortalDesignAside,
  },
})
export default class appPortalDesignRuntime extends Vue {
  @Watch('$route.params')
  onRouteChange(val, oldVal) {
    if (this.$store.hasModule(oldVal.pageCode)) {
      this.$store.unregisterModule(oldVal.pageCode);
    }
  }

  get runMode() {
    return this.$route.name === 'app-portal-design-preview'
      ? RunMode.Preview
      : RunMode.Runtime;
  }

  get pageCode() {
    return this.$route.params.pageCode || 'defaultPortalDashboard';
  }

  get appCode() {
    let appCode: any = this.$route.params.pageCode;
    return appCode.substring(0, appCode.length - 8);
  }

  created() {}
}
</script>

<style lang="less">
#app .app-portal-design-runtime {
  margin-top: -60px;
  .app-portal-design-header {
    position: fixed;
    width: 100%;
    z-index: 999;
    .header-right {
      i {
        &:hover {
          color: #2970ff;
        }
      }
    }
  }
  .portal-designer-content {
    display: flex;
    height: 100%;
    padding-top: 60px;
    .app-list-tree {
      height: calc(100% - 75px);
    }
  }
}
#app .app-portal-design-runtime .ui-page {
  background: #f6f7f9 !important;
  .fixed {
    position: relative;
  }
  .ui-page-widget {
    padding: 0;
    height: 100%;
  }
  .ui-grid-widget,
  .ui-page-widget,
  .ui-grid {
    
    // background: #f6f7f9 !important;
  }
  .ui-container-empty {
    display: none;
  }
}
</style>
