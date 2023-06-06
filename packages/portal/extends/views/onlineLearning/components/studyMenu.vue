<template> 
    <div class="studyMenu">
        <div class="menuTitle">
            <a-icon type="menu-o" />
            <span>全部课程分类</span>
        </div>
        <a-menu>
            <a-sub-menu v-for="item in menuData" :key="item.name" popupClassName="menuSub" @titleClick="handleClick">
                <div slot="title">
                    <div class="zTitle">
                        <span>{{ item.name }}</span>
                        <!-- <span class="num">(111)</span> -->
                    </div>
                    <div class="fTitle">
                        <a v-for="items in item.children" :key="items.code" href="javascript:;">
                            {{ items.name }}
                        </a>
                    </div>
                </div>
                <a-menu-item>
                    <div v-for="items in item.children" :key="items.code" class="titleCon">
                        <div class="titleConLeft" @click="handleItemClick(item.name,items.name)">{{ items.name }}</div>
                        <div v-if="items.children && items.children.length" class="titleConRight">
                            <p class="bor"></p>
                            <div class="className">
                                <div v-for="oItem in items.children" :key="oItem.code" @click="onItemClick(item.name,items.name,oItem.name)">{{ oItem.name }}</div>
                            </div>
                        </div>
                    </div>
                </a-menu-item>
            </a-sub-menu>
        </a-menu>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Col, Row, Menu } from "@h3/antd-vue";
import api  from '@/../extends/api';
import axios from 'axios';
const qs = require('qs');

// @@ 组件定义
@Component({
  name: 'studyMenu',
  components: {
        ACol: Col,
        ARow: Row,
        AMenu: Menu,
        AMenuItem: Menu.Item,
        ASubMenu: Menu.SubMenu,
  },
})
export default class studyMenu extends Vue {
    @Prop() list?: any; 

    menuData:any = [
        {
            name:"课程1",
            id:"1",
            children:[
                {
                    name:'课程1课程1',
                    id:'1-1',
                    children:[
                        {
                            name:'课程1(11)',
                            id:'1-1-1',
                        },
                        {
                            name:'课程2(11)',
                            id:'1-1-2',
                        },
                        {
                            name:'课程3(11)',
                            id:'1-1-3',
                        }
                    ]
                },
                {
                    name:'课程1课程2',
                    id:'1-2',
                    children:[
                        {
                            name:'课程11(11)',
                            id:'1-2-1',
                        },
                        {
                            name:'课程12(11)',
                            id:'1-2-2',
                        },
                        {
                            name:'课程13(11)',
                            id:'1-2-3',
                        }
                    ]
                },
            ]
        },
        {
            name:"课程2",
            id:"2",
            children:[
                {
                    name:'课程2课程1',
                    id:'2-1',
                    children:[
                        {
                            name:'课程21(11)',
                            id:'2-1-1',
                        },
                        {
                            name:'课程22(11)',
                            id:'2-1-2',
                        },
                        {
                            name:'课程23(11)',
                            id:'2-1-3',
                        }
                    ]
                },
                {
                    name:'课程2课程2',
                    id:'2-2',
                    children:[
                        {
                            name:'课程221(11)',
                            id:'2-2-1',
                        },
                        {
                            name:'课程222(11)',
                            id:'2-2-2',
                        },
                        {
                            name:'课程223(11)',
                            id:'2-2-3',
                        }
                    ]
                },
            ]
        },
    ]

    tabData:any = [];

    knowledgeType:any = ''   
    
    newList:any = {
        tabData:[],
        knowledgeType:'',
        menuData:[]
    }

    async mounted(){
        await this.getCourseType();
    }

    save(item,val) {
        if(item.length > 0){
            for (let index = 0; index < item.length; index++) {
                let param = {};
                param={
                    name:item[index].name,
                    id:item[index].code,
                    val:val
                }
                this.newList.tabData.push(param);
            }
        }else{
            let param = {};
            param={
                name:item.name,
                id:item.code,
                val:val
            }
            this.newList.tabData.push(param);
        }
        // if (item.id) this.newList.tabData.push(item.name);
        // if (item.children && item.children.length > 0) {
        //     for (let index = 0; index < item.children.length; index++) {
        //         let element = item.children[index];
        //         this.save(element)
        //     }
        // }

    }

    fn(arr,val,vals) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].name === val) {
                console.log(arr[i])
                if(arr[i].children && arr[i].children.length > 0){
                    this.save(arr[i].children,val)
                }
                // else{
                //     this.save(arr[i],val)
                // } 
            } else {
                if (arr[i].children && arr[i].children.length > 0) {
                    this.fn(arr[i].children,val,vals)
                }
            }
        }
    }

    handleClick(item){
        this.newList.menuData = this.menuData;
        this.newList.tabData = [];
        this.fn(this.menuData,item.key,item.key);
        this.newList.knowledgeType = item.key;
        this.$emit('tabData',this.newList);
    }

    handleItemClick(item,val){
        this.newList.menuData = this.menuData;
        this.newList.tabData = [];
        this.newList.knowledgeType = item+'-'+val;
        this.fn(this.menuData,val,this.newList.knowledgeType);
        this.$emit('tabData',this.newList);
    }

    onItemClick(item,val,vals){
        this.newList.menuData = this.menuData
        this.newList.tabData = [];
        this.newList.knowledgeType = item+'-'+val+'-'+vals;
        this.fn(this.menuData,vals,this.newList.knowledgeType)
        this.$emit('tabData',this.newList);
    }

    async getCourseType(){
        let res = await api.getCourseType();

       if(res.errcode === 0){
            this.menuData = res.data;
       }
    }
}
</script>

<style lang="less" scoped>
.studyMenu{
    height: 100%;
    .menuTitle{
        display: flex;
        width: 100%;
        height: 50px;
        background: #4393ef;
        line-height: 50px;
        font-size: 16px;
        font-weight: 600;
        color: #333;
        // border-right: 1px solid #3070b8;
        color: #fff;
        .anticon{
            margin: 17px 10px 0 10px;
        }
    }
    ul{
        height: calc(100% - 50px);
        // border: solid 2px #3070b8;
    }
    /deep/.ant-menu-submenu{
        border-bottom: solid 1px #e4e4e4;
        color: #666 ;
    }
    /deep/.ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow::before,
    /deep/.ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow::after{
        width: 0;
        height: 0;
    }
    /deep/.ant-menu-submenu-title{
        min-height: 40px;
        line-height: 20px;
        height: auto;
        padding: 10px;
        margin: 0;
        .zTitle{
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
            .num{
                font-size: 12px;
                color:#999;
                font-weight: 400;
                margin-left: 10px;
            }
        }
        .fTitle{
            font-size: 12px;
            overflow: hidden;
            a{
                display: inline-block;
                width: 60px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-left: 5px;
                float: left;
                color: #666;
            }
            a:nth-child(3n+1){
                margin-left: 0;
            }
        }
    }
    /deep/.ant-menu-submenu-active{
        background: #4393ef;
        .zTitle,.fTitle{
            color: #fff;
        }
        .zTitle .num,.fTitle a{
            color: #fff;
        }
    }
}
 
.menuSub{
    .titleCon{
        // overflow: hidden;
        min-height: 20px;
        line-height: 20px;
        padding: 10px 0;
        height: auto;
        // position: relative;
        display: flex;
    }
    .titleConLeft{
        // width: 110px;
        width:145px;
        color:#2e7fdb;
        word-wrap: break-word;
        white-space: pre-wrap;
    }
    .titleConLeft:hover{
        color:#F60;
    }
    .bor{
        height: 15px;
        border-left: 2px solid #e4e4e4;
        margin: 2px 15px 0 0;
    }
    .titleConRight{
        padding-left: 30px;
        display: flex;
        color: #666;
    }
    .className{
        div{
            margin-right: 15px;
            float: left;
        }
        div:last-child{
            margin-right: 0;
        }
        div:hover{
            color:#F60;
        }
    }
    .ant-menu-vertical > .ant-menu-item{
        width: 500px;
        min-height: 40px;
        height: auto;
    }
}
</style>