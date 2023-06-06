<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->

<template>
  <a-tabs v-model="activeKey" :class="[addtionalFromAppClass]">
    <a-tab-pane key="1" tab="通用配置">
      <template v-if="active">
        <div v-if="activeType === 'Page'" class="no-property-content">
          <p>请在画布选中组件</p>
        </div>

        <div v-else-if="isHasColMemu">
          <!-- <p>无可配置属性</p> -->
          <IDEditor :uid="activeId" />
        </div>

        <property-editor
          v-else
          ref="propertyEditor"
          :node="active"
          size="small"
          @change="onPropsChange"
        >
          <template v-slot:header>
            <IDEditor :uid="activeId" />
          </template>
        </property-editor>
      </template>
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { Component, Vue, Prop, Provide } from 'vue-property-decorator';
import { Tabs } from '@h3/antd-vue';
import { PropertyEditor } from '@cloudpivot-shared/ui-property-editor/editor';
import IDEditor from './../designerCore/id-editor.vue';

@Component({
  name: 'portal-attribute-layout',
  components: {
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    PropertyEditor,
    IDEditor,
  },
})
export default class PortalAttributeLayout extends Vue {
  activeKey: string = '1';

  @Prop()
  store!: any;

  get active() {
    return this.store?.active;
  }

  get activeId() {
    if (this.active && this.active.type === 'TabsPanelGrid') {
      const parentId = this.active.parentId;
      this.store.active = this.active.parent;
      return parentId;
    } else if (this.active) {
      return this.active.id;
    } else {
      return '';
    }
  }

  get activeType() {
    if (this.active) {
      return this.active.type === 'TabsPanelGrid'
        ? this.active.parent.type
        : this.active.type;
    }
    return '';
  }

  get isHasColMemu() {
    if (this.activeType === 'RowMenu') {
      return !!document.querySelector('.col-header');
    }
    return false;
  }

  @Provide()
  getPropertyEditor() {
    return this.$refs.propertyEditor as PropertyEditor;
  }

  onPropsChange(key: any, val: any) {
    if (!this.active) {
      return;
    }
    const propEditor = this.getPropertyEditor();
    if (!propEditor) {
      return;
    }

    const props = propEditor.getValue();
    if (!props) {
      return;
    }

    this.$uiCurrentPage.documentApp.assignProps(this.active.id, props);
    this.store.dirty = true;
    // if (key === 'publicPage') {
    //   this.showAlert = val;
    //   this.activeKey = key;
    // }
    // console.log('onPropsChange', this.store.dirty);S
  }

  get addtionalFromAppClass() {
    const route = (this as any).$route;
    if (route.name === 'app-portal-design') {
      return route.name;
    }
    return '';
  }
}
</script>

<style lang="less" scoped>
.ant-tabs {
  flex: 1;
  background: #fff;
  height: 100%;
  border-top: thin solid #e4e4e4;
  // &.app-portal-design {
  //   /deep/.ant-tabs-nav {
  //     width: 100%;
  //     .ant-tabs-tab {
  //       margin: 0 calc(25% - 28px) 0 calc(25% - 28px);
  //     }
  //   }
  // }
  /deep/.ant-tabs-bar {
    padding: 0 16px;
    margin-bottom: 0;
  }
  /deep/.ant-tabs-content {
    height: calc(100% - 44px);
  }
  /deep/.ant-select-arrow {
    color: #d4d5d6;
  }
}
.no-property-content {
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  > p {
    width: 100%;
    height: 22px;
    font-size: 14px;
    color: rgba(17, 18, 24, 0.5);
    line-height: 22px;
  }
}
</style>
