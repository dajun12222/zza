<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <IndexTemplate :importVM="_self">
    <FileUpload
      v-if="curStep === 0"
      slot="file-upload"
      ref="fileUpload"
      @nextStep="nextStep"
    />
    <FileValidate
      v-if="curStep === 1"
      slot="file-validate"
      :fileName="uploadResult.fileName"
      @prevStep="prevStep"
      @nextStep="nextStep"
      @setModalTitle="setModalTitle"
    />
    <FileImport
      v-else-if="curStep === 2"
      slot="file-import"
      :uploadResult="uploadResult"
      :validResult="validResult"
      @importEnd="importEnd"
      @close="close"
    />
  </IndexTemplate>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import FileImport from './file-import.vue';
import FileUpload from './file-upload.vue';
import FileValidate from './file-validate.vue';
import { mixins } from 'vue-class-component';
import MixinIndex from '../../../../components/global/modal/import/mixins/index';
import IndexTemplate from '../../../../components/global/modal/import/templates/index-template.vue';

@Component({
  name: '',
  components: {
    FileImport,
    FileUpload,
    FileValidate,
    IndexTemplate,
  },
})
export default class ImportApp extends mixins(MixinIndex) {
  /**
   * 重置弹窗标题
   */
  resetModalTitle() {
    this.modalTitle = '导入-应用';
  }
}
</script>
<style lang="less" scoped></style>
