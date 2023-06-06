<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="title-setter">
    <InternationalInput :valueI18n="value_i18n" @valueChange="valueChange" />
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';
import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';

import { InternationalInput } from '@portal-designer/toolbox';

@Component({
  name: 'title-setter',
  components: {
    InternationalInput,
  },
})
export default class AutoplaySpeedSetter extends Mixins(PropertyComponent) {
  value_i18n: any = {};

  created() {
    try {
      this.value_i18n = JSON.parse(this.groupCtrl?.value as any);
    } catch (err) {
      this.value_i18n = {
        zh: this.groupCtrl?.value,
        en: this.groupCtrl?.value,
      };
    }
  }

  @Watch('groupCtrl.value', { immediate: true })
  onValueChange() {
    try {
      this.value_i18n = JSON.parse(this.groupCtrl?.value as any);
    } catch (err) {
      this.value_i18n = {
        zh: this.groupCtrl?.value,
        en: this.groupCtrl?.value,
      };
    }
  }

  valueChange(value) {
    this.emitChange(JSON.stringify(value));
  }
}
</script>
<style lang="less" scoped></style>
