<template>
<a-tree-select
    v-model="selectTreeData"
    style="width: 100%;"
    :treeData="AuditTypeList"
    :replaceFields="replaceFields"
    :showCheckedStrategy="SHOW_ALL"
    allowClear
    :dropdownMatchSelectWidth="true"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择模版分类"
    @select="select"
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


    @Prop({ default: false }) isReturnName?:boolean;

    @Prop({}) value?:any;

    @Watch('value', { deep: true, immediate: true })
    onChangeCode(newVal:any){
        // this.getAuditTypeList();
        this.selectTreeData = newVal
        // this.select(newVal)
    }

    @Prop({}) AuditList?:any;

    @Watch('AuditList', { deep: true, immediate: true })
    onChangeAuditList(newVal:any){
        // this.getAuditTypeList();
        this.AuditTypeList = newVal
        if (newVal.length > 0) {
            this.select(this.selectTreeData)
        }
    }

    @Prop({ default: '' }) schemaCode?:string;

    @Prop({ default: '' }) selectName?:string;

    @Prop({}) getWorkflowCode?:string;
    //审计类别

    SHOW_ALL: any = (TreeSelect as any).SHOW_CHILD;

    selectTreeData: string | null = null;
   
    AuditTypeList:any = [];

    replaceFields: any = {
        children: "children",
        title: "name",
        key: "id",
        value: "id",
    };

    select(selectedKeys) {    
        let id = this.replaceFields['value'];
        let AuditList = this.allGroup(
        JSON.parse(JSON.stringify(this.AuditList)),
        );
        let result: any = AuditList.find((item: any) => {
            return item[id] === selectedKeys;
        });
        console.log(result);
        
        let result_arr = this.allGroup([result]);
        let result_att: any = [];
        result_arr.map((item) => {
            result_att.push(item[id]);
        });
        let option = {
            type: 'templateType',
            name: result['name'],
            id: result[id],
            ids: result_att,
        };
        this.$emit('select', option);
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
