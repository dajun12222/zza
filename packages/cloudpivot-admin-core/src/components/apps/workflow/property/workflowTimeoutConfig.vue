<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="workflow-timeout-config"
    :class="{ 'node-attr': !isWorkflowAttr }"
  >
    <property-widget :label="widgetLabel">
      <template slot="title-right">
        <em
          class="icon aufontAll h-icon-all-setting-o"
          @click="openTimeoutConifgModal"
        ></em>
      </template>

      <template v-if="isSeted" slot="right">
        <is-seted
          value="已设置"
          :showDel="true"
          :showEllipsis="false"
          @click="openTimeoutConifgModal"
          @delete="deleteConfig"
        />
      </template>
    </property-widget>

    <timeout-config-modal
      v-model="showModal"
      :isWorkflowAttr="isWorkflowAttr"
      :formDataItem="formDataItem"
      :data="data"
      @backData="backData"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import PropertyWidget from '../base/propertyWidget.vue';
import TimeoutConfigModal from '../modals/timeoutConfig/index.vue';
import IsSeted from '../base/is-seted.vue';
import TimeoutConifg from '../modals/timeoutConfig/type';
const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'WorkflowTimeoutConfig',
  components: {
    PropertyWidget,
    TimeoutConfigModal,
    IsSeted,
  },
})
export default class WorkflowTimeoutConfig extends Vue {
  @Prop({ default: false })
  isWorkflowAttr!: boolean;

  @Prop()
  formDataItem!: any[];

  @Prop()
  data!: TimeoutConifg;

  @Prop()
  isSeted!: boolean;

  showModal: boolean = false;

  openTimeoutConifgModal() {
    this.showModal = true;
  }

  deleteConfig() {
    this.$emit('deleteTimeoutConfig');
  }

  get widgetLabel() {
    if (this.isWorkflowAttr) {
      return '超时策略及预警';
    } else {
      return '节点超时策略及预警';
    }
  }

  backData(timeoutConfig: TimeoutConifg) {
    this.$emit('backData', timeoutConfig);
  }
}
</script>

<style lang="less" scoped>
.node-attr {
  padding-bottom: 16px;
}
</style>
