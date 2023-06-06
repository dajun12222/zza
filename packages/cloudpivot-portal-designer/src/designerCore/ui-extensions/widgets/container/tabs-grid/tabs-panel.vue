<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="tabs-panel">
    <ui-element :draggable="false" :uid="panel.id" :index="index" />
  </div>
</template>

<script lang="ts">
import { TextListDisplay } from '@portal-designer/toolbox';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'tabs-panel',
  components: {
    TextListDisplay,
  },
})
export default class TabsPanel extends Vue {
  @Prop()
  readonly panel!: any;

  @Prop()
  readonly index!: any;
}
</script>

<style lang="less" scoped>
.tabs-panel {
  width: 100%;
  height: 100%;
  /deep/.ui-design-element {
    height: 100%;
    background: transparent !important;
  }
  &.row {
    height: calc(100% - 50px);
  }
  &.column {
    width: calc(100% - 84px);
  }
}
</style>
<style lang="less">
.tabs-grid-panel .ui-page-widget .ui-grid {
  background: transparent !important;
}
</style>
