<template>
    <div class="aduitfiles">
        <div class="left">
            <h4>
                <span>数据分析</span>
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
                <span>数据分析条件</span>
                <a-button v-if="thresholdID" type="primary" size="small" @click="addThreshold">新增</a-button>
            </h4>
            <a-spin :spinning="spinning">
                <analyseNewRightList :dataContent="dataThreshold" @edit="editRight" />
            </a-spin>
        </div>
        <analyse-list v-model="thresholdListVal" :info="thresholdInfo" /> 
        <!-- <analyse-list-right v-model="thresholdListRightVal" :thresholdID="thresholdID" :info="thresholdRightInfo" :isEdit="isEdit" /> -->
    </div>
</template>
    <script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import newList from "@/../extends/views/dataBatch/components/analyseNewList.vue";
    import analyseNewRightList from "@/../extends/views/dataBatch/components/analyseNewRightList.vue";
    import page from '@/../extends/components/static/page.vue';
    import analyseList from './analyse/list.vue';
    import analyse from './analyse/listRight.vue';
    import { Row,Col,Select,Input,Button,Tag,Tabs,Cascader,Form,Spin } from "@h3/antd-vue";
    
    import api from '@/../extends/api';
    const qs = require('qs');
    @Component({
        name: 'analyseIndex',
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
            analyseNewRightList,
            APage:page,
            analyseList,
            analyse,
        },
    })
    export default class analyseIndex extends Vue {
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
            const res:any = await api.analysisQuery(queryPageStringify);
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
            this.$emit('del',item);
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
            this.getQueryConditionById(item.id);
        }

        async getQueryConditionById(id:string){
            this.spinning=true;
            let queryPageStringify = qs.stringify({
                'id': id || ''
            })
            const res:any = await api.queryConditionById(queryPageStringify);
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