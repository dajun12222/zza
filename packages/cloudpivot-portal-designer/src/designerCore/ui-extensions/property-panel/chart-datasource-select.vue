<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <a-tree-select
      ref="treeSelect"
      v-model="selectChart"
      class="biz-models-selector"
      showSearch
      :treeData="treeData"
      :dropdownStyle="{
        maxHeight: '300px',
        height: '300px',
        maxWidth: width + 'px',
        overflow: 'auto',
      }"
      :placeholder="placeholder"
      dropdownClassName="fixed biz-model-select"
      treeNodeFilterProp="title"
      :searchValue="searchValue"
      :filterTreeNode="filterTreeNode"
      @change="onChange"
      @search="onSearch"
    >
      <!-- treeSelect -->
      <span
        slot="title"
        slot-scope="{ label, icon }"
        class="cus-title"
        style="font-size: 14px !important"
      >
        <em :class="'icon aufontAll ' + icon"></em>
        {{ label }}
      </span>
    </a-tree-select>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch, Prop } from 'vue-property-decorator';
import { TreeSelect } from '@h3/antd-vue';
import PropertyComponent from '@cloudpivot-shared/ui-property-editor/src/property-component';
import AppsApi from 'cloudpivot-admin-core/src/apis/apps';
import { filterTableMater } from 'cloudpivot/common/src/utils/utils';

@Component({
  components: {
    ATreeSelect: TreeSelect,
  },
})
export default class chartDataSourceSelect extends Mixins(PropertyComponent) {
  @Prop({
    default: '选择图表',
  })
  placeholder?: string;

  selectChart: any = '';

  treeData: any = [];

  width = 0;

  searchValue = '';

  @Watch('groupCtrl.value', { immediate: true })
  onValueChange(val: string) {
    if (!val) {
      this.selectChart = '';
      return;
    }
    this.selectChart = JSON.parse(val).value;
  }

  created() {}

  mounted() {
    this.width = (this.$refs.treeSelect as any).$el.offsetWidth;
    this.queryReportChartTree();
  }

  /**
   * 获取所有报表模型的图表数据
   */
  queryReportChartTree() {
    AppsApi.queryReportChartTree().then((res: any) => {
      if (res.errcode === 0) {
        this.treeData = this.refactoringTreeData(res.data);
      } else {
        this.treeData = [];
      }
    });
  }

  refactoringTreeData(data) {
    const dataMap = data.map((owner, index) => {
      owner.children = owner.children ? owner.children : [];
      if (owner.children.length > 0) {
        owner.children = this.refactoringTreeData(owner.children);
      }

      owner.appFunctionList = owner.appFunctionList
        ? owner.appFunctionList
        : [];
      if (owner.appFunctionList.length > 0) {
        owner.appFunctionList = owner.appFunctionList.map((item) => {
          item.reportCode = owner.code;
          return item;
        });
        owner.children = this.refactoringTreeData(owner.appFunctionList);
        delete owner['appFunctionList'];
      }

      owner.appReportChartList = owner.appReportChartList
        ? owner.appReportChartList
        : [];
      if (owner.appReportChartList.length > 0) {
        owner.appReportChartList = owner.appReportChartList.map((item) => {
          item.appCode = owner.appCode;
          item.reportCode = owner.code;
          return item;
        });
        owner.children = this.refactoringTreeData(owner.appReportChartList);
        delete owner['appReportChartList'];
      }
      //树形显示的名称
      owner.title = owner.title ? owner.title : owner.name;
      //树形控件显示的值
      owner.uuid = owner.uuid || '';
      owner.value = owner.uuid ? owner.uuid : `${owner.code}${index}`;

      owner.key = owner.value;

      //最里层的图表设置为可选择
      owner.selectable = owner.uuid ? true : false;

      owner.objectId = owner.objectId || '';
      return owner;
    });
    return dataMap;
  }

  onChange(val: string, vNode: any) {
    const node = filterTableMater(val, this.treeData);
    if (node) {
      this.emitChange(JSON.stringify(node));
    }
  }

  onSearch(text: string) {
    this.searchValue = text;
  }

  filterTreeNode(inputValue: string, treeNode) {
    return (
      treeNode.componentOptions.propsData.title &&
      ~treeNode.componentOptions.propsData.title.indexOf(inputValue) &&
      !treeNode.componentOptions.children.length
    );
  }
}
</script>

<style lang="less" scoped>
.biz-models-selector {
  width: 100%;
  max-width: 500px;
}
</style>
