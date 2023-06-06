<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="tabs-grid-panel" :style="style">
    <ui-layout />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';

import TabPanelBase from './tab-panel-base';

@Component({
  components: {},
})
export default class UiTabPanel extends Mixins(TabPanelBase) {}
</script>

<style lang="less" scoped>
.tabs-grid-panel {
  .ui-grid--wrapper {
    /deep/ .ui-grid {
      background: transparent !important;
      .ui-container-empty {
        background: transparent !important;
        p {
          color: rgba(17, 18, 24, 0.5);
          margin-top: 12px !important;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
