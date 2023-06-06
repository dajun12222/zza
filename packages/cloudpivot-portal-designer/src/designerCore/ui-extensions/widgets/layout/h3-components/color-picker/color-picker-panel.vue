<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="color-picker-panel">
    <div
      class="origin-color"
      @click="itemClick('default')"
    >
      {{ $t('widgets.color.default') }}
    </div>
    <div>{{ $t('widgets.color.theme') }}</div>

    <div class="main-color">
      <div
        v-for="(item, index) in pColor"
        :key="index"
        class="panel-item"
        :style="`background-color: ${item};`"
        @click="itemClick(item)"
      >
        <span :style="`color: ${item};`">{{ item }}</span>
      </div>
    </div>

    <div style="margin-top: 10px;">
      {{ $t('widgets.color.standard') }}
    </div>

    <div class="standard-color">
      <div
        v-for="item in sColor"
        :key="item"
        class="item-sColor"
        :style="`background-color: ${item};`"
        @click="itemClick(item)"
      >
        <span :style="`color: ${item};`">{{ item }}</span>
      </div>
    </div>
    <a-input
      v-model="userInput"
      style="margin-top: 10px;"
      size="small"
      :placeholder="$t('widgets.color.custom')"
      @blur="itemClick(userInput)"
    />
    <div style="overflow: hidden;height:32px;">
      <div style="float:left;width:40%;line-height:40px">
        {{ $t('widgets.color.opacity') }}:{{ opacity }}
      </div>
      <a-slider
        v-model="opacity"
        style="float:left;width:50%"
        :min="0"
        :max="1"
        :step="0.01"
        @change="oChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import { Input, Slider } from '@h3/antd-vue';

@Component({
  components: {
    AInput: Input,
    ASlider: Slider,
  },
})
export default class ColorPickerPanel extends Vue {
  userInput: string = '';

  @Prop()
  value!: string;

  @Prop()
  colorOpacity!: number;

  // 颜色面板
  pColor: any = [
    '#000000',
    '#FFFFFF',
    '#EEECE1',
    '#1E497B',
    '#4E81BB',
    '#E2534D',
    '#9ABA60',
    '#8165A0',
    '#47acc5',
    '#f9974c',
    '#F2F2F2',
    '#808080',
    '#DDD8C3',
    '#C6D9F0',
    '#DAE5F0',
    '#F2DBDB',
    '#EAF1DE',
    '#E6E0EC',
    '#D9EEF3',
    '#FEE9DA',
    '#DBDBDB',
    '#696969',
    '#B6B29F',
    '#A1B4CC',
    '#B5C3D2',
    '#D5B6B6',
    '#CAD4BA',
    '#C4BDCC',
    '#B3D0D7',
    '#E9C9B1',
    '#C4C4C4',
    '#525252',
    '#8F8C7B',
    '#7C90A8',
    '#90A2B5',
    '#B89291',
    '#ABB796',
    '#A39AAD',
    '#8EB2BB',
    '#D5A988',
    '#ADADAD',
    '#3B3B3B',
    '#696657',
    '#576C84',
    '#6C8198',
    '#9C6E6C',
    '#8B9A73',
    '#81778E',
    '#68949F',
    '#C18960',
    '#969696',
    '#242424',
    '#424033',
    '#324860',
    '#47607B',
    '#7F4A47',
    '#6C7D4F',
    '#60546F',
    '#437683',
    '#AD6937',
  ];

  opacity: number = 1;

  setColor (str: string) {
    let a = str;
    if (a.substr(0, 1) === '#') {
      a = a.substring(1);
    }
    const len = a.length;
    if (len !== 6 && len !== 3) { // alert('十六进制颜色码为六位或三位！');
      return str;
    } else if (/[^0-9a-f]/i.test(a)) { // alert('请输入正确的十六进制颜色码！');
      return str;
    } else {
      a = a.toLowerCase();
      const b: any[] = [];
      for (let x = 0; x < 3; x++) {
        b[0] =
          len === 6
            ? a.substr(x * 2, 2)
            : a.substr(x * 1, 1) + a.substr(x * 1, 1);
        b[3] = '0123456789abcdef';
        b[1] = b[0].substr(0, 1);
        b[2] = b[0].substr(1, 1);
        b[20 + x] = b[3].indexOf(b[1]) * 16 + b[3].indexOf(b[2]);
      }
      return (
        'rgba(' + b[20] + ',' + b[21] + ',' + b[22] + ',' + this.opacity + ')'
      );
    }
  }

  // 标准颜色
  sColor: string[] = [
    '#c21401',
    '#ff1e02',
    '#ffc12a',
    '#ffff3a',
    '#90cf5b',
    '#00af57',
    '#00afee',
    '#0071be',
    '#00215f',
    '#72349d',
  ];

  created () {
    this.userInput = this.value;
    this.opacity = this.colorOpacity;
  }

  @Watch('value')
  valueChange () {
    this.userInput = this.value;
  }

  @Watch('colorOpacity')
  opacityChange () {
    this.opacity = this.colorOpacity;
  }

  oChange () {
    if (this.userInput) {
      this.itemClick(this.userInput);
    }
  }

  itemClick (color: string) {
    this.userInput = color;
    this.$emit('change', this.setColor(color));
  }
}
</script>

<style lang="less" scoped>
@font-size-12: 12px;

.color-picker-panel {
  width: 220px;
  .origin-color {
    width: 100%;
    margin: 0 auto;
    height: 20px;
    margin-bottom: 15px;
    border: 1px solid #ccc;
    text-align: center;
    line-height: 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: @font-size-12;
  }
}

.main-color {
  display: flex;
  flex-wrap: wrap;
  .panel-item {
    width: 16px;
    height: 16px;
    margin: 1.5px 3px;
    span {
      display: none;
    }
    &:hover {
      box-shadow: 0 0 15px #ccc;
      transition: all 0.2s;
      cursor: pointer;
    }
  }
}

.standard-color {
  display: flex;
  .item-sColor {
    width: 16px;
    height: 16px;
    margin: 3px;
    span {
      display: none;
    }
    &:hover {
      box-shadow: 0 0 15px #ccc;
      transition: all 0.2s;
      cursor: pointer;
    }
  }
}
</style>
