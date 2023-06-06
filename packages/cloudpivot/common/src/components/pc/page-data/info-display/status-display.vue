<template>
  <div
    class="status-display"
    :style="{
      background: currentValueConfig.backgroundColor,
      color: currentValueConfig.fontColor,
      border: currentValueConfig.border || 'unset',
      'line-height': (currentValueConfig.border && '17px') || '19px',
      'border-radius': currentValueConfig.borderRadius || '2px',
      padding: currentValueConfig.padding || '0 4px 1px 4px',
    }"
  >
    {{ currentValueConfig.text || value }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
@Component({
  name: 'status-display',
  components: {},
})
export default class StatusDisplay extends Vue {
  @Prop()
  value!: any;

  @Prop()
  statusConfig!: any;

  /**
   * 获取当前状态下对应的配置
   */
  get currentValueConfig() {
    return this.statusConfig[this.value] || {};
  }
}
</script>

<style lang="less" scoped>
.status-display {
  font-size: 12px;
  font-weight: 400;
 // overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
