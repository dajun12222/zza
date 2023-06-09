<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="h3-upload" :class="isImage ? 'h3-upload-phone' : ''">
    <h3-upload
      ref="upload"
      :autoPreview="true"
      :continuity="false"
      :title="label"
      :editabled="!readonly"
      :required="ctrl.required"
      :maxSize="limitSize"
      :showErrorToast="false"
      :action="uploadUrl"
      :beforeUpload="beforeUpload"
      :onChange="onChange"
      :multiple="multi"
      :listType="listType"
      :data="fileList"
      :headers="headers"
      :isAddWatermark="isAddWatermark"
      :locationInfo="locationInfo"
      :onlyCamera="controlOpts.onlyShoot"
      :compress="false"
      :maxImageSize="10000"
      :compressionRatio="100"
      :labelStyle="styleObj"
      :locale="locale"
      :placehloder="$t('cloudpivot.form.renderer.clickUpload')"
      :remove="onRemovedImg"
      @preview="handlePreview"
      @uploadError="uploadError"
    />
  </div>
</template>

<script lang="ts">
import { ControlCommand } from 'cloudpivot-forms';
import { H3Upload } from 'h3-mobile-vue';
import { Subscription } from 'rxjs';
import { Component } from 'vue-property-decorator';
import {
  FileUploadControl,
  FormLocationControl,
  UploadFile,
} from '../../controls';

const suffix = '.jpg';

@Component({
  name: 'upload',
  components: {
    H3Upload,
  },
})
export default class Upload extends FileUploadControl {
  previewVisible = false;

  previewImage = '';

  fileList: any[] = [];

  isAddWatermark: boolean = false;

  locationInfo: string = '';

  commandSubscription?: Subscription;

  changing = false;

  // 打开表单的时候
  mounted() {
    // 如果仅拍照上传且有水印 就使用钉钉去定位
    this.isAddWatermark = !!this.controlOpts.addWatermark;
    if (!this.readonly) {
      this.getLoaction();
    }
  }

  get listType() {
    // 子表中图片上传显示成附件上传样式
    return this.isImage && !this.control.parentKey ? 'photo-list' : 'file';
  }

  handleValueChange(value: any): void {
    this.toFilelist(value);
  }

  setControl() {
    if (this.ctrl && this.ctrl.value) {
      this.toFilelist(this.ctrl.value);

      if (this.fileList.some((f) => f.base64)) {
        this.$nextTick(() => {
          setTimeout(() => {
            (this.$refs.upload as any).handleRefUpload();
          }, 500);
        });
      }
    } else {
      this.fileList = [];
    }

    this.listenCommand();
  }

  toFilelist(val: any[] | null) {
    if (!val) {
      this.fileList = [];
      return;
    }

    if (val.some((x: any) => x.status !== 3 && x.status !== 2)) {
      // this.changing = false;
      return;
    }

    this.fileList = val
      .filter((x: any) => x.status === 2)
      .map((x: any, i: number) => {
        const idx = x.name.indexOf(suffix);

        if (idx > 0) {
          x.name = x.name.substring(0, idx) + i + suffix;
        }

        if (x.status === 2 && x.base64) {
          delete x.base64;
        }

        if (x.response && x.response.data) {
          x.url = this.getDownloadUrl(x.response.data);
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
    this.$h3.toast.show({
      text: msg,
    });
  }

  getLoaction() {
    if (this.isAddWatermark) {
      FormLocationControl.service.position(undefined, false).then((result) => {
        this.locationInfo = result.address;
      });
    }
  }

  beforeUpload(files: File[]) {
    const file = files[0];

    if (!this.checkFileType(file.name, this.showError)) {
      return false;
    }

    if (!this.checkImageNumber(this.showError)) {
      return false;
    }

    return true;
  }

  onChange(info: { value: any }, files: any[]): void {
    if (this.readonly) {
      return;
    }

    // this.changing = files.some(f => f.status !== 3 && f.status !== 2);

    // file: uid name size respone status type
    // status 1 准备上传 2 已上传 3上传失败 -1正在上传
    const fileList = files.map((f, i) => {
      return {
        uid: f.uid,
        name: f.name,
        size: f.size,
        type: f.type,
        status: f.status === -1 ? 1 : f.status,
        base64: f.base64,
        response: f.response,
      };
    });
    // .filter(f => f.status === 2);
    // .map(f => f.response.data);

    super.onFilesChange(fileList);
  }

  onRemovedImg(file: any) {
    super.removedFile(file);
  }

  handleCancel() {
    this.previewVisible = false;
  }

  handlePreview(file: UploadFile) {
    console.log('handlePreview =>', file);
    if (file.response) {
      const ext = this.getExt(file.name);
      if (this.testIamge(ext)) {
        return;
      }

      if (this.testDocument(ext)) {
        super.download(file.response.data);
      } else {
        const msg = this.$t(
          'cloudpivot.form.renderer.tip.previewError',
        ).toString();
        this.showError(msg);
      }
    }
  }

  uploadError(err: any) {
    if (!err) {
      return;
    }
    let msg = '';
    switch (err) {
      // case 'overQuantity':
      //   this.showError(`一次最多允许上传张`);
      //   break;
      // case 'uploadError':
      //   this.showError(`文件错误`);
      //   break;
      case 'overSize':
        msg = this.$t('cloudpivot.form.renderer.tip.overSize', {
          label: this.limitSize,
        }).toString();
        this.showError(msg);
        break;
      default:
        msg = this.$t('cloudpivot.form.renderer.tip.uploadError').toString();
        this.showError(msg);
        // this.showError('上传失败请重试');
        break;
    }
  }

  destroyed() {
    super.destroyed();
    if (this.commandSubscription) {
      this.commandSubscription.unsubscribe();
    }
  }

  created() {
    this.init();
  }
}
</script>

<style lang="less">
.vertical .aufont.icon-base-paperclip {
  position: absolute;
  bottom: 0;
  right: 20px;
}
</style>
