<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="sheet">
    <div style="border-left: 1px solid #d9d9d9">
      <table class="sheet-tab">
        <template v-for="(el, key) in HeadColumns">
          <tr :key="key">
            <sheetHeader
              v-for="(item, index) in el"
              :key="item.code"
              v-h3-drag
              v-h3-drop
              :index="index"
              :control="item"
              :parentControl="control"
              :columns="columns"
              :class="{ selected: isSelected(item) }"
              :isUseHeadGroup="isUseHeadGroup"
              :dragOverKey="dragOverKey"
              :setDragOverKey="setDragOverKey"
              :headGroupAddItem="headGroupAddItem"
              @column-add="onColumnAdd"
              @column-move="onColumnMove"
              @column-delete="onColumnDelete"
            />

            <!-- 多余的列 -->
            <sheet-column
              v-show="columns.length > 0"
              v-h3-drop
              class="empty-last top"
              :index="-1"
              :columns="columns"
              :parentControl="control"
              :isUseHeadGroup="isUseHeadGroup"
              :headGroupAddItem="headGroupAddItem"
              :setDragOverKey="setDragOverKey"
              @column-add="onColumnAdd"
            />
          </tr>
        </template>

        <tr>
          <sheet-column
            v-for="(item, index) in columns"
            :key="item.code"
            v-h3-drag
            v-h3-drop
            :index="index"
            :control="item"
            :parentControl="control"
            :headGroupAddItem="headGroupAddItem"
            :columns="columns"
            :class="{ selected: isSelected(item) }"
            :isUseHeadGroup="isUseHeadGroup"
            :dragOverKey="dragOverKey"
            :setDragOverKey="setDragOverKey"
            @column-add="onColumnAdd"
            @column-move="onColumnMove"
            @column-delete="onColumnDelete"
          />

          <sheet-column
            v-show="columns.length === 0"
            v-h3-drop
            class="empty"
            :index="-2"
            :columns="columns"
            :parentControl="control"
            :headGroupAddItem="headGroupAddItem"
            :isUseHeadGroup="isUseHeadGroup"
            :setDragOverKey="setDragOverKey"
            @column-add="onColumnAdd"
          />

          <sheet-column
            v-show="columns.length > 0"
            v-h3-drop
            class="empty-last top"
            :index="-1"
            :columns="columns"
            :parentControl="control"
            :isUseHeadGroup="isUseHeadGroup"
            :setDragOverKey="setDragOverKey"
            @column-add="onColumnAdd"
          />
        </tr>

        <tr v-show="columns.length > 0" class="foot">
          <template v-for="item in columns">
            <sheet-statistic
              v-if="showStatistic && isNumber(item)"
              :key="item.code + getStatistic(item).options.name"
              :control="getStatistic(item)"
              :class="{ selected: isSelected(getStatistic(item)) }"
            />

            <td
              v-else
              :key="item.code"
              :class="{
                'entry-empty entry-empty-none-before': item.key === '.',
                'drag-over-item': item.key === dragOverKey,
              }"
            ></td>
          </template>
          <td class="empty-last bottom"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import 'cloudpivot-admin-core/src/directives/drag';
import { Component, Inject, Prop, Vue, Watch } from 'vue-property-decorator';
import * as dataitemStore from '../stores/data-items.store-helper';
import {
  FormControl,
  FormControlType,
  FormSheet,
  FormSheetStatistic,
} from '../typings';
import * as ControlFactory from '../typings/control-factory';
import SheetColumn from './sheet-column.vue';
import SheetHeader from './sheet-header.vue';
import SheetStatistic from './sheet-statistic.vue';
import { EventBus } from 'cloudpivot-form/form/src/schema/event-bus';

const empty_key = '.';

@Component({
  name: 'sheet',
  components: {
    SheetColumn,
    SheetStatistic,
    SheetHeader,
  },
})
export default class Sheet extends Vue {
  @Prop()
  readonly control!: FormSheet;

  columns: any[] = [];

  private _showTimeoutRef: any;

  private _hideTimeoutRef: any;

  ctrlCKey = '';

  @Inject()
  emitControlUpdate!: Function;

  @Inject()
  emitDataItemDelete!: (code: string, parentCode?: string) => void;

  @Inject()
  isSelected?: (control: FormControl) => boolean;

  @Watch('control', {
    immediate: true,
  })
  setControl(val: FormSheet) {
    if (val.columns) {
      this.columns = val.columns.filter(
        (v) => v.type !== FormControlType.SystemOther,
      );
    }
  }

  dragOverKey: string = '';

  setDragOverKey(key: string) {
    this.dragOverKey = key;
  }

  headerGroup: any[] = [];

  @Watch('columns', {
    deep: true,
    immediate: true,
  })
  columnsLenChange() {
    this.initSheetHead(this.headerGroup);
  }

  get headGroup() {
    if (typeof this.control.options.headGroup === 'string') {
      this.control.options.headGroup = JSON.parse(
        this.control.options.headGroup || '[]',
      );
    }

    return this.control.options.headGroup || [];
  }

  get isUseHeadGroup() {
    return (
      this.control.options.headGroup &&
      this.control.options.headGroup.length > 0
    );
  }

  // 多表头分组添加一个数据项
  headGroupAddItem(toIndex: number, groups: any[]) {
    if (typeof groups === 'string') {
      return;
    }
    groups.forEach((group) => {
      const colspan: [number, number] = group.colspan;
      if (toIndex < colspan[0]) {
        group.colspan = [colspan[0] + 1, colspan[1] + 1];
      } else if (colspan[0] <= toIndex && toIndex <= colspan[1]) {
        group.colspan = [colspan[0], colspan[1] + 1];
      }
      if (group.child) {
        this.headGroupAddItem(toIndex, group.child);
      }
    });
  }

  @Watch('headGroup', { deep: true, immediate: true })
  onHeadGroupChange() {
    this.headerGroup = this.headGroup;
    this.initSheetHead(this.headerGroup);
  }

  created() {
    this.headerGroup = this.headGroup;
    EventBus.$on('delOldController', this.delOldController);
  }

  destroyed() {
    EventBus.$off('delOldController', this.delOldController);
  }

  delOldController(key) {
    const delIndex = this.columns.findIndex((col) => col.key === key);
    this.control.options.headGroup = this.delHeadGroupItem(
      delIndex,
      this.control.options.headGroup || [],
    );
    this.onColumnDelete(key);
  }

  delHeadGroupItem(delIndex: number, groups: any[]) {
    let delIndexs: number[] = [];
    groups.forEach((group, index) => {
      const colspan: [number, number] = group.colspan;
      if (colspan[0] <= delIndex && delIndex <= colspan[1]) {
        group.colspan = [colspan[0], colspan[1] - 1];
        if (group.colspan[1] - group.colspan[0] < 0) {
          delIndexs.push(index);
        }
      } else if (delIndex < colspan[0]) {
        group.colspan = [colspan[0] - 1, colspan[1] - 1];
      }
      if (group.child) {
        group.child = this.delHeadGroupItem(delIndex, group.child);
      }
    });
    groups = groups.filter((item, index) => !delIndexs.includes(index));
    return groups;
  }

  HeadColumns: any[] = [];

  initSheetHead(headerGroup) {
    const HeadColumns: any[] = [];
    this.colspans = {};
    const depth = this.getHeaderGroupDepth(headerGroup);

    for (let i = 0; i < depth; i++) {
      HeadColumns.push(JSON.parse(JSON.stringify(this.columns)));
    }
    this.loop(this.headerGroup, HeadColumns, 0, depth);

    HeadColumns.forEach((columns, index) => {
      HeadColumns[index] = columns.filter((el) => !el.del);
    });

    if (HeadColumns.length > 1) {
      let keys = HeadColumns[0].map((el) => el.key);
      for (let i = 1; i < HeadColumns.length; i++) {
        HeadColumns[i] = HeadColumns[i].filter(
          (item) =>
            !keys.includes(item.key) || item.key.indexOf('isGroup_') > -1,
        );
        keys = [...keys, ...HeadColumns[i].map((el) => el.key)];
      }
    }

    this.HeadColumns = HeadColumns;
  }

  loop(headerGroup, HeadColumns: any[], index = 0, depth) {
    let colspans: [number, number][] = this.colspans[index];
    let columns = HeadColumns[index].filter((el) => el.key !== '.');

    headerGroup.forEach((group) => {
      const colspan: [number, number] = group.colspan;
      if (columns[colspan[0]]) {
        columns[colspan[0]].options.name = group.groupName;
        columns[colspan[0]].key = 'isGroup_' + +new Date();
        columns[colspan[0]].options.colspan = colspan[1] - colspan[0] + 1;

        columns.forEach((el, key) => {
          if (key > colspan[0] && key <= colspan[1]) {
            el.del = true;
          }
          if (
            colspans.every((colspan: number[]) => {
              return !(colspan[0] <= key && key <= colspan[1]);
            })
          ) {
            el.options.rowspan = depth - index;
          }
        });
      }
      if (group.child && group.child.length) {
        this.loop(group.child, HeadColumns, index + 1, depth);
      }
    });
  }

  colspans = {};

  // 获取合并表头需要多少层
  getHeaderGroupDepth(headerGroup, depth = 1) {
    if (headerGroup.length) {
      depth += 1;

      let depths: number[] = headerGroup.map((item) => {
        if (item.child && item.child.length) {
          return this.getHeaderGroupDepth(item.child, depth);
        }
        return depth;
      });

      if (!this.colspans[depth - 2]) {
        this.colspans[depth - 2] = [];
      }
      this.colspans[depth - 2] = [
        ...this.colspans[depth - 2],
        ...headerGroup.map((group) => {
          return group.colspan;
        }),
      ];
      depth = Math.max(depth, ...depths);
    }
    return depth;
  }

  get showStatistic() {
    return this.control && this.control.options.showTotal;
  }

  isNumber(col: FormControl) {
    return col.type === FormControlType.Number;
  }

  getStatistic(col: FormControl) {
    if (!this.isNumber(col)) {
      return;
    }
    if (!this.control.statistics) {
      this.control.statistics = [];
    }
    let stat = this.control.statistics.find((s) => s.columnKey === col.key);
    if (!stat) {
      stat = ControlFactory.buildControl({
        type: FormControlType.SheetStatistic,
        name: '统计',
      }) as FormSheetStatistic;
      if (stat) {
        stat.key = 'stat-' + col.key;
        stat.parentKey = col.parentKey;
        stat.columnKey = col.key;
        stat.options.format = col.options.format; // 统计的格式 需要和它上面数值数据格式一致 迭代25
        this.control.statistics.push(stat);
      }
    }

    if (stat && !stat.path) {
      let path: string[] = [];
      if (this.control.path) {
        path = this.control.path.slice();
        path.push(stat.key);
      } else {
        path = [stat.parentKey, stat.key];
      }
      stat.path = path;
    }

    return stat;
  }

  scrollToSelected() {
    // setTimeout(() => {
    this.$nextTick(() => {
      const div = this.$el.querySelector(':first-child');
      if (div) {
        const selected = div.querySelector('td.selected') as HTMLDivElement;
        if (selected) {
          div.scrollLeft = selected.offsetLeft - selected.offsetWidth;
          selected.focus();
        }
      }
    });
    // }, 300);
  }

  onColumnAdd(add: { index: number; control: FormControl }) {
    // if(this.isUseHeadGroup){
    //   return
    // }
    add.control.isNewAdd = true;
    if (add.index < 0) {
      this.columns.push(add.control);
    } else {
      this.columns.splice(add.index, 0, add.control);
    }

    this.scrollToSelected();

    if (add.control.key !== empty_key) {
      add.control.parentKey = this.control.key;

      if (this.control.path) {
        const path = this.control.path.slice();
        path.push(add.control.key);
        add.control.path = path;
      }

      dataitemStore.switchUsed(this, this.control.key, add.control.key);
      this.emitUpdate();
    }

    this.syncHeight();
  }

  onColumnMove(move: { index: number; controlKey: string }) {
    let index = this.columns.findIndex((c) => c.key === move.controlKey);
    if (index === move.index) {
      return;
    }
    const control = this.columns[index];
    this.columns.splice(move.index, 0, control);
    if (move.index <= index) {
      index++;
    }
    this.columns.splice(index, 1);
    this.emitUpdate();
  }

  onColumnDelete(controlKey: string) {
    const index = this.columns.findIndex((c) => c.key === controlKey);
    if (index === -1) {
      return;
    }
    this.columns.splice(index, 1);
    if (controlKey !== empty_key) {
      dataitemStore.switchUsed(this, this.control.key, controlKey);
      this.emitDataItemDelete(controlKey, this.control.key);
      this.emitUpdate();
    }

    this.syncHeight();
  }

  syncHeight() {
    const $tab = this.$el.querySelector('.sheet-tab') as HTMLDivElement;
    if ($tab && $tab.parentNode) {
      const $empty = this.$el.querySelector('.sheet-empty') as HTMLDivElement;
      if ($empty) {
        const h =
          ($tab.parentNode as HTMLDivElement).offsetHeight - $tab.offsetHeight;
        $empty.style.height = h === 0 ? '100%' : `calc(100% - ${h}px)`;
      }
    }
  }

  emitUpdate() {
    if (this.emitControlUpdate) {
      if (!this.control.path) {
        this.emitControlUpdate(this.control.key, {
          columns: this.columns,
        });
      } else {
        this.emitControlUpdate(
          this.control.key,
          {
            columns: this.columns,
          },
          '',
          this.control.path,
        );
      }
    }
  }

  findColumnIndex(key: string) {
    return this.columns.findIndex((c) => c.key === key);
  }

  hideEmptyCol() {
    this.columns
      .map((x, i) => (x.key === empty_key ? i : -1))
      .filter((i) => i !== -1)
      .reverse()
      .forEach((i) => this.columns.splice(i, 1));
  }

  showEmptyCol(index: number) {
    const empty = {
      key: empty_key,
    };
    const idx = this.columns.findIndex((c) => c.key === empty_key);
    if (idx < 0) {
      this.columns.splice(index, 0, empty);
    } else {
      this.hideEmptyCol();
      this.columns.splice(index, 0, empty);
    }
  }

  setHideEmptyTask(now = false) {
    clearTimeout(this._hideTimeoutRef);
    if (now) {
      this.hideEmptyCol();
    } else {
      this._hideTimeoutRef = setTimeout(() => this.hideEmptyCol(), 300);
    }
  }

  clearHideEmptyTask() {
    clearTimeout(this._hideTimeoutRef);
  }

  setShowEmptyTask(index: number) {
    // clearTimeout(this._showTimeoutRef);
    // this._showTimeoutRef = setTimeout(() => {
    this.showEmptyCol(index);
    this.setHideEmptyTask();
    // }, 300);
  }

  replaceEmpty(control: FormControl) {
    const index = this.findColumnIndex(empty_key);

    if (index === -1) {
      return false;
    }

    this.columns.splice(index, 1, control);

    return true;
  }

  mounted() {
    this.syncHeight();
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-admin-core/src/styles/color/colors.less';
div.sheet {
  display: flex;
  cursor: default;
  height: 100%;
  overflow: auto;
  margin-right: 1px;
  & > div {
    overflow: auto;
  }
}

.sheet-tab {
  border-collapse: unset;
  border-spacing: 0;
  height: 100%;

  td {
    border-right-width: 0;
    border-bottom-width: 0;
    &.empty-last {
      border-right: thin solid #d9d9d9;
      border-right-width: unset;
      position: sticky !important;
      z-index: 2;
      right: 0;
      min-width: 98px;
      width: 98px;
      &.top {
        border-top-right-radius: 4px;
      }
      &.bottom {
        border-bottom-right-radius: 4px;
      }
    }

    &.empty {
      border-width: 1px;
      border-radius: 4px;
    }
  }

  tr {
    &:first-child td:first-child {
      border-top-left-radius: 4px;
    }

    &:last-child td {
      border-bottom-width: 1px;
      &:first-child {
        border-bottom-left-radius: 4px;
      }
    }
  }
}

.sheet-empty {
  // width: 178px;
  border-collapse: unset;
  border-spacing: 0;
  height: 100%;

  & td {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
    border-right-width: 1;
  }

  tr {
    &:first-child td {
      border-top-right-radius: 4px;
      border-bottom: none;
      // height: 79px;
    }

    &:last-child td {
      border-bottom-right-radius: 4px;
      height: 38px;
    }
  }
}

td {
  position: relative;
  // min-height: 78px;
  // max-height: 78px;
  vertical-align: top;
  width: 175px;
  max-width: 175px;
  min-width: 175px;
  padding: 0;
  border: 1px solid #d9d9d9;
  background-color: #fff;

  &.empty {
    vertical-align: middle;
    text-align: center;
    color: rgba(17, 18, 24, 0.25);
  }
  // &.empty div {
  //   min-height: 78px;
  // }

  &.entry-empty {
    min-width: 2px;
    max-width: 2px;
    border: none !important;
    background-color: @primary-color;
    padding: 0;
    margin: 0;
    position: relative;
    transform: translateX(2px);
    z-index: 1501;
    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 4px;
      border: 2px solid @primary-color;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      background-color: #fff;
      z-index: 1501;
    }
    &.entry-empty-none-before {
      &::before {
        display: none;
      }
    }
  }
  &.dragging {
    background: rgba(17, 18, 24, 0.04);
    opacity: 0.3;
    &.control-label {
      background-color: transparent;
    }
  }

  // &:focus,
  &.selected {
    // outline: 1px dashed @primary-color;
    background-color: @sub-bg-color;
  }
}

.foot td {
  height: 38px;
  text-align: center;
  vertical-align: middle;
  color: rgba(17, 18, 24, 0.5);
}
/deep/.drag-over-item {
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
