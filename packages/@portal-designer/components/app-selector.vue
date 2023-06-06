<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="app-selector">
    <a-tree-select
      v-model="selectTreeData"
      dropdownClassName="sub-tpl-ts"
      style="width: 100%"
      allowClear
      showSearch
      :treeData="appData"
      :placeholder="'请选择'"
      :dropdownStyle="{
        maxHeight: '350px !important',
        overflow: 'auto',
        maxWidth: '268px',
      }"
      treeNodeFilterProp="title"
      :filterTreeNode="filterTreeNode"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import AppCenterApi from 'cloudpivot-admin-core/src/apis/apps';

import { TreeSelect, Input, Icon } from '@h3/antd-vue';

@Component({
  name: 'app-selector',
  components: {
    ATreeSelect: TreeSelect,
  },
})
export default class AppSelector extends Vue {
  @Prop()
  value!: string;

  selectTreeData: string | null = null;

  appData: any[] = [];

  @Watch('selectTreeData')
  onSelectTreeDataChange(value) {
    this.$emit('input', value);
  }

  setAppData(data: any[]) {
    const res: any[] = [];
    data.forEach((group) => {
      if (group.code !== 'all' && group.children && group.children.length) {
        res.push({
          name: group.name,
          name_i18n: group.name_i18n,
          title: group.name,
          value: 'group_' + group.code,
          key: 'group_' + group.code,
          selectable: false,
          children: group.children
            ? group.children.map((el) => {
                return {
                  name: el.name,
                  name_i18n: el.name_i18n,
                  value: el.code,
                  title: el.name,
                  key: el.code,
                  isLeaf: true,
                };
              })
            : null,
        });
      }
    });
    this.appData = res;
  }

  created() {
    if (this.value) {
      this.selectTreeData = this.value;
    }
    AppCenterApi.getAppgroupV1({}).then((res) => {
      console.log(res);
      if (res.errcode === 0) {
        this.setAppData(res.data);
        // this.appData = (res.data as any[]).filter(group => {
        //   group.code !== 'all'
        // })
      }
    });
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
/deep/.sub-tpl-ts {
  max-height: 350px;
}
</style>
