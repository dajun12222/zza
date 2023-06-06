<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="tabs-panel" :class="{ 'show-field-title': panel.showFieldTitle }">
    <!-- {{ panel }} -->
    <TextListDisplay
      :dataSource="panel.dataSource"
      :bizModel="panel.bizModel"
      :displayFieldList="
        panel.displayField ? JSON.parse(panel.displayField) : []
      "
      :sortField="panel.sortField ? JSON.parse(panel.sortField) : {}"
      :sortRule="panel.sortRule"
      :listIcon="panel.listIcon"
      :runMode="runMode"
      :textStyle="panelStyle"
      :showFieldTitle="panel.showFieldTitle"
      :queryConditions="panel.queryConditions"
    />
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
  panelStyle!: any;

  // 当前设计区域的渲染态：design, preview, runtime
  get runMode() {
    return this.$uiEngine.runMode as 'design' | 'preview' | 'runtime';
  }
}
</script>

<style lang="less" scoped>
.tabs-panel {
  padding-top: 8px;
  width: 100%;
  height: calc(100% - 50px);
  font-size: 13px;
  color: #111218;
  /deep/.text-list-display .header-btn {
    height: 50px;
    line-height: 50px;
    top: -58px;
  }
  &.show-field-title {
    padding-top: unset;
    /deep/.text-list-display .header-btn {
      top: -50px;
    }
  }
}
</style>
