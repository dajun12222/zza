<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div id="workflowPropertyWrapper" class="property-container">
    <a-collapse :bordered="false" :activeKey="['1', '2', '3', '4', '5']">
      <a-collapse-panel key="1" header="基础属性">
        <common-setting type="workflow" />
      </a-collapse-panel>

      <a-collapse-panel key="2" header="流程超时配置">
        <workflow-timeout-config
          :isWorkflowAttr="true"
          :formDataItem="formDataItem"
          :data="timeoutConfig"
          :isSeted="timeoutConfigSeted"
          @backData="timeoutConfigBack"
          @deleteTimeoutConfig="deleteTimeoutConfig"
        />
      </a-collapse-panel>

      <a-collapse-panel key="3" header="流程事件">
        <workflow-event />
      </a-collapse-panel>

      <a-collapse-panel v-if="workflowData.todoDataItems !== undefined" key="4">
        <div slot="header" class="custom-collapse-panel-header">
          <span>流程消息通知</span>
          <a-tooltip>
            <template slot="title">
              <div>可定义流程流转到各节点时，审批人接收到的信息</div>
            </template>
            <span class="icon aufontAll h-icon-all-question-circle"></span>
          </a-tooltip>
          <div @click.stop="toSetNotification">消息管理</div>
        </div>
        <notificationNew :todoItems="todoItems" @change="todoItemsChange" />
      </a-collapse-panel>

      <a-collapse-panel key="5" header="流程发起配置">
        <flowStartConfig />
      </a-collapse-panel>

      <a-collapse-panel key="6" class="unset-overflow" header="流程运维特权人">
        <setPrivilege />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts">
import { Collapse, Tooltip } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import activityEvent from './property/activityEvent.vue';
import commonSetting from './property/commonSetting.vue';
import workflowEvent from './property/workflowEvent.vue';
import flowStartConfig from './property/flowStartConfig.vue';
import WorkflowTimeoutConfig from './/property/workflowTimeoutConfig.vue';
import setPrivilege from 'cloudpivot-admin-core/src/components/apps/workflowSetting/set-privilege.vue';
import notificationNew from './property/notification-new.vue';
import { namespace } from 'vuex-class';
import {
  TimeoutStrategy,
  TimeoutNotifyStrategy,
  TimeoutNotifyType,
  getDefaultWorkflowTimeoutConfig,
} from './modals/timeoutConfig/type';
const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'WorkflowProperty',
  components: {
    commonSetting,
    activityEvent,
    workflowEvent,
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
    flowStartConfig,
    setPrivilege,
    notificationNew,
    WorkflowTimeoutConfig,
    ATooltip: Tooltip,
  },
})
export default class WorkflowProperty extends Vue {
  @Prop() data!: any;

  @WorkflowModule.State('workflowData') workflowData: any;

  @WorkflowModule.Mutation('setTodoDataItems') setTodoDataItems: any;

  @WorkflowModule.Mutation('setTimeoutConfig') setTimeoutConfig: any;

  @WorkflowModule.State('WorkflowDataItem_all') WorkflowDataItem_all: any;

  todoItems: any[] = [];

  formDataItem: any[] = [];

  timeoutConfig: any = getDefaultWorkflowTimeoutConfig();

  timeoutConfigSeted: boolean = false;

  @Watch('workflowData.todoDataItems')
  onChange(val) {
    if (val) {
      this.todoItems = JSON.parse(JSON.stringify(val));
    }
  }

  @Watch('WorkflowDataItem_all')
  onDataitemChange() {
    this.dataMounted();
  }

  @Watch('workflowData')
  onWorkflowDataChange() {
    if (this.workflowData.timeoutConfig) {
      this.timeoutConfigSeted = true;
      this.timeoutConfig = this.workflowData.timeoutConfig;
    } else {
      this.timeoutConfigSeted = false;
      this.timeoutConfig = getDefaultWorkflowTimeoutConfig();
    }
  }

  dataMounted() {
    this.formDataItem = this.WorkflowDataItem_all.filter(
      (i: any) =>
        i.propertyType === 3 &&
        (['modifiedTime', 'createdTime'].includes(i.code) ||
          ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD HH:mm:ss'].includes(
            i.format,
          )),
    );
  }

  todoItemsChange(vals) {
    this.todoItems = vals;
    this.setTodoDataItems(vals);
  }

  toSetNotification() {
    localStorage.setItem('integrationDefaultActiveKey', '5');

    window.open('/admin/#/system/integration-setting', '_blank');
  }

  timeoutConfigBack(timeoutConfig) {
    if (timeoutConfig) {
      this.timeoutConfigSeted = true;
    }
    this.setTimeoutConfig(timeoutConfig);
  }

  deleteTimeoutConfig() {
    this.timeoutConfig = getDefaultWorkflowTimeoutConfig();
    this.timeoutConfigSeted = false;
    this.setTimeoutConfig(null);
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-admin-core/src/styles/color/colors.less';
#workflowPropertyWrapper {
  padding-top: 10px;
}
.custom-collapse-panel-header {
  display: flex;
  justify-content: space-between;
  div {
    color: @primary-color;
    font-size: 13px;
    font-weight: 400;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  .h-icon-all-question-circle {
    position: absolute;
    left: 112px;
    top: 1px;
    font-size: 13px;
    color: rgba(17, 18, 24, 0.25);
    font-weight: 400;
  }
}

.property-container {
  height: 100%;
  width: 100%;
  /deep/.ant-collapse .ant-collapse-item {
    text-align: left;
    background: #fff;
  }
  /deep/.ant-collapse > .ant-collapse-item-active {
    border-bottom: 0;
    margin-bottom: 16px;
    .ant-collapse-content {
      overflow: unset;
    }
  }
  .ant-collapse-content-box {
    padding: 0;
  }
}

.property-container input {
  border: 0 !important;
  outline: none !important;
  &:focus {
    box-shadow: unset !important;
  }
}

.content-right {
  width: 100%;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.unset-overflow {
  /deep/.ant-collapse-content {
    overflow: unset;
  }
}
</style>
