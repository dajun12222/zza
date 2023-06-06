<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="data-item">
    <!-- 节点超时策略及配置 -->
    <workflow-timeout-config
      :formDataItem="formDataItem"
      :data="timeoutConfig"
      :isSeted="timeoutConfigSeted"
      @backData="timeoutConfigBack"
      @deleteTimeoutConfig="deleteTimeoutConfig"
    />

    <property-widget label="表单锁策略">
      <template>
        <div slot="right" class="over-time-policy">
          <a-radio-group
            v-model="lockType"
            @change="(e) => selectTableLock(e.target.value)"
          >
            <a-radio
              v-for="(item, index) in tableLockSelectData"
              :key="index"
              :value="item.type"
            >
              {{ item.name }}
            </a-radio>
          </a-radio-group>
        </div>
      </template>
    </property-widget>
  </div>
</template>

<script lang="ts">
import { Select, Radio } from '@h3/antd-vue';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import EllipsisInput from '../base/ellipsisInput.vue';
import PropertyWidget from '../base/propertyWidget.vue';
import WorkflowTimeoutConfig from './workflowTimeoutConfig.vue';
import {
  TimeoutStrategy,
  TimeoutNotifyStrategy,
  TimeoutNotifyType,
  getDefaultActivityTimeoutConfig,
} from '../modals/timeoutConfig/type';

const WorkflowModule = namespace('Apps/Workflow');
import IsSeted from '../base/is-seted.vue';

@Component({
  name: 'ActivitySenior',
  components: {
    PropertyWidget,
    EllipsisInput,
    ASelect: Select,
    ASelectOption: Select.Option,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    IsSeted,
    WorkflowTimeoutConfig,
  },
})
export default class ActivitySenior extends Vue {
  @WorkflowModule.State((state) => state.selectedActivities[0] || {})
  currentActivity: any;

  @WorkflowModule.State('curActivityProps') curActivityProps: any;

  @WorkflowModule.State('WorkflowDataItem_all') WorkflowDataItem_all: any;

  @WorkflowModule.Mutation('setPropValue') setPropValue: any;

  showModal: boolean = false;

  lockType: string = 'NONE';

  tableLockSelectData: any = [
    {
      name: '不执行锁定',
      type: 'NONE',
    },
    // {
    //   name: "打开表单时锁定",
    //   type: "1",
    // },
    {
      name: '提交表单时锁定',
      type: 'SUBMIT',
    },
  ];

  timeoutConfigSeted: boolean = false;

  timeoutConfig: any = getDefaultActivityTimeoutConfig();

  formDataItem: any = null;

  beforeMount() {
    this.dataMounted();
  }

  // 限时弹窗提交事件
  timeoutConfigBack(timeoutConfig: any) {
    if (timeoutConfig.timeoutCondition) {
      this.timeoutConfigSeted = true;
    }
    const objLength = Object.keys(this.curActivityProps.activitySenior).length;
    if (objLength) {
      // if (
      //   (time.processTime && this.timeoutCondition === 'post_node') ||
      //   (time.formId && this.timeoutCondition === 'in_form') ||
      //   time.enable
      // ) {
      //   this.timeoutTime = '已设置';
      // } else {
      //   this.timeoutTime = '';
      // }
      // this.timeItems = {
      //   processTime: time.processTime,
      //   formId: time.formId,
      //   enable: time.enable,
      //   timeConfig: time.timeConfig,
      //   timeoutWarning1: time.timeoutWarning1,
      //   timeoutWarning2: time.timeoutWarning2,
      // };
      this.timeoutConfig = timeoutConfig;
      Object.keys(timeoutConfig).forEach((attr) => {
        this.setPropValue({
          key: 'activitySenior.' + attr,
          value: timeoutConfig[attr],
        });
      });
    }
  }

  // 时间毫秒数转时间段
  msecToTimeSpan(msec: number) {
    if (msec) {
      const days = Math.floor(msec / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (msec % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((msec % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((msec % (1000 * 60)) / 1000);
      return `${days}天${hours}小时${minutes}分${seconds}秒`;
    }
    return '';
  }

  selectTableLock(value: any) {
    this.setPropValue({ key: 'activitySenior.lockType', value });
  }

  // 根据数据初始化视图
  dataMounted() {
    this.formDataItem = this.WorkflowDataItem_all.filter(
      (i: any) =>
        i.propertyType === 3 &&
        (i.code === 'modifiedTime' ||
          i.code === 'createdTime' ||
          i.format === 'YYYY-MM-DD' ||
          i.format === 'YYYY-MM-DD HH:mm' ||
          i.format === 'YYYY-MM-DD HH:mm:ss'),
    );

    if (Object.keys(this.curActivityProps.activitySenior).length) {
      const activitySeniorArray = Object.entries(
        this.curActivityProps.activitySenior,
      );
      this.lockType = this.curActivityProps.activitySenior.lockType || 'NONE';
      const activitySenior: any = this.curActivityProps.activitySenior;
      if (activitySenior.timeoutCondition) {
        this.timeoutConfigSeted = true;
        this.timeoutConfig = {
          timeoutCondition: activitySenior.timeoutCondition,
          allowedTime: activitySenior.allowedTime,
          timeoutTime: activitySenior.timeoutTime,
          timeoutStrategy: activitySenior.timeoutStrategy,
          timeoutNotifyStrategies: activitySenior.timeoutNotifyStrategies,
          timeoutNotifyTypes: activitySenior.timeoutNotifyTypes,
          timeoutWarning1: activitySenior.timeoutWarning1,
          timeoutWarning1NotifyStrategies:
            activitySenior.timeoutWarning1NotifyStrategies,
          timeoutWarning2: activitySenior.timeoutWarning2,
          timeoutWarning2NotifyStrategies:
            activitySenior.timeoutWarning2NotifyStrategies,
          timeoutWarning3: activitySenior.timeoutWarning3,
          timeoutWarning3NotifyStrategies:
            activitySenior.timeoutWarning3NotifyStrategies,
          timeoutWarning4: activitySenior.timeoutWarning4,
          timeoutWarning4NotifyStrategies:
            activitySenior.timeoutWarning4NotifyStrategies,
          timeoutWarning5: activitySenior.timeoutWarning5,
          timeoutWarning5NotifyStrategies:
            activitySenior.timeoutWarning5NotifyStrategies,
        };
      } else {
        this.timeoutConfigSeted = false;
        this.timeoutConfig = getDefaultActivityTimeoutConfig();
      }

      //处理流程节点超时历史数据
      this.handleHistoryData(this.timeoutConfig);
    }
  }

  @Watch('currentActivity')
  onActivityChange(v: string) {
    this.dataMounted();
  }

  //处理流程节点超时历史数据
  handleHistoryData(timeoutConfig) {
    if (!timeoutConfig.timeoutNotifyStrategies) {
      timeoutConfig.timeoutNotifyStrategies = [
        TimeoutNotifyStrategy.NOTIFY_HANDLER,
      ];
    }
    if (
      timeoutConfig.timeoutWarning1 &&
      !timeoutConfig.timeoutWarning1NotifyStrategies
    ) {
      timeoutConfig.timeoutWarning1NotifyStrategies = [
        TimeoutNotifyStrategy.NOTIFY_HANDLER,
      ];
    }

    if (
      timeoutConfig.timeoutWarning2 &&
      !timeoutConfig.timeoutWarning2NotifyStrategies
    ) {
      timeoutConfig.timeoutWarning2NotifyStrategies = [
        TimeoutNotifyStrategy.NOTIFY_HANDLER,
      ];
    }

    if (timeoutConfig.timeoutStrategy === TimeoutStrategy.CIRCULATE_MANAGER) {
      timeoutConfig.timeoutStrategy = TimeoutStrategy.MARK_TIMEOUT;
      timeoutConfig.timeoutNotifyStrategies = [
        TimeoutNotifyStrategy.CIRCULATE_MANAGER,
      ];
    } else if (
      timeoutConfig.timeoutStrategy === TimeoutStrategy.NOTIFY_HANDLER
    ) {
      timeoutConfig.timeoutStrategy = TimeoutStrategy.MARK_TIMEOUT;
      timeoutConfig.timeoutNotifyStrategies = [
        TimeoutNotifyStrategy.NOTIFY_HANDLER,
      ];
      timeoutConfig.timeoutNotifyTypes = [
        TimeoutNotifyType.DINGTALK_WECHAT,
        TimeoutNotifyType.EMAIL,
      ];
    } else {
    }
  }

  deleteTimeoutConfig() {
    this.timeoutConfig = getDefaultActivityTimeoutConfig();
    this.timeoutConfigSeted = false;
    this.timeoutConfigBack({
      allowedTime: '0',
      timeoutStrategy: 'post_node',
      timeoutCondition: null,
      timeoutTime: {
        enable: false,
        formId: '',
        timeoutConfig: 'then',
      },
      timeoutWarning1: '0',
      timeoutWarning2: '0',
    });
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-admin-core/src/styles/color/colors.less';
.data-item {
  color: @nav-font-color;
}
.over-time-policy {
  width: 100%;
  /deep/.ant-radio-wrapper {
    padding: 8px 0;
    // width: 100%;
    color: @nav-font-color;
  }
  /deep/.ant-radio-group {
    display: flex;
    flex-wrap: wrap;
  }
  /deep/.ant-select {
    width: 100%;
  }
}
</style>
