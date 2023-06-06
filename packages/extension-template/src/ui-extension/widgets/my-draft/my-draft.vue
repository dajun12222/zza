<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="designer-statistics my-draft"
    :style="wrapStyle"
    @click="textClick"
  >
    <pageHeader class="header" :style="style">
      {{ $t('languages.common.workBenchInfo.MyDraft')
      }}<span class="num">（{{ totalCount }}）</span>

      <template v-if="totalCount !== 0" slot="right">
        <span class="to-more" @click="showMore">
          {{ $t('languages.common.LoadMore') }}
        </span>
      </template>
    </pageHeader>

    <div
      ref="my-draft-box"
      class="my-draft-wrapper"
      :class="{ opacity: runMode !== 'runtime' }"
    >
      <div
        v-for="(item, index) in list"
        :key="index"
        :title="item.name"
        class="draft-item"
        :style="style"
        @click="openDetail(item)"
      >
        <div class="name">
          {{ item.name }}
        </div>
        <div class="time">
          {{
            moment(item.startTime || item.createdTime).format(
              'YYYY-MM-DD HH:mm',
            )
          }}
        </div>
      </div>

      <template v-if="!list.length">
        <div class="img-wrapper">
          <img
            v-if="!heightNoMoreThanMAX"
            src="./images/emptycontent.png"
            alt=""
          />
          <span>{{ $t('languages.common.noData') }}</span>
        </div>
      </template>
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
import { Component, Prop, Vue, Inject, Mixins } from 'vue-property-decorator';
import { workbenchApi } from 'cloudpivot/api';
import pageHeader from './pageHeader.vue';
import toolMixin from 'cloudpivot-flow/flow-center/src/components/pc/common/toolMixin'; //公共处理模块
import moment from 'moment';

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
  },
})
export default class shortcutList extends Mixins(toolMixin) {
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

  [x: string]: any;

  /**
   * 打开表单详情
   */
  openDetail(obj) {
    let url = '';
    if (obj.formType === 3) {
      url = `/form/detail?workitemId=${obj.bizObjectKey}&workflowInstanceId=${obj.workflowInstanceId}`;
    } else if (obj.formType === 2) {
      url = `/form/detail?workflowInstanceId=${obj.workflowInstanceId}`;
    } else {
      url = `/form/detail?sheetCode=${obj.sheetCode}&objectId=${obj.bizObjectKey}&schemaCode=${obj.schemaCode}&isWorkFlow=false`;
    }

    url += '&return=/workbench-center/workbench';

    if (this.isDingTalk) {
      this.$router
        .push({
          path: url,
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      this.showFormDetail(url);
    }
  }

  showMore() {
    this.$router.push(
      `/my-draft?return=${encodeURIComponent(
        location.pathname + location.search,
      )}`,
    );
  }

  totalCount: number = 0;

  currentPage: number = 0;

  pageSize: number = 0;

  heightNoMoreThanMAX: boolean = false; //用作计算运行态缺省图是否显示

  list: any[] = [];

  getPageSize() {
    const textDisplayBox = this.$refs['my-draft-box'] as HTMLElement;
    if (textDisplayBox) {
      const textDisplayBoxHeight = textDisplayBox.offsetHeight;
      return Math.floor(textDisplayBoxHeight / 50);
    } else {
      return 0;
    }
  }

  lastPageSize: number = 0;

  async getList() {
    if (this.pageSize === this.lastPageSize) {
      return;
    } else {
      this.lastPageSize = this.pageSize;
    }
    const res = await workbenchApi.getUserdraftList({
      page: 0,
      size: this.pageSize,
    });
    if (res.errcode === 0) {
      this.list = res.data.content;
      this.totalCount = res.data.totalElements;
    }
  }

  created() {
    this.moment = moment;
  }

  getPageSizeAndGetList() {
    this.pageSize = this.getPageSize();
    this.getList();
  }

  mounted() {
    setTimeout(() => {
      this.getPageSizeAndGetList();
    }, 500);
    const resizeObserver = new ResizeObserver(() => {
      {
        this.getPageSizeAndGetList();
      }
    });
    const textDisplayBox = this.$refs['my-draft-box'] as HTMLElement;
    resizeObserver.observe(textDisplayBox);

    const Max = 182;
    if (textDisplayBox && textDisplayBox.clientHeight < Max) {
      this.heightNoMoreThanMAX = true;
    }
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

span.num {
  font-weight: 400;
  color: @highlightColor;
}

.img-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  img {
    width: 160px;
    height: 160px;
  }
  span {
    font-size: 12px;
    color: rgba(17, 18, 24, 0.5);
    line-height: 22px;
  }
}
.my-draft {
  background-color: #fff;
  height: 100%;
  min-width: 320px;
  flex: 1;
  display: flex;
  flex-flow: column;
  .header {
    height: 58px;
    line-height: 58px;
    font-size: 16px;
    font-weight: 600 !important;
    color: @textColor;
    padding: 20px 24px;
    flex: 0;
  }
  .to-more {
    font-size: 12px;
    line-height: 20px;
    font-weight: 400 !important;
    cursor: pointer;
    &:hover {
      color: @highlightColor;
    }
  }

  .my-draft-wrapper {
    height: calc(100% - 58px);
    overflow: hidden;
    .draft-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 22px;
      padding: 10px 24px;
      margin-bottom: 8px;
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        flex: 1;
        margin-right: 16px;
      }
      &:hover {
        cursor: pointer;
        background: @activeBGColor;
        .name {
          color: @highlightColor;
        }
      }
      .time {
        // color: rgba(17, 18, 24, 0.5);
        opacity: 0.5;
        font-size: 12px;
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
