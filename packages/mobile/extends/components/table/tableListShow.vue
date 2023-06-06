<template>
    <div class="elTable">
        <div class="elTableHeader">
            <elShowStyle @refer="refer" />
            <elDensity @density="density" />
            <elColumnSetting :columns="columns" @columnSetting="columnSetting" />
        </div>
        <a-table 
            v-if="defaultExpandAllRows ? dataContent && dataContent.content && dataContent.content.length > 0 : true" 
            :columns="defaultColumns" 
            :data-source="dataContent.content" 
            :defaultExpandAllRows="defaultExpandAllRows"
            :scroll="{ y: '100%' }" 
            bordered 
            
            :pagination="false"
            :size="size"
            :rowClassName="tableRowClassName"
            :rowKey="(record,index) => { return record.id }" :customRow="customRowClick"
        >
            
            <div
                slot="action"
                slot-scope="text,record"
            >
                <span class="action">
                    <a v-if="detail" @click="goDetail(record)">详情</a>
                    <a v-if="download" @click="downloadFile(record)">下载</a>
                </span>
            </div>
            <div
                slot="actionDataBatch"
                slot-scope="text,record"
            >
                <span class="actionDataBatch">
                    <a @click="goDetail(record)">详情</a>
                    <a @click="threshold(record)">阈值设置</a>
                    <a @click="goAnalyse(record)">分析规则</a>
                    <a @click="execute(record)">执行</a>
                    <a @click="executionResult(record)">执行结果</a>
                    <a @click="del(record)">删除</a>
                </span>
            </div>
            <div
                slot="aTooltip"
                slot-scope="text"
                class="aTooltip"
            >
                <a-tooltip :overlayStyle="{maxWidth: '300px'}">
                    <template #title>{{ text }}</template>
                    {{ text }}
                </a-tooltip>
            </div>
            <div
                slot="copy"
                slot-scope="text,record"
                class="aCopy"
            >
                <a-tooltip :overlayStyle="{maxWidth: '300px'}">
                        <template #title>{{ text }}</template>
                    {{ text }}
                </a-tooltip>
                <i class="icon aufontAll h-icon-all-file-copy copy" @click="copy(text,record)"></i>
            </div>
        </a-table>
    </div>
    
    </div>
    </template>
    <script lang="ts">
    import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
    import { Row,Col,Button,Table,Tooltip } from "@h3/antd-vue";
    import elShowStyle from './listShow/showStyle.vue';
    import elDensity from './listShow/density.vue';
    import elColumnSetting from './listShow/columnSetting.vue';
    @Component({
        name: 'elTable',
        components: {
            ATable: Table,
            ATooltip: Tooltip,
            elShowStyle,
            elDensity,
            elColumnSetting
        },
    })
    export default class elTable extends Vue {
  
        selectIndex:number = 0;

        selectData:any = {}; 

        size:string = 'default';

        defaultColumns:any = [];
        
        @Prop({ default: true }) detail?:boolean;

        @Prop({ default: false }) download?:boolean;
        
        @Prop({ default: false }) defaultExpandAllRows?:boolean;

        

        @Prop({}) columns?:any;

        @Watch('columns',{ deep: true, immediate: true })
        onChangeColumns(newVal:any){
            if(newVal && newVal.length > 0){
                this.defaultColumns = newVal;
            }else{
                this.defaultColumns = [];
            }
        }

        @Prop({}) dataContent?:any;

       


        refer(){
            this.$emit('refer');
        }
    
        goDetail(item:any){
            this.$emit('goDetail',item);
        }

        downloadFile(item:any){
            this.$emit('download',item);
        }

        customRowClick(record,index){
            return {
                on: {
                    click: () => {
                        this.selectData = record;
                        this.$emit('customRowClick',record);
                    },
                },
            };
            
        }

        tableRowClassName(row,rowIndex){
            if(this.defaultExpandAllRows && (this.selectData.id === (row && row.id))){
                return 'isActive';
            }
            
        }

        density(size:string){
            this.size = size;
        }
        
        columnSetting(dataColumns:any){
            this.defaultColumns = dataColumns;
        }

        copy(text:string,record:any){
            const oInput:any = document.createElement('input');
            oInput.value = text;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = 'oInput';
            oInput.style.display='none';
            oInput.remove();
            this.$message.success('已复制至系统剪切板');
        }

        threshold(item:any){
            this.$emit('threshold',item);
        }

        execute(item:any){
            this.$emit('execute',item);
        }

        executionResult(item:any){
            this.$emit('executionResult',item);
        }

        goAnalyse(item:any){
            this.$emit('goAnalyse',item);
        }

        del(item:any){
            this.$emit('del',item);
        }
    }
    </script>
    <style lang="less" scoped>
    /deep/ .ant-table-thead > tr > th, /deep/ .ant-table-tbody > tr > td {
        padding: 8px;
    }
    .aTooltip,.aCopy {
        span {
            display: inline-block;
            max-width: 100%;
            white-space:nowrap; 
            overflow:hidden; 
            text-overflow:ellipsis;

        }
    }
    .aCopy span{
        max-width: 80%;
    }
    .elTableHeader {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }
    .elTable /deep/ .isActive {
        background-color: #e6f7ff;
    }
    /deep/.ant-table-tbody > tr > td {
        padding:8px 4px;
    }
    .action,.actionDataBatch {
        a {
            margin: 0 4px;
        }
    }
    .copy {
        color: rgb(24, 144, 255);
        cursor: pointer;
    }
    </style>