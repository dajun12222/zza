<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <batch-info-add />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import flowCenter from 'cloudpivot-flow/flow-center/mobile';

@Component({
  name: 'batch-opt',
  components: {
    BatchInfoAdd: flowCenter.components.BatchInfoAdd,
  },
})
export default class BatchOpt extends Vue {}
</script>

<style lang="less" scoped></style>
