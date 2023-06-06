<template>
<a-row class="aRow">
     <a-col :span="24" class="aCol aColContent">
          <p>卷内文件目录</p>
          <elTable :columns="columns"  :detail="false" :download="true" :dataContent="tableData" />
     </a-col>
</a-row>    
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import api  from '@/../extends/api';
import { Row,Col,Table,Button } from "@h3/antd-vue";
import elTable from "@/../extends/components/table/table.vue";
const qs = require('qs');
@Component({
     name: 'volume',
     components: {
          ARow: Row,
          ACol: Col,
          ATable: Table,
          AButton: Button,
          elTable
     }
})
export default class volume extends Vue {

     columns:any = [
          {
               title: '序号',
               dataIndex: 'index',
               key: 'index',
               align: 'center',
               width: 50,
               customRender:(value, row, index) =>{
                    const obj = {
                         children: value,
                         attrs: {} as any,
                    };
                    let showText = '';
                    if(row && row['showTitle']){
                         obj['children'] = row['showTitle'];
                         obj.attrs.colSpan =  6;
                    }

                    
                    return obj;
               },
          },
          // {
          //      title: '审计作业流程',
          //      dataIndex: 'name',
          //      key: 'name',
          //      colSpan: 0,
          //      width: 200,
          //      customRender:(value, row, index) =>{
          //           const obj = {
          //                children: value,
          //                attrs: {} as any,
          //           };
          //           if(row && row['length']){
          //                obj.attrs.rowSpan =  row['length'];
          //           }else{
          //                obj.attrs.rowSpan = 0;
          //           }
               
                    
          //           return obj;
          //      },
          // },
          {
               title: '文号',
               dataIndex: 'documentNumber',
               key: 'documentNumber',
               customRender:(value, row, index) =>{
                    const obj = {
                         children: value,
                         attrs: {} as any,
                    };
                    let showText = '';
                    if(row && row['showTitle']){
                         obj.attrs.colSpan =  0;
                    }

                    
                    return obj;
               }
          },
          {
               title: '责任者',
               dataIndex: 'responsibleParty',
               key: 'responsibleParty',
               customRender:(value, row, index) =>{
                    const obj = {
                         children: value,
                         attrs: {} as any,
                    };
                    let showText = '';
                    if(row && row['showTitle']){
                         obj.attrs.colSpan =  0;
                    }

                    
                    return obj;
               }
          },
          {
               title: '题名',
               dataIndex: 'fileName',
               key: 'fileName',
               customRender:(value, row, index) =>{
                    const obj = {
                         children: value,
                         attrs: {} as any,
                    };
                    let showText = '';
                    if(row && row['showTitle']){
                         obj.attrs.colSpan =  0;
                    }

                    
                    return obj;
               },
               width: 400,
          },
          {
               title: '页号',
               dataIndex: 'pageNumber',
               key: 'pageNumber',
               customRender:(value, row, index) =>{
                    const obj = {
                         children: value,
                         attrs: {} as any,
                    };
                    let showText = '';
                    if(row && row['showTitle']){
                         obj.attrs.colSpan =  0;
                    }

                    
                    return obj;
               }
          },
          {
               title: '备注',
               dataIndex: 'remark',
               key: 'remark',
               customRender:(value, row, index) =>{
                    const obj = {
                         children: value,
                         attrs: {} as any,
                    };
                    let showText = '';
                    if(row && row['showTitle']){
                         obj.attrs.colSpan =  0;
                    }

                    
                    return obj;
               }
          },
          // {
          //      title: '操作',
          //      dataIndex: 'action',
          //      key: 'action',
          //      scopedSlots: { customRender: 'action' },
          //      // customRender:(value, row, index) =>{
          //      //      const obj = {
          //      //           children: (
          //      //                <a>{value}</a>
          //      //           ),
          //      //           attrs: {} as any,
          //      //      };
          //      //      let showText = '';
          //      //      if(row && row['showTitle']){
          //      //           obj.attrs.colSpan =  0;
          //      //      }else{
          //      //           obj.attrs.colSpan =  1;
          //      //      }

                    
          //      //      return obj;
          //      // },
          //      width: 70,
          // }
     ]

     tableData:any = {};

     created(){
          this.getList();
     }
     
     async getList(){
          const res:any = await api.fileDirectory();
          if(res.code === '00000'){
               console.log(res.data);
               this.setUpFile(res.data);
          }else{
               this.tableData = {};
          }
     }

     setUpFile(data){
          // /tableData
          let result:any = [];
          let result_att:any = [];
          let index:number = 0;
          for(let i in data){
               for(let j=0;j<data[i].length;j++){
                    data[i][j]['name'] = i;
                    data[i][j]['index'] = result_att.length + (j + 1);
               }
               if(data[i] && data[i].length > 0){
                    data[i][0].position = index;
                    data[i][0].length = data[i].length;
               }    
               result_att = result_att.concat(data[i]);
               result = result.concat([{ showTitle: i }],data[i]);
               index++;
          }
          this.tableData = {
               'content': result
          };
     }
     
}

</script>
<style lang="less" scoped>
.aRow {
     height: 100%;
     padding: 18px;
     overflow-y: auto;
     .aCol {
          background-color: #fff;
          padding: 32px;
          p {
               margin-bottom: 32px;
               font-size: 16px;
               font-weight: 500;
               text-align: center;
          }
     }
}
</style>