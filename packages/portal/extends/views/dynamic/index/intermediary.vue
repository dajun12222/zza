<template>
  <div class="intermeIndex">
    <div class="scrollY">
      <a-col class="indexRight" :span="24">
        <searchList
          ref="childSearch"
          :ph="`请输入机构名称`"
          @searchInfo="toSearchData"
        />
        <a-spin :spinning="spinning">
          <tableList
            :tableList="tableTwo"
            @changePage="changePage"
            @modalInfo="showModalInfo"
          />
        </a-spin>
      </a-col>
    </div>
    <modalList ref="childModal" :modalData="modalData" />
  </div>
</template>
<script lang="ts">
import { Col, Spin } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import treeList from '@/../extends/components/audit/dynamic/tree.vue';
import tableList from '@/../extends/components/audit/dynamic/table.vue';
import searchList from '@/../extends/components/audit/dynamic/search.vue';
import modalList from '@/../extends/components/audit/dynamic/modal.vue';
import api from '@/../extends/api';
const qs = require('qs');

@Component({
  name: 'intermeIndex',
  components: {
    ACol: Col,
    ASpin: Spin,
    treeList,
    tableList,
    searchList,
    modalList,
  },
})
export default class intermeIndex extends Vue {
  childTable: any = null; // 存储子组件

  childModal: any = null;

  childSearch: any = null;

  spinning: boolean = false;

  tableColumns: any = [
    {
      title: '序号',
      scopedSlots: { customRender: 'num' },
      width: '50px',
    },
    {
      title: '中介机构名称',
      dataIndex: 'name',
      ellipsis: true,
      key: 'name',
      scopedSlots: { customRender: 'columnTooltip' },
    },
    {
      title: '法人',
      dataIndex: 'legalPerson',
      key: 'legalPerson',
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
      width: '80px',
    },
    // {
    //     title: '经营状态',
    //     key: 'operatingState',
    //     dataIndex: 'operatingState',
    //     ellipsis: true,
    //     customRender: (value, row, index) => {
    //         let obj = "";
    //         if(value){
    //            obj = value;
    //         }else{
    //             obj = "-"
    //         }
    //         return obj;
    //     },
    //     width:'80px'
    // },
    {
      title: '成立日期',
      key: 'date',
      dataIndex: 'date',
      ellipsis: true,
      scopedSlots: { customRender: 'title' },
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = value;
        } else {
          obj = '-';
        }
        return obj;
      },
      width: '150px',
    },
    {
      title: '经营范围',
      key: 'businessScope',
      dataIndex: 'businessScope',
      ellipsis: true,
      scopedSlots: { customRender: 'columnTooltip' },
    },
    {
      title: '擅长业务领域',
      key: 'businessDomain',
      dataIndex: 'businessDomain',
      ellipsis: true,
      scopedSlots: { customRender: 'columnTooltip' },
    },
    {
      title: '更新日期',
      key: 'updateTime',
      dataIndex: 'updateTime',
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
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
      width: '80px',
    },
  ];

  tableTwo: any = {
    tableTitle: '中介列表',
    tableData: [],
    tableColumns: this.tableColumns,
    page: '',
    size: '',
    total: '',
  };

  modalData: any = []; //详情数据

  option: any = {
    page: '1',
    size: '10',
    fieldValue: '',
  };

  mounted() {
    this.getCreated();
  }

  async getCreated() {
    await this.pageAgentQuery(this.option);
  }

  async pageAgentQuery(params?: any) {
    this.spinning = true;
    // let pageOption = {
    //     page: this.page,
    //     size: "10",
    //     fieldValue:params?params.title:''
    // };
    this.option['fieldValue'] = params.title || '';
    let queryPage = qs.stringify(this.option);
    const res: any = await api.pageAgentQuery(queryPage);
    if (res.code === '00000') {
      this.spinning = false;
      this.tableTwo.tableData = res.data.content;
      this.tableTwo.page = Number(res.data.page);
      this.tableTwo.size = Number(res.data.size);
      this.tableTwo.total = Number(res.data.total);
    }
  }

  //搜索组件搜索表格
  async toSearchData(params?: any) {
    this.option['page'] = '1';
    await this.pageAgentQuery(params);
  }

  //详情
  async queryAgentInfo(params?: any) {
    let option = qs.stringify({
      id: params,
    });
    const res: any = await api.queryAgentInfo(option);
    if (res.code === '00000') {
      this.modalData = [
        [
          {
            name: '中介机构名称',
            con: res.data.name,
            cols: '',
          },
          {
            name: '法人',
            con: res.data.legalPerson,
            cols: '',
          },
          {
            name: '成立日期',
            con: res.data.date,
            cols: '',
          },
        ],
        [
          {
            name: '注册资本(万元)',
            con: res.data.registeredCapital,
            cols: '',
          },
          {
            name: '实缴资本(万元)',
            con: res.data.paidCapital,
            cols: '',
          },
          {
            name: '统一社会信用代码',
            con: res.data.uscc,
            cols: '',
          },
        ],
        [
          {
            name: '组织机构代码',
            con: res.data.organizationCode,
            cols: '',
          },
          {
            name: '所属行业',
            con: res.data.industry,
            cols: '',
          },
          {
            name: '登记机关',
            con: res.data.registrationAuthority,
            cols: '',
          },
        ],
        [
          {
            name: '擅长业务领域',
            con: res.data.businessDomain,
            cols: '',
          },
          // {
          //   name: '经营状态',
          //   con: res.data.operatingState,
          //   cols: '',
          // },
          {
            name: '企业类型',
            con: res.data.businessType,
            cols: 3,
          },
        ],
        [
          {
            name: '经营范围',
            con: res.data.businessScope,
            cols: 5,
          },
        ],
      ];
      return this.modalData;
    }
  }

  async showModalInfo(id: any) {
    await this.queryAgentInfo(id);
    this.childModal = this.$refs.childModal;
    this.childModal.showModal();
  }

  changePage(page) {
    this.option['page'] = page;
    this.pageAgentQuery(this.option);
  }
}
</script>
<style lang="less" scoped>
.intermeIndex {
  height: 100%;
  overflow: hidden;
  background: rgb(240, 242, 245);
  display: flex;
  flex-flow: row wrap;
  .scrollY {
    flex: 1;
    height: 100%;
    overflow-y: scroll;
  }
  .indexRight {
    padding: 8px;
    > div {
        border-radius: 5px !important;
        box-shadow: 0 0 5px #d4e4fa;
    }
  }
}
</style>
