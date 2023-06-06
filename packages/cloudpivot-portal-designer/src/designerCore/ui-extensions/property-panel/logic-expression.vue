<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="home">
    <a-input readOnly :value="formatText" @click="modalVisible = true">
      <a-icon slot="suffix" type="ellipsis" />
    </a-input>

    <a-modal v-model="modalVisible"> 这是一个逻辑表达式弹窗 </a-modal>
  </div>
</template>

<script lang="ts">
import {
  Component,
  // Prop, Vue, Watch, Inject,
  Mixins,
} from 'vue-property-decorator';

import { Modal, Input, Icon } from '@h3/antd-vue';

import { PropertyComponent } from '@cloudpivot-shared/ui-property-editor/extension';

// import * as forms from '@cloudpivot-shared/ui-engine-vue/schema';

@Component({
  components: {
    AInput: Input,
    AModal: Modal,
    AIcon: Icon,
  },
})
export default class LogicExpression extends Mixins(PropertyComponent) {
  modalVisible = false;

  options: any[] = [];

  loading = false;
}
</script>
