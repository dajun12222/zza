<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="themeUi ">
    <a-list itemLayout="horizontal">
      <a-list-item>
        <a-list-item-meta>
          <div slot="description">
            {{ $t('widgets.themeSet.globalColor') }}:
          </div>
        </a-list-item-meta>
        <color-picker
          :value="theme['@primary-color']"
          @change="changeVal(arguments, '@primary-color')"
        />
      </a-list-item>

      <a-list-item>
        <a-list-item-meta>
          <div slot="description">
            {{ $t('widgets.themeSet.successColor') }}:
          </div>
        </a-list-item-meta>
        <color-picker
          :value="theme['@success-color']"
          @change="changeVal(arguments, '@success-color')"
        />
      </a-list-item>

      <a-list-item>
        <a-list-item-meta>
          <div slot="description">
            {{ $t('widgets.themeSet.warningColor') }}:
          </div>
        </a-list-item-meta>
        <color-picker
          :value="theme['@warning-color']"
          @change="changeVal(arguments, '@warning-color')"
        />
      </a-list-item>

      <a-list-item>
        <a-list-item-meta>
          <div slot="description">
            {{ $t('widgets.themeSet.errorColor') }}:
          </div>
        </a-list-item-meta>
        <color-picker
          :value="theme['@error-color']"
          @change="changeVal(arguments, '@error-color')"
        />
      </a-list-item>

      <!--   <a-list-item>
                <a-list-item-meta>
                    <div slot="description">{{$t('widgets.themeSet.mainFontSize')}}:</div>
                </a-list-item-meta>
                <a-input v-model="input['@font-size-base']"
                    @blur="changeInput" />
            </a-list-item> -->

      <a-list-item>
        <a-list-item-meta>
          <div slot="description">
            {{ $t('widgets.themeSet.titleColor') }}:
          </div>
        </a-list-item-meta>
        <color-picker
          :value="theme['@heading-color']"
          @change="changeVal(arguments, '@heading-color')"
        />
      </a-list-item>

      <a-list-item>
        <a-list-item-meta>
          <div slot="description">
            {{ $t('widgets.themeSet.MainTextColor') }}:
          </div>
        </a-list-item-meta>
        <color-picker
          :value="theme['@text-color']"
          @change="changeVal(arguments, '@text-color')"
        />
      </a-list-item>

      <a-list-item>
        <a-list-item-meta>
          <div slot="description">
            {{ $t('widgets.themeSet.secondaryTextColor') }}:
          </div>
        </a-list-item-meta>
        <color-picker
          :value="theme['@text-color-secondary']"
          @change="changeVal(arguments, '@text-color-secondary')"
        />
      </a-list-item>

      <a-list-item>
        <a-list-item-meta>
          <div slot="description">
            {{ $t('widgets.themeSet.invalidColor') }}:
          </div>
        </a-list-item-meta>
        <color-picker
          :value="theme['@disabled-color']"
          @change="changeVal(arguments, '@disabled-color')"
        />
      </a-list-item>

      <!--  <a-list-item>
                <a-list-item-meta>
                    <div slot="description">{{$t('widgets.themeSet.fillet')}}:</div>
                </a-list-item-meta>
                <a-input v-model="input['@border-radius-base']"
                    @blur="changeInput" />
            </a-list-item> -->

      <a-list-item>
        <a-list-item-meta>
          <div slot="description">
            {{ $t('widgets.themeSet.borderColor') }}:
          </div>
        </a-list-item-meta>
        <color-picker
          :value="theme['@border-color-base']"
          @change="changeVal(arguments, '@border-color-base')"
        />
      </a-list-item>
    </a-list>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Model,
} from 'vue-property-decorator';
// import colorPicker from '../color-picker/color-picker.vue'; // 颜色选择器
import { List } from '@h3/antd-vue';
@Component({
  name: 'themeUi',
  components: {
    colorPicker: () => import('../color-picker/color-picker.vue'),
    AList: List,
    AListItem: List.Item,
    AListItemMeta: List.Item.Meta,
  },
})
export default class ThemeUi extends Vue {
  @Model('value') value: any;

  get theme () {
    let obj = this.value || this.defTheme;
    obj = Object.assign({}, this.defTheme, obj);
    /*  Object.keys(this.input).forEach(key => {
            if (obj[key]) {
                this.input[key] = obj[key];
            }
        }); */
    if (JSON.stringify(this.value) !== JSON.stringify(obj)) {
      this.$emit('value', obj);
    }
    return obj;
  }

  /*   changeInput() {
        let obj = { ...this.theme };
        this.$emit('value', Object.assign(obj, this.input));
    }
    input: any = {
        '@font-size-base': '14px',
        '@border-radius-base': '4px'
    }; */
  @Prop({ default: () => { } }) defaultValue: any;

  get defTheme () {
    // 该值跟vue.config.js里面varFile: path.join(__dirname, './src/common/styles/theme/variables.less')配套使用
    return Object.assign(
      {
        '@primary-color': '#17BC94',
        '@success-color': '#52c41a',
        '@warning-color': '#faad14',
        '@error-color': '#f5222d',
        /*  '@font-size-base': '14px', */
        // '@heading-color': 'rgba(0, 0, 0, 0.85)',
        // '@text-color': 'rgba(0, 0, 0, 0.65)',
        // '@text-color-secondary': 'rgba(0, 0, 0, 0.45)',
        // '@disabled-color': 'rgba(0, 0, 0, 0.25)',
        /*  '@border-radius-base': '4px', */
        '@border-color-base': '#dddddd',
      },
      this.defaultValue,
    );
  }

  changeVal (color: string, name: string) {
    const obj: any = { ...this.theme };
    obj[name] = color[0];
    this.$emit('value', obj);
    this.$emit('change', obj);
  }
}
</script>

<style lang="less" scoped>
.themeUi {
  height: 400px;
  width: 300px;
  overflow: auto;
  margin-right: -16px;
  padding-right: 16px;
  /deep/ .ant-list-item-meta-description {
    text-align: right;
    margin-right: 20px;
  }
}
</style>
