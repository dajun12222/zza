<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    v-show="display"
    class="h3-form-sheet"
    :class="{
      vertical: layoutType,
      'h3-form-sheet-show-tips': controlOpts.tips,
    }"
    @touchmove.stop
    @touchstart.stop
    @touchend.stop
  >
    <div
      class="h3-form-sheet-head sheet-row"
      :class="{ 'h3-form-sheet-head_sticky': !isHorizontal }"
    >
      <template v-if="control.options.labelVisible === false">
        <h3-field
          :required="control.required"
          :showIcon="false"
          :tip="controlOpts.tips"
        />
      </template>
      <template v-else>
        <h3-field
          :required="control.required"
          :label="label"
          :showIcon="false"
          :tip="controlOpts.tips"
        />
      </template>
      <!-- <span :style="style">{{ label }}</span> -->
      <div class="sheet-row__actions">
        <div
          v-if="editModal"
          v-show="isTable && canDelete"
          class="sheet-row__actions__item"
          @click="removeChecked"
        >
          <span class="aufontAll h-icon-all-delete-o"></span>
        </div>

        <div
          v-if="editModal || sheetCustomActions.length > 0"
          v-show="!isHorizontal"
          class="sheet-row__actions__item"
          @click="addSheetRow"
        >
          <span class="aufontAll h-icon-all-plus-o"></span>
        </div>

        <div class="sheet-row__actions__item" @click="changeMode">
          <span
            class="aufontAll"
            :class="[
              isHorizontal ? 'h-icon-all-list-o' : 'h-icon-all-same-size',
            ]"
          ></span>
        </div>
      </div>
    </div>

    <h3-modal
      :show.sync="showModel"
      :appendToBody="true"
      maskClosable
      type="popup"
      popupDirection="right"
      @on-show="showSearch"
      @on-hide="hideSearch"
    >
      <div class="h3-form-sheet-search-title">
        {{ $t('cloudpivot.form.renderer.selectNumber') }}
      </div>
      <div class="h3-form-sheet-search-list">
        <template v-if="isTable">
          <span
            v-for="key in sheetTab"
            :key="key"
            class="h3-form-sheet-search-item"
            :class="{ selected: currentTableIndex + 1 === key }"
            @click="changeTableTab(key - 1)"
            >{{ key }}</span>
        </template>
        <template v-else>
          <span
            v-for="key in sheetTab"
            :key="key"
            class="h3-form-sheet-search-item"
            :class="{ selected: currentIndex === key }"
            @click="changeTab(key - 1, 'change')"
            >{{ key }}</span>
        </template>
      </div>
      <template v-if="control">
        <relevance-form-modal
          v-control-back
          v-transfer-dom
          class="relevance-form-panel"
          :visible="showModal"
          :schemaCode="schemaCode"
          :queryCode="queryCode"
          :control="control"
          :columns="columns"
          :query="query"
          @change="relevanceFormChange"
          @back="close"
        />
      </template>
    </h3-modal>

    <template v-if="isTable">
      <div v-if="control.columns.length" class="sheet">
        <div class="h3-form-sheet-action sheet-row">
          <div ref="selectedTab" class="h3-form-sheet-action-tab">
            <span
              v-for="key in sheetTab"
              :key="key"
              class="sheet-row__actions__item"
              :class="[
                currentTableIndex + 1 === key
                  ? 'h3-form-sheet-action-tab-selected'
                  : '',
              ]"
              @click="changeTableTab(key - 1)"
              >{{ key }}</span>
          </div>

          <div class="sheet-row__actions">
            <!--交互： 超过30条时展示可以搜索的便捷操作-->
            <div
              v-if="rows.length > 29"
              class="sheet-row__actions__item"
              @click="search"
            >
              <span class="aufontAll h-icon-all-matrix"></span>
            </div>
          </div>
        </div>
        <div class="sheet-center">
          <table>
            <thead>
              <tr>
                <th class="col50">
                  <input
                    type="checkbox"
                    :checked="checkedAll"
                    @click="checkAll"
                  />
                </th>
                <th class="col50">
                  {{ $t('cloudpivot.form.renderer.number') }}
                </th>
                <th
                  v-for="(col, colIdx) in control.columns"
                  v-show="showColumn(colIdx)"
                  :key="col.key"
                  :style="getColumnStyle(col)"
                >
                  {{ getColumnLabel(col) }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(row, rowIdx) in tableActiveRows" :key="rowIdx">
                <td class="col50">
                  <input
                    type="checkbox"
                    :checked="checkeds[rowIdx]"
                    @click="check(rowIdx)"
                  />
                </td>
                <td class="col50">
                  {{ rowIdx + 1 }}
                </td>
                <td
                  v-for="(col, colIdx) in row"
                  v-show="showColumn(colIdx)"
                  :key="col.key"
                  @resize="setHeights(rowIdx)"
                >
                  <div>
                    <base-control-adapter
                      v-show="col.controller.display"
                      :control="col"
                      :isSheetTable="true"
                      :class="{ error: col.controller.hasError }"
                    />
                  </div>
                </td>
              </tr>

              <tr v-if="showTotal">
                <td class="col50" colspan="2">
                  {{ $t('cloudpivot.form.renderer.total') }}
                </td>
                <td
                  v-for="(col, colIdx) in control.columns"
                  v-show="showColumn(colIdx)"
                  :key="colIdx"
                  style="text-align: center"
                >
                  <template v-if="showStat(col.key)">
                    {{ getStatText(col.key)
                    }}{{ statisticsMap[col.key] | number }}
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <template v-else>
      <div v-show="isHorizontal" class="h3-form-sheet-action sheet-row">
        <div ref="selectedTab" class="h3-form-sheet-action-tab">
          <span
            v-for="key in sheetTab"
            :key="key"
            class="sheet-row__actions__item"
            :class="[
              currentIndex + 1 === key
                ? 'h3-form-sheet-action-tab-selected'
                : '',
            ]"
            @click="changeTab(key - 1, 'change')"
            >{{ key }}</span>
        </div>

        <div class="sheet-row__actions">
          <!--交互： 超过30条时展示可以搜索的便捷操作-->
          <div
            v-if="rows.length > 29"
            class="sheet-row__actions__item"
            @click="search"
          >
            <span class="aufontAll h-icon-all-matrix"></span>
          </div>

          <div
            v-if="editModal || sheetCustomActions.length > 0"
            class="sheet-row__actions__item"
            @click="addSheetRow"
          >
            <span class="aufontAll h-icon-all-plus-o"></span>
          </div>
        </div>
      </div>

      <div class="h3-rows" :class="{ horizontal: isHorizontal }">
        <!-- 瀑布向下滚动方式 -->
        <template v-if="isWaterfall">
          <div
            :id="id + rowIndex"
            v-for="(row, rowIndex) in rows"
            :key="`row-${rowIndex}`"
            class="h3-form-sheet-component"
          >
            <div
              v-show="!isHorizontal"
              class="h3-form-sheet-col-title sheet-row"
            >
              {{
                $t('cloudpivot.form.renderer.indexOf', { index: rowIndex + 1 })
              }}
            </div>
            <div>
              <base-control-adapter
                v-for="(col, colIndex) in rows[rowIndex]"
                v-show="col.options.visible && col.controller.display"
                :key="`col-${colIndex + 1}`"
                :control="col"
                :class="{ error: col.controller.hasError }"
              />
            </div>
            <div v-if="editModal" class="h3-form-sheet-footer sheet-row">
              <span @click="copy(rowIndex)">
                <i class="aufontAll h-icon-all-copy-o"></i>
                {{ $t('cloudpivot.form.renderer.copy') }}
              </span>

              <span @click="splice(rowIndex)">
                <i class="aufontAll h-icon-all-delete-o"></i>
                {{ $t('cloudpivot.form.renderer.delete') }}
              </span>
            </div>
          </div>
          <p class="h3-form-sheet-col-margin" style="margin-bottom:0;"></p>
        </template>
        <!-- 切换Tab分页显示记录方式 -->
        <template v-else>
          <div
            :id="id"
            :key="`row-${currentIndex}`"
            class="h3-form-sheet-component active"
          >
            <div
              v-show="!isHorizontal"
              class="h3-form-sheet-col-title sheet-row"
            >
              {{
                $t('cloudpivot.form.renderer.indexOf', { index: currentIndex })
              }}
            </div>
            <div>
              <base-control-adapter
                v-for="(col, colIndex) in rows[currentIndex]"
                v-show="col.options.visible && col.controller.display"
                :key="`col-${colIndex + 1}`"
                :control="col"
                :class="{ error: col.controller.hasError }"
              />
            </div>
            <div v-if="editModal" class="h3-form-sheet-footer sheet-row">
              <span @click="copy(currentIndex)">
                <i class="aufontAll h-icon-all-copy-o"></i>
                {{ $t('cloudpivot.form.renderer.copy') }}
              </span>

              <span @click="splice(currentIndex)">
                <i class="aufontAll h-icon-all-delete-o"></i>
                {{ $t('cloudpivot.form.renderer.delete') }}
              </span>
            </div>
            <p class="h3-form-sheet-col-margin" style="margin-bottom:0;"></p>
          </div>
        </template>
      </div>
    </template>

    <div>
      <h3-dialog v-model="showRelevanceFormAdd" class="dialog-sheet-add">
        <div class="dialog-sheet-add__content">
          <div class="dialog-tips">
            <div>
              <p>{{ $t('cloudpivot.form.runtime.biz.addMethod') }}</p>
            </div>
          </div>
          <div class="dialog-content">
            <div v-if="editModal">
              <p @click="add">
                {{ $t('cloudpivot.form.runtime.biz.add') }}
              </p>
            </div>
            <div v-if="editModal">
              <p
                v-if="importFormRelevanceForm"
                class="no-padding"
                @click="importRelevance"
              >
                {{ $t('cloudpivot.form.runtime.biz.importFormRelevanceForm') }}
              </p>
            </div>
            <template v-for="action in sheetCustomActions">
              <div
                v-show="action.visible"
                :key="action.code"
                :class="{ 'btn-disabled': action.disabled }"
              >
                <p @click="customBtnclick(action.code)">
                  {{ action.text }}
                </p>
              </div>
            </template>
          </div>
        </div>
      </h3-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import common from 'cloudpivot/common';
import {
  RendererFormControl,
  SheetDisplayMode,
} from 'cloudpivot-form/form/schema';
import RelevanceFormModal from 'cloudpivot-form/form/src/common/components/relevance-form-modal2.vue';
import { FormSheetControl } from 'cloudpivot-form/form/src/common/controls/form-sheet-control';
import { RelevanceFormControl } from 'cloudpivot-form/form/src/common/controls/relevance-form-control';
import ControlBack from 'cloudpivot-form/form/src/common/directives/control-back';
import { ReverseQueryService } from 'cloudpivot-form/form/src/common/services';
import BaseControlAdapter from 'cloudpivot-form/form/src/renderer/components/mobile/base-control-adapter.vue';
import numberFilter from 'cloudpivot-form/form/utils/number-filter';
import { H3CheckboxItem, H3Dialog, H3Field, H3Modal } from 'h3-mobile-vue';
import { Component, Inject, Watch } from 'vue-property-decorator';

@Component({
  name: 'form-sheet',
  components: {
    BaseControlAdapter,
    H3Modal,
    H3Dialog,
    H3CheckboxItem,
    RelevanceFormModal,
    H3Field,
  },
  filters: {
    number: numberFilter,
  },
  directives: {
    ControlBack,
    TransferDom: common.directives.transferDom,
  },
})
export default class FormSheet extends FormSheetControl {
  // 子表交互属性
  mode = SheetDisplayMode.Waterfall;

  currentIndex: number = 0;

  currentTableIndex: number = 0; //二维表模式下当前选中页码

  tablePageSize: number = 20; //二维表模式下每页条数

  showModel: boolean = false;

  checkeds: boolean[] = [];

  shadowLeft = false;

  shadowRight = false;

  showRelevanceFormAdd = false;

  @Inject({
    default: () => () => {},
  })
  emitScrollTop!: (top: number) => void;

  @Inject({
    default: () => () => {},
  })
  emitScrollLock!: (lock: boolean) => void;

  // 子表计算属性
  get isHorizontal() {
    // return this.mode === "h";
    return this.isPage;
  }

  @Inject()
  layoutTypeFn!: Function;

  //上下布局模式
  get layoutType() {
    if (this.layoutTypeFn) {
      return this.layoutTypeFn();
    }
  }

  get sheetTab() {
    const rowLength = this.editModal
      ? this.rows.length
        ? this.rows.length
        : 0
      : this.resLength;
    //子表二维表模式
    if (this.isTable) {
      //以每页20条记录，计算出共有多少页
      const pageSize = Math.ceil(rowLength / this.tablePageSize);
      return pageSize;
    } else {
      return rowLength;
    }
  }

  /**
   * 获取当前页的子表数据
   */
  get tableActiveRows() {
    const activeRows = this.rows.slice(
      this.currentTableIndex * this.tablePageSize,
      (this.currentTableIndex + 1) * this.tablePageSize,
    );
    return activeRows;
  }

  get isWaterfall() {
    return this.mode === SheetDisplayMode.Waterfall;
  }

  get isPage() {
    return this.mode === SheetDisplayMode.Page;
  }

  get isTable() {
    return this.mode === SheetDisplayMode.Table;
  }

  get canDelete() {
    return this.checkeds.some((c) => c);
  }

  // 是否可以编辑
  get editModal() {
    return !this.readonly && this.canEdit;
  }

  get isReadonly() {
    return this.readonly;
  }

  get checkedAll() {
    return this.checkeds.length > 0 && this.checkeds.every((c) => c);
  }

  get indeterminate() {
    const checkeds = this.checkeds.filter((c) => c);
    return checkeds.length > 0 && checkeds.length < this.checkeds.length;
  }

  checkAll(evt: any) {
    const checked = evt.target.checked;
    this.checkeds = this.checkeds.map((c) => checked);
  }

  check(idx: number) {
    const checked = this.checkeds[idx];
    this.$set(this.checkeds, idx, !checked);
  }

  removeChecked() {
    this.checkeds
      .map((c, i) => (c ? i : -1))
      .filter((i) => i > -1)
      .reverse()
      .forEach((i) => this.splice(i));
  }

  customBtnclick(code: string) {
    const theBtn = this.sheetCustomActions.find((res) => res.code === code);
    if (theBtn && theBtn.disabled) {
      return;
    }
    super.customBtnclick(code);
    this.showRelevanceFormAdd = false;
  }

  // 子表交互函数
  // changeMode() {
  //   if (this.mode === "h") {
  //     this.mode = "v";
  //     return;
  //   }
  //   this.mode = "h";
  // }
  changeMode() {
    if (this.isWaterfall) {
      this.mode = SheetDisplayMode.Page;
    } else if (this.isPage) {
      this.mode = SheetDisplayMode.Table;
      // if (!this.editModal) {
      //   this.rows.length = 0;
      //   this.control.value.forEach((val, i) => {
      //     this.addRow(val, i, true);
      //   });
      // }
    } else if (this.isTable) {
      this.mode = SheetDisplayMode.Waterfall;
      // if (!this.editModal) {
      //   this.rows.length = 0;
      //   this.control.value.forEach((val, i) => {
      //     this.addRow(val, i, true);
      //   });
      // }
    } else {
    }
  }

  /**
   * 二维表模式的切换页码事件
   */
  changeTableTab(key: number) {
    if (this.showModel) {
      this.showModel = false;
    }
    const idx = this.currentTableIndex;
    if (idx === key) {
      return;
    }
    this.currentTableIndex = key;
  }

  changeTab(key: number, type: any) {
    //切换搜索中的tab页码时
    if (this.isTable) {
      if (type === 'change') {
        this.changeTableTab(key);
      } else {
        this.currentTableIndex = this.sheetTab - 1;
        this.changeTableTab(this.currentTableIndex);
      }
    } else {
      if (this.showModel) {
        this.showModel = false;
        this.positionRow();
      }
      const idx = this.currentIndex;
      if (idx === key) {
        return;
      }

      /*
      //子表非编辑状态下使用点击tab创建ctrl方式
      if (!this.editModal) {
        //手动切换tab触发创建Ctrl
        if (key > idx && type === 'change') {
          let diff_tag = !!(this.control as any).diff;
          for (let i = idx + 1; i <= key; i++) {
            if (!this.control.value[i]) {
              return;
            }
            const g = this.addRow(this.control.value[i], i, true);
            if (diff_tag) (g as any).diff = (this.control as any).diff[i]; // 表单对比 子表值是
            if (g) {
              this.buildRow(i, g);
            }
          }
        }
      }*/

      this.currentIndex = key;
    }
  }

  @Watch('isEdit')
  onWritableChange() {
    super.edit();
  }

  setControl() {
    this.mode =
      this.controlOpts.mobileDisplayMode || SheetDisplayMode.Waterfall;

    const ctrl = this.getCtrl();
    if (!ctrl) {
      return;
    }

    this.reset();

    super.listenPropertyChange();

    super.initStat();

    super.initRows(this.currentIndex, 'mobile');

    this.checkeds = this.rows.map(() => false);

    super.listenRowChange();

    this.currentIndex = 0;

    this.currentTableIndex = 0;
  }

  copy(idx: number) {
    super.copy(idx);
  }

  showModal = false;

  // get schemaCode() {
  //   return super.schemaCode;
  // }

  // get queryCode() {
  //   return super.queryCode;
  // }

  query: any[] = [];

  importRelevance() {
    this.show();
    this.query = this.getParams(true);
    this.columns = this.relavanceColumns();
    this.closeAdd();
  }

  addSheetRow() {
    if (this.importFormRelevanceForm || this.sheetCustomActions.length > 0) {
      this.showRelevanceFormAdd = true;
    } else {
      this.add();
    }
  }

  show() {
    this.showModal = true;
  }

  close() {
    this.showModal = false;
  }

  async relevanceFormChange(val) {
    const formControls = this.getFormControls();
    // ;
    this.close();
    const dataitems = await RelevanceFormControl.service.dataitemsOf(
      this.schemaCode,
    );
    if (!val || val.length === 0) {
      return;
    }
    val.forEach((res) => {
      const obj: any = {};
      (this.control as any).columns.forEach((c) => {
        if (c.key === this.controlOpts.importFormRelevanceForm) {
          // ;
          let formData = res;
          if (this.mappings) {
            formData = ReverseQueryService.convertForMappings(
              res,
              dataitems,
              this.mappings,
              formControls,
            );
          }
          obj[c.key] = formData;
        } else {
          // obj[c.key] = null;
        }
      });
      const backRow: any = this.addRow();
      backRow.value = obj;
      // this.addRow(obj);
    });
  }

  closeAdd() {
    this.showRelevanceFormAdd = false;
  }

  add(idx?: number, vals?: any) {
    const row =
      typeof idx === 'number' ? this.addRow(vals, idx) : this.addRow(vals);

    if (this.showRelevanceFormAdd) {
      this.closeAdd();
    }
  }

  splice(idx: number) {
    this.removeRow(idx);
  }

  rowInserted(index: number, row: RendererFormControl[]): void {
    this.checkeds.splice(index, 0, false);
    this.changeTab(index, 'auto');

    this.positionRow();
  }

  rowRemoved(index: number, row: RendererFormControl[]) {
    this.checkeds.splice(index, 1);
    this.changeTab(index === 0 ? 0 : index - 1, 'auto');
    this.positionRow();
  }

  rowsInserted(index: number, rows: RendererFormControl[][]): void {
    const news = rows.map(() => false);
    this.checkeds.splice(index, 0, ...news);
    this.changeTab(index + rows.length - 1, 'auto');
    this.positionRow();
  }

  rowsRemoved(indexs: number[]) {
    for (const index of indexs) {
      this.checkeds.splice(index, 1);
    }

    if (this.currentIndex > this.checkeds.length) {
      const index = this.checkeds.length === 0 ? 0 : this.checkeds.length - 1;
      this.changeTab(index, 'auto');
    }

    this.positionRow();
  }

  search() {
    this.showModel = true;
  }

  showSearch() {
    this.emitScrollLock(true);
  }

  hideSearch() {
    this.emitScrollLock(false);
    this.showModel = false;
  }

  positionRow() {
    this.$nextTick(() => {
      if (this.mode === SheetDisplayMode.Waterfall) {
        const id = '#' + this.id;
        const el = this.$el.querySelector(id) as HTMLDivElement;
        if (el) {
          this.emitScrollTop(el.offsetTop);
        }
      } else if (this.mode === SheetDisplayMode.Page) {
        const selectedTab = this.$refs.selectedTab as any;
        const tab = this.$el.querySelector(
          '.h3-form-sheet-action-tab-selected',
        ) as HTMLDivElement;
        if (tab) {
          selectedTab.scrollLeft = tab.offsetLeft;
        }
      } else {
      }
    });
  }

  getColumnStyle(col: any) {
    return col.options.style;
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot/common/styles/mixins.less';
@import '~cloudpivot/common/common';
.sheet-row {
  display: flex;
  align-items: center;
  text-align: left;
  justify-content: space-between;
  min-height: 45px;
  border-bottom: 1px solid #eee;
  background: #fff;

  &__actions__item {
    width: 45px;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    text-align: center;
    display: inline-block;
    color: #999;
    user-select: none;
  }
}

.h3-form-sheet {
  overflow: hidden;
  &.h3-form-sheet-show-tips {
    overflow: visible;
  }
  .aufontAll {
    color: @primary-color;
  }
  &-head {
    font-size: 17px;
    font-weight: 500;
    padding-right: 0;
    color: #333;
    &_sticky {
      background-color: #fff;
      // position: sticky;
      // top: 0;
      z-index: 2;
    }
  }

  &-action {
    background-color: #fff;
    padding: 0;
    // position: sticky;
    // top: 0;
    z-index: 2;

    &-tab {
      flex-grow: 1;
      overflow-x: scroll;
      white-space: nowrap;

      &::-webkit-scrollbar {
        height: 0;
      }

      span {
        color: #333;
      }

      &-selected {
        // color: @primary-color !important;
        background: @background-color;
      }
    }

    & > .sheet-row__actions {
      flex-shrink: 0;
      box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.15);
    }
  }

  &-component {
    // background-color: #F8F8F8;
    // padding-bottom: 0.5em;
    .h3-form-sheet-col-title {
      padding-left: 0.4rem;
      text-align: left;
      font-size: 15px;
      font-weight: 500;
      color: #333;
    }

    /deep/.h3-form-sheet-col-margin {
      height: 4px;
      width: 100%;
      background-color: #f8f8f8;
      margin-bottom: 0;
    }

    & > div {
      min-height: 45px;
    }
  }

  &-footer {
    color: @primary-color;
    justify-content: space-between;
    padding: 0;
    align-items: initial;

    span {
      display: inline-flex;
      width: 50%;
      font-size: 14px;
      justify-content: center;
      align-items: center;
      position: relative;
      user-select: none;

      &:not(:last-child)::after {
        content: '';
        height: @font-size-20;
        width: 1px;
        background: #eeeeee;
        position: absolute;
        top: 12.5px;
        right: 0;
      }

      i {
        margin-right: 8px;
      }

      // &:active{
      //   background:@background-color;
      // }
    }
  }

  &-search-title {
    height: 45px;
    line-height: 45px;
    padding: 0 15px;
    color: #666666;
    font-size: 15px;
    text-align: left;
  }
  &-search-list {
    text-align: left;
    padding: 0 7px 0 15px;

    .h3-form-sheet-search-item {
      display: inline-block;
      width: 54px;
      height: 34px;
      background: #f7f8fc;
      border-radius: 4px;
      line-height: 34px;
      margin-right: 8px;
      margin-bottom: 8px;
      text-align: center;
      color: #333;

      &.selected {
        background: #e9f0ff;
      }
    }
  }
}

// .sheet {
//   display: flex;
//   flex-grow: 1;
// }

td,
th {
  border: 1px #e8e8e8 solid;
  min-height: 38px;
  height: 38px;
}

thead th {
  background-color: #fafafa;
  max-height: 38px;
  // padding: 0 8px;
  font-weight: 500;
}

tbody td {
  // padding: 3px 8px;
  word-break: break-all;
}

.sheet-center > table {
  border-collapse: unset;
  border-spacing: 0;
  border: none;
  z-index: 1;
}

.sheet-center {
  flex: 1 1;
  overflow-x: auto;

  & > table {
    min-width: 100%;
    & th,
    td {
      min-width: 136px;
      max-width: 320px;
      border: 1px #e8e8e8 solid;
      border-width: 1px 0 0 1px;
      position: relative;

      /deep/ .h3-field-layout-h-label {
        display: none;
      }

      /deep/ .h3-field-line::after {
        display: none;
      }

      /deep/ .h3-upload::after {
        display: none;
      }

      /deep/ .field__label {
        display: none;
      }

      /deep/ .field.relevance-form::after {
        display: none;
      }

      /deep/ .h3-org::after {
        display: none;
      }

      /deep/ .h3-radio-list::after {
        display: none;
      }
    }

    tr {
      &:first-child th {
        border-top-width: 0;
      }

      &:last-child td {
        border-bottom-width: 1px;
      }

      td,
      th {
        &.col50,
        &:first-child {
          width: 50px;
          min-width: 50px;
          text-align: center;
        }
        &:last-child {
          border-right-width: 1px;
        }
      }
    }
  }
}

.sheet-right {
  &.shadow {
    box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.15);
  }

  & th,
  td {
    width: 46px;
    min-width: 46px;
    max-width: 46px;
    text-align: center;
    vertical-align: middle;
    border: 1px #e8e8e8 solid;
    border-width: 1px 1px 0 0;
  }

  tr {
    &:first-child th:first-child {
      border-top-right-radius: 4px;
    }

    &:last-child td {
      border-bottom-width: 1px;
      &:first-child {
        border-bottom-right-radius: 4px;
      }
    }
  }
}

.row-menus {
  & > li {
    cursor: pointer;
  }
}

/deep/.h3-modal-popup-slide-right {
  width: 336px !important;
}

/deep/.h3-modal-wrap-side {
  overflow: auto;
}

.h3-rows.horizontal {
  display: flex;
  flex-direction: row;
  will-change: margin-left;
  transition: margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;

  .h3-form-sheet-component {
    flex-shrink: 0;
    width: 100%;
    transition: opacity 0.45s;
    opacity: 1;
    margin-bottom: 0!important;
    &:not(.active) {
      opacity: 0;
      height: 0;
      padding: 0 !important;
      pointer-events: none;
    }
  }
}
.dialog-sheet-add {
  text-align: left;
  /deep/.h3-dialog {
    box-shadow: 0px 45px 50px 0px rgba(0, 0, 0, 0.4);
    max-height: calc(100vh - 4rem);
    overflow: auto;
  }

  &__content {
    // padding: 0.56rem 0;
    p {
      text-align: left;
      // margin-bottom: 0.4rem;
      line-height: 1.36rem;
      margin-bottom: 0;
    }
    .dialog-tips {
      & > div {
        p {
          color: #999999;
          font-size: 0.37rem;
        }
      }
    }
    .dialog-content,
    .dialog-tips {
      & > div {
        position: relative;
        padding: 0 0.56rem;
        .hairline('bottom', #BBB);
        &.btn-disabled {
          p {
            color: #ccc;
          }
        }
      }
      p {
        font-size: 0.45rem;
        margin-bottom: 0;
        color: #1d1d26;
      }
      p.no-padding {
        margin-bottom: 0;
      }
    }
  }
  .h3-dialog {
    width: 7.2rem;
  }
}
</style>
