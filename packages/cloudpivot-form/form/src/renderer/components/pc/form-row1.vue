<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-row type="flex">
    <slot></slot>
  </a-row>
</template>

<script lang="ts">
import { Row } from '@h3/antd-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RendererLayoutControl } from '../../typings';

@Component({
  name: 'form-row',
  components: {
    ARow: Row,
  },
})
export default class FormRow extends Vue {
  @Prop()
  control!: RendererLayoutControl;
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common';
.dashed {
  border-bottom: 1px dashed @border-color;
}
.system-info-box {
  margin-bottom: 14px;
}
.has-form-border {
  .system-info-box {
    margin-bottom: 0;
  }
}
.ant-row-flex{
  border: none!important;
}
</style>
