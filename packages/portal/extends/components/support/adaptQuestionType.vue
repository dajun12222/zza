<template>
  <div>
    <base-tree v-if="type === '全部'" :treeData="AuditTypeList" @select="select" />
    <base-tree v-if="type === '中央法规'" :treeData="CentralTypeList" @select="select" />
    <base-tree v-if="type === '地方法规'" :treeData="LocalTypeList" @select="select" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal, Button, Spin, Tree } from '@h3/antd-vue';
import api from '@/../extends/api';

import baseTree from './baseTreeNew.vue';
@Component({
  name: 'regulationQuestionType',
  components: {
    ATree: Tree,
    baseTree,
  },
})
export default class regulationQuestionType extends Vue {

  @Prop() type!: string;

  // @Watch('type', { immediate: true })
  // onTypeChange(type: any) {
  //   this.getList();
  // }

  //审计类别

  AuditTypeValue: any = [];

  AuditTypeList: any = [];

  CentralTypeList: any = [];

  LocalTypeList: any = [];

  replaceFields: any = {
    children: 'children',
    title: 'name',
    key: 'dictionaryId',
    value: 'dictionaryId',
  };

  created() {
    //审计问题类型查询
    this.getList();
  }

  async getList() {
    const res: any = await api.queryTypeList();
    if (res.errmsg === 'success') {
      const _data = res.data;
      this.AuditTypeList = _data;
      //处理中央法规
      if (Array.isArray(_data[0]?.children)) {
        const central = _data[0].children[0].children;
        this.CentralTypeList = [{ id: _data[0].id, name: _data[0].name,treelevel: _data[0].treelevel, children: central }];
      } else {
        this.CentralTypeList = [];
      }
      // 处理地方法规类型数据
      if (Array.isArray(_data[0]?.children)) {
        const local = _data[0].children[1].children
        this.LocalTypeList = [{ id: _data[0].id, name: _data[0].name,treelevel: _data[0].treelevel, children: local }];
      } else {
        this.LocalTypeList = [];
      }  
    } else {
      this.AuditTypeList = [];
      this.CentralTypeList = [];
      this.LocalTypeList = [];
    }
  }

  select(option) {
    option['type'] = 'typeList';
    option['title'] = '适用审计类别';
    this.$emit('select', option);
  }
}
</script>
<style lang="less" scoped></style>
