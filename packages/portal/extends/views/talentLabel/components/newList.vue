<template>
<div>
    <elTable :columns="columns" :dataContent="dataContent" @goDetail="goDetail" />
</div>

</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row,Col,Button,Table } from "@h3/antd-vue";
import elTable from "@/../extends/components/table/table.vue";
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
            title: '人员编号',
            dataIndex: 'personCode',
            key: 'personCode',
        },
        {
            title: '人员姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '人员性别',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: '人员年龄',
            dataIndex: 'age',
            key: 'age',
        },

        {
            title: '所属部门',
            dataIndex: 'departmentName',
            key: 'departmentName',
            scopedSlots: { customRender: 'aTooltip' },
            ellipsis: true,
        },
        {
            title: '职务',
            dataIndex: 'post',
            key: 'post',
        },
        {
            title: '联系方式',
            dataIndex: 'telephone',
            key: 'telephone',
        },
        {
            title: '工龄',
            dataIndex: 'workDate',
            key: 'workDate',
        }
    ]
    

    @Prop({}) dataContent?:any;

    goDetail(item:any){
        this.$router.push({
          name: "problemInfo",
          query: {
            id: item['id'] 
          }
        } as any).catch((err: any) => {err});
    }

}
</script>
<style lang="less" scoped>

</style>