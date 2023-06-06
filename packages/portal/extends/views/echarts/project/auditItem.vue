<template>
  <div class="unitRank">
    <el-block-bg title="审计项目情况" :year="false">
      <div class="elContent">
        <div class="top">
          <!-- <p>共 {{ total }} 条记录</p> -->
          <p style="margin-left:10px">年份</p>
          <a-select
            v-model="year"
            style="width: 140px"
            size="small"
            class="elSelect"
            placeholder="请选择"
          >
            <a-select-option
              v-for="item in yearList"
              :key="item"
              :value="item"
              >{{ item }}</a-select-option>
          </a-select>
          <p style="margin-left:10px">单位名称</p>
          <a-select
            v-model="department"
            style="width: 260px"
            size="small"
            class="elSelect"
            placeholder="请选择"
            allowClear
          >
            <a-select-option
              v-for="item in departmentList"
              :key="item"
              :value="item"
              >{{ item }}</a-select-option>
          </a-select>
         </div>
        <tableList :tableData="tableData" />
        <!-- <elTable :columns="columns" :dataContent="dataContent"/> -->
        <a-page
          :obj="dataContent"
          style="margin-top: 12px; display: flex; justify-content: flex-end"
          @searchPage="searchPage"
        />
      </div>
    </el-block-bg>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import moment from 'moment';
import elTable from '@/../extends/components/table/table.vue';
import tableList from '@/../extends/views/echarts/components/table.vue';
import page from '@/../extends/components/static/page.vue';
import api from '@/../extends/api';
import { Select } from '@h3/antd-vue';
const qs = require('qs');
@Component({
  name: 'auditItem',
  components: {
    ASelect: Select,
    ASelectOption: Select.Option,
    elBlockBg: blockBg,
    elTable,
    aPage: page,
    tableList,
  },
})
export default class auditItem extends Vue {
  tableData: any = {
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 50,
        customRender: (text, record, index) => `${index + 1}`,
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        key: 'projectName',
        align: 'center',
      },
      {
        title: '审计类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
      },
      {
        title: '审计单位',
        dataIndex: 'departmentName',
        key: 'departmentName',
        align: 'center',
      },
      {
        title: '送审单位/被审计单位',
        dataIndex: 'unitName',
        key: 'unitName',
        align: 'center',
      },
      {
        title: '项目状态',
        dataIndex: 'state',
        key: 'state',
        align: 'center',
        width: 80,
      },
      {
        title: '项目开始情况',
        dataIndex: 'initiate',
        key: 'initiate',
        align: 'center',
        customRender: (val, row, index) => {
          let _this = this;
          const child = _this.$createElement('span', {
            domProps: {
              innerHTML: val,
            },
          });
          let obj: any = {
            children: child,
          };
          if (val === '逾期') {
            obj['style'] = {
              color: 'rgb(229 36 36)',
            };
          }
          return obj;
        },
      },
      {
        title: '项目完成情况',
        dataIndex: 'achieve',
        key: 'achieve',
        align: 'center',
        customRender: (val, row, index) => {
          let _this = this;
          const child = _this.$createElement('span', {
            domProps: {
              innerHTML: val,
            },
          });
          let obj: any = {
            children: child,
          };
          if (val === '逾期') {
            obj['style'] = {
              color: 'rgba(232,235,69)',
            };
          }
          return obj;
        },
      },
      {
        title: '审结时间',
        dataIndex: 'achieveTime',
        key: 'achieveTime',
        align: 'center',
        width: 120,
        customRender: (value, row, index) => {
          let obj = '';
          if (value) {
            obj = value.substr(0, 10);
          } else {
            obj = '-';
          }
          return obj;
        },
      },
    ],
    data: {},
    total: '',
  };

  dataContent: any = {
    page: 1,
    total: 0,
  };

  total: any = '';

  searchPage(option: any) {
    let params = {
      year: this.year,
      unitName: this.department,
    };
    this.dataContent.page = option['page'];
    this.getList(params, option);
  }

  search() {
    let params = {
      year: this.year,
      unitName: this.department,
    };
    this.getList(params);
  }

  created() {
    this.getYear();
    //this.getDepartmentList();
    let option = {
      year: this.year,
      unitName: '',
    };
    this.getList(option);
  }

  mounted() {
    // let resultContent:any = this.init('resultContent',300,500);
  }

  async getList(params?: any, option?: any) {
    let pageOption = {
      page: '1',
      size: '10',
    };
    let maps = Object.assign(pageOption, params, option);

    const res: any = await api.auditProjectsInfo(maps);
    if (res.errcode === 0) {
      console.log(res.data.total);
      this.total = res.data.total;
      let option = res.data;
      this.tableData.data = res.data.list;
      this.tableData.total = Number(res.data.total);
      this.dataContent.total = parseInt(res.data.total);
    } else {
    }
  }

  year: string = moment().format('YYYY');

  @Watch('year', { deep: true, immediate: true })
  onChangeYear(newVal: any) {
    if (newVal) {
      this.search();
    }
  }

  yearList: any = [];

  async getYear() {
    const res: any = await api.auditProjectsInfoParams();
    if (res.errcode === 0) {
      console.log(res.data);
      this.departmentList = res.data['unitName'];
      this.yearList = res.data['year'];
    } else {
      this.yearList = [];
    }
  }

  department: string | string[] = [];

  @Watch('department', { deep: true, immediate: true })
  onChangeDepartment(newVal: any) {
    this.search();
  }

  departmentList: any = [];

  async getDepartmentList() {
    let queryPageStringify = qs.stringify({
      typeCode: 'SJDW',
    });
    const res: any = await api.queryDepartmentList(queryPageStringify);
    if (res.code === '00000') {
      this.departmentList = res.data[0]['children'];
    } else {
      this.departmentList = [];
    }
  }

  tableVal(val) {
    let obj = '';
    obj = val;
    if (val === '逾期') {
      obj = `'<span class="yellow">'+val+'</span>'`;
    }
    return obj;
  }
}
</script>
<style lang="less" scoped>
.unitRank {
  width: 100%;
  height: 100%;
  margin-bottom: 7px;
  position: relative;
  .elContent {
    height: 94%;
    overflow-y: scroll;
    padding: 10px;
    .top {
      display: flex;
      // align-items: center;
      margin-top: 1%;
      margin-bottom: 1%;
      // height: 30px;
      > p {
        color: #292929;
        font-size: 1em;
        line-height: 24px;
      }
      > .elSelect {
        margin: 0 10px;
      }
    }
  }
  /deep/ .ant-table {
    font-size: 1em;
  }

  /deep/.ant-table-thead > tr > th {
    padding: 8px;
    background: rgb(237, 240, 249);
  }
  /deep/.ant-table-column-title,
  /deep/.ant-table-tbody {
    color: #000;
  }
  /deep/.ant-table-row:hover {
    color: rgba(7, 22, 58);
  }
  /deep/.ant-table-thead > tr > th,
  /deep/.ant-table-tbody > tr > td {
    padding: 3px 5px !important;
    font-size: 1em;
  }
  .elContent .elApage {
    /deep/ .ant-pagination {
      color: #000;
      display: flex;
      align-items: baseline;
      .ant-pagination-total-text,
      .ant-pagination-item-link,
      .ant-pagination-item a {
        color: #000;
      }
    }
  }
  /deep/ .jobOverviewJiao .title_warp {
    height: 5%;
    width: 96%;
  }

  /deep/ .ant-pagination.mini .ant-pagination-prev,
  .ant-pagination.mini .ant-pagination-next,
  .ant-pagination.mini .ant-pagination-item {
    min-width: 32px;
    height: 32px;
    margin: 0;
    line-height: 32px;
  }
}
</style>
