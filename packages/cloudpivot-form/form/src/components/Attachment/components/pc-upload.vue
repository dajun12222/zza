<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="upload-control-component"
    :class="{
      'upload-image': isImage,
      'upload-files': !isImage,
      readonly: !!isReadonly,
    }"
  >
    <!-- batch-download-o -->

    <!-- <span class="icon aufontAll h-icon-all-aliwangwang"></span> -->
    <template v-if="showBatchDownload && !!isReadonly && fileList.length > 1">
      <span
        class="all-download icon aufontAll h-icon-all-batch-download-o"
        @click="downloadAll"
      ></span>
      <a-button class="download" icon="batch-download-o" @click="downloadAll">
        {{ $t('cloudpivot.form.renderer.downloadAll') }}
      </a-button>
    </template>
    <div v-if="!isReadonly && controlOpts.onlyShoot" class="message">
      {{ $t('cloudpivot.form.renderer.tip.uploadByMobile') }}
    </div>

    <a-upload
      :action="uploadUrl"
      :beforeUpload="beforeUpload"
      :multiple="multi"
      :defaultFileList="fileList"
      :fileList="uploadFileList"
      :listType="listType"
      :headers="headers"
      :remove="onRemovedImg"
      :uploadList="isImage"
      :class="{
        unwritable: isReadonly,
        'has-no-parent': !control.parentKey,
        'has-parent': control.parentKey,
      }"
      @preview="handlePreview"
      @change="onChange"
    >
      <template v-if="canUpload && !isReadonly && !controlOpts.onlyShoot">
        <div v-if="isImage && !control.parentKey">
          <a-icon type="plus" />
          <div class="ant-upload-text">
            {{ text }}
          </div>
        </div>
        <template v-else>
          <a-button class="upload-btn">
            <a-icon type="upload" />
            <!-- 点击或拖拽{{text}}上传 -->
            {{ $t('cloudpivot.form.renderer.tip.clickAndDropUpload') }}
          </a-button>
          <span
            v-if="displayTemplate"
            :class="
              hasTemplates ? 'attachment-link' : 'attachment-link-disabled'
            "
            @click.stop="downTemplate"
          >
            <a-icon type="download" />
            {{ $t('cloudpivot.form.renderer.templateDownload') }}
          </span>
          <div
            v-if="showBatchDownload && fileList.length > 1 && canDounload"
            class="all-download-wrap"
            @click.stop="downloadAll"
          >
            <span
              class="all-download icon aufontAll h-icon-all-batch-download-o"
              @click.stop="downloadAll"
            ></span>
            <span>{{ $t('cloudpivot.form.renderer.downloadAll') }}</span>
            <!-- <a-button
              @click="downloadAll"
              class="download"
            >{{ $t('cloudpivot.form.renderer.downloadAll') }}</a-button>-->
          </div>
          <p class="maxsize-tip" @click.stop="showTip">
            <span>{{ $t('cloudpivot.form.renderer.singleFileTips')
              }}{{ getLimitSize() }}M</span>
            <span v-if="control.options.limitNumber === 'custom'">{{
              $t('cloudpivot.form.renderer.singleFileTips2', {
                num: controlOpts.fileNumber,
              })
            }}</span>
            <span v-if="control.options.fileTypes">{{
              $t('cloudpivot.form.renderer.singleFileTips3', {
                what: controlOpts.fileTypes,
              })
            }}</span>
          </p>
        </template>
      </template>
      <file-list
        v-if="!isImage"
        :list="fileList"
        :eventList="eventList"
        :downUrls="fileList"
        :showRm="isReadonly"
        :parentKey="control.parentKey"
        @rmFile="rmFile"
        @previewFile="previewFile"
      />
    </a-upload>

    <!-- <a-button v-if="showBatchDownload && fileList.length > 1"
      @click="downloadAll"
      class="download" icon="download">
      {{ $t('cloudpivot.form.renderer.downloadAll') }}
    </a-button>-->

    <a-modal
      :visible="previewVisible"
      :footer="null"
      :maskClosable="false"
      :keyboard="false"
      @cancel="handleCancel"
    >
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { FileUploadControl } from '../../../common/controls/file-upload-control';
import { UploadStatus } from '../../../common/controls/upload-control';
import { Button, Icon, Modal, Upload } from '@h3/antd-vue';
import { ControlCommand } from 'cloudpivot-forms';
import { Subscription } from 'rxjs';
import { Component } from 'vue-property-decorator';
import FileList from './file-list.vue';

@Component({
  name: 'pc-upload',
  components: {
    AIcon: Icon,
    AButton: Button,
    AUpload: Upload,
    AModal: Modal,
    FileList: FileList,
  },
})
export default class PcUpload extends FileUploadControl {
  previewVisible = false;

  previewImage = '';

  fileList: any[] = [];

  eventList: any[] = [];

  batchFileList: any[] = [];

  commandSubscription?: Subscription;

  uploadFileList: any[] = [];

  overflowNumber: boolean = false;

  showTip() {
    return false;
  }

  get listType() {
    // 上传图片为 picture-card 样式, 上传文件显示为 text 样式
    return this.isImage ? 'picture-card' : 'text';
  }

  get showBatchDownload() {
    return this.canBatchDownload && this.fileList.length > 0;
  }

  get canDounload() {
    const fileDown: any[] = this.fileList.filter((f: any) => {
      return f.status === 'done' || f.status === 2;
    });
    if (fileDown.length === this.fileList.length) {
      return true;
    } else {
      return false;
    }
  }

  get isReadonly() {
    if (this.ctrl) {
      return this.readonly || this.readonlyFormula;
    }
    return true;
  }

  unsubscribe() {
    if (this.commandSubscription) {
      this.commandSubscription.unsubscribe();
    }
  }

  setControl() {
    if (this.ctrl && this.ctrl.value) {
      this.toFilelist(this.ctrl.value);
    } else {
      // this.fileList = [];
      this.uploadFileList = this.fileList = [];
    }

    this.unsubscribe();

    this.listenCommand();
  }

  handleValueChange(value: any, changeInfo: any): void {
    // 图片有两种情况,
    // 上传图片和被动赋值.
    // 如果是主动上传图片则不应该 调用this.toFilelist.
    // 如果是赋值则可以调用this.toFilelist. 目前看来每次更新赋值前 value会被设置null.
    if (!value) {
      this.toFilelist(value);
    } else if (
      value.length &&
      (!this.uploadFileList || this.uploadFileList.length === 0)
    ) {
      this.toFilelist(value);
    } else if (value && value.length >= 0) {
      this.toFilelist(value);
    } else if (value.length === this.uploadFileList.length) {
    } else {
    }
  }

  toFilelist(val: any[] | null) {
    if (!val) {
      this.uploadFileList = this.fileList = [];
      return;
    }

    //说明此时的数据还未经过转换
    if (Array.isArray(val) && val.length > 0 && val[0].mimeType) {
      val = this.convertFileData(val);
      if (!val) {
        return;
      }
    }
    this.uploadFileList = this.fileList = val.map((y: any) => {
      let x: any = '';
      if (!y.uid && y.response && y.response.data) {
        x = y.response.data;
      } else {
        x = y;
      }
      if (x.response && x.response.data) {
        x.url = this.getDownloadUrl(x.response.data);
        x.previewUrl = this.getPreviewUrl(x.response.data);
      }
      return x;
    });
  }

  listenCommand() {
    const _this = this;
    this.commandSubscription = this.ctrl.commander.subscribe(
      (cmd: ControlCommand) => {
        switch (cmd.name) {
          case 'clear':
            _this.fileList = [];
            _this.ctrl.value = null;
            break;
          default:
            break;
        }
      },
    );
  }

  showError(msg: string) {
    this.$message.error(msg);
  }

  beforeUpload(file: any, fileList: any[]) {
    if (this.overflowNumber) {
      if (file === fileList[fileList.length - 1]) {
        this.overflowNumber = false;
      }
      return false;
    }
    if (!this.checkFileNumber(fileList, this.showError)) {
      return false;
    }
    if (!this.checkFileType(file.name, this.showError)) {
      return false;
    }

    if (!this.checkFileSize(file, this.showError)) {
      return false;
    }

    if (!this.checkImageNumber(this.showError)) {
      return false;
    }
    if (!this.checkImageNameLength(file.name, this.showError)) {
      return false;
    }
    file.uploadTime = new Date().getTime();
    let userInfo: any = window.sessionStorage.getItem('user');
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
    } else {
      userInfo = { name: '' };
    }
    file.uploadName =
      window.sessionStorage.getItem('uploadName') || userInfo.name;
    return true;
  }

  checkFileNumber(fileList: File[], showError?: (msg: string) => void) {
    let msg = '';
    const that = this;
    const maxNumber = this.control.options.fileNumber;
    const limitNumber = this.control.options.limitNumber;
    const number = this.uploadFileList.length;
    if (limitNumber === 'custom' && number + fileList.length > maxNumber) {
      if (showError) {
        msg = this.$t('cloudpivot.form.renderer.tip.mostUpload', {
          num: maxNumber,
        }).toString();

        showError(msg);
      }
      this.overflowNumber = true;
      return false;
    }
    return true;
  }

  timer: any = null;

  onChange(info: { file: any; fileList: any[]; event: any }): void {
    clearTimeout(this.timer);
    if (this.isReadonly) {
      return;
    }
    this.uploadFileList = info.fileList.filter(
      (f) => f.status && f.status !== 'removed',
    );

    if (this.uploadFileList.length === 0) {
      return;
    }
    //保存文件状态
    const { file } = info;
    const status = info.file.status;
    if (status === 'done' && file.response && file.response.errcode === 0) {
      this.batchFileList.push(file);
    }

    // 保存文件上传进度
    this.eventList = this.uploadFileList = this.uploadFileList.map((f: any) => {
      if (f.response && f.response.errcode === 50000) {
        f.status = UploadStatus.Error;
      }
      const obj = this.batchFileList.filter((v) => {
        if (v.uid === f.uid) {
          return v;
        }
      });
      return obj && obj.length > 0 ? obj[0] : f;
    });

    const files = info.fileList
      .filter(
        (f) =>
          f.status &&
          !(f.status === 'removed' || f.status === UploadStatus.Delete),
      )
      .map((f) => {
        // 有服务errorcode = 50000 但是上传状态返回为done的情况 估计是上传接口先上传到服务器  再通过ftp还是oss转移到其他地方
        const serverResponse = f.response;
        if (serverResponse) {
          const errorCode = serverResponse.errcode;
          if (errorCode === 50000) {
            return {
              uid: f.uid,
              name: f.name,
              size: f.size,
              type: f.type,
              status: UploadStatus.Error,
              response: f.response,
              url: '',
              uploadTime: f.uploadTime,
              uploadName: f.uploadName,
            };
          }
        }
        const obj = this.batchFileList.filter((v) => {
          if (v.uid === f.uid) {
            return v;
          }
        });
        if (obj && obj.length > 0) {
          f = obj[0];
        }
        let status = UploadStatus.Uploading;
        switch (f.status) {
          case 'done':
            status = UploadStatus.Done;
            break;
          case 'error':
            status = UploadStatus.Error;
            break;
          case 'uploading':
            status = UploadStatus.Uploading;
            break;
          default:
            status = f.status;
            break;
        }
        return {
          uid: f.uid,
          name: f.name,
          size: f.size,
          type: f.type,
          status: status,
          response: f.response,
          url:
            f.response && f.response.data
              ? this.getDownloadUrl(f.response.data)
              : '',
          uploadTime: f.uploadTime,
          uploadName: f.uploadName,
        };
      });
    this.timer = setTimeout(() => {
      super.onFilesChange(files);
    }, 100);
    /* super.onFilesChange(files); */
    this.fileList = info.fileList.map((f: any) => {
      const obj = this.batchFileList.filter((v) => {
        if (v.uid === f.uid) {
          return v;
        }
      });
      return obj && obj.length > 0 ? obj[0] : f;
    });
  }

  /**
   * @des 删除文件
   */
  rmFile(file: any) {
    console.log(file, 'file');
    this.uploadFileList = this.uploadFileList.filter(
      (u: any) => u.uid !== file.uid,
    );
    this.removedFile(file);
  }

  onRemovedImg(file: any) {
    super.removedFile(file);
  }

  previewFile(file: any) {
    if (file.status === 2 || file.status === 'done') {
      this.handlePreview(file);
    }
  }

  handleCancel() {
    this.previewVisible = false;
  }

  handlePreview(file: any) {
    if (file.previewUrl) {
      file.previewUrl && window.open(file.previewUrl);
      event && event.stopPropagation();
    } else {
      const type: string = file.type || file.response.data.mimeType;
      if (type.indexOf('image') === -1) {
        this.$message.info('该格式附件暂不支持预览');
        return;
      } else {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true;
      }
    }
  }

  // 下载模板文件
  downTemplate() {
    const templateFile: any = this.controlOpts.templateFile
      ? this.controlOpts.templateFile
      : null;
    if (templateFile) {
      const files: any = templateFile.map((item: any) => item.response.data);
      if (files.length === 1) {
        this.download(files[0]);
      } else {
        this.downloadAllTemplate(files);
      }
    } else {
      return false;
    }
  }

  downloadAll() {
    this.downloadBatch();
  }

  destroyed() {
    super.destroyed();

    this.unsubscribe();
  }

  created() {
    this.init();
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common';
/deep/.unwritable {
  .anticon-delete {
    display: none;
  }
  /*.ant-upload-list:before {*/
  /*display: none;*/
  /*}*/
}
/deep/.ant-upload-select-text {
  height: 32px;
  width: 100%;
}
button.download {
  border: 0;
  padding: 0;
  color: @primary-color;
}
button.download.right-download {
  margin-left: 25px;
}
.right-download {
  margin-left: 25px;
}

.message {
  margin-bottom: 0.5em;
}
.all-download {
  color: @primary-color;
  cursor: pointer;
  font-size: 14px;
}
.all-download-wrap {
  display: inline-block;
  margin-left: 25px;
  color: @primary-color;
  cursor: pointer;
}
</style>

<style lang="less" scoped>
@import '~cloudpivot/common/common';
// 图片上传样式修改
.upload-control-component.upload-image {
  // 子表外的
  .has-no-parent {
    position: relative;
    display: block;
    /deep/.ant-upload-list {
      &:before {
        width: 104px;
        height: 104px;
        float: left;
        display: block;
        margin: 0 8px 8px 0;
      }

      /deep/.ant-upload-list-item-info > span {
        display: block;
        width: 100%;
        height: 100%;
        a {
          display: block;
          width: 100%;
          height: 100%;
          position: relative;
          left: 0;
          top: 0;
          img {
            min-width: 100%;
            max-width: 200%;
            width: auto;
            height: auto;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
    /deep/.ant-upload.ant-upload-select-picture-card {
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 2px;
    }
  }
  .unwritable {
    /deep/.ant-upload-list {
      &:before {
        display: none;
      }
    }
  }
  // 子表内的
  span.has-parent {
    width: 100% !important;
    display: flex;
    flex-direction: column-reverse;
    /deep/.ant-upload-list-picture-card /deep/.ant-upload-list-item {
      // background: red;
      width: 55px;
      height: 55px;
      border-radius: 4px;
      overflow: hidden;
      padding: 0 !important;
      margin: 8px 8px 0 0 !important;
      /deep/.ant-upload-list-item-info {
        padding-left: 0;
        & > span {
          height: 100%;
          /deep/.ant-upload-list-item-thumbnail {
            position: relative;
            left: 0;
            top: 0;
            img {
              display: block;
              min-width: 100%;
              max-width: 200%;
              height: auto;
              width: auto;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
    }
    /deep/.ant-upload.ant-upload-select-picture-card {
      //  /deep/.ant-upload-list-item-info{
      //   padding-left: 0;
      //  }
      width: 100%;
      border: none;
      margin: 0;
      // height: 32px;
      background-color: #fff;
      overflow: hidden;
      /deep/.ant-upload {
        padding: 0;
        width: 100%;
        button {
          width: 100%;
          padding: 0 10px;
        }
        // button.download {
        //     width: 50%;
        // }
        .all-download-wrap {
          margin-left: 0;
          display: block;
          margin-top: 8px;
          color: @primary-color;
          cursor: pointer;
          text-align: left;
          .all-download {
            // margin-left: 4px;
            margin-right: 4px;
          }
          button.download {
            width: 65px;
          }
        }
      }
    }
  }
}
// 附件上传样式修改
.upload-control-component.upload-files {
  /deep/.ant-upload-list {
    display: none;
  }
  /deep/.ant-upload-list-item {
    // background: red;
    /deep/.ant-upload-list-item-info {
      padding-left: 0 !important;
    }
  }
  span.has-parent {
    width: 100%;
    /deep/.ant-upload.ant-upload-select {
      width: 100%;
      button {
        width: 100%;
        padding: 0 10px;
      }
      .all-download-wrap {
        margin-left: 0;
        display: block;
        margin-top: 8px;
        color: @primary-color;
        cursor: pointer;
        .all-download {
          // margin-left: 4px;
          margin-right: 4px;
        }
        button.download {
          width: 65px;
        }
      }
      // .ant-upload-list-item-info{
      //   padding-left: 0;
      // }
    }
  }
}

.upload-control-component.readonly {
  min-height: 32px;
  line-height: 22px;
  color: #111218;
  background: rgba(245, 246, 249, 0.56);
  border-radius: 4px;
  padding: 5px 12px;
}

/deep/.ant-upload-list-item-name {
  color: @light-color-1;

  &:hover {
    color: @primary-color;
  }
}
.maxsize-tip {
  text-align: left;
  //padding-left: 4px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
  line-height: 24px;
}
.attachment-link {
  color: @primary-color;
  margin-left: 10px;
  cursor: pointer;
}
.attachment-link-disabled {
  margin-left: 10px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.25);
}
</style>

<style lang="less">
.sheet .upload-control-component.upload-files {
  .ant-upload-list {
    // display: block !important;
  }
}
</style>
