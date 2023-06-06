<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="designer-my-unfinished my-unfinished"
    :style="wrapStyle"
    @click="textClick"
  >
    <countInfos ref="countInfos" :runMode="runMode" @emitChange="emitChange" />
    <!-- <div class="header">
      <pageHeader
        :currentPage="currentPage"
        :totalPage="totalPage"
        :customStyle="style"
        @pageChange="pageChange"
      >
        <b></b>
        <span>{{ $t('languages.common.workBenchInfo.ToDoTask') }}</span>
      </pageHeader>
    </div> -->
    <!-- <div class="my-unfinished-wrapper">
      <div
        ref="unFinishedList"
        class="list-content"
        :class="{ opacity: runMode !== 'runtime' }"
      >
        <unfinishedList
          :list="list"
          :customStyle="style"
          @refreshData="refreshData"
        />
      </div>
      <div v-if="runMode !== 'runtime'" class="text-area-content">
        <div class="text-area">
          <span class="icon aufontAll warning">&#xe99a;</span>
          <span>{{ $t('languages.common.workBenchInfo.tips5') }}</span>
        </div>
      </div>
    </div> -->

    <div class="my-unfinished-wrapper">
      <!-- 已办 -->
      <div v-show="status.FinishedTask2">
        <newList2 :dataContent="dataContent2" />
        <div class="page">
          <a-page2
            :obj="dataContent2"
            style="display: flex; justify-content: center"
            @searchPage="searchPage"
          />
        </div>
      </div>

      <!-- 待办 -->
      <div v-show="status.ToDoTask">
        <newList :dataContent="dataContent" />
        <div class="page">
          <a-page
            :obj="dataContent"
            style="display: flex; justify-content: center"
            @searchPage="searchPage"
          />
        </div>
      </div>
      <!-- 待阅 -->
      <div v-show="status.ToReadTask">
        <newList3 :dataContent="dataContent3" />
        <div class="page">
          <a-page3
            :obj="dataContent3"
            style="display: flex; justify-content: center"
            @searchPage="searchPage"
          />
        </div>
      </div>
      <!-- 已阅 -->
      <div v-show="status.FinishedRead">
        <newList4 :dataContent="dataContent4" />
        <div class="page">
          <a-page4
            :obj="dataContent4"
            style="display: flex; justify-content: center"
            @searchPage="searchPage"
          />
        </div>
      </div>
      <div v-show="status.reminder">催办</div>
      <div v-show="status.attention">关注</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { workbenchApi, homeApi } from 'cloudpivot/api';
import newList from './components/track/newList.vue';
import newList2 from './components/track/newList2.vue';
import newList3 from './components/track/newList3.vue';
import newList4 from './components/track/newList4.vue';
import newList5 from './components/track/newList5.vue';
import newList6 from './components/track/newList6.vue';

import countInfos from './components/infos.vue';
import pageHeader from './components/pageHeader.vue';
import unfinishedList from './components/unfinishedList.vue';

import SetTimeTypeMixin from 'cloudpivot-flow/flow-center/src/components/pc/common/index'; //公共处理模块
import { mixins } from 'vue-class-component';
import page from '@/../extends/components/static/page.vue';

const TEXT_LINE_HEIGHT = 46;

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
    countInfos,
    pageHeader,
    unfinishedList,
    newList,
    newList2,
    newList3,
    newList4,
    newList5,
    newList6,
    APage: page,
    APage2: page,
    APage3: page,
    APage4: page,
  },
})
export default class shortcutList extends mixins(SetTimeTypeMixin) {
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

  currentPage: number = 0;

  totalPage: number = 0;

  dataContent: any = {};

  dataContent2: any = {};

  dataContent3: any = {};

  dataContent4: any = {};

  dataContent5: any = {};

  dataContent6: any = {};

  status: any = {
    ToDoTask: true,
    FinishedTask2: false,
    ToReadTask: false,
    FinishedRead: false,
    reminder: false,
    attention: false,
  };

  // pageChange(type: 'prev' | 'next') {
  //   if (type === 'prev' && this.currentPage !== 0) {
  //     this.currentPage = this.currentPage - 1;
  //     this.getList();
  //   } else if (type === 'next' && this.currentPage !== this.totalPage - 1) {
  //     this.currentPage = this.currentPage + 1;
  //     this.getList();
  //   } else {
  //   }
  // }

  searchPage(option: any) {
    console.log('1111', option);
    this.getList(option, this.status);
  }

  emitChange(e) {
    this.status = e;
    this.getList({ page: 1, size: 10 }, e);
  }

  // refreshData() {
  //   this.currentPage = 0;
  //   this.getList();
  //   if (this.$refs.countInfos) {
  //     // @ts-ignore
  //     this.$refs.countInfos.getWorkCount();
  //   }
  // }

  list: any[] = [];

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
    // style['box-shadow'] = '0px 0px 5px #e5e5e5';
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

  mounted() {
    this.getList({ page: 1, size: 10 }, this.status);
  }

  pageSize: number = 4;

  getPageSize() {
    const textDisplayBox = this.$refs['unFinishedList'] as HTMLElement;
    if (textDisplayBox) {
      const textDisplayBoxHeight = textDisplayBox.offsetHeight;
      this.pageSize = Math.floor(textDisplayBoxHeight / TEXT_LINE_HEIGHT);
    } else {
      this.pageSize = 0;
    }
  }

  async getList(option: any, status) {
    option.page = parseInt(option.page) - 1;
    if (status.ToDoTask) {
      option.isCustomized = true;
      homeApi.searchWorkitems(option).then((res: any) => {
        res.data.content.forEach((item) => {
          this.SetTimeType(item);
          this.SetTimeType1(item);
        });
        this.dataContent = res.data;
        this.dataContent.total = res.data.totalElements;
        this.dataContent.page = option.page + 1;
      });
    }
    if (status.FinishedTask2) {
      option.isCustomized = true;
      homeApi.getFinishedWorkitems(option).then((res: any) => {
        res.data.content.forEach((item) => {
          this.SetTimeType1(item);
          this.handlingTimeType1(item);
        });

        this.dataContent2 = res.data;
        this.dataContent2.total = res.data.totalElements;
        this.dataContent2.page = option.page + 1;
      });
    }
    if (status.ToReadTask) {
      homeApi.searchCirculates(option).then((res: any) => {
        res.data.content.forEach((item) => {
          this.SetTimeType(item);
        });

        this.dataContent3 = res.data;
        this.dataContent3.total = res.data.totalElements;
        this.dataContent3.page = option.page + 1;
      });
    }
    if (status.FinishedRead) {
      homeApi.getFinishedCirculates(option).then((res: any) => {
        res.data.content.forEach((item) => {
          this.SetTimeType(item);
        });

        this.dataContent4 = res.data;
        this.dataContent4.total = res.data.totalElements;
        this.dataContent4.page = option.page + 1;
      });
    }
    if (status.reminder) {
    }
    if (status.attention) {
    }
  }
}
</script>

<style lang="less" scoped>
.my-unfinished {
  border: 1px solid @primary-color;
  max-width: 100%;
  height: 100%;
  overflow: hidden;
  background-repeat: convert;
  background-size: cover;
  background-position: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  .header {
    padding: 0 24px;
    font-size: 14px;
    font-weight: 600;
    color: #111218;
    flex: 0;

    /deep/ .name {
      display: flex;
      align-items: center;
      b {
        display: inline-block;
        width: 3px;
        height: 14px;
        background: linear-gradient(180deg, #017cc6 0%, #004e92 100%);
        margin-right: 8px;
        margin-top: 1px;
      }
    }
  }
}
.my-unfinished-wrapper {
  position: relative;
  height: calc(100% - 160px);
  padding: 20px;
  height: 600px;
  background: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(168, 175, 186, 0.1);
  border-radius: 0px 4px 4px 4px;
  .list-content {
    height: 100%;
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
/deep/ .ant-pagination {
  color: #000;
  display: flex;
  align-items: baseline;
  .ant-pagination-total-text,
  .ant-pagination-item-link,
  .ant-pagination-item a {
    color: #000;
  }
}
/deep/ .elApage {
  margin-top: 16px;
  justify-content: right !important;
}
/deep/ .ant-table-thead > tr:first-child > th {
  background: #f4f8fb;
}
/deep/ .ant-table-placeholder {
  height: 400px;
  display: flex;
  align-items: center;
  .ant-empty {
    margin: auto;
  }
}

</style>
