<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <FileUploadTemplate :importVM="_self" />
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import MixinUpload from '../../../../components/global/modal/import/mixins/file-upload';
import FileUploadTemplate from '../../../../components/global/modal/import/templates/file-upload-template.vue';

@Component({
  name: 'DataUpload',
  components: {
    FileUploadTemplate,
  },
})
export default class DataUpload extends mixins(MixinUpload) {
  @Prop({ default: () => {} })
  groupItem?: any;

  accept: any = '.zip';

  get additionalOptions() {
    return {
      groupId: this.groupItem.id,
    };
  }
}
</script>

<style lang="less" scoped></style>
