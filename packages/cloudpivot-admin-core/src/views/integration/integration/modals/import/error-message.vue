<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <ErrorMessageTemplate :importVM="_self">
    <template slot="duplication-tips">
      <div class="status-tip">
        <p>
          1. 选择导入覆盖，按照以下规则：<br />
          当前系统和导入文件中都存在的业务方法：使用导入文件中的覆盖<br />
          当前系统已存在，且导入文件中不存在的业务方法：仍然保留<br />
          当前系统中未存在的业务方法：直接导入
        </p>
        <p>2. 修改编码再导入，将会生成新的服务方法</p>
      </div>
    </template>
  </ErrorMessageTemplate>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import MixinErrorMessage from '../../../../../components/global/modal/import/mixins/error-message';
import ErrorMessageTemplate from '../../../../../components/global/modal/import/templates/error-message-template.vue';

@Component({
  name: 'ErrorMessage',
  components: {
    ErrorMessageTemplate,
  },
})
export default class ErrorMessage extends mixins(MixinErrorMessage) {}
</script>
