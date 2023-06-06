<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <td v-if="isEntry" class="entry entry-empty"></td>

  <td
    v-else-if="control"
    class="col"
    :tabindex="10"
    :colspan="control.options.colspan"
    :rowspan="control.options.rowspan || 1"
    :class="{ 'drag-over-item': control.key === dragOverKey }"
    @click="onClick"
    @keyup.46.stop="deleteCtrl"
    @keydown.ctrl.67.stop.prevent="onCtrlC"
    @keydown.ctrl.86.stop.prevent="onCtrlV"
  >
    <div class="title">{{ label }}</div>
  </td>

  <td v-else>
    <div class="empty-item">
      <template v-if="index === -2">从左侧拖拽来添加字段</template>
    </div>
  </td>
</template>

<script lang="ts">
import 'cloudpivot-admin-core/src/directives/drag';
import {
  H3Draggable,
  H3Droppable,
} from 'cloudpivot-admin-core/src/directives/drag';
import { Component, Inject, Prop, Vue, Mixins } from 'vue-property-decorator';
import {
  DataItem,
  FormControl,
  FormControlType,
  FormSheet,
  FormSheetColumn,
} from '../typings';
import * as ControlFactory from '../typings/control-factory';
import BaseControl from './base-control.vue';
import { Popover, Button } from '@h3/antd-vue';
import { EventBus } from 'cloudpivot-form/form/src/schema/event-bus';
import controlBill from '../typings/control-bill';
import sheetHeaderMixins from './sheet-header-mixins';

const prefix = 'dataitem-parent-';

const empty_key = '.';

interface colspanOptions {
  colspan: number;
  groupName?: string;
}

@Component({
  name: 'sheet-column',
  components: {
    BaseControl,
    APopover: Popover,
    AButton: Button,
  },
})
export default class SheetColumn
  extends Mixins(sheetHeaderMixins)
  implements H3Draggable, H3Droppable
{
  private _moveIndex?: number;

  get id() {
    return `${this.parentControl.key}_${this.control.key}`;
  }

  @Inject({
    default: () => {},
  })
  emitControlSelect!: Function;

  @Inject()
  emitDataItemAdd!: (item: DataItem) => void;

  @Inject({
    default: () => {},
  })
  getSelectedControl!: () => any;

  /**
   * 拖动从主表移入子表时，需要清除显示空的定时器
   */
  @Inject()
  clearParentShowEmptyTask!: () => void;

  @Inject({
    default: () => {},
  })
  getViewType!: Function;

  @Inject({
    default: () => {},
  })
  setFollowOptions!: Function;

  get isEntry() {
    return this.control && this.control.key === empty_key;
  }

  get label() {
    if (!this.control || !this.control.options) {
      return '';
    }

    let name = this.control.options.name;
    const name_i18n = this.control.options.name_i18n;
    if (name_i18n) {
      // const map = JSON.parse(name_i18n);
      const map = name_i18n;
      const locale = this.$i18n.locale;
      if (map[locale]) {
        name = map[locale];
      }
    }
    return name;
  }

  onDragstart(evt: DragEvent) {
    evt.stopPropagation();
    const transfer = evt.dataTransfer;
    if (!transfer) {
      return;
    }

    this.setDragInfo(evt);

    transfer.setData('control', this.control.key);
    transfer.setData('control-key-' + this.control.key, '');
    transfer.setData(prefix + this.parentControl.key, '');
  }

  setDragInfo(evt: DragEvent) {
    const Obj = {};
    controlBill.group.forEach((group) => {
      if (group.controls) {
        group.controls.forEach((ctrl) => {
          Obj[ctrl.type] = ctrl.icon;
        });
      }
    });

    this.setFollowOptions({
      text: this.control.options.name,
      icon: Obj[this.control.type],
    });

    let img = document.querySelector('#drag-follow-img') as HTMLImageElement;
    if (!img) {
      img = document.createElement('img');
      img.src =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAAD5Ip3+AAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=';
    }

    this.setDragFollowBlockPosition(evt);
    evt.dataTransfer.setDragImage(img, 0, 0);
  }

  onDrag(evt: DragEvent) {
    this.setDragFollowBlockPosition(evt);
  }

  onDragend() {
    const DragFollowBlock: HTMLElement = document.querySelector(
      '#drag-follow-block',
    ) as HTMLElement;
    if (DragFollowBlock) {
      DragFollowBlock.style.left = '-200px';
      DragFollowBlock.style.top = '-100px';
    }
    this.setDragOverKey('');
  }

  setDragFollowBlockPosition(evt) {
    const DragFollowBlock: HTMLElement = document.querySelector(
      '#drag-follow-block',
    ) as HTMLElement;
    if (DragFollowBlock) {
      if (this.control.key.indexOf('isGroup_') === 0) {
        DragFollowBlock.style.display = 'none';
      } else {
        DragFollowBlock.style.display = 'block';
        DragFollowBlock.style.left = evt.pageX + 'px';
        DragFollowBlock.style.top = evt.pageY + 'px';
      }
    }
  }

  onDragover(evt: DragEvent) {
    evt.stopPropagation();
    if (this.control && this.control.key.indexOf('isGroup_') > -1) {
      this.setDragOverKey('');
      return;
    }

    const transfer = evt.dataTransfer;
    if (
      transfer.types.some((item) => item.indexOf('control-key-isgroup_') === 0)
    ) {
      return;
    }

    this.setDragOverKey((this.control && this.control.key) || '');

    evt.preventDefault();
  }

  onDragleave() {
    this._moveIndex = undefined;
    this.$el.classList.remove('entry');
    this.setDragOverKey('');
  }

  onDrop(evt: DragEvent) {
    this.setDragOverKey('');
    evt.stopPropagation();

    this.$el.classList.remove('entry');

    const transfer = evt.dataTransfer;
    if (
      transfer.types.some((item) => item.indexOf('control-key-isgroup_') === 0)
    ) {
      return;
    }

    if (!transfer) {
      return;
    }

    const isControl = transfer.types.indexOf('control') > -1;
    const toIndex = this.columns.findIndex(
      (col) => col.key === this.dragOverKey,
    );
    if (isControl) {
      // (this.$parent as any).setHideEmptyTask(true);
      const key = transfer.getData('control');
      if (!key) {
        return;
      }

      this.changeHeadGroup(
        key,
        toIndex,
        this.parentControl.options.headGroup || [],
      );

      this.emitColumnMove(toIndex + 1, key);
    } else {
      const json = transfer.getData('block');
      if (!json) {
        return;
      }
      const block = JSON.parse(json);
      const blockType = transfer.getData('block-type');
      this.addControl(blockType, block);
    }
  }

  addControl(blockType: string, block: any, addByClick = false) {
    if (this.canNotAddToSheet(block.type, block)) {
      this.$message.error(`子表中禁止添加${block.name}`);
      return;
    }

    let selectedIndex: number = -1;
    if (addByClick) {
      // 点击控件区域控件添加
      const selectedControl = this.getSelectedControl();
      selectedIndex = this.columns.findIndex(
        (el) => el.key === selectedControl.key,
      );
    }
    let control: FormControl;
    if (blockType === 'control') {
      const dataItem = ControlFactory.buildDataItemOf(
        block,
        this.parentControl.key,
      );
      this.emitDataItemAdd(dataItem);

      control = ControlFactory.buildControlOf(dataItem, block.type);
    } else {
      control = ControlFactory.buildControlOf(block);
    }

    (control as FormSheetColumn).width = ControlFactory.getSheetColumnWidth(
      control.type,
    );

    if (
      control.type === FormControlType.RelevanceForm ||
      control.type === FormControlType.RelevanceFormEx
    ) {
      control.options.schemaCode = block.relativeCode || '';
    }
    (this.$parent as any).hideEmptyCol();
    if (selectedIndex === -1) {
      const toIndex = this.columns.findIndex(
        (col) => col.key === this.dragOverKey,
      );
      this.emitColumnAdd(toIndex + 1, control);

      this.headGroupAddItem(toIndex, this.parentControl.options.headGroup);
    } else {
      this.emitColumnAdd(selectedIndex + 1, control);
    }
    this.emitControlSelect(control);
  }

  getControlName() {
    if (this.control.type === FormControlType.Description) {
      return '描述说明';
    }
    if (this.control.type === FormControlType.Tabs) {
      return '标签页';
    }
    return this.control.options.name;
  }

  onDelete(evt: KeyboardEvent | MouseEvent) {
    evt.stopPropagation();
    this.deleteVisible = true;
  }

  visibleChange(deleteVisible) {
    this.deleteVisible = deleteVisible;
  }

  onClick(evt: Event) {
    evt.stopPropagation();
    if (this.control.key.indexOf('isGroup_') === 0) {
      return;
    }
    this.emitControlSelect(this.control);
  }

  emitColumnAdd(index: number, control: FormControl) {
    this.$emit('column-add', {
      index,
      control,
    });
  }

  emitColumnMove(index: number, controlKey: string) {
    this.$emit('column-move', {
      index,
      controlKey,
    });
  }

  created() {
    if (this.index === -2) {
      EventBus.$on('addController', this.addControlByClick);
    }
  }

  destroyed() {
    if (this.index === -2) {
      EventBus.$off('addController', this.addControlByClick);
    }
  }

  /**
   * bus事件，点击新增控件时触发
   */
  addControlByClick(param) {
    const selectedControl = this.getSelectedControl();
    if (this.getViewType() === 'web') {
      if (
        this.isSelectCurSheet(selectedControl) ||
        this.isSelectCurSheetColumn(selectedControl)
      ) {
        this.addController(param, true);
      }
    }
  }

  //判断选中的子表是否为本列位于的子表
  isSelectCurSheet(selectedControl) {
    return (
      selectedControl.type === 201 &&
      selectedControl.key === this.parentControl.key
    );
  }

  //判断选中的控件是同一子表下的某一列
  isSelectCurSheetColumn(selectedControl) {
    return (
      selectedControl.parentKey &&
      selectedControl.parentKey === this.parentControl.key
    );
  }

  addController(options, addByClick = false) {
    const block = options.json;
    const blockType = options.blockType;
    this.addControl(blockType, block, addByClick);
  }
}
</script>

<style lang="less" scoped>
div.title {
  background-color: #fafafa;
  height: 100%;
  padding: 8px;
  font-weight: 500;
  color: #111218;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
}

div.control {
  padding: 4px 8px;
  & > .cover {
    position: absolute;
    z-index: 1;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background: url('../../../../assets/images/cover.png');
  }
  & > textarea,
  & > .address textarea {
    height: 30px;
  }

  & > .ant-btn {
    font-size: 12px;
  }
}
div.empty-item {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 78px;
}

td.col {
  cursor: move;
  text-align: center;
}

.delete-popover {
  width: 220px;
  padding-top: 10px;
}

.deleteTipDeep {
  /* margin-left: 10px; */
  margin-bottom: 12px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.8);
  i {
    position: absolute;
    left: 14px;
    color: #faad14;
    font-size: 14px;
  }
  .delete-tip-text {
    margin-left: 22px;
    // margin-left: 25px;
    /* overflow: hidden; //超出隐藏
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical; */
    span {
      white-space: nowrap;
    }
  }
}

.deleteTip {
  margin: 0px 10px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}

.deleteButton {
  text-align: right;
  button {
    margin: 3px 8px;
    width: 44px !important;
    min-width: 44px !important;
    height: 24px;
    font-size: 12px;
  }
  /deep/ .ant-btn {
    padding: 0px 0px;
  }
  .delete {
    button {
      margin-left: 0;
    }
  }
}
.drag-over-item {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 2px;
    background-color: #2970ff;
  }
}
</style>
