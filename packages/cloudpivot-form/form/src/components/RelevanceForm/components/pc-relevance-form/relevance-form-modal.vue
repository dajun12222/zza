<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="relevance-form-modal">
    <a-input
      :value="text"
      :readonly="true"
      :placeholder="placeholder"
      :disabled="readonlyFormula"
      @click="onClick"
      @mouseover="onMouseenter"
      @mouseout="onMouseleave"
    >
      <a-icon
        v-show="hover"
        slot="suffix"
        type="close-circle"
        @click="clear"
        @mouseenter="onMouseenter"
      />
      <a-icon v-show="!hover" slot="suffix" type="file" />
    </a-input>

    <!-- 树形-->
    <a-modal
      v-if="control.options.showStyle === 'tree'"
      :dialogStyle="{ width: '640px' }"
      :title="$t('cloudpivot.list.pc.pleaseSelect')"
      :visible="visible"
      :destroyOnClose="true"
      :maskClosable="false"
      :keyboard="false"
      :dialogClass="dialogClass"
      :closable="true"
      class="tree-modal"
      @ok="onModalOk"
      @cancel="onModalCancel"
    >
      <!-- 搜索框 -->
      <div class="tree-search-box">
        <InputSearch
          v-model="searchTitle"
          class="treeSearch"
          :placeholder="$t('cloudpivot.list.pc.placeInputKey')"
          :allowClear="true"
          :isAsync="false"
          @search="onSearch"
        />
      </div>

      <!-- 弹出框树 -->
      <PageLoading
        v-model="spinning"
        :loadingText="$t('cloudpivot.list.pc.treeDataLoading')"
        shadeColor="#F4F6FC"
        :shadeOpacity="0.5"
        :delay="200"
      />
      <div v-if="treeList.length !== 0 || spinning" class="JumpTree">
        <a-tree
          :value="selected"
          :treeData="treeList"
          :placeholder="$t('cloudpivot.list.pc.pleaseSelect')"
          allowClear
          showSearch
          :expandedKeys="expandedKeys"
          @expand="onExpand"
          @select="onselect"
        >
          <template slot="tree" slot-scope="item">
            <div class="treeNode">
              <a-radio :checked="item.key === selectedKey">
                <span
                  v-if="
                    searchTitle !== '' && item.title.indexOf(searchTitle) !== -1
                  "
                  class="title"
                  :title="item.title"
                >
                  {{ item.title.substr(0, item.title.indexOf(searchTitle)) }}
                  <span class="highlightColor">{{ searchTitle }}</span>
                  {{
                    item.title.substr(
                      item.title.indexOf(searchTitle) + searchTitle.length,
                    )
                  }}
                </span>
                <span v-else class="title" :title="item.title">{{
                  item.title
                }}</span>
              </a-radio>
            </div>
          </template>
        </a-tree>
      </div>

      <!-- 没有数据时候提示 -->
      <div v-if="treeList.length === 0 && !spinning" class="noTreeData">
        <div v-if="searchTitle === ''">
          <div class="noTreeDataPtr"></div>
          <div v-if="searchTitle === ''" class="noTreeDataTips">
            <span>{{ $t('cloudpivot.list.pc.noDataTree2') }}</span>
          </div>
        </div>
        <div v-else>
          <div class="noSearchTreeDataPtr"></div>
          <div class="noTreeDataTips">
            <span>{{ $t('cloudpivot.list.pc.noDataTree3') }}</span>
          </div>
        </div>
      </div>
    </a-modal>

    <!-- 平铺 -->
    <a-modal
      v-else
      :title="formTitle"
      :visible="visible"
      :width="full ? '100%' : '1200px'"
      :destroyOnClose="true"
      :maskClosable="false"
      :keyboard="false"
      :dialogClass="dialogClass"
      @ok="onModalOk"
      @cancel="onModalCancel"
    >
      <a-tooltip v-show="!full" placement="top">
        <template slot="title">
          <span>{{ $t('cloudpivot.form.runtime.biz.fullScreen') }}</span>
        </template>
        <span class="fullscreen icon aufontAll" @click="fullScreen(true)">&#xe8e5;</span>
      </a-tooltip>

      <a-tooltip v-show="full" placement="top">
        <template slot="title">
          <span>{{ $t('cloudpivot.form.runtime.biz.smallScreen') }}</span>
        </template>
        <span class="fullscreen icon aufontAll" @click="fullScreen(false)">&#xe8e7;</span>
      </a-tooltip>
      <list-selector
        v-model="selected"
        :newCol="newCol"
        :listCode="controlOpts.queryCode"
        :schemaCode="controlOpts.schemaCode"
        :cols="2"
        :columns="columns"
        :relevanceFormCode="control"
        :showActions="false"
        :query="query"
        :reverseViewFlag="!!control.options.showField"
        :defuaultShowSearch="false"
        :isAuthorize="isAuthorize"
        :control="control"
        @change="onListChange"
      />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { listApi } from 'cloudpivot/api';
import { DataItemType } from 'cloudpivot-form/form/schema';
import { RelevanceFormSearchResult } from 'cloudpivot-form/form/src/common/controls';
import { RelevanceFormControl } from 'cloudpivot-form/form/src/common/controls/relevance-form-control';
import {
  Icon,
  Input,
  // TreeSelect,
  Modal,
  Radio,
  Spin,
  Tooltip,
  Tree,
} from '@h3/antd-vue';
import cloneDeep from 'lodash/cloneDeep';
import { Component, Prop, Watch } from 'vue-property-decorator';

import common from 'cloudpivot/common/pc';

import InputSearch from 'cloudpivot/common/src/components/shared/inputSearch.vue';

@Component({
  name: 'relevance-form-modal',
  components: {
    ATooltip: Tooltip,
    AModal: Modal,
    AInput: Input,
    AIcon: Icon,
    ASpin: Spin,
    ARadio: Radio,
    ATree: Tree,
    InputSearch,
    PageLoading: common.components.PageLoading,
  },
})
export default class RelevanceFormModal extends RelevanceFormControl {
  @Prop({
    default: {},
  })
  control!: any;

  get isMobileRelevanceEntrance() {
    return false;
  }

  visible = false;

  @Watch('visible')
  onVisibleChange(full) {
    try {
      if (full) {
        (
          window.parent.window.document.querySelector(
            '.icon-close',
          ) as HTMLElement
        ).style.display = 'none';
      } else {
        (
          window.parent.window.document.querySelector(
            '.icon-close',
          ) as HTMLElement
        ).style.display = 'block';
      }
    } catch (error) {}
  }

  selected = new Array();

  query = {};

  hover = false;

  full = false;

  newCol: any = [];

  isClose: boolean = false;

  /*
   ***************************树形弹出框数据与逻辑*****************
   */
  list: RelevanceFormSearchResult[] = [];

  searchTimeoutRef: any = null;

  page = 1;

  expandedKeys: any = [];

  TreeKey: number = 0;

  searchTitle: string = '';

  spinning: boolean = false;

  get treeList() {
    if (this.list.length) {
      const arr: any = [];
      for (const val of this.list) {
        if (
          val[this.getDisplayField] !== null &&
          val[this.getDisplayField] !== ''
        ) {
          let titles = val[this.getDisplayField];
          try {
            //处理地址数据在前台显示异常
            const parseTitle = JSON.parse(val[this.getDisplayField])
              ? JSON.parse(val[this.getDisplayField])
              : '';
            if (parseTitle && parseTitle.valString) {
              titles = parseTitle.valString;
            }
            //人员、部门控件作为树形显示字段时数据格式跟普通数据项不一样
            if (Array.isArray(titles) && titles.length > 0) {
              titles = titles
                .map((titleItem: any) => {
                  return titleItem['name'];
                })
                .join(',');
            }
          } catch {}
          arr.push({
            value: val.id,
            key: val.id,
            title: titles,
            children: this.childrenToTreeList(val.t__children_),
            scopedSlots: { title: 'tree' },
          });
        }
      }
      return arr;
    } else {
      return [];
    }
  }

  displayFieldItem: any = undefined;

  async getDisplayFieldItem() {
    const schemaCode = this.controlOpts.schemaCode;
    const displayField = this.controlOpts.displayField;
    const that = this;
    await listApi.getDataItemList({ schemaCode }).then((res) => {
      if (res.errcode === 0) {
        that.displayFieldItem = res.data.find((item) => {
          return item.code === displayField;
        });
      }
    });
  }

  //树形视图搜索后默认展开被搜索结点,搜索匹配的把父节点展开
  getExpandedKeys(searchValue, treeData, parentkey) {
    if (!treeData || searchValue === '') {
      return;
    }
    let theRes = '';
    treeData.map((item) => {
      if (item.title.indexOf(searchValue) > -1) {
        // this.expandedKeys.push(parentkey);
        theRes = parentkey;
      } else if (item.children && item.children.length > 0) {
        const res = this.getExpandedKeys(searchValue, item.children, item.key);
        if (res) {
          this.expandedKeys.push(item.key);
          theRes = item.key;
        }
      } else {
      }
    });
    return theRes;
  }

  //把传过来的关联数据项的子列表做一个清洗，变成符合treeList的数据类型
  childrenToTreeList(children) {
    if (!children) {
      return;
    }
    const arr: any = [];
    for (let i = 0; i < children.length; i++) {
      if (children[i].data[this.getDisplayField]) {
        arr.push({
          value: children[i].data.id,
          key: children[i].data.id,
          title: children[i].data[this.getDisplayField],
          children: this.childrenToTreeList(children[i].data.t__children_),
          scopedSlots: { title: 'tree' },
        });
      }
    }
    return arr;
  }

  selectedKey: string = '';

  onselect(selectedKeys, e) {
    console.log(selectedKeys[0]);
    this.selectedKey = selectedKeys[0];
    const arr = this.treeToList(this.list);
    const item = arr.find((x) => x.id === selectedKeys[0]);
    this.selected[0] = item;
  }

  onSearch() {
    const that = this;
    this.search(this.searchTitle, true).then(() => {
      that.expandedKeys = [];
      that.getExpandedKeys(that.searchTitle, that.treeList, undefined);
    });
  }

  async search(value: string, searching: boolean = false, page?: number) {
    if (!page) {
      this.page = 0;
    }
    // this.list = [];
    this.spinning = true;
    const view = {
      type: this.control.options.showStyle === 'tree' ? 'TREE' : 'LIST',
      depth:
        this.control.options.showStyle === 'tree'
          ? value || searching
            ? 0
            : 1
          : undefined,
      parentRef: this.control.options.showStyle === 'tree' ? '#' : undefined,
    };
    const queryData: any[][] = [[], []];
    if (
      this.controlOpts.showStyle === 'tree' &&
      (value || searching) &&
      [0, 12, 13, 14, 15].includes(this.displayFieldItem.propertyType)
    ) {
      view.depth = 1;
      queryData[1].push({
        propertyCode: this.displayFieldItem.code,
        propertyType: this.displayFieldItem.propertyType,
        propertyValue: value,
        queryFilterType: 'Like',
      });
    }
    await this.fetch(
      page === undefined ? 0 : page,
      1000,
      value,
      queryData,
      false,
      view,
    ).then(
      (seg) => {
        if (page) {
          this.list = [...this.list, ...seg.data];
        } else {
          this.list = seg.data;
        }
        console.log(this.list);
        this.spinning = false;
      },
      () => {},
    );
  }

  //树形列表打平查找id
  treeToList(list) {
    if (!list) {
      return [];
    }
    let arr: any = list;
    for (let i = 0; i < list.length; i++) {
      if (list[i].t__children_) {
        arr = [...arr, ...this.treechildToList(list[i].t__children_)];
      }
    }
    return arr;
  }

  //树形子列表打平
  treechildToList(children) {
    if (!children) {
      return [];
    }
    let arrList: any = [];
    for (let i = 0; i < children.length; i++) {
      arrList.push(children[i].data);
      arrList = [
        ...arrList,
        ...this.treechildToList(children[i].data.t__children_),
      ];
    }
    return arrList;
  }

  /*
   ***************************树形弹出框数据与逻辑*****************
   */

  get text() {
    if (!this.ctrl.value) {
      return '';
    }

    //子表Excel导入数据后不需要执行映射，直接取后端返回的值
    // if (!this.ctrl.value[this.getDisplayField]) {
    //   this.setLinkageValue();
    // }

    let val: any = this.ctrl.value[this.getDisplayField];
    if (val === undefined) {
      val = this.ctrl.value['name'];
    }

    return this.parseDisplayFieldValue(val, this.getDisplayField);
  }

  async onClick() {
    if (this.control.options.showStyle === 'tree' && !this.list.length) {
      this.search('');
    }
    this.query = this.getParams();
    if (
      this.control.options.showField &&
      Array.isArray(this.control.options.showField) &&
      this.control.options.showField.length > 0
    ) {
      let relevanceFormCode = this.control.parentKey
        ? `${this.control.parentKey}.${this.control.key}`
        : this.control.key;
      if (this.control.path) {
        relevanceFormCode = this.control.path.join('.');
      }

      const param = {
        sheetCode: this.control.options.sheetParams.sheetCode,
        schemaCode: this.control.options.sheetParams.schemaCode,
        relevanceFormCode: relevanceFormCode,
      };
      const res: any = await listApi.selectFormTitle(param);
      if (res.errcode === 0) {
        res.data.configBizPropertyList.map((options) => {
          options.code = options.code === 'id' ? 'ids' : options.code;
          options.propertyCode = options.code;
          options.width = '120';
          options.childColumns =
            options.subSchema && options.subSchema.properties;
          if (
            options.propertyType === DataItemType.Sheet &&
            options.childColumns
          ) {
            options.childColumns = options.childColumns.map((v) => {
              v.propertyCode = v.code;
              v.vcTitle = v.name;
              v.width = '150';
              return v;
            });
          }
          return options;
        });

        const selectItems: any = [];
        this.control.options.showField.forEach((item) => {
          if (!~item.indexOf('.')) {
            item = item === 'id' ? 'ids' : item;
            const selectItem = res.data.configBizPropertyList.find(
              (i) => i.code === item,
            );
            selectItems.push(selectItem);
          } else {
            const codes = item.split('.');
            const parentItem: any = selectItems.find(
              (i: any) => i.code === codes[0],
            );
            if (parentItem) {
              const selectItemIndex = parentItem.childColumns.findIndex(
                (i) => i.code === codes[1],
              );
              const selectItem = parentItem.childColumns.splice(
                selectItemIndex,
                1,
              );
              parentItem.childColumns.push(selectItem[0]);
            }
          }
        });

        this.newCol = res.data.configBizPropertyList;
        this.visible = true;
        this.formTitleObj = await RelevanceFormControl.service.getBizmodelTitle(
          this.controlOpts.schemaCode || '',
        );
      }
    } else {
      this.visible = true;
    }
    if (this.ctrl.value) {
      this.selectedKey = this.ctrl.value.id;
    } else {
      this.selectedKey = '';
    }
  }

  get dialogClass() {
    // { 'full-modal': full, 'relevance-form': true }
    if (this.full) {
      return 'full-modal relevance-form';
    } else {
      return 'relevance-form';
    }
  }

  onMouseenter() {
    this.hover = true;
  }

  onMouseleave() {
    this.hover = false;
  }

  clear() {
    this.ctrl.value = null;
    this.selected = [];
  }

  onListChange(rows: any) {
    this.selected = rows;
  }

  fullScreen(full: boolean) {
    this.full = full;

    try {
      if (full) {
        (
          window.parent.window.document.querySelector(
            '.icon-close',
          ) as HTMLElement
        ).style.display = 'none';
      } else {
        (
          window.parent.window.document.querySelector(
            '.icon-close',
          ) as HTMLElement
        ).style.display = 'block';
      }
    } catch (error) {}
  }

  /**
   * 关联单选选择记录事件
   */
  async onModalOk() {
    console.log('this.selected', this.selected[0]);
    this.searchTitle = '';
    const item = await this.convertForMappings(this.selected[0]);
    this.visible = false;
    if (item) {
      this.interceptorValue(item);
      setTimeout(() => {
        this.setValue(cloneDeep(item));
      }, 300);
    }
  }

  onModalCancel() {
    this.visible = false;
    this.full = false;
    this.searchTitle = '';
    this.fullScreen(false);
    if (this.ctrl.value) {
      this.selected = [this.ctrl.value];
      this.selectedKey = this.ctrl.value.id;
    } else {
      this.selected = [];
      this.selectedKey = '';
    }
  }

  get isAuthorize() {
    return this.control.options.isAuthorize;
  }

  beforeCreate() {
    const comp = RelevanceFormControl.loadListSelector();
    (this.$options as any).components.ListSelector = comp;
  }

  mounted() {
    this.getDisplayFieldItem();

    this.setSelectedDate();
  }

  setSelectedDate() {
    if (this.ctrl.value && this.ctrl.value.id) {
      this.selected = [{
        id: this.ctrl.value.id,
        name:this.ctrl.value.name
      }]
    }
  }

  async onExpand(keys, expandInfo) {
    if (expandInfo.expanded) {
      this.expandedKeys = keys;
    } else {
      const flatedTreeNode: any[] = this.flatTreeNode(expandInfo.node.dataRef);
      this.expandedKeys = keys.filter((key) => {
        return !flatedTreeNode.includes(key);
      });
    }

    const len = keys.length;
    if (len === 0 || !expandInfo.expanded) {
      return;
    }

    const key = keys[len - 1];

    const node = this.filterTableMater(key, this.list);

    if (
      !node ||
      (node.t__children_?.length &&
        node.t__children_[0].data.t__children_?.length)
    ) {
      return;
    }

    await this.getNodeChildren(node);
  }

  filterTableMater(code: any, arr: any) {
    arr = arr.map((ower) => {
      if (ower.t__children_) {
        return ower;
      } else {
        return ower.data;
      }
    });

    for (const item of arr) {
      if (item.id === code) {
        return item;
      }
      if (item.t__children_ && item.t__children_.length) {
        const _item = this.filterTableMater(code, item.t__children_);
        if (_item) {
          return _item;
        }
      }
    }
  }

  async getNodeChildren(node) {
    if (this.spinning) {
      return;
    }
    this.spinning = true;
    const view: any = {
      type: 'TREE',
      depth: 1,
      parentRef: node.id,
    };
    const queryData: any[][] = [[], []];
    if (
      this.controlOpts.showStyle === 'tree' &&
      this.searchTitle &&
      [0, 12, 13, 14, 15].includes(this.displayFieldItem.propertyType)
    ) {
      view.depth = 1;
      queryData[1].push({
        propertyCode: this.displayFieldItem.code,
        propertyType: this.displayFieldItem.propertyType,
        propertyValue: this.searchTitle,
        queryFilterType: 'Like',
      });
    }

    await this.fetch(0, 1000, this.searchTitle, queryData, false, view).then(
      (seg) => {
        this.spinning = false;
        node.t__children_ = seg.data.map((val) => {
          return {
            createdTime: val.createdTime,
            id: val.id,
            data: val,
            name: val.name,
            modifiedTime: val.modifiedTime,
            sequenceStatus: val.sequenceStatus,
            workflowInstanceId: val.workflowInstanceId,
          };
        });
      },
      () => (this.spinning = false),
    );
  }

  flatTreeNode(nodeData) {
    const listData: any[] = [];
    if (nodeData.children) {
      nodeData.children.forEach((child) => {
        listData.unshift(...this.flatTreeNode(child));
      });
    }
    listData.unshift(nodeData.value);
    return listData;
  }
}
</script>

<style lang="less" scoped>
/deep/ .ant-modal-wrap {
  display: flex;
  align-items: center;
  .ant-modal.relevance-form {
    top: unset;
    padding-bottom: unset;
  }
}
.ant-input-suffix > i {
  color: #ccc;
}

.relevance-form-modal .anticon-close-circle {
  cursor: pointer;
  transition: color 0.3s;
  font-size: 12px;

  &:hover {
    color: #999;
  }

  &:active {
    color: #666;
  }
}

.fullscreen {
  position: absolute;
  top: 16px;
  right: 58px;
  cursor: pointer;
}

.full-modal .fullscreen {
  right: 58px;
}

.full-modal .list-selector {
  height: 100%;
}
.tree-search-box {
  height: 32px;
  .treeSearch {
    margin-bottom: 8px;
    width: 220px;
    height: 100%;
    float: right;
  }
}
</style>

<style lang="less">
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.relevance-form:not(.full-modal) .ant-modal-body .list-selector {
  height: 66vh;
  // overflow: auto;
}
.full-modal {
  /deep/ .ant-modal {
    height: 100%;
    top: 0;
    padding-bottom: 0;
  }
}

.tree-modal {
  .ant-modal-content {
    width: 640px !important;
  }

  .JumpTree {
    overflow: hidden;
    overflow-y: auto;
    width: 100%;
    border: 1px solid #d4d5d6;
    padding-top: 20px;
    .ant-tree {
      height: 372px;
    }
    .highlightColor {
      color: @highlightColor;
    }
  }
  .noTreeData {
    margin-top: 8px;
    border: 1px solid #d4d5d6;
    .noTreeDataPtr {
      position: relative;
      width: 100%;
      height: 321.5px;
      background-image: url('./no-data1.png');
      background-repeat: no-repeat;
      background-size: 40%;
      left: 30%;
      margin-top: 5%;
    }
    .noSearchTreeDataPtr {
      position: relative;
      width: 100%;
      height: 321.5px;
      background-image: url('./search-no-data2.png');
      background-repeat: no-repeat;
      background-size: 40%;
      left: 30%;
      margin-top: 5%;
    }
    .noTreeDataTips {
      position: relative;
      top: -99px;
      text-align: center;
      color: rgba(119, 119, 119, 0.5);
    }
  }

  .ant-tree-treenode-switcher-close,
  .ant-tree-treenode-switcher-open,
  .ant-tree-node-content-wrapper-open {
    .ant-tree-node-content-wrapper {
      width: 100%;
      .ant-radio-wrapper {
        width: 100%;
      }
    }
    .ant-radio {
      position: relative;
      bottom: 5px;
    }
    .title {
      display: inline-block;
      max-width: 500px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
