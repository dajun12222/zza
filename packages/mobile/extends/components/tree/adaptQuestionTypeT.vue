<template>
<a-tree-select 
    v-model="PotencyValue"
    style="width: 100%;"
    :treeData="PotencyList"
    :replaceFields="replaceFields"
    treeCheckable
    treeDefaultExpandAll
    allowClear
    :dropdownMatchSelectWidth="true"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto',fontSize: '10px' }"
    dropdownClassName="rangeDate"
    placeholder="请选择业务类型"
/>    
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin,TreeSelect } from "@h3/antd-vue";
import api  from '@/../extends/api';
@Component({
    name: 'adaptQuestionTypeT',
    components: {
        ATreeSelect: TreeSelect,
    },
})
export default class adaptQuestionTypeT extends Vue {
    //审计类别
    SHOW_ALL: any = (TreeSelect as any).SHOW_ALL;
    
    @Prop({}) value?:any;

    @Watch('value')
    onChangeValue(newVal:any){
        if(newVal){
            this.PotencyValue = newVal;
        }
        
    }

    PotencyValue:any = [];

    @Watch('PotencyValue',{ deep: true, immediate: true })
    onChangeAuditValue(newVal:any){
        this.$emit('input',newVal);
    }
 
    replaceFields: any = {
        children: "children",
        title: "name",
        key: "dictionaryId",
        value: "dictionaryId",
    };

    PotencyList:any = [];

    async getPotencyList(){
        const res:any = await api.queryTypeList();
        if(res.code === '00000'){
            this.PotencyList = res.data[0]['children'];
        }else{
            this.PotencyList = [];
        } 
    }

    async created(){
        //审计类型查询 
        this.getPotencyList();
       
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
/deep/ .ant-select-tree {
  line-height: 32px;
}
</style>