<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="tabs-setter">
    <div class="tabs-list">
      <draggable
        :list="heads"
        :options="dragOptions"
        class="drags-area"
        handle=".drag-icon"
        @end="onSortEnd"
      >
        <div v-for="(item, index) in heads" :key="index" class="list-item">
          <div class="item-info">
            <EditPopUp>
              <div class="item-left">
                <div
                  v-if="
                    item.icon.includes('http') || item.icon.includes('/api')
                  "
                  class="img-icon"
                >
                  <img :src="item.icon" alt="icon" />
                </div>
                <span
                  v-else
                  :class="['icon-first', 'icon', 'aufontAll', item.icon]"
                ></span>
                <a-tooltip>
                  <template slot="title">
                    <!-- <span
                      v-if="calcStr(item.title) > 22"
                      class="navigator-name"
                      >{{ item.title }}</span> -->
                    <span
                      v-if="calcStr(getTabTitle(item)) > 22"
                      class="navigator-name"
                      >{{ getTabTitle(item) }}</span>
                  </template>
                  <!-- <span class="navigator-name">{{ item.title }}</span> -->
                  <span class="navigator-name">{{ getTabTitle(item) }}</span>
                </a-tooltip>
                <span class="icon aufontAll h-icon-all-edit-o"></span>
              </div>
              <template slot="content">
                <div class="img-setting-box">
                  <div class="form-item">
                    <div class="label">页签标题</div>
                    <!-- <a-input
                      v-model="item.title"
                      type="text"
                      @change="titleChange(item, index)"
                    /> -->
                    <InternationalInput
                      :valueI18n="getValueI18n(item)"
                      @valueChange="titleValueChange($event, item)"
                    />
                  </div>
                  <div class="form-item">
                    <div class="label">页签图标</div>
                    <icon-select
                      id="navigator-icon-select"
                      :ctrl="{ value: item.icon }"
                      @change="
                        (value) => {
                          item.icon = value;
                        }
                      "
                    />
                  </div>
                </div>
              </template>
            </EditPopUp>
          </div>

          <span class="operation-icon drag-icon">
            <em class="icon aufontAll h-icon-all-drag"></em>
          </span>

          <span class="operation-icon del-icon" @click="delItem(index)">
            <em class="icon aufontAll h-icon-all-delete1"></em>
          </span>
        </div>
      </draggable>

      <span class="add-tab" @click="addTab">
        <em class="icon aufontAll h-icon-all-plus"></em>
        添加页签
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue, Mixins, Inject } from 'vue-property-decorator';
import {
  Input,
  Icon,
  Upload,
  Select,
  Radio,
  Tooltip,
  Switch,
} from '@h3/antd-vue';
import {
  EditPopUp,
  BizModelSelector,
  DisplayFieldSelector,
  FieldSelector,
  QueryConditionsSetter,
} from '@portal-designer/toolbox';
import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';
import {
  ObjectPropertyInfo,
  DataType,
  UiDocumentNodeLike,
} from '@cloudpivot-shared/ui-engine-vue/document';
import Draggable from 'vuedraggable';
import cloneDeep from 'lodash/cloneDeep';
import IconSelect from './icon-select.vue';
import { DataItemType } from 'cloudpivot-form/form/schema';
import { utils } from 'cloudpivot/common';
import { ComponentType } from '../enums';
import ComponentVisualPanelBase from '../component-visual-panel-base';
import { InternationalInput } from '@portal-designer/toolbox';

@Component({
  components: {
    AInput: Input,
    AIcon: Icon,
    EditPopUp,
    ASelect: Select,
    ASelectOption: Select.Option,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ASwitch: Switch,
    ATooltip: Tooltip,
    Draggable,
    BizModelSelector,
    IconSelect,
    DisplayFieldSelector,
    FieldSelector,
    QueryConditionsSetter,
    InternationalInput,
  },
})
export default class InputUploadProperty extends Mixins(
  ComponentVisualPanelBase,
  PropertyComponent,
) {
  heads: any = []; //Tab页签数据

  dragOptions: any = {
    animation: 150,
    ghostClass: 'ghostClass',
    forceFallback: true,
    fallbackClass: 'dragClass',
    touchStartThreshold: 20,
    delay: 100,
  };

  @Inject()
  getController!: Function;

  @Watch('arrayCtrl.value', { immediate: true })
  onValueChange(val: any[]) {
    this.heads = val;
  }

  @Watch('heads', { deep: true })
  onDataChange() {
    this.emitChange();
  }

  get controller() {
    return this.getController?.() || null;
  }

  addTab() {
    const key = new Date().getTime();
    const params: ObjectPropertyInfo = {
      type: DataType.Object,
      properties: {
        heads: {
          type: DataType.Object,
          default: {
            // title: `页签${this.heads.length + 1}`, //组件标题
            title: `{\"zh\": \"页签${this.heads.length + 1}\",\"en\": \"Tab${
              this.heads.length + 1
            }\"}`, //组件标题
            key: key, //组件Key
            icon: '', //组件图标
          },
          additionalProperties: true,
        },
      },
    };

    const newGroup = this.$uiEngine.widgetStore.factory.build(params);
    this.arrayCtrl.append(newGroup.children['heads']);
    this.emitChange();
    this.createNewPanel(key);
  }

  createNewPanel(key) {
    const parentId = this.active ? this.active.id : '';
    const type = ComponentType.TabsPanelGrid;
    const props = {
      tab: key.toString(),
      size: {
        height: '100%',
      },
    };
    const activeNode = this.active as UiDocumentNodeLike;

    this.store.app.insertWidget(type, parentId, -1, {
      props,
    });

    this.store.active = activeNode;
  }

  delItem(index: number) {
    console.log(this.heads);
    const theItem = this.heads[index];
    this.remove(theItem.key.toString());
    this.arrayCtrl.remove(index);
    this.emitChange();
  }

  remove(id: string) {
    const panelList = (this.active as any).children;
    const removeId =
      panelList.find((el) => {
        return el.props.tab === id;
      })?.id || id;

    this.store.app.remove(removeId);
  }

  created() {}

  onSortEnd(event) {
    const oldIndex = event.oldIndex;
    const newIndex = event.newIndex;

    const tempControl = cloneDeep(this.arrayCtrl.children[oldIndex]);
    this.arrayCtrl.remove(oldIndex);
    this.arrayCtrl.insert(newIndex, tempControl);
    this.emitChange();
  }

  listChange(val) {
    this.emitChange(JSON.stringify(val));
  }

  titleChange(item, idx) {
    let index = 0;
    let realLength = 0;
    while (realLength <= 30 && index < item.title.length) {
      const charCode = item.title.charCodeAt(index);
      if (charCode >= 0 && charCode <= 128) {
        realLength += 1;
      } else {
        realLength += 2;
      }
      if (realLength > 30) {
        break;
      } else {
        index++;
      }
    }
    item.title = item.title.slice(0, index);
    // if (!item.title) {
    //   item.title = `页签${idx + 1}`;
    // }
  }

  getValueI18n(item) {
    try {
      const value = JSON.parse(item.title);
      return value;
    } catch (err) {
      return {
        zh: item.title,
        en: item.title,
      };
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

  titleValueChange(value, item) {
    item.title = JSON.stringify(value);
  }

  calcStr(str) {
    return utils.calcStrLength(str);
  }
}
</script>

<style lang="less" scoped>
.operation-icon {
  margin-left: 8px;
  em {
    font-size: 14px;
    color: rgba(17, 18, 24, 0.5);
    &:hover {
      color: @primary-color;
    }
  }
  &.drag-icon {
    cursor: move;
  }
  &.del-icon {
    cursor: pointer;
    em {
      font-size: 16px;
    }
  }
}

.add-tab {
  display: block;
  color: @primary-color;
  font-size: 12px;
  cursor: pointer;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  /deep/.item-info {
    flex: 1;
    height: 30px;
    line-height: 30px;
    width: 215px;
    max-width: 215px;
    .pop-up-content {
      padding: 0;
    }

    .item-left {
      flex: 1;
      display: flex;
      align-items: center;
      background: #ffffff;
      border-radius: 2px;
      border: 1px dashed #d4d5d6;
      padding-right: 8px;
      padding-left: 8px;
      &:hover,
      &.active {
        box-shadow: 0px 0px 0px 2px rgba(41, 112, 255, 0.2);
        border-radius: 2px;
        border: 1px solid #2970ff;
      }
      .img-icon {
        margin-right: 8px;
        width: 18px;
        height: 18px;
        line-height: 15px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .icon-first {
        color: @primary-color;
        margin-right: 8px;
        font-size: 18px;
      }
      .navigator-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        font-size: 13px;
        // text-overflow: ellipsis;
      }
      .h-icon-all-edit-o {
        cursor: pointer;
        color: rgba(17, 18, 24, 0.5);
        font-size: 14px;
        &:hover {
          color: @primary-color;
        }
      }
    }
  }
}

.img-setting-box {
  width: 300px;
  padding: 21px 16px;
  max-height: 675px;
  overflow: auto;
  .form-item {
    margin-bottom: 17px;
    .label {
      font-size: 12px;
      color: @text-color;
      font-weight: 600;
      line-height: 20px;
      margin-bottom: 4px;
      em {
        color: red;
      }
    }
    .ant-input {
      padding-left: 8px;
      padding-right: 8px;
    }
  }
  .biz-model {
    margin-top: -9px;
  }
}

.set-list-symbol {
  /deep/span.ant-radio {
    display: none !important;
  }
  /deep/.ant-radio-wrapper {
    display: inline-block;
    width: 64px;
    height: 28px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #d4d5d6;
    text-align: center;
    line-height: 25px;
    > span {
      display: inline-block;
      height: 22px;
      font-size: 13px;
      font-weight: 400;
      color: #111218;
      line-height: 22px;
      position: relative;
    }
    &.ant-radio-wrapper-checked {
      border-color: #2970ff;
    }
    &.dot span {
      counter-reset: dot 2;
      padding-left: 21px;
      &::before {
        position: absolute;
        left: 7px;
        content: counter(dot, disc) ' ';
        font-size: 24px;
        color: #111218;
        display: inline-block;
      }
    }
    &.diamond span {
      counter-reset: diamond 2;
      padding-left: 21px;
      &::before {
        position: absolute;
        left: 7px;
        content: counter(diamond, square) ' ';
        font-size: 12px;
        color: #111218;
        transform: scale(0.6) rotate(45deg);
      }
    }
  }
}
</style>
