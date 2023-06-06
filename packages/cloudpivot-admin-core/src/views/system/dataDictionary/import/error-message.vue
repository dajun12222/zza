<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <ErrorMessageTemplate :importVM="_self">
    <template slot="duplication-area">
      <template v-if="errorParam.isFileOk && errorParam.fileCodeInvalid">
        <div class="file-status">
          <em
            class="icon aufontAll h-icon-all-check-circle file-status-icon"
          ></em>
          <span class="file-status-txt">{{
            $t('languages.Apps.DocumentFormatChecked')
          }}</span>
        </div>

        <div class="file-check-status">
          <template>
            <span>{{ errorParam.coreRepeatErrMsg }}</span>
          </template>
        </div>
        <div class="status-tip">
          <p>
            1. 选择导入覆盖，按照以下规则：<br />
            数据字典当前系统不存在，导入文件中存在：直接导入<br />
            数据字典当前系统存在，导入文件中存在：导入文件覆盖<br />
            数据字典当前系统存在，导入文件中不存在：仍然保留
          </p>
          <p>2. 修改编码再导入，将会生成新的数据字典</p>
        </div>
      </template>
      <template v-else-if="errorParam.isFileOk && errorParam.fileNameInvalid">
        <div class="file-status name-dup">
          <em
            class="icon aufontAll h-icon-all-check-circle file-status-icon"
          ></em>
          <span class="file-status-txt">{{
            $t('languages.Apps.DocumentFormatChecked')
          }}</span>
        </div>
        <div class="file-status name-dup">
          <em
            class="icon aufontAll h-icon-all-check-circle file-status-icon"
          ></em>
          <span class="file-status-txt">字典编码校验通过</span>
        </div>
        <div class="file-status name-dup">
          <em
            class="icon aufontAll h-icon-all-close-circle file-status-icon error"
          ></em>
          <span class="file-status-txt">字典名称已存在，请修改名称</span>
        </div>
      </template>
    </template>
  </ErrorMessageTemplate>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Icon } from '@h3/antd-vue';
import { mixins } from 'vue-class-component';
import MixinErrorMessage from '../../../../components/global/modal/import/mixins/error-message';
import ErrorMessageTemplate from '../../../../components/global/modal/import/templates/error-message-template.vue';
@Component({
  name: 'ErrorMessage',
  components: {
    AIcon: Icon,
    ErrorMessageTemplate,
  },
})
export default class ErrorMessage extends mixins(MixinErrorMessage) {
  get fileInvalid() {
    return this.errorParam.fileCodeInvalid || this.errorParam.fileNameInvalid;
  }
}
</script>

<style lang="less" scoped>
.file-status {
  &.contain-img {
    flex-direction: column;
    img {
      width: 204px;
    }
    .text-error {
      display: flex;
      align-items: center;
    }
  }

  &.name-dup {
    margin-bottom: 24px;
    .file-status.text {
      margin-left: 12px;
    }
  }
}
</style>
