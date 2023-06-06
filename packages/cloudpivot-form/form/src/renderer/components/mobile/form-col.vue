<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="form-col">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { LayoutCol } from '../../typings';

@Component({
  name: 'form-col',
})
export default class FormCol extends Vue {
  @Prop()
  control!: LayoutCol;

  @Prop()
  span!: number;

  get colSpan() {
    if (typeof this.span === 'number') {
      return this.span;
    }
    return this.control.span;
  }
}
</script>

<style lang="less" scoped>
.form-col {
  display: block;
  box-sizing: border-box;
  width: 100%;
}
</style>
