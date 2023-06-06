<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="form-detail">
    <form-detail-header-open-in-list
      :formObj="formObj"
      :nodes="nodes"
      @action="onAction"
      @nodesSwitch="nodesSwitch"
    >
      <template slot="h4">
        <template v-if="isWorkflowForm">
          <h4 v-if="isNew">
            {{ $t('languages.common.formTitle.createWorkflow')
            }}{{ formObj.workflowName ? '-' + formObj.workflowName : '' }}
          </h4>
          <h4 v-else-if="isDraft">
            {{ $t('languages.common.formTitle.editWorkflow')
            }}{{ formObj.workflowName ? '-' + formObj.workflowName : '' }}
          </h4>
          <h4 v-else>
            {{ $t('languages.common.formTitle.viewWorkflow')
            }}{{ formObj.workflowName ? '-' + formObj.workflowName : '' }}
          </h4>
        </template>
        <template v-else>
          <h4 v-if="isNew">
            {{ $t('languages.common.formTitle.createForm')
            }}{{
              formObj.bizSheet &&
              formObj.bizSheet.name_i18n &&
              JSON.parse(formObj.bizSheet.name_i18n)[$i18n.locale]
                ? '-' + JSON.parse(formObj.bizSheet.name_i18n)[$i18n.locale]
                : formObj.bizSheet && formObj.bizSheet.name
                ? '-' + formObj.bizSheet.name
                : ''
            }}
          </h4>
          <h4 v-else-if="isDraft">
            {{ $t('languages.common.formTitle.editForm')
            }}{{
              formObj.bizSheet &&
              formObj.bizSheet.name_i18n &&
              JSON.parse(formObj.bizSheet.name_i18n)[$i18n.locale]
                ? '-' + JSON.parse(formObj.bizSheet.name_i18n)[$i18n.locale]
                : formObj.bizSheet && formObj.bizSheet.name
                ? '-' + formObj.bizSheet.name
                : ''
            }}
          </h4>
          <h4 v-else>
            {{ $t('languages.common.formTitle.viewForm')
            }}{{
              formObj.bizSheet &&
              formObj.bizSheet.name_i18n &&
              JSON.parse(formObj.bizSheet.name_i18n)[$i18n.locale]
                ? '-' + JSON.parse(formObj.bizSheet.name_i18n)[$i18n.locale]
                : formObj.bizSheet && formObj.bizSheet.name
                ? '-' + formObj.bizSheet.name
                : ''
            }}
          </h4>
        </template>
      </template>
      <!-- <form-actions
        :actions="actions"
        @action="onAction"
        :toShowPrints="isShow"
        :setPdfConf="pdfAble"
        @propPrintClick="getChildPrintClick"
      ></form-actions> -->
    </form-detail-header-open-in-list>

    <div class="form-body" @scroll="onBodyScroll" @click="isShow = false">
      <div class="form-wrap">
        <div class="form-d-box" :style="getFormDBoxStyle()">
          <workflow-info
            :id="workflowInstanceId"
            v-if="workflowInstanceId"
            :itemId="formObj.workItemId"
            :curNode="formObj.activityCode"
            :workflowBaseInfo="workflowBaseInfo"
            @setFinishTime="setFinishTime"
            @flowTrack="flowTrack"
          />
          <!-- <div class="pageTitle">项目归档</div> -->
          <!--渲染控件-->
          <div class="noneBorder">
            <pc-form-renderer
              ref="formRenderer"
              :class="{
                'has-form-border': borderMode,
                'plan_order': _sheetCode,
                xinzeng:
                  formObj.formPermission.actionPermission.submit &&
                  !formObj.formPermission.actionPermission.print,
                printBtn: formObj.formPermission.actionPermission.print,
              }"
              :controls="controls"
              :relevanceDataList="dataModalList"
              :formPermission="formObj.formPermission"
              :formControls="formControls"
              :dataItems="dataItems"
              sourceType="portal"
              @sheetColumnResize="onSheetColumnResize"
              @updateLatestSignature="updateLatestSignature"
            />
          </div>

          <!-- <a-collapse
            v-if="workflowInstanceId && !isExternal"
            class="workflow-collapse approval-record"
            activeKey="approvals"
            :bordered="false"
          >
            <a-collapse-panel
              class="bold-collapse-panel approval-record-header"
              :header="$t('languages.common.approval')"
              key="approvals"
            >
              <Approval
                :workflowInstanceId="workflowInstanceId"
                :completed="completed"
                :canceled="canceled"
                :finishTime="finishTime"
                :getFileUrlFn="getFileUrlFn"
                @download="onDownload"
              ></Approval>
            </a-collapse-panel>
          </a-collapse> -->

          <form-action-modal ref="actionModal" @ok="onOk" />

          <!-- 历史留痕弹窗 -->
          <!-- <form-marking ref="FormMarking" :isDetail="true"></form-marking> -->
        </div>
      </div>
      <div v-show="showBacktop" class="back-top" @click="backTop">
        <a-icon type="up" />
      </div>

      <template
        v-if="
          (isSsubmited && isLoadComment) ||
          (workflowInstanceId && !isExternal) ||
          showTrack
        "
      >
        <div class="sidebar" style="position: relative">
          <div class="retract" @click="toggleComment">
            <span v-if="isShowComment" class="icon aufontAll open-close">&#xe88f;</span>
            <span v-else class="icon aufontAll open-close">&#xe889;</span>
          </div>
          <div v-show="isShowComment" class="comment-box">
            <Tabs v-model="activeKey" class="tabs">
              <TabPane
                v-if="workflowInstanceId && !isExternal"
                key="1"
                :tab="$t('languages.common.processRecord')"
                class="tabpane approval-tabpane"
              >
                <Approval
                  :workflowInstanceId="workflowInstanceId"
                  :completed="completed"
                  :canceled="canceled"
                  :finishTime="finishTime"
                  :workflowBaseInfo="workflowBaseInfo"
                  :getFileUrlFn="getFileUrlFn"
                  @setApprovals="setApprovals"
                  @download="onDownload"
                />
              </TabPane>
              <TabPane
                v-if="isSsubmited && isLoadComment"
                key="2"
                :tab="$t('languages.common.form.Comment')"
                class="tabpane"
              >
                <pc-comment :collspanForPc="isShowComment" :formObj="formObj" />
              </TabPane>
              <TabPane
                v-if="showTrack"
                key="3"
                :tab="$t('languages.common.form.FormTrack')"
                class="tabpane"
              >
                <form-marking
                  v-if="activeKey === '3'"
                  ref="formMarking"
                  :collspanForPc="isShowComment"
                  :isDetail="true"
                />
              </TabPane>
              <TabPane
                v-for="item in tabList"
                :key="item.key"
                :tab="item.name"
                class="tabpane"
              >
                <emphas v-if="item.key === '7'" :list="foucsList" />
                <regulations v-if="item.key === '4'" />
                <cases v-if="item.key === '5'" />
                <templat
                v-if="item.key === '6'"
                :getWorkflowCode="getWorkflowCode"
                :getWorkflowID="getWorkflowID"
                />
                <matters v-if="item.key === '8'" />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </template>
    </div>

    <a-alert
      v-if="comment"
      :message="comment"
      type="info"
      banner
      closable
      class="alert-info"
      :style="{ left: isShowComment ? '35%' : '50%' }"
    />

    <a-alert
      v-if="showAlertWarn"
      class="alert-warning"
      :message="$t('languages.common.form.invalidForm')"
      type="warning"
      showIcon
      closable
    />

    <iframe id="pdfFrame" class="pdf-frame" :srcdoc="srcdoc"></iframe>
    <template v-if="isPrintGenerateHtml">
      <GenerateHtml
        ref="printRenderer"
        :pages="[draftAttributesJson]"
        :formdata="formdata"
      />
    </template>

    <template v-for="tempPrintEle of tempPrintEleArray">
      <TempPrintHtml
        :key="tempPrintEle.key"
        :printEle="tempPrintEle.tempPrintEle"
        :pageSettings="tempPrintPageSettings"
        @calcResult="collectorTempPrintInfo"
      />
    </template>
    <form-detail-footer
      v-if="!fromDashboard"
      :style="{ width: isShowComment ? 'calc(100% - 401px)' : '100%' }"
      :formObj="formObj"
      :nodes="nodes"
      @nodesSwitch="nodesSwitch"
    >
      <template v-if="isNew && !isDraft" slot="isSaveData">
        <a-checkbox
          :checked="isSaveAndCreate"
          @change="(e) => (isSaveAndCreate = e.target.checked)"
        >
          {{ $t('languages.common.form.cacheFormData') }}
        </a-checkbox>
      </template>
      <form-actions
        :actions="actionsDeal"
        :toShowPrints="isShow"
        :setPdfConf="pdfAble"
        :isShowSubmitAndCreateBtn="isNew && !isDraft"
        :printTemplates="printTemplates"
        @action="onAction"
        @propPrintClick="getChildPrintClick"
        @submitAndCreate="submitAndCreate"
      />
    </form-detail-footer>

    <template v-if="initiateGroupChatModalVisible">
      <initiateGroupChat
        v-model="initiateGroupChatModalVisible"
        :formObj="formObj"
        :approvals="approvals"
      />
    </template>

    <!-- 自定义按钮查看列表弹框 -->
    <a-modal
      :visible="visibleOpen"
      width="1200px"
      title="查看列表"
      :footer="null"
      :centered="true"
      :destroyOnClose="true"
      @cancel="onCloseInfoModal"
    >
      <custom-button-modal
        :schemaCode="customButtomModalCode"
        :viewCode="viewCodeCustom"
      />
    </a-modal>
  </div>
</template>

<script src="./form-detail.ts"></script>

<!--自定义弹出框背景样式-->
<style lang="less">
@import '~styles/themes/pub_ui_change.less';

.form-detail {
  .ant-tabs-nav .ant-tabs-tab:not(.ant-tabs-tab-active) {
    font-weight: 600;
    color: #111218;
  }
}

.ant-modal-mask {
  background: rgba(0, 0, 0, 0.3968);
}
.pdf-frame-div {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 233;
  background-color: #000;
  opacity: 0.6;
}
// .pdf-frame {
//   position: absolute;
//   left: 25%;
//   top: 0;
//   z-index: 2333;
//   width: 50%;
//   height: 100%;
//}
.pdf-frame {
  position: fixed;
  left: 250%;
  top: 0;
  z-index: 2333;
  width: 50%;
  height: 100%;
  border: none;
}
.close-previewPdf {
  width: 32px;
  position: relative;
  z-index: 2333;
  left: 75.5%;
  bottom: 96%;
  color: #606165;
  font-size: 32px;
  background: #ccc;
  border-radius: 50%;
  &:hover {
    color: #000;
    cursor: pointer;
    transition: all 0.3s;
  }
}
</style>
<style lang="less" scoped>
@import '../../styles/themes/default.less';
// @import "../../components/apps/form/style";
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
/deep/.ant-tabs {
  padding-left: 0.5em;
}
/deep/.ant-row-flex {
  border: none !important;
  margin: 0 -20px !important;
}
/deep/ .ant-row-flex .form-sheet {
  margin: 0 20px !important;
  margin-bottom: 10px !important;
  .span-title {
    padding-left: 0px !important;
  }

  .h3-panel-body {
    border: 1px solid rgba(217, 217, 217, 1) !important;
  }
  .ant-divider-horizontal {
    margin: 0px !important;
  }
}

/deep/ .not-visible-border .ant-col > div {
  margin: 0 20px !important;
}
/deep/ .description {
  margin: 0 14px !important;
}
/deep/.form-sheet .h3-panel .h3-panel-header {
  background: none !important;
  border-bottom: none;
  height: 30px;
  line-height: 34px;
  padding-top: 0px !important;
  .span-title {
    color: #111218 !important;
  }
}
/deep/.sheet {
  border: none;
  overflow: auto !important;
}
/deep/.ant-tabs-nav .ant-tabs-tab {
  margin: 0px 30px 0px 16px;
  padding: 12px 0px;
}
.form-detail {
  min-width: 1100px;
}
.textarea {
  display: flex;
  align-items: center;
}

.form-box {
  display: flex;
}

.comment-box {
  width: 401px;
  min-width: 401px;
  height: 100%;
  background: rgba(245, 246, 249, 0.56);
  padding: 2px 0 16px 0px;
  box-sizing: border-box;
  position: relative;
  border-left: 1px solid #dddddd;
  & > .tabs {
    height: 100%;
    padding-left: 0px;
    & /deep/.ant-tabs-bar {
      padding-left: 24px;
      padding-right: 17px;
    }
    & /deep/.ant-tabs-tab {
      font-size: 14px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #111218;
      line-height: 20px;
      margin-left: 0;
      &:hover {
        color: @highlightColor;
      }
    }
    &/deep/.ant-tabs-tab-active {
      &:hover {
        color: #111218;
      }
    }
    & /deep/.ant-tabs-top-content.ant-tabs-content-animated {
      height: calc(100% - 63px);

      .ant-tabs-tabpane {
        height: 100%;
        overflow: overlay;
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  }
}

.form-body {
  display: flex;
  flex-grow: 1;
  height: calc(100% - 64px);
  position: relative;
  min-width: 924px;
  transition: all ease 0.5s;
  background-color: #fff;
  /deep/.field__label {
    height: 32px !important;
  }

  /deep/.ant-select-search__field__wrap {
    .ant-select-search__field {
      border-color: transparent !important;
      box-shadow: none !important;
      border: none !important;
    }
  }

  /deep/.sheet {
    // width: 2500px;
    // overflow: hidden;

    .sheet__col.date {
      border-right: 1px solid #e8e8e8 !important;
      border-bottom: 1px solid #e8e8e8 !important;
    }
    .sheet__col {
      min-width: 50px !important;
      background: #fafafa;
      text-align: center;
    }
    .emtpy__body {
      border-bottom: 1px solid #e8e8e8;
    }
    .sheet__body {
      overflow: initial;
    }
  }
  // /deep/  .ant-table-content{
  //   .ant-table-tbody{
  //   border-top: 1px solid #e8e8e8 !important;
  //   tr{
  //     border-bottom: 1px solid #e8e8e8 !important;
  //     width: 100%;
  //     td{
  //       border-right:1px solid #e8e8e8 !important;
  //     }
  //   }
  // }
  // }
  /deep/.field-wrapper {
    .h3-input-number {
      border: none;
    }
    min-height: 32px !important;
    border: none !important;
    span,
    a,
    .form-staff,
    .radio,
    p {
      margin: 0 !important;
      padding: 0 !important;
    }
    .ant-upload-list-item-name {
      padding-left: 22px !important;
    }
    .relevanceform .tree-select {
      padding-left: 10px !important;
    }
    .items,
    .input-wrapper,
    .number > span,
    .date > span,
    .form-staff-warp,
    .attachment,
    .address.dd,
    .relevanceform .link,
    .relevanceformex > div > span,
    .relevanceform .text ,
    .textarea {
      display: block;
      border: 1px solid rgba(212, 213, 214, 1);
      border-radius: 2px;
      // width: 423px;
      display: block;
      padding: 5px 10px !important;
      width: 100% !important;
      padding: 5px 10px;
      min-height: 32px;
    }
    // .relevanceformex input {
    //   border: 0 !important;
    // }
  }
  /deep/.xinzeng {
    .field-wrapper {
      .input-wrapper,
      .number,
      .date,
      .address.dd,
      .textarea {
        padding: 0 !important;
        border: none !important;
      }
      .textarea textarea {
        height: auto !important;
      }
      .staffselector,
      .departmentselector {
        .h3-organization {
          border: 1px solid #d4d4d4 !important;
        }
      }
      // .attachment {
      //   padding-left: 0px !important;
      // }
    }
    .ant-input,
    input,
    .ant-select,
    .h3-organization .h3-textarea {
      border: 1px solid #d4d5d6 !important;
    }
    .ant-select {
      .ant-select-selection {
        border: none !important;
        // border-bottom: 1px solid #d4d5d6 !important;
        // border-radius: 0!important;
        &.ant-select-selection--single{
          height: 30px!important;
        }
      }
    }

    .field__control {
      margin-bottom: 20px;
    }
    .ant-select-arrow,
    .ant-select-selection__clear {
      margin-top: -6px !important;
    }
    .ant-select-selection__rendered:active {
      border: none !important;
      box-shadow: none !important;
    }
  }
  /deep/ .printBtn {
    .field-wrapper {
      .input-wrapper {
        padding: 0 !important;
        border: none !important;
        > .text {
          border: 1px solid rgba(212, 213, 214, 1);
          border-radius: 2px;
          // width: 423px;
          display: block;
          padding: 5px 10px;
          width: 100% !important;
          padding: 5px 10px;
          min-height: 32px;
          /deep/.datePicker input {
            border: none !important;
          }
        }
      }

      .textarea {
        border: none;
        padding: 0 !important;
        .text {
          border: 1px solid rgba(212, 213, 214, 1);
          border-radius: 2px;
          // width: 423px;
          display: block;
          width: 100% !important;
          min-height: 32px;
          padding: 5px 10px;
        }
      }
      .textarea textarea {
        height: auto !important;
      }

      .h3-organization {
        border: 1px solid #d4d5d6 !important;
      }
      .ant-select {
       .ant-select-selection {
          border: none !important;
        }
      }
    }
    /deep/.ant-tabs > .ant-tabs-conten > .ant-tabs-tabpane-active > .reverse-relevance-list > .list-selector > .pagination-box > .no-show-total-pagination > .ant-select > .ant-select-selection{
      border: none !important;
          &.ant-select-selection--single{
            height: 30px!important;
          }
    }

    .ant-input,
    input,
    .ant-select,
    .h3-textarea {
      border: 1px solid #d4d5d6 !important;
    }
    .date {
      border: none !important;
      padding: 0;
    }

    .field__control {
      margin-bottom: 20px;
    }
    .ant-select-arrow,
    .ant-select-selection__clear {
      margin-top: -6px !important;
    }
    .ant-select-selection__rendered:active {
      border: none !important;
      box-shadow: none !important;
    }
  }
}
.plan_order{

  /deep/ .table.has-filterbox.has-action {
    overflow: auto;
  }
  /deep/.sheet {
    width: 2500px;
  }
}
.retract {
  position: absolute;
  left: -17px;
  top: calc(50% - 29px);
  transition: all ease 0.1s;
  cursor: pointer;
  width: 18px;
  height: 58px;
  background: #f9fafb;
  border: 1px solid #dddddd;
  border-right: 0px solid;
  font-size: 12px;
  color: #b6bcc6;
  padding: 19px 2px;
  z-index: 999;
  border-radius: 2px;
  & .open-close {
    font-size: 12px;
  }
}

@media print {
  .form-body {
    display: block;
    overflow: unset !important;
  }
  .footer {
    display: none;
  }
  .sidebar {
    .comment-box {
      width: 100%;
    }
  }
}
.report .vue-grid-layout {
  height: auto !important;
}

/deep/
  .form-wrap
  > div.form-d-box[data-v-60c73d6e]
  .has-form-border
  > .ant-row-flex
  .spanFillUp::before {
  display: none;
}
@media (max-width: 1440px) and(min-width:0px) {
  /deep/ .form-d-box {
    max-width: 888px !important;
  }
}
@media (max-width: 1920px) and(min-width:1441px) {
  /deep/ .form-d-box {
    max-width: 1400px !important;
  }
}
/deep/ .system-info-box .field {
  display: block !important;
  padding-left: 10px !important;
}

/deep/ .h3-panel-header {
  margin-bottom: 10px;
  margin-top: 10px;
}
/deep/ .form-sheet .h3-panel-header {
  margin-bottom: 0px !important;
  margin-top: 0px !important;
}
.form-wrap {
  position: relative;
  overflow: scroll;
  flex-grow: 1;
  padding: 20px 0 100px 0;
  & > div.form-d-box {
    // min-width: 800px;
    // max-width: 1000px;
    margin: 0 auto;
    padding: 0 32px 0 32px;
    /deep/.ant-row-flex {
      margin-left: -32px;
      .ant-col {
        // padding-left: 32px;
        // &:first-child {
        //   padding-left: 0;
        // }
      }
      .system {
        &.field {
          min-height: 32px;
          padding: 0;
        }
      }
      &.system-info-box {
        margin-bottom: 14px;
        .ant-col {
          .field {
            padding-left: 0px !important;
          }
        }
      }
      // .ant-col-6,
      // .ant-col-8,
      // .ant-col-12,
      // .ant-col-16,
      // .ant-col-18,
      // .ant-col-24 {
      //   padding: 0 16px;
      // }
    }
    /deep/.has-form-border {
      .field__label {
        min-width: 108px;
        max-width: 108px;
        width: 108px;
      }
      // & > .ant-row-flex {
      //   .spanFillUp {
      //     &::before {
      //       position: absolute;
      //       left: 0;
      //       bottom: 0;
      //       content: '';
      //       width: 100%;
      //       border-top: 1px solid #d9d9d9;
      //       z-index: 1;
      //     }
      //   }
      // }
      .ant-row-flex {
        margin: unset;
        &.system-info-box {
          margin-bottom: 0;
        }
        .ant-tabs-tabpane {
          .spanFillUp {
            &::before {
              position: absolute;
              left: 0;
              bottom: 0;
              content: '';
              width: 100%;
              border-top: 1px solid #d9d9d9;
              z-index: 1;
            }
          }
        }
        .ant-col-6,
        .ant-col-8,
        .ant-col-12,
        .ant-col-16,
        .ant-col-18,
        .ant-col-24 {
          padding: unset;
        }
      }

      .ant-row-flex .system.field {
        min-height: 48px !important;
      }
    }
    /deep/.form-title {
      padding-right: 0;
      padding-left: 0;
    }
  }
  .approval-record {
    background: #fff;
  }
  .approval-record-header {
    /deep/.ant-collapse-header {
      width: 100%;
      padding: 10px !important;
      color: rgba(0, 0, 0, 0.65);
      &:hover {
        background: #eef3ff;
      }
      .ant-collapse-arrow {
        left: 88px !important;
        color: rgba(0, 0, 0, 0.45);
        font-weight: normal;
      }
    }
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.back-top {
  cursor: pointer;
  position: fixed;
  display: inline-flex;
  right: 40px;
  bottom: 40px;
  width: 40px;
  height: 40px;
  background: @light-color-3;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: @font-size-18;
  justify-content: center;
  align-items: center;
}

/deep/.ant-alert.alert-info {
  position: absolute;
  top: 74px;
  left: 50%;
  width: 616px;
  min-height: 40px;
  background-color: #f0f7ff;
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  border: 1px solid rgba(41, 112, 255, 0.5);
  transform: translateX(-50%);

  & > i {
    top: 12px;
  }
}

/deep/.ant-alert-message {
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  word-break: break-all;
  display: block;
  margin-right: 1em;
}
/deep/.rich-text.desc {
  height: 45px !important;
  line-height: 45px !important;
  h2 {
    margin-bottom: 0px !important;
  }
}
/deep/.ant-alert.alert-warning {
  position: absolute;
  top: 74px;
  left: calc(50% - 308px);
  width: 616px;
  height: 40px;
  border-radius: 4px;
}
/deep/.h3-panel-body {
  padding: 0px !important;
}
/deep/.form-staff {
  padding: 0 10px !important;
  text-align: center;
}
/deep/.field__label {
  min-width: 84px;
  max-width: 84px;
  width: 84px;
  display: flex;
  // align-items: center;
  color: #111218;
  font-weight: 600;
  // min-height: 32px;
  line-height: 22px;
  padding: 5px 0;
}
// 财务
/deep/.workflow-info-wrapper {
  height: 80px;
}
/deep/.workflow-info__status {
  padding: 0 40px !important;
}
/deep/.wrapper {
  color: #111218 !important;
  font-size: 14px !important;
}
/deep/.pageTitle {
  font-size: 24px;
  color: #111218;
  line-height: 32px;
  font-weight: 600;
  margin: 32px auto 24px;
  width: 100%;
  text-align: center;
}
// 财务结束
/deep/.system-info-box {
  .field__control {
    min-height: 32px;
    line-height: 22px;
    // margin-left: 8px;
    color: #111218;
    background: rgba(245, 246, 249, 0.56);
    border-radius: 4px;
    padding: 5px 12px;
    height: auto !important;
  }
}

/deep/ .ant-input {
  border-top: 1px solid #d4d4d4 !important;
  border-bottom: 1px solid #d4d4d4 !important;
}
/deep/.field__control.field__control__readonly {
  min-height: 32px;
  line-height: 22px;
  // margin-left: 8px;
  color: #111218;
  background: rgba(245, 246, 249, 0.56);
  border-radius: 4px;
  // padding: 5px 12px;
  .upload-control-component,
  .input-signsture {
    &.readonly {
      min-height: unset;
      line-height: unset;
      // margin-left: 8px;
      color: unset;
      background: unset;
      border-radius: unset;
      padding: unset;
    }
  }
}
/deep/.form-staff-item .avatar-wrapper {
  width: 24px;
  height: 24px;
  min-width: 24px;
}
/deep/.form-staff-item {
  max-width: 100%;
  min-height: 24px;
}
/deep/.has-form-border {
  .system-info-box {
    .field__control {
      margin-left: 0;
      p {
        margin-bottom: 0px !important;
        padding: 0px;
      }
    }
  }
  .field__control.field__control__readonly {
    margin-left: 0;
    .address {
      p {
        margin-bottom: 0px !important;
        padding: 10px;
      }
    }
  }
}

/deep/.sheet__row {
  min-height: 0px !important;
  margin-bottom: 0px !important;
  // overflow-x: hidden!important;
}
/deep/.sheet-head-column {
  &.last {
    overflow: hidden;
  }
}
/deep/.warp {
  width: 100% !important;
}
/deep/.sheet__row.scrollbar {
  display: none;
}
/deep/.AuditType {
  padding: 5px;
}
/deep/.ant-pagination-options {
  margin-top: 10px !important;
}
/deep/.h3-panel-header {
  height: 42px;
  background: #f1f6fc !important;
  box-shadow: 0px 1px 0px 0px rgba(41, 112, 255, 0.19);
  .span-title {
    font-size: 14px !important;
    color: #2970ff !important;
    color: #2970ff !important;
    padding-left: 10px !important;
  }
}
/deep/.ant-row-flex {
  .field.system .field__control {
    padding-left: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .field.system {
    padding-left: 0;
    padding-right: 0;
    align-items: center;
    .field__label {
      flex-grow: 1;
      // max-width: none;
      margin-right: 0;
      margin-left: 0;
    }
  }

  & > .ant-col:first-child > .field.system {
    .field__label {
      min-width: 90px;
      max-width: 90px;
      margin-right: 0;
      justify-content: flex-start;
      flex-grow: 0 !important;
    }
  }

  .has-form-border.field.system {
    .field__label {
      min-width: 108px;
      max-width: 108px;
    }
  }

  // & > .ant-col:last-child > .field.system {
  //   .field__label {
  //     flex-grow: 1;
  //     margin-right: 0;
  //     max-width: none;
  //  }

  //   .field__control {
  //     flex-grow: 0;
  //     flex-shrink: 0;
  //     justify-content: flex-end;
  //  }
  //}
}
</style>

<style lang="less">
.form-forward {
  .field__label {
    min-width: 126px;
    max-width: 126px;
    width: 126px;
  }
}
</style>
