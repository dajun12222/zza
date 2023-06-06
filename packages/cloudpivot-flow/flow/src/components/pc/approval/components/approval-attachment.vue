<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="approval-attachment">
    <div>
      <span class="icon aufontAll h-icon-all-field-attachment-stroke"></span>
    </div>
    <div class="file-col">
      <span class="file-name">{{ reduceName }}</span>
    </div>
    <div @click="download(file)">
      <span class="icon aufontAll h-icon-all-download"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { utils } from 'cloudpivot/common';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
import { renderer } from 'cloudpivot-form/form';

@Component({
  name: 'approval-attachment',
  components: {},
})
export default class ApprovalAttackment extends Vue {
  @Prop()
  file!: any;

  get fileSize() {
    if (!this.file) {
      return '';
    }
    if (this.file.fileSize < 1024) {
      return '(<1K)';
    } else if (this.file.fileSize / 1024 < 1000) {
      return '(' + Math.floor(this.file.fileSize / 1024) + 'K)';
    } else {
      return '(' + Math.floor(this.file.fileSize / 1024 / 1024) + 'M)';
    }
  }

  get reduceName() {
    return utils.hiddenStrMiddle(this.file.name + this.fileSize, 12, 38);
  }

  getDownloadUrlNew(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId);
  }

  /**
   * 下载附件
   */
  download(file: any) {
    if (!file || !file.refId) {
      return;
    }

    const url = renderer.UploadControl.service.getDownloadUrl(file);
    const a = document.createElement('a');
    a.download = this.file.name;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common.less';
.approval-attachment {
  display: flex;
  height: 22px;
  .h-icon-all-field-attachment-stroke {
    font-size: 12px;
    padding-right: 8px;
  }
  .file-col {
    flex: 1;
    .file-name {
    }
  }
  .h-icon-all-download {
    font-size: 16px;
    color: #2970ff;
    cursor: pointer;
  }
}
</style>
