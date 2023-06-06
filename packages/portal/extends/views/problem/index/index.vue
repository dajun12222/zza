<template>
<div class="regulation">
    <div class="left">
        <question-type @select="select" />
        <problem-type @select="select" />
    </div>
    <div class="center"></div>
    <div class="right">
        <a-row class="header">
            <a-col :span="4">
                <a-cascader
                    placeholder="请选择问题标签"
                    class="role-tree"
                    :value="cascaderVal"
                    :options="cascaderData"
                    :fieldNames="fieldNames"
                    @change="cascaderChange"
                />
            </a-col>
            <a-col :span="2" />
            <a-col :span="10">
                <a-input v-model="searchVal" autocomplete="off" style="width: 100%;" allowClear placeholder="请输入关键词" />
            </a-col>
            <a-col :span="2">
                <a-button type="primary" style="width: 100%;" @click="search">检索</a-button>
            </a-col>
            <a-col :span="24" style="margin-top: 10px;">
                检索条件：<a-tag v-for="(item) in tabs" :key="item.type" color="#108ee9" closable @close="close(item)">
                    {{ item.title }} ： {{ item.name }}
                </a-tag>
            </a-col>
        </a-row>
        <div class="content">
            <a-tabs v-model="activeKey">
                <a-tab-pane v-for="(item) in activeKeyList" :key="item.id" :tab="item.name">
                    <newList :dataContent="dataContent" />
                </a-tab-pane>
            </a-tabs>
            
            <a-page :obj="dataContent" style="margin-top: 12px;display: flex;justify-content: flex-end;" @searchPage="searchPage" />
        </div>
        
    </div>
    
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import questionType from "@/../extends/components/support/questionType.vue";
import problemType from "@/../extends/components/support/problemType.vue";
import newList from "@/../extends/views/problem/components/newList.vue";
import page from '@/../extends/components/static/page.vue';
import { Row,Col,Select,Input,Button,Tag,Tabs,Cascader } from "@h3/antd-vue";

import api  from '@/../extends/api';
const qs = require('qs');
@Component({
    name: 'problemIndex',
    components: {
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
    AInput: Input,
    AButton: Button,
    ATag: Tag,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    ACascader: Cascader,
    questionType,
    problemType,
    newList,
    APage:page,
    },
})
export default class problemIndex extends Vue {

    cascaderVal:any = [];

    cascaderData:any = [];

    fieldNames:any = {
        label: 'tagsName', 
        value: 'id', 
        children: 'children'
    };

    tabs:any = [];
    

    searchVal:any = '';

    dataContent: any  =  {};

    activeKey:any = '';

    @Watch('activeKey', { deep: true, immediate: true })
    onChangeActiveKey(newVal:any){
        //获取列表
        this.search();
    }

    activeKeyList:any = [
        {
            id: '',
            name: '全部'
        },
        {
            id: 1,
            name: '基础问题库'
        },
        {
            id: 2,
            name: '本地问题库'
        },
        {
            id: 3,
            name: '新增问题库'
        },
    ];

    created(){
        //获取列表
        this.search();
        //获取问题tree
        this.getTree();
    }

    async getTree(){
        const res:any = await api.tagsTreeQuery();
        //cascaderData
        if(res.code === '00000'){
            this.cascaderData = this.setUn(res.data);
        }else{
            this.cascaderData = [];
        }
    }

    setUn(data:any){
        data.map((item:any) => {
            if(item && item.children && item.children.length > 0){
                item.children = this.setUn(item.children);
            }else{
                item.children = [];
            }
        })
        return data;
    }

    search(){
        
        this.getList({
            page: "1",
            size: "10",
        });
    }

    async getList(queryPage){
        let maps:any = {};
        maps['questionName'] = this.searchVal;
        
        if(this.cascaderVal && this.cascaderVal.length > 0){
            let result:any = [];
            let obj:any = {};
            const data:any = this.allGroup(this.cascaderData);
            this.cascaderVal.map((item:any) => {
                obj = data.find((c:any) => {
                    return item === c['id'];
                })
                result.push(obj['tagsName']);
            })
            maps['questionTags'] = result;
        }else{
            maps['questionTags'] = [];
        }

        
        maps['source'] = this.activeKey;
        this.tabs.map((item) => {
            if(item && item['dictionaryIds']){
                maps[item['type']] = item['dictionaryIds'];
            }else{
                maps[item['type']] = [item['dictionaryId']];
            }
            
        })
        let queryPageStringify = qs.stringify(queryPage)
        const res:any = await api.queryQuestion(maps,queryPageStringify);
        if(res.code === '00000'){
            let option = res.data;
            option['total'] = Number(option['total']);
            this.dataContent = res.data;
        }else{
            this.dataContent = {};
        }
    }

    close(selectedKeys){
        let index = this.tabs.findIndex((item) => {
            return item['type'] === selectedKeys['type'];
        });
        if(index > -1){
            this.tabs.splice(index,1);
        }
        this.getList({
            page: "1",
            size: "10",
        });
    }

    select(selectedKeys){
        if(selectedKeys && selectedKeys['type'] === 'typeList'){
            selectedKeys['type'] = 'auditType';
        }
        if(!this.tabs){
            this.tabs.push(selectedKeys);
            return;
        }
        let index = this.tabs.findIndex((item) => {
            return item['type'] === selectedKeys['type'];
        });
        if(index > -1){
            this.tabs.splice(index,1,selectedKeys);
        }else{
            this.tabs.push(selectedKeys);
        }
        this.search();
    }

    searchPage(option:any){
        this.getList(option);
    }

    cascaderChange(value){
        
        this.cascaderVal = value;
        //获取列表
        this.search();
        
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
.regulation {
height: 100%;
padding: 12px;
display:grid;
grid-template-columns:300px 12px 1fr;
overflow-y: auto;
.left {
    padding: 12px;
    background-color: #fff;
    
}
.right {
    .header {
        padding: 24px;
        background-color: #fff;
    }
    .content {
        margin-top: 12px;
        padding: 24px;
        background-color: #fff;
    }
}
}
</style>