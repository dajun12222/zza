<template>
<a-row class="aRow">
     <a-col :span="24" class="aCol">
          <h5>{{ info.policyRegulationName }}</h5>
          <table>
               <tbody>
                    <tr>
                         <th>
                              发布部门
                         </th>
                         <td>
                              <a>
                                   {{ info.deptList && info.deptList.name }}
                              </a>
                         </td>
                    </tr>
                    <tr>
                         <th>
                              发文字号
                         </th>
                         <td>
                              <a>
                                   {{ info.releaseNumber }}
                              </a>
                         </td>
                    </tr>
                    <tr>
                         <th>
                              效力级别
                         </th>
                         <td>
                              <a>
                                   {{ info.potencyList && info.potencyList.name }}
                              </a>
                         </td>
                    </tr>
                    <tr>
                         <th>
                              审计类别
                         </th>
                         <td>
                              <a>
                                   {{ info.typeList && info.typeList.name }}
                              </a>
                         </td>
                    </tr>
                    <tr>
                         <th>
                              发布日期
                         </th>
                         <td>
                              <a>
                                   {{ info.releaseDate }}
                              </a>
                         </td>
                    </tr>
                    <tr>
                         <th>
                              实施日期
                         </th>
                         <td>
                              <a>
                                   {{ info.implementationDate }}
                              </a>
                         </td>
                    </tr>
                    <tr>
                         <th>
                              时效性
                         </th>
                         <td>
                              <a>
                                   {{ info.timeliness }}
                              </a>
                         </td>
                    </tr>
                    <tr>
                         <th>
                              原文链接
                         </th>
                         <td>
                              <a>
                                   {{ info.link }}
                              </a>
                         </td>
                    </tr>
                    <tr>
                         <th>
                              法规附件
                         </th>
                         <td>
                              <a>
                                   {{ info.fileName }}
                              </a>
                         </td>
                    </tr>
               </tbody>
          </table>
         
          <div class="content">
            <div v-html="info && info.fullTextHtmlFormat"></div>
         </div>
     </a-col>
</a-row>    
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import api  from '@/../extends/api';
import { Row,Col } from "@h3/antd-vue";
const qs = require('qs');
@Component({
     name: 'regulationInfo',
     components: {
        ARow: Row,
        ACol: Col,
     }
})
export default class regulationInfo extends Vue {

  
     @Prop({}) id:any;

     @Watch('id',{ deep: true, immediate: true })
     onChangeID(newVal:any){
          if(newVal){
               this.getList();
          }
     }

     info:any = {};
     
     // created(){
     //      this.id = this.$route.query.id || '';
     //      if(!this.id){
     //           this.$message.error('未获取到id');
     //           return;
     //      }
     //      this.getList();
     // }

     async getList(){
          let option = qs.stringify({ id: this.id });
          const res:any = await api.queryInfo(option);
          if(res.code === '00000'){
               this.info = res.data;
          }else{
               this.info = {};
          }
     }
}

</script>
<style lang="less" scoped>
.aRow {
     height: 100%;
     .aCol {
          display: flex;
          flex-direction: column;
          background-color: #fff;
          height: 100%;
          
          padding: 8px;
          padding-top: 0;
          h5 {
               text-align: center;
               font-size: 16px;
               line-height: 1.4;
               margin: 20px 0;
          }
          table {
               width: 100%;
               border: 1px solid rgba(0,0,0,.06);
               font-size: 12px;
               tbody {
                    tr {
                         border-bottom: 1px solid rgba(0,0,0,.06);
                         th {
                              width: 60px;
                              height: 30px;
                              background-color: #fafafa;
                              border-right: 1px solid rgba(0,0,0,.06);
                              text-align: center;
                              color: rgb(144, 147, 153);
                         }
                         td {
                              height: 30px;
                              border-right: 1px solid rgba(0,0,0,.06);
                              padding: 0 7px;
                              a {
                                   box-sizing: border-box;
                                   color: rgba(0,0,0,.85);
                                   cursor: default;
                                   word-wrap: break-word;
                                   word-break: break-all;
                              }
                         }
                    }
               }
          }
          .content {
               flex: 1;
               //overflow-y: auto;
          }
     }
}
</style>