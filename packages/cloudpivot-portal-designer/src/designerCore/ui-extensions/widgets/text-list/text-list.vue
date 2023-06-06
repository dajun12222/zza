<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="designer-text-list text-list"
    :style="wrapStyle"
    @click="textClick"
  >
    <div class="header">
      <div v-if="!!icon" class="header-icon">
        <img
          v-if="icon.includes('http') || icon.includes('/api')"
          :src="icon"
          alt="icon"
        />
        <em v-else class="icon aufontAll" :class="icon" :style="style"></em>
      </div>
      <div class="header-title" :style="style">
        <!-- <b></b>
        <span>{{ componentTitle }}</span> -->
        <a-tabs
          :activeKey="tabKey"
          class="page-header-left-tab"
          @change="changeTabs"
        >
          <a-tab-pane
            v-for="item in tabsList"
            :key="item.key"
            :tab="item.value"
          />
        </a-tabs>
      </div>
      <div v-if="isAuditUnit" class="more" @click="handleMore">
        更多 +
      </div>
    </div>
    <TextListDisplay
      ref="TextListDisplay"
      :fromDashboard="true"
      :dataSource="dataSource"
      :bizModel="bizModel"
      :displayFieldList="displayFieldList"
      :sortField="sortKey"
      :sortRule="sortRule"
      :listIcon="listIcon"
      :runMode="runMode"
      :textStyle="style"
      :showFieldTitle="showFieldTitle"
      :queryConditions="queryConditions"
      :tabOption="tabOption"
      @auditUnit="auditUnit"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import { TextListDisplay } from '@portal-designer/toolbox';

import { Tabs } from '@h3/antd-vue';

@Component({
  components: {
    // AIcon: Icon
    TextListDisplay,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
  },
})
export default class UiLabel extends Vue {
  @Prop({
    default: '',
  })
  backgroundColor!: string;

  @Prop({
    default: '',
  })
  backgroundImg!: string;

  @Prop({
    default: '',
  })
  borderRadius!: string;

  @Prop({
    default: '',
  })
  borderStyle!: string;

  @Prop({
    default: 0,
  })
  borderThickness!: number;

  @Prop({
    default: '',
  })
  borderColor!: string;

  @Prop({
    default: '',
  })
  textColor!: string;

  @Prop({
    default: '',
  })
  textThickness!: string;

  @Prop({
    default: '文本列表',
  })
  title!: string;

  @Prop({
    default: '',
  })
  icon!: string;

  @Prop({
    default: '',
  })
  dataSource!: string;

  @Prop({
    default: '',
  })
  bizModel!: string;

  @Prop({
    default: '[]',
  })
  displayField!: string;

  @Prop({
    default: false,
  })
  showFieldTitle!: boolean;

  @Prop({
    default: '',
  })
  queryConditions!: string;

  @Prop({
    default: '{}',
  })
  sortField!: string;

  @Prop({
    default: 'ascending',
  })
  sortRule!: string;

  @Prop({
    default: 'noIcon',
  })
  listIcon!: string;

  displayFieldList: any = [];

  sortKey: any = {};

  // @Prop({
  //   default: ''
  // })
  list: any[] = [];

  tabsList:any = [
    {
      key: 1,
      value:"内部动态",
    },
    {
      key: 2,
      value:"外部动态",
    }
  ]

  tabKey:any = 1;

  tabOption:any = '内部数据'

  isAuditUnit:any = false;

  get componentTitle() {
    try {
      const componentTitle = JSON.parse(this.title);
      return componentTitle[this.$i18n.locale] || componentTitle['zh'];
    } catch (e) {
      return this.title;
    }
  }

  get wrapStyle() {
    const style: any = {};

    if (this.backgroundImg) {
      // 背景颜色
      style['background-image'] = `url(${this.backgroundImg})`;
    }

    if (this.backgroundColor) {
      // 背景颜色
      style['background-color'] = this.backgroundColor;
    }
    if (this.borderRadius) {
      // 圆角
      const RadiusEnum = {
        none: '0px',
        small: '2px',
        medium: '4px',
        big: '8px',
      };
      style['border-radius'] = RadiusEnum[this.borderRadius];
    }

    if (this.borderStyle) {
      // 边框类型
      style['border-style'] = this.borderStyle;
    }
    // 边框粗细
    style['border-width'] =
      this.borderThickness > 0 ? this.borderThickness + 'px' : 0;

    if (this.borderColor) {
      // 边框颜色
      style['border-color'] = this.borderColor;
    }
    style['box-shadow'] ='0px 0px 5px #e5e5e5';
    return style;
  }

  get style() {
    const style: any = {};
    if (this.textColor) {
      style['color'] = this.textColor;
    }
    if (this.textThickness) {
      style['font-weight'] = this.textThickness;
    }
    return style;
  }

  textClick(text) {
    this.$emit('click', text);
  }

  // 当前设计区域的渲染态：design, preview, runtime
  get runMode() {
    return this.$uiEngine.runMode as 'design' | 'preview' | 'runtime';
  }

  created() {
    this.displayFieldList = JSON.parse(this.displayField);
    this.sortKey = JSON.parse(this.sortField);
  }

  @Watch('displayField')
  displayFieldChange(val) {
    this.displayFieldList = JSON.parse(this.displayField);
  }

  @Watch('sortField')
  sortFieldChange(val) {
    this.sortKey = JSON.parse(this.sortField);
  }

  changeTabs(val){
    this.tabKey = val;
    if(val === 1){
      this.tabOption = '内部数据'
    }else{
      this.tabOption = '外部数据'
    }
    const TextListDisplay = (this.$refs.TextListDisplay as any);
    if(TextListDisplay){
      TextListDisplay.getVal(this.tabOption);
    }
  }

  handleMore(){
    const { href } = this.$router.resolve({
      path: '/application/test0003/audit/dynamic',
    });
    window.open(href, '_self');
  }

  auditUnit(val){
    this.isAuditUnit = val;
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.ui-label {
  display: inline-flex;
}

.text-list {
  border: 1px solid @primaryColor;
  max-width: 100%;
  overflow: hidden;
  background-repeat: convert;
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 54px;
    line-height: 54px;
    min-height: 54px;
    display: flex;
    padding: 0 24px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 0.5px solid #e5e5e5;
    // margin-bottom: 8px;
    /deep/ .ant-tabs-bar{
      border-bottom: none;
    }
    /deep/ .ant-tabs-nav .ant-tabs-tab{
      color: #111218;
      font-weight: 400;
      font-size: 20px;
      padding:16px 0;
      line-height: 22px;
    }
    /deep/ .ant-tabs-nav .ant-tabs-tab-active{
      color: #00579E !important;
    }
    /deep/ .ant-tabs-ink-bar-animated{ 
      width: 80px;
      height: 3px;
      background: linear-gradient(180deg, #017CC6 0%, #004E92 100%) !important;
    }
    .header-icon {
      width: 16px;
      height: 16px;
      line-height: 16px;
      margin-right: 8px;
      > img {
        width: 16px;
        height: 16px;
        vertical-align: unset;
      }
      > em {
        font-size: 16px;
        font-weight: 400 !important;
        color: @text-color;
      }
    }
    .header-title {
      height: 100%;
      font-size: 16px;
      color: #111218;
      line-height: 24px;
      > b {
        display: inline-block;
        width: 3px;
        height: 14px;
        background: linear-gradient(180deg, #017CC6 0%, #004E92 100%);
        margin-right: 8px;
        margin-top: 1px;
      }
    }
    .more{
      font-size: 14px;
      color: rgba(17,18,24,0.45);
      line-height: 54px;
      font-weight: 400;
      cursor: pointer;
    }
  }
}
</style>
