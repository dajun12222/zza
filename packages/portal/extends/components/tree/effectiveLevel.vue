<template>
        <div>
            <a-tree-select 
                v-if="category === '全部'"
                style="width: 100%;"
                :treeData="PotencyList"
                :replaceFields="replaceFields"
                :showCheckedStrategy="SHOW_ALL"
                allowClear
                :dropdownMatchSelectWidth="true"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择效力级别"
                @select="select"
            /> 
            <a-tree-select 
                v-if="category === '中央法规'"
                style="width: 100%;"
                :treeData="CentralTypeList"
                :replaceFields="replaceFields"
                allowClear
                :dropdownMatchSelectWidth="true"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择效力级别"
                @select="select"
            />    
            <a-tree-select 
                v-if="category === '地方法规'"
                style="width: 100%;"
                :treeData="LocalTypeList"
                :replaceFields="replaceFields"
                allowClear
                :dropdownMatchSelectWidth="true"
                :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                placeholder="请选择效力级别"
                @select="select"
            />    
    </div>
   
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Modal,Button,Spin,TreeSelect } from "@h3/antd-vue";
import api  from '@/../extends/api';
@Component({
    name: 'effectiveLevel',
    components: {
        ATreeSelect: TreeSelect,
    },
})
export default class effectiveLevel extends Vue {
    //审计类别
    SHOW_ALL: any = (TreeSelect as any).SHOW_ALL;
    
    @Prop({}) value?:any;

    @Prop({}) category?:any;

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
        key: "id",
        value: "id",
    };

    PotencyList:any = [];

    CentralTypeList: any = [];

    LocalTypeList: any = [];

    async getPotencyList(){
        const res:any = await api.queryPotencyList();
        if (res.errmsg === 'success') {
            const _data = res.data;
            this.PotencyList = _data;
            //处理中央法规
            if (Array.isArray(_data[0]?.children)) {
                const central = _data[0].children[0].children;
                this.CentralTypeList = [{ id: _data[0].id, name: _data[0].name,treelevel: _data[0].treelevel, children: central }];
            } else {
                this.CentralTypeList = [];
            }
            // 处理地方法规类型数据
            if (Array.isArray(_data[0]?.children)) {
                const local = _data[0].children[1].children
                this.LocalTypeList = [{ id: _data[0].id, name: _data[0].name,treelevel: _data[0].treelevel, children: local }];
            } else {
                this.LocalTypeList = [];
            }  
        } else {
            this.PotencyList = [];
            this.CentralTypeList = [];
            this.LocalTypeList = [];
        }
    }

    async created(){
        //审计类型查询
        this.getPotencyList();
       
    }

    close(){
        //this.$emit('input',false);
    }

    select(selectedKeys) {    
        let id = this.replaceFields['value'];
        let AuditTypeList = this.allGroup(
        JSON.parse(JSON.stringify(this.PotencyList)),
        );
        let result: any = AuditTypeList.find((item: any) => {
            return item[id] === selectedKeys;
        });
        // this.treelevel = result.treelevel;
        let option = {
            type: 'potencyList',
            name: result['name'],
            id: result[id],
            ids: result.treelevel,
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