<template>
  <div>
    <pad>
      <a-row class="elRowOne">
        <a-col :span="24">
          <a-directory-tree
            :selectedKeys="AuditTypeValue"
            style="width: 100%"
            class="aDirectoryTree"
            :treeData="treeData"
            :replaceFields="replaceFields"
            allowClear
            placeholder="请选择审计问题"
            @select="select"
          />
        </a-col>
      </a-row>
    </pad>
    <!-- <elModal v-model="showModel">
      <a-table :columns="columns" 
          :data-source="DataInfo" 
          :pagination="false" 
          :rowKey="record => record.id"
      />
    </elModal> -->
    <a-modal
      :visible="showModelInfo"
      :closable="false"
      :maskClosable="false"
      width="90%"
      height="80%"
      wrapClassName="unsave-confirm"
      @cancel="close"
      @ok="close"
    >
      <a-table
        :columns="columns"
        :data-source="DataInfo"
        :pagination="false"
        :rowKey="(record) => record.id"
      />
      <template slot="footer">
        <div class="footer">
          <a-button type="primary" class="reload-btn" @click="close">确定</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import pad from '@/../extends/components/static/pad.vue';

import { Row, Col, Select, Button, Modal } from '@h3/antd-vue';

import api from '@/../extends/api';
const qs = require('qs');
@Component({
  name: 'matters',
  components: {
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
    AButton: Button,
    pad,
    AModal: Modal,
  },
})
export default class Matters extends Vue {
  AuditTypeValue: any = [];

  showModelInfo: boolean = false;

  DataInfo: any = [];

  code: string = '';

  treeData: any = [];

  selectName: string = '';

  schemaCode = '';

  codeNew: any = {
    bd_ysProjects: {
      name: '项目审计',
    },
    bd_zbProjects: {
      name: '项目审计',
    },
    bd_projectht: {
      name: '项目审计',
    },
    js001: {
      name: '项目审计',
    },
    project_records: {
      name: '财务收支审计',
    },
    project_records_ec: {
      name: '领导干部经济责任审计',
    },
    project_records_la: {
      name: '执法活动财物审计',
    },
    project_records_sp: {
      name: '专项审计',
    },
    project_records_jx: {
      name: '绩效审计',
    },
  };

  replaceFields: any = {
    children: 'children',
    title: 'name',
    key: 'id',
    value: 'id',
  };

  columns: any = [
    {
        title: '审计程序和内容',
        dataIndex: 'programContent',
        key: 'programContent',
    },
  ];

  created() {
    let schemaCode = (window as any).h3form.formObj.bizSchema.code;
    this.schemaCode = schemaCode;

    if (
      schemaCode &&
      this.codeNew[schemaCode] &&
      this.codeNew[schemaCode]['name']
    ) {
      this.code = this.codeNew[schemaCode]['name'];
      this.selectName = (window as any).h3form.workflowInfo.activityName;
    }
    this.getAuditTypeList();

    // //初始化列表
    // this.getCreated({
    //   page: '1',
    //   size: '10',
    // });
  }

  async getAuditTypeList() {
    // ?auditType=
    let queryPageStringify = qs.stringify({ auditType: this.code });

    const res: any = await api.matterQueryDirectory(queryPageStringify);
    // const res:any = await api.queryCaseDirectory();
    if (res.errmsg === 'success') {
      this.treeData = res.data;
    } else {
      this.treeData = [];
    }
  }

  dataContent: any = {};

  async getCreated(queryPage: any) {
    let queryPageStringify = qs.stringify(queryPage);
    const res: any = await api.queryMatterInfo(queryPageStringify);
    if (res.errmsg === 'success') {
      let option: any = res.data;
      // res.data.page = Number(option.page);
      // res.data.size = Number(option.size);
      // res.data.total = Number(option.total);
      this.DataInfo = option;
      this.showModelInfo = true
    } else {
      this.dataContent = {};
    }
  }

  select(selectedKeys) {
    let id = this.replaceFields['value'];
    let AuditTypeList = this.allGroup(
      JSON.parse(JSON.stringify(this.treeData)),
    );
    let result = AuditTypeList.find((item: any) => {
      return item[id] === selectedKeys[0];
    });
    if (result.children === null) {

      this.getCreated(result.parentId? { oneId: result.parentId, twoId: result.id } : {oneId: result.id,twoId:''});
    }
  }

  allGroup(option) {
    //所有分组,把树状结构拉成一维数组
    //let appMenu = this.appMenu;

    const retData = [] as any;
    const _helper = (data: any) => {
      if (!data) {
        return;
      }
      data.forEach((item: any) => {
        retData.push(item);
        if (item && item.children) {
          _helper(item.children);
        }
      });
    };
    _helper(option);
    return retData;
  }

  close() {
    this.showModelInfo = false;
  }
}
</script>
<style lang="less" scoped>
.elRowOne {
  margin-bottom: 10px;
}
.goAudit {
  cursor: pointer;
  font-size: 12px;
  color: #2970ff;
  // padding-left: 18px;
  padding-top: 2px;
}
/deep/ .ant-btn-primary {
  min-width: 57px;
}
/deep/ .anticon {
  color: #1791ff;
}
/deep/ .ant-tree-title {
  color: #1791ff;
}
/deep/ .ant-table-thead > tr > th,
/deep/ .ant-table-tbody > tr > td {
    padding: 10px;
    overflow-wrap: break-word;
}
</style>
