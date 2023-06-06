<template>
    <div class="examIndex">
        <a-table
            :columns="tableColumns"
            :dataSource="tableData"
            :pagination="false"
            :rowKey="(record) => record.id"
            bordered
        >
            <template slot="operation" slot-scope="text, record">
                <a class="mr20" @click="toExam(record)">考试</a>
                <a @click="toExamHistory(record)">历史考试查询</a>
            </template>
        </a-table>
    </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Table, Modal } from "@h3/antd-vue";

import api  from '@/../extends/api';
import axios from 'axios';
import Bus from 'cloudpivot/common/src/utils/bus';
const qs = require('qs');

// @@ 组件定义
@Component({
  name: 'exam-template',
  components: {
        ATable:Table,
  },
})
export default class examTemplate extends Vue {
    @Prop() list?: any; 

    @Prop() pageVM: any; //父级组件的vue对象

   tableColumns:any = [
        {
            title: '考试名称',
            dataIndex: 'examinationName',
            key: 'examinationName',
        },
        {
            title: '成绩',
            dataIndex: 'fraction',
            key: 'fraction',
            customRender: (text: any) => {
                return text + ' 分';
            },
        },
        {
            title: '排名',
            dataIndex: 'num',
            key: 'num',
        },
        {
            title: '是否及格',
            dataIndex: 'isPass',
            key: 'isPass',
        },
        {
            title: '关联课程',
            dataIndex: 'courseName',
            key: 'courseName',
        },
        {
            title: '操作',
            dataIndex: "operation",
            scopedSlots: { customRender: "operation" },
            width:'80px'
        },
   ]

   tableData:any = []

   newList:any = []

   @Watch('list', { immediate: true })
    onChange(list) {
        this.newList = list;
        this.tableData = list.list;
    }

   mounted(){
        this.selectOnlineExamList();
   }

   async selectOnlineExamList(){
        const option = qs.stringify({
            page:this.newList.pageNum ? this.newList.pageNum : 1 ,
            pageSize:20,
            examName:""
        });
        let res:any = await api.selectOnlineExamList(option);
        if(res.errcode === 0){
            this.newList = res.data;
            this.tableData = res.data.list;
        }
    }

    toExam(option){
        if(option.isks === undefined || option.isks === 1){
            const { href } = this.$router.resolve({
                name: 'lineExamView',
                query: {
                    id: option.examLibraryid,
                    type: '1'
                },
            });
            window.open(href, '_self');
        }else{
            Modal.warning({
                title: "提示",
                content: "您"+option.wxxkc+"课程未学习，不能考试",
                okText: "确定"
            });
        }
    }

    toExamHistory(option){
        window.open('/application/OnlineLearning/audit/examHistory?type=1&isOpenPage=true&id='+option.onlineExamId+'&name='+option.examinationName,'_blank')
    }
}
</script>

<style lang="less" scoped>
.examIndex{
    min-height: 400px;
    height: calc(100% - 54px);
    /deep/.ant-table-placeholder{
        display: block !important;
    }
    .mr20{
        margin-right: 20px;
    }
}
</style>