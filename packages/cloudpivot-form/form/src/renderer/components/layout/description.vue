<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="description">
    <layoutTable v-if="controlOpts && controlOpts.showData" :controlOpts="controlOpts" />
    <rich-text
      v-else
      v-show="ctrl.display"
      :text="label"
      :align="align"
      :labelStyle="style"
      class="desc"
    />
  </div>
</template>

<script lang="ts">
import { Component,Inject,Watch } from 'vue-property-decorator';
import { BaseControl } from '../../controls';
import { LayoutControlOptions } from '../../typings';
import RichText from '../shared/rich-text.vue';
import { Row,Col,Button,Table,Tooltip,Input } from "@h3/antd-vue";
import Axios from "cloudpivot/api/src/axios";
import layoutTable from './tablue.vue';

@Component({
  name: 'description',
  components: {
    RichText,
    ATable: Table,
    ATooltip: Tooltip,
    ATextarea: Input.TextArea,
    layoutTable
  }
})
export default class Description extends BaseControl<LayoutControlOptions> {
  
  columns:any = [];

  dataContent:any = [];

  defaultExpandAllRows:boolean = false;

 



  getValue(){
    
  }

  get align() {
    return this.controlOpts.align;
  }

  @Watch('dataContent',{immediate: false, deep: true})
  onChangeDataContent(newVal:any){
    this.ctrl.value = { 'content': newVal.content };
  }

 
  
  


  change(item:any,index:number,text:string,e:any){
    
  }
  
  created(){
  
    
 
  }

  mounted() {
   
  }



 


 

  
}
</script>

<style lang="less" scoped>
/deep/.mutil-text {
  font-size: 12px;

  & > span {
    color: rgba(0, 0, 0, 0.45);
  }
}
/deep/ .ant-table-bordered {
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td {
    font-size: 12px;
  }
}

</style>
