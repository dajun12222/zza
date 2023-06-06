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
    <countInfos ref="countInfos" :runMode="runMode" />
    <div class="header">
      <pageHeader
        :currentPage="currentPage"
        :totalPage="totalPage"
        :customStyle="style"
        @pageChange="pageChange"
      >
        <b></b>
        <span>{{ $t('languages.common.workBenchInfo.ToDoTask') }}</span>
      </pageHeader>
    </div>
    <div class="my-unfinished-wrapper">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { workbenchApi } from 'cloudpivot/api';

import countInfos from './components/infos.vue';
import pageHeader from './components/pageHeader.vue';
import unfinishedList from './components/unfinishedList.vue';

import SetTimeTypeMixin from 'cloudpivot-flow/flow-center/src/components/pc/common/index'; //公共处理模块
import { mixins } from 'vue-class-component';

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

  pageChange(type: 'prev' | 'next') {
    if (type === 'prev' && this.currentPage !== 0) {
      this.currentPage = this.currentPage - 1;
      this.getList();
    } else if (type === 'next' && this.currentPage !== this.totalPage - 1) {
      this.currentPage = this.currentPage + 1;
      this.getList();
    } else {
    }
  }

  refreshData() {
    this.currentPage = 0;
    this.getList();
    if (this.$refs.countInfos) {
      // @ts-ignore
      this.$refs.countInfos.getWorkCount();
    }
  }

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

  mounted() {
    if (this.runMode === 'runtime') {
      setTimeout(() => {
        this.getPageSize();
        this.getList();
      }, 500);
    } else {
      this.list = [
        {
          appCode: '',
          appName: '',
          appName_i18n: '',
          code: '',
          icon: 'h-icon-all-catalogue-o',
          id: '',
          instanceName: '【示例数据】客户跟进管理-个体商户',
          name_i18n: '{"en":"客户跟进管理-个体商户"}',
          stayTimeStr: '9天22小时24分钟',
        },
        {
          appCode: '',
          appName: '',
          appName_i18n: '',
          code: '',
          icon: 'h-icon-all-catalogue-o',
          id: '',
          instanceName: '【示例数据】敏捷开发项目管理系统（新增双向关联）',
          name_i18n: '{"en":"敏捷开发项目管理系统（新增双向关联）"}',
          stayTimeStr: '9天22小时24分钟',
        },
      ];
    }
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

  async getList() {
    if (this.runMode !== 'runtime') {
      return;
    }
    const res = await workbenchApi.searchWorkitems({
      wd: '',
      page: this.currentPage,
      size: this.pageSize || 5,
    });
    if (res.errcode === 0) {
      res.data.content.forEach((item) => {
        this.SetTimeType(item);
      });
      this.list = res.data.content;
      this.totalPage = res.data.totalPages;
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
        background: linear-gradient(180deg, #017CC6 0%, #004E92 100%);
        margin-right: 8px;
        margin-top: 1px;
      }
    }
  }
}
.my-unfinished-wrapper {
  position: relative;
  height: calc(100% - 160px);
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
</style>
