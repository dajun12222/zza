<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <div class="attachment-box">
      <i class="icon aufontAll h-icon-all-upload-o"></i>{{ text }}
    </div>
    <a v-if="showTemp" class="attachment-link">附件模板下载</a>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';

@Component({
  name: 'h-attachment',
})
export default class HAttachment extends Vue {
  @Prop({
    default: '',
  })
  text!: string;

  @Prop({
    default: true,
  })
  displayTemplate!: boolean;

  showTemp: boolean = true;

  @Watch('displayTemplate', {
    immediate: true,
    deep: true,
  })
  displayTemplateChange(val: any) {
    this.showTemp = val;
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common';
.attachment-box {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  border: 1px solid @border-color;
  color: @light-color-2;
  padding: 0 15px;
  border-radius: @border-radius-base;
  height: 32px;
  line-height: 30px;
  background: #fff;

  i {
    font-size: @font-size-base;
    margin-right: @base4-padding-xs;
  }
}

.attachment-link {
  color: @primary-color;
  margin-left: 10px;
}
</style>
