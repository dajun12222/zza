<template>
<div>
    <elTable 
    :columns="columns" 
    :dataContent="dataContent" 
    @goDetail="goDetail" 
    @goAnalyse="goAnalyse" 
    @execute="execute"
    @threshold="threshold" 
    @refer="refer"
    @del="del"
    @executionResult="executionResult"
    />
</div>

</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row,Col,Button,Table } from "@h3/antd-vue";
import elTable from "@/../extends/components/table/tableListShow.vue";
import api  from '@/../extends/api';
const qs = require('qs');
import axios from 'axios';
@Component({
    name: 'newList',
    components: {
        ATable: Table,
        elTable
    },
})
export default class newList extends Vue {
    columns:any = [
        {
            title: '批次编号',
            dataIndex: 'batchCode',
            key: 'batchCode',
            align: 'center',
            scopedSlots: { customRender: 'copy' },
            ellipsis: true,
        },
        {
            title: '业务类型',
            dataIndex: 'businessType',
            key: 'businessType',
            width: 95,
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '模型编码',
            dataIndex: 'modelCode',
            key: 'modelCode',
            width: 80,
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '模型名称',
            dataIndex: 'modelName',
            key: 'modelName',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
            width: 110,
        },
        {
            title: '数据条数',
            dataIndex: 'counts',
            key: 'counts',
            width: 75,
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = value;
                }else{
                    obj = "-"
                }
                return obj;
            }
        },
        {
            title: '操作人员',
            dataIndex: 'operator',
            key: 'operator',
            width: 90,
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = value;
                }else{
                    obj = "-"
                }
                return obj;
            }
        },
        {
            title: '执行次数',
            dataIndex: 'times',
            key: 'times',
            width: 75,
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            width: 120,
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '操作',
            dataIndex: 'actionDataBatch',
            key: 'actionDataBatch',
            scopedSlots: { customRender: 'actionDataBatch' },
            width: 315,
        }
    ]
    

    @Prop({}) dataContent?:any;

    goDetail(item:any){
        let { href } = this.$router.resolve({
          name: "dataBatchInfo",
          query: {
            id: item['id'],
            modelCode: item['modelCode'],
            batchCode: item['batchCode'],
            isOpenPage: 'true',
            appCode:  this.$route.query.code
          }
        });
        window.open(href,'_blank');
    }

    threshold(item:any){
        console.log(item);
        let { href } = this.$router.resolve({
          name: "threshold",
          query: {
            id: item['id'],
            isOpenPage: 'true',
            appCode:  this.$route.query.code,
            batchCode: item['batchCode'],
            modelCode: item['modelCode'],
          }
        });
        window.open(href,'_blank');
    }  

    goAnalyse(item:any){
        console.log(item);
        let { href } = this.$router.resolve({
          name: "analyse",
          query: {
            id: item['id'],
            isOpenPage: 'true',
            appCode:  this.$route.query.code,
            batchCode: item['batchCode'],
            modelCode: item['modelCode'],
            businessType: item['businessType'],
          }
        });
        window.open(href,'_blank');
    }  

    executionResult(item:any){
        let { href } = this.$router.resolve({
          name: "execution",
          query: {
            id: item['id'],
            isOpenPage: 'true',
            batchCode: item['batchCode'],
            appCode:  this.$route.query.code,
            modelCode: item['modelCode'],
          }
        });
        window.open(href,'_blank');
    } 

     execute(item:any){
        this.$emit('execute',item);
     }

    del(item:any){
        this.$emit('del',item);
    }

    refer(){
        this.$emit('refer');
    }

}
</script>
<style lang="less" scoped>

</style>