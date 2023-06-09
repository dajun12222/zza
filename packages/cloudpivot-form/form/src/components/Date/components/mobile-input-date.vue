<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <template v-if="pickerMode">
      <!-- 月日  时分秒 时分 -->
      <h3-datetime
        v-model="timeValue"
        v-control-back
        :title="label"
        :required="ctrl.required"
        :readonly="readonlyFormula || readonly"
        :locale="locale"
        :cancelText="$t('cloudpivot.form.renderer.cancel')"
        :confirmText="$t('cloudpivot.form.renderer.ok')"
        :clearText="$t('cloudpivot.form.renderer.clear')"
        currentText
        :format="format"
        :show="showModal"
        :labelStyle="styleObj"
        :placeholder="placeholder"
        :class="{ dataVertical: layoutType }"
        :tip="controlOpts.tips"
        @on-show="show"
        @on-hide="close"
        @on-clear="clearVal"
        @onConfirm="onConfirm"
      />
    </template>
    <template v-else>
      <h3-datetime
        v-model="val"
        v-control-back
        :title="label"
        :required="ctrl.required"
        :readonly="readonlyFormula || readonly"
        :locale="locale"
        :cancelText="$t('cloudpivot.form.renderer.cancel')"
        :confirmText="$t('cloudpivot.form.renderer.ok')"
        :clearText="$t('cloudpivot.form.renderer.clear')"
        currentText
        :format="format"
        :startDate="min"
        :endDate="max"
        :show="showModal"
        :labelStyle="styleObj"
        :placeholder="placeholder"
        :class="{ dataVertical: layoutType }"
        :tip="controlOpts.tips"
        @on-show="show"
        @on-hide="close"
        @on-clear="clearVal"
        @onConfirm="onConfirm"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { ControlPropertyChange, DateControl } from 'cloudpivot-forms';
import { H3Datetime, H3Input } from 'h3-mobile-vue';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { Component, Inject } from 'vue-property-decorator';
import { DateInputControl } from 'cloudpivot-form/form/src/common/controls/input-controls/date-input-control';
import ControlBack from 'cloudpivot-form/form/src/common/directives/control-back';
import { dateFormatter } from 'cloudpivot-form/form/utils/date-formatter';

@Component({
  name: 'input-date',
  components: {
    H3Input,
    H3Datetime,
  },
  directives: {
    ControlBack,
  },
})
export default class InputDate extends DateInputControl {
  showModal: boolean = false;

  show() {
    this.showModal = true;
  }

  close() {
    this.showModal = false;
  }

  clearVal() {
    this.val = '';
    this.ctrl.value = null;
  }

  get pickerMode() {
    const type = ['MM-DD', 'HH:mm', 'HH:mm:ss'];
    return type.some((s) => s.indexOf(this.format) > -1);
  }

  get timeValue() {
    if (this.timePicker) {
      return this.val ? moment(this.val).format(this.format) : null;
    } else {
      return this.val;
    }
  }

  onConfirm(value: any) {
    const _this = this;
    // iOS兼容
    value = value.replace(/-/g, '/');
    if (/^\d{4}\/\d{2}$/.test(value)) {
      value += '/01';
    }
    if (this.timePicker) {
      value = `${moment(new Date()).format('YYYY/MM/DD')} ${value}`;
    }
    // 月日处理
    if (this.format === 'MM-DD') {
      value = `${moment(new Date()).format('YYYY')}/${value}`;
    }
    _this.ctrl.value = new Date(value);
  }

  val: any = '';

  min: any = '';

  max: any = '';

  subscription?: Subscription;

  @Inject()
  layoutTypeFn!: Function;

  //上下布局模式
  get layoutType() {
    if (this.layoutTypeFn) {
      return this.layoutTypeFn();
    }
  }

  getCalendarContainer(trigger: any) {
    return trigger;
  }

  dateFormat(val: Date) {
    return dateFormatter(val, 'YYYY-MM-DD HH:mm:ss').replace(/-/g, '/');
  }

  setMax(max: Date | null) {
    if (max) {
      // max.setHours(23);
      // max.setMinutes(59);
      // max.setSeconds(59);
      // max.setMilliseconds(999);

      // 当最大值只有年月日时，无法通过校验，需要设为当天最大值
      if (!~this.format.indexOf('HH')) {
        max = this.dateCtrl.max;
        if (
          max &&
          max.getHours() === 0 &&
          max.getMinutes() === 0 &&
          max.getMilliseconds() === 0
        ) {
          max.setHours(23);
          max.setMinutes(59);
          max.setSeconds(59);
          max.setMilliseconds(999);
        }
      }
    }
  }

  setMin(min: Date | null) {
    if (min) {
      if (this.format.indexOf('HH') > -1) {
        min = this.dateCtrl.min;
        if (
          min &&
          min.getHours() === 0 &&
          min.getMinutes() === 0 &&
          min.getMilliseconds() === 0
        ) {
          min.setHours(0);
          min.setMinutes(0);
          min.setSeconds(0);
          min.setMilliseconds(0);
        }
      }
    }
  }

  setControl() {
    this.initMinAndMax();
    const _ctrl = this.ctrl as DateControl;
    console.log({ ...this.ctrl });

    if (!_ctrl) {
      return;
    }

    if (_ctrl.value) {
      this.val = this.dateFormat(_ctrl.value);
    } else {
      this.val = '';
    }

    if (_ctrl.min) {
      this.setMin(_ctrl.min as any);
      this.min = this.dateFormat(_ctrl.min);
    }

    if (_ctrl.max) {
      this.setMax(_ctrl.max as any);
      this.max = this.dateFormat(_ctrl.max);
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }

    this.subscription = _ctrl.propertyChange.subscribe(
      (change: ControlPropertyChange) => {
        switch (change.name) {
          case 'value':
            if (change.value) {
              this.val = this.dateFormat(change.value);
            } else {
              this.val = '';
            }
            break;
          case 'min':
            if (change.value) {
              const _min = change.value as Date;
              this.setMin(_min);
              this.min = this.dateFormat(_min);
            } else {
              this.min = '';
            }
            break;
          case 'max':
            if (change.value) {
              const _max = change.value as Date;
              this.setMax(_max);
              this.max = this.dateFormat(_max);
            } else {
              this.max = '';
            }
            break;
          default:
            break;
        }
      },
    );
  }

  initMinAndMax() {
    const min = this.controlOpts.minDate;
    if (!min) {
      this.min = '1900-01-01';
      // this.min = "2000-01-01";
    } else {
      if (min.indexOf('{') === -1) {
        this.min = min;
      }
    }

    const max = this.controlOpts.maxDate;
    if (!max) {
      this.max = '2101-01-01';
    } else {
      if (max.indexOf('{') === -1) {
        this.max = max;
      }
    }
  }

  destroyed() {
    super.destroyed();

    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
</script>

<style lang="less">
.h3-field-box .h3-PR {
  text-align: left;
}
.dataVertical .h3-field-icon-wrapper {
  width: 22px;
  height: 22px;
  position: absolute;
  bottom: 10px;
  right: 15px;
  text-align: center;
  line-height: 22px;
}
</style>
