<template>
<div class="jobOverviewJiao"
    :style="[{
        'width': width ? width : '100%',
        'height': height ? height : '100%',
        // 'border': border ? 'solid 1px #064a9b' : 'solid 0px #064a9b'
    },styles]"
    >
    <i></i>
    <strong></strong>
    <span v-if="title" class="title">
        <!-- <img src="../../style/image/title_icon.png" /> -->
    {{ title }}</span>
    <a v-if="title_list">{{ title_list }}</a>
    <p v-if="year" class="year"></p>
    <slot></slot>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import * as echarts from 'echarts';



@Component({
    name: 'mapsContent',
    components: {

    },
})
export default class mapsContent extends Vue {

    @Prop({}) styles?:any

    @Prop({}) width?:any

    @Prop({}) height?:any

    @Prop({}) title?:string

    @Prop({}) title_list?:string

    @Prop({ default:true }) border?:boolean

    @Prop({ default:true }) year?:boolean

}
</script>
<style lang="less" scoped>
.jobOverviewJiao {
    width: 100%;
    height: 100%;
    position: relative;
    margin-bottom: 7px;
    &:after {
        content: "";
        border-top: 1px solid #2275d3;
        border-left: 1px solid #2275d3;
        width: 0.775rem;
        height: 0.725rem;
        position: absolute;
        top: 0;
        left: 0;
    }
    &:before {
        content: "";
        border-top: 1px solid #2275d3;
        border-right: 1px solid #2275d3;
        width: 0.775rem;
        height: 0.725rem;
        position: absolute;
        top: 0;
        right: 0;
    }
    > i {
        display: block;
        border-bottom: 1px solid #2275d3;
        border-right: 1px solid #2275d3;
        width: 0.775rem;
        height: 0.725rem;
        position: absolute;
        bottom: 0;
        right: 0;
    }
    > strong {
        display: block;
        border-bottom: 1px solid #2275d3;
        border-left: 1px solid #2275d3;
        width: 0.775rem;
        height: 0.725rem;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    > .title {
        display: inline-block;
        border: solid 1px #1ACDFD;
        border-top: 0;
        border-radius: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        position: absolute;
        top: 0;
        left: 0.775rem;
        padding: 5px 26px;
        color: #BFE3FC;
        font-weight: 600;
        > img {
            width: 14px;
            height: 14px;
        }
    }
    > a {
        display: flex;
        align-items: center;
        padding-left: 8px;
        position: absolute;
        top: 0;
        left: 0;
        color: #BFE3FC;
        font-weight: 100;
        font-size: 10px;
        width: 138px;
        height: 17px;
        background-image: url('../../style/image/list2-1_bg.png?202303091050');
        background-repeat: no-repeat;
        background-size: cover;
    }
    > .year {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 32px;
        text-align: right;
        margin-right: 5px;
        color: #fff;
    }
}
</style>
