<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div :style="style">
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
.designer-page,
/deep/.designe-zone {
  height: 100%;
}
</style>
