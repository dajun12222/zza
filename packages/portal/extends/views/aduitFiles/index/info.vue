<template>
  <a-row class="aRow">
    <a-col :span="24" class="aCol" style="padding: 12px">项目信息</a-col>
    <a-col :span="24" class="aCol aColTitle">
      <a-col :span="24" class="aColTitleContent">
        <i
          v-show="baseMessage"
          class="icon aufontAll open"
          @click="showHide('baseMessage')"
          >&#xe7ee;</i>
        <i
          v-show="!baseMessage"
          class="icon aufontAll open"
          @click="showHide('baseMessage')"
          >&#xe7eb;</i>
        <span @click="showHide('baseMessage')">基本信息</span>
      </a-col>
    </a-col>
    <a-col v-if="baseMessage" :span="24" class="aCol aColContent">
      <table-con :modalData="baseData" />
    </a-col>

    <!-- <a-col :span="24" class="aCol aColTitle">
               <a-col :span="24" class="aColTitleContent">
                    <i v-show="resultMessage" class="icon aufontAll open" @click="showHide('resultMessage')">&#xe7ee;</i>
                    <i v-show="!resultMessage" class="icon aufontAll open" @click="showHide('resultMessage')">&#xe7eb;</i>
                    <span @click="showHide('resultMessage')">整改信息</span>
               </a-col>
          </a-col>
          <a-col v-if="resultMessage" :span="24" class="aCol aColContent">
               <table-con :modalData="resultData" />
          </a-col> -->

    <a-col :span="24" class="aCol aColTitle">
      <a-col :span="24" class="aColTitleContent">
        <i
          v-show="fileMessage"
          class="icon aufontAll open"
          @click="showHide('fileMessage')"
          >&#xe7ee;</i>
        <i
          v-show="!fileMessage"
          class="icon aufontAll open"
          @click="showHide('fileMessage')"
          >&#xe7eb;</i>
        <span @click="showHide('fileMessage')">文件信息</span>
        <!-- <a-button type="primary" size="small" class="aButton" @click="volumeDirectory">卷内目录</a-button> -->
      </a-col>
    </a-col>
    <a-col v-if="fileMessage" :span="24" class="aCol aColContent">
      <a-button
        type="primary"
        size="small"
        class="allDownload"
        @click="allDownload"
        >批量下载</a-button>
      <elTable
        :columns="columns"
        :detail="false"
        :download="true"
        :dataContent="tableData"
        @download="download"
      />
    </a-col>

    <a-col :span="24" class="aCol aColTitle">
      <a-col :span="24" class="aColTitleContent">
        <i
          v-show="questionsMessage"
          class="icon aufontAll open"
          @click="showHide('questionsMessage')"
          >&#xe7ee;</i>
        <i
          v-show="!questionsMessage"
          class="icon aufontAll open"
          @click="showHide('questionsMessage')"
          >&#xe7eb;</i>
        <span @click="showHide('questionsMessage')">整改信息</span>
      </a-col>
    </a-col>
    <a-col v-if="questionsMessage" :span="24" class="aCol aColContent">
      <elTable :columns="questionsColumns" :dataContent="questionsTtableData" />
    </a-col>
    <a-col :span="24" class="aCol aColTitle">
      <a-col :span="24" class="aColTitleContent">
        <i
          v-show="processMessage"
          class="icon aufontAll open"
          @click="showHide('processMessage')"
          >&#xe7ee;</i>
        <i
          v-show="!processMessage"
          class="icon aufontAll open"
          @click="showHide('processMessage')"
          >&#xe7eb;</i>
        <span @click="showHide('processMessage')">过程信息</span>
      </a-col>
    </a-col>
    <a-col v-if="processMessage" :span="24" class="aCol aColContent">
      <elTable :columns="recordsColumns" :dataContent="recordsTtableData" />
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import api from '@/../extends/api';
import { Row, Col, Table, Button } from '@h3/antd-vue';
import elTable from '@/../extends/components/table/table.vue';
import tableCon from '@/../extends/components/form/tableCon.vue';
const qs = require('qs');
@Component({
  name: 'regulationInfo',
  components: {
    ARow: Row,
    ACol: Col,
    ATable: Table,
    AButton: Button,
    tableCon,
    elTable,
  },
})
export default class regulationInfo extends Vue {
  columns: any = [
    {
      title: '审计作业流程',
      dataIndex: 'processStage',
      key: 'processStage',
      // customRender:(value, row, index) =>{
      //      debugger
      //      const obj = {
      //           children: value,
      //           attrs: {} as any,
      //      };
      //      if(row && row['length']){
      //           obj.attrs.rowSpan =  row['length'];
      //      }else{
      //           obj.attrs.rowSpan = 0;
      //      }

      //      return obj;
      // },
    },
    {
      title: '审计文件',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '文件类别',
      dataIndex: 'fileCategory',
      key: 'fileCategory',
      width: 150,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = '项目组卷文件';
        } else {
          obj = '项目详细文件';
        }
        return obj;
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      width: 70,
    },
  ];

  tableData: any = {};

  questionsColumns: any = [
    {
      title: '整改说明',
      dataIndex: 'rectifyNote',
      key: 'rectifyNote',
    },
    {
      title: '整改文件',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
    },
    {
      title: '审核结果',
      dataIndex: 'auditResult',
      key: 'auditResult',
    },
  ];

  questionsTtableData: any = {};

  recordsColumns: any = [
    // {
    //      title: '项目编码',
    //      dataIndex: 'projectNumber',
    //      key: 'projectNumber',
    //      width: 90,
    // },
    {
      title: '流程环节名称',
      dataIndex: 'processLinkName',
      key: 'processLinkName',
    },
    {
      title: '流程环节序号',
      dataIndex: 'processLinkNumber',
      key: 'processLinkNumber',
      width: 120,
    },
    {
      title: '操作人员',
      dataIndex: 'operator',
      key: 'operator',
      width: 150,
    },
    {
      title: '执行结果',
      dataIndex: 'result',
      key: 'result',
      width: 90,
    },
    {
      title: '执行内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '	执行时间',
      dataIndex: 'createTime',
      key: 'createTime',
      customRender: (value, row, index) => {
          let obj = '';
          if (value) {                    
          obj = value.substr(0,10);
          } else {
          obj = '-';
          }
          return obj;
      },
    },
  ];

  recordsTtableData: any = {};

  id: any = '';

  projectNode: any = '';

  // info:any = {};

  baseMessage: boolean = true;

  resultMessage: boolean = true;

  fileMessage: boolean = true;

  questionsMessage: boolean = true;

  processMessage: boolean = true;

  created() {
    this.id = this.$route.query.id || '';
    this.projectNode = this.$route.query.projectNode || '';
    if (!this.id) {
      this.$message.error('未获取到id');
      return;
    }
    this.getList();
  }

  async getList() {
    let option = qs.stringify({ id: this.id });
    let res: any = {};
    if (this.projectNode === 'Economic') {
      res = await api.economicArchivesDetails(option);
    } else {
      res = await api.financialArchivesDetails(option);
    }
    if (res.code === '00000' && res.data) {
      // this.info = res.data.auditInvestmentProjectInfo;
      this.baseData = this.serialization(res.data, 'base');
      // this.resultData  = this.serialization(res.data.auditInvestmentProjectInfo,'result');
      //整改信息
      this.questionsTtableData = {
        content: res.data.auditRectifications,
      };
      //过程
      this.recordsTtableData = {
        content: res.data.auditArchivesProcessRecords,
      };
      //文件
      this.setUpFile(res.data.auditArchivesProjectFiles);
      // }else{
      //      this.info = {};
    }
  }

  showHide(type) {
    this[type] = !this[type];
  }

  setUpFile(data) {
    // /tableData
    let result: any = [];
    let index: number = 0;
    for (let i in data) {
      for (let j = 0; j < data[i].length; j++) {
        data[i][j]['name'] = i;
      }
      if (data[i] && data[i].length > 0) {
        data[i][0].position = index;
        data[i][0].length = data[i].length;
      }
      result = result.concat(data[i]);
      index++;
    }

    this.tableData = {
      content: result,
    };
  }

  serialization(data: any, type: string) {
    let mapping: any = {};
    let option: any = [];
    let att: any = []; //resultMapping
    switch (type) {
      case 'base':
        mapping = this.baseMapping();
        break;
      // case 'result':
      //      mapping = this.resultMapping();
      // break;

      default:
        break;
    }

    for (let i in mapping) {
      let obj = {
        name: mapping[i],
        con: data[i],
        cols: '',
      };
      if (i === 'isCase') {
        obj.con = data[i] ? '是': '否';
      }
      att.push(obj);
      if (att && att.length === 3) {
        option.push(att);
        att = [];
      }
    }
    if (att.length !== 0) {
      option.push(att);
    }
    return option;
  }

  baseMapping() {
    return {
      fileName: '档案名称',
      fileNumber: '档案编号',
      fileReviewer: '档案审核人员',
      isCase: '是否为典型案例',
      projectName: '项目名称',
      projectNumber: '项目编号',
      scheduledTasks: '计划任务',
      responsibleUnit: '被审计单位',
      address: '地址',
      province: '省份',
      city: '地市',
      district: '区县',
      investigators: '审前调查人员',
      date: '日期',
      auditStartTime: '审计开始期间',
      auditEndTime: '审计结束期间',
      responsibleUnitNature: '被审计单位性质',
      entryDate: '进场日期',
      departureDate: '离场日期',
      auditCycle: '审计周期',
      deliveryReceiptAuditNotice: '审计通知送达回执',
      rectifyStartTime: '整改开始时间',
      rectifyEndTime: '整改结束时间',
      responsibleUnitPrincipal: '责任单位负责人',
      reportDeliveryReceipt: '报告送达回执',
      overdue: '整改逾期',
    };
  }

  // resultMapping(){
  //      return {
  //           'approvalDate': '审定日期',
  //           'realityAuditCycle': '实际审核周期',
  //           'budgetApprovalAmount': '预算批复金额(元)',
  //           'budgetAmount': '预算清单金额(元)',
  //           'approvalAmount': '审定金额(元)',
  //           'increaseDecreaseAmount': '增减额(元)',
  //           'increaseDecreaseRate': '增减率',
  //           'supplementSubmitDate': '提交补充资料清单日期',
  //           'supplementEndDate': '收到补充资料日期',
  //           'supplementDays': '补充资料天数',
  //           'auditResultDate': '出具审核结果日期',
  //           'auditResultFeedbackDate': '收到审核结果反馈日期',
  //           'auditReportDate': '出具审计报告日期',
  //           'reportName': '报告名称',
  //           'reportNumber': '报告编号',
  //      }
  // }

  baseData: any = [];

  // resultData:any = [];

  volumeDirectory(item: any) {
    let { href } = this.$router.resolve({
      name: 'aduitVolume',
      query: {
        isOpenPage: 'true',
        appCode: this.$route.query.appCode,
      },
    });
    window.open(href, '_blank');
  }

  async download(item: any) {
    let option = qs.stringify({
      id: item['id'],
    });

    let res: any = await api.fileDownload(option);

    let blob = new Blob([res], { type: 'application/docx' });

    let objectUrl = (
      (window as any).URL || (window as any).webkitURL
    ).createObjectURL(blob);
    let downFile = document.createElement('a');
    let fileName = item['fileName'];
    downFile.style.display = 'none';
    downFile.href = objectUrl;
    downFile.download = fileName;
    document.body.appendChild(downFile);
    downFile.click();
    document.body.removeChild(downFile);
    window.URL.revokeObjectURL(objectUrl);
  }

  async allDownload() {
    //fileExport

    let att: any = [];
    if (this.tableData && this.tableData.content) {
      this.tableData.content.map((item: any) => {
        att.push(item['id']);
      });
    }

    let option = qs.stringify({
      id: '1602905859471810562',
    });

    console.log(option);
    let res: any = await api.fileExport(option);

    let blob = new Blob([res], { type: 'application/docx' });

    let objectUrl = (
      (window as any).URL || (window as any).webkitURL
    ).createObjectURL(blob);
    let downFile = document.createElement('a');
    let mathRandom: any = parseInt((Math.random() * 10000) as any);
    let fileName: any = '文件信息' + mathRandom + '.zip';
    downFile.style.display = 'none';
    downFile.href = objectUrl;
    downFile.download = fileName;
    document.body.appendChild(downFile);
    downFile.click();
    document.body.removeChild(downFile);
    window.URL.revokeObjectURL(objectUrl);
  }
}
</script>
<style lang="less" scoped>
.aRow {
  height: 100%;
  padding: 18px;
  overflow-y: auto;
  .aCol {
    background-color: #fff;

    padding: 32px;
    h4 {
      margin-bottom: 10px;
    }
    table {
      width: 100%;
      border: 1px solid rgba(0, 0, 0, 0.06);
      font-size: 12px;
      tbody {
        tr {
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          th {
            width: 60px;
            height: 30px;
            background-color: #fafafa;
            border-right: 1px solid rgba(0, 0, 0, 0.06);
            text-align: center;
            color: rgb(144, 147, 153);
          }
          td {
            height: 30px;
            border-right: 1px solid rgba(0, 0, 0, 0.06);
            padding: 0 7px;
            a {
              color: rgba(0, 0, 0, 0.85);
              cursor: default;
            }
          }
        }
      }
    }
  }
  .aColTitle {
    border-radius: 0 0 2px 2px;
    padding: 0 16px;
    color: #1791ff;
    font-weight: 600;
    display: flex;
    align-items: center;
    .aColTitleContent {
      background-color: #e3f2ff;
      padding: 12px 16px;
      cursor: pointer;
      i {
        font-weight: normal;
        margin-right: 12px;
      }
    }
  }
  .aColContent {
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .aTable {
  }
  /deep/ .aButton {
    float: right;
    background-color: rgb(24, 144, 255);
  }
  .allDownload {
    margin-bottom: 10px;
  }
}
</style>
