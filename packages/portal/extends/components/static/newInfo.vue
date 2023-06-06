<template>
<a-modal
   :visible="value"
   :closable="false"
   :maskClosable="false"
   width="90%"
   height="80%"
   wrapClassName="unsave-confirm"
   @cancel="close"
   @ok="close"
   > 
    <div class="info">
      <a-spin :spinning="spinning">
         <h3>{{ info.regulationName }}</h3>
         <!-- <div class="download">
            <a-button type="primary" class="reload-btn"> <i class="icon aufontAll h-icon-all-download-o"></i>全文下载</a-button>
         </div> -->
         <div class="tip">
            <a-row>
               <a-col :span="6" class="elCol">
                  发布部门：
                  <template v-if="info && info.deptList && info.deptList.length > 0">
                     <template v-for="(item) in info.deptList">
                        {{ item }}
                     </template>
                  </template>
               </a-col>
               <a-col :span="6" class="elCol">
                  发文字号：{{ info.releaseNumber }}
               </a-col>
               <a-col :span="6" class="elCol">
                  发布日期：{{ info.releaseDate && info.releaseDate.slice(0,10) || '' }}
               </a-col>
               <a-col :span="6" class="elCol">
                  实施日期：{{ info.implementationDate && info.implementationDate.slice(0,10) || '' }}
               </a-col>
            </a-row>
            <a-row>
               <a-col :span="6" class="elCol">
                  时效性：{{ info.timeliness }}
               </a-col>
               <a-col :span="6" class="elCol">
                  效力级别：
                  <template v-if="info && info.potencyList && info.potencyList.length > 0">
                     <template v-for="(item) in info.potencyList">
                        {{ item }}
                     </template>
                  </template>
               </a-col>
               <a-col :span="6" class="elCol">
                  原文地址：{{ info.link }}
               </a-col>
            </a-row>
         </div>
         <div class="content">
            <div v-html="info.fullText"></div>
         </div>
      </a-spin>
      
   </div>
   <template slot="footer">
      <div class="footer">
         <a-button type="primary" class="reload-btn" @click="close">确定</a-button>
      </div>
   </template>
</a-modal>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin } from "@h3/antd-vue";
import api  from '@/../extends/api';
const qs = require('qs');
@Component({
  name: 'newInfo',
  components: {
   AModal: Modal,
   AButton: Button,
   ASpin:Spin
  },
})

export default class newInfo extends Vue {

   info:any = {};

   spinning:boolean = false;

   @Prop() value?:boolean;

   @Prop({}) newInfo:any;

   @Watch('value')
   onChangeValue(newVal:any){
      if(newVal){
         this.getInfo(this.newInfo['id']);
      }
   }

   async getInfo(id:number){
      this.spinning = true;
      let option = qs.stringify({ id });
      
      const res:any = await api.queryInfo(option);
      this.spinning = false;
      if(res.errmsg === "success"){
         this.info = res.data;
      }else{
         this.info = {};
      }
   }
   
   close(){
      this.info.fullTextHtmlFormat = '';
      this.$emit('input',false);
   }
}
</script>
<style lang="less" scoped>

/deep/ .ant-modal-content {
   display: flex;
   flex-direction: column;
   height: 100%;
   .ant-modal-body {
      flex: 1;
      //overflow-y: scroll;
      overflow: hidden;
      .info {
         height: 100%;
         overflow: hidden;
         .ant-spin-nested-loading {
            height: 100%;
            overflow: hidden;
            .ant-spin-container {
               display: flex;
               flex-direction: column;
               height: 100%;
               h3 {
                  line-height: 30px;
                  padding: 25px 0;
                  text-align: center;
                  font-weight: normal;
                  font-size: 22px;
               }
               .download {
                  display: flex;
                  justify-content: flex-end;
               }
               .tip {
                  padding: 20px;
                  background: #f7f7f7;
                  margin-bottom: 20px;
                  font-size: 14px;
                  margin-top: 10px;
                  .elCol {
                     overflow: hidden;
                     text-overflow: ellipsis; 
                     white-space:nowrap; 
                     margin-bottom: 10px;
                  }
               }
               .content {
                  flex: 1;
                  overflow-y: auto;
               }
            }
         }
         
      }
   }
   .ant-modal-footer {
      padding-top: 12px;
      padding-bottom: 12px;
   }
}

</style>