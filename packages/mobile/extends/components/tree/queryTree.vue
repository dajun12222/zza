<template>
<a-tree-select
    v-model="AuditTypeValue"
    style="width: 100%;"
    :treeData="AuditTypeList"
    :replaceFields="replaceFields"
    :showCheckedStrategy="SHOW_ALL"
    :treeCheckable="treeCheckable ? true : false"
    allowClear
    :dropdownMatchSelectWidth="true"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto',fontSize: '10px' }"
    placeholder="请选择审计类型"
/>

</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin,TreeSelect } from "@h3/antd-vue";
import api  from '@/../extends/api';
@Component({
    name: 'queryTree',
    components: {
        ATreeSelect: TreeSelect,
    },
})
export default class queryTree extends Vue {

    @Prop({ default: false }) treeCheckable?:boolean;

    @Prop({ default: false }) isReturnName?:boolean;

    @Prop({ default: 'SJWT-001' }) code?:string;

    @Prop({ default: '' }) selectName?:string;

    @Prop({}) getWorkflowCode?:string;
    //审计类别

    SHOW_ALL: any = (TreeSelect as any).SHOW_CHILD;

    @Prop({}) value?:any;

    @Watch('value')
    onChangeValue(newVal:any){
        if(newVal){
            this.AuditTypeValue = newVal;
        }

    }

    AuditTypeValue:any = [];

    @Watch('AuditTypeValue',{ deep: true, immediate: true })
    onChangeAuditValue(newVal:any){

        // let dictionaryId = [];
        // newVal.map((c:any) => {
        //     allData.map((item:any) => {
        //         if(item['name'] === c){
        //             dictionaryId.push(item['dictionaryId']);
        //         }
        //     })
        // })
        if(this.isReturnName){
            let allData:any = this.allGroup(JSON.parse(JSON.stringify(this.AuditTypeList)));
            let obj:any = allData.find((item:any) => {
                return item['dictionaryId'] === newVal;
            })
            this.$emit('changeObj',obj);
        }

        this.$emit('changeDictionaryId',newVal);
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

        const res:any = await api.query_tree(this.code ? this.code : 'SJWT-001',true);
        if(res.code === '00000'){
            if(this.selectName && res.data.length > 0){
                let option:any = this.moreToOne(JSON.parse(JSON.stringify(res.data)));
                let obj:any = option.find((item:any) => {
                    return item['name'] === this.selectName;
                })
                // console.log(this.selectName);
                // console.log(option);
                if(obj && obj['dictionaryId']){
                    this.$emit('input',[obj['dictionaryId']]);
                }

            }
            this.AuditTypeList = res.data

        }else{
            this.AuditTypeList = [];
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

    async mounted(){
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
