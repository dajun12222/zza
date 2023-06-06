<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    :key="$route.path"
    :class="['portal-design', 'container', addtionalFromAppClass]"
  >
    <div class="action">
      <div v-if="!addtionalFromAppClass" class="portal-info">
        <div class="portal-name">门户设计</div>
        <div v-if="currentPage && currentPage.defaultPage" class="resetDefault">
          <a-tooltip placement="bottom">
            <template slot="title">
              <span>恢复默认门户</span>
            </template>
            <span class="icon aufontAll" @click="resetDefault">&#xe7ad;</span>
          </a-tooltip>
        </div>
      </div>
      <div v-else class="portal-info">
        <div class="portal-name">首页</div>
        <div v-if="!(currentPage && currentPage.published)" class="unpublished">
          <span>未发布</span>
        </div>
        <a-switch
          v-else
          v-model="isOpen"
          checkedChildren="启用"
          unCheckedChildren="停用"
          @change="pageStatusChange"
        />
      </div>
      <a-radio-group
        v-if="!showDefault"
        buttonStyle="solid"
        class="design-box"
        :value="viewType"
        @change="onViewChange"
      >
        <a-radio-button
          v-for="(item, index) in views"
          :key="index"
          :value="item.value"
        >
          {{ item.text }}
        </a-radio-button>
      </a-radio-group>

      <span v-if="!showDefault" class="options-box">
        <a-tooltip placement="top">
          <template slot="title"> 预览 </template>
          <span @click="preview">
            <em class="iconfont aufontAll h-icon-all-eye1"></em>
          </span>
        </a-tooltip>
        <a-button style="margin-left: 0" @click="submitPageData(false)">
          保存
        </a-button>
        <a-button type="primary" @click="publish"> 发布 </a-button>
      </span>
    </div>
    <template v-if="!showDefault">
      <div class="portal-design-content">
        <h3-sider
          class="portal-design-panel"
          :options="leftSider"
          @resize="onSiderToggle"
        >
          <portal-design-panel
            :store="store"
            @deleteCurrentPage="deleteCurrentPage"
          />
        </h3-sider>
        <div ref="designerMind" class="designer-mind">
          <div
            class="designer-content"
            :class="{
              showPanel: currentEditor === 'design',
              actual: zoomType === 'actual',
            }"
          >
            <div class="board-zoom">
              <a-tooltip placement="top">
                <template slot="title">适应画布</template>
                <span
                  class="zoom-item"
                  :class="{ active: zoomType === 'fit' }"
                  @click="onZoomChange('fit')"
                >
                  <em class="icon aufontAll h-icon-all-fit_o"></em>
                </span>
              </a-tooltip>
              <a-tooltip placement="top">
                <template slot="title">实际尺寸</template>
                <span
                  class="zoom-item"
                  :class="{ active: zoomType === 'actual' }"
                  @click="onZoomChange('actual')"
                >
                  <em class="icon aufontAll h-icon-all-actual_o"></em>
                </span>
              </a-tooltip>
            </div>
            <div
              ref="designerContent"
              class="designer-box"
              :style="{
                'overflow-x': zoomType === 'fit' ? 'hidden' : 'auto',
                'overflow-y':
                  zoomType === 'actual' && pageType === 'APP'
                    ? 'auto'
                    : 'hidden',
              }"
            >
              <div class="designer-content-box" :style="contentBoxZoomStyle">
                <app-portal-design-header
                  v-if="addtionalFromAppClass"
                  :appCode="this.$route.query.appCode"
                />
                <div class="portal-designer-content">
                  <app-portal-design-aside
                    v-if="addtionalFromAppClass"
                    :appCode="this.$route.query.appCode"
                  />
                  <portal-designer
                    ref="portalDesigner"
                    class="drwing-board"
                    :store="store"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="JS-editor"
            :class="{ showPanel: currentEditor === 'JSS' }"
          >
            <template v-if="viewType === 'JSS'">
              <AppActionModal
                :store="store"
                :target="jsTarget"
                :width="editorWidth"
              />
            </template>
          </div>
          <div
            class="style-editor"
            :class="{ showPanel: currentEditor === 'CSS' }"
          >
            <template v-if="viewType === 'CSS'">
              <CustomStyleModal
                :store="store"
                :target="styleTarget"
                :width="editorWidth"
              />
            </template>
          </div>
        </div>
        <h3-sider
          class="portal-design-property"
          :options="rightSider"
          @resize="onSiderToggle"
        >
          <portal-design-property :store="store" />
        </h3-sider>
      </div>
    </template>

    <template v-else>
      <div class="portal-design-default">
        <div class="portal-design-default-content">
          <div class="img">
            <img src="./assets/img/drag-tips.png" alt="缺省" />
          </div>
          <div class="text">
            <span>您可以拖拉拽组件，自定义应用首页</span>
          </div>
          <div class="btn">
            <a-button type="primary" @click="newAppPage">搭建应用首页</a-button>
          </div>
        </div>
      </div>
    </template>

    <a-modal
      :visible="showUnsaveConfirm"
      :closable="false"
      :maskClosable="false"
      width="420px"
      wrapClassName="file-unsave-confirm"
    >
      <div class="unsave-confirm--content">
        <em class="icon aufontAll h-icon-all-question-circle"></em>
        <div class="title">您刚进行了修改，是否保存后再离开？</div>
      </div>

      <template slot="footer">
        <a-button key="cancel" @click="handleConfirmCancel">
          {{ $t('languages.Apps.Cancel') }}
        </a-button>
        <a-button key="unsave" @click="handleConfirmUnsave">
          {{ $t('languages.Apps.Unsave') }}
        </a-button>
        <a-button key="save" type="primary" @click="handleConfirmOk">
          {{ $t('languages.Apps.SaveAndLeave') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { RunMode } from '@cloudpivot-shared/ui-engine-vue';
// import { register } from '@cloudpivot-shared/ui-property-editor/extension';
import { register as register_ } from '@cloudpivot-shared/ui-property-editor/extension';
import { register } from '@cloudpivot-shared/ui-designer-common';
import { Button, Icon, Modal, Radio, Switch, Tooltip } from '@h3/antd-vue';
import H3Sider from 'cloudpivot-admin-core/src/common/sider/sider.vue';
import { DesignerStore } from 'cloudpivot-admin-core/src/store/designer-store-helper';
import { listApi, listParams } from 'cloudpivot/api';
import BigDialog from 'cloudpivot/common/src/components/shared/bigDialog.vue';
import { Component, Provide, Vue, Watch } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import appPortalDesignAside from './components/app-portal-design-aside.vue';
import appPortalDesignHeader from './components/app-portal-design-header.vue';
import AppActionModal from './custom-app-action/index.vue';
import CustomStyleModal from './custom-style-modal/index.vue';
import PortalDesignPanel from './design-panels/portal-design-panel.vue';
import PortalDesignProperty from './design-property/portal-attribute-layout.vue';
import PortalDesigner from './designer/portal-designer.vue';
import widgets from './designerCore/ui-extensions';
import mockDefaultPortal from './typings/mockDefaultPortal';

const PortalDesignModule = namespace('PortalDesign');

const AppCenterModule = namespace('Apps/AppCenter');

const hidePopUp = function () {
  const popUp = document.querySelector('.pop-up');
  const popUpShadow = document.querySelector('#edit-pop-up-shadow');
  if (popUp) {
    popUp.remove();
  }
  if (popUpShadow) {
    popUpShadow.remove();
  }
};

@Component({
  name: 'portal-design',
  components: {
    PortalDesignPanel,
    PortalDesignProperty,
    PortalDesigner,
    H3Sider,
    BigDialog,
    AButton: Button,
    ARadio: Radio,
    ARadioButton: Radio.Button,
    ARadioGroup: Radio.Group,
    AModal: Modal,
    AIcon: Icon,
    ATooltip: Tooltip,
    ASwitch: Switch,
    CustomStyleModal,
    AppActionModal,
    appPortalDesignAside,
    appPortalDesignHeader,
  },
  beforeRouteEnter(to, from, next) {
    console.log('进入路由');
    hidePopUp();
    next((vm) => {
      (vm as any).onRouteChange(to, from);
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log('刷新路由');
    const currFormDeleted = to.query.code === from.query.code;

    console.log(currFormDeleted);

    const vm = this as portalDesign;
    if (!currFormDeleted && vm.isEdit() && !vm.isDeleteCurrentPage) {
      vm.confirmSave().then(
        () => {
          next();
        },
        () => {
          next(false);
        },
      );
    } else {
      vm.isDeleteCurrentPage = false;
      next();
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log('离开路由');
    hidePopUp();
    const currFormDeleted = to.query.code === from.query.code;

    console.log(currFormDeleted);

    const vm = this as portalDesign;
    if (!currFormDeleted && vm.isEdit() && !vm.isDeleteCurrentPage) {
      vm.confirmSave().then(
        () => {
          vm.validRoute().then(
            () => {
              next();
            },
            () => {
              next(false);
            },
          );
        },
        () => {
          next(false);
        },
      );
    } else {
      vm.validRoute().then(
        () => {
          next();
        },
        () => {
          next(false);
        },
      );
    }
  },
})
export default class portalDesign extends Vue {
  @AppCenterModule.State('appInfo') appDetails: any;

  @PortalDesignModule.State('viewType') viewType: any;

  @PortalDesignModule.State('pageType') pageType: any;

  @PortalDesignModule.State('status') status: any;

  @PortalDesignModule.State('pagesData') pagesData: any[];

  @PortalDesignModule.State('currentPage') currentPage: any;

  @PortalDesignModule.Mutation('setView') setView: any;

  @PortalDesignModule.Mutation('setPageType') setPageType: any;

  @PortalDesignModule.Mutation('RESET_STATE') RESET_STATE: any;

  @PortalDesignModule.Action('loadPageList') loadPageList: any;

  @PortalDesignModule.Action('getPageDetail') getPageDetail: any;

  @PortalDesignModule.Action('savePage') savePage: any;

  @PortalDesignModule.Action('publishPage') publishPage: any;

  @PortalDesignModule.Action('enabledPage') enabledPage: any;

  @PortalDesignModule.Action('disabledPage') disabledPage: any;

  @PortalDesignModule.Action('createDefaultAppPage') createDefaultAppPage: any;

  store: any = null;

  showUnsaveConfirm: boolean = false;

  saveConfirmPromiseResolve: Function | null = null;

  saveConfirmPromiseReject: Function | null = null;

  init(code) {
    // beforeMount() {
    console.log(widgets);
    if (!this.store) {
      // @ts-ignore
      this.store = register.store = new DesignerStore(
        `${code}_${new Date().getTime()}`,
        this.$store,
      );
      this.store.setShowGridOprations(true);
      const schemas = this.$uiEngine.widgetStore.factory.schemas;
      for (const key in register_.packages) {
        schemas[key] = register_.packages[key].schema;
      }
      this.$uiEngine.runMode = RunMode.Design;
      this.$uiEngine.restSpace = 40;
    }
    console.log(this.store);
  }

  currentEditor: string = 'design';

  @Provide()
  getCurrentEditor() {
    return this.currentEditor;
  }

  // 自定义样式范围： 应用app\页面page
  styleTarget = 'page';

  // 自定义动作范围： 应用app\页面page
  jsTarget = 'page';

  editorWidth = 0;

  //设计区域类型汇总
  views: any = [
    {
      value: 'design',
      text: '画布',
    },
    {
      value: 'JSS',
      text: 'JS动作',
    },
    {
      value: 'CSS',
      text: 'CSS样式',
    },
  ];

  //左侧边栏配置数据
  leftSider = {
    width: 248,
    minWidth: 248,
    maxWidth: 248,
    direction: 'left',
    slider: true,
    collapsible: true,
  };

  //右侧边栏配置数据
  rightSider = {
    width: 300,
    minWidth: 300,
    maxWidth: 300,
    direction: 'right',
    slider: true,
    collapsible: true,
  };

  //是否显示预览界面
  showDefault: boolean = true;

  // 判断是否组件是否需要设置margin
  clacMargin: string[] = ['left', 'right'];

  //应用内首页设计
  isOpen: boolean = false;

  //当前画布缩放状态
  zoomType: string = 'fit';

  ifInitDefaultAppPage: boolean = false;

  @Watch('status')
  statusChange(val) {
    switch (this.status) {
      case 'ENABLE':
        this.isOpen = true;
        break;
      case 'DISABLED':
      default:
        this.isOpen = false;
        break;
    }
  }

  @Watch('$route')
  async onRouteChange(to, from) {
    //视图接口调用梳理：路由切换时，特殊路由不处理，避免过多接口调用\
    // console.log('路由改变', to, from);
    const { name, params, query } = to;
    if (name === 'portal-design') {
      this.setPageType('PORTAL');
      this.showDefault = false;
    } else if (name === 'app-portal-design') {
      this.setPageType('APP');
    } else {
    }

    if (query?.init === 'false') {
      this.showDefault = false;
    }

    await this.loadPageList(query);
    this.init(query.code);

    if (!this.pagesData.length && query.type === 'APP') {
      // portalDesigner.initPage(query, true);
      this.showDefault = true;
    } else {
      this.showDefault = false;
      setTimeout(() => {
        this.initResize();
        const portalDesigner = this.$refs.portalDesigner as any;
        portalDesigner.initPage(query);
      }, 300);
    }
  }

  newAppPage() {
    this.showDefault = false;
    setTimeout(() => {
      this.initResize();
      const { query } = this.$route;
      const portalDesigner = this.$refs.portalDesigner as any;
      portalDesigner.initPage(query, true);
      this.ifInitDefaultAppPage = true;
    }, 300);
  }

  onViewChange(evt: any) {
    const type = evt.target.value;
    this.currentEditor = type;
    this.setView(type);
  }

  onResizeEnd() {
    const designer = this.$refs.designerMind;
    if (designer) {
      // @ts-ignore
      this.editorWidth = designer.clientWidth;
    }
  }

  async preview() {
    const res: any = await this.submitPageData(false);
    if (res.errcode === 0) {
      if (this.addtionalFromAppClass) {
        window.open(
          `/admin/#/app-portal-design-preview/${res.data.code}`,
          '_blank',
        );
      } else {
        window.open(
          `/admin/#/portal-design-preview/${res.data.code}`,
          '_blank',
        );
      }
    }
  }

  publish() {
    let pageTitle = '确定要应用该工作台吗？';
    let pageContent = '应用后将替换当前正在使用的工作台';
    if (this.pageType === 'APP') {
      // pageTitle = '确定要发布应用首页吗？';
      // pageContent = '发布后，进入应用将默认进入应用首页';
      this.submitPageData(true);
      return;
    } else if (!this.currentPage.defaultPage) {
      pageTitle = '确定要发布该页面吗？';
      pageContent = '发布后，请在工作台配置链接，链到该页面';
    } else {
      pageTitle = '确定要应用该工作台吗？';
      pageContent = '应用后将替换当前正在使用的工作台';
    }
    const vm = this;
    this.$confirm({
      title: pageTitle,
      content: pageContent,
      class: 'publish-portal-confirm',
      icon: () =>
        vm.$createElement('a-icon', {
          props: {
            type: 'question-circle',
            theme: 'filled',
          },
        }),
      okType: 'primary',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        vm.submitPageData(true);
      },
    });
  }

  async submitPageData(publish: boolean) {
    const designer = this.$uiCurrentPage.snapshot(false);
    console.log('designer', designer);
    console.log('this.store', this.store);
    const customAction = this.store ? this.store.customAction : null;
    const customStyle = this.store ? this.store.customStyle : '';

    Object.values(designer.document).forEach((item: any) => {
      if (item.type === 'Page') {
        item.eventHandlers = {
          enter: [
            {
              type: 'custom',
              argu: 'onPageEnter',
              name: 'onPageEnter',
            },
          ],
        };
      }
    });
    const pageSnapshot = {
      customAction,
      customStyle,
      designer: designer.document,
    };
    this.currentPage.draftPortalJson = JSON.stringify(pageSnapshot);
    if (this.ifInitDefaultAppPage) {
      if (publish) {
        this.currentPage.publishedPortalJson = this.currentPage.draftPortalJson;
        this.currentPage.published = true;
        this.isOpen = true;
      }
      this.createDefaultAppPage(this.currentPage).then((res) => {
        if (res.errcode === 0) {
          this.$message.success(publish ? '发布成功' : '保存成功');
        } else {
          this.$message.error(
            res.errmsg || (publish ? '发布失败' : '保存失败'),
          );
        }
      });
    } else {
      if (publish) {
        this.currentPage.publishedPortalJson = this.currentPage.draftPortalJson;
        this.currentPage.published = true;
        this.publishPage(this.currentPage).then((res) => {
          if (res.errcode === 0) {
            this.$message.success('发布成功');
          } else {
            this.$message.error(res.errmsg || '发布失败');
          }
        });
      } else {
        const res: any = await this.savePage(this.currentPage);
        if (res.errcode === 0) {
          this.$message.success('保存成功');
        } else {
          this.$message.error(res.errmsg || '保存失败');
        }
        return res;
      }
    }
  }

  /**
   * @desc 表单设计器控件和控制器显示隐藏回调
   */
  onSiderToggle(str) {
    // 动态设置margin
    this.setClacMagin(str);

    setTimeout(() => {
      this.onResizeEnd();
    }, 300);
  }

  setClacMagin(str: string) {
    let arr = this.clacMargin;
    if (arr.includes(str)) {
      arr = arr.filter((item) => item !== str);
    } else {
      arr.push(str);
    }
    this.clacMargin = arr;
  }

  /**
   * 根据路由判断是否为应用内门户设计器
   * 返回额外的类名
   */
  get addtionalFromAppClass() {
    const route = (this as any).$route;
    if (route.name === 'app-portal-design') {
      return route.name;
    }
    return '';
  }

  /**
   * 路由刷新或离开时，校验是否已经修改了数据
   */
  async validRoute() {
    const changed = false;
    this.isDeleteCurrentPage = false;
    if (!changed) {
      this.RESET_STATE();
      const portalDesigner = this.$refs.portalDesigner as any;
      portalDesigner?.pageExit();
    }
  }

  resetDefault() {
    const vm = this;
    this.$confirm({
      title: '确定恢复默认门户吗？',
      content: '你当前的设置将被全部清空，恢复为系统提供的标准门户，请谨慎操作',
      class: 'reset-default-confirm',
      icon: () =>
        vm.$createElement('a-icon', {
          props: {
            type: 'question-circle',
            theme: 'filled',
          },
        }),
      okType: 'danger',
      okText: '恢复',
      cancelText: '取消',
      onOk() {
        vm.resetDefaultDashboard();
      },
    });
  }

  resetDefaultDashboard() {
    console.log('恢复默认工作台');
    this.currentPage.draftPortalJson = JSON.stringify(mockDefaultPortal);
    this.currentPage.publishedPortalJson = this.currentPage.draftPortalJson;
    this.publishPage(this.currentPage).then((res) => {
      if (res.errcode === 0) {
        this.$message.success('恢复成功');
      } else {
        this.$message.error(res.errmsg || '恢复成功');
      }
      const { query } = this.$route;
      const portalDesigner = this.$refs.portalDesigner as any;
      portalDesigner.pageExit();
      this.init(query.code);
      portalDesigner.initPage(query);
    });
  }

  pageStatusChange(val) {
    console.log(val, '-----BAL');
    console.log(this.isOpen, '------------ISOPEN');
    if (this.isOpen) {
      this.enabledPage(this.currentPage).then((res) => {
        if (res.errcode === 0) {
          this.$message.success('启用成功');
        } else {
          this.$message.error('启用失败');
          this.isOpen = true;
        }
      });
    } else {
      this.disabledPage(this.currentPage).then((res) => {
        if (res.errcode === 0) {
          this.$message.success('停用成功');
        } else {
          this.$message.error('停用失败');
          this.isOpen = false;
        }
      });
    }
  }

  isEdit() {
    if (this.showDefault) {
      return false;
    }
    const designer = this.$uiCurrentPage.snapshot(false);
    console.log(designer);
    const customAction = null;
    const customStyle = '';
    const pageSnapshot = {
      customAction,
      customStyle,
      designer: designer.document,
    };
    const portalJson = JSON.stringify(pageSnapshot);
    const defaultPortalJson = this.currentPage.draftPortalJson;

    if (!defaultPortalJson && !!portalJson) {
      return true;
    }

    if (
      !this.isDeepObjectEqual(
        JSON.parse(portalJson),
        JSON.parse(defaultPortalJson),
      )
    ) {
      return true;
    }
    return false;
  }

  confirmSave() {
    const _this = this;
    this.showUnsaveConfirm = true;

    return new Promise((resolve, reject) => {
      this.saveConfirmPromiseResolve = resolve;
      this.saveConfirmPromiseReject = reject;
    });
  }

  handleConfirmCancel() {
    this.showUnsaveConfirm = false;
    if (this.saveConfirmPromiseReject) {
      this.saveConfirmPromiseReject();
      this.saveConfirmPromiseReject = null;
    }
  }

  handleConfirmUnsave() {
    this.showUnsaveConfirm = false;
    if (this.saveConfirmPromiseResolve) {
      this.saveConfirmPromiseResolve();
      this.saveConfirmPromiseResolve = null;
    }
  }

  handleConfirmOk() {
    this.submitPageData(false).then(
      () => {
        this.handleConfirmUnsave();
      },
      () => {
        this.handleConfirmCancel();
      },
    );
  }

  // 判断obj1、obj2是否相同属性
  isDeepObjectEqual(obj1, obj2) {
    //1.如果是比较对象===，返回true
    if (obj1 === obj2) {
      return true;
    }

    //2.如果比较的是两个方法，转成字符串比较
    if (typeof obj1 === 'function' && typeof obj2 === 'function') {
      return obj1.toString() === obj2.toString();
    }

    //3如果obj1和obj2都是Date实例，获取毫秒值比较
    if (obj1 instanceof Date && obj2 instanceof Date) {
      return obj1.getTime() === obj2.getTime();
    }

    //4如果比较是两个类型不一致,无须比较直接返回false
    if (
      Object.prototype.toString.call(obj1) !==
        Object.prototype.toString.call(obj2) ||
      typeof obj1 !== 'object'
    ) {
      if (!obj1 && !obj2) {
        // ''和undefined 可以认为是一致的
        return true;
      }
      return false;
    }

    // options===""和options不存在当成他们是一直的
    if (
      obj1.hasOwnProperty('options') &&
      obj1.options === '' &&
      !obj2.hasOwnProperty('options')
    ) {
      obj2.options = '';
    }

    //5.获取对象所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性
    const obj1Props = Object.getOwnPropertyNames(obj1).filter(
      (el) => !['__ob__'].includes(el) && obj1[el] && obj2[el],
    );
    const obj2Props = Object.getOwnPropertyNames(obj2).filter(
      (el) => !['__ob__'].includes(el) && obj2[el] && obj1[el],
    );

    //自身属性长度相等,
    if (obj1Props.length !== obj2Props.length) {
      return false;
    }

    //递归调用判断每一个属性值是否相等
    return obj1Props.every((prop) =>
      this.isDeepObjectEqual(obj1[prop], obj2[prop]),
    );
  }

  mounted() {
    this.initResize();
  }

  initResize() {
    this.getContentBoxZoomStyle();
    const resizeObserver = new ResizeObserver(() => {
      {
        this.getContentBoxZoomStyle();
      }
    });
    const designerContent = this.$refs['designerContent'] as HTMLElement;
    if (designerContent) {
      resizeObserver.observe(designerContent);
    }
  }

  /**
   * 实际尺寸与适应画布切换事件
   */
  onZoomChange(type) {
    console.log(type);
    this.zoomType = type;
  }

  scaleSize: number = 1;

  contentBoxZoomStyle: any = {};

  @Watch('zoomType', { immediate: true })
  getContentBoxZoomStyle(val?) {
    const innerWidth = (window as any).innerWidth;
    let designerContent = this.$refs['designerContent'] as HTMLElement;
    if (designerContent) {
      designerContent.scrollLeft = 0;
      designerContent.scrollTop = 0;
      switch (this.zoomType) {
        case 'fit':
          this.scaleSize = designerContent?.offsetWidth / innerWidth;
          this.contentBoxZoomStyle = {
            scale: this.scaleSize,
            height: designerContent?.offsetHeight / this.scaleSize + 'px',
          };
          // @ts-ignore
          this.$uiEngine.scale = this.scaleSize;
          break;
        case 'actual':
        default:
          this.contentBoxZoomStyle = {
            height: '100%',
          };
          this.$uiEngine.scale = 1;
          break;
      }
    } else {
      setTimeout(() => {
        designerContent = this.$refs['designerContent'] as HTMLElement;
        if (designerContent) {
          designerContent.scrollLeft = 0;
          designerContent.scrollTop = 0;
          switch (this.zoomType) {
            case 'fit':
              this.scaleSize = designerContent?.offsetWidth / innerWidth;
              this.contentBoxZoomStyle = {
                scale: this.scaleSize,
                height: designerContent?.offsetHeight / this.scaleSize + 'px',
              };
              // @ts-ignore
              this.$uiEngine.scale = this.scaleSize;
              break;
            case 'actual':
            default:
              this.contentBoxZoomStyle = {
                height: '100%',
              };
              this.$uiEngine.scale = 1;
              break;
          }
        }
      }, 500);
    }
  }

  isDeleteCurrentPage: boolean = false;

  deleteCurrentPage() {
    this.isDeleteCurrentPage = true;
    this.$router.push({
      name: 'portal-design',
      query: {
        appCode: undefined,
        code: 'defaultPortalDashboard',
        type: this.pageType,
        defaultPage: 'true',
      },
    });
  }
}
</script>

<style lang="less" scoped>
.portal-design {
  display: flex;
  flex-direction: column;
  background: #efefee !important;
  .designer-mind {
    flex-grow: 1;
    position: relative;
    overflow: hidden;
  }
  .designer-content {
    padding: 20px 20px 0;
    height: 100%;
    position: relative;
    .board-zoom {
      position: absolute;
      top: 5px;
      right: 30px;
      display: flex;
      border-radius: 2px;
      background: #f6f7f9;
      z-index: 9999;
      height: 24px;
      line-height: 24px;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
      .zoom-item {
        padding: 0 6px;
        cursor: pointer;
        &.active {
          background: #bed4ff;
          .aufontAll {
            color: #0060ff;
          }
        }
        &:hover {
          .aufontAll {
            color: #0060ff;
          }
        }
        .aufontAll {
          font-size: 14px;
          color: rgba(17, 18, 24, 0.5);
        }
      }
    }
    .designer-box {
      width: 100%;
      height: 100%;
      overflow-y: hidden;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }
    .designer-content-box {
      width: 100vw;
      transform-origin: top left;
      min-height: 100%;
      height: 100vh;
    }
    &.actual {
      padding: unset;
    }
  }

  .portal-designer-content {
    display: flex;
    height: 100%;
  }
  .drwing-board {
    padding-bottom: 4px;
    height: 100% !important;
    overflow: hidden;
    background: #f6f7f9;
  }

  .designer-content,
  .JS-editor,
  .style-editor {
    height: 100%;
    width: 100%;
    display: none;
  }
  .showPanel {
    display: block;
  }
  &-content {
    overflow: auto;
    display: flex;
    justify-content: space-between;
    flex: auto;
    z-index: 0;
    padding: 0px;
    /deep/.portal-design-panel {
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
      z-index: 3;
    }
    /deep/.portal-design-property {
      box-shadow: -1px 0px 0px 0px #e4e4e4;
      z-index: 3;
    }
    /deep/.h3-sider-body {
      overflow: hidden;
      .portal-panel {
        border-top: solid 1px #e4e4e4;
        background: #fff;
        height: 100%;
      }
    }
  }
  &-default {
    background: #ffffff;
    height: 100%;
    position: relative;
    .portal-design-default-content {
      position: absolute;
      text-align: center;
      top: calc(42% - 135px);
      width: 100%;
      .img > img {
        width: 204px;
        height: 204px;
      }
      .text {
        height: 22px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(17, 18, 24, 0.5);
        line-height: 22px;
      }
      .btn {
        margin-top: 12px;
      }
    }
  }

  .action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    padding-bottom: 12px;
    padding-left: 24px;
    background: #ffffff;
    // box-shadow: 0px 1px 0px 0px #e4e4e4;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05),
      0px 1px 0px 0px rgba(228, 228, 228, 0.5);
    min-height: 50px;
    max-height: 50px;
    z-index: 3;

    & button {
      margin-left: 8px;

      & > em {
        font-size: 14px;
        margin-right: 8px;
      }
      & > span {
        margin-left: 0;
      }
    }
    .portal-info {
      display: flex;
      align-items: center;
      flex: 1;
      .portal-name {
        height: 25px;
        font-size: 16px;
        font-weight: 600;
        color: #111218;
        margin-right: 8px;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 126px;
        overflow: hidden;
      }
      .resetDefault {
        font-size: 16px;
        color: rgba(17, 18, 24, 0.5);
        cursor: pointer;
        &:hover {
          color: #2970ff;
        }
      }
      .unpublished {
        height: 25px;
        padding: 2.5px 0;
        > span {
          height: 20px;
          display: inline-block;
          padding: 0 8px;
          background: rgba(17, 18, 24, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(17, 18, 24, 0.1);
          font-size: 12px;
          font-weight: 400;
          color: #111218;
          line-height: 18px;
        }
      }
    }

    .design-box {
      text-align: center;
      border-radius: 2px;
      background: #f1f2f6;
      height: 32px;
      padding: 3px;
      display: flex;
      /deep/ .ant-radio-button-wrapper {
        border: none;
        font-size: 12px;
        color: #111218;
        background-color: transparent;
        height: 26px;
        line-height: 26px;
        border-radius: none;
        padding: 0 16px;
        width: 80px;
      }
      /deep/ .ant-radio-button-wrapper:not(:first-child)::before,
      .ant-radio-button-wrapper-checked:not(
          .ant-radio-button-wrapper-disabled
        )::before {
        color: #fff;
        background-color: #ddd !important;
        opacity: 1;
        height: 12px;
        width: 1px;
        top: 50%;
        margin-top: -6px;
      }
      /deep/ .ant-radio-button-wrapper-checked {
        outline: none;
        background-color: #fff;
        box-shadow: none;
        border-radius: 2px;
        &::before {
          display: none;
        }
      }
    }

    .options-box {
      margin-right: 24px;
      color: rgba(17, 18, 24, 0.5);
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      span {
        cursor: pointer;
        margin-right: 20px;
      }
      .iconfont {
        font-size: 18px;
        &:hover {
          color: #2970ff;
        }
      }
    }
  }
  .design__preview {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: #f4f6fc;
  }
  /deep/ *::-webkit-scrollbar {
    width: 6px;
    &-thumb {
      background-color: rgba(17, 18, 24, 0.25);
    }
  }
}

.app-portal-design {
  top: 0 !important;
  .drwing-board {
    height: 100% !important;
    padding-bottom: 63px;
    overflow: hidden;
    background: #f6f7f9;
  }
  /deep/.h3-sider.left {
    margin-top: 1px;
  }
  .action {
    max-height: 60px;
    min-height: 60px;
  }
}
/deep/.property-panel {
  .property-grid-row:not(:last-child) {
    margin-bottom: 17px;
  }

  .ant-collapse-borderless {
    background: #fff;
    .ant-collapse-item {
      border-bottom: none;
    }
  }
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding-top: 9px;
    padding-bottom: 9px;
    font-size: 13px;
    font-weight: 600;
    color: #111218;
    line-height: 22px;
  }
  .property-item > .property-label .subtitle {
    font-weight: 600;
  }
  .dropdown-botton {
    height: 30px;
    line-height: 30px;
  }
  .ant-input {
    height: 30px;
    line-height: 30px;
  }
  .text-area-box {
    height: 60px;
    line-height: inherit;
  }
  .input-number-wraper .ant-input-number {
    height: 30px;
    line-height: 25px;
    border-radius: 2px;
  }
  .ant-input-number-input-wrap .ant-input-number-input {
    color: #111218;
  }

  .ant-select-sm .ant-select-selection--single,
  .ant-select-sm .ant-select-selection__rendered {
    height: 30px;
    line-height: 30px;
  }

  .ant-radio-disabled + span {
    color: #111218;
  }
  .icon-left {
    flex: inherit;
    width: 18px;
    height: 17px;
    margin-top: 6px;
    border-radius: 0;
    margin-left: 8px;
    border: 1px solid #d4d5d6;
  }
  .icon-right {
    border: none;
    height: 30px;
    line-height: 30px;
  }
}
</style>
<style lang="less">
.publish-portal-confirm,
.reset-default-confirm {
  .ant-modal {
    padding-bottom: unset;
    top: calc(50% - 96px);
  }
  .ant-modal-confirm-body {
    .ant-modal-confirm-title {
      height: 24px;
      font-size: 16px;
      font-weight: 600;
      color: #111218;
      line-height: 24px;
    }
    .ant-modal-confirm-content {
      font-size: 14px;
      font-weight: 400;
      color: #111218;
      line-height: 22px;
      margin-top: 12px;
    }
  }
  .ant-modal-confirm-btns {
    .ant-btn-danger {
      background: #f0353f;
      border-radius: 2px;
      &:hover {
        background: #fc6063;
      }
      &:active {
        background: #c92230;
      }
    }
  }
}
.publish-portal-confirm {
  .ant-modal {
    top: calc(50% - 85px);
  }
}
.file-unsave-confirm {
  .ant-modal {
    padding: unset;
    top: calc(50% - 67.5px);
    .ant-modal-body {
      padding: 32px 32px 0;
      .unsave-confirm--content {
        padding: unset;
        display: flex;
        align-items: center;
        height: 24px;
        line-height: 24px;
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
      }
    }
    .ant-modal-footer {
      padding: 23px 32px 24px;
    }
  }
}
</style>
