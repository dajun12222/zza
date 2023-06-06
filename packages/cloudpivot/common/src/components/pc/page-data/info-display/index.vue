<template>
  <div :class="['workflow-info-display', config.type]">
    <span
      class="info-title"
      :style="{
        'min-width': (config.styles && config.styles.minTitleWidth) || '48px',
      }"
      :title="config.title"
    >
      {{ config.title }}：
    </span>
    <StatusDisplay
      v-if="config.type === 'status'"
      :value="value"
      :statusConfig="config.statusConfig"
    />
    <AuthorAvatarInfo
      v-else-if="config.type === 'person'"
      :item="value"
      style="overflow: hidden"
    />
    <TextDisplay v-else :value="value" />

    <template
      v-if="pageType === 1 && ['停留时间', 'Stay Time'].includes(config.title)"
    >
      <div v-if="data.workItemTimeoutStatus === 'TIMEOUT'" class="hint">
        {{ $t('cloudpivot.flowCenter.pc.overtime') }}
      </div>

      <div
        v-if="
          data.workItemTimeoutStatus === 'RED' ||
          data.workItemTimeoutStatus === 'ORANGE'
        "
        class="hint staytimeHint"
        :class="data.workItemTimeoutStatus === 'RED' ? 'red' : ''"
      >
        <a-tooltip placement="bottom">
          <template slot="title"> {{ data.stayTimeStrHint }} </template>
          {{ $t('cloudpivot.flowCenter.pc.aboutToTimeout') }}
        </a-tooltip>
      </div>
      <urge-info v-if="data.urgeCount > 0" :workflowOptions="data" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import StatusDisplay from './status-display.vue';
import TextDisplay from './text-display.vue';
import AuthorAvatarInfo from '../../author-avatar-info/author-avatar-info.vue';
import { Tooltip } from '@h3/antd-vue';
import UrgeInfo from './urge-info.vue';
@Component({
  name: 'info-display',
  components: {
    AuthorAvatarInfo,
    StatusDisplay,
    TextDisplay,
    UrgeInfo,
    ATooltip: Tooltip,
  },
})
export default class InfoDisplay extends Vue {
  @Prop()
  config!: any;

  @Prop()
  data!: any;

  @Prop()
  pageType!: any;

  /**
   * 值获取函数
   * 根据值类型和配置的映射关系获取值
   */
  get value() {
    if (this.config.valueType === 'string') {
      if (typeof this.config.valueMap === 'string') {
        return this.data[this.config.valueMap];
      } else if (Array.isArray(this.config.valueMap)) {
        let result = '';
        this.config.valueMap.some((attr) => {
          if (this.data[attr]) {
            result = this.data[attr];
            return true;
          }
        });
        return result;
      }
    } else if (this.config.valueType === 'object') {
      let obj = {};
      if (typeof this.config.valueMap === 'function') {
        obj = this.config.valueMap(this.data);
      } else if (Array.isArray(this.config.valueMap)) {
        this.config.valueMap.forEach((attr) => {
          obj[attr] = this.data.attr;
        });
      } else if (typeof this.config.valueMap === 'object') {
        Object.keys(this.config.valueMap).forEach((key) => {
          if (typeof this.config.valueMap[key] === 'string') {
            obj[key] = this.data[this.config.valueMap[key]];
          } else if (Array.isArray(this.config.valueMap[key])) {
            this.config.valueMap[key].some((attr) => {
              if (this.data[attr]) {
                obj[key] = this.data[attr];
                return true;
              }
            });
          }
        });
      }
      return obj;
    } else {
      //后续扩展类型
    }
  }
}
</script>

<style lang="less" scoped>
.workflow-info-display {
  width: 33%;
  display: flex;
  align-items: center;
  position: relative;
  height: 50%;
  padding: 6px 20px 6px 0;
  .info-title {
    font-size: 12px;
    font-weight: 400;
    color: rgba(17, 18, 24, 0.5);
    min-width: 48px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .hint {
    margin-left: 4px;
    color: #f0353f;
    font-size: 10px;
    padding: 1px 6px;
    background-color: #fdeae9;
    border-radius: 2px;
    transform: scale(0.8);
    white-space: nowrap;
    &.staytimeHint {
      background-color: #e5e5e5;
      color: #111218;
      &.red {
        background: #fcf1ce;
        color: #faad14;
      }
      &:hover {
        color: #faad14;
        background-color: #fcf1ce;
      }
    }
  }
}
</style>
