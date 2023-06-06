<template>
  <div class="dataCollection">
    <div class="right">
      <a-row class="header">
        <a-col :span="5" class="elCol">
          <a-input
            v-model="searchVal"
            autocomplete="off"
            style="width: 200px"
            allowClear
            placeholder="搜索数据批次"
          />
        </a-col>
        <a-col :span="5" class="elCol">
          <a-cascader
            placeholder="来源单位"
            class="role-tree"
            :value="cascaderVal"
            :options="cascaderData"
            :fieldNames="{
              label: 'name',
              value: 'dictionaryId',
              children: 'children',
            }"
            allowClear
            style="width: 200px"
            @change="cascaderChange"
          />
        </a-col>
        <a-col :span="5" class="elCol">
          <a-date-picker @change="onChange" />
        </a-col>

        <a-col :span="8" class="elCol">
          <a-button class="elButton" @click="reset">重置</a-button>
          <a-button type="primary" class="elButton" @click="search">检索</a-button>
        </a-col>
      </a-row>
      <div class="content">
        <p>数据任务看板</p>
        <newList :dataContent="dataContent" />
        <a-page
          :obj="dataContent"
          style="margin-top: 12px; display: flex; justify-content: flex-end"
          @searchPage="getList"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import questionType from '@/../extends/components/support/questionType.vue';
import problemType from '@/../extends/components/support/problemType.vue';
import newList from '@/../extends/views/dataCollection/components/newList.vue';
import page from '@/../extends/components/static/page.vue';
import {
  Row,
  Col,
  Select,
  Input,
  Button,
  Cascader,
  DatePicker,
} from '@h3/antd-vue';
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
    ACascader: Cascader,
    questionType,
    problemType,
    newList,
    APage: page,
    ADatePicker: DatePicker,
  },
})
export default class problemIndex extends Vue {
  cascaderVal: any = [];

  cascaderData: any = [];

  value: any = '';

  searchVal: any = '';

  dataContent: any = {};

  onChange(date, dateString) {
    console.log(date, dateString);
  }

  created() {
    //获取列表
    this.search();
    //审计类型
    this.getTree();
  }

  async getTree() {
    const res: any = await api.dataQueryDictList('typeCode=BSDW');
    //cascaderData
    if (res.code === '00000') {
      this.cascaderData = this.setUn(res.data);
    } else {
      this.cascaderData = [];
    }
  }

  search() {
    this.getList();
  }

  async getList() {
    this.dataContent = {
      content: [
        {
          pc: 'HRB-CW-99847850541038065',
          unit: '哈尔滨市公安局',
          laiyuan: '财务系统',
          total: '9564',
          time: '2023/3/7 12:24:35',
        },
        {
          pc: 'HRB-WZ-99847850541038066',
          unit: '哈尔滨市公安局',
          laiyuan: '物资管理系统',
          total: '1588',
          time: '2023/3/6 12:24:35',
        },
        {
          pc: 'HRB-WZ-99847850541038067',
          unit: '哈尔滨市公安局',
          laiyuan: '行政事业单位资产信息管理系统',
          total: '5468',
          time: '2023/3/5 12:24:35',
        },
        {
          pc: 'HRB-ZF-99847850541038057',
          unit: '哈尔滨市公安局',
          laiyuan: '执法办案信息系统',
          total: '123',
          time: '2023/3/4 12:24:35',
        },
        {
          pc: 'HRB-OA-99847850541038076',
          unit: '哈尔滨市公安局',
          laiyuan: 'OA审批系统',
          total: '45',
          time: '2023/3/3 12:24:35',
        },
        {
          pc: 'SH-CW-99847850541038068',
          unit: '哈尔滨市公安局',
          laiyuan: '财务系统',
          total: '5000',
          time: '2023/3/2 12:24:35',
        },
        {
          pc: 'SH-WZ-99847850541038069',
          unit: '绥化市公安局',
          laiyuan: '物资管理系统',
          total: '6451',
          time: '2023/3/1 12:24:35',
        },
        {
          pc: 'SH-RZ-99847850541038070',
          unit: '绥化市公安局',
          laiyuan: '行政事业单位资产信息管理系统',
          total: '1595',
          time: '2023/2/28 12:24:35',
        },
        {
          pc: 'SH-ZF-99847850541038071',
          unit: '绥化市公安局',
          laiyuan: '执法办案信息系统',
          total: '654',
          time: '2023/2/27 12:24:35',
        },
        {
          pc: 'SH-ZF-99847850541038070',
          unit: '绥化市公安局',
          laiyuan: 'OA审批系统',
          total: '54',
          time: '2023/2/26 12:24:35',
        },
        {
          pc: 'DQ-CW-99847850541038073',
          unit: '大庆市公安局',
          laiyuan: '财务系统',
          total: '54',
          time: '2023/2/25 12:24:35',
        },
        {
          pc: 'HH-CW-99847850541038075',
          unit: '黑河市公安局',
          laiyuan: '财务系统',
          total: '3029',
          time: '2023/3/5 12:24:35',
        },
      ],
    };
  }

  cascaderChange(value) {
    this.cascaderVal = value;
  }

  reset() {
    this.cascaderVal = [];
    this.searchVal = '';
    this.value = '';
    this.search();
  }

  setUn(data: any) {
    data.map((item: any) => {
      if (item && item.children && item.children.length > 0) {
        item.children = this.setUn(item.children);
      } else {
        item.children = null;
      }
    });
    return data;
  }
}
</script>
<style lang="less" scoped>
.dataCollection {
  height: 100%;
  padding: 12px;
  overflow-y: auto;
  .left {
    padding: 12px;
    background-color: #fff;
  }
  .right {
    .header {
      padding: 24px;
      background-color: #fff;
      .elCol {
        padding: 12px 20px;
        .elButton {
          width: 100px;
          margin-right: 10px;
        }
      }
    }
    .content {
      margin-top: 12px;
      padding: 24px;
      background-color: #fff;
      p {
        padding: 0 0 12px 0;
      }
    }
  }
}
</style>
