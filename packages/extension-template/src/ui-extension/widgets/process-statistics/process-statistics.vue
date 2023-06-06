<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="designer-statistics statistics"
    :style="wrapStyle"
    @click="textClick"
  >
    <pageHeader class="header" :style="style">
      {{ $t('languages.common.workBenchInfo.ProcessStatistics') }}
      <template slot="right">
        <div class="times">
          <span
            :class="{ active: unitType === 3 }"
            @click="unitTypeChange(3)"
            >{{ $t('languages.common.workBenchInfo.Today') }}</span>
          <span
            :class="{ active: unitType === 2 }"
            @click="unitTypeChange(2)"
            >{{ $t('languages.common.workBenchInfo.ThisWeek') }}</span>
          <span
            :class="{ active: unitType === 1 }"
            @click="unitTypeChange(1)"
            >{{ $t('languages.common.workBenchInfo.ThisMonth') }}</span>
        </div>
      </template>
    </pageHeader>

    <div class="infos" :class="{ opacity: runMode !== 'runtime' }">
      <div class="info-item">
        <h3>
          {{
            $t('languages.common.workBenchInfo.Items', {
              num: statisticsData.workItemFinishedCount,
            })
          }}
        </h3>
        <p>
          {{ $t('languages.common.workBenchInfo.FinishedTask') }}
        </p>
      </div>
      <div class="info-item">
        <h3>
          {{
            $t('languages.common.workBenchInfo.Items', {
              num: statisticsData.timeOutWorkItemCount,
            })
          }}
        </h3>
        <p>
          {{ $t('languages.common.workBenchInfo.TimeoutTask') }}
        </p>
      </div>
    </div>

    <div class="my-flow" :class="{ opacity: runMode !== 'runtime' }">
      <div class="my-flow-header">
        <span>
          <em></em>{{ $t('languages.common.workBenchInfo.MyInitiated2') }}
        </span>

        <div class="btns">
          <span
            :class="{ active: btnsType === 1 }"
            @click="btnsTypeChange(1)"
            >{{ $t('languages.common.workBenchInfo.Status') }}</span>
          <span
            :class="{ active: btnsType === 2 }"
            @click="btnsTypeChange(2)"
            >{{ $t('languages.common.workBenchInfo.Template') }}</span>
        </div>
      </div>

      <div v-show="btnsType === 1" class="chart">
        <div class="left">
          <template v-if="!IsEmptyPie">
            <pie class="chart-item" :options="pieOptions" />
          </template>

          <template v-else>
            <div class="empty-pie"></div>
          </template>
        </div>
        <div class="right">
          <ul>
            <li>
              <span><em :style="{ 'background-color': colors[0] }"></em>{{ $t('languages.common.WorkItemStatus.Processing') }}</span>
              <span>{{ getCount('PROCESSING') }}</span>
            </li>
            <li>
              <span><em :style="{ 'background-color': colors[1] }"></em>{{ $t('languages.common.WorkItemStatus.Completed') }}</span>
              <span>{{ getCount('COMPLETED') }}</span>
            </li>
            <li>
              <span><em :style="{ 'background-color': colors[2] }"></em>{{ $t('languages.common.WorkItemStatus.Draft') }}</span>
              <span>{{ getCount('DRAFT') }}</span>
            </li>
            <li>
              <span><em :style="{ 'background-color': colors[3] }"></em>{{ $t('languages.common.WorkItemStatus.Exception') }}</span>
              <span>{{ getCount('EXCEPTION') }}</span>
            </li>
            <li>
              <span><em :style="{ 'background-color': colors[4] }"></em>{{ $t('languages.common.WorkItemStatus.Invalid') }}</span>
              <span>{{ getCount('CANCELED') }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div
        v-show="btnsType === 2"
        class="box"
        :class="{ 'empty-box': codesLen === 0 }"
        :style="{
          '--placeholder': '\'' + $t('languages.common.noData') + '\'',
        }"
      >
        <div v-for="(item, index) in codes" :key="index" class="instance_item">
          <div class="label" :title="item.workflowName">
            {{ item.workflowName }}
          </div>
          <span :style="{ width: getWidth(item.count) }"></span>
          <div>{{ item.count }}</div>
        </div>

        <span
          class="font-ele"
          :style="{ height: codes.length * 24 + 'px' }"
        ></span>

        <div
          v-for="index in lastLen"
          :key="index + 5"
          class="instance_item empty"
        >
          <div class="label">
            {{ $t('languages.common.noData') }}
          </div>
          <span></span>
        </div>
      </div>
    </div>
    <div v-if="runMode !== 'runtime'" class="text-area-content">
      <div class="text-area">
        <span class="icon aufontAll warning">&#xe99a;</span>
        <span>业务组件带有业务逻辑，仅可以自定义样式</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator';
import { workbenchApi } from 'cloudpivot/api';
import pageHeader from './pageHeader.vue';
import pie from './pie.vue';

interface SHORTCUT {
  appCode: string;
  appName: string;
  appName_i18n: string;
  code: string;
  icon: string;
  id: string;
  name: string;
  name_i18n: string;
  type: string;
}

@Component({
  components: {
    pageHeader,
    pie,
  },
})
export default class shortcutList extends Vue {
  @Inject({
    default: () => {},
  })
  showFormDetail: Function;

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

  list: any[] = [];

  tips: string = '业务组件带有业务逻辑，仅可以自定义样式';

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
    if (this.runMode === 'design') {
      this.$emit('click', text);
    }
  }

  // 当前设计区域的渲染态：design, preview, runtime
  get runMode() {
    return this.$uiEngine.runMode as 'design' | 'preview' | 'runtime';
  }

  colors: string[] = [
    '#2970ff',
    '#00c293',
    '#faad14',
    '#f0353f',
    'rgba(17, 18, 24, 0.5)',
  ];

  pieColors: any = {
    PROCESSING: this.colors[0],
    COMPLETED: this.colors[1],
    DRAFT: this.colors[2],
    EXCEPTION: this.colors[3],
    CANCELED: this.colors[4],
  };

  unitType: number = 3; // 1本月 2本周 3今日

  unitTypeChange(type) {
    this.unitType = type;
    this.getWorkflowStatistics();
  }

  btnsType: number = 1;

  btnsTypeChange(type: number) {
    this.btnsType = type;
  }

  statisticsData: any = {};

  getCount(type) {
    if (!this.statisticsData.states) {
      return 0;
    }
    const item = this.statisticsData.states.find((el) => el.state === type);
    return (item && item.count) || 0;
  }

  get IsEmptyPie() {
    if (
      !this.statisticsData.states ||
      this.statisticsData.states.length === 0 ||
      this.statisticsData.states.reduce(
        (a: any, b: any) => a.count + b.count,
      ) === 0
    ) {
      return true;
    }
    return false;
  }

  pieOptions: any = {
    chartTitle: '',
    color: this.colors,
    list: [],
    radius: ['56%', '87%'],
  };

  get codes() {
    if (this.statisticsData && this.statisticsData.codes) {
      return this.statisticsData.codes;
    }
    return [];
  }

  get codesLen() {
    return (this.codes && Array.isArray(this.codes) && this.codes.length) || 0;
  }

  get lastLen() {
    return 5 - this.codesLen > 0 ? 5 - this.codesLen : 0;
  }

  get maxCount() {
    if (this.codes.length === 0) {
      return 0;
    }
    return Math.max(...this.codes.map((el) => el.count));
  }

  getWidth(count) {
    return (count / this.maxCount) * 178 + 'px';
  }

  async getWorkflowStatistics() {
    const res = await workbenchApi.getWorkflowStatistics(this.unitType);
    if (res.errcode === 0) {
      if (res.data.states) {
        const _res: any[] = [];
        (res.data.states as any[]).forEach((item) => {
          _res.push({
            value: item.count,
            name: item.name,
            itemStyle: {
              color: this.pieColors[item.state],
            },
          });
        });
        this.pieOptions.list = _res;
      }
      this.statisticsData = res.data;
    }
  }

  created() {
    this.getWorkflowStatistics();
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
// .shortcut-list {
//   border: 1px solid @primaryColor;
//   max-width: 100%;
//   overflow: hidden;
//   background-repeat: convert;
//   background-size: cover;
//   background-position: center;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   position: relative;
//   .header {
//     height: 58px;
//     line-height: 58px;
//     font-size: 16px;
//     font-weight: 600 !important;
//     color: @textColor;
//     padding-left: 24px;
//     flex: 0;
//   }
//   .shortcut-list-wrapper {
//     padding-top: 6px;
//     flex: 1;
//     overflow: auto;
//     &.opacity {
//       opacity: 0.2;
//     }
//     .list-item {
//       padding: 0 24px;
//       display: flex;
//       justify-content: flex-start;
//       align-items: center;
//       line-height: 22px;
//       margin-bottom: 24px;
//       width: 100%;
//       overflow: hidden;
//       cursor: pointer;
//       &:hover {
//         em {
//           color: @highlightColor !important;
//         }
//         .title {
//           color: @highlightColor !important;
//         }
//       }
//       .icon-wrapper {
//         flex: 0;
//       }
//       em {
//         font-size: 12px;
//         color: @primaryColor;
//         margin-right: 6px;
//       }
//       .title {
//         font-size: 13px;
//         color: @text-color;
//         text-overflow: ellipsis;
//         max-width: calc(100% - 80px);
//         white-space: nowrap;
//         overflow: hidden;
//       }
//       .is-flow {
//         width: 32px;
//         min-width: 32px;
//         flex: 0;
//         height: 16px;
//         line-height: 16px;
//         background: rgba(35, 110, 235, 0.05);
//         border-radius: 2px;
//         font-size: 12px;
//         color: @primaryColor;
//         text-align: center;
//         display: inline-block;
//         margin-left: 8px;
//         margin-top: 1px;
//       }
//     }
//   }
//   .text-area-content {
//     position: absolute;
//     top: 0;
//     left: 0px;
//     width: 100%;
//     height: 100%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     flex-direction: column;
//     .text-area {
//       background: #fffbe6;
//       border-radius: 4px;
//       border: 1px solid #ffe58f;
//       height: 40px;
//       line-height: 40px;
//       padding: 0 16px;
//       .icon {
//         color: #faad14;
//         font-size: 14px;
//         margin-right: 8px;
//       }
//     }
//   }
// }
.statistics {
  // max-width: 100%;
  // height: 379px;
  // flex: 1;
  // overflow: hidden;
  // background-color: #fff;
  // padding: 24px;
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
  position: relative;

  .header {
    height: 58px;
    line-height: 58px;
    font-size: 16px;
    font-weight: 600 !important;
    color: @textColor;
    padding: 17px 24px;
    flex: 0;
  }

  .my-flow {
    padding: 20px 24px;
    height: 60%;
    .my-flow-header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 14px;
      line-height: 24px;
      .btns {
        height: 24px;
        background: #efefef;
        border-radius: 4px;
        padding: 2px;
        font-size: 12px;
        line-height: 20px;
        span {
          display: inline-block;
          height: 20px;
          padding: 0 15px;
          color: rgba(17, 18, 24, 0.5);
          cursor: pointer;
          &.active {
            background-color: #fff;
            border-radius: 3px;
            color: #111218 !important;
          }
          &:hover {
            color: @highlightColor;
          }
        }
      }
      span em {
        display: inline-block;
        width: 2px;
        height: 12px;
        background-color: @primaryColor;
        margin-right: 8px;
      }
    }
    .chart {
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      height: calc(100% - 24px);
      .left {
        min-width: 182px;
        min-height: 120px;
        height: 100%;
        flex: 1;
        margin-right: 20px;

        .empty-pie {
          width: 100px;
          height: 100px;
          background: #f1f2f6;
          border-radius: 50%;
          position: relative;
          margin: 10px auto 0;
          &::after {
            content: '';
            background-color: #fff;
            left: 20px;
            top: 20px;
            width: 60px;
            height: 60px;
            position: absolute;
            border-radius: 50%;
          }
        }
      }
      .right {
        width: 110px;
        min-height: 120px;
        height: 100%;
        ul {
          list-style: none;
          li {
            height: 20px;
            line-height: 20px;
            margin-bottom: 4px;
            display: flex;
            justify-content: space-between;
            span {
              &:first-child {
                color: rgba(17, 18, 24, 0.5);
                em {
                  display: inline-block;
                  width: 9px;
                  height: 9px;
                  border-radius: 50%;
                  margin-right: 6px;
                }
              }
            }
          }
        }
      }
    }

    .box {
      margin-top: 13px;
      position: relative;
      padding-top: 7px;
      overflow: auto;
      max-height: 127px;
      height: 127px;
      .font-ele {
        position: absolute;
        width: 0;
        min-height: 123px;
        border-left: 1px dashed rgba(17, 18, 24, 0.25);
        left: 72px;
        top: 4px;
      }
      &.empty-box {
        &::after {
          display: none;
        }
        .instance_item {
          display: none;
        }
        .font-ele {
          display: none;
        }
        &::before {
          content: var(--placeholder);
          position: absolute;
          left: 50%;
          top: 47px;
          transform: translateX(-50%);
          color: rgba(17, 18, 24, 0.5);
          font-size: 14px;
        }
      }

      .instance_item {
        display: flex;
        align-items: center;
        line-height: 20px;
        font-size: 12px;
        margin-bottom: 4px;
        .label {
          width: 62px;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 12px;
          color: rgba(17, 18, 24, 0.5);
        }
        span {
          display: inline-block;
          background-color: @primaryColor;
          height: 10px;
          max-width: 178px;
          border-radius: 0px 2px 2px 0px;
          margin-right: 8px;
        }
        &.empty {
          span {
            width: 178px;
            background-color: #f9f9f9;
          }
        }
      }
    }
    &.opacity {
      opacity: 0.2;
    }
  }

  .times {
    width: 168px;
    height: 24px;
    line-height: 22px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #eeeeee;
    display: flex;
    font-weight: 400 !important;
    span {
      display: inline-block;
      flex: 1;
      text-align: center;
      border-radius: 3px;
      font-size: 12px;
      cursor: pointer;
      &.active {
        background: @highlightColor;
        color: #fff !important;
      }
      &:hover {
        color: @highlightColor;
      }
    }
  }

  .infos {
    display: flex;
    justify-content: space-between;
    padding: 0 24px;
    height: calc(40% - 58px);
    min-height: 110px;
    .info-item {
      flex: 1;
      text-align: center;
      height: 100%;
      background: #f9f9f9;
      border-radius: 4px;
      border: 1px solid #eeeeee;
      display: flex;
      flex-flow: column;
      justify-content: center;
      &:first-child {
        margin-right: 16px;
      }

      h3 {
        font-size: 18px;
        line-height: 28px;
        font-weight: 600;
        margin-bottom: 16px;
      }
      p {
        font-size: 14px;
        line-height: 22px;
      }
    }
    &.opacity {
      opacity: 0.2;
    }
  }

  .text-area-content {
    position: absolute;
    top: 0;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .text-area {
      background: #fffbe6;
      border-radius: 4px;
      border: 1px solid #ffe58f;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
      .icon {
        color: #faad14;
        font-size: 14px;
        margin-right: 8px;
      }
    }
  }
}
</style>
