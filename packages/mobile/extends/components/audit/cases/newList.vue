<template>
<div>
<a-table :columns="columns" :data-source="treeData" :scroll="{ y: '100%' }" bordered :pagination="false"
:rowKey="(record,index) => { return index }"
>
    
    <div
        slot="action"
        slot-scope="text,record"
    >
        <span class="action">
            <!-- <i class="icon aufontAll h-icon-all-info-circle-fill" title="详情"></i> -->
            <i class="icon aufontAll h-icon-all-download" title="下载" @click="download(record)"></i>
        </span>
    </div>


</a-table>
</div>
    
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Table } from "@h3/antd-vue";
import api  from '@/../extends/api';
import axios from 'axios';
const qs = require('qs');
@Component({
  name: 'CaseNewList',
  components: {
    ATable: Table,
  },
})

export default class CaseNewList extends Vue {

    columns:any = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            align: 'center',
            width: 50,
            customRender: (text,record,index) => `${index+1}`,
        },
        {
            title: '名称',
            dataIndex: 'fileName',
            key: 'fileName',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: { customRender: 'action' },
            width: 70,
        }
    ]

    treeData: any = [];

    @Prop() obj: any;

    @Watch('obj',{ deep: true, immediate: true })
    onChangeMessage(newVal:any){
        if(newVal && newVal['content'] && newVal['content'].length > 0){
            this.treeData = newVal['content'];
        }else{
            this.treeData = [];
        }
    }

    async download(item:any){
        console.log(item)
        let option = qs.stringify({
          "id": item['id']
        })
 
        
        let res:any = await api.fileDownload(option);

        let blob = new Blob([res], { type: "application/docx" });

        let objectUrl = ((window as any).URL || (window as any).webkitURL).createObjectURL(blob);
        let downFile = document.createElement("a");
        let fileName = item['fileName'];
        downFile.style.display = "none";
        downFile.href = objectUrl;
        downFile.download = fileName;
        document.body.appendChild(downFile);
        downFile.click();
        document.body.removeChild(downFile); 
        window.URL.revokeObjectURL(objectUrl);
    }
    
}
</script>
<style lang="less" scoped>
div {
    /deep/ .ant-table-thead > tr > th, /deep/ .ant-table-tbody > tr > td {
        padding: 8px 7px;
    }
    .action i {
        margin-left: 5px;
        margin-right: 5px;
        cursor: pointer;
    }
}
</style>
