<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <div class="modal-body">
      <div class="steps">
        <a-steps size="small" :current="0" :status="'process'">
          <a-step :title="$t('languages.Apps.UploadFile')" />
          <a-step :title="$t('languages.Apps.VerifyFile')" />
          <a-step :title="$t('languages.Apps.Import')" />
        </a-steps>
      </div>
      <slot name="group-item"></slot>
      <div class="data-upload">
        <div>
          <div class="upload-left">
            {{ $t('languages.Apps.UploadLocalFile') }}:
          </div>
          <div class="upload-right">
            <div class="upload-dragger">
              <a-upload-dragger
                :multiple="false"
                :accept="importVM.accept"
                :fileList="importVM.fileList"
                :action="importVM.uploadUrl"
                :headers="importVM.header"
                :beforeUpload="importVM.beforeUpload"
                :remove="importVM.removeFile"
                @change="importVM.handleChange"
              >
                <div class="tip">
                  <em class="aufontAll h-icon-all-export_o"></em>
                  {{ $t('languages.Apps.ClickOrDragFile') }}
                  <span> 点击上传 </span>
                  <div class="upload-tip">{{ importVM.formatInfo }}</div>
                </div>
              </a-upload-dragger>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div>
        <a-button
          type="primary"
          :disabled="!importVM.fileName"
          @click="importVM.nextStep"
          >{{ $t('languages.Apps.NextStep') }}</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Icon, Upload, Button, Steps, Select } from '@h3/antd-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'DataUpload',
  components: {
    AUpload: Upload,
    AUploadDragger: Upload.Dragger,
    AIcon: Icon,
    ASteps: Steps,
    AStep: Steps.Step,
    AButton: Button,
    ASelect: Select,
    ASelectOption: Select.Option,
  },
})
export default class DataUploadTemplate extends Vue {
  @Prop()
  importVM!: any;
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-admin-core/src/styles/color/colors.less';
.modal-body {
  margin: auto 24px;
  .steps {
    width: 50%;
    margin: 30px auto;
  }
}
.data-upload {
  width: 80%;
  margin: 15px auto;
  & .folders {
    margin-top: 20px;
  }
  & .upload-left {
    width: 98px;
    float: left;
    vertical-align: middle;
    height: 22px;
    line-height: 22px;
    margin-right: 2px;
  }
  & .upload-right {
    width: 490px;
    float: left;
    vertical-align: middle;
    & .ant-upload-list {
      margin-top: 20px;
    }
    & .upload-dragger {
      display: block;
      position: relative;
      & /deep/.ant-upload.ant-upload-drag {
        &:hover {
          background: @sub-bg-color;
          border-color: @primary-color;
        }
      }
      & .ant-upload.ant-upload-drag .ant-upload-drag-container {
        &:hover {
          background: unset;
        }
        div {
          &:hover {
            background: unset;
          }
          text-align: center;
          height: 28px;
          line-height: 28px;
          color: rgba(17, 18, 24, 0.5);
        }
      }
      & .ant-upload.ant-upload-drag .ant-upload-btn {
        padding: 0;
      }
      .tip {
        span {
          color: @primary-color;
          padding-left: 10px;
        }
      }
    }
  }
  & .upload-tip {
    position: absolute;
    bottom: -30px;
    left: 0;
    font-size: 12px;
    color: rgba(17, 18, 24, 0.5);
  }

  .clearfix {
    clear: both;
  }

  /deep/.ant-upload-list-item-info .anticon-paper-clip {
    top: 3px;
  }
  /deep/.ant-upload-list-item {
    margin-top: 30px;
  }
}
</style>
