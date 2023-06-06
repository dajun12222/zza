<template>

<base-tree
        :treeData="AuditTypeList"
        :replaceFields="replaceFields"
        @select="select"
       />

    </template>
    <script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { Modal,Button,Spin,Tree } from "@h3/antd-vue";
    import api  from '@/../extends/api';
    import baseTree from './baseTree.vue';
    const qs = require('qs');
    @Component({
        name: 'queryList',
        components: {
            ATree: Tree,
            baseTree,
        },
    })
    export default class queryList extends Vue {
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
            let queryPageStringify = qs.stringify({
                'typeCode': 'SJDW'
            });
            const res:any = await api.queryDepartmentList(queryPageStringify);
            if(res.code === '00000'){
                this.AuditTypeList = this.isSelect(res.data[0]['children']);
            }else{
                this.AuditTypeList = [];
            }
        }

        isSelect(data:any){

            return data;
        }

        select(option){

            option['type'] = 'queryList';
            option['title'] = '审计单位';
            this.$emit('select',option);
        }

    }
    </script>
    <style lang="less" scoped>

    </style>
