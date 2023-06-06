<template>

<a-tree-select
    v-model="AuditTypeValue"
    style="width: 100%;"
    :treeData="AuditTypeList"
    :replaceFields="replaceFields"
    :showCheckedStrategy="SHOW_ALL"
    treeCheckable
    allowClear
    :dropdownMatchSelectWidth="true"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择审计类型"
/>

</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin,TreeSelect } from "@h3/antd-vue";
import api  from '@/../extends/api';
@Component({
    name: 'problemType',
    components: {
        ATreeSelect: TreeSelect,
    },
})
export default class problemType extends Vue {

    @Prop({}) getWorkflowCode?:string;
    //审计类别

    SHOW_ALL: any = (TreeSelect as any).SHOW_ALL;

    @Prop({}) value?:any;

    @Watch('value')
    onChangeValue(newVal:any){
        if(newVal){
            console.log(newVal)
            this.AuditTypeValue = newVal;
        }

    }

    AuditTypeValue:any = [];

    @Watch('AuditTypeValue',{ deep: true, immediate: true })
    onChangeAuditValue(newVal:any){
        this.$emit('input',newVal);
    }

    AuditTypeList:any = [];

    replaceFields: any = {
        children: "children",
        title: "name",
        key: "dictionaryId",
        value: "dictionaryId",
    };

    async getAuditTypeList(){
        //queryAuditTypeList
        switch(this.getWorkflowCode){
            case 'project_records':
                this.AuditTypeValue = ['SJLC-001-002'];
                //this.$emit('input',['SJLC-001-002']);
            break;
            case 'BudgetitemRegistration':
                this.AuditTypeValue = ['SJLC-001-001'];
                //this.$emit('input',['SJLC-001-001']);
            break;
            case 'sj0001':
                this.AuditTypeValue = ['SJLC-001-001'];
                //this.$emit('input',['SJLC-001-001']);
            break;
            default:
                this.AuditTypeValue = [];
            break;
        }
        const res:any = await api.queryAuditTypeList();
        if(res.code === '00000'){
            this.AuditTypeList = res.data
            //设置审计类型默认查询条件
           // this.AuditTypeValue = ['SJLC-001-002'];
           let dictionaryId = [];
           if(this.getWorkflowCode === 'project_records'){
                dictionaryId = this.getDictionaryId(JSON.parse(JSON.stringify(res.data)),'SJLC-001-002','dictionaryId');
                if(dictionaryId && dictionaryId.length > 0){
                    this.AuditTypeValue = dictionaryId;
                }
            }else
            if(this.getWorkflowCode === 'BudgetitemRegistration'){
                dictionaryId = this.getDictionaryId(JSON.parse(JSON.stringify(res.data)),'SJLC-001-001','dictionaryId');
                if(dictionaryId && dictionaryId.length > 0){
                    this.AuditTypeValue = dictionaryId;
                }
            }else
            if(this.getWorkflowCode === 'sj0001'){
                dictionaryId = this.getDictionaryId(JSON.parse(JSON.stringify(res.data)),'SJLC-001-001','dictionaryId');
                if(dictionaryId && dictionaryId.length > 0){
                    this.AuditTypeValue = dictionaryId;
                }
            }else
            if(this.getWorkflowCode === 'project_records_ec'){
                dictionaryId = this.getDictionaryId(JSON.parse(JSON.stringify(res.data)),'SJLC-001-003','dictionaryId');
                if(dictionaryId && dictionaryId.length > 0){
                    this.AuditTypeValue = dictionaryId;
                }
            }
        }else{
            this.AuditTypeList = [];
        }
    }

    getDictionaryId(data,name,paramsname){
        let dictionaryId:any = [];
        let result_obj = this.getChild(data,name,paramsname);
        let newData = [];
        if(result_obj && result_obj[paramsname]){
            newData = this.moreToOne([result_obj]);
        }
        newData.map((item:any) => {
            dictionaryId.push(item['dictionaryId']);
        })
        return dictionaryId;
    }

    moreToOne(arr){
        return [].concat(...arr.map(item => {
                if (item.children) {
                let arr = [].concat(item, ...this.moreToOne(item.children));
                delete item.children;
                return arr;
                }
                return [].concat(item);
            }
        ));

    }

    getChild(arr,name,paramsname){
        let result:any = {};
        arr.map((item:any) => {
            if(item[paramsname] === name){
                result = item;
            }else
            if(item['children'] && item['children'].length > 0){
                result = this.getChild(item['children'],name,paramsname);
            }
        })
        return result;
    }

    async created(){
        //审计类型查询
        this.getAuditTypeList();

    }

    close(){
        //this.$emit('input',false);
    }

}
</script>
<style lang="less" scoped>
/deep/ .ant-select-selection {
    height: 34px;
    overflow: hidden;
    align-items: inherit;
}
/deep/ .ant-select-search--inline {
        position: absolute;
    }
</style>
