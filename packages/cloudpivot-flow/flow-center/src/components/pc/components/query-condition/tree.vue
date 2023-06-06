<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="workflow-tree">
    <a-tree-select
      v-if="isShow"
      ref="tree"
      v-model="treeValue"
      :autoClearSearchValue="false"
      dropdownClassName="sub-tpl-ts"
      allowClear
      showSearch
      :multiple="multiple"
      :labelInValue="labelInValue"
      :treeData="workflowTplsTree"
      :loadData="loadTreeData"
      :placeholder="$t('cloudpivot.flowCenter.pc.plzSelect')"
      :filterTreeNode="false"
      @select="onSelect"
      @change="clearValue"
      @search="onSearch"
    >
      <!-- 图标 -->
      <span
        slot="title"
        slot-scope="{ label, label_i18n, icon }"
        class="cus-title"
      >
        <i :class="'icon aufontAll ' + icon"></i>
        <template v-if="!currentSearchValue">{{
          isChinese ? label : label_i18n[lang]
        }}</template>
        <template v-else>
          <span
            class="searchItem"
            v-html="setHighlightText(isChinese ? label : label_i18n[lang])"
          ></span>
        </template>
      </span>
    </a-tree-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { TreeSelect } from '@h3/antd-vue';

import { listApi, workflowCenterApi } from 'cloudpivot/api';

import common from 'cloudpivot/common';

const Application = listApi;

@Component({
  name: 'workflow-tree',
  components: {
    ATreeSelect: TreeSelect,
  },
})
export default class WorkflowTree extends Vue {
  @Prop() value!: any;

  @Prop({ default: false }) multiple?: boolean;

  @Prop({ default: false }) labelInValue?: boolean;

  @Prop({ default: '' }) userId?: string;

  @Prop() trustType?: string;

  workflowTplsTree: any = [];

  parentKey: string = '';

  isShow: boolean = true; // 用于重新挂载

  lang: string = 'zh';

  isChinese: boolean = true;

  treeValue: any = null;

  currentSearchValue: any = '';

  searchTask: any;

  mounted() {
    this.lang = this.$i18n.locale;
    this.isChinese = !(this.$i18n.locale && this.$i18n.locale === 'en');
    this.treeValue = this.value ? this.value : null;
    this.getAppList();
  }

  /**
   * 获取所有应用
   */
  async getAppList() {
    const param: any = {
      isMobile: false,
      filterNoWorkflow: true,
    };
    let res: any = {};
    // 从流程委托过来的增加参数
    if (this.userId) {
      param.userId = this.userId;
      param.trustType = this.trustType;
      //切换路由导致请求被中止导致页面无法出来
      try {
        res = await Application.listForTrust(param);
      } catch (error) {
        console.log(error);
        res = await Application.listForTrust(param);
      }
    } else {
      param.isPortal = true;
      res = await Application.list(param);
    }

    if (res.errcode === 0) {
      // 一级树
      const levelOneTree = this.SWTreeGenerator(res.data, 1, 'App');
      this.workflowTplsTree = levelOneTree;
    }
  }

  /**
   * 异步加载数据
   */
  async loadTreeData(node: any) {
    const _type = node.$vnode.data.props.type;
    const _val = node.$vnode.data.props.value;
    this.parentKey = node.$vnode.data.key;
    switch (_type) {
      case 'App': // 是应用，获取目录
        this.handleGetAppMenu(_val);
        break;
      case 'Folder':
        this.handleGetWorkflowList(_val);
        break;
      case 'BizModel':
        this.handleGetWorkflowList(_val);
        break;
      default:
        break;
    }
  }

  /**
   * 获取目录
   */
  async handleGetAppMenu(code: string) {
    // 从流程委托过来的增加参数
    const param: any = {
      appCode: code,
      isPortal: true,
      filterNoWorkflow: true,
    };
    if (this.userId) {
      param.trustType = this.trustType;
    }
    const appMenuRes = await Application.getAppItem(param);
    if (appMenuRes.errcode === 0) {
      const _resData = appMenuRes.data;
      if (!_resData || _resData.length === 0) {
        return;
      }

      // 生成树
      const levelTwoTree = this.SWTreeGenerator(
        _resData,
        2,
        'Folder',
        this.parentKey,
      );

      const _p = { key: this.parentKey, tree: levelTwoTree };
      this.setTreeDataAsync(_p);
    }
  }

  clearValue(value: any) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      this.$emit('input', '');
    } else {
      this.$emit('select', value);
    }
  }

  /**
   * 获取流程列表
   */
  async handleGetWorkflowList(code: string) {
    const params: any = {
      schemaCode: code,
      filterNoWorkflow: true,
    };
    // 从流程委托过来的增加参数
    let _worfklowRes: any = {};
    if (this.userId) {
      params.userId = this.userId;
      params.trustType = this.trustType;
      _worfklowRes = await Application.getWorkflowListTrust(params);
    } else {
      params.isPortal = true;
      _worfklowRes = await Application.getWorkflowList(params);
    }
    // 获取流程列表 最底层树
    const level = this.parentKey.split('-').length + 1;
    if (_worfklowRes.errcode === 0) {
      const workflowData = _worfklowRes.data;
      if (!workflowData && workflowData.length === 0) {
        return;
      }

      // 流程树
      const workflowList: Array<any> = workflowData;
      // .filter(
      //   (item: any) => item.published,
      // );
      const workflowTree = this.SWTreeGenerator(
        workflowList,
        level,
        'workflow',
        this.parentKey,
      );
      const _p = { key: this.parentKey, tree: workflowTree };
      this.setTreeDataAsync(_p);
    }
  }

  /**
   * @description 将异步加载的数据填入树中
   * @param key 类型为 1、1-1、1-1-1、1-1-1-1，根据key来决定赋值操作
   */
  setTreeDataAsync(params: any) {
    const { key, tree } = params;
    if (!key) {
      return;
    }
    const indexs: Array<any> = key.split('-'); // ['1','2','3']
    const temTree = this.workflowTplsTree.slice();
    indexs.forEach((index: any, i: number, arr: Array<any>) => {
      indexs[i] = parseInt(index, 10) - 1;
    });
    const arrLen = indexs.length;
    let tmpObj: any = temTree[indexs[0]];
    for (let i = 1; i < arrLen; i++) {
      if (tmpObj && tmpObj.hasOwnProperty('children')) {
        tmpObj = tmpObj.children[indexs[i]];
      }
    }
    tmpObj.children = tree;
    // switch (indexs.length) {
    //   case 1:
    //     temTree[indexs[0]].children = tree;
    //     break;
    //   case 2:
    //     temTree[indexs[0]].children[indexs[1]].children = tree;
    //     break;
    //   case 3:
    //     temTree[indexs[0]].children[indexs[1]].children[indexs[2]].children = tree;
    //     break;
    //   default: break;
    // }
    this.workflowTplsTree = temTree;
  }

  /**
   * 选中树中的节点
   */
  onSelect(v: any, node: any) {
    const _workflowCode = v;
    const name = node.$vnode.data.props.name || node.$vnode.data.props.label;
    const name_i18n = node.$vnode.data.props.label_i18n || {
      en: name,
    };
    if (!_workflowCode) {
      return;
    }

    if (this.multiple) {
      const _workflowValue = [...this.treeValue, { ...v, name }];
      this.$emit('input', _workflowValue);
    } else {
      this.$emit('input', _workflowCode);
    }
    this.$emit('select', { name, name_i18n });
  }

  /**
   * @description 生成自模板树形结构
   * @param data 源数据
   * @param level 当前是几级树
   * @param type 当前树的类型 只有type为'workflow'才可以被选
   * @param parentKey 父级树的key，用于生成当前树的key，第一级时不传
   */
  SWTreeGenerator(data: any, level: number, type: string, parentKey?: string) {
    if (!data || data.length === 0) {
      return;
    }
    const tree: Array<any> = [];
    data
      .filter((item) => this.reduceTreeCondition(item))
      .forEach((item: any, index: number) => {
        const _key = parentKey
          ? `${parentKey}-${(index + 1).toString()}`
          : `${(index + 1).toString()}`;
        const _type = type === '' ? item.type : type;
        const _code =
          type === 'workflow' ? `workflow-${item.workflowCode}` : item.code;
        const _label = type === 'workflow' ? item.workflowName : item.name;
        const _isDisabled = type !== 'workflow';
        const _isLeaf = !(_type === 'Folder' || _type === 'App');
        const _schemaCode = item.schemaCode ? item.schemaCode : '';
        const zhKey: string = type === 'workflow' ? 'workflowName' : 'name';
        item = common.utils.compatible(item, zhKey);
        const _icon = this.getIcon(item);
        tree.push({
          type: _type,
          key: _key,
          level,
          label: _label,
          label_i18n: item.name_i18n,
          value: _code,
          icon: _icon,
          schemaCode: _schemaCode,
          disabled: _isDisabled,
          isLeaf: _isLeaf,
          name: _label,
          scopedSlots: {
            title: 'title',
          },
          children:
            level === 1
              ? []
              : this.SWTreeGenerator(item.children, level++, item.type, _key),
        });
      });
    return tree;
  }

  @Watch('value')
  onValueChange(v: any) {
    if (v === '') {
      this.isShow = false;
      setTimeout(() => {
        this.isShow = true;
      }, 30);
    }
    this.treeValue = v;
  }

  @Watch('$i18n.locale')
  onLanguageChange(v: string) {
    this.lang = v;
    this.isChinese = v === 'zh';
    // 中英切换跟数据没有影响，重新请求会只剩下基础树，已选流程会只显示code，不显示名称
    // this.workflowTplsTree = [];
    // this.getAppList();
  }

  /**
   * 剪枝逻辑
   */
  reduceTreeCondition(item) {
    const visibleType = [null].includes(item.type);
    const hasChildren = item.children && item.children.length;
    const isWorkflow = item.bindWorkflow || item.workflowCode;
    return visibleType || hasChildren || isWorkflow;
  }

  getIcon(item) {
    return item.icon ? item.icon : 'h-icon-all-folder-o';
  }

  onSearch(text) {
    clearTimeout(this.searchTask);
    this.searchTask = setTimeout(() => {
      this.searchWorkflow(text);
    }, 500);
  }

  async searchWorkflow(searchValue) {
    this.currentSearchValue = searchValue;
    // 搜索流程模板
    if (Vue.prototype.$httpRequestList.length > 0) {
      //强行中断时才向下执行
      Vue.prototype.$httpRequestList.forEach((item: any) => {
        item('interrupt'); //给个标志，中断请求
      });
    }
    if (this.currentSearchValue === '') {
      //未输入搜索条件
      this.getAppList();
      return;
    }
    try {
      await workflowCenterApi
        .searchMyWorkflowList({
          workflowName: this.currentSearchValue,
          language: (this as any).$i18n.locale,
          isMobile: false,
        })
        .then((res: any) => {
          if (res.errcode !== 0) {
            return;
          }
          if (res.data && Array.isArray(res.data.appList)) {
            const searchResult = this.SWTreeGenerator(
              res.data.appList.map((item: any) => {
                return Object.assign(item, {
                  workflowCode: item.dataList[0]?.code,
                  workflowName: item.appName,
                  icon: item.dataList[0]?.icon,
                  schemaCode: item.dataList[0]?.schemaCode,
                  name_i18n: item.dataList[0]?.name_i18n,
                });
              }),
              1,
              'workflow',
            );
            this.workflowTplsTree.splice(
              0,
              this.workflowTplsTree.length,
              ...searchResult,
            );
          }
        });
    } catch (e) {
      console.log(e);
    }
  }

  // 设置高亮文字
  setHighlightText(value) {
    if (!this.currentSearchValue) {
      // 没有搜索返回原值
      return value;
    }
    const first = this.preHighlightText(value, this.currentSearchValue);
    const last = this.nextHighlightText(value, this.currentSearchValue);
    if (this.currentSearchValue === value) {
      return `<span class="font-ele">${this.currentSearchValue}</span>`;
    }
    if (!first && !last) {
      return value;
    }
    return `${first}<span class="font-ele">${this.currentSearchValue}</span>${last}`;
  }

  // 返回搜索字段之前的文字
  preHighlightText(value: string, currentSeachValue: string) {
    const index = value.indexOf(currentSeachValue);
    if (index < 0) {
      return '';
    }
    return value.substring(0, index);
  }

  // 返回搜索字段之后的文字
  nextHighlightText(value: string, currentSeachValue: string) {
    const index = value.indexOf(currentSeachValue);
    if (index < 0) {
      return '';
    }
    return value.substring(index + currentSeachValue.length);
  }
}
</script>

<style lang="less">
@import '~cloudpivot/common/common.less';
.sub-tpl-ts {
  max-height: 45vh !important;
  /deep/ .ant-select-tree-treenode-disabled {
    span.ant-select-tree-title {
      color: rgba(0, 0, 0, 0.65) !important;
    }
  }
  .cus-title {
    color: #595959 !important;
    // color: pink!important;
    i {
      margin-right: 3px;
    }
  }

  // 多出一个小方块，去除 by John 20191015
  /deep/.ant-select-tree-iconEle.ant-select-tree-icon__customize {
    display: none !important;
  }

  .searchItem {
    .font-ele {
      color: @primary-color;
    }
  }
}
</style>
