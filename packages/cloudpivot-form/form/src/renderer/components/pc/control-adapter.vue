<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <form-title v-if="isTitle" v-show="show" :control="control" />

  <description v-else-if="isDescription" :control="control" />

  <div v-else-if="isSheet">
    <form-sheet
      :id="id"
      :control="control"
      :formPermission="formPermissionData"
      :frozenKeys="frozenKeys"
      :class="{ vertical: layoutType }"
      @fullScreen="fullScreen"
      @freezeColumn="onFreezeColumn"
    />
    <a-modal
      v-model="isFullScreen"
      :width="'100%'"
      dialogClass="import-modal full-modal"
      :footer="null"
      :mask="true"
      style="top: 0"
      :bodyStyle="{ height: 'calc(100vh)', padding: 0 }"
      :closable="false"
      :maskClosable="false"
      :keyboard="false"
    >
      <form-sheet
        :control="control"
        :formPermission="formPermissionData"
        :canFull="true"
        :frozenKeys="frozenKeys"
        @fullScreen="fullScreen"
        @freezeColumn="onFreezeColumn"
      />
    </a-modal>
  </div>

  <reverse-relevance
    :id="id"
    v-else-if="isReverseRelevance"
    v-show="show"
    :control="control"
  />

  <!-- <system-control
    :control="control"
    v-else-if="isSystem"
    v-show="show"
    :class="{ system:isSystem, vertical : layoutType }"
  ></system-control> -->
  <base-control-adapter
    v-else-if="isHtml || isSystem || isNoLabel"
    :class="{
      system: isSystem,
      vertical: layoutType,
      titleHidden: titleVisible === false,
    }"
    :control="control"
  />

  <div :id="id" v-else v-show="show" class="field" :class="fieldClassObj">
    <div
      class="field__label"
      :class="[{ top: isHigh }, { approval_label: isApproval }]"
      :style="style"
    >
      <div
        v-if="control.options.labelVisible !== false"
        class="field__label-div"
        :title="label"
      >
        {{ control.key === '$approval' && !btnApprovalOpen ? '' : label }}
        <a-tooltip
          v-if="tips"
          placement="top"
          style="width: 14px; height: 14px"
        >
          <template slot="title">
            <pre style="margin-bottom: 0">{{ tips }}</pre>
          </template>
          <a-icon type="question-circle" />
        </a-tooltip>
      </div>
    </div>
    <div :id="'op_' + id" v-if="control.isRelevanceQuery" class="op">
      <a-select
        v-model="control.op"
        :placeholder="$t('cloudpivot.list.pc.pleaseSelect')"
        defaultValue="eq"
        style="width: 80px"
      >
        <a-select-option :title="$t('cloudpivot.list.pc.Equal')" value="eq">
          {{ $t('cloudpivot.list.pc.Equal') }}
        </a-select-option>
        <a-select-option
          v-if="![12, 13].includes(control.type)"
          :title="$t('cloudpivot.list.pc.NoEqual')"
          value="NotEq"
        >
          {{ $t('cloudpivot.list.pc.NoEqual') }}
        </a-select-option>
        <a-select-option
          v-if="![8].includes(control.type)"
          :title="$t('cloudpivot.list.pc.Equal')"
          value="IS_NULL"
        >
          {{ $t('cloudpivot.list.pc.ISNULL') }}
        </a-select-option>
        <a-select-option
          v-if="![8].includes(control.type)"
          :title="$t('cloudpivot.list.pc.NoEqual')"
          value="IS_NOT_NULL"
        >
          {{ $t('cloudpivot.list.pc.ISNOTNULL') }}
        </a-select-option>
      </a-select>
    </div>

    <div
      class="field__control"
      :class="{
        detail: layoutType && readonly,
        'field__control--selectOrg': isStaffSelector,
        field__control__readonly: readonly,
      }"
    >
      <template v-if="borderMode">
        <a-tooltip placement="topLeft">
          <template v-if="hasError" slot="title">
            <ul>
              <li v-for="err in errors" :key="err.code">
                {{ getErrorMessage(err) }}
              </li>
            </ul>
          </template>

          <div style="position: relative" class="field-wrapper">
            <div :class="[typeClass]">
              <template
                v-if="control.op !== 'IS_NULL' && control.op !== 'IS_NOT_NULL'"
              >
                <base-control-adapter :control="control" />
              </template>
            </div>
          </div>
        </a-tooltip>
      </template>
      <template v-else>
        <div style="position: relative" class="field-wrapper">
          <div :class="[typeClass]">
            <template
              v-if="control.op !== 'IS_NULL' && control.op !== 'IS_NOT_NULL'"
            >
              <base-control-adapter :control="control" />
            </template>
          </div>
          <div class="err-tips">
            <p v-for="err in errors" :key="err.code">
              {{ getErrorMessage(err) }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import {
  getComponentTitleByControlType,
  getPcComponentByControlType,
} from 'cloudpivot-form/form/utils';
import { Icon, Modal, Tooltip } from '@h3/antd-vue';
import { Component, Inject, Provide } from 'vue-property-decorator';
import { FormControlType } from '../../typings';
import ControlAdapter from '../control-adapter';
import Description from '../layout/description.vue';
import FormTitle from '../layout/form-title.vue';
import BaseControlAdapter from './base-control-adapter.vue';
import SystemControl from './system-control.vue';
@Component({
  name: 'control-adapter',
  components: {
    AModal: Modal,
    ATooltip: Tooltip,
    AIcon: Icon,
    BaseControlAdapter,
    FormTitle,
    Description,
    SystemControl,
    // ReverseRelevance: () => import(/* webpackChunkName: "reverse-relevance" */"./reverse-relevance/reverse-relevance.vue"),
    FormTabs: () =>
      import(
        /* webpackChunkName: "pc-form-tabs" */ '../layout/pc-form-tabs.vue'
      ),
  },
})
export default class PcControlAdapter extends ControlAdapter {
  isFullScreen = false;

  frozenKeys: string[] = [];

  btnApprovalOpen: boolean = true;

  get titleVisible() {
    return this.control.options.labelVisible;
  }

  borderMode: boolean = false;

  created() {
    // 获取是否边框模式
    this.borderMode = !!document.querySelector('.has-form-border');

    let btnConfigList: any = sessionStorage.getItem('btnConfigList');
    if (btnConfigList) {
      try {
        btnConfigList = JSON.parse(btnConfigList);
        if (
          !btnConfigList[0].commentPermission.visible &&
          !btnConfigList[1].commentPermission.visible
        ) {
          this.btnApprovalOpen = false;
        }
      } catch (err) {}
    }
    const comp: any = getPcComponentByControlType(FormControlType.Sheet);
    const ReverseRelevance: any = getPcComponentByControlType(
      FormControlType.ReverseRelevance,
    );
    if (comp && comp.pc) {
      (this.$options as any).components.FormSheet = comp.pc;
    }
    if (ReverseRelevance && ReverseRelevance.pc) {
      (this.$options as any).components.ReverseRelevance = ReverseRelevance.pc;
    }
  }

  fullScreen() {
    this.isFullScreen = !this.isFullScreen;
    try {
      if (this.isFullScreen) {
        (
          window.parent.window.document.querySelector(
            '.icon-close',
          ) as HTMLElement
        ).style.display = 'none';
      } else {
        (
          window.parent.window.document.querySelector(
            '.icon-close',
          ) as HTMLElement
        ).style.display = 'block';
      }
    } catch (error) {}
  }

  onFreezeColumn(key: string, freeze: boolean) {
    if (freeze) {
      this.frozenKeys.push(key);
    } else {
      const index = this.frozenKeys.findIndex((k) => k === key);
      if (index > -1) {
        this.frozenKeys.splice(index, 1);
      }
    }
  }

  @Provide()
  setFrozenKeys(keys) {
    this.frozenKeys = keys;
  }

  get readonly() {
    return this.ctrl ? this.ctrl.readonly : false;
  }

  get typeClass() {
    const type = this.control.type;
    if ((this.control as any).diff) {
      console.log(this.control.value);
    }
    const name = FormControlType[type] || getComponentTitleByControlType(type);
    return name ? name.toLowerCase() : '';
  }

  @Inject()
  layoutTypeFn?: () => void;

  @Inject()
  getFormPermission!: () => any;

  get formPermissionData() {
    return this.getFormPermission();
  }

  get layoutType() {
    if (this.layoutTypeFn) {
      return this.layoutTypeFn();
    }
  }

  get disabled() {
    return this.ctrl ? this.ctrl.disabled : false;
  }

  get fieldClassObj() {
    return {
      vertical: this.layoutType,
      error: this.hasError,
      required: this.required && !this.disabled,
      edit: this.control.edit,
      diffControls: (this.control as any).diff,
    };
  }
}
</script>

<style lang="less" scoped>
.err-tips {
  position: absolute;
  top: 100%;
  left: 0;
  color: #f0353f;
  font-size: 12px;
  line-height: 20px;
  p {
    margin: 0;
  }
}
.h3-panel > .h3-panel-body > .ant-row-flex {
  border: none !important;
}
.has-form-border .h3-panel > .h3-panel-body > .ant-row-flex > .ant-col {
  border-right: none !important;
}
.field__control.field__control__readonly {
  background: none !important;
}
.op {
  margin-right: 10px;
  width: 80px;
}
.ant-col > div.field {
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  padding-bottom: 24px;
  flex-shrink: 0;
  text-align: left;
  height: 100%;
  padding-left: 0;
  padding-right: 0;
  // align-items: center;
  border: none !important;
  // 细节
  margin: 0 20px;
  padding-bottom: 5px !important;
  // &.dotted {
  //   border-bottom: 1px dotted #e8e8e8;
  // }
}
.field-wrapper {
  // border: 1px solid rgba(212, 213, 214, 1);
  // border-radius: 2px;
  // width: 423px;
  // min-width: 300px;
  // height: 32px;
  // margin-bottom: 25px;
}

/deep/ .field__label {
  font-size: 14px;
  color: #111218;
  flex-shrink: 0;
  margin-right: 8px;
  // display: flex;
  // color: rgba(0, 0, 0, 0.65);
  background: none !important;
  border: none !important;
  & > div {
    word-break: break-word;
    flex: 0 0 40% !important;
    min-width: 200px;
  }
  padding: 0px 0 5px !important;
  min-width: 100% !important;
  max-width: 100% !important;
  width: 100% !important;
}
/deep/.field__label-div {
  flex: unset;
  // padding-left: 10px!important;
}
/deep/.form-staff-item .avatar-wrapper {
  width: 24px;
  height: 24px;
  min-width: 24px;
}
/deep/.form-staff-item {
  min-height: 24px;
}
/deep/ .field__control {
  flex-grow: 1;
  position: relative;
  min-width: 10px;

  & > div {
    line-height: 22px;
  }

  // &--selectOrg {
  //   overflow: hidden !important;
  // }
}
.edit {
  .dropdown,
  .relevanceform,
  .relevanceformex {
    line-height: 0.99;
  }
}

.ant-col > div.field.vertical {
  display: block;
}

.ant-col > div.field.vertical .field__label {
  font-size: 12px;
  // font-weight:600;
  height: 22px;
  line-height: 22px;
  width: 100%;
  max-width: 100%;
  padding-top: 0;
  padding-bottom: 0;
  min-height: 22px;
  margin: 0 0 4px;
  // margin-left: 12px;
  .field__label-div {
    flex: unset;
  }
}

.query-form .ant-col > div.field.vertical {
  display: flex;
  display: -webkit-box;
}

.query-form .ant-col > div.field.vertical .field__label {
  min-width: 1em;
  max-width: 6em;
  font-size: 12px;
  font-weight: 400;
  margin-left: 0;
}
.field__control.detail {
  margin-left: 12px;
}
/deep/.approval_label {
  height: 100%;
  align-items: baseline !important;
}
.form-sheet {
  .h3-panel {
    margin-bottom: 0;
    /deep/.h3-panel-body {
      padding: 0;
    }
  }
}
</style>

<style>
.description .collapsed.vertical {
  padding-left: 14px;
}
</style>
