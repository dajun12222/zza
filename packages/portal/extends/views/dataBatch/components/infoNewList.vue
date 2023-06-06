<template>
<div>
    <elTable :columns="columns" :dataContent="dataContent" @goDetail="goDetail" />
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

    @Prop({}) columns?:any;

    // columns:any = [
    //     {
    //         title: '资产编号',
    //         dataIndex: 'index',
    //         key: 'index',
    //         align: 'center',
    //     },
    //     {
    //         title: '资产名称',
    //         dataIndex: 'fileName',
    //         key: 'fileName',
    //     },
    //     {
    //         title: '业务状态',
    //         dataIndex: 'projectName',
    //         key: 'projectName',
    //     },
    //     {
    //         title: '资产分类',
    //         dataIndex: 'auditCategory',
    //         key: 'auditCategory',
    //     },
    //     {
    //         title: '资产大类',
    //         dataIndex: 'auditUnit',
    //         key: 'auditUnit',
    //     },

    //     {
    //         title: '已使用年限',
    //         dataIndex: 'responsibleUnit',
    //         key: 'responsibleUnit',
    //     },
    //     {
    //         title: '单价',
    //         dataIndex: 'category',
    //         key: 'category',
    //     },
    //     {
    //         title: '数量',
    //         dataIndex: 'filingYear',
    //         key: 'filingYear',
    //     },
    //     {
    //         title: '面积',
    //         dataIndex: 'filingYear1',
    //         key: 'filingYear1',
    //     },
    //     {
    //         title: '价值类型',
    //         dataIndex: 'filingYear2',
    //         key: 'filingYear2',
    //     },
    //     {
    //         title: '价值',
    //         dataIndex: 'filingYear3',
    //         key: 'filingYea3r',
    //     },
    //     {
    //         title: '品牌',
    //         dataIndex: 'filingYear4',
    //         key: 'filingYear4',
    //     },
    //     {
    //         title: '规格型号',
    //         dataIndex: 'filingYear5',
    //         key: 'filingYear5',
    //     },
    //     {
    //         title: '使用部门',
    //         dataIndex: 'filingYear24',
    //         key: 'filingYear24',
    //     },
    //     {
    //         title: '使用人',
    //         dataIndex: 'filingYear6',
    //         key: 'filingYear6',
    //     },
    //     {
    //         title: '存放地点',
    //         dataIndex: 'filingYear7',
    //         key: 'filingYear7',
    //     },
    //     {
    //         title: '财政拨款',
    //         dataIndex: 'filingYear8',
    //         key: 'filingYear8',
    //     },
    //     {
    //         title: '非财政拨款',
    //         dataIndex: 'filingYear9',
    //         key: 'filingYear9',
    //     },
    //     {
    //         title: '取得方式',
    //         dataIndex: 'filingYear10',
    //         key: 'filingYear10',
    //     },
    //     {
    //         title: '取得日期',
    //         dataIndex: 'filingYear11',
    //         key: 'filingYear11',
    //     },

    //     {
    //         title: '资产记账日期',
    //         dataIndex: 'filingYear12',
    //         key: 'filingYear12',
    //     },
    //     {
    //         title: '财务入账状态',
    //         dataIndex: 'filingYear13',
    //         key: 'filingYear13',
    //     },
    //     {
    //         title: '财务入账日期',
    //         dataIndex: 'filingYear14',
    //         key: 'filingYear14',
    //     },
    //     {
    //         title: '会计凭证号',
    //         dataIndex: 'filingYear15',
    //         key: 'filingYear15',
    //     },
    //     {
    //         title: '折旧状态',
    //         dataIndex: 'filingYear16',
    //         key: 'filingYear16',
    //     },

    //     {
    //         title: '折旧年限',
    //         dataIndex: 'filingYear17',
    //         key: 'filingYear17',
    //     },{
    //         title: '累计折旧',
    //         dataIndex: 'filingYear18',
    //         key: 'filingYear18',
    //     },
    //     {
    //         title: '已提折旧月数',
    //         dataIndex: 'filingYear19',
    //         key: 'filingYear19',
    //     },
    //     {
    //         title: '月折旧额',
    //         dataIndex: 'filingYear20',
    //         key: 'filingYear20',
    //     },
    //     {
    //         title: '净值',
    //         dataIndex: 'filingYear21',
    //         key: 'filingYear21',
    //     },
    //     {
    //         title: '备注',
    //         dataIndex: 'filingYear22',
    //         key: 'filingYear22',
    //     }
    // ]
    

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

    

}
</script>
<style lang="less" scoped>

</style>