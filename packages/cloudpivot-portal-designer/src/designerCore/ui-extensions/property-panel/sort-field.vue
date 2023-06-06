<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <FieldSelector
    :field="sortField"
    :dataSource="dataSource"
    :bizModel="bizModel"
    :ignoreDataItem="ignoreDataItem"
    :fieldList="displayFieldList"
    :disabled="disabled"
    :fieldDataSource="displayFieldList"
    @emitChange="sortChange"
  />
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';

import { DataItemType } from 'cloudpivot-form/form/schema';

import { FieldSelector } from '@portal-designer/toolbox';

@Component({
  components: {
    FieldSelector,
  },
})
export default class DisplayField extends Mixins(PropertyComponent) {
  displayFieldList: any[] = [];

  sortField: any = {};

  dataSource: string = '';

  bizModel: string = '';

  ignoreDataItem: DataItemType[] = [];

  get activeNode() {
    const { widgets, activeId } = this.$uiContext as any;
    return widgets?.[activeId];
  }

  sortChange(val) {
    this.sortField = val;
    this.emitChange(JSON.stringify(val));
  }

  created() {
    this.sortField = JSON.parse((this.groupCtrl?.value as any) || '{}');
    this.ignoreDataItem = [
      DataItemType.Attachment,
      DataItemType.Sheet,
      DataItemType.RelevanceForm,
      DataItemType.RelevanceFormEx,
      DataItemType.Address,
      DataItemType.StaffMulti,
      DataItemType.DeptSingle,
      DataItemType.DeptMulti,
      DataItemType.StaffDeptMix,
      DataItemType.Logic,
      DataItemType.LongText,
      DataItemType.StaffSingle,
      DataItemType.ApprovalOpinion,
      DataItemType.Radio,
      DataItemType.Checkbox,
      DataItemType.DropdownMulti,
    ];
  }

  @Watch('groupCtrl.value', { immediate: true })
  onValueChange(val: string) {
    this.sortField = JSON.parse(val || '{}');
  }

  @Watch('activeNode.propsProxy.dataSource', { immediate: true })
  dataSourceChange(val) {
    this.sortField = undefined;
    this.dataSource = this.activeNode.propsProxy.dataSource;
  }

  @Watch('activeNode.propsProxy.bizModel', { immediate: true })
  bizModelChange(val) {
    if (this.activeNode.propsProxy.dataSource === 'bizModel') {
      this.sortField = undefined;
      this.bizModel = this.activeNode.propsProxy.bizModel;
    }
  }

  @Watch('activeNode.propsProxy.displayField', { immediate: true })
  displayFieldChange(val) {
    this.displayFieldList = JSON.parse(
      this.activeNode.propsProxy.displayField || '[]',
    );
    if (
      !~this.displayFieldList.findIndex(
        (el) => el.value === this.sortField?.value,
      )
    ) {
      this.sortField = undefined;
    }
  }
}
</script>

<style lang="less" scoped></style>
