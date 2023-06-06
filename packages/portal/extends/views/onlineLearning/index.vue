<template>
    <div class="studyIndex">
        <a-layout>
            <a-layout-sider style="width:215px;flex: 0 0 215px;max-width: 215px;min-width: 215px;">
                <studyMenu @tabData="onTabData" /> 
            </a-layout-sider>
            <a-layout>
                <a-layout-header>
                     <a-breadcrumb class="bread-menu" separator=">">
                        <a-breadcrumb-item v-if="tabBreadcrumb.length" style="color: var(--highlightColor, #2970FF);font-size:14px;">
                            <span style="cursor:pointer;" @click="handleSearch(-1)">全部课程</span>
                        </a-breadcrumb-item>
                        <a-breadcrumb-item v-for="(item,index) in tabBreadcrumb" :key="index" style="color: var(--highlightColor, #2970FF);font-size:14px;">
                            <a v-if="index !== tabBreadcrumb.length - 1" style="color: var(--highlightColor, #2970FF);" @click.prevent="handleSearch(index,item.title)">{{ item.title }}</a>
                            <span v-else style="cusor:defalut;">{{ item.title }}</span>
                        </a-breadcrumb-item>
                    </a-breadcrumb>
                    <div class="promotedDiv">
                        <div class="promoted-div">
                            <a-checkbox
                                v-model="checked"
                                class="onlyTj"
                                @change="handleCheck"
                            >
                                只看推荐
                            </a-checkbox>
                            <div v-for="(item,index) in sortPromotedList" :key="index" :class="sortPromoted === index ? 'promoted active' : 'promoted'" @click="handlePromoted(index,item)">{{ item }}</div>
                        </div>
                        <div>
                            <a-input-search
                                placeholder="当前目录下搜索知识"
                                style="width: 200px"
                                @search="onSearch"
                                @pressEnter="onPressEnter"
                            />
                        </div>
                    </div>
                </a-layout-header>
                <a-layout-content>
                    <!-- <div class="classTime">
                        <p class="mr20">
                            已获总学时：
                            <span>233分钟</span>
                        </p>
                        <p>实际学时： 
                            <span>233分钟</span>
                        </p>
                    </div> -->
                    <div class="conDiv">
                        <div class="tabDiv" :class="tabData && tabData.length > 0 ? 'tabDivBor' : ''">
                            <p v-for="item in tabData" :key="item.id" @click="tabClick(knowledgeType,item.name,item.val)">
                                <a href="javascript:;">{{ item.name }}</a>
                                <!-- <span>(2)</span> -->
                            </p>
                        </div>
                        <!-- <ul class="sortUl">
                            <li class="sortDiv" :class="{'active':index === sortActive,}" v-for='(item,index) in sortList' :key='index' @click.stop='onActive(index,$event)'>
                                <div>
                                    {{item.name}}
                                </div>
                                <span></span>
                            </li>
                        </ul> -->
                        <studyCon v-if="newList && newList.list && newList.list.length > 0" :list="newList" :localHref="localHref" />
                        <div v-else class="empty">
                            <img src="./images/search-no-data.png" alt="暂无数据" />
                            <p>暂无数据</p>
                        </div>
                    </div>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Col, Row, Layout, Menu, Input, Icon, Breadcrumb, Checkbox } from "@h3/antd-vue";
import studyMenu from './components/studyMenu.vue';
import studyCon from './components/studyContent.vue';

import api  from '@/../extends/api';
import axios from 'axios';
import Bus from 'cloudpivot/common/src/utils/bus';
const qs = require('qs');

// @@ 组件定义
@Component({
  name: 'study-template',
  components: {
        ACol: Col,
        ARow: Row,
        ALayout: Layout,
        ALayoutSider: Layout.Sider,
        ALayoutHeader: Layout.Header,
        ALayoutContent: Layout.Content,
        AMenu: Menu,
        AMenuItem: Menu.Item,
        studyMenu,
        studyCon,
        AInput: Input,
        AIcon:Icon,
        ABreadcrumb: Breadcrumb,
        ABreadcrumbItem: Breadcrumb.Item,
        ACheckbox: Checkbox,
  },
})
export default class studyTemplate extends Vue {
    @Prop() list?: any; 

    @Prop() pageVM: any; //父级组件的vue对象


    tabData:any = [];

    knowledgeType:any = ''

    sortList:any = [
        {
            name:'发布时间',
        },
        {
            name:'学习人数',
        }
    ]

    sortActive:any = ''

    dataContent:any = {};

    newList:any = []

    courseName:any = ''

    localHref:any = ''

    timer:any = ""

    tabBreadcrumb:any = []

    menuData:any;

    sortPromotedList:any = ['全部','基础','进阶','高级']

    sortPromoted:any = 0;

    courseDifficulty:any = ''

    checked:any = false;

    @Watch('list')
    onGanttPropertiesChange(list) {
        this.newList = list;
    }

    created(){
        this.localHref = window.location.href.split('application')[0];
        // Bus.$on('newLearnRate', (val: any) => {
        //     console.log(val)
        // });
        
    }

    mounted(){
        this.getList();
    }

    destoryed() {
        clearInterval(this.timer);
    }

    onTabData(data){
        this.menuData = data.menuData;
        this.tabBreadcrumb = [];
        this.tabData = data.tabData;
        this.knowledgeType = data.knowledgeType || '';
        let obj:any = data.knowledgeType.split('-');
        for(var i=0;i<obj.length;i++){
            let option = {
                title:obj[i] 
            }
            this.tabBreadcrumb.push(option);
        }
        this.getOnlineLearnlist();
    }
    
    onActive(index,e){
        this.sortActive = index;
        if(e.currentTarget.classList.length === 2){
            e.currentTarget.className = 'sortDiv active up'
            if(index === 0){
                if(this.newList.length > 0) this.newList.sort(this.sortUpDate);
            }
        }else{
            e.currentTarget.className = 'sortDiv active'
            if(index === 0){
                if(this.newList.length > 0) this.newList.sort(this.sortDownDate)
            }
        }
    }

    //时间正序
    sortDownDate(a, b) {
        return Date.parse(a.createdTime) - Date.parse(b.createdTime);
    }

    //时间倒叙
    sortUpDate(a, b,index) {
        return Date.parse(b.createdTime) - Date.parse(a.createdTime);
    }

    //人数正序
    sortDownNum(a, b) {
        return Date.parse(a.createdTime) - Date.parse(b.createdTime);
    }

    //人数倒叙
    sortUpNum(a, b,index) {
        return Date.parse(b.createdTime) - Date.parse(a.createdTime);
    }

    onSearch(val){
        this.courseName = val;
        this.getOnlineLearnlist();
    }

    onPressEnter(e){
        this.courseName = e.target._value
        this.getOnlineLearnlist();
    }

    tabClick(knowledgeType,name,val){
        //val：父级name 
        //name:当前
        let index = knowledgeType.lastIndexOf("-");
        let firstIndex = knowledgeType.indexOf("-");
        let prefix = knowledgeType.substring(0,index);
        let suffix = knowledgeType.substring(index+1);
        let firstfix = knowledgeType.substring(0,firstIndex);
        let newVal = '';
        if(suffix !== name){
            if(index !== firstIndex){
                // newVal = firstfix+'/'+val+'/' +name;
            }else{
                newVal = prefix ? prefix +'-'+val+'-' +name : val+'-' +name;
            }
        }else{
            newVal = prefix +'-'+name;
        }
        this.knowledgeType = newVal;
        this.tabBreadcrumb = [];
        this.tabData = [];
        let obj:any = newVal.split('-');
        for(var i=0;i<obj.length;i++){
            if(obj[i]){
                let option = {
                    title:obj[i]
                }
                this.tabBreadcrumb.push(option);
            }
        }
        this.fn(this.menuData,name);
        this.getOnlineLearnlist();
    }
    
    async getOnlineLearnlist(){
        const option = qs.stringify({
            page:this.newList.pageNum ? this.newList.pageNum : 1 ,
            pageSize:this.newList.pageSize,
            knowledgeType:this.knowledgeType,
            courseName:this.courseName,
            courseDifficulty:this.courseDifficulty,
            coursereCommend:this.checked ? '是' : ''
        });
        let res = await api.getOnlineLearnlist(option);
        if(res.errcode === 0){
            this.newList = res.data
        }
    }

    getList() {
        this.timer = setInterval(() => {
            if(this.$route.params.schemaCode !== 'onlineLearning'){
                clearInterval(this.timer);
            }else{
                this.getOnlineLearnlist();
            }
        },20000)
    }

    handleSearch(index:any,val?:any){
        this.tabData = [];
        if(val){
            this.fn(this.menuData,val);
        }
        if(index !== -1){
            this.tabBreadcrumb = this.tabBreadcrumb.slice(0,index+1);
            let valList = [];
            for(var i=0; i< this.tabBreadcrumb.length; i++){
                valList.push(this.tabBreadcrumb[i].title)
            }
            this.knowledgeType = valList.join('-');
        }else{
            this.tabBreadcrumb = [];
            this.knowledgeType = '';
        }
        this.getOnlineLearnlist();
    }

    fn(arr,val) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name === val) {
                console.log(arr[i])
                if(arr[i].children && arr[i].children.length > 0){
                    this.save(arr[i].children,val)
                }
            } else {
                if (arr[i].children && arr[i].children.length > 0) {
                    this.fn(arr[i].children,val)
                }
            }
        }
    }

    save(item,val) {
        if(item.length > 0){
            for (let index = 0; index < item.length; index++) {
                let param ={
                    name:item[index].name,
                    id:item[index].code,
                    val:val
                }
                this.tabData.push(param);
            }
        }else{
            let param = {
                name:item.name,
                id:item.code,
                val:val
            }
            this.tabData.push(param);
        }
    }

    handlePromoted(index,item){
        this.sortPromoted = index;
        this.courseDifficulty = index === 0 ? '' : item;
        this.getOnlineLearnlist();
    }

    handleCheck(){
        this.getOnlineLearnlist();
    }
}
</script>

<style lang="less" scoped>
.studyIndex{
    padding-right:10px;
    .fr{
        float: right;
    }
    .mr20{
        margin-right: 20px;
    }
    /deep/.ant-layout-header{
        display: flex;
        justify-content: space-between;
        height: 60px!important;
        padding: 15px 0 15px 8px;
        background: #fff;
        border-bottom: solid 1px #e4e4e4;
    }
    .classTime{
        display: flex;
        font-size: 14px;
        color:#999;
        border-bottom: solid 1px #e4e4e4;
        padding:10px 0 0 15px;
        span{
            color: #333;
        }
        p{
            margin-bottom: 10px;
        }
    }
    .ant-layout-content{
        background: #fff;
    }
    .conDiv{
        padding:10px 15px;
    }
    .tabDiv{
         overflow:hidden;
        p{
            float: left;
            margin: 0 25px 10px 0;
        }
        a:hover{
            color:#F60;
        }
    }
    .tabDiv.tabDivBor{
        border-bottom: 1px solid #e4e4e4;
    }
    .sortUl{
        width:100%;
        height: 38px;
        background: #f5f5f5;
        border: solid 1px #e4e4e4;
    }
    .sortUl>li{
        width:100px;
        padding: 0 14px;
        float: left;
        line-height: 36px;
        height: 36px;
        color: #666;
        cursor: pointer;
        display: flex;
    }
    .sortUl .sortDiv div{
        width: 60px;
    }
    .sortUl .sortDiv span{
        display: inline-block;
        width: 9px;
        height: 16px;
        background-image: url(../../style/image/arrow.png);
        background-position: -2px -24px;
        margin-top: 10px;
    }
    .sortUl .sortDiv.active span{
        background-position: -2px 4px;
    }
    .sortUl .sortDiv.active.up span{
        background-position: -2px -10px;
    }
    // .sortDiv{
    //     padding-right: 18px;
    //     position: relative;
    //     display: inline-block;
    //     line-height: 18px;
    //     cursor: pointer;
    // }
    // .sortDiv:after {
    //     content: "";
    //     position: absolute;
    //     right: 0;
    //     top: 0;
    //     width: 9px;
    //     height: 100%;
    //     background-image: url('../../../style/image/arrow.png');
    //     background-position: -2px -24px;
    //     height: 16px;
    //     top: 50%;
    //     margin-top: -8px;
    // }
    // .sortDiv.active:after {
    //     background-position: -2px 4px;
    // }
    // .sortDiv.active.up:after {
    //     background-position: -2px -10px;
    // }
    .empty{
        width: 100%;
        min-height: 250px;
        position: relative;
        img{
            display: block;
            position: absolute;
            left: 50%;
            margin-left: -102px;
            top: 20px;
            width:204px;
            height: 204px;
        }
        p{
            width: 70px;
            text-align: center;
            position: absolute;
            font-size: 14px;
            color: rgba(17, 18, 24, 0.5);
            font-weight: 400;
            left: 50%;
            margin-left: -35px;
            top: 210px;
        }
    }
}
.clear{
    clear: both;
}
.promotedDiv{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .promoted-div{
        display: flex;
        align-items: flex-start;
        margin-right: 5px;
        padding-top: 5px;
        .promoted{
            padding: 2px 6px;
            background: #eee;
            margin-right: 5px;
            line-height: 20px;
            font-size: 13px;
            cursor: pointer;
            border-radius: 2px;
            margin-top: 6px;
            &.active{
                background: #4393ef;
                color: #fff;
            }
        }
        .promoted:hover{
            background: #4393ef;
            color: #fff;
        }
    }
}
/deep/.ant-breadcrumb-link{
    font-size: 12px;
    display: inline-block;
    max-width: 135px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    float: left;
}
/deep/.ant-breadcrumb-separator{
    margin: 0 5px;
    float: left;
    height: 18px;
    line-height: 18px;
}
/deep/.ant-breadcrumb > span{
    display: inline-block;
    overflow: hidden;
    height: 18px;
}
.bread-menu{
    margin-top: 5px;
    max-width: 510px;
}
.onlyTj{
    line-height: 36px;
}
/deep/.ant-checkbox + span{
    padding:0 9px 0 0 !important;
}
</style>