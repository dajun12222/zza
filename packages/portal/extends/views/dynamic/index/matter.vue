<template>
  <div class="matterIndex">
    <div class="scrollY">
      <a-col class="indexLeft" :span="6">
        <treeList
          ref="childTree"
          :treeData="treeData"
          @arrKeys="toSearch(arguments)"
        />
      </a-col>
      <a-col class="indexRight" :span="18">
        <searchList
          ref="childSearch"
          :searchList="searchList"
          :ph="`请输入事项名称`"
          @searchInfo="toSearchData"
          @tagClose="tagClose"
        />
        <a-spin :spinning="spinning">
          <tableList
            :tableList="tableTwo"
            @modalInfo="showModalInfo"
            @changePage="changePage"
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
  name: 'matterIndex',
  components: {
    ACol: Col,
    ASpin: Spin,
    treeList,
    tableList,
    searchList,
    modalList,
  },
})
export default class matterIndex extends Vue {
  show: boolean = false; //详情显示

  tableColumns: any = [
    {
      title: '序号',
      scopedSlots: { customRender: 'num' },
      width: '50px',
    },
    {
      title: '审计事项名称',
      dataIndex: 'matterName',
      key: 'matterName',
      ellipsis: true,
      scopedSlots: { customRender: 'columnTooltip' },
    },
    {
      title: '审计事项说明',
      dataIndex: 'matterExplain',
      key: 'matterExplain',
      ellipsis: true,
      scopedSlots: { customRender: 'columnTooltip' },

    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
      width: '80px',
    },
  ];

  tableTwo: any = {
    tableTitle: '事项列表',
    tableData: [],
    tableColumns: this.tableColumns,
    page: '',
    size: '',
    total: '',
  };

  searchList: any = {
    searchData: {},
    objData: [],
    searchTag: 'matterIndex',
  };

  treeData: any = []; //树结构菜单

  treeDataOption: any = {
    matterName: '',
    auditTypeList: [], //审计类型
    projectClassificationList: [], //项目分类
    projectLevelList: [], //项目等级
    projectTypeList: [], //项目类型
    purchaseMethodList: [], //采购方式
  };

  page: any = '1';

  typeList: any = [];

  typeTagList: any = [];

  modalData: any = []; //详情数据

  childTable: any = null; // 存储子组件

  childModal: any = null;

  childSearch: any = null;

  childTree: any = null;

  spinning: boolean = false;

  auditTypeList: any = []; //审计类型

  projectClassificationList: any = []; //项目分类

  projectLevelList: any = []; //项目等级

  projectTypeList: any = []; //项目类型

  purchaseMethodList: any = []; //采购方式

  newArr: any = [];

  async mounted() {
    api.queryAuditTypeList().then((res: any) => {
      if (res.code === '00000') {
        this.treeData = this.treeData.concat(res.data);
        let a = {};
        a[res.data[0].dictionaryId] = '审计类型';
        console.log('aaaa', a);
        this.toSearch([a, [res.data[0].dictionaryId]]);
      }
    });
  }

  //详情
  async queryMattersDetails(params?: any) {
    let option = qs.stringify({
      id: params,
    });
    const res: any = await api.queryMattersDetails(option);
    if (res.code === '00000') {
      console.log('数据', res);
      this.modalData = [

          [ {
            name: '审计事项名称',
            con: res.data.matterName,
            cols: '3',
          },
          {
            name: '审计类型',
            con: res.data.auditType ? res.data.auditType[0] : '',
            cols: '3',
          },],
          [ {
            name: '审计事项说明',
            con: res.data?.matterExplain,
            cols: 6,
          },],


        // [
        //   {
        //     name: '采购方式',
        //     con: res.data.purchaseMethod ? res.data.purchaseMethod[0] : '',
        //     cols: '3',
        //   },
        //   {
        //     name: '项目等级',
        //     con: res.data.projectLevel ? res.data.projectLevel[0] : '',
        //     cols: '3',
        //   },
        //   {
        //     name: '项目类型',
        //     con: res.data.projectType ? res.data.projectType[0] : '',
        //     cols: '3',
        //   },
        // ],
        // [
        //   {
        //     name: '项目分类',
        //     con: res.data.projectClassification
        //       ? res.data.projectClassification[0]
        //       : '',
        //     cols: 9,
        //   },
        // ],
      ];
      return this.modalData;
    }
  }

  async showModalInfo(id: any) {
    await this.queryMattersDetails(id);

    this.childModal = this.$refs.childModal;
    this.childModal.showModal();
  }

  //查询表格
  async getCreated() {
    await this.queryMatters(this.treeDataOption);
  }

  async queryMatters(params?: any, option?: any) {
    this.spinning = true;
    let pageOption = {
      page: this.page,
      size: '10',
    };
    let maps = Object.assign(pageOption, option);
    let queryPage = qs.stringify(maps);
    const res: any = await api.queryMatters(params, queryPage);
    this.spinning = false;
    if (res.code === '00000') {
      this.tableTwo.tableData = res.data.content;
      this.tableTwo.page = Number(res.data.page);
      this.tableTwo.size = Number(res.data.size);
      this.tableTwo.total = Number(res.data.total);
    }
  }

  //搜索组件搜索表格
  async toSearchData(params?: any) {
    this.page = '1';
    this.treeDataOption = {
      matterName: params.title ? params.title : params.matterName,
      auditTypeList: this.auditTypeList || [], //审计类型
      // projectClassificationList: this.projectClassificationList || [], //项目分类
      // projectLevelList: this.projectLevelList || [], //项目等级
      // projectTypeList: this.projectTypeList || [], //项目类型
      // purchaseMethodList: this.purchaseMethodList || [], //采购方式
    };
    await this.queryMatters(this.treeDataOption);
  }

  //树结构
  async queryTypeList() {
    this.treeData = [];
    await this.queryAuditTypeList();
    // await this.queryProjectTypeList();
    // await this.queryProClassTypeList();
    // await this.queryMethodTypeList();
    // await this.queryLevelList();
  }

  //项目类型
  async queryProjectTypeList() {
    const res: any = await api.queryProjectTypeList();
    if (res.code === '00000') {
      this.treeData = this.treeData.concat(res.data);
      return this.treeData;
    }
  }

  //项目分类
  async queryProClassTypeList() {
    const res: any = await api.queryProClassTypeList();
    if (res.code === '00000') {
      this.treeData = this.treeData.concat(res.data);
      return this.treeData;
    }
  }

  //采购方式
  async queryMethodTypeList() {
    const res: any = await api.queryMethodTypeList();
    if (res.code === '00000') {
      this.treeData = this.treeData.concat(res.data);
      return this.treeData;
    }
  }

  //项目等级
  async queryLevelList() {
    const res: any = await api.queryLevelList();
    if (res.code === '00000') {
      this.treeData = this.treeData.concat(res.data);
      return this.treeData;
    }
  }

  //审计类型
  async queryAuditTypeList() {
    const res: any = await api.queryAuditTypeList();
    if (res.code === '00000') {
      this.treeData = this.treeData.concat(res.data);
      return this.treeData;
    }
  }

  save(item) {
    if (item.dictionaryId) this.newArr.push(item.dictionaryId);
    if (item.children && item.children.length > 0) {
      for (let index = 0; index < item.children.length; index++) {
        let element = item.children[index];
        this.save(element);
      }
    }
  }

  fn(arr, id) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].dictionaryId === id) {
        this.save(arr[i]);
      } else {
        if (arr[i].children && arr[i].children.length > 0) {
          this.fn(arr[i].children, id);
        }
      }
    }
  }

  toSearch(data: any) {
    let typeName: any = Object.keys(data[0]);
    let typeId: any = '';
    if (typeName.length > 2) {
      const lastName: any = typeName.pop();
      typeName.unshift(lastName);
    }
    this.newArr = [];
    this.fn(this.treeData, String(data[1]));
    // if (typeName[0] === 'SJLC-001') {
    //   this.auditTypeList = this.newArr;
    //   typeId = 'auditTypeList';
    // } else if (typeName[0] === 'SJLC-004') {
    //   this.projectTypeList = this.newArr;
    //   typeId = 'projectTypeList';
    // } else if (typeName[0] === 'SJLC-003') {
    //   this.projectClassificationList = this.newArr;
    //   typeId = 'projectClassificationList';
    // } else if (typeName[0] === 'SJLC-002') {
    //   this.purchaseMethodList = this.newArr;
    //   typeId = 'purchaseMethodList';
    // } else {
    //   this.projectLevelList = this.newArr;
    //   typeId = 'projectLevelList';
    // }
    this.auditTypeList = this.newArr;
    typeId = 'auditTypeList';
    let typeTag: any = Object.values(data[0]);
    if (typeTag.length > 2) {
      const lastTag: any = typeTag.pop();
      typeTag.unshift(lastTag);
    }
    const typeTagParam: any = {
      name1: typeTag[0],
      name2: typeTag[typeTag.length - 1],
      typeId: typeId,
    };
    if (this.typeTagList.length > 0) {
      for (let i = 0; i < this.typeTagList.length; i++) {
        if (this.typeTagList[i].name1 === typeTag[0]) {
          this.typeTagList.splice(i, 1);
        }
      }
    }
    this.typeTagList.push(typeTagParam);
    this.searchList.objData = this.typeTagList;
    this.searchList.searchData = data[0];
    console.log('搜索', this.treeDataOption);
    this.toSearchData(this.treeDataOption);
  }

  tagClose(typeId) {
    if (typeId === 'auditTypeList') {
      this.auditTypeList = [];
    } else if (typeId === 'projectClassificationList') {
      this.projectClassificationList = [];
    } else if (typeId === 'projectLevelList') {
      this.projectLevelList = [];
    } else if (typeId === 'projectTypeList') {
      this.projectTypeList = [];
    } else {
      this.purchaseMethodList = [];
    }
    this.toSearchData(this.treeDataOption);
  }

  changePage(page) {
    this.page = page;
    this.queryMatters(this.treeDataOption);
  }
}
</script>
<style lang="less" scoped>
.matterIndex {
  background: rgb(240, 242, 245);
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  min-width: 1100px;
  .scrollY {
    flex: 1;
    height: 100%;
    overflow-y: scroll;
  }
  .indexLeft {
    padding: 8px 8px 8px 12px;
    > div {
        border-radius: 5px !important;
        box-shadow: 0 0 5px #d4e4fa;
    }
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
