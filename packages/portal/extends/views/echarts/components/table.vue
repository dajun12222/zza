<template>
    <div class="unit">
        <a-table 
            :columns="tableData.columns" 
            :data-source="tableData.data.content ? tableData.data.content : tableData.data" 
            :pagination="false" 
            :rowKey="record => record.id"
            bordered
            @change="handleTableChange"
        >
        <!-- <a-page :obj="dataContent" style="margin-top: 12px;display: flex;justify-content: flex-end;" @searchPage="searchPage" /> -->
        </a-table>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { Table, Tooltip } from "@h3/antd-vue";
import page from '@/../extends/components/static/page.vue';
import axios from 'axios';
import { each } from 'lodash';
@Component({
    name: 'table',
    components: {
        ATable: Table,
        aPage: page,
        ATooltip: Tooltip,
    },
})

export default class table extends Vue {
    @Prop() tableData!: any;

    pagination:any = {}

    @Watch('tableData', { immediate: true })
    getTableData(val){
        this.pagination = {
            size: 'small',
            current: 1,
            pageSize: 10,
            total: this.tableData && this.tableData.total ? parseInt(this.tableData.total) : 0,
        }
    }

    handleTableChange(){}
    
    mounted(){
    }
    

}
</script>
<style lang="less" scoped>
    /deep/.ant-table-column-title,/deep/.ant-table-tbody{
        color:rgba(219,222,228)
    }
    /deep/.ant-table-row:hover{
        color: rgba(7, 22, 58);
    }
    .unit{
        height: auto;
        margin-bottom: 20px;
    }
    /deep/.unitRank .ant-table-thead > tr > th, /deep/.unitRank .ant-table-tbody > tr > td{
        padding: 8px 5px !important;
    }
    .aTooltip {
        span {
            display: inline-block;
            max-width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        }
</style>
