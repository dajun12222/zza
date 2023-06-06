<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <reverse-relevance-tabs v-if="isTabs" :control="control" />
  <reverse-relevance-list v-else :control="control" />
</template>

<script lang="ts">
import common from 'cloudpivot/common/pc';
import { Component } from 'vue-property-decorator';
import { ReverseRelevanceControl } from '../../../controls';
import ReverseRelevanceList from './reverse-relevance-list.vue';
import ReverseRelevanceTabs from './reverse-relevance-tabs.vue';

@Component({
  name: 'reverse-relevance',
  components: {
    ReverseRelevanceList,
    ReverseRelevanceTabs,
    H3Panel: common.components.Panel,
  },
})
export default class ReverseRelevance extends ReverseRelevanceControl {}
</script>

<style lang="less" scoped></style>
