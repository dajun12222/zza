<template>
<div>
    <elTable 
    :columns="columns" 
    :dataContent="dataContent" 
    :edit="true" 
    :detail="false"
    @goDetail="goDetail"
    @edit="edit"
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
            title: '字段名称',
            dataIndex: 'fieldName',
            key: 'fieldName',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '字段编码',
            dataIndex: 'fieldCode',
            key: 'fieldCode',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
        },
        {
            title: '是否分组',
            dataIndex: 'isGroup',
            key: 'isGroup',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
            customRender: (value, row, index) => {
                let obj = "";
                if(value){
                   obj = "分组";
                }else{
                    obj = "不分组"
                }
                return obj;
            }
        },
        {
            title: '判断条件',
            dataIndex: 'judgingCondition',
            key: 'judgingCondition',
            ellipsis: true,
            scopedSlots: { customRender: 'aTooltip' },
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
            }
        },
        {
            title: '判断值',
            dataIndex: 'judgingValue',
            key: 'judgingValue',
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
    

}
</script>
<style lang="less" scoped>

</style>