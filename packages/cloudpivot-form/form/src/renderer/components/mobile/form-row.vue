<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="form-row">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RendererLayoutControl } from '../../typings';

@Component({
  name: 'form-row',
})
export default class FormRow extends Vue {
  @Prop()
  control!: RendererLayoutControl;
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common';

.form-row {
  display: flex;
  flex-flow: row wrap;

  &.dotted {
    border-bottom: 1px dotted @base-border-color;
  }
}
</style>
