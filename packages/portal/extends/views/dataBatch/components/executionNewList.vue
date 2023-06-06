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
    @groupDetails="groupDetails"
    />
    <el-modal v-model="showModel" :title="'过滤条件详情'" :modalData="modalData" :columnDatas="columnsExecution" :tableData="tableDataExecution" />
    <el-modal v-model="showDataModel" :title="'数据详情'">
        <elTable class="elTableData" :columns="columnDatas" :dataContent="tableData" />
        <a-page :obj="tableData" style="margin-top: 12px;display: flex;justify-content: flex-end;" @searchPage="searchPage" />
    </el-modal>
    <el-modal v-model="showGroupModel" :title="'分组数据详情'" :modalData="modalGroupData" :columnDatas="columnsGroup" :tableData="tableDataGroup" />
</div>

</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row,Col,Button,Table } from "@h3/antd-vue";
import elTable from "@/../extends/components/table/table.vue";
import elModal from "@/../extends/components/form/modal.vue";
import page from '@/../extends/components/static/page.vue';
import api  from '@/../extends/api';
const qs = require('qs');
import axios from 'axios';
import { forEach } from 'lodash';
@Component({
    name: 'newList',
    components: {
        ATable: Table,
        elTable,
        elModal,
        APage:page,
    },
})
export default class newList extends Vue {
    // columns:any = [
    //     {
    //         title: '数据阈值名称',
    //         dataIndex: 'dataThresholdName',
    //         key: 'dataThresholdName',
    //         scopedSlots: { customRender: 'aTooltip' },
    //         align: 'center',
    //     },
    //     {
    //         title: '阈值规则名称',
    //         dataIndex: 'thresholdName',
    //         key: 'thresholdName',
    //     },
    //     {
    //         title: '字段名称',
    //         dataIndex: 'fieldName',
    //         key: 'fieldName',
    //     },
    //     {
    //         title: '判断条件',
    //         dataIndex: 'judgingCondition',
    //         key: 'judgingCondition',
    //     },
    //     {
    //         title: '告警值',
    //         dataIndex: 'alarmValue',
    //         key: 'alarmValue',
    //     },

    //     {
    //         title: '过滤条件详情',
    //         dataIndex: 'filterDetail',
    //         key: 'filterDetail',
    //         scopedSlots: { customRender: 'filterDetail' },
    //     },
    //     {
    //         title: '实际值',
    //         dataIndex: 'fieldValue',
    //         key: 'fieldValue',
    //         scopedSlots: { customRender: 'actualValue' },
    //     },
    //     {
    //         title: '分组数据详情',
    //         dataIndex: 'groupDataInfo',
    //         key: 'groupDataInfo',
    //         scopedSlots: { customRender: 'groupDataInfo' },
    //     }
    // ]
    
    showModel:boolean = false;

    modalData:any = [];

    columnsExecution:any = [
        {
            title: '字段名称',
            dataIndex: 'fieldName',
            key: 'fieldName',
        },
        {
            title: '判断条件',
            dataIndex: 'judgingCondition',
            key: 'judgingCondition',
            scopedSlots: { customRender: 'aTooltip' },
            ellipsis: true,
        },
        {
            title: '判断值',
            dataIndex: 'judgingValue',
            key: 'judgingValue',
            scopedSlots: { customRender: 'aTooltip' },
            ellipsis: true,
        }
    ]

    tableDataExecution:any = {};

    showDataModel:boolean = false;

    columnDatas:any = [
        {
            title: '资产编号',
            dataIndex: 'auditType',
            key: 'auditType',
        },
        {
            title: '资产名称',
            dataIndex: 'performanceForm',
            key: 'performanceForm',
        },
        {
            title: '业务状态',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '资产分类',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '资产大类',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '已使用年限',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '单价',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '数量',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '面积',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '价值类型',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '价值',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '品牌',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '规格型号',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '使用部门',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '使用人',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '存放地点',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '财政拨款',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '非财政拨款',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '取得方式',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '取得日期',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '资产记账日期',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '财务入账状态',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '财务入账日期',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '会计凭证号',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '折旧状态',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '折旧年限',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '累计折旧',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '已提折旧月数',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '月折旧额',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '净值',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        },
        {
            title: '备注',
            dataIndex: 'auditQualitativeBasis',
            key: 'auditQualitativeBasis',
        }
    ]

    tableData:any = {};
    
    dataThresholdId:string = '';

    showGroupModel:boolean = false;

    modalGroupData:any = [];

    columnsGroup:any = [];

    tableDataGroup:any = {};

    @Prop({}) columns?:any;

    @Prop({}) dataContent!:any;

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

    async details(item:any){
        let queryPageStringify = qs.stringify({
            thresholdId: item.dataThresholdId || '',
        })
        const res:any = await api.queryDataThresholdConditions(queryPageStringify);
        if(res.code === '00000'){
            let option = res.data;
            this.tableDataExecution = {
                'content': res.data
            };
        }else{
            this.tableDataExecution = {};
        }
        this.showModel = true;
    }

    async dataDetails(item:any){
        this.dataThresholdId = item.dataThresholdId;
        
        this.getColumn(item);

        this.getData({
            page: "1",
            size: "10",
        });
        this.showDataModel = true;
    }

    async groupDetails(item:any){
        let queryStringify = qs.stringify({
            thresholdId: item.dataThresholdId || '',
        })
        const res:any = await api.queryDataThresholdConditions(queryStringify);
        if(res.code === '00000'){
            let str = res.data[0].fieldCode;
            this.columnsGroup = [
                {
                    title: '科目编号',
                    dataIndex: str,
                    key: str,
                },
                {
                    title: '返回值',
                    dataIndex: 'result_value',
                    key: 'result_value',
                }
            ]

            let queryPageStringify = qs.stringify({
                id: item.id || '',
            })
            const resGroup:any = await api.queryGroupDataById(queryPageStringify);
            if(resGroup.code === '00000'){
                this.tableDataGroup = {
                    'content': resGroup.data
                };
            }else{
                this.tableDataGroup = {};
            }
            this.showGroupModel = true;
        }

       
    }

    async getColumn(item:any){
        let queryPageStringify = qs.stringify({
            'modelCode': this.$route.query.modelCode || ''
        })
        let res:any = await api.queryByCode(queryPageStringify);
        if(res.code === '00000'){
            let options:any = res.data;
            options.map((item) => {
                item['title'] = item['fieldName'];
                item['dataIndex'] = item['fieldCode'];
                item['key'] = item['fieldCode'];
            })
            this.columnDatas = options;
        }else{
            this.columnDatas = [];
        }
    }
    
    async getData(queryPage:any){
        // let maps:any = {
        //     'dataThresholdId': this.dataThresholdId || ''
        // };
        queryPage['dataThresholdId'] = this.dataThresholdId || '';
        let queryPageStringify = qs.stringify(queryPage)
        const res:any = await api.queryDataById(queryPageStringify);
        if(res.code === '00000'){
            let option = res.data;

       
            this.tableData = {
                'content': option['content'][0],
                'page': option.page,
                'size': option.size,
                'total': option.total,
            };
        }else{
            this.tableData = {};
        }
    }



    searchPage(option:any){
        this.getData(option);
    }

}
</script>
<style lang="less" scoped>

</style>