<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <QueryConditionsSetter
    :value="queryConditionsList"
    :dataSource="dataSource"
    :bizModel="bizModel"
    @valueChange="valueChange"
  />
</template>
<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';

import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';

import { QueryConditionsSetter } from '@portal-designer/toolbox';

@Component({
  name: 'query-condition-setter',
  components: {
    QueryConditionsSetter,
  },
})
export default class QueryConditionSetter extends Mixins(PropertyComponent) {
  queryConditionsList: string = '';

  dataSource: string = '';

  bizModel: string = '';

  get activeNode() {
    const { widgets, activeId } = this.$uiContext as any;
    return widgets?.[activeId];
  }

  valueChange(val) {
    this.emitChange(val);
  }

  created() {
    this.queryConditionsList = this.groupCtrl?.value as any;
  }

  @Watch('groupCtrl.value', { immediate: true })
  onValueChange(val: string) {
    this.queryConditionsList = this.groupCtrl?.value as any;
  }

  @Watch('activeNode.propsProxy.bizModel', { immediate: true })
  bizModelChange(val) {
    if (this.activeNode.propsProxy.dataSource === 'bizModel') {
      this.bizModel = this.activeNode.propsProxy.bizModel;
    }
  }
}
</script>
