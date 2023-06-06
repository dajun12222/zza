<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <FileUploadTemplate :importVM="_self">
    <div slot="group-item" class="data-upload">
      <div class="upload-left">{{ $t('languages.Apps.Catalogues') }}:</div>
      <div class="upload-right">
        <a-select v-model="groupId" style="width: 100%">
          <template v-for="item in groupList">
            <a-select-option
              v-show="item.code !== 'all'"
              :key="item.id"
              :value="item.id"
            >
              {{ item.name }}
            </a-select-option>
          </template>
        </a-select>
      </div>
      <div class="clearfix"></div>
    </div>
  </FileUploadTemplate>
</template>

<script lang="ts">
import AppsApi from 'cloudpivot-admin-core/src/apis/apps';
import { listApi as Application } from 'cloudpivot/api';
import { Icon, Upload, Button, Steps, Select } from '@h3/antd-vue';
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { utils } from 'cloudpivot/common';
import { mixins } from 'vue-class-component';
import MixinUpload from '../../../../components/global/modal/import/mixins/file-upload';
import FileUploadTemplate from '../../../../components/global/modal/import/templates/file-upload-template.vue';

const AppCenterModule = namespace('Apps/AppCenter');

const MenuModule = namespace('Apps/AppItem');

@Component({
  name: 'DataUpload',
  components: {
    AUpload: Upload,
    AUploadDragger: Upload.Dragger,
    AIcon: Icon,
    ASteps: Steps,
    AStep: Steps.Step,
    AButton: Button,
    ASelect: Select,
    ASelectOption: Select.Option,
    FileUploadTemplate,
  },
})
export default class DataUpload extends mixins(MixinUpload) {
  @MenuModule.State('floders') floders: any;

  @AppCenterModule.State('appGroupList') groupList: any[];

  @Inject()
  getgroupInfo!: Function;

  groupId: any = '';

  @Watch('groupList', { deep: true, immediate: true })
  groupListChane() {
    this.groupId = this.getgroupInfo().id;
  }

  get additionalOptions() {
    return {
      groupId: this.groupId,
    };
  }
}
</script>

<style lang="less" scoped></style>
