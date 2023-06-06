<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <div class="modal-body file-validate">
      <div v-if="!importVM.showUpdateCodeView" class="steps">
        <a-steps size="small" :current="1" :status="'process'">
          <a-step :title="$t('languages.Apps.UploadFile')" />
          <a-step :title="$t('languages.Apps.VerifyFile')">
            <a-icon v-if="!importVM.isValidated" slot="icon" type="loading" />
          </a-step>
          <a-step :title="$t('languages.Apps.Import')" />
        </a-steps>
      </div>

      <div v-if="importVM.showUpdateCodeView" class="update-code-box">
        <slot name="update-code"></slot>
      </div>

      <div v-else-if="importVM.isValidated" class="file-validate">
        <slot name="error-message"></slot>
      </div>
    </div>
    <div v-if="importVM.isValidated" class="modal-footer">
      <slot name="footer">
        <template v-if="importVM.isFileOk">
          <slot name="invalid-buttons">
            <template v-if="importVM.fileInvalid">
              <!-- 修改编码对应footer -->
              <template v-if="importVM.isShowUpdateCode">
                <a-button @click="importVM.closeUpdateCode"> 返回 </a-button>
                <a-button type="primary" @click="importVM.save">
                  保存并导入
                </a-button>
              </template>

              <template v-if="!importVM.isShowUpdateCode">
                <a-button @click="importVM.updateCode"> 修改编码 </a-button>
                <a-button type="primary" @click="importVM.coverAndImport">
                  导入并覆盖
                </a-button>
              </template>
            </template>
            <template v-else>
              <a-button @click="importVM.prevStep"> 返回 </a-button>
              <a-button type="primary" @click="importVM.directImport">
                导入
              </a-button>
            </template>
          </slot>
        </template>

        <template v-else>
          <slot name="file-ok-buttons">
            <a-button @click="importVM.prevStep"> 返回 </a-button>
            <!-- 直接导入 -->
            <a-button disabled type="primary" @click="importVM.directImport">
              导入
            </a-button>
          </slot>
        </template>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Icon, Input, Button, Steps } from '@h3/antd-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'FileValidate',
  components: {
    AIcon: Icon,
    AInput: Input,
    ASteps: Steps,
    AStep: Steps.Step,
    AButton: Button,
  },
})
export default class FileValidateTemplate extends Vue {
  @Prop()
  importVM!: any;
}
</script>

<style lang="less" scoped>
.file-validate {
  width: 90%;
  margin: 0 auto;
}

.update-code-box {
  min-height: 354px;
  top: 0;
  left: -1px;
  background: white;
  width: 100%;
  height: 100%;
}
</style>
