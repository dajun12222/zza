<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <template v-if="batch && imgList.length > 1">
      <a-button class="download" icon="batch-download-o" @click="downloadAll">
        <em
          class="all-download icon aufontAll h-icon-all-batch-download-o"
        ></em>
        {{ $t('cloudpivot.form.renderer.downloadAll') }}
      </a-button>
    </template>

    <div class="image-readonly">
      <template v-for="(item, index) in imgList">
        <div :key="index" class="image-wrapper">
          <div class="image-wrapper-in">
            <img :src="item.url" />
            <div class="shadow">
              <em
                class="icon aufontAll h-icon-all-eye-o1"
                @click="handlePreview(index)"
              ></em>
            </div>
          </div>
        </div>
      </template>
    </div>

    <img-preview
      v-if="previewVisible"
      :imgList="imgList"
      :seletedIndex="previewIndex"
      @close="previewVisible = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';
import PCImagePreview from './../../../common/components/pc-image-preview.vue';

@Component({
  name: 'imageReadonly',
  components: {
    imgPreview: PCImagePreview,
  },
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

  imgList: any[] = [];

  @Watch('data', { immediate: true })
  onDataChange(data) {
    this.imgList = data
      ? data.map((el) => {
          return {
            url: this.getDownloadUrl(el.response.data.refId),
            uid: el.response.data.refId,
            refId: el.response.data.refId,
          };
        })
      : [];
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

  downloadAll() {
    this.downloadBatch(this.imgList);
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
.image-readonly {
  display: flex;
  margin-top: 8px;
}
.image-wrapper {
  margin-left: 8px;
  width: 104px;
  height: 104px;
  border-radius: 4px;
  padding: 9px;
  border: 1px solid #d9d9d9;
  position: relative;
  &:first-child {
    margin-left: 0;
  }
  .image-wrapper-in {
    position: relative;
    width: 86px;
    height: 86px;
    overflow: hidden;
    img {
      max-height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .shadow {
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: none;
      em {
        cursor: pointer;
        color: #fff;
      }
    }
  }
  &:hover {
    .image-wrapper-in {
      .shadow {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>
