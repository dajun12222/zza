<template>
  <div>
    <elTable
      :columns="columns"
      :dataContent="dataContent"
      @goDetail="goDetail"
    />
    <el-modal v-model="showModel" :modalData="modalData" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row, Col, Button, Table } from '@h3/antd-vue';
import elTable from './table.vue';
import elModal from '@/../extends/components/form/modal.vue';
import OrgApi from '../../api/organization';
import api from '@/../extends/api';

const qs = require('qs');
@Component({
  name: 'newList',
  components: {
    ATable: Table,
    elTable,
    elModal,
  },
})
export default class newList extends Vue {
  showModel: boolean = false;

  modalData: any = [];

  openApplicationPortal: boolean = window.config.openApplicationPortal || false;

  IframeFormUrl: string = '';

  columns: any = [
    {
      title: '项目名称',
      dataIndex: 'instanceName',
      key: 'instanceName',
      scopedSlots: { customRender: 'instanceName' },
      // ellipsis: true,
      width:350
    },
    {
      title: '当前流程',
      dataIndex: 'activityName',
      key: 'activityName',
      ellipsis: true,
    },
    {
      title: '发起人',
      dataIndex: 'originatorName',
      key: 'originatorName',
      ellipsis: true,
      width:80
    },
    {
      title: '接收时间',
      dataIndex: 'startTime',
      key: 'startTime',
      ellipsis: true,
    },

  ];

  @Prop({}) dataContent?: any;

  @Prop({}) status?: any;
  
  @Prop({
    default: 4,
  })
  type!: number;

  created(){
  
  }

  get token() {
    return window.localStorage.getItem('token');
  }

  async goDetail(obj: any) {
    // console.log('打开了表单');
    console.log(obj);
    console.log('22222222222222',this.type)

    //修改为已读状态
    obj.isRead = true;
    let url = '';
    let host: string = '';
    if (this.openApplicationPortal && obj.containerName) {
      let workflowInstanceId = obj.instanceId;
      if ([5, 7].includes(this.type)) {
        workflowInstanceId = obj.id;
      }

      const res = await OrgApi.getContainerUrl({
        workflowInstanceId: workflowInstanceId,
      });
      if (res.errcode === 0) {
        host = res.data;
      }
    }
    console.log('类型', this.type);
    switch (this.type) {
      case 1:
      case 2:
      case 3:
      case 4:
        url = `/form/detail?workitemId=${obj.id}&workflowInstanceId=${
          obj.instanceId
        }&return=/workflow-center/my-unfinished-workitem?return=%2Fportal-page%2FdefaultPortalDashboard&workitemType=finishedWorkitem`;
        break;
      case 5:
      case 7:
        url = `/form/detail?workflowInstanceId=${obj.id}&return=/workflow-center/my-unfinished-workitem?return=%2Fportal-page%2FdefaultPortalDashboard`;
        break;
      case 8:
        url = `/form/detail?workitemId=${obj.id}&workflowInstanceId=${
          obj.instanceId
        }&return=/workflow-center/my-unfinished-workitem?return=%2Fportal-page%2FdefaultPortalDashboard`;
        break;

      default:
        break;
    }
    url = host + url;
    if (this.openApplicationPortal) {
      url = url + '&T=' + this.token;
    }
    if (this.isDingTalk) {
      this.$router
        .push({
          path: url,
        })
        .catch((err: any) => {
          console.log(err);
        });
      console.log('url1', url);
    } else {
      this.IframeFormUrl = url;
      // this.showIframeForm = true;
      window.open(url, '_blank');
      console.log('url2', url);
    }
    console.log(2222222222,url)
  }

  setColumn(e){
       console.log('ssssss',e)
  }



}
</script>
<style lang="less" scoped>
/deep/ .ant-table tbody > tr:nth-child(even) {
  background: #F4F8FB;
}
</style>
