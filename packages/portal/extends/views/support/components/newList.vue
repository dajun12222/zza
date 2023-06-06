<template>
  <div>
    <elTable
      :columns="columns"
      :download="true"
      :dataContent="dataContent"
      :detail="false"
      @goDetail="goDetail"
      @download="download"
      @tname="tname"
    />
    <el-modal v-model="showModel" :modalData="modalData" />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row, Col, Button, Table, Modal, message } from '@h3/antd-vue';
import elTable from '@/../extends/components/table/table.vue';
import elModal from '@/../extends/components/form/modal.vue';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

import api from '@/../extends/api';
const qs = require('qs');
@Component({
  name: 'newList',
  components: {
    ATable: Table,
    elTable,
    elModal,
    AModal: Modal,
  },
})
export default class newList extends Vue {
  showModel: boolean = false;

  showModel1: boolean = false;

  showModel2: boolean = false;

  modalData: any = [];

  tableHtml: any = '';

  src: any = '';

  type: any = '';

  columns: any = [
    {
      title: '模版名称',
      dataIndex: 'templateName',
      key: 'templateName',
      scopedSlots: { customRender: 'templateName' },
      ellipsis: true,
    },
    {
      title: '模板类型',
      dataIndex: 'templateType',
      key: 'templateType',
    },
    {
      title: '模板标签',
      dataIndex: 'templateTags',
      key: 'templateTags',
      width: 120,
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
      title: '修改时间',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
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

    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      width: 110,
    },
  ];

  @Prop({}) dataContent?: any;

  get apiHost() {
    return (window as any).config.apiHost;
  }

  get token() {
    return window.localStorage.getItem('token');
  }

  async goDetail(item: any) {
    //modalData
    let option = qs.stringify({
      id: item['id'],
    });
    const res: any = await api.queryProjectTemplateDetails(option);
    if (res.code === '00000') {
      let maps = res.data;
      let modalData = this.serialization(maps);
      this.modalData = modalData;
      this.showModel = true;
    } else {
      this.modalData = {};
    }
  }

  async download(item: any) {
    let option = qs.stringify({
      templateId: item['id'],
    });

    let res: any = await api.downLoadTemplate(option);

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

  getDownloadUrl(refId: string) {
    let url = `${
      this.apiHost
    }/api/aliyun/download?refId=${getDownloadUrlNew.getRefId(refId)}`;
    if (this.token) {
      url += '&T=' + this.token;
    }
    return url;
  }

  async tname(item: any) {
    let attrSrc = this.getDownloadUrl(item.refId);
    
    window.open(
      'http://192.168.0.88:8001/view/url?url=' +
        encodeURIComponent(attrSrc) + '&name='+item.fileName,
    );
  }

  close1(a) {
    if (a.srcElement.toString().indexOf('HTMLDivElement') === -1) {
      this.showModel1 = false;
    }
  }

  close2(a) {
    if (a.srcElement.toString().indexOf('HTMLDivElement') === -1) {
      this.showModel2 = false;
    }
  }

  serialization(data: any) {
    let option: any = [];
    let att: any = [];
    let mapping = this.mapping();
    for (let i in mapping) {
      let obj = {
        name: mapping[i],
        con: data[i],
        cols: '',
      };
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

  mapping() {
    return {
      id: '数据ID',
      templateName: '模板名称',
      templateType: '模板类型',
      auditType: '审计类型',
      objectId: '对象ID',
      subjectCode: '主题库标识',
      remark: '模版描述',
      tags: '标签',
      fileName: '文件名称',
      updateTime: '修改时间',
    };
  }
}
</script>
<style lang="less" scoped>
/deep/.modalyl {
  .ant-modal {
    top: 10px !important;
  }
  .ant-modal-footer {
    display: none !important;
  }
}
/deep/.docx {
  padding: 20pt 20pt !important;
  width: auto;
  min-height: auto;
  margin: auto;
  width: 700pt;
}
/deep/ .table-html-wrap {
  td {
    border: 1px solid #000;
    min-width: 100px;
  }
}
</style>
