<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->

<template>
  <div
    id="portal-design-panel"
    :class="['portal-design-panel', addtionalFromAppClass]"
  >
    <h3-size-slider
      v-if="!addtionalFromAppClass"
      class="h3-sider"
      :style="style"
      :left="false"
      :slider="false"
      :right="false"
      :bottom="true"
      :minHeight="112"
      :maxHeight="portalDesignPanelHeight - 248"
      @resize="onResize"
    >
      <div class="block-up">
        <PageList @deleteCurrentPage="deleteCurrentPage" />
      </div>
    </h3-size-slider>
    <a-tabs v-model="activeKey" :style="tabStyle">
      <a-tab-pane key="1" tab="组件">
        <div class="component-list-content">
          <componentList
            :pageType="'pc'"
            :searchable="false"
            :addByclick="false"
            :siderCollapsed="false"
            :widgetDisplayMode="widgetDisplayMode"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane
        v-if="!addtionalFromAppClass && pageCode === 'defaultPortalDashboard'"
        key="2"
        tab="模板"
      >
        <div class="template-content">
          <div
            v-for="(item, index) in templateList"
            :key="index"
            @click="onTemplateChange(item)"
          >
            <div class="img-box">
              <img :src="item.imgUrl" alt="" />
            </div>
            <p>{{ item.name }}</p>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>

    <a-modal
      :visible="showConfirm"
      :closable="false"
      :maskClosable="false"
      width="420px"
      wrapClassName="change-template-confirm"
    >
      <div class="unsave-confirm--content">
        <em class="icon aufontAll h-icon-all-question-circle"></em>
        <div class="title">确定要更换模版吗？</div>
        <div class="tips">更换模版后，您可以在模版基础上进行修改。</div>
      </div>

      <template slot="footer">
        <a-button key="cancel" @click="showConfirm = false">
          {{ $t('languages.Apps.Cancel') }}
        </a-button>
        <a-button key="ok" @click="changeTemplate">
          {{ $t('languages.Apps.Ok') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import PageList from './page-list.vue';
import { Tabs, Modal, Button } from '@h3/antd-vue';
import componentList from '@cloudpivot-shared/ui-designer/src/designer/component-list/component-list.vue';
import common from 'cloudpivot/common/pc';

@Component({
  name: 'portal-design-panel',
  components: {
    PageList,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    componentList,
    H3SizeSlider: common.components.H3SizeSlider,
    AModal: Modal,
    AButton: Button,
  },
})
export default class PortalDesignPanel extends Vue {
  activeKey: string = '1';

  widgetDisplayMode: string = 'picture'; //组件列表展现形式

  lastHeight = 0;

  style: any = {};

  tabStyle: any = {};

  @Prop()
  store!: any;

  //模板初始数据
  templateList: any = [
    {
      name: '横向导航模板',
      value: 'row',
      imgUrl: require('../assets/img/横向导航模板@2x.png'),
    },
    {
      name: '纵向导航模板',
      value: 'col',
      imgUrl: require('../assets/img/纵向导航模板@2x.png'),
    },
  ];

  pageCode: any = 'defaultPortalDashboard';

  get addtionalFromAppClass() {
    const route = (this as any).$route;
    if (route.name === 'app-portal-design') {
      return route.name;
    }
    return '';
  }

  portalDesignPanelHeight: number = 0;

  @Watch('$route', {
    deep: true,
    immediate: true,
  })
  routeChange() {
    if (this.$route.query) {
      this.pageCode = this.$route.query.code;
      //切换至组件列表
      if (this.pageCode !== 'defaultPortalDashboard') {
        this.activeKey = '1';
      }
    }
  }

  created() {
    if (this.addtionalFromAppClass) {
      this.$uiEngine.widgetStore.widgets.ColMenu.info.group = null;
      this.$uiEngine.widgetStore.widgets.RowMenu.info.group = null;
    } else {
      this.$uiEngine.widgetStore.widgets.ColMenu.info.group = 'nav';
      this.$uiEngine.widgetStore.widgets.RowMenu.info.group = 'nav';
    }

    setTimeout(() => {
      const portalDesignPanelDocument = document.getElementById(
        'portal-design-panel',
      );
      this.portalDesignPanelHeight =
        portalDesignPanelDocument?.offsetHeight || 896;
      if (!this.addtionalFromAppClass) {
        this.style = {
          height: '166px',
        };
        this.tabStyle = {
          height: `${this.portalDesignPanelHeight - 166}px`,
        };
      }
    }, 500);
  }

  onResize(data: { height: number }) {
    this.lastHeight = data.height;
    this.style = {
      height: `${data.height}px`,
    };
    this.tabStyle = {
      height: `${this.portalDesignPanelHeight - data.height}px`,
    };
    setTimeout(() => {
      this.$emit('resize', data);
    }, 500);
  }

  /**
   * 切换模板
   */
  onTemplateChange(item: any) {
    console.log(item);
    console.log('模板点击事件');

    // @ts-ignore
    window.$uiCurrentPage = this.$uiCurrentPage;

    const pageData = this.$uiCurrentPage.snapshot().document;

    const values = Object.values(pageData);
    if (
      values.every((el: any) => {
        return ['Page', 'RowMenu', 'ColMenu'].includes(el.type);
      })
    ) {
      this.showConfirm = true;
      this.pageData = values;
      this.item = item;
    } else {
      this.pageData = '';
      this.item = '';
      (this as any).$message.error('当前已配置其他组件，不能更换模版!');
    }
  }

  showConfirm: boolean = false;

  pageData: any = '';

  item: any = '';

  changeTemplate() {
    this.showConfirm = false;
    const pageData = this.pageData;
    const type = this.item.value;

    const RowMenu = pageData.find((el: any) => el.type === 'RowMenu');
    const ColMenu = pageData.find((el: any) => el.type === 'ColMenu');
    // const Page = pageData.find((el: any) => el.type === "Page");

    let rowProps: any = '';
    if (ColMenu) {
      rowProps = ColMenu.props;
    } else if (RowMenu) {
      rowProps = RowMenu.props;
    } else {
      rowProps = this.$uiEngine.widgetStore.createPropsData(
        'RowMenu',
        'RowMenu',
      );
    }

    let json: any = {};
    if (type === 'row') {
      json = require('./templates/row-template');
      json['RowMenu1']['props'] = rowProps;
    } else {
      let colProps: any = '';
      if (ColMenu) {
        colProps = ColMenu.props;
      } else if (RowMenu) {
        colProps = RowMenu.props;
      } else {
        colProps = this.$uiEngine.widgetStore.createPropsData(
          'ColMenu',
          'ColMenu',
        );
      }

      json = require('./templates/col-template');
      json['ColMenu2']['props'] = colProps;
    }

    if (RowMenu) {
      this.$uiCurrentPage.documentApp.remove(RowMenu.id);
    }
    if (ColMenu) {
      this.$uiCurrentPage.documentApp.remove(ColMenu.id);
    }

    Object.values(json).forEach((item: any) => {
      this.$uiCurrentPage.documentApp.insert(
        'defaultPortalDashboard',
        -1,
        item,
      );
    });
  }

  deleteCurrentPage() {
    this.$emit('deleteCurrentPage');
  }
}
</script>

<style lang="less" scoped>
.portal-design-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  /deep/.ant-tabs-bar {
    padding: 0 16px;
  }
  /deep/.ant-tabs-content {
    height: calc(100% - 60px);
    .ant-tabs-tabpane {
      overflow: auto;
    }
  }
  /deep/.component-panel {
    .ant-collapse-header {
      font-size: 13px;
      font-weight: 600;
      color: #111218;
    }
    .ant-collapse-content {
      padding: 4px 16px;
    }
    .ant-collapse-item {
      background: #fff;
    }

    .ant-collapse-content-box {
      padding: 0;
      > div {
        margin-right: 12px;
        margin-bottom: 20px;
        &:nth-child(2n) {
          margin-right: 0;
        }
      }
    }
    .component-item.widget-thumbnail-mode {
      width: auto;
      height: auto;
      border-radius: 2px;
    }
    .component-item img {
      padding: 18px 6px;
      margin-bottom: 8px;
      width: 98px;
      height: 88px;
      background: #f6f7f9;
      border-radius: 2px;
      border: 1px dashed #dde4eb;
      &:hover {
        border: 1px dashed #2970ff;
        background: #eef4fd;
      }
    }
    .component-item label {
      width: 100%;
      color: #111218;
    }
  }
  .h3-sider {
    height: 166px;
    min-height: 112px;
    max-height: calc(100% - 248px);
  }
  .template-content {
    padding: 0 16px;
    > div {
      margin-bottom: 20px;
      display: inline-block;
      width: 101px;
      margin-right: 12px;
      cursor: pointer;
      &:nth-child(2n) {
        margin-right: 0;
      }
    }
    .img-box {
      padding: 11px;
      margin-bottom: 8px;
      background: #f1f2f6;
      border-radius: 2px;
      border: 1px dashed #dde4eb;
      &:hover {
        border: 1px dashed #2970ff;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    p {
      text-align: center;
      height: 20px;
      font-size: 12px;
      color: #111218;
      line-height: 20px;
    }
  }
  .block-up {
    // height: 188px;
    height: 100%;
    border-top: thin solid #e4e4e4;
    border-bottom: thin solid #e4e4e4;
  }
}

.change-template-confirm {
  .ant-modal {
    padding: unset;
    top: calc(50% - 67.5px);
    .ant-modal-body {
      padding: 32px 32px 0;
      .unsave-confirm--content {
        padding: unset;
        display: flex;
        align-items: center;
        line-height: 24px;
        flex-wrap: wrap;
        padding-top: 24px;
        > em {
          font-size: 24px;
          margin-right: 16px;
          color: #faad14;
        }
        .title {
          height: 22px;
          font-size: 14px;
          font-weight: 600;
          color: #111218;
          line-height: 22px;
        }
        .tips {
          padding-left: 40px;
          padding-top: 8px;
        }
      }
    }
    .ant-modal-footer {
      padding: 23px 32px 24px;
    }
  }
}
</style>
<style lang="less">
.widget-discription {
  .ant-popover-inner {
    > div {
      padding: 12px 11px;
      .ant-popover-title {
        width: 192px;
        padding: 0;
        line-height: 20px;
        min-height: 20px;
        margin-bottom: 4px;
        font-size: 12px;
        font-weight: 600;
      }
      .ant-popover-inner-content {
        width: 192px;
        padding: 0;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
}
</style>
