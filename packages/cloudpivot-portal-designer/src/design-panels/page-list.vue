<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->

<template>
  <div class="page-list">
    <header>
      <span class="header-left">页面</span>
      <a-tooltip>
        <template slot="title"> 新建自定义页面 </template>
        <span class="icon aufontAll h-icon-all-plus-o" @click="addPage"></span>
      </a-tooltip>
    </header>
    <content>
      <template v-for="item in pagesData">
        <div
          :key="item.code"
          class="list-item"
          :class="{ active: item.code === (currentPage && currentPage.code) }"
          @click="goToPage(item)"
        >
          <div class="item-content">
            <a-tooltip>
              <template slot="title">
                <span v-if="calcStr(item.name) > 27" class="item-center">{{
                  item.name
                }}</span>
              </template>
              <div class="item-center">{{ item.name }}</div>
            </a-tooltip>
            <div v-if="item.defaultPage" class="item-tag">
              <span class="item-tag-content">门户首页</span>
            </div>
          </div>
          <a-popover
            placement="bottomLeft"
            overlayClassName="options-list"
            trigger="click"
          >
            <template slot="content">
              <div class="options-box">
                <div class="options-btn" @click="editPage(item)">
                  修改页面信息
                </div>
                <div
                  class="options-btn"
                  :class="{ disabled: item.defaultPage }"
                  @click="deletePageInfo(item)"
                >
                  删除
                </div>
              </div>
            </template>
            <div class="item-right icon aufontAll h-icon-all-ellipsis-o"></div>
          </a-popover>
        </div>
      </template>
    </content>
    <edit-page
      v-model="showEditPageModal"
      :type="editType"
      :thePageData="editPageData"
      @savePage="savePageInfo"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Tooltip, Popover } from '@h3/antd-vue';
import { namespace } from 'vuex-class';
import EditPage from './edit-page.vue';
import { utils } from 'cloudpivot/common';

const PortalDesignModule = namespace('PortalDesign');

@Component({
  name: 'page-list',
  components: {
    ATooltip: Tooltip,
    APopover: Popover,
    EditPage,
  },
})
export default class PageList extends Vue {
  @PortalDesignModule.State('pagesData') pagesData: any[];

  @PortalDesignModule.State('currentPage') currentPage: any;

  @PortalDesignModule.State('pageType') pageType: any;

  @PortalDesignModule.Action('loadPageList') loadPageList: any;

  @PortalDesignModule.Action('deletePage') deletePage: any;

  showEditPageModal: boolean = false;

  editType: number = 0;

  editPageData: any = {};

  goToPage(page) {
    const { code, appCode, defaultPage } = page;
    if (code === this.currentPage.code) {
      return;
    }
    this.$router.push({
      name: 'portal-design',
      query: {
        appCode,
        code,
        type: this.pageType,
        defaultPage,
      },
    });
  }

  addPage() {
    this.showEditPageModal = true;
    this.editType = 0;
    this.editPageData = {};
  }

  editPage(page) {
    this.showEditPageModal = true;
    this.editType = 1;
    this.editPageData = page;
  }

  savePageInfo(val) {
    if (val.type === 1) {
      this.loadPageList({
        type: this.pageType,
      });
    } else {
      this.goToPage(val.pageValue);
    }
  }

  deletePageInfo(val) {
    if (val.defaultPage) {
      return;
    }
    this.deletePage({ code: val.code }).then((res) => {
      if (res.errcode === 0) {
        this.$message.success('删除成功');
        if (this.currentPage.code === val.code) {
          this.$emit('deleteCurrentPage');
        }
        this.loadPageList({
          type: this.pageType,
        });
      } else {
        this.$message.error(res.errmsg || '删除失败');
      }
    });
  }

  calcStr(str) {
    return utils.calcStrLength(str);
  }
}
</script>

<style lang="less" scoped>
.page-list {
  height: 100%;
  header {
    position: relative;
    height: 46px;
    font-size: 14px;
    font-weight: 600;
    line-height: 46px;
    color: #111218;
    padding: 0 16px;
    border-bottom: thin solid #eeeeee;
    &::after {
      content: '';
      clear: both;
    }
    .header-left {
      float: left;
    }
    .icon {
      position: absolute;
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      border-radius: 2px;
      color: #111218;
      top: 8px;
      right: 8px;
      &:hover {
        background: rgba(41, 112, 255, 0.1);
        color: #2970ff;
      }
    }
  }
  content {
    padding: 8px;
    height: calc(100% - 46px);
    max-height: calc(100% - 46px);
    overflow: auto;
    display: block;
    .list-item {
      display: flex;
      padding: 0 8px 0 16px;
      font-size: 14px;
      color: #111218;
      height: 32px;
      align-items: center;
      &:not(:last-child) {
        margin-bottom: 4px;
      }
      .item-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        .item-center {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-tag {
          white-space: nowrap;
          margin: 0 8px;
          padding: 0 8px;
          height: 20px;
          background: #fff3eb;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 400;
          color: #f66320;
          line-height: 20px;
        }
      }
      .item-right {
        display: none;
        width: 16px;
        height: 16px;
        line-height: 16px;
      }
      &:hover,
      &.hover,
      &.active {
        background: #eef4fd;
        color: #2970ff;
        .item-right {
          display: block;
          cursor: pointer;
        }
      }
      &.active .item-center {
        font-weight: 600;
      }
    }
  }
}
</style>
<style lang="less">
.options-list {
  .ant-popover-arrow {
    display: none;
  }
  .ant-popover-inner-content {
    padding: 4px 0;
    height: 80px;
    background: #ffffff;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    .options-box {
      .options-btn {
        width: 112px;
        padding: 0 12px;
        height: 32px;
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        line-height: 32px;
        &:hover {
          cursor: pointer;
        }
        &.disabled {
          color: rgba(17, 18, 24, 0.25);
          cursor: not-allowed;
        }
        & + .options-btn {
          margin-top: 4px;
          padding-top: 3px;
          box-sizing: content-box;
          border-top: 1px solid #eeeeee;
        }
      }
    }
  }
}
</style>
