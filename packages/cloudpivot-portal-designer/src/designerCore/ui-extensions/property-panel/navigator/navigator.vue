<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->

<template>
  <div class="page-list">
    <content>
      <draggable
        :list="navData"
        :options="dragOptions"
        class="drags-area"
        handle=".drag-icon"
        @end="onSortEnd"
      >
        <div
          v-for="(item, index) in navData"
          :key="index"
          class="list-item navigator-main"
        >
          <EditPopUp class="item-left">
            <template v-if="!!item.icon">
              <img
                v-if="item.icon.includes('http') || item.icon.includes('/api')"
                :src="item.icon"
                alt="icon"
                class="img-first"
              />
              <em
                v-else-if="item.icon"
                class="icon aufontAll icon-first"
                :class="item.icon"
              ></em>
            </template>
            <template v-else>
              <svg class="img-first" aria-hidden="true">
                <use xlink:href="#h-icon-all-application1" />
              </svg>
            </template>
            <!-- <span class="navigator-name">{{ item.title }}</span> -->
            <span class="navigator-name">{{ getTabTitle(item) }}</span>
            <span class="icon aufontAll h-icon-all-edit-o"></span>
            <template slot="content">
              <navigator-card
                :navigatorData="arrayCtrl.value[index]"
                :pagesData="pagesData"
                :changeCallBack="emitChange"
              />
            </template>
          </EditPopUp>
          <div style="width: 46px">
            <span class="drag-icon icon aufontAll h-icon-all-drag"></span>
            <span
              v-if="defaultPortalCanDelete(item)"
              class="delete-icon icon aufontAll h-icon-all-delete-o1"
              @click="delNav(index)"
            ></span>
          </div>
        </div>
      </draggable>
    </content>
    <footer @click="addNav">
      <span class="icon aufontAll h-icon-all-plus"></span>
      <span class="bottom-right">添加导航项</span>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';
import cloneDeep from 'lodash/cloneDeep';
import {
  ObjectPropertyInfo,
  DataType,
} from '@cloudpivot-shared/ui-engine-vue/document';
import { namespace } from 'vuex-class';
import NavigatorCard from './navigator-card.vue';
import { EditPopUp } from '@portal-designer/toolbox';

const PortalDesignModule = namespace('PortalDesign');
@Component({
  name: 'navigator',
  components: {
    Draggable,
    NavigatorCard,
    EditPopUp,
  },
})
export default class Navigator extends Mixins(PropertyComponent) {
  navData: any[] = [];

  dragOptions: any = {
    animation: 150,
    ghostClass: 'ghostClass',
    forceFallback: true,
    fallbackClass: 'dragClass',
    touchStartThreshold: 20,
    delay: 100,
  };

  @PortalDesignModule.State('pagesData') pagesData: any[];

  @Watch('arrayCtrl.value', { immediate: true })
  onValueChange(val: any[]) {
    this.navData = val;
  }

  addNav() {
    const params: ObjectPropertyInfo = {
      type: DataType.Object,
      properties: {
        navigator: {
          type: DataType.Object,
          default: {
            icon: 'h-icon-all-yingyong',
            // title:
            //   '宫格导航' +
            //   this.generateNumberStr(this.arrayCtrl.children.length + 1),
            title: `{\"zh\": \"宫格导航${this.generateNumberStr(
              this.arrayCtrl.children.length + 1,
            )}\",\"en\": \"Grid Navigation ${this.generateNumberStr(
              this.arrayCtrl.children.length + 1,
            )}\"}`,
            actionType: 'app',
            app: undefined,
            bizModel: undefined,
            portalPage: undefined,
            URL: '',
            openMode: 'curPage',
          },
          additionalProperties: true,
        },
      },
    };
    const newGroup = this.$uiEngine.widgetStore.factory.build(params);
    this.arrayCtrl.append(newGroup.children['navigator']);
    this.emitChange();
  }

  generateNumberStr(number) {
    if (number < 10) {
      return '0' + number;
    } else {
      return number + '';
    }
  }

  delNav(index: number) {
    // if (this.navData.length === 1) {
    //   this.$message.warning('导航至少存在一个！');
    // } else {
    this.navData.splice(index, 1);
    // }
    this.arrayCtrl.remove(index);
    this.emitChange();
  }

  onSortEnd(event) {
    const oldIndex = event.oldIndex;
    const newIndex = event.newIndex;

    const tempControl = cloneDeep(this.arrayCtrl.children[oldIndex]);
    this.arrayCtrl.remove(oldIndex);
    this.arrayCtrl.insert(newIndex, tempControl);
    this.emitChange();
  }

  /**
   * 默认工作台是否可以被删除
   */
  defaultPortalCanDelete(item) {
    const code = this.$route.query.code;
    //默认工作台页面中工作台导航不可被删除；
    //非默认工作台页面中，都可以被删除；
    if (code === 'defaultPortalDashboard') {
      return !item.isDefaultWorkbench;
    } else {
      return true;
    }
  }

  getTabTitle(item) {
    try {
      const tabTitle = JSON.parse(item.title);
      return tabTitle[this.$i18n.locale] || tabTitle['zh'];
    } catch (e) {
      return item.title;
    }
  }
}
</script>

<style lang="less" scoped>
.page-list {
  height: 100%;
  font-size: 13px;
  .icon {
    font-size: 14px;
  }
  footer {
    color: @primary-color;
    cursor: pointer;
    .bottom-right {
      margin-left: 4px;
    }
  }
  content {
    height: calc(100% - 46px);
    overflow: hidden;
    display: block;
    .icon {
      margin-left: 8px;
      color: rgba(17, 18, 24, 0.5);
    }
    .list-item {
      display: flex;
      color: #111218;
      height: 30px;
      margin-bottom: 8px;
      align-items: center;
      &:not(:last-child) {
        margin-bottom: 4px;
      }
      /deep/.item-left {
        flex: 1;
        max-width: calc(100% - 44px);
        background: #ffffff;
        border-radius: 2px;
        border: 1px dashed #d4d5d6;
        padding-right: 8px;
        line-height: 28px;
        .pop-up-content {
          display: flex;
          align-items: center;
          padding: unset;
        }
        &:hover,
        &.active {
          box-shadow: 0px 0px 0px 2px rgba(41, 112, 255, 0.2);
          border-radius: 2px;
          border: 1px solid #2970ff;
        }
        .icon-first {
          color: @primary-color;
          margin-right: 8px;
          font-size: 18px;
        }
        .img-first {
          margin: 0 8px;
          height: 18px;
          width: 18px;
        }
        .navigator-name {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .h-icon-all-edit-o {
          cursor: pointer;
          &:hover {
            color: @primary-color;
          }
        }
      }
      .drag-icon {
        cursor: move;
      }
      .delete-icon {
        cursor: pointer;
        font-size: 16px;
        line-height: 29px;
      }
    }
  }
}
</style>
