<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->

<template>
  <ui-runtime />
  <!-- <UICanvas ref="uiCanvas" /> -->
</template>

<script lang="ts">
// import UICanvas from '@cloudpivot-shared/ui-designer/src/canvas/ui-canvas.vue';
import {
  DocumentNodeDto,
  LifecycleHooks,
  OpenPageHooks,
  OpenPageOptions,
  PageDataProvider,
  PageGetParams,
  PageInfo,
  VueRuntimeContext,
} from '@cloudpivot-shared/ui-engine-vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import mockDefaultPortal from '../typings/mockDefaultPortal';
import widgets from './../designerCore/ui-extensions';
import { ComponentType } from './../designerCore/ui-extensions/enums';

const PortalDesignModule = namespace('PortalDesign');

const dataProvider = {
  get(params: PageGetParams): Promise<PageInfo> {
    const page = Object.assign({}, params) as PageInfo;
    return Promise.resolve(page);
  },
} as PageDataProvider;

@Component({
  name: 'portal-designer',
  components: {
    // UICanvas
  },
})
export default class PortalDesigner extends Vue {
  @PortalDesignModule.State('currentPage') currentPage: any;

  @PortalDesignModule.Mutation('setCurrentPage') setCurrentPage: any;

  @PortalDesignModule.Mutation('setDefaultAppPage') setDefaultAppPage: any;

  @PortalDesignModule.Action('getPageDetail') getPageDetail: any;

  @PortalDesignModule.Action('createDefaultAppPage') createDefaultAppPage: any;

  @PortalDesignModule.Action('createDefaultPortalPage')
  createDefaultPortalPage: any;

  @PortalDesignModule.Action('getDefaultPortalPage') getDefaultPortalPage: any;

  @PortalDesignModule.Action('loadPageList') loadPageList: any;

  @Prop()
  store!: any;

  // beforeMount() {
  async initPage(params: any, init: boolean = false) {
    if (init) {
      // const res = await this.createDefaultAppPage({ appCode: params.appCode });
      // this.setCurrentPage(res.data);
      this.setDefaultAppPage(params);
    } else {
      if (params.defaultPage === 'true') {
        const defaultPortal = await this.getDefaultPortalPage();
        if (!defaultPortal.data) {
          const defaultPortalParams = {
            draftPortalJson: JSON.stringify(mockDefaultPortal),
            publishedPortalJson: JSON.stringify(mockDefaultPortal),
          };
          await this.createDefaultPortalPage(defaultPortalParams);
          this.loadPageList(params);
        }
      } else {
        await this.getPageDetail(params);
      }
    }

    const opts: OpenPageOptions = {
      page: {
        dataProvider,
        isEntry: true,
        createPageContext: () => this.createContext(this.store),
        params: {
          code: params.code,
        },
      },
    };

    const hooks: OpenPageHooks = {
      [LifecycleHooks.PageLoaded]: (info) => {
        // 如果页面数据是空的，创建一个页面组件
        if (!info.pageInfo.data) {
          info.pageInfo.data = this.newPage();
        }
      },
      [LifecycleHooks.PageInited]: (context) => {
        (window as any).h3ui = context.runtimeContext;
        const nodes = this.$uiCurrentPage.documentApp.getFirstLevel();
        if (nodes.length > 0) {
          this.store.active = nodes[0];
        }

        this.$uiEngine.currentPage.documentApp.event.subscribe((evt: any) => {
          if (
            evt.type === 'afterRemove' &&
            this.store.active.id === evt.nodes[0].id
          ) {
            const nodes = this.$uiCurrentPage.documentApp.getFirstLevel();
            if (nodes.length > 0) {
              this.store.active = nodes[0];
            } else {
              this.store.active = null;
            }
          }

          if (evt.type === 'afterInsert') {
            this.store.active = evt.nodes[0];
          }
        });
      },
    };

    this.$uiEngine.openPage(opts, hooks);
  }

  createContext(store: any) {
    const context = new VueRuntimeContext(this.$uiEngine, store);
    return context;
  }

  newPage() {
    const draftPortalJson = this.currentPage.draftPortalJson;
    if (draftPortalJson) {
      const { customAction, customStyle, designer } =
        JSON.parse(draftPortalJson);

      this.store.setCustomAction(customAction);
      this.store.setCustomStyle(customStyle);

      if (designer) {
        return {
          document: designer,
        };
      } else {
        return this.createEmptyPage();
      }
    } else {
      return this.createEmptyPage();
    }
  }

  createEmptyPage() {
    const document: Record<string, any> = {};

    const pageWidget = widgets.find((w) => w.info.type === ComponentType.Page);
    let page: DocumentNodeDto | null = null;
    if (pageWidget) {
      const type = pageWidget.info.type;
      const props = this.$uiEngine.widgetStore.createPropsData(type, type);
      page = {
        id: this.currentPage.code,
        type,
        props,
        parentId: null,
      } as DocumentNodeDto;
      document[page.id] = page;
    }

    return {
      document,
    };
  }

  pageExit() {
    this.$uiEngine.leaveCurrentPage();

    if ((window as any).h3ui) {
      delete (window as any).h3ui;
    }
  }
}
</script>

<style lang="less" scoped></style>
