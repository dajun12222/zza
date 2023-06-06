<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div v-if="value" class="load-fail">
    <img src="./images/load-fail.png" alt />
    <p>{{ text }}</p>
    <a-button type="primary" class="reload-btn" @click="refresh">
      <a-icon type="reload" />{{ btnText }}
    </a-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { Button, Icon } from '@h3/antd-vue';

@Component({
  name: 'page-load-fail',
  components: {
    AButton: Button,
    AIcon: Icon,
  },
})
export default class PageLoadFail extends Vue {
  @Prop({ default: false }) value!: boolean;

  @Prop({ default: '内容加载失败' }) text!: string;

  @Prop({ default: '刷新' }) btnText!: string;

  refresh() {
    this.$emit('refresh');
  }
}
</script>

<style lang="less" scoped>
// @import '../../../styles/themes/default.less';
.load-fail {
  text-align: center;
  p {
    margin-bottom: @base4-padding-md;
  }
}
</style>
