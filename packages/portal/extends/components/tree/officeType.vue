<template>
<a-tree-select 
    v-model="DeptValue"
    style="width: 100%;"
    :treeData="officeList"
    :replaceFields="replaceFields"
    :showCheckedStrategy="SHOW_ALL"
    treeCheckable
    allowClear
    :dropdownMatchSelectWidth="true"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择审计模板类型"
/>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin,TreeSelect } from "@h3/antd-vue";
import api  from '@/../extends/api';
@Component({
    name: 'officeType',
    components: {
        ATreeSelect: TreeSelect,
    },
})
export default class officeType extends Vue {
    //审计类别
    SHOW_ALL: any = (TreeSelect as any).SHOW_ALL;
    
    @Prop({}) value?:any;

    @Watch('value')
    onChangeValue(newVal:any){
        if(newVal){
            this.DeptValue = newVal;
        }
        
    }

    DeptValue:any = [];

    @Watch('DeptValue',{ deep: true, immediate: true })
    onChangeAuditValue(newVal:any){
        this.$emit('input',newVal);
    }

    replaceFields: any = {
        children: "children",
        title: "name",
        key: "dictionaryId",
        value: "dictionaryId",
    };

    //文书模板类型
    officeList:any = [];

    async getOfficeTemplateList(){
        const res:any = await api.queryDocumentTemplateTypeList();
        if(res.code === '00000'){
            this.officeList = res.data
        }else{
            this.officeList = [];
        }
    }

    async created(){
        //审计类型查询
        this.getOfficeTemplateList();
       
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