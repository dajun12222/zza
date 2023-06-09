<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <h3-panel
    v-show="display"
    :title="label"
    :tips="tips"
    :collapsible="true"
    :align="align"
    :vertical="layoutType"
    :collapsed="collapse"
    :labelStyle="style"
    :iconRight="true"
  >
    <slot></slot>
  </h3-panel>
</template>

<script lang="ts">
import common from 'cloudpivot/common/pc';
import { ControlPropertyChange, PropertyNames } from 'cloudpivot-forms';
import { Component, Inject, Prop } from 'vue-property-decorator';
import { BaseControl } from '../../controls';
import {
  DesignLayoutControl,
  GroupTitleOptions,
  RendererFormControl,
} from '../../typings';
import { FormRendererHelper } from '../form-renderer-helper';

@Component({
  name: 'form-group',
  components: {
    H3Panel: common.components.Panel,
  },
})
export default class FormGroup extends BaseControl<GroupTitleOptions> {
  @Prop() isMobile!: boolean;

  display = true;

  taskRef: any;

  get align() {
    return this.controlOpts.align;
  }

  get collapse() {
    const expand = this.controlOpts.expand;
    if (typeof expand === 'boolean') {
      return !expand;
    }
    return false;
  }

  get tips() {
    if (this.isMobile) {
      return '';
    }
    const { tips } = this.control.options;
    return tips;
  }

  @Inject()
  layoutTypeFn?: () => void;

  get layoutType() {
    if (this.layoutTypeFn) {
      return this.layoutTypeFn();
    }
  }

  setControl() {
    if (this.controlOpts.displayFormula) {
      const ctrl = this.findController(this.control.key);

      if (ctrl) {
        this.display = ctrl.display;
        this.subscribePropertyChange((change: ControlPropertyChange) => {
          if (change.name === PropertyNames.Display) {
            this.display = change.value;
          }
        });
      }
    } else {
      this.display = !this.allChildrenHiddn();
    }
  }

  allChildrenHiddn() {
    const children = (this.control as any as DesignLayoutControl).children;
    if (children && children.length > 0) {
      const formControls: RendererFormControl[] = [];
      FormRendererHelper.findFormControl(children, formControls);
      const result = formControls.every((c) => {
        let ctrl = c.controller;
        if (!ctrl) {
          ctrl = this.findController(c.key);
        }
        if (ctrl) {
          return !ctrl.display;
        }
        return false;
      });
      return result;
    }
    return true;
  }

  mounted() {
    this.taskRef = setInterval(() => {
      this.display = !this.allChildrenHiddn();
    }, 500);
  }

  destroyed() {
    clearInterval(this.taskRef);

    super.destroyed();
  }
}
</script>

<style lang="less">
// .h3-panel > .h3-panel-header {
//   height: 56px;
//   line-height: 40px;

//   & > span {
//     font-size: 18px;
//     font-weight: 500;
//     color: rgba(0, 0, 0, 0.85);
//   }
// }
</style>
