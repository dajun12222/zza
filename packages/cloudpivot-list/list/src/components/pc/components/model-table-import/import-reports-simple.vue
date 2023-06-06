<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="import-reports-simple"
    :class="{
      'show-simple': show,
      'hidden-simple': !show,
    }"
  >
    <div class="header">
      <span
        class="icon aufontAll h-icon-all-close"
        @click="closeReports"
      ></span>
    </div>
    <div class="content">
      <div v-for="(report, index) in tasks" :key="index" class="report-detail">
        <div class="text">
          <span class="filename">{{ report.fileName }}</span>
          <span>
            <span class="icon aufontAll" :class="getIconClass(report)"></span>
            <span class="format-info">{{ format(report) }}</span>
          </span>
        </div>
        <a-progress
          :percent="report.percent"
          :status="formatStatus(report)"
          :showInfo="false"
        />
      </div>
    </div>
    <div class="footer">
      <span>{{ $t('cloudpivot.list.pc.importRecord.simpleImportTips1')
        }}<span class="jump-to-reports" @click="jumpToReports">{{
          $t('cloudpivot.list.pc.importRecord.importRecords')
        }}</span>{{ $t('cloudpivot.list.pc.importRecord.simpleImportTips2') }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Table, Tooltip, Popover, Progress } from '@h3/antd-vue';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { listApi } from 'cloudpivot/api';
import { namespace } from 'vuex-class';

const WorkflowCenterModule = namespace('WorkflowCenter/WorkflowCenter');

@Component({
  name: 'ImportsReportsSimple',
  components: {
    ATable: Table,
    ATableColumn: Table.Column,
    ATooltip: Tooltip,
    APopover: Popover,
    AProgress: Progress,
  },
})
export default class ImportsReportsSimple extends Vue {
  @WorkflowCenterModule.State('tasks')
  tasks: any;

  @WorkflowCenterModule.Mutation('clearTasks')
  clearTasks: any;

  @Prop()
  show: any;

  intervals: any = [];

  reports = [];

  format(report) {
    switch (report.status) {
      case 'RUN':
        return 80 + '%';
      case 'CHECK_ERROR':
        return this.$t('cloudpivot.list.pc.verifyError') as string;
      case 'FAIL':
      case 'EXCEPTION':
        return this.$t('cloudpivot.list.pc.ImportFailed') as string;
      case 'SUCCESS':
        return this.$t('cloudpivot.list.pc.ImportSuccess') as string;
      case 'INIT':
        return this.$t('cloudpivot.list.pc.Queuing') as string;
      case 'END':
        return this.$t('cloudpivot.list.pc.ImportFinished') as string;
      default:
        break;
    }
  }

  getIconClass(report) {
    switch (report.status) {
      case 'END':
        return 'h-icon-all-check-circle';
      case 'INIT':
        return 'h-icon-all-clock-circle';
      case 'CHECK_ERROR':
      case 'FAIL':
      case 'EXCEPTION':
        return 'h-icon-all-close-circle';
      case 'SUCCESS':
        return 'h-icon-all-check-circle';
      default:
        break;
    }
  }

  formatStatus(report) {
    if (['CHECK_ERROR', 'FAIL', 'EXCEPTION'].includes(report.status)) {
      return 'exception';
    }
  }

  jumpToReports() {
    this.$emit('jump');
  }

  closeReports() {
    this.clearTasks();
    this.intervals.forEach((interval, index) => {
      clearInterval(interval);
      this.intervals[index] = false;
    });
    this.$emit('close');
  }

  @Watch('show')
  onShowChange(value) {
    if (value) {
      this.intervals = this.tasks.map((task: any) => {
        //只有状态为正在导入和排队中的导入任务需要在初始化时开启轮询
        if (['RUN', 'INIT'].includes(task.status)) {
          return setInterval(() => {
            this.getImportProgress(task.taskId);
          }, 5000);
        }
      });

      //设置定时任务5分钟;
      this.intervals.forEach((interval, index) => {
        //初始化后intervals中存在为false的值，不需要设置超时定时器
        if (interval) {
          setTimeout(() => {
            if (this.intervals[index]) {
              clearInterval(interval);
              this.$message.error('连接超时');
            }
          }, 300000);
        }
      });
    }
  }

  async getImportProgress(taskId?: string) {
    const res = await listApi.getImportingProgress({ taskId });
    if (res.errcode === 0) {
      if (res.data.operationResult) {
        const index = this.tasks.findIndex((item) => item.taskId === taskId);
        clearInterval(this.intervals[index]);
        this.intervals[index] = false;
        this.handleTaskInfoChange(index, res.data);
      }
    }
  }

  handleTaskInfoChange(index, data) {
    this.$set(
      this.tasks,
      index,
      Object.assign(this.tasks[index], { status: data.taskStatus }),
    );

    if (data.taskStatus === 'INIT') {
      this.$set(
        this.tasks,
        index,
        Object.assign(this.tasks[index], { percent: 0 }),
      );
    } else if (data.taskStatus === 'END') {
      this.$set(
        this.tasks,
        index,
        Object.assign(this.tasks[index], { percent: 100 }),
      );
    } else {
    }

    //有数据成功导入时，刷新模型数据列表
    if (data.successCount > 0) {
      this.$emit('successImport');
    }
  }

  destroyed() {
    this.intervals.forEach((interval) => {
      if (interval) {
        clearInterval(interval);
      }
    });
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.import-reports-simple {
  background: #fff;
  padding-bottom: 16px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  .header {
    background: rgba(41, 112, 255, 0.2);
    direction: rtl;
    padding-right: 8px;
    height: 24px;
    .icon {
      font-size: 12px;
      color: rgba(17, 18, 24, 0.5);
      cursor: pointer;
    }
  }
  .content,
  .footer {
    padding: 0 16px;
  }

  .content {
    max-height: 166px;
    overflow: auto;
    .report-detail {
      padding-top: 14px;
      &:last-child {
        padding-bottom: 16px;
      }
      .text {
        font-size: 12px;
        line-height: 20px;
        color: #111218;
        display: flex;
        justify-content: space-between;
        .filename {
          display: inline-block;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .icon {
          font-size: 12px;
          padding-right: 4px;
          &.h-icon-all-close-circle {
            color: #f0353f;
          }
          &.h-icon-all-check-circle {
            color: #00c293;
          }
          &.h-icon-all-clock-circle {
            color: rgba(17, 18, 24, 0.25);
          }
          &.h-icon-all-clock-circle {
            color: rgba(17, 18, 24, 0.25);
          }
        }
      }
    }
  }

  .footer {
    font-size: 12px;
    line-height: 20px;
    color: rgba(17, 18, 24, 0.5);
    .jump-to-reports {
      color: @highlightColor;
      cursor: pointer;
    }
  }
}

.import-reports-simple {
  visibility: hidden;
  opacity: 0;
  transition: all 3s ease 0;
}
.show-simple {
  animation: show 1s forwards 0.2s;
}

@keyframes show {
  to {
    visibility: visible;
    opacity: 1;
  }
}
</style>
