<template>
  <div class="unitRank">
    <el-block-bg title="审计整改情况" :year="false">
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
              :key="item.name"
              :value="item.name"
              >{{ item.name }}</a-select-option>
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
  name: 'indexAuditItem',
  components: {
    ASelect: Select,
    ASelectOption: Select.Option,
    elBlockBg: blockBg,
    elTable,
    aPage: page,
    tableList,
  },
})
export default class indexAuditItem extends Vue {
  @Prop() data?: string;

  tableData: any = {
    columns: [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 60,
        customRender: (text, record, index) => `${index + 1}`,
      },
      {
        title: '被审计单位',
        dataIndex: 'unitAudit',
        key: 'unitAudit',
      },
      {
        title: '整改项目数',
        dataIndex: 'projectNum',
        key: 'projectNum',
      },
      {
        title: '涉及整改问题数',
        dataIndex: 'rectifyNum',
        key: 'rectifyNum',
      },
      {
        title: '未整改问题数',
        dataIndex: 'rectificationNum',
        key: 'rectificationNum',
      },

      {
        title: '已整改问题数',
        dataIndex: 'archiveNum',
        key: 'archiveNum',
      },
      // {
      //     title: '逾期整改问题数',
      //     dataIndex: 'initiate',
      //     key: 'initiate',
      //     customRender: (val, row, index) => {
      //        let obj:any = ''
      //        if(val){
      //            obj = val;
      //        }else{
      //            obj = 0;
      //        }
      //        return obj;
      //     },
      // },
      {
        title: '问题整改进度',
        dataIndex: 'progress',
        key: 'progress',
        width: 140,
        customRender: (val, row, index) => {
          let _this = this;
          const h = _this.$createElement;
          let objWidth = Number(val) * 100;
          objWidth = Math.floor(objWidth);
          return h('div', { class: 'conCol' }, [
            h('p', {
              class: 'bgCon',
              style: {
                width: objWidth + '%',
                background:
                  objWidth > 80
                    ? 'rgba(130,199,161)'
                    : objWidth < 80 && objWidth > 50
                    ? 'rgba(102,134,232)'
                    : 'rgba(187,96,87)',
              },
            }),
            h('span', { class: 'numCon' }, objWidth + '%'),
          ]);
        },
      },
    ],
    data: {},
  };

  dataContent: any = {
    page: 1,
    total: 0,
  };

  total: any = '';

  searchPage(option: any) {
    let params = {
      year: this.year,
    };
    this.dataContent.page = option['page'];
    this.getList(params, option);
  }

  search() {
    let params = {
      year: this.year,
    };
    this.getList(params);
  }

  created() {
    this.getYear();
    let option = {
      year: this.year,
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

    const res: any = await api.auditRectifyInfoOne(maps);
    if (res.errcode === 0) {
      this.total = res.data.total;
      let option = res.data;
      this.tableData.data = res.data.list;
      this.tableData.total = res.data.total;
      this.dataContent.total = parseInt(res.data.total);
    } else {
    }
  }

  // tableVal(val) {
  //     if(val === '')
  // }

  year: string = moment().format('YYYY');

  @Watch('year', { deep: true, immediate: true })
  onChangeYear(newVal: any) {
    if (newVal) {
      this.search();
    }
  }

  yearList: any = [];

  async getYear() {
    const res: any = await api.queryYearList();
    if (res.code === '00000') {
      this.yearList = res.data[0]['children'];
    } else {
      this.yearList = [{name:2023}];
    }
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
    text-align: center;
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
