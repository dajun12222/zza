<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <ui-runtime />
</template>

<script lang="ts">
import {
  LifecycleHooks,
  OpenPageHooks,
  OpenPageOptions,
  PageDataProvider,
  PageGetParams,
  PageInfo,
  RunMode,
  VueRuntimeContext,
} from '@cloudpivot-shared/ui-engine-vue';
// import { register } from '@cloudpivot-shared/ui-property-editor/extension';
import { register as register_ } from '@cloudpivot-shared/ui-property-editor/extension';
import { register } from '@cloudpivot-shared/ui-designer-common';
import { DesignerStore } from 'cloudpivot-admin-core/src/store/designer-store-helper';
import widgets from 'cloudpivot-portal-designer/src/designerCore/ui-extensions';
import { workbenchApi } from 'cloudpivot/api';
import { Component, Prop, Vue } from 'vue-property-decorator';
import mockDefaultPortal from '../typings/mockDefaultPortal';

@Component({
  name: 'designRuntime',
  components: {},
})
export default class designRuntime extends Vue {
  @Prop()
  pageCode!: string;

  @Prop({
    default: RunMode.Runtime,
  })
  runMode!: RunMode;

  store!: any;

  pageData: any = {};

  async beforeMount() {
    if (!this.pageCode) {
      return;
    }
    // 下面这行不能删除，全局组件注册用
    console.log(widgets);

    const res: any = await workbenchApi.getPortalDesignPageByCode({
      code: this.pageCode,
    });

    if (res.errcode === 0 && res.data) {
      if (this.runMode === RunMode.Runtime) {
        if (res.data.published) {
          this.pageData = res.data.publishedPortalJson
            ? JSON.parse(res.data.publishedPortalJson)
            : {};
        } else {
          this.pageData = JSON.parse(JSON.stringify(mockDefaultPortal));
        }
      } else {
        this.pageData = res.data.draftPortalJson
          ? JSON.parse(res.data.draftPortalJson || res.data.publishedPortalJson)
          : {};
      }
    } else {
      this.pageData = JSON.parse(JSON.stringify(mockDefaultPortal));
    }

    this.store = new DesignerStore(this.pageCode, this.$store);
    const schemas = this.$uiEngine.widgetStore.factory.schemas;

    for (const key in register_.packages) {
      schemas[key] = register_.packages[key].schema;
    }
    this.$uiEngine.runMode = this.runMode;

    const that = this;
    const dataProvider = {
      get(params: PageGetParams): Promise<PageInfo> {
        const data = that.pageData;
        data.document = data.designer;

        Reflect.deleteProperty(data, 'designer');
        const pageInfo = Object.assign({}, params, {
          data,
          support: 'pc',
        }) as PageInfo;

        return Promise.resolve(pageInfo);
      },
    } as PageDataProvider;

    const opts: OpenPageOptions = {
      page: {
        dataProvider,
        isEntry: true,
        createPageContext: () => this.createContext(this.store),
        params: {
          code: this.pageCode,
        },
      },
    };

    if (this.runMode === RunMode.Runtime) {
      // 应用首页运行时：打开另一个模型再返回应用首页不显示页面问题：修改不同的code可以重新渲染
      opts.page.params.code = this.pageCode + +new Date();
    }

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
        // if(that.runMode === 'runtime'){
        //   this.initCustomScript()
        // }
      },
    };
    this.$uiEngine.openPage(opts, hooks);
  }

  createContext(store: any) {
    const context = new VueRuntimeContext(this.$uiEngine, store);
    return context;
  }

  newPage() {
    const document: Record<string, any> = {
      ...this.pageData.designer,
    };
    return {
      document,
    };
  }

  // initCustomScript(){
  //   document.querySelector('#custon-script')?.remove();
  //   try {
  //     const script = document.createElement('script');
  //     script.innerHTML = this.pageData.customAction.script;
  //     script.id = 'custon-script';
  //     document.body.appendChild(script)
  //   } catch (error) {

  //   }
  // }

  // beforeDestroy(){
  //   document.querySelector('#custon-script')?.remove();
  // }
}
</script>

<style lang="less"></style>
