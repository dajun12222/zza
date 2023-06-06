<template>
    <div class="aduitfiles">
        <div class="left">
            <h4>
                <span>阈值列表</span>
                <a-button type="primary" size="small" @click="add">新增</a-button>
            </h4>
             <a-spin :spinning="dataSpinning">
                <newList 
                    :dataContent="dataContent" 
                    @edit="edit" 
                    @del="del" 
                    @customRowClick="customRowClick"
                />
             </a-spin>
        </div>
        <div></div>
        <div class="right">
            <h4>
                <span>阈值条件</span>
                <a-button v-if="thresholdID" type="primary" size="small" @click="addThreshold">新增</a-button>
            </h4>
            <a-spin :spinning="spinning">
                <thresholdNewListRight :dataContent="dataThreshold" @edit="editRight" />
            </a-spin>
        </div>
        <threshold-list v-model="thresholdListVal" :info="thresholdInfo" /> 
        <threshold-list-right v-model="thresholdListRightVal" :thresholdID="thresholdID" :info="thresholdRightInfo" :isEdit="isEdit" />
    </div>
    </template>
    <script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import newList from "@/../extends/views/dataBatch/components/thresholdNewList.vue";
    import thresholdNewListRight from "@/../extends/views/dataBatch/components/thresholdNewListRight.vue";
    import page from '@/../extends/components/static/page.vue';
    import thresholdList from './threshold/list.vue';
    import thresholdListRight from './threshold/listRight.vue';
    import { Row,Col,Select,Input,Button,Tag,Tabs,Cascader,Form,Spin } from "@h3/antd-vue";
    
    import api  from '@/../extends/api';
    const qs = require('qs');
    @Component({
        name: 'thresholdIndex',
        components: {
            ARow: Row,
            ACol: Col,
            ASpin:Spin,
            ASelect: Select,
            ASelectOption: Select.Option,
            AInput: Input,
            AButton: Button,
            ATag: Tag,
            ATabs: Tabs,
            ATabPane: Tabs.TabPane,
            ACascader: Cascader,
            AForm: Form,
            AFormItem: Form.Item,
            newList,
            thresholdNewListRight,
            APage:page,
            thresholdList,
            thresholdListRight,
        },
    })
    export default class thresholdIndex extends Vue {
    
    
    
        dataContent: any  =  {};
    
        thresholdListVal:boolean = false;

        thresholdInfo:any = {};

        spinning:boolean = false;

        dataSpinning:boolean = false;
    
        created(){
            //获取列表
            this.getList();
        }
    
        
        
    
        async getList(){
            this.dataSpinning = true;
            let queryPageStringify = qs.stringify({
                'batchCode': this.$route.query.batchCode || ''
            })
            const res:any = await api.queryDataThreshold(queryPageStringify);
            this.dataSpinning = false;
            if(res.code === '00000'){
                let option = res.data;
                this.dataContent = {
                    'content': option
                };
            }else{
                this.dataContent = {};
            }
        }

        add(){
            this.thresholdInfo = {};
            this.thresholdListVal = true;
        }

        edit(item:any){
            this.thresholdInfo = JSON.parse(JSON.stringify(item));
            this.thresholdListVal = true;
        }

        del(item:any){
            const vm: any = this;
            this.$confirm({
                title: `是否确定删除么？`,
                okText: vm.$t('cloudpivot.flowCenter.pc.ok').toString(),
                cancelText: vm.$t('cloudpivot.flowCenter.pc.cancel').toString(),
                onOk() {    
                    vm.delOne(item);
                },
            });
        }

        async delOne(item:any){
            let queryPageStringify = qs.stringify({
                'id': item.id || ''
            })
            const res:any = await api.deleteDataThreshold(queryPageStringify);
            if(res.code === '00000'){
                this.getList();
            }else{
                this.dataContent = {};
            }
        }

        dataThreshold:any = {};
        
        thresholdID:string = '';

        thresholdRightInfo:any = {};

        isEdit:boolean = false;

        thresholdListRightVal:boolean = false;

        addThreshold(){
            this.isEdit = false;
            this.thresholdRightInfo = {};
            this.thresholdListRightVal = true;
        }

        editRight(item:any){
            this.isEdit = true;
            this.thresholdRightInfo = item;
            this.thresholdListRightVal = true;
        }

        customRowClick(item:any){
            this.thresholdID = item.id;
            this.getQueryDataThresholdConditions(item.id);
        }

        async getQueryDataThresholdConditions(thresholdId:string){
            this.spinning=true;
            let queryPageStringify = qs.stringify({
                'thresholdId': thresholdId || ''
            })
            const res:any = await api.queryDataThresholdConditions(queryPageStringify);
            this.spinning=false;
            if(res.code === '00000'){
                let option = res.data;
                this.dataThreshold = {
                    'content': option
                };
            }else{
                this.dataThreshold = {};
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
    }
    </script>
    <style lang="less" scoped>
    .aduitfiles {
        display: grid;
        grid-template-columns: 49% 2% 49%;
        height: 100%;
        padding: 12px;
        overflow-y: auto;
        h4 {
            font-size: 14px;
            margin-bottom: 14px;
            display: flex;
            justify-content: space-between;
        }
        .left {
            padding: 12px;
            background-color: #fff;
            
        }
        .right {
            
            padding: 12px;
            background-color: #fff;
        }
    }
    </style>