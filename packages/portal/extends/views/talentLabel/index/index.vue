<template>
  <div class="regulation">
    <div class="left">
      <elTable
        :columns="columns"
        :dataContent="objContent"
        :defaultExpandAllRows="true"
        @customRowClick="customRowClick"
      />
    </div>
    <div class="center"></div>
    <div class="right">
      <div class="content">
        <a-tabs v-model="activeKey">
          <a-tab-pane
            v-for="item in activeKeyList"
            :key="item.id"
            :tab="item.name"
          >
            <newList
              v-show="activeKey === 1"
              :dataContent="insideTalentVoList"
            />
            <newList1
              v-show="activeKey === 2"
              :dataContent="outsideTalentVoList"
            />
          </a-tab-pane>
        </a-tabs>

        <a-page
          :obj="dataContent"
          style="margin-top: 12px; display: flex; justify-content: flex-end"
          @searchPage="searchPage"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import newList from '@/../extends/views/talentLabel/components/newList.vue';
import newList1 from '@/../extends/views/talentLabel/components/newList1.vue';
import page from '@/../extends/components/static/page.vue';
import {
  Row,
  Col,
  Select,
  Input,
  Button,
  Tag,
  Tabs,
  Cascader,
} from '@h3/antd-vue';
import elTable from '@/../extends/components/table/table.vue';
import api from '@/../extends/api';
const qs = require('qs');
@Component({
  name: 'problemIndex',
  components: {
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
    AInput: Input,
    AButton: Button,
    ATag: Tag,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    ACascader: Cascader,
    newList,
    newList1,
    APage: page,
    elTable,
  },
})
export default class problemIndex extends Vue {
  objContent: any = {};

  dataContent: any = {};

  insideTalentVoList: any = {};

  outsideTalentVoList: any = {};

  activeKey: any = 1;

  @Watch('activeKey', { deep: true, immediate: true })
  onChangeActiveKey(newVal: any) {
    //获取列表
    this.search();
  }

  columns: any = [
    {
      title: '人才标签',
      dataIndex: 'tagsName',
      key: 'tagsName',
    },
  ];

  activeKeyList: any = [
    {
      id: 1,
      name: '内部审计人才库',
    },
    {
      id: 2,
      name: '外部审计人才库',
    },
  ];

  created() {
    //获取列表
    this.search();
    //获取问题tree
    this.getTree();
  }

  async getTree() {
    const res: any = await api.queryTagsList();
    if (res.code === '00000') {
      console.log('start....setUpKey...');
      console.log(this.setUpKey(res.data));
      this.objContent = {
        content: this.setUpKey(res.data),
      };
    } else {
      this.objContent = {};
    }
  }

  setUpKey(data: any) {
    if (data && data.length > 0) {
      data.map((item: any) => {
        item['key'] = item['id'];
        if (item && item.children && item.children.length > 0) {
          item.children = this.setUpKey(item.children);
        }
      });
    }
    return data;
  }

  search() {
    this.getList({
      page: '1',
      size: '10',
    });
  }

  async getList(queryPage) {
    let maps: any = {};
    maps['source'] = this.activeKey;

    let queryPageStringify = qs.stringify(queryPage);
    const res: any = await api.queryQuestion(maps, queryPageStringify);
    if (res.code === '00000') {
      let option = res.data;
      option['total'] = Number(option['total']);
      this.dataContent = res.data;
    } else {
      this.dataContent = {};
    }
  }

  close(selectedKeys) {
    this.getList({
      page: '1',
      size: '10',
    });
  }

  select(selectedKeys) {
    this.search();
  }

  searchPage(option: any) {
    this.getList(option);
  }

  async customRowClick(item) {
    let option = qs.stringify({
      id: item['id'],
    });
    const res: any = await api.queryTalentById(option);
    if (res.code === '00000') {
      this.insideTalentVoList = {
        content: res.data.insideTalentVoList,
      };
      this.outsideTalentVoList = {
        content: res.data.outsideTalentVoList,
      };
    } else {
      this.insideTalentVoList = {
        content: [],
      };
      this.outsideTalentVoList = {
        content: [],
      };
    }
  }
}
</script>
<style lang="less" scoped>
.regulation {
  height: 100%;
  padding: 12px;
  display: grid;
  grid-template-columns: 300px 12px 1fr;
  overflow-y: auto;
  .left {
    padding: 12px;
    background-color: #fff;
  }
  .right {
    .header {
      padding: 24px;
      background-color: #fff;
    }
    .content {
      margin-top: 12px;
      padding: 24px;
      background-color: #fff;
    }
  }
}
</style>
