<template>

<a-tree-select
    v-if="AuditTypeList && AuditTypeList.length > 0"
    v-model="AuditTypeValue"
    dropdownClassName="rangeDate"
    style="width: 100%;"
    :treeData="AuditTypeList"
    :replaceFields="replaceFields"
    :showCheckedStrategy="SHOW_ALL"
    :disabled="disabled"
    :treeCheckable="treeCheckable ? true : false"
    allowClear
    :treeCheckStrictly="treeCheck === 3 ? true : false"
    :dropdownMatchSelectWidth="true"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="目录分类"
/>
   
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin,TreeSelect } from "@h3/antd-vue";
import api  from '@/../extends/api';
@Component({
    name: 'questionType',
    components: {
        ATreeSelect: TreeSelect,
    },
})
export default class questionType extends Vue {

    @Prop({ default: true }) treeCheckable?:boolean;

    //审计类别
    
    SHOW_ALL: any = (TreeSelect as any).SHOW_ALL;
    
    SHOW_PARENT: any = (TreeSelect as any).SHOW_PARENT;

    SHOW_CHILD: any = (TreeSelect as any).SHOW_CHILD;

    @Prop({ default: 1 })  treeCheck?: number;

    @Watch('SHOW_VALUE',{ deep: true, immediate: true })
    onChangeSHOWVALUE(newVal:any){
        console.log('start....SHOW_VALUE...');
        console.log(newVal);
    }

    @Prop({ default:false }) disabled?:boolean;
    
    @Prop({}) value?:any;

    @Watch('value',{ deep: true, immediate: true })
    onChangeValue(newVal:any){
        if(newVal && newVal.length > 0){
            this.AuditTypeValue = newVal;
        }
        
    }
    
    AuditTypeValue:any = [];

    @Watch('AuditTypeValue',{ deep: true, immediate: true })
    onChangeAuditValue(newVal:any,oldVal:any){
        console.log(newVal);
        if(!newVal){
            return;
        }
        if(this.treeCheckable){
            if((JSON.parse(JSON.stringify(newVal)).sort().toString()) === (oldVal && JSON.parse(JSON.stringify(oldVal)).sort().toString())){
            
            }else{
                this.$emit('input',JSON.parse(JSON.stringify(newVal)));
                this.getName();
            }
        }else{
            this.$emit('input',newVal);
        }

        
        
    }

    @Watch('AuditTypeList',{ deep: true, immediate: true })
    onChangeAuditTypeList(newVal:any){
     
        if(newVal && newVal.length > 0){
            this.getName();
        }
       
    }

    AuditTypeList:any = [];

    replaceFields: any = {
        children: "children",
        title: "name",
        key: "dictionaryId",
        value: "dictionaryId",
    };

    getName(){
        if((this.AuditTypeValue && this.AuditTypeValue.length > 0) && (this.AuditTypeList && this.AuditTypeList.length > 0)){
            let att = this.flatten(this.AuditTypeList);
            let arr:any = [];
            let obj:any = {};
            if(this.treeCheck === 3){
                let AuditTypeValue = JSON.parse(JSON.stringify(this.AuditTypeValue));
                let AuditTypeLabel:any = [];
                AuditTypeValue.map((item:any) => {
                    AuditTypeLabel.push(item['label']);
                })
                this.$emit('getName',AuditTypeLabel.join(','));
            }
         
          
 
        } 
    }
    
    flatten(arr){
        return arr.reduce(
            (acc,val) => acc.concat(Array.isArray(val.children)? this.flatten(val.children):val),[]);
        
    }



    async queryQuestionTypeList(){
        //queryAuditTypeList
        const res:any = await api.queryQuestionTypeList();
        if(res.code === '00000'){
            this.AuditTypeList = res.data[0]['children']
        }else{
            this.AuditTypeList = [];
        }   
    }

    async created(){
        //审计问题类型查询
        this.queryQuestionTypeList();
       
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