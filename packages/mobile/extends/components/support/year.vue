<template>

<base-tree
        :treeData="AuditTypeList"
        @select="select"
       />
       
    </template>
    <script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { Modal,Button,Spin,Tree } from "@h3/antd-vue";
    import api  from '@/../extends/api';
    import baseTree from './baseTree.vue';
    @Component({
        name: 'year',
        components: {
            ATree: Tree,
            baseTree,
        },
    })
    export default class year extends Vue {
        //审计类别
       
    
        
    
        AuditTypeValue:any = [];
    
        AuditTypeList:any = [];
    
        replaceFields: any = {
            children: "children",
            title: "name",
            key: "dictionaryId",
            value: "dictionaryId",
        };
    
       
    
    
    
      
    
        created(){
            //审计问题类型查询
           this.getList();
           
        }

        async getList(){
            const res:any = await api.queryYearList();
            if(res.code === '00000'){
                this.AuditTypeList = this.isSelect(res.data);
            }else{
                this.AuditTypeList = [];
            }
        }
        
        isSelect(data:any){
            
            return data;
        }
        
        select(option){
            option['type'] = 'yearList';
            option['title'] = '发布年份';
            this.$emit('select',option);
        }
    }
    </script>
    <style lang="less" scoped>
   
    </style>