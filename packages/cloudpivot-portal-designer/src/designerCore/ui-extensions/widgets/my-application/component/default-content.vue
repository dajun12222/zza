<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="my-app-design-mode">
    <template v-if="runMode !== 'runtime'">
      <div class="text-area">
        <span class="icon aufontAll warning">&#xe99a;</span>
        <span>{{ $t('languages.common.workBenchInfo.tips1') }}</span>
      </div>
    </template>
    <template v-else>
      <div class="text-area-add">
        <span>{{ $t('languages.common.workBenchInfo.tips2') }}</span>
      </div>
      <a-button @click="openManageModal">
        <span class="icon aufontAll h-icon-all-plus"></span>
        {{ $t('languages.common.workBenchInfo.addApp') }}
      </a-button>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Popover, Button } from '@h3/antd-vue';
import AppIcon from './app-icon.vue';

@Component({
  components: {
    APopover: Popover,
    AppIcon,
    AButton: Button,
  },
})
export default class DefaultContent extends Vue {
  @Prop()
  runMode!: string;

  openManageModal() {
    this.$emit('openManageModal');
  }
}
</script>
<style lang="less" scoped>
.my-app-design-mode {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .text-area {
    background: #fffbe6;
    border-radius: 4px;
    border: 1px solid #ffe58f;
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    &-add {
      padding-bottom: 20px;
      color: rgba(17, 18, 24, 0.5);
    }
    .icon {
      color: #faad14;
      font-size: 14px;
      margin-right: 8px;
    }
  }
  /deep/button {
    border-radius: 2px;
    border: 1px solid #2970ff;
    span {
      color: #2970ff;
    }
  }
}
</style>
