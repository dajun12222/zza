<template>
<div>
    <elTable 
    :columns="columns" 
    :dataContent="dataContent" 
    @goDetail="goDetail" 
    @threshold="threshold" 
    @executionResult="executionResult"
    @details="details"
    @dataDetails="dataDetails"
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
            title: '数据阈值名称',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
        },
        {
            title: '阈值规则名称',
            dataIndex: 'fileName',
            key: 'fileName',
        },
        {
            title: '字段名称',
            dataIndex: 'projectName',
            key: 'projectName',
        },
        {
            title: '判断条件',
            dataIndex: 'auditCategory',
            key: 'auditCategory',
        },
        {
            title: '告警值',
            dataIndex: 'auditUnit',
            key: 'auditUnit',
        },

        {
            title: '过滤条件详情',
            dataIndex: 'filterDetail',
            key: 'filterDetail',
            scopedSlots: { customRender: 'filterDetail' },
        },
        {
            title: '实际值',
            dataIndex: 'category',
            key: 'category',
            scopedSlots: { customRender: 'actualValue' },
        },
        {
            title: '分组数据详情',
            dataIndex: 'filingYear',
            key: 'filingYear',
        }
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

    threshold(item:any){
        console.log(item);
        let { href } = this.$router.resolve({
          name: "threshold",
          query: {
            id: item['id'],
            isOpenPage: 'true',
            appCode:  this.$route.query.code
          }
        });
        window.open(href,'_blank');
    }  

    executionResult(item:any){
        console.log(item);
        let { href } = this.$router.resolve({
          name: "execution",
          query: {
            id: item['id'],
            isOpenPage: 'true',
            appCode:  this.$route.query.code
          }
        });
        window.open(href,'_blank');
    } 

    details(item:any){

    }

    dataDetails(item:any){

    }

}
</script>
<style lang="less" scoped>

</style>