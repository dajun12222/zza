<template>

<div class="jobOverview">
    <div class="lie left_pie">
        <unitRank :colors="colors" :map="map" />
        <typeProblem :colors="colors" :map="map" />
        <bubble />
    </div>
    <div></div>
    <div class="lie">
        <cumulativeItem />
        <auditItem />
    </div>
    <div></div>
    <div class="lie left_pie">
        <itemTime />
        <rectificaProblem :colors="colors" />
        <talentCertificate />
    </div>
</div>


</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import unitRank from "@/../extends/views/echarts/jobOverview/unitRank.vue";
import typeProblem from "@/../extends/views/echarts/jobOverview/typeProblem.vue";
import rectificaProblem from "@/../extends/views/echarts/jobOverview/rectificaProblem.vue";
import talentCertificate from "@/../extends/views/echarts/jobOverview/talentCertificate.vue";
import auditItem from "@/../extends/views/echarts/jobOverview/auditItem.vue";
import itemTime from "@/../extends/views/echarts/jobOverview/itemTime.vue";
import cumulativeItem from "@/../extends/views/echarts/jobOverview/cumulativeItem.vue";
import bubble from "@/../extends/views/echarts/jobOverview/bubble.vue";
@Component({
    name: 'jobOverview',
    components: {
        unitRank,
        typeProblem,
        rectificaProblem,
        talentCertificate,
        auditItem,
        itemTime,
        cumulativeItem,
        bubble,
    },
})
export default class jobOverview extends Vue {

    colors:any = ['#6F83F5','#B58EF9', '#0DA8F6', '#5DD5D7', '#12C680', '#61BEFF' ,'#019EFF' , '#3C87FB' ]

    map:any = [
        {VALUE: 0,NAME: "项目审计"},
        {VALUE: 0,NAME: "财务收支审计"},
        {VALUE: 0,NAME: "领导干部经济责任审计"},
        {VALUE: 0,NAME: "执法活动财物审计"},
        {VALUE: 0,NAME: "专项审计"},
        {VALUE: 0,NAME: "绩效审计"},
    ]

    change(num:number){

    }

}
</script>
<style lang="less" scoped>
.jobOverview {
    display: grid;
    grid-template-columns: 25% 1% 48% 1% 25%;
    width: 100%;
    height: 100%;
    .left_pie {
        > div {
            height: 30%;
            margin-bottom: 2%;
        }
    }
}


</style>
