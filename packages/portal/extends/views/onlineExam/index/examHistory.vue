<template>
    <div class="examHistory">
        <div ref="examTitle" class="examTitle">{{ title }}名称：<span>{{ name }}</span></div>
        <div class="list-table-box">
            <a-table
                class="table"
                :columns="tableColumns"
                :dataSource="tableData"
                :pagination="false"
                :rowKey="(record) => record.id"
                bordered
            >
                <template slot="operation" slot-scope="text, record">
                    <a @click="toExam(record)">历史{{ title }}详情</a>
                </template>
            </a-table>
             <div
                ref="paginationBox"
                class="pagination-box"
            >
                <template>
                    <div class="no-show-total-pagination">
                    <span
                        class="prev-btn"
                        :class="{ disable: curPage <= 1 }"
                        :disabled="true"
                        @click="prevPage"
                    >
                        <em class="icon aufontAll h-icon-all-left"></em>
                    </span>
                    <span class="current-page">{{ curPage }}</span>
                    <span
                        class="next-btn"
                        :class="{ disable: totalPages <= curPage }"
                        @click="nextPage"
                    >
                        <em class="icon aufontAll h-icon-all-right"></em>
                    </span>

                    <a-select
                        v-model="pageSize"
                        placeholder="请选择"
                        style="width: 98px; height: 32px; margin-left: 8px"
                        @change="(value) => onSizeChange(1, value)"
                    >
                        <a-select-option
                        v-for="(items, ind) in pageSizeOptions"
                        :key="ind"
                        :value="+items"
                        >
                        {{ items }} 条/页
                        </a-select-option>
                    </a-select>
                    </div>
                </template>
            </div>
        </div>
    </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Col, Row, Menu, Input, Icon, Table, Select } from "@h3/antd-vue";

import api  from '@/../extends/api';
import axios from 'axios';
import Bus from 'cloudpivot/common/src/utils/bus';
const qs = require('qs');

// @@ 组件定义
@Component({
  name: 'examHistoryTemplate',
  components: {
        ATable:Table,
        AIcon:Icon,
        ASelect:Select,
        ASelectOption: Select.Option,
  },
})
export default class examHistoryTemplate extends Vue {
    @Prop() pageVM: any; //父级组件的vue对象

   tableColumns:any = [
        {
            title: '分数',
            dataIndex: 'examScore',
            key: 'examScore',
            customRender: (text: any) => {
                return text + ' 分';
            },
        },
        {
            title: '是否及格',
            dataIndex: 'isPass',
            key: 'isPass',
            customRender: (text: any) => {
                return text === 1 ? '及格' : '不及格'
            },
        },
        {
            title: '考试时间',
            dataIndex: 'examTime',
            key: 'examTime',
        },
        {
            title: '考试时长',
            dataIndex: 'examDuration',
            key: 'examDuration',
            customRender: (text: any) => {
                return this.time(text);
            },
        },
        {
            title: '操作',
            dataIndex: "operation",
            scopedSlots: { customRender: "operation" },
            width:'110px'
        },
   ]

   tableData:any = []

   newList:any = []

   examLibraryid:any = ''

   name:any = ''

   pageSize: number = 20;

   curPage:any = 1

   pageSizeOptions: string[] = ['10', '20', '50', '100', '200', '300', '500'];

    // 加载完所有数据
  totalPages: any = 0;

  title:any = ''

   mounted(){
        this.examLibraryid = window.location.href.split('id=')[1].split('&name')[0];
        this.name = decodeURIComponent(window.location.href.split('name=')[1])
        this.selectExamHistoryList();
        this.title = window.location.href.split('type=')[1].split('&isOpenPag')[0] === '1'? '考试' : '练习'
   }

   async selectExamHistoryList(){
        const option = qs.stringify({
            page: this.curPage,
            pageSize:this.pageSize,
            examId:this.examLibraryid
        });
        let res:any = await api.selectExamHistoryList(option);
        if(res.errcode === 0){
            this.tableData = res.data.list;
            this.curPage = res.data.pageNum;
            this.totalPages = res.data.pages;
        }
    }

    toExam(option){
       this.$router.push({
            name: 'examInfo',
            query: {
                id: option.id,
            },
        });
        // window.open(href, '_blank');
    }

    time(val){
        let m: string | number = parseInt(String(val / 60));
        m = m < 10 ? "0" + m : m;
        let s: string | number = parseInt(String(val % 60));
        s = s < 10 ? "0" + s : s;
        return String(m)+ ':' + String(s) ;
    }

    // 上一页
  prevPage() {
    if (this.curPage <= 1) {
      return;
    }
    this.onPaginationChange(this.curPage - 1);
  }

  // 下一页
  nextPage() {
    if(this.totalPages <= this.curPage){
      return;
    }
    this.onPaginationChange(this.curPage + 1);
  }

  onPaginationChange(page: number) {
    this.curPage = page;
    this.selectExamHistoryList();
  }

   onSizeChange(current: number, size: number) {
        this.curPage = 1;
        this.pageSize = size;
        this.selectExamHistoryList();
    }
}
</script>

<style lang="less" scoped>
.examHistory{
    min-height: 400px;
    height: calc(100% - 25px);
    margin: 16px 16px 5px;
    background: #fff;
    /deep/.ant-table-thead > tr > th, /deep/.ant-table-tbody > tr > td{
        padding: 8px;
        text-align: center;
    }
    /deep/.ant-table-placeholder{
        display: block !important;
    }
     .examTitle{
        font-size: 16px;
        color: #333;
        height: 46px;
        background: #fff;
        text-indent: 10px;
        line-height: 46px;
        span{
            color: #2970FF;
        }
    }
    .list-table-box{
        min-height: 400px;
        height: calc(100% - 54px);
        width: 100%;
        position: relative;
        .table{
            height: 100%;
            max-height: calc(100% - 50px);
            overflow-y: scroll;
        }
        .pagination-box {
            position: relative;
            margin-top: 8px;
            text-align: right;
            padding: 8px 16px;
            border-top: 1px solid #EAEDF3;
        }
        .no-show-total-pagination{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            font-size: 12px;
            .current-page{
                color: #2970ff;
                border: 1px solid #2970ff;
                border-radius: 2px;
                margin: 0 8px;
            }
            .disable{
                color: rgba(0, 0, 0, 0.45);
                cursor: not-allowed;
            }
            span{
                cursor: pointer;
                border: 1px solid #d9d9d9;
                border-radius: 2px;
                display: inline-block;
                min-width: 32px;
                height: 32px;
                line-height: 30px;
                text-align: center;
                padding: 0 5px;
                em{
                    font-size: 12px;
                }
            }
        }
        .ant-pagination-total-text{
            display: inline-block;
            height: 32px;
            margin-right: 8px;
            line-height: 30px;
            vertical-align: middle;
                margin-right: 16px;
        }
    }
}
</style>