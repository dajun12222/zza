<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="timeout-early-warning">
    <div
      v-for="(item, index) in timeoutWarnings"
      :key="index"
      class="early-warning-wrap"
    >
      <div class="warning-content">
        <div class="warning-time">
          <span class="before-warn">超时前</span>
          <a-input-number
            v-model="item.dayValue"
            :disabled="
              !(
                processTime.dayValue ||
                (timeoutConfig.timeoutCondition === 'in_form' &&
                  timeoutConfig.timeoutTime.timeConfig === 'then')
              )
            "
            :min="0"
            :precision="0"
          />
          <span class="warn-unit-text">天</span>
          <a-input-number
            v-model="item.hourValue"
            :disabled="
              !(
                processTime.dayValue ||
                processTime.hourValue ||
                (timeoutConfig.timeoutCondition === 'in_form' &&
                  timeoutConfig.timeoutTime.timeConfig === 'then')
              )
            "
            :min="0"
            :max="23"
            :precision="0"
          />
          <span class="warn-unit-text">时</span>
          <a-input-number
            v-model="item.minuteValue"
            :min="0"
            :disabled="
              !(
                processTime.dayValue ||
                processTime.hourValue ||
                processTime.minuteValue ||
                (timeoutConfig.timeoutCondition === 'in_form' &&
                  timeoutConfig.timeoutTime.timeConfig === 'then')
              )
            "
            :max="59"
            :precision="0"
          />
          <span class="warn-unit-text">分</span>
          <a-input-number
            v-model="item.secondValue"
            :disabled="
              !(
                processTime.dayValue ||
                processTime.hourValue ||
                processTime.minuteValue ||
                processTime.secondValue ||
                (timeoutConfig.timeoutCondition === 'in_form' &&
                  timeoutConfig.timeoutTime.timeConfig === 'then')
              )
            "
            :min="0"
            :max="59"
            :precision="0"
          />
          <span class="warn-unit-text">秒，第 {{ index + 1 }} 次通知</span>
        </div>
        <div class="warning-people">
          <span class="message-notify">预警通知</span>
          <a-select
            v-model="item.notify"
            mode="multiple"
            :showArrow="true"
            placeholder="请选择"
            class="strategy-select"
          >
            <a-select-option
              v-for="people in timeoutNotify"
              :key="people.value"
            >
              {{ people.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="delete-icon">
        <span
          class="icon aufontAll h-icon-all-delete-o1"
          @click="deleteWarning(index)"
        ></span>
      </div>
    </div>
    <div
      class="add-early-warning"
      :class="{
        disabled: timeoutWarnings.length === 5,
      }"
      @click="addWarning"
    >
      <span class="icon aufontAll h-icon-all-plus-o"></span>
      <span class="add-text">添加预警时间</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { InputNumber, Select } from '@h3/antd-vue';
import TimeoutConifg from './type';
import {
  TimeoutStrategy,
  TimeoutNotifyStrategy,
  TimeoutNotifyType,
  timeSpanToMsec,
  msecToTime,
} from './type';
@Component({
  name: 'TimeoutEarlyWarning',
  components: {
    AInputNumber: InputNumber,
    ASelect: Select,
    ASelectOption: Select.Option,
  },
})
export default class TimeoutEarlyWarning extends Vue {
  @Prop()
  timeoutConfig!: TimeoutConifg;

  @Prop()
  timeoutTimeStamp!: any;

  @Prop()
  processTime!: any;

  timeoutWarnings: any[] = [];

  timeoutNotify: any[] = [
    {
      label: '通知处理人',
      value: TimeoutNotifyStrategy.NOTIFY_HANDLER,
    },
    {
      label: '通知发起人',
      value: TimeoutNotifyStrategy.NOTIFY_ORIGINATOR,
    },
    {
      label: '传阅处理人的上一级主管',
      value: TimeoutNotifyStrategy.CIRCULATE_MANAGER,
    },
    {
      label: '通知特权人',
      value: TimeoutNotifyStrategy.NOTIFY_WORKFLOWADMIN,
    },
  ];

  @Watch('timeoutConfig', { immediate: true })
  onTimeoutConfig() {
    if (this.timeoutConfig) {
      this.timeoutWarnings.length = 0;
      Array(5)
        .fill('')
        .some((item, index) => {
          const time = this.timeoutConfig['timeoutWarning' + (index + 1)];
          if (time !== null) {
            this.timeoutWarnings.push(
              Object.assign(
                msecToTime(
                  Number(this.timeoutConfig['timeoutWarning' + (index + 1)]),
                ),
                {
                  notify:
                    this.timeoutConfig[
                      'timeoutWarning' + (index + 1) + 'NotifyStrategies'
                    ],
                },
              ),
            );
          } else {
            return true;
          }
        });
    }
  }

  addWarning() {
    if (this.timeoutWarnings.length === 5) {
      return;
    }
    this.timeoutWarnings.push({
      dayValue: '0',
      hourValue: '0',
      minuteValue: '0',
      secondValue: '0',
      notify: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
    });
  }

  deleteWarning(index) {
    this.timeoutWarnings.splice(index, 1);
    //如果删除最后一条超时预警通知，超市预警开关自动关闭
    if (this.timeoutWarnings.length === 0) {
      this.timeoutConfig.timeoutTime.enable = false;
    }
  }

  //超时时间校验
  //1. 超时预警时间必须小于超时时间
  //2. 第n次预警时间必须小于第n-1次预警时间
  checkTimeError() {
    const warningTimeStamps = [];
    this.timeoutWarnings.forEach((item, index) => {
      warningTimeStamps.push(timeSpanToMsec(item));
    });
    if (
      this.timeoutConfig.timeoutCondition === 'post_node' &&
      this.timeoutTimeStamp <=
        warningTimeStamps.reduce((prev, cur) => {
          return prev > cur ? prev : cur;
        })
    ) {
      this.$message.warning('超时设置不合理，要求超时时间>超时预警！');
      return true;
    }

    if (
      Array(4)
        .fill('')
        .some((item, index) => {
          if (warningTimeStamps[index] <= warningTimeStamps[index + 1]) {
            this.$message.warning(
              `超时预警设置不合理，要求超时预警通知${index + 1} > 超时预警通知${
                index + 2
              }！`,
            );
            return true;
          }
        })
    ) {
      return true;
    }
    return false;
  }

  dataBack() {
    if (this.checkTimeError()) {
      return false;
    }
    //为了防止旧数据没有被新数据完全覆盖，先将旧数据值为初始值，再使用
    //新数据进行覆盖
    Object.assign(this.timeoutConfig, {
      timeoutWarning1: '0',
      timeoutWarning1NotifyStrategies: [TimeoutNotifyStrategy.NOTIFY_HANDLER],
      timeoutWarning2: null,
      timeoutWarning2NotifyStrategies: [],
      timeoutWarning3: null,
      timeoutWarning3NotifyStrategies: [],
      timeoutWarning4: null,
      timeoutWarning4NotifyStrategies: [],
      timeoutWarning5: null,
      timeoutWarning5NotifyStrategies: [],
    });
    this.timeoutWarnings.forEach((item, index) => {
      this.timeoutConfig['timeoutWarning' + (index + 1)] =
        timeSpanToMsec(item) + '';
      this.timeoutConfig['timeoutWarning' + (index + 1) + 'NotifyStrategies'] =
        item.notify;
    });
    return true;
  }
}
</script>

<style lang="less" scoped>
.timeout-early-warning {
  .early-warning-wrap {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .warning-content {
      flex: 1;
      background: #f4f5f8;
      border-radius: 2px;
      padding: 16px 12px;
      .warning-time {
        padding-bottom: 16px;
        .before-warn {
          padding-right: 22px;
          vertical-align: text-top;
        }
        .warn-unit-text {
          padding: 0 8px;
          vertical-align: text-top;
        }
        .ant-input-number {
          width: 50px;
        }
      }
      .warning-people {
        display: flex;
        .message-notify {
          padding: 6px 8px 6px 0;
        }
        .ant-select {
          flex: 1;
        }
      }
    }
    .delete-icon {
      padding-left: 12px;
      .icon {
        font-size: 18px;
        color: rgba(17, 18, 24, 0.5);
      }
    }
  }
  .add-early-warning {
    color: #2970ff;
    &.disabled {
      color: rgba(17, 18, 24, 0.25);
    }
    .icon {
      font-size: 14px;
      padding-right: 8px;
    }
  }
}
</style>
