<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="integer-block">
    <a-input
      :ref="inputGuid"
      v-model="integerValue"
      v-form-item-validate="directiveValue"
      :class="{
        'input-box': dom !== 'a-textarea',
        'textarea-box': dom === 'a-textarea',
      }"
      :disabled="readonly"
      :placeholder="(options && options.placeholder) || ''"
      @input="onInput"
    />
    <div class="up">
      <span class="icon aufontAll h-icon-all-caret-up" @click="stepUp"></span>
    </div>
    <div class="down">
      <span
        class="icon aufontAll h-icon-all-caret-down"
        @click="stepDown"
      ></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Watch, Component } from 'vue-property-decorator';
import { Input } from '@h3/antd-vue';
import { formItemDirective } from 'cloudpivot-admin-core/src/directives/form-validate';

@Component({
  name: 'integer-rander',
  components: {
    AInput: Input,
  },
  directives: {
    'form-item-validate': formItemDirective,
  },
})
export default class IntegerRender extends Vue {
  @Prop()
  valueText: any;

  @Prop()
  readonly: any;

  @Prop()
  options: any;

  @Prop()
  inputGuid: any;

  @Prop()
  dom: any;

  @Prop()
  field: any;

  integerValue: string = '';

  directiveValue: any = {};

  @Watch('valueText', { immediate: true })
  onValueChange() {
    if (this.integerValue !== this.valueText + '') {
      this.integerValue = this.valueText + '';
    }
  }

  @Watch('integerValue')
  onIntegerValueChange() {
    if (this.options.regexps) {
      this.directiveValue = Object.assign(
        {
          key: this.inputGuid,
          value: this.integerValue,
        },
        this.options.regexps,
      );
    }
  }

  onInput(e: any) {
    this.integerValue = e.target.value;

    if (this.options.regexps && this.options.regexps.maxLength) {
      const maxChars: any = this.options.regexps.maxLength.len;
      if (this.integerValue.length > maxChars) {
        this.integerValue = e.target.value.substring(0, maxChars);
      }
    }

    if (this.field === 'regexpText') {
      try {
        const Text = this.valueText;
        const regexpText = JSON.parse(Text);
        regexpText[localStorage.getItem('locale') || 'zh'] = this.integerValue;
        this.integerValue = JSON.stringify(regexpText);
      } catch (error) {}
    }

    const formItemValidate = e.target._formItemValidate;
    if (formItemValidate) {
      this.$nextTick(() => {
        formItemValidate.validatedStatus().then((validatedStatus: boolean) => {
          if (validatedStatus) {
            this.submit(this.integerValue);
          }
        });
      });
    } else {
      this.submit(this.integerValue);
    }
  }

  submit(type?: any) {
    const integerValue = Number(this.integerValue.replace(/(^\s*)/g, '')); // 去除开头空格

    if (type === 'blur') {
      this.$emit('blur', integerValue);
    } else {
      this.$emit('change', integerValue);
      if (this.options.callback instanceof Function) {
        this.$emit('callback');
      }
    }
  }

  onBlur(e) {
    const formItemValidate = e.target._formItemValidate;
    if (formItemValidate) {
      this.$nextTick(() => {
        formItemValidate.validatedStatus().then((validatedStatus: boolean) => {
          if (validatedStatus) {
            this.submit('blur');
          }
        });
      });
    } else {
      this.submit('blur');
    }
  }

  async stepUp() {
    if (this.readonly) {
      return;
    }

    //最大值默认为200
    const max = this.options.max || 200;

    if (
      !isNaN(Number(this.integerValue)) &&
      Number(this.integerValue) <= max - 1
    ) {
      this.integerValue = Number(this.integerValue) + 1 + '';
    }

    const inputDom = (this.$refs[this.inputGuid] as any).$el;
    if (inputDom._formItemValidate) {
      const status = await inputDom._formItemValidate.validatedStatus();
      if (status) {
        this.submit();
      }
    } else {
      this.submit();
    }
  }

  async stepDown() {
    if (this.readonly) {
      return;
    }

    //最小值默认为1
    const min = this.options.min || 1;

    if (
      !isNaN(Number(this.integerValue)) &&
      Number(this.integerValue) >= min + 1
    ) {
      this.integerValue = Number(this.integerValue) - 1 + '';
    }

    const inputDom = (this.$refs[this.inputGuid] as any).$el;
    if (inputDom._formItemValidate) {
      const status = await inputDom._formItemValidate.validatedStatus();
      if (status) {
        this.submit();
      }
    } else {
      this.submit();
    }
  }
}
</script>

<style></style>
