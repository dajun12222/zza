<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <template v-if="batch && attachmentList.length > 1">
      <a-button class="download" icon="batch-download-o" @click="downloadAll">
        <em
          class="all-download icon aufontAll h-icon-all-batch-download-o"
        ></em>
        {{ $t('cloudpivot.form.renderer.downloadAll') }}
      </a-button>
    </template>

    <div class="attachment-readonly">
      <template v-for="(item, index) in attachmentList">
        <div :key="index" class="attachment-wrapper">
          <a-icon
            class="paper-clip"
            type="paper-clip"
            @click="previewFile(item)"
          />
          <span class="name" @click="previewFile(item)">
            {{ item.name }}
          </span>
          <a-icon
            class="download-icon"
            type="download"
            @click.stop="downFile(item)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

@Component({
  name: 'imageReadonly',
  components: {},
})
export default class imageReadonly extends Vue {
  @Prop()
  data!: any;

  @Prop({
    default: false,
  })
  batch!: boolean;

  previewVisible: boolean = false;

  previewIndex: number = 0;

  handlePreview(index: number) {
    this.previewIndex = index;
    this.previewVisible = true;
  }

  attachmentList: any[] = [];

  previewFile(item) {
    window.open(item.previewUrl);
  }

  @Watch('data', { immediate: true })
  onDataChange(data) {
    this.attachmentList = data
      ? data.map((el) => {
          return {
            url: this.getDownloadUrl(el.response.data.refId),
            uid: el.response.data.refId,
            refId: el.response.data.refId,
            name: el.response.data.name,
            previewUrl: this.getPreviewUrl(el.response.data),
          };
        })
      : [];
  }

  getPreviewUrl(file: any): string {
    const sysConfig = JSON.parse(localStorage.getItem('stateConfig') as string);
    let url = '';
    // 判断用户是否开启了附件预览服务
    if (sysConfig && sysConfig.openIDocView) {
      const downloadUrl = this.getDownloadUrl(file.refId);
      url = `${sysConfig.idocvServiceUrl}/view/url?url=${encodeURIComponent(
        downloadUrl,
      )}&name=${encodeURIComponent(file.name)}`;
    }
    return url;
  }

  getDownloadUrl(refId: string) {
    if (!refId) {
      return '';
    } else if (refId && refId.indexOf('http') > -1) {
      return refId;
    } else {
      return getDownloadUrlNew.getImageUrl(refId, 'application');
    }
  }

  downFile(file) {
    file.url && window.open(file.url);
  }

  downloadAll() {
    this.downloadBatch(this.attachmentList);
  }

  //下载所有链接
  downloadBatch(files: any[]): void {
    if (files.length === 0) {
      return;
    }
    const refIds = files
      .map((f) => getDownloadUrlNew.getRefId(f.refId))
      .join(',');
    let url = `${
      (window as any).config.apiHost
    }/api/aliyun/download_multi?multiVO=${refIds}`;
    const token =
      (window as any).externalLinkToken || localStorage.getItem('token');
    if (token) {
      url += `&access_token=${token}`;
    }
    window.open(url);
  }
}
</script>

<style lang="less" scoped>
.all-download {
  margin-right: 8px;
}
.attachment-readonly {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
}
.attachment-wrapper {
  height: 28px;
  line-height: 28px;
  padding-left: 20px;
  padding-right: 20px;
  position: relative;
  color: rgba(0, 0, 0, 0.65);
  &:hover {
    cursor: pointer;
    background-color: #eef3ff;
    color: #2970ff;
  }
  .paper-clip {
    position: absolute;
    left: 4px;
    top: 50%;
    transform: translateY(-50%);
  }
  .download-icon {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
  }
  span {
    display: inline-block;
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
