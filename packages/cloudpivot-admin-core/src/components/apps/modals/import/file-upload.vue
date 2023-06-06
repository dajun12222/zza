<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <FileUploadTemplate :importVM="_self">
    <div slot="group-item" class="data-upload">
      <div class="upload-left">{{ $t('languages.Apps.Catalogues') }}:</div>
      <div class="upload-right">
        <a-select
          v-model="folderId"
          style="width: 100%"
          @change="handleFolderChange"
        >
          <a-select-option
            v-for="(floder, index) in tree"
            :key="index"
            :value="floder.id"
          >
            {{ getLangName(floder) }}
          </a-select-option>
        </a-select>
      </div>
      <div class="clearfix"></div>
    </div>
  </FileUploadTemplate>
</template>

<script lang="ts">
import { LanguageTransform } from 'cloudpivot-admin-core/src/utils';
import { listApi as Application } from 'cloudpivot/api';
import { Select } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
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
    ASelect: Select,
    ASelectOption: Select.Option,
    FileUploadTemplate,
  },
})
export default class DataUpload extends mixins(MixinUpload) {
  @MenuModule.State('floders') floders: any;

  @MenuModule.State('menuId') menuId: any;

  @AppCenterModule.State('appInfo') appDetails: any;

  @MenuModule.State('appInfo') appInfo: any;

  @MenuModule.Action('getFolders') getFolders: any;

  @Prop() action!: any;

  defaultFolder: string = ''; // 默认目录

  folderId: string = '';

  accept: string = '.xml';

  mounted() {
    const promise = new Promise((resolve: (value: any) => void, reject) => {
      resolve(this.getFolders(this.appInfo));
    });
    promise.then(() => {
      if (this.menuId) {
        const flodersList = this.allGroup(this.floders);
        const id = flodersList.filter((val) => val.id === this.menuId);
        if (id.length === 0) {
          this.defaultFolder = this.appDetails.id;
        } else {
          this.defaultFolder = this.menuId;
        }
      } else {
        this.defaultFolder = this.appDetails.id;
      }
      this.folderId = this.defaultFolder;
    });
  }

  get tree(): any[] {
    return this.allGroup(this.floders);
  }

  allGroup(res: any) {
    const retData = [] as any;
    const _helper = (data: any) => {
      if (!data) {
        return;
      }
      data.forEach((item: any) => {
        retData.push(item);
        if (Array.isArray(item.children)) {
          _helper(item.children);
        }
      });
    };
    _helper(res);
    return retData;
  }

  /**
   * 文件上传前校验文件类型
   */
  async beforeUpload(file: any) {
    return new Promise((resolve, reject) => {
      const types = this.accept.split(',');
      const fileType = file.name.substring(file.name.lastIndexOf('.'));
      if (!(types.indexOf(fileType) > -1)) {
        this.$message.error('仅支持上传xml格式的文件');
        reject(new Error('仅支持上传xml格式的文件'));
      } else {
        resolve(file);
      }
    });
  }

  /**
   * 选择文件夹
   */
  handleFolderChange(folder: string) {
    this.folderId = folder;
  }

  /**
   * 获取当前语言对应展示名
   */
  getLangName(item: any) {
    return LanguageTransform.getLang(item.name, item.name_i18n);
  }

  get additionalOptions() {
    return {
      folderId: this.folderId,
    };
  }
}
</script>

<style lang="less" scoped></style>
