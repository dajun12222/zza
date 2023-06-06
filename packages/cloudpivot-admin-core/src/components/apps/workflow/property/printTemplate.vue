<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="data-mapping-panel">
    <property-widget label="打印模板">
      <template slot="title-right">
        <a-switch v-model="switchValue" size="small" @change="enableChange" />
      </template>

      <template v-if="switchValue" slot="right">
        <a-select
          v-model="chooseMethod"
          style="width: 100%"
          placeholder="请选择"
          @change="chooseMethodChange"
        >
          <a-select-option :key="'ALL'"> 所有模板 </a-select-option>
          <a-select-option :key="'SPECIFIED'"> 指定模板 </a-select-option>
        </a-select>
        <a-select
          v-if="chooseMethod === 'SPECIFIED'"
          v-model="chooseCodes"
          mode="multiple"
          style="width: 100%"
          :placeholder="choosePlaceholder"
          :maxTagCount="2"
          :showSearch="false"
          :allowClear="true"
          :disabled="printTemplates.length === 0"
          class="print-template-select"
          @change="selectTemplate"
        >
          <a-select-option v-for="item in printTemplates" :key="item.code">
            {{ item.name }}
          </a-select-option>
          <template slot="maxTagPlaceholder">
            <div :title="hiddenStr">+{{ chooseCodes.length - 2 }}...</div>
          </template>
        </a-select>
      </template>
    </property-widget>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as WorkflowNamespace from 'cloudpivot-admin-core/src/typings/workflow';
import { namespace } from 'vuex-class';
import { Switch, Select } from '@h3/antd-vue';
import PropertyWidget from '../base/propertyWidget.vue';
import { listApi, listParams } from 'cloudpivot/api';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'PrintTemplate',
  components: {
    PropertyWidget,
    ASelect: Select,
    ASelectOption: Select.Option,
    ASwitch: Switch,
  },
})
export default class PrintTemplate extends Vue {
  @WorkflowModule.Mutation('setPropValue') setPropValue: any;

  @WorkflowModule.State('curActivityProps')
  curActivityProps?: WorkflowNamespace.curActivityProps;

  @WorkflowModule.State((state) => state.selectedActivities[0] || {})
  currentActivity: any;

  printTemplates: any[] = [];

  chooseCodes: any[] = [];

  chooseMethod: string = 'ALL';

  switchValue: boolean = true;

  get choosePlaceholder() {
    if (this.printTemplates.length === 0) {
      return '暂无模板，请前往表单设计-表单属性配置';
    } else {
      return '请选择打印模板';
    }
  }

  @Watch('currentActivity', { immediate: true })
  onActivityChange() {
    listApi
      .getConfirmIsPrint({
        schemaCode: this.schemaCode,
        sheetCode: this.activitySheetCode,
      })
      .then((res) => {
        if (res.errcode !== 0) {
          this.$message.error(res.errmsg as string, 3);
          return;
        }
        this.printTemplates = res.data.printSheetCodes.map((item) => {
          return {
            schemaCode: this.schemaCode,
            code: item.printTemplateCode,
            name: item.printTemplateName,
          };
        });
        if (
          this.curActivityProps.templateList &&
          this.curActivityProps.templateList.length > 0
        ) {
          this.chooseCodes = this.curActivityProps.templateList
            .map((item) => {
              if (
                this.printTemplates &&
                this.printTemplates.find((el) => el.code === item.code)
              ) {
                return item && item.code;
              }
            })
            .filter((item) => !!item);
        } else {
          this.chooseCodes = [];
        }
      });
    this.chooseMethod = this.curActivityProps.printBindType;
    this.switchValue = this.curActivityProps.settingPrint;
  }

  @Watch('activitySheetCode')
  onActivitySheetCodeChange() {
    this.selectTemplate([]);
    this.enableChange(true);
    this.chooseMethodChange('ALL');
    this.onActivityChange();
  }

  selectTemplate(selectedItems) {
    const chooseItems = selectedItems.map((item) => {
      return this.printTemplates.find((el) => el.code === item);
    });
    this.setPropValue({
      key: 'templateList',
      value: chooseItems,
    });
  }

  enableChange(value) {
    this.setPropValue({
      key: 'settingPrint',
      value,
    });
  }

  chooseMethodChange(value) {
    this.setPropValue({
      key: 'printBindType',
      value: value,
    });
  }

  get schemaCode() {
    return this.$route.params?.bizSchemaCode;
  }

  get activitySheetCode() {
    return this.curActivityProps?.commonSettings?.sheetCode;
  }

  get hiddenStr() {
    if (this.chooseCodes.length < 3) {
      return '';
    } else {
      return this.chooseCodes
        .filter((item, index) => index >= 2)
        .map((item) => this.printTemplates.find((el) => el.code === item).name)
        .reduce((prev, cur) => prev + cur + '、', '')
        .slice(0, -1);
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.property-right {
  display: block;
  > div:first-child {
    margin-bottom: 4px;
  }
}
/deep/.ant-select-selection--multiple {
  .ant-select-selection__choice__content {
    max-width: 60px;
  }
  .ant-select-selection__rendered {
    margin-right: 0;
  }
}
/deep/.print-template-select {
  &.ant-select-disabled .ant-select-selection {
    background: #f1f2f6;
    .ant-select-selection__placeholder {
      color: rgba(17, 18, 24, 0.5);
    }
  }
}
</style>
