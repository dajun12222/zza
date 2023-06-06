<template>
<div>
    <elTable 
    :columns="columns" 
    :edit="true" 
    :del="true"
    :detail="false"
    :dataContent="dataContent" 
    @goDetail="goDetail" 
    @edit="edit" 
    @del="del"
    @customRowClick="customRowClick"
    />
</div>

</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row,Col,Button,Table } from "@h3/antd-vue";
import elTable from "@/../extends/components/table/table.vue";
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
            title: '数据分析名称',
            dataIndex: 'dataAnalysisName',
            key: 'dataAnalysisName',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '模型编码',
            dataIndex: 'modelCode',
            key: 'modelCode',
            scopedSlots: { customRender: 'aTooltip' },
            ellipsis: true,
        },
        {
            title: '规则名称',
            dataIndex: 'analysisName',
            key: 'analysisName',
            scopedSlots: { customRender: 'aTooltip' },
            ellipsis: true,
        },
        {
            title: '规则类型',
            dataIndex: 'dataAnalysisType',
            key: 'dataAnalysisType',
            scopedSlots: { customRender: 'aTooltip' },
            ellipsis: true,
        },
        {
            title: '分析周期',
            dataIndex: 'dataAnalysisCycle',
            key: 'dataAnalysisCycle',
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
            title: '计算方式',
            dataIndex: 'calculationMethod',
            key: 'calculationMethod',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
            customRender: (value, row, index) => {
                let obj = "";
                if(value === 'sum'){
                   obj = "求和";
                }else{
                    obj = "总数"
                }
                return obj;
            }
        },
        {
            title: '图表样式',
            dataIndex: 'chartStyle',
            key: 'chartStyle',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        // {
        //     title: '操作',
        //     dataIndex: 'action',
        //     key: 'action',
        //     scopedSlots: { customRender: 'action' },
        // }
    ]
    

    @Prop({}) dataContent?:any;

    goDetail(item:any){
        let { href } = this.$router.resolve({
          name: "dataBatchInfo",
          query: {
            id: item['id'],
            isOpenPage: 'true',
            appCode:  this.$route.query.code
          }
        });
        window.open(href,'_blank');
    }

    edit(item:any){
        this.$emit('edit',item);
    }

    del(item:any){
        this.$emit('del',item);
    }
    
    customRowClick(item:any){
        this.$emit('customRowClick',item);
    }
}
</script>
<style lang="less" scoped>

</style>