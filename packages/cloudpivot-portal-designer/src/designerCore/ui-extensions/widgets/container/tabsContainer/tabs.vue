<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    :style="style"
    class="tabs-overflow"
    :class="[
      tabPosition === 'top' ? 'HorizTabs' : '',
      tabPosition === 'left' ? 'VertivalTabs' : '',
    ]"
  >
    <a-tabs
      :tabPosition="tabPosition"
      :type="type"
      :size="sizeType"
      :activeKey="tabKey"
      v-on="$listeners"
      @change="onChange"
    >
      <a-tab-pane
        v-for="(child, index) in visibleChildren"
        :key="child.id"
        :style="
          isHorizontal &&
          syncActiveKey === child.id &&
          `height:${
            child.props && child.props.size ? child.props.size.height : ''
          }`
        "
      >
        <span slot="tab">
          {{ child.props.tab }}
          <span
            v-if="showBadge && dataSource[0].data[index]"
            class="tab-badge"
            >{{ dataSource[0].data[index].tabNum }}</span>
        </span>
        <ui-element :draggable="false" :uid="child.id" :index="index" />
      </a-tab-pane>
      <template v-if="headerGrid" slot="tabBarExtraContent">
        <ui-element
          :uid="headerGrid.id"
          :draggable="false"
          @click="(evt) => evt.stopPropagation()"
        />
      </template>
      <!-- <a
        v-show="showMoreFlag"
        slot="tabBarExtraContent"
        class="tab-more"
        :href="dataSource[0].href"
      >
        {{ $t('widgets.TabsContainer.properties.showMoreFlag') }}
        <a-icon type="right" />
      </a> -->
    </a-tabs>
    <!-- <a-tab-pane
      v-for="child in hiddenChildren"
      :key="child.id"
      style="display:none;"
    /> -->
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  PropSync,
  Mixins,
  Watch,
} from 'vue-property-decorator';

import { Tabs, Icon, Button } from '@h3/antd-vue';

import TabsBase from './tabs-base';

@Component({
  components: {
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    AIcon: Icon,
    AButton: Button,
  },
})
export default class UiTabs extends Mixins(TabsBase) {
  @PropSync('activeKey')
  syncActiveKey!: string;

  @PropSync('defaultActiveKey')
  syncDefaultActiveKey!: string;

  @Prop({
    default: false,
  })
  showBadge!: Boolean;

  @Prop({
    default: false,
  })
  showMoreFlag!: Boolean;

  @Prop({
    default: () => [],
  })
  dataSource!: any[];

  panelMaxHeight!: number;

  tabKey = ''; // 第三方变量在mounted的时候赋值

  cacheActiveKey: string = '';

  @Watch('syncActiveKey')
  onActivieyKeyChange(value: string) {
    if (!value) {
      this.syncActiveKey = this.cacheActiveKey;
    } else {
      this.cacheActiveKey = value;
    }
  }

  get visibleChildren() {
    return this.$uiChildren?.filter((child) => {
      return child.props.visible?.show !== false;
    });
  }

  get hiddenChildren() {
    return this.$uiChildren?.filter((child) => {
      return child.props.visible?.show === false;
    });
  }

  mounted() {
    const children = this.$uiChildren;

    if (children && children.length > 0) {
      // 如果有设置了默认值，则选中默认的值
      if (
        this.syncDefaultActiveKey &&
        children.some((c) => c.id === this.syncDefaultActiveKey)
      ) {
        this.syncActiveKey = this.syncDefaultActiveKey;
        this.cacheActiveKey = this.syncDefaultActiveKey;
        setTimeout(() => {
          this.tabKey = this.syncDefaultActiveKey;
        }, 200);
      }

      // 第一次加载的初始值
      if (
        !this.syncActiveKey &&
        !children.some((c) => c.id === this.syncActiveKey)
      ) {
        this.syncActiveKey = children[0].id;
        this.syncDefaultActiveKey = children[0].id;
        this.cacheActiveKey = children[0].id;
      }
    }
  }

  onChange(key) {
    this.tabKey = key;
    this.syncActiveKey = key;
    this.syncDefaultActiveKey = key;
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-tabs-top-content {
  padding-bottom: 20px;
}
.tab-badge {
  display: inline-block;
  vertical-align: middle;
  margin-left: 8px;
  padding: 0 12px;
  height: 24px;
  background: rgba(247, 247, 247, 1);
  border-radius: 12px;
  text-align: center;
}
.tab-more {
  cursor: pointer;
  margin-right: 20px;
  color: #0f1c35;
}
.tabs-overflow {
  position: relative;
  height: 100%;
  overflow-x: hidden !important;

  /deep/.ant-tabs {
    height: 100%;
    display: flex;
    .ant-tabs-bar {
      flex-grow: 0;
      display: flex;
      align-items: center;
      .ant-tabs-nav-container {
        order: 1;
      }
      .ant-tabs-extra-content {
        height: 100%;
        flex: 1;
        order: 2;
        .ui-container-empty {
          img {
            display: none;
          }
          p {
            margin: 0;
            height: 20px;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }

    .ant-tabs-content {
      flex-grow: 1;
      position: relative;
      width: 100%;
      flex-direction: column;
      margin-left: unset !important;
      overflow: auto;
    }
    /deep/.ant-tabs-tabpane-active {
      height: 100%;
    }
  }

  /deep/.ant-tabs-top,
  /deep/.ant-tabs-bottom {
    flex-direction: column;
  }
  /deep/.ant-tabs-right {
    flex-direction: row-reverse;
  }
}

.VertivalTabs {
  /deep/.ant-tabs-bar.ant-tabs-left-bar {
    flex-direction: column;
  }
}
</style>
