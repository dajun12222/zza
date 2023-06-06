<template>
<div class="elHeader">
    <p>审计决策驾驶舱</p>
    <div class="elHeaderMenu">
        <ul>
            <li :class="{'active': active === 1}" @click="change(1)">
                工作概览
            </li>
            <li :class="{'active': active === 2}" @click="change(2)">
                审计项目
            </li>
            <li :class="{'active': active === 3}" @click="change(3)">
                审计成果
            </li>
        </ul>
        <div></div>
        <ul class="elHeaderMenuTwo">
            <li :class="{'active': active === 4}" @click="change(4)">
                审计整改
            </li>
            <li :class="{'active': active === 5}" @click="change(5)">
                审计队伍
            </li>
            <li :class="{'active': active === 6}" @click="change(6)">
                数据资源
            </li>
        </ul>
    </div>
    <span>
       {{ date }}
    </span>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import moment from "moment";
@Component({
    name: 'elHeader',
    components: {

    },
})
export default class elHeader extends Vue {

    date:string = moment().format('YYYY-MM-DD dddd');

    @Prop({ default: 1 }) active?:number;

    change(num:number){
        this.active = num;
        this.$emit('change',num);
    }
}
</script>
<style lang="less" scoped>
.elHeader {
    width: 100%;
    height: 85px;
    background-image: url('../../style/image/top_bg.png?t=202303091543');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
    > .elHeaderMenu {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 80%;
        height: 100%;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 25% 50% 25%;

        > ul {
            display: flex;
            align-items: center;
            > li {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 96px;
                height: 26px;
                background-image: url('../../style/image/nav_nor.png?t=202303091543');
                background-repeat: no-repeat;
                background-size: contain;
                background-position: center;
                font-size: 10px;
                color: #65CAF8;
                cursor: pointer;
            }
            > li:hover {
                color: #fff;
                background-image: url('../../style/image/nav_sel.png?t=202303091543');
            }
            > li.active {
                color: #fff;
                background-image: url('../../style/image/nav_sel.png?t=202303091543');
            }
        }
        > ul.elHeaderMenuTwo {
            > li {
                background-image: url('../../style/image/nav_nor.png?t=202303091543');
            }
            > li:hover {
                color: #fff;
                background-image: url('../../style/image/nav_sel.png?t=202303091543');
            }
            > li.active {
                color: #fff;
                background-image: url('../../style/image/nav_sel.png?t=202303091543');
            }
        }
    }
    > p {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        //font-weight: 600;
        color: #65CAF8;
        font-size: 32px;
    }
    > span {
        position: absolute;
        top: 36px;
        right: 10px;
        color: #F2F2F2;
        font-size: 10px;
    }
}
</style>
