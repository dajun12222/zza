<template>
  <div v-if="value" class="load-fail">
    <img src="./images/load-fail.png" alt />
    <p>{{ text ? text : $t('cloudpivot.flowCenter.pc.loadFailedText') }}</p>
    <a-button type="primary" class="reload-btn" @click="refresh">
      <a-icon type="reload" />{{
        btnText ? btnText : $t('cloudpivot.flowCenter.pc.refresh')
      }}
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

  @Prop() text!: string;

  @Prop() btnText!: string;

  refresh() {
    this.$emit('refresh');
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/common';
.load-fail {
  text-align: center;
  p {
    margin-bottom: @base4-padding-md;
  }
}
</style>
