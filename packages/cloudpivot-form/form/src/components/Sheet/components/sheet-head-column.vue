<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div
    class="sheet-head-column"
    :style="getHeadColStyle(colIdx - 1, col.key)"
    :class="{ 'is-group': group, last: getIsLast(colIdx, col.key) }"
  >
    <template v-if="group">
      <h3-size-slider
        v-show="showColumn(col.key)"
        class="middle sheet__col"
        :class="[
          getControlClass(col.type),
          !group.child ? 'no-child-group' : '',
          group ? 'is-group' : '',
        ]"
        :style="getHeadColStyle(colIdx - 1, col.key)"
        :right="true"
      >
        <div :style="getColumnStyle(col)" class="ctrl">
          {{ group.groupName }}

          <template v-if="!isChild && group.colspan[1] - group.colspan[0] < 3">
            <template v-if="!isFrozenColumn">
              <a-dropdown
                v-show="canFrozen && sheetIsScroll"
                :trigger="['click']"
              >
                <a class="ant-dropdown-link">
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a href="javascript:;" @click="freezeColumn(group, true)">{{
                      $t('cloudpivot.form.renderer.frozenColumn')
                    }}</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>

            <template v-else>
              <a-dropdown v-show="canUnFrozen" :trigger="['click']">
                <a class="ant-dropdown-link">
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a
                      href="javascript:;"
                      @click="freezeColumn(group, false)"
                      >{{ $t('cloudpivot.form.renderer.unFrozenColumn') }}</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </template>
        </div>

        <template v-if="!group.child">
          <div class="column" style="display: flex">
            <template v-for="number in group.colspan[1] - group.colspan[0] + 1">
              <h3-size-slider
                v-show="showColumn(col.key)"
                :key="number"
                class="middle sheet__col"
                :class="[getControlClass(col.type)]"
                :style="getColStyle(columns[colIdx - 1 + number].key)"
                :right="true"
                @resize="
                  (e) =>
                    onColResize(
                      e,
                      colIdx - 1 + number,
                      columns[colIdx - 1 + number],
                    )
                "
              >
                <div
                  :style="getColumnStyle(columns[colIdx - 1 + number])"
                  class="ctrl"
                >
                  <a-tooltip
                    v-if="getTips(columns[colIdx - 1 + number])"
                    placement="top"
                  >
                    <template slot="title">
                      <span>{{ getTips(columns[colIdx - 1 + number]) }}</span>
                    </template>
                    <a-icon type="question-circle-o" />
                  </a-tooltip>

                  {{ getColumnLabel(columns[colIdx - 1 + number]) }}
                </div>
              </h3-size-slider>
            </template>
          </div>
        </template>
      </h3-size-slider>

      <div v-if="group.child" class="child-column" style="display: flex">
        <template>
          <template v-for="number in group.colspan[1] - group.colspan[0]">
            <sheetHeadColumn
              :key="number"
              :colIdx="getColIndex(group.colspan[0] + number)"
              :col="getCol(group.colspan[0] + number)"
              :group="getGroup(group.colspan[0] + number - 1)"
              :colspans="childColspans"
              :columns="columns"
              :isshow="isshow"
              :showColumn="showColumn"
              :getTips="getTips"
              :getColumnLabel="getColumnLabel"
              :getColumnStyle="getColumnStyle"
              :getControlClass="getControlClass"
              :getColStyle="getColStyle"
              :isChild="true"
              :canFrozen="canFrozen"
              :sheetIsScroll="sheetIsScroll"
              @onColResize="onColResize"
            />
          </template>
        </template>
      </div>
    </template>

    <template v-if="!group && isshow(colIdx - 1)">
      <h3-size-slider
        v-show="showColumn(col.key)"
        class="middle sheet__col"
        :class="[getControlClass(col.type)]"
        :style="getColStyle(col.key)"
        :right="true"
        @resize="(e) => onColResize(e, colIdx, col)"
      >
        <div :style="getColumnStyle(col)" class="ctrl">
          <a-tooltip v-if="getTips(col)" placement="top">
            <template slot="title">
              <span>{{ getTips(col) }}</span>
            </template>
            <a-icon type="question-circle-o" />
          </a-tooltip>

          {{ getColumnLabel(col) }}

          <template v-if="!isChild">
            <template v-if="!isFrozenColumn">
              <a-dropdown
                v-show="canFrozen && sheetIsScroll"
                :trigger="['click']"
              >
                <a class="ant-dropdown-link">
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a
                      href="javascript:;"
                      @click="freezeColumn(col.key, true)"
                      >{{ $t('cloudpivot.form.renderer.frozenColumn') }}</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>

            <template v-else>
              <a-dropdown v-show="canUnFrozen" :trigger="['click']">
                <a class="ant-dropdown-link">
                  <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a
                      href="javascript:;"
                      @click="freezeColumn(col.key, false)"
                      >{{ $t('cloudpivot.form.renderer.unFrozenColumn') }}</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </template>
        </div>
      </h3-size-slider>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import common from 'cloudpivot/common/pc';
import { FormSheetColumn } from 'cloudpivot-form/form/schema';

import { Tooltip, Dropdown, Menu, Icon } from '@h3/antd-vue';

@Component({
  name: 'sheetHeadColumn',
  components: {
    H3SizeSlider: common.components.H3SizeSlider,
    ATooltip: Tooltip,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item,
    AIcon: Icon,
  },
})
export default class sheetHeadColumn extends Vue {
  @Prop()
  group!: any;

  @Prop()
  canFrozen!: boolean;

  @Prop()
  canUnFrozen!: boolean;

  @Prop({
    default: false,
  })
  isFrozenColumn?: boolean;

  @Prop()
  sheetIsScroll!: boolean;

  @Prop()
  col!: any;

  @Prop()
  columns!: FormSheetColumn[];

  @Prop()
  colIdx!: number;

  @Prop()
  colspans!: [number, number][];

  @Prop()
  getColStyle!: Function;

  @Prop()
  showColumn!: Function;

  @Prop()
  getControlClass!: Function;

  @Prop()
  getColumnStyle!: Function;

  @Prop()
  getColumnLabel!: Function;

  @Prop()
  getTips!: Function;

  @Prop()
  isChild?: boolean;

  onColResize(e, colIdx, col) {
    console.log(colIdx, col, this.columns);

    this.$emit('onColResize', e, colIdx, col);
  }

  freezeColumn(item: any, type: boolean) {
    console.log(item);

    if (typeof item === 'string') {
      this.$emit('freezeColumn', item, type);
    } else {
      this.$emit('freezeColumnGroup', item, type);
    }
  }

  getGroup(colIdx) {
    if (colIdx < 0) {
      return false;
    }
    return this.group.child.find((group) => group.colspan[0] === colIdx);
  }

  get childColspans(): [number, number][] {
    return this.group.child.map((el) => el.colspan);
  }

  getCol(index) {
    if (this.columns[0].key === 'rowStatus') {
      return this.columns[index];
    }
    return this.columns[index - 1];
  }

  getColIndex(index) {
    if (this.columns[0].key === 'rowStatus') {
      return index;
    }
    return index - 1;
  }

  getIsLast(colIdx, key) {
    if (this.isChild) {
      return false;
    }
    if (key === this.columns[this.columns.length - 1].key) {
      return true;
    }
    if (this.group) {
      const colspan: [number, number] = this.group.colspan;
      if (this.columns[0].key === 'rowStatus') {
        // 表单运行时
        if (
          colspan[1] === this.columns.length - 2 &&
          colspan[0] === colIdx - 1
        ) {
          return true;
        }
      } else {
        // 表单预览时
        if (colspan[1] === this.columns.length - 1 && colspan[0] === colIdx) {
          return true;
        }
      }
    }
    return false;
  }

  // 获取合并表头宽度
  getHeadColStyle(colIdx: number, colKey) {
    if (colKey === 'rowStatus') {
      return {
        display: 'none',
      };
    }

    if (colIdx < 0) {
      return {};
    }
    if (!this.group) {
      return this.getColStyle(colKey);
    }

    const colspan = this.group.colspan;
    if (colspan) {
      let res = 0;
      for (let i = colspan[0]; i <= colspan[1]; i++) {
        if (this.columns[0].key === 'rowStatus') {
          // 表单运行时
          res += parseInt(this.getColStyle(this.columns[i + 1].key).width);
        } else {
          // 预览时
          res += parseInt(this.getColStyle(this.columns[i].key).width);
        }
      }
      return {
        width: res + 'px',
      };
    }
    return this.getColStyle(colKey);
  }

  isshow(colIdx) {
    if (this.columns[0].key !== 'rowStatus') {
      colIdx += 1;
    }

    if (
      this.colspans.some((colspan) => {
        return colspan[0] < colIdx && colIdx <= colspan[1];
      })
    ) {
      return false;
    }
    return true;
  }
}
</script>

<style lang="less" scoped>
.sheet-head-column {
  &:empty {
    display: none !important;
  }
  // width: 100%;
  &.last {
    flex: 1;
    display: flex;
    // flex-direction: row;
    &.is-group {
      & > .sheet__col {
        width: unset !important;
      }
    }
    .sheet__col:last-child {
      flex: 1;
    }
  }
  .h3-size-slider {
    border-bottom: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    text-align: center;
    line-height: 21px;
    padding: 8px 0;
    // flex: 1;
    .ctrl {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .no-child-group {
    padding: 8px 0 0 0;
    border-bottom: none;
    .column {
      display: flex;
      border-top: 1px solid #e8e8e8;
      margin-top: 8px;
      .h3-size-slider:last-child {
        border-right: none;
        flex: 1;
      }
    }
  }
  & > .h3-size-slider {
    height: 100%;
  }
}

.is-group {
  display: flex;
  flex-direction: column;
  & > div:last-child {
    flex: 1;
  }
  & > .h3-size-slider {
    height: 100%;
    &:first-child {
      height: unset;
    }
  }
}
.child-column .sheet-head-column {
  &:last-child {
    flex: 1;
    display: flex;
    .h3-size-slider:last-child {
      flex: 1;
    }
  }
}
</style>

<style lang="less">
.h3-size-slider.number::before {
  display: none;
}
</style>
