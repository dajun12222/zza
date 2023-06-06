<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="designer-chart" :style="wrapStyle">
    <template v-if="singleChartOptions.chartId">
      <h3-single-chart
        :key="singleChartOptions.chartId"
        :corpId="singleChartOptions.corpId"
        :reportId="singleChartOptions.reportId"
        :chartId="singleChartOptions.chartId"
        :config="config"
      >
        <div slot="title">
          <div class="titleHeader">
            <b></b>
            <div class="header">{{ singleChartOptions.name }}</div>
          </div>
        </div>
      </h3-single-chart>
    </template>
    <template v-else>
      <div class="empty-header">图表</div>
      <EmptyDataSource emptyText="您还没配置组件样式或展示内容哦～" />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { DashboardPro } from '@h3/report';
import { EmptyDataSource } from '@portal-designer/toolbox';

@Component({
  components: {
    H3SingleChart: DashboardPro.SingleChart,
    EmptyDataSource,
  },
})
export default class UiChart extends Vue {
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
  dataSource!: string;

  /**
   * 图表配置信息
   * appCode：应用编码
   * reportCode：仪表盘编码
   */
  get config() {
    const dataSourceJson = this.dataSource ? JSON.parse(this.dataSource) : {};
    return {
      token: localStorage.getItem('token'),
      appCode: dataSourceJson?.appCode,
      reportCode: dataSourceJson?.reportCode,
    };
  }

  /**
   * 仪表盘以及图表信息
   * corpId：云枢6使用报表的唯一标志
   * reportId：仪表盘ID
   * chartId：仪表盘中的图表ID
   * name：图表的标题
   */
  get singleChartOptions() {
    const dataSourceJson = this.dataSource ? JSON.parse(this.dataSource) : {};
    return {
      corpId: dataSourceJson?.corpId,
      reportId: dataSourceJson?.reportId,
      chartId: dataSourceJson?.uuid,
      name: dataSourceJson?.title,
    };
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

  // 当前设计区域的渲染态：design, preview, runtime
  get runMode() {
    return this.$uiEngine.runMode as 'design' | 'preview' | 'runtime';
  }

  created() {}
}
</script>

<style lang="less" scoped>
.designer-chart {
  // padding-left: 8px;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-repeat: convert;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  .titleHeader {
    display: flex;
    align-items: center;
    > b {
      display: inline-block;
      width: 3px;
      height: 14px;
      background: linear-gradient(180deg, #017CC6 0%, #004E92 100%);
      margin-right: 8px;
      margin-top: 1px;
    }
    .header {
      padding-top: 8px;
      padding-bottom: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #111218;
      line-height: 24px;
    }
  }
  
  .empty-header {
    padding: 0 16px;
    font-size: 16px;
    font-weight: 600;
    color: #111218;
    line-height: 58px;
  }
  /deep/.h3-single-chart {
    background-color: inherit !important;
    background-image: inherit !important;
    .h3-dashboard-element-wrap {
      background-color: inherit !important;
      background-image: inherit !important;
      .h3-dashboard-element-wrap__head{
        padding: 0 0 0 24px;
        height: 50px;
        border-bottom: 0.5px solid #e5e5e5;
        margin-bottom: 8px;
        .h3-dashboard-element-wrap__single {
          padding: 0;
        }
      }
      .h3-dashboard-element-wrap__chart-wrap {
        background-image: inherit !important;
      }
    }
  }
}

</style>
