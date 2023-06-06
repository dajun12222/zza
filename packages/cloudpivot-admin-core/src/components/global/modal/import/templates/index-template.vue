<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-modal
    v-model="importVM.show"
    class="import-container"
    :title="importVM.modalTitle"
    :bodyStyle="{ maxHeight: '650px', overflow: 'auto' }"
    width="800px"
    destroyOnClose
    :maskClosable="false"
    :footer="null"
    :getPopupContainer="
      (triggerNode) => {
        return triggerNode.parentNode;
      }
    "
    @cancel="importVM.close"
  >
    <div class="import-layout">
      <div class="step-content">
        <slot name="file-upload"></slot>
        <slot name="file-validate"></slot>
        <slot name="file-import"></slot>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Modal, Steps, Button } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'Import',
  components: {
    AModal: Modal,
    ASteps: Steps,
    AStep: Steps.Step,
    AButton: Button,
  },
  template: '#index-template',
})
export default class ImportTemplate extends Vue {
  @Prop()
  importVM!: any;
}
</script>

<style lang="less">
.import-container {
  & .import-layout {
    min-height: 324px;
    position: relative;
    .steps {
      width: 50%;
      margin: 30px auto;
    }
  }
  .ant-modal-body {
    padding: 0;
  }
  .modal-footer {
    padding: 24px;
    text-align: right;
    background: transparent;
    border-radius: 0 0 4px 4px;
  }

  .modal-body {
    min-height: 324px;
    position: relative;
  }
}
</style>
