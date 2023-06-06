<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <DisplayFieldSelector
    :fieldList="displayFieldList"
    :dataSource="dataSource"
    :bizModel="bizModel"
    :ignoreDataItem="ignoreDataItem"
    @emitChange="listChange"
  />
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';

import { DataItemType } from 'cloudpivot-form/form/schema';

import { DisplayFieldSelector } from '@portal-designer/toolbox';

@Component({
  name: 'display-field',
  components: {
    DisplayFieldSelector,
  },
})
export default class DisplayField extends Mixins(PropertyComponent) {
  displayFieldList: any = [];

  dataSource: string = '';

  bizModel: string = '';

  ignoreDataItem: DataItemType[] = [];

  get activeNode() {
    const { widgets, activeId } = this.$uiContext as any;
    return widgets?.[activeId];
  }

  listChange(val) {
    this.emitChange(JSON.stringify(val));
  }

  created() {
    this.displayFieldList = JSON.parse((this.groupCtrl?.value as any) || '[]');
    this.ignoreDataItem = [
      DataItemType.Attachment,
      DataItemType.Sheet,
      DataItemType.RelevanceForm,
      DataItemType.RelevanceFormEx,
      DataItemType.Address,
      DataItemType.Logic,
      DataItemType.LongText,
    ];
  }

  @Watch('groupCtrl.value', { immediate: true })
  onValueChange(val: string) {
    this.displayFieldList = JSON.parse(val || '[]');
  }

  @Watch('activeNode.propsProxy.dataSource', { immediate: true })
  dataSourceChange(val) {
    this.dataSource = this.activeNode.propsProxy.dataSource;
  }

  @Watch('activeNode.propsProxy.bizModel', { immediate: true })
  bizModelChange(val) {
    if (this.activeNode.propsProxy.dataSource === 'bizModel') {
      this.bizModel = this.activeNode.propsProxy.bizModel;
    }
  }
}
</script>

<style lang="less" scoped></style>
