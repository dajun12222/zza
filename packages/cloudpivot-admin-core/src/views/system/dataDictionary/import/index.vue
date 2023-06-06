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
      :groupItem="groupItem"
      @nextStep="nextStep"
    />
    <FileValidate
      v-if="curStep === 1"
      slot="file-validate"
      ref="fileValidate"
      :fileName="uploadResult.fileName"
      @prevStep="prevStep"
      @nextStep="nextStep"
      @setModalTitle="setModalTitle"
      @resetTitle="resetModalTitle"
    />
    <FileImport
      v-else-if="curStep === 2"
      slot="file-import"
      :uploadResult="uploadResult"
      :validResult="validResult"
      @close="close"
    />
  </IndexTemplate>
</template>

<script lang="ts">
import { Modal, Steps, Button } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import FileUpload from './file-upload.vue';
import FileValidate from './file-validate.vue';
import FileImport from './file-import.vue';
import { mixins } from 'vue-class-component';
import MixinIndex from '../../../../components/global/modal/import/mixins/index';
import IndexTemplate from '../../../../components/global/modal/import/templates/index-template.vue';

@Component({
  name: 'Import',
  components: {
    FileUpload,
    FileValidate,
    FileImport,
    IndexTemplate,
  },
  template: '#index-template',
})
export default class Import extends mixins(MixinIndex) {
  @Prop({ default: () => {} })
  groupItem?: any;

  mounted() {
    this.resetModalTitle();
  }

  resetModalTitle() {
    this.modalTitle = '导入-数据字典';
  }
}
</script>

<style lang="less"></style>
