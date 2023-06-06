<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <div class="modal-body">
      <div class="steps">
        <a-steps size="small" :current="2" :status="'process'">
          <a-step :title="$t('languages.Apps.UploadFile')" />
          <a-step :title="$t('languages.Apps.VerifyFile')" />
          <a-step :title="$t('languages.Apps.Import')" />
        </a-steps>
      </div>

      <div class="file-import">
        <div class="import-progress">
          <a-progress
            type="circle"
            :percent="importVM.percent"
            :width="100"
            :status="importVM.progressStatus"
            :strokeColor="importVM.strokeColor"
          />

          <div class="note">
            {{ importVM.importStatusTxt }}
          </div>

          <div class="import-hint">{{ importVM.importHint }}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div>
        <a-button
          type="primary"
          :disabled="!importVM.isImportEnd"
          @click="importVM.close"
          >完成</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import { Progress, Button, Steps } from '@h3/antd-vue';

@Component({
  name: 'FileImport',
  components: {
    AProgress: Progress,
    ASteps: Steps,
    AStep: Steps.Step,
    AButton: Button,
  },
})
export default class FileImportTemplate extends Vue {
  @Prop()
  importVM!: any;
}
</script>

<style lang="less" scoped>
.file-import {
  & .import-progress {
    margin-top: 36px;
    text-align: center;

    & .note {
      margin-top: 12px;
      color: #111218;
      font-size: 16px;
    }
    & .import-hint {
      width: 60%;
      margin: 10px auto;
      color: rgba(17, 18, 24, 0.5);
      font-size: 14px;
    }
  }
}
/deep/ .ant-progress-circle .ant-progress-text .anticon {
  font-size: 32px;
}
</style>
