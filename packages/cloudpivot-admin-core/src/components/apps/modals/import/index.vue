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
      :action="action"
      @nextStep="nextStep"
    />
    <FileValidate
      v-if="curStep === 1"
      slot="file-validate"
      ref="fileValidate"
      :fileName="uploadResult.fileName"
      :strategy="getImporter()"
      @handleCancel="close(false)"
      @prevStep="prevStep"
      @nextStep="nextStep"
      @setModalTitle="setModalTitle"
    />
    <FileImport
      v-else-if="curStep === 2"
      slot="file-import"
      :uploadResult="uploadResult"
      :validResult="validResult"
      :strategy="getImporter()"
      @handleCancel="close(false)"
      @importEnd="importEnd"
      @close="close"
    />
  </IndexTemplate>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator';
import FileImport from './file-import.vue';
import FileUpload from './file-upload.vue';
import FileValidate from './file-validate.vue';
import bizModelStrategy from './importStrategy/bizModelStrategy';
import reportStrategy from './importStrategy/reportStrategy';
import { mixins } from 'vue-class-component';
import MixinIndex from '../../../../components/global/modal/import/mixins/index';
import IndexTemplate from '../../../../components/global/modal/import/templates/index-template.vue';

@Component({
  name: 'DataImport',
  components: {
    FileUpload,
    FileValidate,
    FileImport,
    IndexTemplate,
  },
})
export default class DataImport extends mixins(MixinIndex) {
  @Prop() action!: any;

  //导入类型 报表？ 模型？
  @Prop() importType!: any;

  /**
   * 关闭弹窗重置
   */
  reset() {
    this.curStep = 0;
    this.show = false;
  }

  /**
   * 策略模式
   * 根据导入类型是模型还是报表
   * 选择不同的导入策略，不同的策略对导入过程
   * 中需要执行的操作有不同的实现方式
   */
  getImporter() {
    return this.importType === 'report'
      ? (reportStrategy as any)
      : (bizModelStrategy as any);
  }

  @Watch('importType', { immediate: true })
  onImportTypeChange() {
    this.modalTitle =
      this.importType === 'report' ? '导入-数据分析' : '导入-业务模型';
  }

  /**
   * 重置弹窗标题
   */
  resetModalTitle() {
    this.modalTitle =
      this.importType === 'report' ? '导入-数据分析' : '导入-业务模型';
  }
}
</script>

<style lang="less" scoped></style>
