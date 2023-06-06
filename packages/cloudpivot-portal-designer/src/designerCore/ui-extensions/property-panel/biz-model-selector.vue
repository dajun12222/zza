<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <bizModelSelector
    v-model="selectModel"
    :onlyBizModel="true"
    @emitChange="valueChange"
  />
</template>
<script lang="ts">
import { TreeSelect } from '@h3/antd-vue';
import { Component, Mixins, Watch } from 'vue-property-decorator';

import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';

import bizModelSelector from '@portal-designer/toolbox/components/biz-model-selector.vue';

@Component({
  name: 'biz-model-selector',
  components: {
    ATreeSelect: TreeSelect,
    bizModelSelector,
  },
})
export default class bizModelSelect extends Mixins(PropertyComponent) {
  selectModel: string = '';

  created() {
    this.selectModel = this.groupCtrl?.value as any;
  }

  @Watch('groupCtrl.value', { immediate: true })
  onValueChange() {
    if (!this.groupCtrl?.value as any) {
      this.selectModel = '';
      return;
    }
    this.selectModel = this.groupCtrl?.value as any;
  }

  valueChange(value) {
    this.emitChange(value);
  }
}
</script>
<style lang="less" scoped></style>
