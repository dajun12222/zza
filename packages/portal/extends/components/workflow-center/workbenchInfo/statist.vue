<template>
<div class="statist">
    <div class="info-item">
    <div class="right">
        <img :src="getImg(1)" alt="" />

    </div>
    <div class="left">
        <p>
        {{$t('languages.common.workBenchInfo.Investment')}}
        <span class="icon aufontAll h-icon-all-arrow-right-o"></span>
        </p>
        <h3>
            <span v-for="(item,key) in info.BudgetitemRegistration" :key="item+key">{{ key }}：{{ item }}</span>
        </h3>
    </div>
    </div>

    <div class="info-item">
    <div class="right">
        <img :src="getImg(2)" alt="" />
    </div>
    <div class="left">
        <p>
        {{$t('languages.common.workBenchInfo.Economic')}}
        <span class="icon aufontAll h-icon-all-arrow-right-o"></span>
        </p>
        <h3>
            <span v-for="(item,key) in info.project_records_ec" :key="item+key">{{ key }}：{{ item }}</span>
        </h3>
    </div>
    </div>

    <div class="info-item">
    <div class="right">
        <img :src="getImg(3)" alt="" />
    </div>
        <div class="left">
        <p>
        {{$t('languages.common.workBenchInfo.Audit')}}
        <span class="icon aufontAll h-icon-all-arrow-right-o"></span>
        </p>
        <h3>
            <span v-for="(item,key) in info.project_records" :key="item+key">{{ key }}：{{ item }}</span>
        </h3>
    </div>
    </div>
</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import api  from '@/../extends/api';
@Component({
    name: "Statist",
    components: {}
})
export default class Statist extends Vue {

    info:any = {};

    @Prop({default: () => {return {}}}) infoData !:any;
    goto(type:string){
        this.$router.push('/workflow-center/' + type)
    }

    get themeColor(){
        return this.$store.state.themeColor || 'blue'
    }

    getImg(number){
        let themeColor = this.themeColor;
        // eslint-disable-next-line import/no-dynamic-require
        return require(`@/../src/views/workflow-center/workbenchInfo/workbenchComponents/images/${themeColor}${number}.svg`) || ''
    }

    created(){
        this.getList();
    }

    async getList(){

        /*
        
            BudgetitemRegistration  投资项目审计
            project_records 财务收支审计
            project_records_ec  经济责任审计

            COMPLETED   完成
            DRAFT 草案
            PROCESSING  处理
        */
        let res:any = await api.getAuditWorkFlowCount();
        if(res.errcode === 0){
            let option = res.data;
            let result:any = {};
            let maps = this.mapping();
            option.map((item:any) => {
                if(!result[item['schemaCode']]){
                    result[item['schemaCode']] = {};
                }
                if(item['state'] !== 'DRAFT' && maps[item['state']]){
                    result[item['schemaCode']][maps[item['state']]] = item['num'];
                }
                
            })
            console.log(result);
            this.info = result;
        }else{
            this.info = {};
        }
    }

    mapping(){
        return {
            'COMPLETED': '审结',
            'DRAFT': '草案',
            'PROCESSING': '在审',
        }
    }
}
</script>

<style lang="less" scoped>
.statist{
    display: flex;
    justify-content: space-between;
    padding: 16px;
    margin-top: 16px;
    background-color: #fff;
    .info-item{
    min-width: 198px;
    flex: 1;
    height: 92px;
    border-radius: 4px;
    border: 1px solid #EEEEEE;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    &:nth-child(2){
        margin: 0 16px;
    }
    .left{
        margin-right: 20px;
    }
    p{
        // margin: 18px 0 0 20px;
        font-size: 12px;
        line-height: 20px;
        padding-top: 4px;
        display: flex;
        align-items: center;
        margin-bottom: 0;
        span{
        font-size: 14px;
        display: inline-block;
        width: 0;
        overflow: hidden;
        margin-left: 2px;
        }
    }
    h3{
        font-size: 12px;
        line-height: 36px;
        color: #111218;
        margin-bottom: 0;
        font-weight: 400;
        display: flex;
        flex-direction: row-reverse;
        span {
            margin-right: 15px;
        }
    }

    &:hover{
        .left{
        p{
            span{
            width: 14px;
            transition: all ease 0.5s;
            }
        }
        }
    }


    .right{
        height: 42px;
        width: 42px;
        // overflow: hidden;
        transition: all ease 0.3s;
        margin-left: 30px;
        position: relative;
        &::after{
        content: '';
        position: absolute;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: #f9f9f9;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        }
        img{
        position:relative;
        z-index: 2;
        width: 42px;
        height: 42px;
        }
        margin-right: 20px;
        span{
        margin-left: 20px;
        display: inline-block;
        }
    }
    }
}
</style>
  