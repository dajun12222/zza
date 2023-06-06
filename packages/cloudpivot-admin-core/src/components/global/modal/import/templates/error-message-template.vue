<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <!-- 只在没有显示修改“编码或其他属性”界面才会显示校验结果 -->
  <div class="validate-box">
    <!-- 文件校验不通过，默认直接展示校验失败图片 -->
    <template v-if="!importVM.errorParam.isFileOk">
      <slot name="file-error-tips">
        <div class="file-status contain-img">
          <img src="../../../../../assets/images/file-error.png" />
          <div class="text-error">
            <em
              class="icon aufontAll h-icon-all-close-circle file-status-icon error"
            ></em>
            <span class="file-status-txt">{{
              importVM.errorParam.fileErrMsg
            }}</span>
          </div>
        </div>
      </slot>
    </template>

    <!-- 文件校验通过且没有编码等属性的重复，默认直接展示成功图片 -->
    <template v-else-if="!importVM.fileInvalid">
      <slot name="file-ok-tips">
        <div
          v-show="importVM.errorParam.isFileOk && !importVM.fileInvalid"
          class="file-status contain-img"
        >
          <img src="../../../../../assets/images/file-ok.png" />
          <div class="text-error">
            <em
              class="icon aufontAll h-icon-all-check-circle file-status-icon"
            ></em>
            <span class="file-status-txt">{{
              $t('languages.Apps.DocumentChecked')
            }}</span>
          </div>
        </div>
      </slot>
    </template>

    <!-- 文件校验通过但是后台接口判断出有重复，显示修改提示 -->
    <template v-if="importVM.errorParam.isFileOk && importVM.fileInvalid">
      <slot name="duplication-area">
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
            <span>{{ importVM.errorParam.coreRepeatErrMsg }}</span>
          </template>
        </div>
        <slot name="duplication-tips"></slot>
      </slot>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Icon } from '@h3/antd-vue';

@Component({
  name: 'ErrorMessage',
  components: {
    AIcon: Icon,
  },
})
export default class ErrorMessageTemplate extends Vue {
  @Prop() importVM!: any;
}
</script>

<style lang="less" scoped>
.validate-box {
  .file-status {
    &.repeat {
      display: block;
      height: 40px;
      background: #fffbe6;
      border-radius: 4px;
      border: 1px solid #ffe58f;
      padding-left: 8px;
      .file-status-txt {
        font-size: 14px;
        line-height: 40px;
        height: 22px;
        color: rgba(17, 18, 24, 0.5);
        font-weight: 400;
      }
      span {
        display: inline;
      }
      & > div {
        margin-top: 10px;
        margin-left: 26px;
      }
      .high-light {
        color: @primary-color;
      }
    }
    height: 24px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &-icon {
      color: @primary-color;
      font-size: 18px;
      &.h-icon-all-check-circle {
        color: #00c293;
      }
      &.error {
        color: #f5222d;
      }
    }
    &-warn {
      color: #faad14;
      transform: scale(0.75);
      display: inline-block;
    }
    &-txt {
      display: block;
      height: 24px;
      line-height: 24px;
      font-weight: bold;
      font-size: 16px;
      color: #111218;
      margin-left: 8px;
      word-break: break-all;
    }

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

  .file-check-status {
    margin: 12px 0;
    padding-left: 30px;
    color: #111218;
  }

  .file-content {
    &.approved {
      margin-top: 24px;
    }
    &.repeated {
      margin-top: 14px;
    }
    &.error {
      margin-top: 16px;
    }
    &-hint {
      color: rgba(17, 18, 24, 0.5);
      font-size: 12px;
      line-height: 22px;
    }
    &-error {
      & > ul {
        padding: 8px;
        background: rgba(245, 34, 45, 0.06);
        border-radius: 4px;
        border: 1px solid rgba(245, 34, 45, 0.08);
      }
    }
  }

  .status-tip {
    margin-left: 30px;
    padding: 15px;
    background: #fffbe6;
    border-radius: 4px;
    border: 1px solid #ffe58f;
    font-size: 14px;
    color: rgba(17, 18, 24, 0.5);
    line-height: 22px;
    > p {
      line-height: 28px;
      margin-bottom: 15px;
    }
  }
}
</style>
