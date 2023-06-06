<template>
<div>
    <elTable :columns="columns" :download="true" :dataContent="dataContent" @goDetail="goDetail" @download="download" />
    <el-modal v-model="showModel" :modalData="modalData" />
</div>

</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row,Col,Button,Table } from "@h3/antd-vue";
import elTable from "@/../extends/components/table/table.vue";
import elModal from "@/../extends/components/form/modal.vue";
import api  from '@/../extends/api';
const qs = require('qs');
@Component({
    name: 'newList',
    components: {
        ATable: Table,
        elTable,
        elModal
    },
})
export default class newList extends Vue {

    showModel:boolean = false;

    modalData:any = [];

    columns:any = [
        // {
        //     title: '序号',
        //     dataIndex: 'index',
        //     key: 'index',
        //     align: 'center',
        //     width: 50,
        //     customRender: (text,record,index) => `${index+1}`,
        // },
        {
            title: '模版编号',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '模版名称',
            dataIndex: 'templateName',
            key: 'templateName',
        },
        {
            title: '模板类型',
            dataIndex: 'templateType',
            key: 'templateType',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: { customRender: 'action' },
            width: 70,
        }
    ]


    @Prop({}) dataContent?:any;

    async goDetail(item:any){
        //modalData
        let option = qs.stringify({
          "id": item['id']
        })
        const  res:any = await api.queryDocumentTemplateDetails(option);
        if(res.errmsg === 'success'){
            let maps = res.data;
            let modalData = this.serialization(maps);
            this.modalData = modalData;
            this.showModel = true;
        }else{
            this.modalData = {};
        }

    }

    async download(item:any){

        let option = qs.stringify({
          "templateId": item['id']
        })


        let res:any = await api.downLoadTemplate(option);

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

    serialization(data:any){
        let option:any = [];
        let att:any = [];
        let mapping = this.mapping();
        for(let i in mapping){
            let obj = {
                'name': mapping[i],
                'con': data[i],
                'cols': '',
            }
            att.push(obj);
            if(att && att.length === 3){
                option.push(att);
                att = [];
            }
        }
        if(att.length !== 0){
            option.push(att);
        }
        return option;
    }

    mapping(){
        return {
            'id': '数据ID',
            'templateName': '模板名称',
            'templateType': '模板类型',
            'objectId': '对象ID',
            'subjectCode': '主题库标识',
            'remark': '模版描述',
            'tags': '标签',
            'fileName': '文件名称',
            'updateTime': '修改时间',
        }
    }

}
</script>
<style lang="less" scoped>

</style>
