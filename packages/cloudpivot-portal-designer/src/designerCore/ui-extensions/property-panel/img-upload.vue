<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="app-background">
    <div class="line">
      <div class="item">
        <a-upload
          :customRequest="customRequest"
          :showUploadList="false"
          :multiple="false"
          :accept="accept"
          class="upload"
        >
          <div class="up-file-content">
            <span v-if="!tempUrl">
              <em class="icon aufontAll h-icon-all-cloud-upload1"></em>
              上传图片
            </span>
            <div v-else>
              <span>{{ tempUrl }}</span>
              <em
                class="clear icon aufontAll h-icon-all-close-circle"
                @click.stop="delTempUrl"
              ></em>
            </div>
          </div>
        </a-upload>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';

import { Input, Icon, Upload } from '@h3/antd-vue';

import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';

import appBaseApi from 'cloudpivot-admin-core/src/apis/app-settings/base.api';

import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

@Component({
  components: {
    AInput: Input,
    AIcon: Icon,
    AUpload: Upload,
  },
})
export default class InputUploadProperty extends Mixins(PropertyComponent) {
  tempUrl: string = '';

  // 支持上传的文件类型
  accept: string = 'image/*';

  delTempUrl() {
    this.tempUrl = '';
    this.urlChange();
  }

  customRequest(info) {
    appBaseApi
      .uploadFile({
        file: info.file,
      })
      .then((res: any) => {
        if (res.errcode === 0) {
          this.tempUrl = getDownloadUrlNew.getUploadImgUrl(res.data.refId);
          this.urlChange();
        }
      });
  }

  urlChange() {
    this.emitChange(this.tempUrl);
  }

  @Watch('groupCtrl.value', { immediate: true })
  onValueChange(val: string) {
    this.tempUrl = val;
  }

  created() {
    this.tempUrl = this.groupCtrl?.value as any;
  }
}
</script>

<style lang="less" scoped>
.up-file-content {
  width: 268px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #ffffff;
  border-radius: 2px;
  border: 1px dashed #d4d5d6;
  cursor: pointer;
  span {
    font-size: 13px;
    color: rgba(17, 18, 24, 0.25);
  }
  div {
    width: 100%;
    display: flex;
    span {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 8px 0 8px;
      width: 100%;
      font-size: unset;
      color: unset;
    }
    em {
      color: rgba(17, 18, 24, 0.25);
      display: none;
      padding-right: 3px;
    }
  }

  &:hover {
    border: 1px dashed @primary-color;
    span {
      color: @primary-color;
    }
    div {
      span {
        font-size: unset;
        color: unset;
      }
      em {
        color: rega(17, 18, 24, 0.5);
        display: inline-block;
      }
    }
  }
}
</style>
