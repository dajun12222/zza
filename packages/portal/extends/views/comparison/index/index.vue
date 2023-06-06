<template>
<div class="">
    <a-spin :spinning="isIframeShow">
        <a-row v-show="!isIframeShow" class="elRowApp">
            <a-col id="iframeBox" class="elColLeft" :span="24">
                <!-- <iframe class="iframeTecheck" ></iframe> -->
            </a-col>
            <a-col v-show="!isIframeShow" :span="12" class="elColRight">
                <div class="header">提取结果</div>
                <a-row class="elRowContent">
                    <template v-for="(item) in list">
                        <a-col :key="item.id" :span="24" class="elColContent">
                            <a-col :span="6" class="elColCon">{{ item.names }}</a-col>
                            <a-col :span="18" class="elColCon">
                                <a-input v-model="item.parameter" readonly autocomplete="off" />
                            </a-col>
                        </a-col>
                        <a-col :key="item.id" :span="24" class="elColContent elColText">
                            <a-col :span="6" class="elColCon" />
                            <a-col :key="item.id" :span="18" class="elColCon elColText" 
                            :class="{ 'activeElCol': item && item.thereProblem === '是' ? true : false }"
                        >{{ item.parameter2 }}</a-col>
                        </a-col>
                    </template>
                
                </a-row>
            </a-col>
        </a-row>
    </a-spin>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row,Col,Input,Spin } from "@h3/antd-vue";
import { utils } from 'cloudpivot/common';
import api  from '@/../extends/api';
@Component({
    name: 'comparisonIndex',
    components: {
        ARow: Row,
        ACol: Col,
        AInput: Input,
        ASpin:Spin
    },
})
export default class comparisonIndex extends Vue {

    srcUrl:string = 'http://222.128.10.62:8881/tcheck/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNTY1NjQ2MDExMTYwOTIwMDY0IiwiaWF0IjoxNjYyNTMzMjk4LCJleHAiOjQwNzA1MzQ0MDB9.P4W7lYMyOBiV37CgcgUSFOAOZYiSrRIH49pNYk3X05bzlteAhDOzqAl6tJEW-K32iHd3JewO6CSOGEpDrzEjTQ';
    
    list:any = [];

    isIframeShow:boolean = true;

    async mounted(){
        
        let tag = document.documentElement as any;
        tag.style.fontSize="12px";

        const query = utils.parseQuery();
        if(query && query['url']){
            this.createdIframe(query['url']);
        }else{
            this.createdIframe(this.srcUrl);
        }
        //this.createdIframe(this.srcUrl);
        //query.id = '1cf4f732ab7f49f4ae8cc0e448048d9f';
        if(query && query['id']){
            const res:any = await api.findById({ id:query['id'] });
            if(res && res.errcode === 0){
                this.list = res.data || [];
            }
        }
        
    }

    createdIframe(srcUrl:string){
        //iframeBox
        let iframeBox:any = document.querySelector('#iframeBox');
        let iframe:any = document.createElement('iframe');
        iframe.onload = () => {
            setTimeout(() => {
                this.isIframeShow = false;
            }, 500);
        }
        iframe.src = srcUrl;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframeBox.appendChild(iframe);
    }

    destroyed(){
        let tag = document.documentElement  as any;
        tag.style.fontSize="";
    }

    load(){
       // this.isIframeShow = false;
    }
    
}
</script>
<style lang="less" scoped>
/deep/ .ant-spin-nested-loading {
    height: 100%;
    .ant-spin-container {
        height: 100%;
        .elRowApp {
            display: block;
            min-width: 1200px;
            height: 100%;
            position: relative;

            .elColLeft {
                height: 100%;
                .iframeTecheck {
                    width: 100%;
                    height: 100%;
                    border: 0;
                }
            }
            .elColRight {
                position: absolute;
                right: 0;
                top: 0;
                z-index: 99;
                width: 50%;
                height: 100%;
                background-color: #fff;
                .header {
                    padding: 0 1.041667rem;
                    width: 100%;
                    height: 2.604167rem;
                    line-height: 2.604167rem;
                    background: #dbdbdb;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    -webkit-box-pack: justify;
                    -ms-flex-pack: justify;
                    justify-content: space-between;
                }
                .elRowContent {
                    width: 100%;
                    .elColContent {
                        display: flex;
                        align-items: center;
                        padding: 4px 24px;
                        padding-bottom: 0;
                        .elColCon {
                            padding: 4px;
                            font-size: 12px;
                            input[type='text'] {
                                font-size: 12px;
                            }
                        }
                        .elColText {
                            padding-top: 0;
                            padding-bottom: 0;
                            border-bottom: 0;
                        
                        }
                    }
                    .elColText {
                        padding-top: 0;
                        padding-bottom: 10px;
                        font-size: 10px;
                        border-bottom: solid 1px #ccc;
                        
                    }
                    .activeElCol {
                        color: #f00;
                    }
                }
            }
        }
    }
}
</style>