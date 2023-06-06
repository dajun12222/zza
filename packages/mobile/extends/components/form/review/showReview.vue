<template>
<div class="dataContent">
    <div class="table">
        <a-table
        :columns="columns" :data-source="reviewObj" :scroll="{ x: 1380 }" bordered :pagination="false"
        size="small"
        :rowKey="(record,index) => { return index }"
        >
            <!-- <div
                slot="questionTypeId"
                slot-scope="text,record"
            >
             <questionType v-model="record.questionTypeId" :disabled="true" />
            </div> -->
        </a-table>
    </div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin,Table,Input } from "@h3/antd-vue";
import questionType from '@/../extends/components/tree/questionType.vue';
@Component({
    name: 'showReview',
    components: {
        ATable: Table,
        questionType,
    },
})
export default class showReview extends Vue {

    @Prop({ default: false }) isMediation?:boolean;

    @Prop({ default: {} }) reviewObj?:any;

    @Watch('reviewObj', { deep: true, immediate: true })
    onChangeReviewObj(newVal:any){
        this.$set(this.treeData,0,newVal);
        this.$forceUpdate();
    }

    selectedRowKeys: any = [];

    columns: any = [
    {
      title: '问题编号',
      dataIndex: 'problemCode',
      key: 'problemCode',
      ellipsis: true,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = value;
        } else {
          obj = '-';
        }
        return obj;
      },
    },
    {
      title: '问题定性',
      dataIndex: 'qualitativeProblem',
      key: 'qualitativeProblem',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '定性依据',
      dataIndex: 'qualitativeBasis',
      key: 'qualitativeBasis',
      scopedSlots: { customRender: 'aTooltip' },
      ellipsis: true,
    },
    {
      title: '定性标签',
      dataIndex: 'qualitativeTag',
      key: 'qualitativeTag',
      ellipsis: true,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = value;
        } else {
          obj = '-';
        }
        return obj;
      },
    },
    {
      title: '数据来源',
      dataIndex: 'source',
      key: 'source',
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          switch (value) {
            case 1:
              value = '基础问题库';
              break;
            case 2:
              value = '本地问题库';
              break;
            case 3:
              value = '新增问题库';
              break;
          }
          obj = value;
        } else {
          obj = '-';
        }
        return obj;
      },
    },
    {
      title: '相似评分',
      dataIndex: 'similar',
      key: 'similar',
      width: 120,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = value.toFixed('2');
        } else {
          obj = '-';
        }
        return obj;
      },
    },
  ];
    
    treeData: any = [

    ];
   
    created(){
       
    }
   
   
   
    fieldMap(){
        //字段映射
        return {
            'quoteID': 'shortText1663135518349',//引用id
            'questionType': 'shortText1663123660655',//问题类型
            'auditQualitativeBasis': 'shortText1663123657443',//定性
            'performanceForm': 'longText1663124234679',//描述
            'basisForPunishment': 'longText1663124236951',//依据
            'auditSuggestion': 'longText1663124239302',//定性
        }
    }
 
}
</script>
<style lang="less" scoped>
.dataContent {
    display: flex;
    flex-direction: column;
    height: 100%;
    .button {
        padding: 10px;
        /deep/ .ant-btn {
            min-width: 60px;
            margin-right: 8px;
        }
    }
    .table {
        flex: 1;
        height: 100%;
        overflow-y: scroll;
        padding: 10px;
        padding-top: 0;
        /deep/ .ant-table-thead > tr > th,/deep/ .ant-table-tbody > tr > td {
            //padding: 8px 8px;
        } 
        .quote {
            cursor: pointer;
            min-width: auto;
        }
    }
}
</style>