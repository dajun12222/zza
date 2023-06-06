<template>
  <a-popover
    placement="bottomLeft"
    overlayClassName="urge-info-popover"
    @visibleChange="visibleChange"
  >
    <template slot="content">
      <template v-if="!loading">
        <div v-if="workflowOptions.urgeCount > 1">
          {{
            $t('cloudpivot.cloudpivotCommon.pc.urgTips', {
              who: urgeInfo.urgeUserName,
              when: urgeInfo.opTime,
            })
          }}
        </div>
        <div v-else>
          {{
            $t('cloudpivot.cloudpivotCommon.pc.urgTips2', {
              who: urgeInfo.urgeUserName,
              when: urgeInfo.opTime,
            })
          }}
        </div>
        <div>{{ urgeInfo.text }}</div>
      </template>
      <template v-else>
        <div>
          <span class="icon aufontAll h-icon-all-loading-o"></span>
          {{ $t('cloudpivot.cloudpivotCommon.pc.loading2') }}
        </div>
      </template>
    </template>
    <div class="urge-info-popover-hint">
      {{ $t('cloudpivot.cloudpivotCommon.pc.urging') }}
      <span v-if="workflowOptions.urgeCount > 1">
        x
        {{ workflowOptions.urgeCount }}
      </span>
    </div>
  </a-popover>
</template>

<script lang="ts">
import { Popover } from '@h3/antd-vue';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { workflowApi } from 'cloudpivot/api';
@Component({
  name: 'urge-info',
  components: {
    APopover: Popover,
  },
})
export default class UrgeInfo extends Vue {
  @Prop()
  workflowOptions!: any;

  urgeInfo: any = {};

  loading: boolean = true;

  visibleChange(visible) {
    if (visible && this.loading) {
      const params = {
        instanceId: this.workflowOptions.instanceId,
        id: this.workflowOptions.id,
      };
      workflowApi.getLastUrgeInfo(params).then((res: any) => {
        if (res.errcode === 0) {
          this.urgeInfo = res.data;
        }
        this.loading = false;
      });
    }
  }
}
</script>

<style lang="less">
.urge-info-popover {
  padding-top: unset;
  .ant-popover-inner-content {
    max-width: 382px;
    min-width: 260px;
    color: #111218;
    font-size: 13px;
    padding: 5px 8px;
    line-height: 22px;
    word-break: break-all;
  }
  .h-icon-all-loading-o {
    color: #2970ff;
    font-size: 13px;
    line-height: 13px;
    padding-right: 6px;
    &::before {
      animation: spin 1s linear infinite;
      display: inline-block;
    }
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}

.urge-info-popover-hint {
  margin-left: 4px;
  color: #f0353f;
  font-size: 10px;
  padding: 1px 6px;
  background-color: #fdeae9;
  border-radius: 2px;
  transform: scale(0.8);
  &:hover {
    background-color: #ffb6b3;
  }
}
</style>
