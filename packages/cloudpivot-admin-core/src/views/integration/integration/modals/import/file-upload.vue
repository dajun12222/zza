<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <FileUploadTemplate :importVM="_self">
    <div slot="group-item" class="data-upload">
      <div class="upload-left">所属分组:</div>
      <div class="upload-right">
        <a-select style="width: 100%" :value="groupItem.id" disabled>
          <a-select-option
            :key="groupItem.id"
            :value="groupItem.id"
            :disabled="true"
          >
            {{ groupItem.name }}
          </a-select-option>
        </a-select>
      </div>
      <div class="clearfix"></div>
    </div>
  </FileUploadTemplate>
</template>

<script lang="ts">
import { Select } from '@h3/antd-vue';
import { Component, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import MixinUpload from '../../../../../components/global/modal/import/mixins/file-upload';
import FileUploadTemplate from '../../../../../components/global/modal/import/templates/file-upload-template.vue';

@Component({
  name: 'DataUpload',
  components: {
    FileUploadTemplate,
    ASelect: Select,
    ASelectOption: Select.Option,
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
