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
            title: '数据阈值名称',
            dataIndex: 'dataThresholdName',
            key: 'dataThresholdName',
            align: 'center',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '阈值规则名称',
            dataIndex: 'thresholdName',
            key: 'thresholdName',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '阈值编码',
            dataIndex: 'thresholdCode',
            key: 'thresholdCode',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '字段名称',
            dataIndex: 'fieldName',
            key: 'fieldName',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '判断条件',
            dataIndex: 'judgingCondition',
            key: 'judgingCondition',
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                    if(value === '<'){
                        obj = "小于";
                    }else if(value === '>'){
                        obj = "大于";
                    }else if(value === '='){
                        obj = "等于";
                    }else if(value === '>='){
                        obj = "大于等于";
                    }else if(value === '<='){
                        obj = "小于等于";
                    }
                }else{
                    obj = "-"
                }
                return obj;
            },
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '告警值',
            dataIndex: 'alarmValue',
            key: 'alarmValue',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: { customRender: 'action' },
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