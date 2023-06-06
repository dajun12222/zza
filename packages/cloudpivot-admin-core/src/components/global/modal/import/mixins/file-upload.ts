/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import AppsApi from 'cloudpivot-admin-core/src/apis/apps';
import { listApi as Application } from 'cloudpivot/api';
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import { utils } from 'cloudpivot/common';

@Component
export default class DataUpload extends Vue {
  accept: string = '.zip';

  fileList: Array<any> = []; // 文件列表

  fileName: string = '';

  get header() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async handleChange({ file, fileList }: any) {
    if (file.status === 'uploading') {
      this.fileList = [
        Object.assign(file, { name: utils.hiddenStrMiddle(file.name, 26, 60) }),
      ];
    }
    // 上传完成逻辑
    if (file.status === 'done') {
      this.fileName = file.response; // 返回文件名
    } else if (file.status === 'removed') {
      Application.deleteTemporaryFile({ fileName: file.response });
      this.fileName = '';
    } else {
      //Else Empty block statement
    }
  }

  // 删除文件
  async removeFile(file: any) {
    this.fileList = [];
    this.fileName = '';
  }

  nextStep() {
    this.$emit(
      'nextStep',
      Object.assign({ fileName: this.fileName }, this.additionalOptions),
    );
  }

  //扩展点开始
  /**
   *
   */
  get additionalOptions() {
    return {};
  }

  get formatInfo() {
    return `支持${this.accept}格式，文件大小不限`;
  }

  /**
   * 上传接口
   */
  get uploadUrl() {
    return AppsApi.fileUploadUrl;
  }

  /**
   * 文件上传前校验文件类型
   */
  async beforeUpload(file: any) {
    return new Promise((resolve, reject) => {
      const types = this.accept.split(',');
      const fileType = file.name.substring(file.name.lastIndexOf('.'));
      if (!(types.indexOf(fileType) > -1)) {
        this.$message.error('仅支持上传zip格式的文件');
        reject(new Error('仅支持上传zip格式的文件'));
      } else {
        resolve(file);
      }
    });
  }
}
