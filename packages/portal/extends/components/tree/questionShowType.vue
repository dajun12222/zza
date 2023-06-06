<template>

<a-tree-select
    v-if="AuditTypeList && AuditTypeList.length > 0"
    v-model="AuditTypeValue"
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
    placeholder="请选择问题目录"
/>
   
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin,TreeSelect } from "@h3/antd-vue";
import api  from '@/../extends/api';
@Component({
    name: 'questionShowType',
    components: {
        ATreeSelect: TreeSelect,
    },
})
export default class questionShowType extends Vue {

    @Prop({ default: true }) treeCheckable?:boolean;

    //审计类别
    
    SHOW_ALL: any = (TreeSelect as any).SHOW_ALL;
    
    SHOW_PARENT: any = (TreeSelect as any).SHOW_PARENT;

    SHOW_CHILD: any = (TreeSelect as any).SHOW_CHILD;

    
    @Prop({}) shorttext?: string[];

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
        let arr:any = [];
        if(newVal){
            arr = this.getParams(newVal);
        }
        this.$emit('getParams',arr);

        this.$emit('input',newVal);
        
    }

    @Watch('AuditTypeList',{ deep: true, immediate: true })
    onChangeAuditTypeList(newVal:any){
        debugger
        if((this.shorttext && this.shorttext.length > 0) && (newVal && newVal.length > 0)){
            let auditList:any =  this.getName(this.shorttext,newVal);
            this.$emit('input',auditList['id']);
        }
       
    }

    AuditTypeList:any = [];

    replaceFields: any = {
        children: "children",
        title: "name",
        key: "id",
        value: "id",
    };

    getName(shorttext:any,auditTypeList:any){
        console.log(shorttext);
        console.log(auditTypeList);
        function getChild(shorttext:any,auditTypeList:any,num:number){
            let firstData:any = {};
            if(shorttext[num]){
                firstData = auditTypeList.find((item:any) => {
                    return item['name'] === shorttext[num];
                });
                if(firstData && firstData.children && firstData.children.length > 0){
                    firstData = getChild(shorttext,firstData.children,num+1);
                }
            }else{
                firstData = getChild(shorttext,auditTypeList,num+1);
            }
            return firstData;
        }
        return getChild(shorttext,auditTypeList,0) || {};
    }


    getParams(id:string){
        debugger
        let allArray:any = this.allGroup(JSON.parse(JSON.stringify(this.AuditTypeList)));
        let arr:any = this.allParent(id,allArray);
        console.log('arr',arr);
        
        return arr || [];
    }

    allParent(id:string,allArray:any){

        function getAllParent(id:string,allArray:any,att:any = []){
            debugger
            if(id && (allArray && allArray.length > 0)){
                let currentObj:any = allArray.find((item:any) => {
                    return item['id'] === id;
                });
                
                if(currentObj){
                    att.push(currentObj);
                    if(currentObj['pid'] !== 'SJWT'){
                        getAllParent(currentObj['pid'],allArray,att);
                    }
                }
            }
            return att;
        }
        return getAllParent(id,allArray,[]) || [];
    }
    
    flatten(arr){
        return arr.reduce(
            (acc,val) => acc.concat(Array.isArray(val.children)? this.flatten(val.children):val),[]);
        
    }



    async queryQuestionTypeList(){
        //queryAuditTypeList
        const res:any = await api.queryQuestionTypeList();
        if(res.errmsg === 'success'){
            this.AuditTypeList = res.data
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