<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <h3-datetime
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
    :value="val"
    :show="showModal"
    :labelStyle="styleObj"
    :class="{ dataVertical: layoutType }"
    :tip="controlOpts.tips"
    @on-show="show"
    @on-hide="close"
    @on-clear="clearVal"
    @onConfirm="onConfirm"
  />
</template>

<script lang="ts">
import { TimeInputControl } from 'cloudpivot-form/form/src/common/controls/input-controls/time-input-control';
import ControlBack from 'cloudpivot-form/form/src/common/directives/control-back';
import { ControlPropertyChange, TimeControl } from 'cloudpivot-forms';
import { H3Datetime, H3Input } from 'h3-mobile-vue';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { Component, Inject } from 'vue-property-decorator';

const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // 判断是否ios终端

@Component({
  name: 'mobile-input-time',
  components: {
    H3Input,
    H3Datetime,
  },
  directives: {
    ControlBack,
  },
})
export default class MobileInputTime extends TimeInputControl {
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

  onConfirm(value: any) {
    this.ctrl.value = moment(value, this.format || 'HH:mm:ss');
  }

  val: any = '';

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

  dateFormat(val: any) {
    if (moment.isMoment(val)) {
      return val.format(this.format || 'HH:mm:ss');
    } else {
      return val;
    }
  }

  setControl() {
    const _ctrl = this.ctrl as TimeControl;
    console.log({ ...this.ctrl });

    if (!_ctrl) {
      return;
    }

    if (_ctrl.value) {
      const val = _ctrl.value;
      if (moment.isMoment(val)) {
        this.val = val.format(this.format || 'HH:mm:ss');
      } else {
        this.val = val;
      }
    } else {
      this.val = '';
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
          default:
            break;
        }
      },
    );
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
