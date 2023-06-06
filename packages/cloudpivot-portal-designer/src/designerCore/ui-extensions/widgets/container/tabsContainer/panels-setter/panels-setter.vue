<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="grid-col-setter">
    <a-row type="flex" justify="center" align="middle" class="auto-header">
      <!-- <a-col class="col"
                :span="6"><small>{{ $t('widgets.TabsContainer.panel.checked') }}</small></a-col> -->
      <a-col class="col" :span="24">
        <small>{{ $t('widgets.TabsContainer.panel.tab') }}</small>
      </a-col>
    </a-row>
    <div
      v-for="(child, index) in children"
      :key="child.id"
      class="row-items row-wrapper"
      :class="{ [`${dragDirection}`]: targetIndex === index }"
      :drag="dragStart ? 'start' : 'end'"
      draggable
      @dragstart="(evt) => onDragStart(evt, index)"
      @dragover="(evt) => onDragover(evt, index)"
      @dragleave="onDragleave"
      @drop="(evt) => onDrop(evt, index)"
    >
      <a-row type="flex" align="middle">
        <a-col class="col-radio-wrapper">
          <a-radio
            :checked="child.isActiveKey"
            @change="setDefaultActive(child.id)"
          />
        </a-col>
        <a-col class="col-input-wraper col-left">
          <a-input
            :value="child.props.children.tab.value"
            :class="{ 'radio-checked': child.isActiveKey }"
            @change="(e) => onTabChange(e.target.value, child)"
            @pointerdown.stop=""
          />
          <div v-if="child.isActiveKey" class="is-checked-default">显示</div>
        </a-col>

        <a-col class="col-delete-wraper col-center">
          <!-- 删除按钮 -->
          <span class="icons">
            <IconFont type="h-icon-all-delete-o" @click="remove(child.id)" />
          </span>
        </a-col>
        <a-col :span="1" class="col-drawer-wraper col-center">
          <IconFont type="h-icon-all-drag" />
        </a-col>
      </a-row>
    </div>

    <a-row type="flex" align="middle">
      <a-button type="link" @click="add">
        <a-icon type="plus" />{{ $t('widgets.TabsContainer.panel.add') }}
      </a-button>
    </a-row>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch, Inject } from 'vue-property-decorator';

import { Row, Col, Radio, Button, Icon, Input } from '@h3/antd-vue';

import {
  DocumentNodeDto,
  Direction,
} from '@cloudpivot-shared/ui-engine-vue/document';

import { ComponentType } from '../../../../enums';

import ComponentVisualPanelBase from '../../../../component-visual-panel-base';

import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';

@Component({
  components: {
    ARow: Row,
    ACol: Col,
    ARadio: Radio,
    AButton: Button,
    AIcon: Icon,
    AInput: Input,
  },
})
export default class TabPanelsSetter extends Mixins(
  ComponentVisualPanelBase,
  PropertyComponent,
) {
  dragging = -1;

  dragStart = false;

  targetIndex = -1;

  dragDirection = Direction.None;

  cacheDefaultActiveKey = '';

  @Inject()
  getController!: Function;

  get panels() {
    return this.store.active as DocumentNodeDto;
  }

  @Watch('active')
  onActiveChange() {
    this.initCacheDefaultActiveKey();
  }

  get controller() {
    return this.getController?.() || null;
  }

  add() {
    const parentId = this.active ? this.active.id : '';
    const type = ComponentType.TabsPanelGrid;
    const props = {
      tab: 'Tab' + (this.children.length + 1),
    };

    this.store.app.insertWidget(type, parentId, -1, {
      props,
    });

    if (this.children[0]) {
      const activeKey = this.children[0].id;
      if (this.active.props.children?.defaultActiveKey) {
        this.active.props.children.defaultActiveKey.value = activeKey;
      }

      const node = this.store.get(this.active.id);

      if (node && !node.props.defaultActiveKey) {
        node.props.defaultActiveKey = activeKey;
        node.props.activeKey = activeKey;
      }
      if (this.controller) {
        this.controller.children.defaultActiveKey.value = activeKey;
        this.controller.children.activeKey.value = activeKey;
      }
    }
  }

  remove(id: string) {
    this.store.app.remove(id);

    if (this.children[0]) {
      const activeKey = this.children[0].id;
      if (this.active.props.children?.defaultActiveKey) {
        this.active.props.children.defaultActiveKey.value = activeKey;
      }
      const node = this.store.get(this.active.id);
      if (node) {
        if (
          !node.props.defaultActiveKey ||
          node.props.defaultActiveKey === id
        ) {
          node.props.defaultActiveKey = activeKey;
          node.props.activeKey = activeKey;
        }
      }
      if (this.controller) {
        this.controller.children.defaultActiveKey.value = activeKey;
        this.controller.children.activeKey.value = activeKey;
      }
    }
  }

  setDefaultActive(activeKey: string) {
    this.cacheDefaultActiveKey = activeKey;

    if (this.active) {
      if (this.active.props.children?.defaultActiveKey) {
        this.active.props.children.defaultActiveKey.value = activeKey;
      }
      const node = this.store.get(this.active.id);
      if (node) {
        node.props.defaultActiveKey = activeKey;
        node.props.activeKey = activeKey;
      }
      if (this.controller) {
        this.controller.children.defaultActiveKey.value = activeKey;
        this.controller.children.activeKey.value = activeKey;
      }
    }
  }

  calcDragDirection(evt: DragEvent) {
    let { offsetY, currentTarget } = evt;
    const el = currentTarget as HTMLElement;

    let direction = Direction.None;
    if (!el) {
      return direction;
    }

    let offsetEl = evt.target as HTMLElement;

    while (offsetEl && !offsetEl.classList.contains('row-wrapper')) {
      offsetY += offsetEl.offsetTop;
      offsetEl = offsetEl.offsetParent as HTMLElement;
    }

    if (offsetEl === undefined) {
      return Direction.North;
    }

    const threshold = offsetEl.offsetHeight / 2;
    if (offsetY <= threshold) {
      direction = Direction.North;
    } else {
      direction = Direction.South;
    }

    return direction;
  }

  onDragStart(evt: DragEvent, index: number) {
    this.dragging = index;
    this.dragStart = true;
  }

  onDragover(evt: DragEvent, targetIndex: number) {
    if (targetIndex !== this.dragging) {
      this.targetIndex = targetIndex;
      this.dragDirection = this.calcDragDirection(evt);
      evt.preventDefault();
    }
  }

  onDragleave() {
    this.dragDirection = Direction.None;
    this.targetIndex = -1;
    this.dragStart = false;
  }

  onDrop(evt: DragEvent, _targetIndex: number) {
    // NOTE: 不对入参直接修改，入参改为私有变量
    let targetIndex = _targetIndex;
    const direction = this.calcDragDirection(evt);
    if (direction === Direction.South) {
      targetIndex++;
    }
    const temp = this.panels.childIds[this.dragging];
    this.panels.childIds.splice(targetIndex, 0, temp);
    const deleteIndex =
      targetIndex < this.dragging ? this.dragging + 1 : this.dragging;
    this.panels.childIds.splice(deleteIndex, 1);
    this.dragging = -1;
    this.onDragleave();
  }

  onTabChange(tab: string, child: any) {
    child.props.children.tab.value = tab;
    const node = this.store.get(child.id);
    if (node) {
      node.props.tab = tab;
    }

    this.emitChange();

    const parentNode = this.store.get(this.active.id);
    if (parentNode) {
      parentNode.props.defaultActiveKey = this.cacheDefaultActiveKey;
    }
  }

  created() {
    this.initCacheDefaultActiveKey();
  }

  initCacheDefaultActiveKey() {
    const parentNode = this.store.get(this.active.id);
    if (parentNode) {
      let defaultActiveKey = parentNode.props.defaultActiveKey;
      if (!defaultActiveKey) {
        defaultActiveKey = (this.children.length && this.children[0]?.id) || '';
      }

      this.cacheDefaultActiveKey = defaultActiveKey;
    }
  }
}
</script>

<style lang="less" scoped>
.grid-col-setter {
  .auto-header {
    margin-bottom: 4px;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }
  /deep/.ant-row-flex {
    & > div {
      /deep/.ant-input {
        padding: 0 8px;
        width: 100%;
        height: 22px;
      }
    }
    & > .col-radio-wrapper {
      position: relative;
      width: 28px;
    }
    & > .col-input-wraper {
      position: relative;
      width: 168px;

      .radio-checked {
        padding-right: 60px;
      }

      .is-checked-default {
        position: absolute;
        top: 50%;
        right: 4px;
        z-index: 1;

        padding: 2px 10px;

        font-size: 12px;

        color: @primary-color;
        background: rgba(163, 203, 255, 0.2);

        border: 1px solid rgba(41, 112, 255, 0.3);
        border-radius: 12px;

        transform: translateY(-50%);
      }
    }
    & > .col-delete-wraper {
      margin: 0 11px;
      width: 14px;
      height: 14px;
      line-height: 14px;
      /deep/.anticon {
        font-size: 14px;
        color: @text-color;
      }
    }

    & > .col-left {
      text-align: left;
    }

    & > .col-center {
      text-align: center;
    }

    /deep/.ant-btn-link {
      height: 20px;
      line-height: 20px;
      padding: 0;
      i {
        font-size: 12px;
      }
      span {
        font-size: 12px;
      }
    }
    /deep/.anticon + span {
      margin-left: 4px;
    }
  }
  /deep/.row-items {
    margin-bottom: 4px;
  }
  div[drag='start'] {
    background-color: #f0f7ff !important;
    opacity: 0.3;
  }
}
.north::before {
  content: '';
  display: block;
  border: 1px solid @primary-color !important;
  width: 100%;
  z-index: 1;
  background: @normal-color;
  position: absolute !important;
  top: -2px;
  height: 2px;
}

.south::after {
  content: '';
  display: block;
  border: 1px solid @primary-color !important;
  width: 100%;
  z-index: 1;
  background: @normal-color;
  position: absolute !important;
  bottom: -2px;
  height: 2px;
}

.row-wrapper {
  position: relative;
  min-width: 248px;
}
.list-set {
  width: 100%;
  display: flex;
  /deep/.ant-radio-button-wrapper-checked {
    background-color: #fff !important;
    color: @primary-color !important;
  }
  label {
    width: 46%;
    text-align: center;
  }
}
</style>
