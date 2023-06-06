<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <span>
    文件生成完成，请前往<a @click="handleUpload">导出任务列表</a>手动下载文件
  </span>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class MessageExport extends Vue {
  handleUpload() {
    this.$emit('handleUpload');
  }
}
</script>
