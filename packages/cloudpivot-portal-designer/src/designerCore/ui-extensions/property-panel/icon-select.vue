<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="app-icon-select">
    <a-popover
      :visible="showSelect"
      :placement="placement"
      overlayClassName="set-module-icon"
      :autoAdjustOverflow="true"
      trigger="click"
    >
      <template slot="content">
        <div class="custom-icons">
          <div class="custom-icon-box">
            <div>
              <template v-for="item in iconsClassName">
                <em
                  :key="item"
                  class="icon aufontAll"
                  :class="[item, appIcon === item ? 'active' : '']"
                  @click="changeIcon(item)"
                ></em>
              </template>
            </div>
          </div>
          <div class="upload">
            <div>
              <a-upload
                class="upload-btn"
                :multiple="false"
                :showUploadList="false"
                :accept="accept"
                :customRequest="customRequest"
              >
                <em
                  class="upload-icon icon aufontAll h-icon-all-picture-o"
                ></em>
                <span class="upload-btn-text">上传自定义图标</span>
              </a-upload>
            </div>
            <div class="upload-tips">
              建议上传图标尺寸为240*240px，支持格式JPEG、PNG、GIF，大小100k以内
            </div>
          </div>
        </div>
      </template>
      <div class="icon-box">
        <div class="icon-display">
          <div
            v-if="!appIcon"
            class="no-icon"
            :class="{ active: !!showSelect }"
            @click="
              () => {
                showSelect = true;
              }
            "
          >
            <template v-if="iconType === 'app'">
              <div class="svg-wrapper">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#h-icon-all-application1" />
                </svg>
              </div>
            </template>
            <em v-else class="icon aufontAll h-icon-all-plus"></em>
          </div>
          <div
            v-else-if="appIcon.includes('http') || appIcon.includes('/api')"
            class="img-icon"
          >
            <img :src="appIcon" alt="icon" />
          </div>
          <div v-else class="text-icon">
            <em class="icon aufontAll" :class="appIcon"></em>
          </div>
        </div>
        <div v-if="!!appIcon" class="icon-mantle">
          <div v-if="allowClear" class="del-icon" @click="clearIcon">
            <em class="icon aufontAll h-icon-all-close-circle"></em>
          </div>
          <div
            class="wrapper-icon"
            @click="
              () => {
                showSelect = true;
              }
            "
          >
            <em class="icon aufontAll h-icon-all-retweet"></em>
          </div>
        </div>
        <div
          v-if="showSelect"
          class="filter-mask"
          @click="
            () => {
              showSelect = false;
            }
          "
        ></div>
      </div>
    </a-popover>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';

import { Input, Icon, Upload, Popover } from '@h3/antd-vue';

import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';

// import { register } from '@cloudpivot-shared/ui-property-editor/src/register';

import appBaseApi from 'cloudpivot-admin-core/src/apis/app-settings/base.api';

import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

@Component({
  components: {
    AInput: Input,
    AIcon: Icon,
    AUpload: Upload,
    APopover: Popover,
  },
})
export default class IconSelectProperty extends Mixins(PropertyComponent) {
  @Prop({ default: 'bottomLeft' })
  placement?: string;

  @Prop({ default: true })
  allowClear?: boolean;

  @Prop({ default: '' })
  iconType?: string;

  iconsClassName: string[] = [];

  appIcon: string = '';

  showSelect: boolean = false;

  // 支持上传的文件类型
  accept: string = 'image/*';

  iconChange() {
    this.emitChange(this.appIcon);
  }

  getIconNames() {
    const svgdom: any = document.body.querySelector('svg#icons');
    const content = svgdom ? svgdom.innerHTML : '';
    const ids = content.replace(
      /<symbol.+?id="(.+?)".+?>.+?<\/symbol>/g,
      '$1 ',
    );

    const customIcons: any[] = [
      'h-icon-all-disconnect',
      'h-icon-all-Report',
      'h-icon-all-yingyong',
    ];
    this.iconsClassName = [
      ...customIcons,
      ...ids.replace(/(^\s*)|(\s*$)/g, '').split(' '),
    ];
  }

  customRequest(info) {
    appBaseApi
      .uploadFile({
        file: info.file,
      })
      .then((res: any) => {
        if (res.errcode === 0) {
          this.appIcon = getDownloadUrlNew.getUploadImgUrl(res.data.refId);
          this.iconChange();
        }
        this.$message.success(res.errmsg);
      });
    this.showSelect = false;
  }

  @Watch('groupCtrl.value', { immediate: true })
  onValueChange(val: string) {
    this.appIcon = val;
  }

  created() {
    this.appIcon = this.groupCtrl?.value as any;
    this.getIconNames();
  }

  changeIcon(icon: any) {
    this.appIcon = icon;
    this.showSelect = false;
    this.iconChange();
  }

  clearIcon() {
    this.appIcon = '';
    this.iconChange();
  }
}
</script>

<style lang="less" scoped>
.app-icon-select {
  .icon-box {
    position: relative;
    .icon-display {
      width: 48px;
      height: 48px;
      .no-icon {
        width: 48px;
        height: 48px;
        line-height: 48px;
        background: #ffffff;
        border-radius: 2px;
        border: 1px dashed #d4d5d6;
        text-align: center;
        color: rgba(17, 18, 24, 0.25);
        &.active,
        &:hover {
          border-color: #2970ff;
          color: #2970ff;
        }
        &:hover {
          cursor: pointer;
        }
        .svg-wrapper {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          svg {
            width: 24px;
            height: 24px;
          }
        }
      }
      .img-icon {
        width: 48px;
        height: 48px;
        border-radius: 2px;
        > img {
          width: 48px;
          height: 48px;
          border-radius: 2px;
          object-fit: cover;
        }
      }
      .text-icon {
        width: 48px;
        height: 48px;
        line-height: 48px;
        background: #ffffff;
        border-radius: 2px;
        border: 1px solid #d4d5d6;
        text-align: center;
        color: #2970ff;
        > em {
          font-size: 24px;
        }
      }
      &:hover + .icon-mantle {
        display: block;
      }
    }
    .icon-mantle {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 48px;
      height: 48px;
      .del-icon {
        position: absolute;
        top: -6px;
        right: -6px;
        height: 14px;
        width: 14px;
        line-height: 14px;
        text-align: center;
        border-radius: 50%;
        background-color: #ffffff;
        color: #f0353f;
        > em {
          font-size: 14px;
        }
      }
      .wrapper-icon {
        width: 48px;
        height: 48px;
        line-height: 48px;
        background: rgba(17, 18, 24, 0.65);
        border-radius: 2px;
        text-align: center;
        color: #ffffff;
        > em {
          font-size: 18px;
        }
      }
      &:hover {
        display: block;
      }
    }
    .filter-mask {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0);
      z-index: 1;
    }
  }
}
.set-module-icon {
  .custom-icons {
    width: 268px;
    max-height: unset;
    .custom-icon-box {
      max-height: 287px;
      overflow: hidden;
      overflow-y: scroll;
      padding: 8px 2px 0px 8px;
      > div {
        width: 252px;
        background-color: #fff;
        overflow: hidden;
        em {
          float: left;
          cursor: pointer;
          width: 42px;
          height: 42px;
          font-size: 24px;
          line-height: 42px;
          text-align: center;
          border: 1px solid transparent;
          border-radius: 2px;
          &:hover,
          &.active {
            border: 1px solid @primary-color;
            color: @primary-color;
          }
        }
        &::after {
          content: '';
          clear: both;
        }
      }
    }
    .upload {
      padding: 12px 16px 16px;
      /deep/.upload-btn {
        display: inline-block;
        height: 30px;
        > .ant-upload {
          width: 236px;
          height: 30px;
          line-height: 28px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px dashed #d4d5d6;
          text-align: center;
          .upload-icon {
            font-size: 14px;
            margin-right: 5px;
            font-weight: 400;
            color: #111218;
            float: unset;
            width: 14px;
            height: 20px;
            line-height: 20px;
            border: unset;
          }
          .upload-btn-text {
            display: inline-block;
            height: 20px;
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
            color: #111218;
          }
          &:hover {
            cursor: pointer;
            border-color: #2970ff;
            .upload-icon,
            .upload-btn-text {
              color: #2970ff;
            }
          }
        }
      }
      .upload-tips {
        font-size: 12px;
        font-weight: 400;
        color: rgba(17, 18, 24, 0.5);
        line-height: 20px;
      }
    }
  }
}
</style>
<style lang="less">
.set-module-icon {
  padding-bottom: unset !important;
  .ant-popover-arrow {
    display: none;
  }
  .ant-popover-inner-content {
    padding: unset;
  }
}
</style>
