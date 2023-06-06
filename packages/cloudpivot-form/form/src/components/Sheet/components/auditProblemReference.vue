<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
<div class="auditProblemReference">
<a-row>
    <a-col :span="24">
        <h3>审计问题引用</h3>
    </a-col>
</a-row>
<a-row class="elRowPadding">
    <a-col :span="6" class="elColPadding">
        <a-col :span="10">问题类型：</a-col>
        <a-col :span="14">
            <a-tree-select
                v-model="TreeSelectValue"
                size="small"
                style="width: 100%"
                :treeData="treeData"
                treeCheckable
                allowClear
                searchPlaceholder="Please select"
            />
        </a-col>
    </a-col>
    <a-col :span="6" class="elColPadding">
        <a-col :span="10">定性：</a-col>
        <a-col :span="14">
            <a-input
                v-model="qualitative"
                size="small"
                class="input"
                maxlength="200"
              />
        </a-col>
    </a-col>
    <a-col :span="6" class="elColPadding">
        <a-col :span="10">描述：</a-col>
        <a-col :span="14">
            <a-input
                v-model="describe"
                size="small"
                class="input"
                maxlength="200"
              />
        </a-col>
    </a-col>
    <a-col :span="6" class="elColPadding">
        <a-col :span="10">依据：</a-col>
        <a-col :span="14">
            <a-input
                v-model="accord"
                size="small"
                class="input"
                maxlength="200"
              />
        </a-col>
    </a-col>
</a-row>
<a-row class="elRowPadding">
    <a-col :span="6" class="elColPadding">
        <a-col :span="10">建议：</a-col>
        <a-col :span="14">
            <a-input
                v-model="advice"
                size="small"
                class="input"
                maxlength="200"
              />
        </a-col>
    </a-col>
    <a-col :span="6" class="elColPadding elColBottom">
        <a-button
            size="small"
            type="primary"
            class="btns"
        >
          查询
        </a-button>
    </a-col>
    <a-col :span="24" />
</a-row>
<a-row class="elRowTable">
    <a-table :columns="columns" :data-source="data" :scroll="{ y: 240 }" :pagination="false" bordered>
    
        <div
            slot="action"
        >
            <span class="action">
                <!-- <i class="icon aufontAll h-icon-all-info-circle-fill"></i>
                <i class="icon aufontAll h-icon-all-download"></i> -->
                <a>引用</a>
            </span>
            
        </div>
        <div
            slot="projectDetails"
        >
            <span class="projectDetails">
                <a>查看</a>
            </span>
        </div>


    </a-table>
</a-row>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Col, Row,Button,Input,Table,TreeSelect } from '@h3/antd-vue';


@Component({
  name: 'auditProblemReference',
  components: {
    AButton: Button,
    ARow: Row,
    ACol: Col,
    AInput: Input,
    ATable: Table,
    ATreeSelect: TreeSelect 
  },
})
export default class auditProblemReference extends Vue {

    value:string = '';

    qualitative:string = '';

    describe:string = '';

    accord:string = '';

    advice:string = '';

    TreeSelectValue: string = '';

    treeData: any = [];

    columns:any = [
        // {
        //     title: '序号',
        //     dataIndex: 'index',
        //     key: 'index',
        //     align: 'center',
        //     width: 50,
        //     customRender: (text,record,index) => `${index+1}`,
        // },  
        {
            title: '定性',
            dataIndex: 'qualitative',
            key: 'qualitative',
        },
        {
            title: '描述',
            dataIndex: 'describe',
            key: 'describe',
        },
        {
            title: '依据',
            dataIndex: 'accord',
            key: 'accord',
        },
        {
            title: '建议',
            dataIndex: 'advice',
            key: 'advice',
        },
        {
            title: '引用次数',
            dataIndex: 'citations',
            key: 'citations',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: { customRender: 'action' },
            //width: 70,
        },
        {
            title: '项目详情',
            dataIndex: 'projectDetails',
            key: 'projectDetails',
            scopedSlots: { customRender: 'projectDetails' },
        },
    ]

    data:any = [
        {
            key: '1',
            title: 'John Brown',
          
        },
        {
            key: '2',
            title: 'Jim Green',
           
        }
    ]
    
}
</script>
<style lang="less" scoped>
.elRowPadding {
    padding-bottom: 10px;
    .elColPadding {
        padding: 0 3px;
        /deep/ .ant-col {
            display:flex;
            align-items: center;
        }
        /deep/ .ant-col-10 {
            justify-content: flex-end;
        }
    }
    .elColBottom {
        display: flex;
        justify-content: center;
    }
    .elRowTable {
        margin-top: 10px;
    }
}

</style>
