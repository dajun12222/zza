<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="image-setter">
    <div class="image-list">
      <draggable
        :list="data"
        :options="dragOptions"
        class="drags-area"
        handle=".drag-icon"
        @end="onSortEnd"
      >
        <div v-for="(item, index) in data" :key="index" class="list-item">
          <div class="item-info">
            <EditPopUp>
              <div class="show-text">
                <span>{{ item.name }}</span>
                <span class="icon aufontAll h-icon-all-edit-o"></span>
              </div>
              <template slot="content">
                <div class="img-setting-box">
                  <div class="form-item">
                    <div class="label">图片名称<em>*</em></div>
                    <a-input v-model="item.name" type="text" />
                  </div>

                  <div class="form-item">
                    <div class="label">图片<em>*</em></div>
                    <div class="upload-content">
                      <a-upload
                        :customRequest="(info) => customRequest(info, index)"
                        :showUploadList="false"
                        :multiple="false"
                        :accept="accept"
                        class="upload"
                        style="width: 260px"
                      >
                        <div v-if="!item.tempUrl" class="up-file-content">
                          <span>
                            <em
                              class="icon aufontAll h-icon-all-cloud-upload1"
                            ></em>
                            点击上传图片
                          </span>
                        </div>
                        <div v-else class="img-content">
                          <img
                            :src="getSrc(item.refId) || item.tempUrl"
                            alt="img"
                          />
                          <div class="icon-mantle">
                            <div class="wrapper-icon">
                              <em class="icon aufontAll h-icon-all-retweet"></em>重新上传
                            </div>
                          </div>
                        </div>
                      </a-upload>
                    </div>
                  </div>

                  <div class="form-item">
                    <a-input
                      v-model="item.tempUrl"
                      placeholder="图片地址"
                      type="text"
                    />
                  </div>

                  <div class="form-item">
                    <div class="label">填充方式<em>*</em></div>
                    <a-select
                      v-model="item.fillType"
                      placeholder="请选择"
                      style="width: 100%; height: 30px"
                    >
                      <a-select-option value="FitHeight">适应高度</a-select-option>
                      <a-select-option value="FitWidth">适应宽度</a-select-option>
                      <a-select-option value="FillAll">拉伸填满</a-select-option>
                      <a-select-option value="Scale">等比缩放</a-select-option>
                    </a-select>
                  </div>

                  <div class="form-item">
                    <div class="label">点击时<em>*</em></div>
                    <a-select
                      v-model="item.gotoType"
                      placeholder="请选择"
                      style="width: 100%; height: 30px"
                    >
                      <a-select-option :value="0">链接到业务模型</a-select-option>
                      <a-select-option :value="1">链接到应用首页</a-select-option>
                      <a-select-option :value="2">链接到页面</a-select-option>
                      <a-select-option :value="3">链接到URL</a-select-option>
                      <a-select-option :value="4">仅作展示</a-select-option>
                    </a-select>
                  </div>

                  <div class="form-item">
                    <template v-if="item.gotoType === 0">
                      <div class="label">选择模型<em>*</em></div>
                      <BizModelSelector v-model="item.bizModel" />
                    </template>

                    <template v-else-if="item.gotoType === 1">
                      <div class="label">选择应用<em>*</em></div>
                      <AppSelector v-model="item.app" />
                    </template>

                    <template v-else-if="item.gotoType === 2">
                      <div class="label">选择页面<em>*</em></div>
                      <a-select
                        v-model="item.gotoPage"
                        placeholder="请选择"
                        style="width: 100%; height: 30px"
                      >
                        <a-select-option value="defaultPortalDashboard">工作台[系统页面]</a-select-option>
                        <a-select-option value="defaultWorkflowCenter">流程中心[系统页面]</a-select-option>
                        <a-select-option value="defaultApplicationList">应用列表[系统页面]</a-select-option>

                        <template v-for="(el, key) in pagesData">
                          <a-select-option
                            v-if="
                              el.published &&
                              el.code !== 'defaultPortalDashboard'
                            "
                            :key="key"
                            :value="el.code"
                            >{{ el.name }}</a-select-option>
                        </template>
                      </a-select>
                    </template>

                    <template v-else-if="item.gotoType === 3">
                      <div class="label">URL地址<em>*</em></div>
                      <a-textarea
                        v-model="item.linkUrl"
                        type="text"
                        placeholder="URL地址"
                        style="height: 98px"
                      />
                    </template>
                  </div>

                  <div class="form-item">
                    <div class="label">打开方式</div>
                    <a-radio-group v-model="item.openType">
                      <p class="openType">
                        <a-radio value="_self">当前页面打开</a-radio>
                      </p>
                      <p><a-radio value="_blank">新页签打开</a-radio></p>
                    </a-radio-group>
                  </div>
                </div>
              </template>
            </EditPopUp>
          </div>

          <span class="operation-icon drag-icon">
            <em class="icon aufontAll h-icon-all-drag"></em>
          </span>

          <span class="operation-icon del-icon" @click="delItem(index)">
            <em class="icon aufontAll h-icon-all-delete1"></em>
          </span>
        </div>
      </draggable>

      <span class="add-photo" @click="addPhoto">
        <em class="icon aufontAll h-icon-all-plus"></em>
        添加图片
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue, Mixins } from 'vue-property-decorator';

import { Input, Icon, Upload, Select, Radio } from '@h3/antd-vue';

import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

import {
  EditPopUp,
  AppSelector,
  BizModelSelector,
} from '@portal-designer/toolbox';

import appBaseApi from 'cloudpivot-admin-core/src/apis/app-settings/base.api';

import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';
import {
  ObjectPropertyInfo,
  DataType,
} from '@cloudpivot-shared/ui-engine-vue/document';
import Draggable from 'vuedraggable';
import cloneDeep from 'lodash/cloneDeep';
import { namespace } from 'vuex-class';

const PortalDesignModule = namespace('PortalDesign');

@Component({
  components: {
    AInput: Input,
    AIcon: Icon,
    AUpload: Upload,
    EditPopUp,
    AppSelector,
    ASelect: Select,
    ASelectOption: Select.Option,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ATextarea: Input.TextArea,
    Draggable,
    BizModelSelector,
  },
})
export default class InputUploadProperty extends Mixins(PropertyComponent) {
  @PortalDesignModule.State('pagesData') pagesData: any[];

  // 支持上传的文件类型
  accept: string = 'image/*';

  data: any = [];

  customRequest(info, index) {
    appBaseApi
      .uploadFile({
        file: info.file,
      })
      .then((res: any) => {
        if (res.errcode === 0) {
          this.data[index].tempUrl = this.getSrc(res.data.refId);
          this.data[index].refId = res.data.refId;
        }
      });
  }

  getSrc(refId) {
    if (!refId) {
      return '';
    }
    return getDownloadUrlNew.getUploadImgUrl(refId);
  }

  @Watch('arrayCtrl.value', { immediate: true })
  onValueChange(val: any[]) {
    this.data = val;
    this.data.forEach((item) => {
      if (!item.fillType) {
        item.fillType = 'Scale';
      }
    });
  }

  @Watch('data', { deep: true })
  onDataChange() {
    this.emitChange();
  }

  addPhoto() {
    const params: ObjectPropertyInfo = {
      type: DataType.Object,
      properties: {
        photo: {
          type: DataType.Object,
          default: {
            name: `图片${this.data.length + 1}`, // 图片名称
            tempUrl: '', // 图片地址
            openType: '_self', // 打开方式
            fillType: 'Scale', // 填充方式
            gotoType: 3, // 点击时跳转页面类型
            app: '', // 跳转应用
            bizModel: '', // 跳转模型
            linkUrl: '', // 链接地址
            gotoPage: 'defaultPortalDashboard', // 链接页面
          },
          additionalProperties: true,
        },
      },
    };
    const newGroup = this.$uiEngine.widgetStore.factory.build(params);
    this.arrayCtrl.append(newGroup.children['photo']);
    this.emitChange();
  }

  delItem(index: number) {
    this.arrayCtrl.remove(index);
    this.emitChange();
  }

  created() {}

  dragOptions: any = {
    animation: 150,
    ghostClass: 'ghostClass',
    forceFallback: true,
    fallbackClass: 'dragClass',
    touchStartThreshold: 20,
    delay: 100,
  };

  onSortEnd(event) {
    const oldIndex = event.oldIndex;
    const newIndex = event.newIndex;

    const tempControl = cloneDeep(this.arrayCtrl.children[oldIndex]);
    this.arrayCtrl.remove(oldIndex);
    this.arrayCtrl.insert(newIndex, tempControl);
    this.emitChange();
  }
}
</script>

<style lang="less" scoped>
.operation-icon {
  margin-left: 8px;
  em {
    font-size: 14px;
    color: rgba(136, 147, 167, 1);
    &:hover {
      color: @primary-color;
    }
  }
  &.drag-icon {
    cursor: move;
  }
  &.del-icon {
    cursor: pointer;
    em {
      font-size: 16px;
    }
  }
}

.add-photo {
  display: block;
  color: @primary-color;
  font-size: 12px;
  cursor: pointer;
  .icon {
    font-size: 12px;
  }
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  .item-info {
    flex: 1;
    height: 30px;
    line-height: 30px;
    border-radius: 2px;
    border: 1px dashed #d4d5d6;
    cursor: pointer;
    &:hover,
    &.active {
      box-shadow: 0px 0px 0px 2px rgba(41, 112, 255, 0.2);
      border-radius: 2px;
      border: 1px solid #2970ff;
    }
    .show-text {
      display: flex;
      font-size: 13px;
      justify-content: space-between;
      height: 30px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.img-setting-box {
  width: 300px;
  padding: 20px 16px;
  .form-item {
    margin-bottom: 17px;
    .label {
      font-size: 12px;
      color: @text-color;
      font-weight: 600;
      line-height: 20px;
      margin-bottom: 4px;
      em {
        color: red;
      }
    }
    .openType {
      margin-bottom: 4px;
    }
    .upload-content {
      height: 88px;
      .img-content {
        position: relative;
        height: 88px;
        width: 268px;
        overflow: hidden;
        background-color: #efefef;
        img {
          width: 100%;
          height: 88px;
        }
        .icon-mantle {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          .wrapper-icon {
            width: 100%;
            height: 100%;
            background: rgba(17, 18, 24, 0.65);
            border-radius: 2px;
            text-align: center;
            color: #ffffff;
            font-size: 14px;
            line-height: 88px;
            em {
              margin-right: 5px;
            }
          }
        }

        &:hover {
          .icon-mantle {
            display: block;
          }
        }
      }
    }
  }
}

.up-file-content {
  width: 260px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  background: #fafafa;
  border-radius: 2px;
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  span {
    font-size: 13px;
    color: rgba(17, 18, 24, 0.25);
  }
  p {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    padding: 0 24px 0 8px;
    em {
      position: absolute;
      right: 3px;
      color: rgba(17, 18, 24, 0.25);
    }
  }
  &:hover {
    border: 1px dashed @primary-color;
    span {
      color: @primary-color;
    }
    p {
      em {
        color: @primary-color;
      }
    }
  }
}
</style>
