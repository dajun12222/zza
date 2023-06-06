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
        name: 'caseType',
        components: {
            ATree: Tree,
            baseTree,
        },
    })
    export default class caseType extends Vue {
        //审计类别
       
    
        
    
        AuditTypeValue:any = [];
    
        AuditTypeList:any = [];
    
        replaceFields: any = {
            children: "children",
            title: "name",
            key: "id",
            value: "id",
        };
    
    
        created(){
            //案例分类目录树
           this.getList();
           
        }

        async getList(){
            const res:any = await api.queryCaseDirectory();
            if(res.errmsg === 'success'){
                this.AuditTypeList = this.isSelect(res.data);
            }else{
                this.AuditTypeList = [];
            }
        }
        
        isSelect(data:any){
            //selectable
            // data.map((item:any) => {
            //     if(item && item.children && item.children.length > 0){
            //         item['selectable'] = false;
            //         item.children = this.isSelect(item.children);
            //     }
            // })
            return data;
        }
        
        select(option){
            option['type'] = 'caseDirectoryId';
            option['title'] = '案例分类';
            this.$emit('select',option);
        }
    }
    </script>
    <style lang="less" scoped>
   
    </style>