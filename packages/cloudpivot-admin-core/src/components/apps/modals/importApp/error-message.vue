<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <ErrorMessageTemplate :importVM="_self">
    <template slot="file-ok-tips">
      <em
        v-if="!errorParam.builtInApp"
        class="icon aufontAll h-icon-all-check-circle file-status-icon"
      ></em>
      <a-icon
        v-else
        type="question-circle"
        theme="filled"
        style="color: #faad14; font-size: 18px"
      />
      <span class="file-status-txt">{{
        errorParam.builtInApp
          ? '您上传的是示例应用，文件校验通过'
          : $t('languages.Apps.DocumentChecked')
      }}</span>
    </template>
    <template slot="file-error-tips">
      <div class="file-status">
        <em
          class="icon aufontAll h-icon-all-close-circle file-status-icon error"
        ></em>
        <span class="file-status-txt">{{ errorParam.fileErrMsg }}</span>
      </div>
    </template>
    <template slot="duplication-area">
      <div class="file-status">
        <em
          class="icon aufontAll h-icon-all-check-circle file-status-icon"
        ></em>
        <span class="file-status-txt">{{
          $t('languages.Apps.DocumentFormatChecked')
        }}</span>
      </div>
      <template v-if="errorParam.isCodeRepeat && !errorParam.overrideForImport">
        <div class="file-check-status">
          <template>
            <span>{{ errorParam.coreRepeatErrMsg }}</span>
          </template>
        </div>
        <template v-if="!errorParam.isModelCodeList">
          <div class="file-check-status">
            <span
              v-if="
                errorParam.codeRepeatObj.modelCodeRepeat &&
                !errorParam.codeRepeatObj.bothRepeat &&
                !!errorParam.modelPos
              "
              class="model-position"
              >模型位置: {{ errorParam.modelPos }}</span>

            <span
              v-if="
                errorParam.codeRepeatObj.modelCodeRepeat &&
                !errorParam.codeRepeatObj.bothRepeat &&
                !!errorParam.subTableErr
              "
              class="model-position"
              >{{ errorParam.subTableErr }}</span>
          </div>
        </template>
        <template v-else>
          <div class="file-check-status">
            <p class="isModelCodeList">
              1. 模型编码已存在<br />
              <span
                v-if="
                  errorParam.codeRepeatObj.modelCodeRepeat &&
                  !errorParam.codeRepeatObj.bothRepeat &&
                  !!errorParam.modelPos
                "
                class="model-position"
                >模型位置: {{ errorParam.modelPos }},请修改编码</span>
              <span
                v-if="
                  errorParam.codeRepeatObj.modelCodeRepeat &&
                  !errorParam.codeRepeatObj.bothRepeat &&
                  !!errorParam.subTableErr2
                "
                class="model-position"
                >{{ errorParam.subTableErr2 }}</span>
            </p>
            <br />
            <p>2. 修改编码再导入，将会生成新的业务模型。</p>
          </div>
        </template>

        <div
          v-if="!errorParam.isModelCodeList && !errorParam.builtInApp"
          class="status-tip"
        >
          <p>
            1.
            覆盖后，当前导入业务模型里的数据模型会替换掉现在系统中对应业务模型的数据模型、编码重复的表单和流程；
          </p>
          <p>2. 修改编码再导入，将会生成新的业务模型。</p>
        </div>

        <div v-if="errorParam.builtInApp" class="status-tip">
          <p>1. 示例应用修改编码再导入，将会生成新的业务模型;</p>
          <p>2. 示例应用不可被覆盖。</p>
        </div>
      </template>

      <!-- 异常明细 -->
      <template v-else-if="hasError">
        <div class="file-check-status">
          <span>
            检测到应用有多条对象不存在，应用导入后请重新配置。
            <a href="javascript:;" class="link" @click="showErrorDetail">查看明细</a>
          </span>
        </div>
      </template>

      <div v-if="isShowErrorDetail" class="update-code-box">
        <errorDetail :errDetails="errorParam.errDetails" />
      </div>
    </template>
  </ErrorMessageTemplate>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import errorDetail from './error-detail.vue';
import { Icon } from '@h3/antd-vue';
import { mixins } from 'vue-class-component';
import MixinErrorMessage from '../../../../components/global/modal/import/mixins/error-message';
import ErrorMessageTemplate from '../../../../components/global/modal/import/templates/error-message-template.vue';

@Component({
  name: 'ErrorMessage',
  components: {
    errorDetail,
    AIcon: Icon,
    ErrorMessageTemplate,
  },
})
export default class ErrorMessage extends mixins(MixinErrorMessage) {
  @Prop()
  isShowErrorDetail!: boolean;

  // 展示错误明细
  showErrorDetail() {
    this.$emit('showErrorDetail');
  }

  // 关闭错误明细
  closeErrorDetail() {
    this.$emit('closeErrorDetail');
  }

  get hasError() {
    return Object.keys(this.errorParam.errDetails).some((key) => {
      if (Array.isArray(this.errorParam.errDetails[key])) {
        return this.errorParam.errDetails[key].length > 0;
      } else {
        return Object.keys(this.errorParam.errDetails[key]).some((attr) => {
          return this.errorParam.errDetails[key][attr].length > 0;
        });
      }
    });
  }
}
</script>
