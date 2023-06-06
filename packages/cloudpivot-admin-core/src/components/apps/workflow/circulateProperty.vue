<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="property-container">
    <common-setting type="CIRCULATE" />
    <a-collapse :bordered="false" :activeKey="['1', '2', '3', '4', '5']">
      <!-- 一般属性 -->
      <!-- <a-collapse-panel key="1" header="基础属性">
        <common-setting type="CIRCULATE" />
      </a-collapse-panel> -->

      <a-collapse-panel key="1">
        <template slot="header">
          消息通知
          <a-tooltip>
            <template slot="title">
              <div>若节点与流程配置的消息模版不一</div>
              <div>样，将按节点的消息配置发送通知。</div>
            </template>
            <span class="icon aufontAll h-icon-all-question-circle"></span>
          </a-tooltip>
        </template>
        <notification type="CIRCULATE" />
      </a-collapse-panel>

      <!-- 参与者设置 -->
      <a-collapse-panel key="2" header="参与者">
        <participant type="CIRCULATE" />
      </a-collapse-panel>

      <!-- 数据权限 -->
      <a-collapse-panel key="3" header="数据权限">
        <data-item type="PARTICIPANT" />
      </a-collapse-panel>

      <!-- 打印模板 -->
      <a-collapse-panel key="4">
        <div slot="header" class="custom-collapse-panel-header">
          <span>打印模板</span>
          <a-tooltip>
            <template slot="title">
              <div>可选择当前节点绑定的任务表单的打印模板</div>
            </template>
            <span
              class="icon aufontAll h-icon-all-question-circle print-tips-icon"
            ></span>
          </a-tooltip>
        </div>
        <print-template />
      </a-collapse-panel>

      <!-- 事件处理 -->
      <a-collapse-panel key="5" header="事件处理">
        <activity-event type="CIRCULATE" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script lang="ts">
import { Collapse, Tooltip } from '@h3/antd-vue';
import { Component, Vue } from 'vue-property-decorator';
import ActivityEvent from './property/activityEvent.vue';
import commonSetting from './property/commonSetting.vue';
import Notification from './property/notification.vue';
import Participant from './property/participant.vue';
import PrintTemplate from './property/printTemplate.vue';
import DataItem from './property/dataItem.vue';

@Component({
  name: 'CirculateProperty',
  components: {
    commonSetting,
    Participant,
    ActivityEvent,
    Notification,
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
    ATooltip: Tooltip,
    PrintTemplate,
    DataItem,
  },
})
export default class CirculateProperty extends Vue {}
</script>
<style lang="less" scoped>
.h-icon-all-question-circle {
  font-size: 13px;
  font-weight: 400;
  color: rgba(17, 18, 24, 0.25);
  padding-left: 6px;
}
</style>
