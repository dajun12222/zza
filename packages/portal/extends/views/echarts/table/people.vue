<template>
  <!-- <div>
        <tableList :tableData="tableData" />
    </div> -->
  <div class="unitRank">
    <el-block-bg title="审计单位人才情况" :year="false">
      <div class="elContent">
        <!-- <div class="top">
                    <p>共 {{ total }} 条记录</p>
                </div> -->
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
import tableList from '@/../extends/views/echarts/components/table.vue';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import page from '@/../extends/components/static/page.vue';
import api from '@/../extends/api';
import { Select } from '@h3/antd-vue';
const qs = require('qs');
@Component({
  name: 'people',
  components: {
    ASelect: Select,
    ASelectOption: Select.Option,
    tableList,
    aPage: page,
    elBlockBg: blockBg,
  },
})
export default class auditItem extends Vue {
  tableData: any = {
    columns: [
      {
        title: '序号',
        customRender: (text, record, index) => `${index + 1}`,
        width: '60px',
        align: 'center',
      },
      {
        title: '审计单位',
        dataIndex: 'unitName',
        key: 'unitName',
        customRender: (value, row, index) => {
          let obj = '';
          if (value) {
            obj = value;
          } else {
            obj = '-';
          }
          return obj;
        },
        align: 'center',
      },
      {
        title: '审计人员',
        dataIndex: 'talentCounts',
        key: 'talentCounts',
        customRender: (value, row, index) => {
          let obj = '';
          if (value) {
            obj = value;
          } else {
            obj = '-';
          }
          return obj;
        },
        width: '120px',
        align: 'center',
      },
      {
        title: '职业证书数',
        dataIndex: 'certificateCounts',
        key: 'certificateCounts',
        width: '120px',
        align: 'center',
      },
      {
        title: '职业人才占比',
        dataIndex: 'occupationTalentProportion',
        key: 'occupationTalentProportion',
        customRender: (value, row, index) => {
          let obj = '';
          if (value) {
            obj = value;
          } else {
            obj = '-';
          }
          return obj;
        },
        width: '120px',
        align: 'center',
      },
      {
        title: '本科及以上学历占比',
        dataIndex: 'degreeProportion',
        key: 'degreeProportion',
        align: 'center',
        width: '150px',
      },
    ],
    data: {},
  };

  total: any = {};

  dataContent: any = {
    page: 1,
    total: 0,
  };

  async mounted() {
    await this.auditTalentInfo();
  }

  searchPage(option: any) {
    this.dataContent.page = option['page'];
    this.auditTalentInfo(option);
  }

  async auditTalentInfo(option?: any) {
    let pageOption = {
      page: 1,
      size: 10,
    };
    let maps = Object.assign(pageOption, option);

    const res: any = await api.auditTalentInfo(qs.stringify(maps));
    if (res.code === '00000') {
      this.tableData.data = res.data;
      this.total = res.data.total;
      this.tableData.total = res.data.total;
      this.dataContent.total = parseInt(res.data.total);
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
