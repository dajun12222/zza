<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <ErrorMessageTemplate :importVM="_self">
    <template slot="file-ok-tips">
      <div class="file-status">
        <i class="icon aufontAll h-icon-all-check-circle file-status-icon"></i>
        <span class="file-status-txt">{{
          $t('languages.Apps.DocumentChecked')
        }}</span>
      </div>
      <p style="margin-top: 8px; color: #999">{{ strategy.noRepeatMsg }}</p>
    </template>
    <template slot="file-error-tips">
      <div class="file-status">
        <i
          class="icon aufontAll h-icon-all-close-circle file-status-icon error"
        ></i>
        <span class="file-status-txt">{{
          $t('languages.Apps.DocumentValidateFailNoImportSupport')
        }}</span>
      </div>

      <div class="file-content error">
        <div class="file-content-error">
          <!-- 是数据项类型错误 -->
          <ul v-if="errorParam.isDataModelError">
            <li>
              1.
              {{
                $t('languages.Apps.DataItemError', {
                  errors: errorParam.errorInfo,
                })
              }}
            </li>
          </ul>
          <ul v-else-if="errorParam.isSubTableRepeat">
            <li>
              1.
              {{
                $t('languages.Apps.SubTableCodeRepeat', {
                  codes: errorParam.errorInfo,
                })
              }}
            </li>
          </ul>
          <ul v-else>
            <li>1. {{ errorParam.errorInfo }}</li>
          </ul>
        </div>
      </div>
    </template>
    <template slot="duplication-tips">
      <div
        v-if="
          errorParam.warnInfoList.repeatMsg.length > 0 ||
          errorParam.warnInfoList.warnMsg.length > 0
        "
        class="validate-box"
      >
        <div class="err-validate">
          <div class="validate-top">
            <i
              class="icon aufontAll h-icon-all-close-circle validate-icon-error"
            ></i>
            <span class="validate-title" style="padding-left: 8px">
              {{
                errorParam.repeated && !errorParam.isCoverable
                  ? '存在编码重复，请修改！'
                  : '系统检测到以下对象不存在，是否直接导入？'
              }}
            </span>
          </div>
          <div class="validate-msg err">
            <ul v-if="errorParam.repeated && !errorParam.isCoverable">
              <li
                v-for="(item, index) in errorParam.warnInfoList.repeatMsg"
                :key="index"
              >
                {{ index + 1 }}、{{ item }}
              </li>
            </ul>
            <ul v-else>
              <li
                v-for="(item, index) in errorParam.warnInfoList.warnMsg"
                :key="index"
              >
                {{ index + 1 }}、{{ item.warningMsg }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </ErrorMessageTemplate>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import MixinErrorMessage from '../../../../components/global/modal/import/mixins/error-message';
import ErrorMessageTemplate from '../../../../components/global/modal/import/templates/error-message-template.vue';

@Component({
  name: 'errorMessage',
  components: {
    ErrorMessageTemplate,
  },
})
export default class errorMessage extends mixins(MixinErrorMessage) {
  @Prop()
  strategy!: any;
}
</script>

<style lang="less" scoped>
.validate-icon-error {
  color: rgba(245, 154, 35, 1);
}
.validate-msg {
  margin-left: -12px;
  margin-bottom: 24px;
  padding-left: 38px;
  font-size: 14px;
  font-family: PingFang-SC-Regular;
  font-weight: 400;
  color: #111218;
  line-height: 22px;
  ul {
    margin-top: 10px;
    padding: 8px;
    border-radius: 4px;
  }
  &.err {
    ul {
      font-size: 12px;
      line-height: 24px;
      background-color: rgba(245, 34, 45, 0.1);
      border: 1px solid rgba(245, 34, 45, 0.1);
    }
  }
  &.warn {
    ul {
      background-color: rgba(245, 245, 245, 1);
      border: 1px solid rgba(191, 191, 191, 0.16);
    }
  }
  .validate-title {
    padding-left: 8px;
  }
}
</style>
