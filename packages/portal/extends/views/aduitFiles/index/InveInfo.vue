<template>
  <a-row class="aRow">
    <a-col
      :span="24"
      class="aCol"
      style="padding: 12px; border-bottom: 1px solid #b6d9f8"
    >
      <p :style="pStyle">基础信息</p>
    </a-col>
    <a-col :span="24" class="aCol aColContent">
      <table-con :modalData="baseData" />
    </a-col>
    <a-divider />
    <a-col
      :span="24"
      class="aCol"
      style="padding: 12px; border-bottom: 1px solid #b6d9f8"
    >
      <p :style="pStyle">项目信息</p>
    </a-col>
    <a-col :span="24" class="aCol aColContent">
      <a-tabs v-model="activeKey" type="card">
        <a-tab-pane key="预算文件" tab="预算文件">
          <a-col
            :span="24"
            class="aCol"
            style="padding: 12px; border-bottom: 1px solid #eee"
          >
            <p :style="pStyle">基本信息</p>
          </a-col>
          <a-col :span="24" class="aCol aColContent">
            <table-con :modalData="baseDataProject" />
          </a-col>
          <a-col
            :span="24"
            class="aCol"
            style="padding: 12px; border-bottom: 1px solid #eee"
          >
            <p :style="pStyle">结果信息</p>
          </a-col>
          <a-col :span="24" class="aCol aColContent">
            <table-con :modalData="resultDataProject" />
          </a-col>
        </a-tab-pane>
        <a-tab-pane key="采购文件" tab="采购文件">
          <a-col
            :span="24"
            class="aCol"
            style="padding: 12px; border-bottom: 1px solid #eee"
          >
            <p :style="pStyle">基本信息</p>
          </a-col>
          <a-col :span="24" class="aCol aColContent">
            <table-con :modalData="baseDataProject" />
          </a-col>
          <a-col
            :span="24"
            class="aCol"
            style="padding: 12px; border-bottom: 1px solid #eee"
          >
            <p :style="pStyle">结果信息</p>
          </a-col>
          <a-col :span="24" class="aCol aColContent">
            <table-con :modalData="resultDataProject" />
          </a-col>
        </a-tab-pane>
        <a-tab-pane key="待签合同" tab="待签合同">
          <a-col
            :span="24"
            class="aCol"
            style="padding: 12px; border-bottom: 1px solid #eee"
          >
            <p :style="pStyle">基本信息</p>
          </a-col>
          <a-col :span="24" class="aCol aColContent">
            <table-con :modalData="baseDataProject" />
          </a-col>
          <a-col
            :span="24"
            class="aCol"
            style="padding: 12px; border-bottom: 1px solid #eee"
          >
            <p :style="pStyle">结果信息</p>
          </a-col>
          <a-col :span="24" class="aCol aColContent">
            <table-con :modalData="resultDataProject" />
          </a-col>
        </a-tab-pane>
        <a-tab-pane key="结算文件" tab="结算文件">
          <a-col
            :span="24"
            class="aCol"
            style="padding: 12px; border-bottom: 1px solid #eee"
          >
            <p :style="pStyle">基本信息</p>
          </a-col>
          <a-col :span="24" class="aCol aColContent">
            <table-con :modalData="baseDataProject" />
          </a-col>
          <a-col
            :span="24"
            class="aCol"
            style="padding: 12px; border-bottom: 1px solid #eee"
          >
            <p :style="pStyle">结果信息</p>
          </a-col>
          <a-col :span="24" class="aCol aColContent">
            <table-con :modalData="resultDataProject" />
          </a-col>
        </a-tab-pane>
      </a-tabs>
    </a-col>
    <a-col :span="24" class="aCol aColContent">
      <a-col
        :span="24"
        class="aCol"
        style="padding: 12px; border-bottom: 1px solid #eee"
      >
        <p :style="pStyle">文件信息</p>
      </a-col>
      <a-col :span="24" class="aCol aColContent">
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
      <a-col
        :span="24"
        class="aCol"
        style="padding: 12px; border-bottom: 1px solid #eee"
      >
        <p :style="pStyle">过程信息</p>
      </a-col>
      <a-col :span="24" class="aCol aColContent">
        <elTable :columns="recordsColumns" :dataContent="recordsTtableData" />
      </a-col>
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import api from '@/../extends/api';
import { Row, Col, Table, Button, Divider, Tabs } from '@h3/antd-vue';
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
    ADivider: Divider,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    tableCon,
    elTable,
  },
})
export default class regulationInfo extends Vue {
  pStyle: any = {
    fontSize: '18px',
    color: 'rgb(24,144,255)',
    lineHeight: '24px',
    display: 'block',
    marginLeft: '18px',
  };

  pStyle2: any = {
    marginBottom: '24px',
  };

  activeKey: any = '预算文件';

  columns: any = [
    {
      title: '流程阶段',
      dataIndex: 'processStage',
      key: 'processStage',
      width: 200,
      customRender: (value, row, index) => {
        const obj = {
          children: value,
          attrs: {} as any,
        };
        if (row && row['length']) {
          obj.attrs.rowSpan = row['length'];
        } else {
          obj.attrs.rowSpan = 0;
        }

        return obj;
      },
    },
    {
      title: '文件名称',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '文件类别',
      dataIndex: 'fileCategory',
      key: 'fileCategory',
      width: 200,
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
      title: '操作人员',
      dataIndex: 'operator',
      key: 'operator',
      width: 160,
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

  recordsColumns: any = [
    {
      title: '项目编码',
      dataIndex: 'projectNumber',
      key: 'projectNumber',
      width: 90,
    },
    {
      title: '项目节点',
      key: 'projectNode',
      dataIndex: 'projectNode',
    },
    {
      title: '流程环节名称',
      dataIndex: 'processLinkName',
      key: 'processLinkName',
    },
    {
      title: '流程环节序号',
      dataIndex: 'processLinkNumber',
      key: 'processLinkNumber',
    },
    {
      title: '操作人员',
      dataIndex: 'operator',
      key: 'operator',
      width: 90,
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
      width: 130,
    },
  ];

  recordsTtableData: any = {};

  id: any = '';

  projectNode: any = '';

  info: any = {};

  @Watch('activeKey', { deep: true, immediate: true })
  onChangeActiveKey(newVal: any) {
    //获取列表
    this.getList();
  }

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
    let option = qs.stringify({ id: this.id, projectNode: this.activeKey });
    const res: any = await api.investmentArchivesDetails(option);
    if (res.code === '00000') {
      this.info = res.data.auditInvestmentProjectInfo;
      this.baseData = this.serialization(res.data.basicInfo, 'base');
      switch (this.activeKey) {
        case '预算文件':
          this.baseDataProject = this.serialization(
            res.data.basicBudgetDocument,
            'baseYS',
          );
          this.resultDataProject = this.serialization(
            res.data.resultBudgetDocument,
            'resultYS',
          );
          break;
        case '采购文件':
          this.baseDataProject = this.serialization(
            res.data.basicProcurementDocument,
            'baseCG',
          );
          this.resultDataProject = this.serialization(
            res.data.resultProcurementDocument,
            'resultCG',
          );
          break;
        case '待签合同':
          this.baseDataProject = this.serialization(
            res.data.basicSignContract,
            'baseDQ',
          );
          this.resultDataProject = this.serialization(
            res.data.resultSignContract,
            'resultDQ',
          );
          break;
        case '结算文件':
          this.baseDataProject = this.serialization(
            res.data.basicSettlementDocuments,
            'baseJS',
          );
          this.resultDataProject = this.serialization(
            res.data.resultSettlementDocuments,
            'resultJS',
          );
          break;
        default:
          break;
      }
      //过程信息
      this.recordsTtableData = {
        content: res.data.auditArchivesProcessRecords,
      };
      //文件信息
      this.setUpFile(res.data.auditArchivesProjectFiles);
    } else {
      this.info = {};
    }
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
      case 'baseYS':
        mapping = this.baseYSMapping();
        break;
      case 'baseCG':
        mapping = this.baseCGMapping();
        break;
      case 'baseDQ':
        mapping = this.baseDQMapping();
        break;
      case 'baseJS':
        mapping = this.baseJSMapping();
        break;
      case 'resultYS':
        mapping = this.resultYSMapping();
        break;
      case 'resultCG':
        mapping = this.resultCGMapping();
        break;
      case 'resultDQ':
        mapping = this.resultDQMapping();
        break;
      case 'resultJS':
        mapping = this.resultJSMapping();
        break;

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
      projectType: '项目类型',
      dataType: '资料类型',
      category: 'A类/AA类/B类',
      multiProject: '多标段项目',
      dataProject: '是否大数据项目',
      customizeSoftware: '是否定制软件',
      informationProject: '是否信息化项目',
      followAudit: '跟踪审计',
      address: '项目建设地址',
      province: '省份',
      city: '地市',
      district: '区县',
      projectOverview: '项目概述',
      responsibleUnit: '送审单位',
      responsibleUnitPrincipal: '送审单位负责人',
      responsibleUnitPrincipalContactDetails: '送审单位负责人联系方式',
    };
  }

  baseYSMapping() {
    return {
      reviewAmountYswj: '送审金额(元)',
      reviewDateYswj: '送审日期',
      projectLeaderYswj: '项目负责人',
      intermediaryUnitYswj: '中介机构',
      intermediaryUnitLeaderYswj: '中介负责人',
      intermediaryUnitLeaderContactDetailsYswj: '中介负责人联系方式',
    };
  }

  baseCGMapping() {
    return {
      reviewDateCgwj: '送审日期',
      procurementMethod: '采购方式',
      projectLeaderCgwj: '项目负责人',
      intermediaryUnitCgwj: '中介机构',
      intermediaryUnitLeaderCgwj: '中介负责人',
      intermediaryUnitLeaderContactDetailsCgwj: '中介负责人联系方式',
    };
  }

  baseDQMapping() {
    return {
      reviewDateDqht: '送审日期',
      contractAmount: '合同金额(元)',
      marginAmount: '保证金金额(元)',
      marginAmountMax: '保证金额度(元)',
      supplementaryContractAmount: '补充合同额度(元)',
      winningSupplier: '中标供应商',
      paymentMethod: '付款方式',
      projectLeaderDqht: '项目负责人',
      intermediaryUnitDqht: '中介机构',
      intermediaryUnitLeaderDqht: '中介负责人',
      intermediaryUnitLeaderContactDetailsDqht: '中介负责人联系方式',
    };
  }

  baseJSMapping() {
    return {
      reviewAmountJswj: '送审金额(元)',
      reviewDateJswj: '送审日期',
      projectLeaderJswj: '项目负责人',
      intermediaryUnitJswj: '中介机构',
      intermediaryUnitLeaderJswj: '中介负责人',
      intermediaryUnitLeaderContactDetailsJswj: '中介负责人联系方式',
    };
  }

  resultYSMapping() {
    return {
      approvedAmountYswj: '审定金额(元)',
      increaseDecreaseAmountYswj: '增减额(元)',
      increaseDecreaseRateYswj: '增减率',
      problemNumberYswj: '问题建议数',
      reportNumberYswj: '报告文号',
      approvedDateYswj: '审定日期',
      opinionLetterNumberYswj: '意见书文号',
    };
  }

  resultCGMapping() {
    return {
      problemNumberCgwj: '问题建议数',
      reportNumberCgwj: '报告文号',
      approvedDateCgwj: '审定日期',
      opinionLetterNumberCgwj: '意见书文号',
    };
  }

  resultDQMapping() {
    return {
      problemNumberDqht: '问题建议数',
      reportNumberDqht: '报告文号',
      approvedDateDqht: '审定日期',
      opinionLetterNumberDqht: '意见书文号',
    };
  }

  resultJSMapping() {
    return {
      approvedAmountJswj: '审定金额(元)',
      increaseDecreaseAmountJswj: '增减额(元)',
      increaseDecreaseRateJswj: '增减率',
      problemNumberJswj: '问题建议数',
      reportNumberJswj: '报告文号',
      approvedDateJswj: '审定日期',
      opinionLetterNumberJswj: '意见书文号',
    };
  }

  baseData: any = [];

  baseDataProject: any = [];

  resultData: any = [];

  resultDataProject: any = [];

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
/deep/ .ant-tabs-nav-scroll {
  text-align: center;
}
</style>
