<template>
<div class="index">
    <div class="lie left_pie">
        <elProjectStart :colors="colors" :map="map" />
        <elTypeProblem :colors="colors" :map="map" />
        <elAmountTri :colors="colors" />
    </div>
    <div></div>
    <div class="lie">
        <elAuditItem />
    </div>
</div>
</template>
<script lang="ts">
import { Col, Spin, Select, Table } from "@h3/antd-vue";
import { Component, Prop, Vue, Watch} from 'vue-property-decorator';
import projectStart from './achievement/projectStart.vue';
import typeProblem from "@/../extends/views/echarts/jobOverview/typeProblem.vue";
import amountTri from './achievement/amountTri.vue';
import auditItem from './achievement/auditItem.vue';
import api  from '@/../extends/api';


@Component({
    name: 'project',
    components: {
        elProjectStart: projectStart,
        elTypeProblem: typeProblem,
        elAmountTri: amountTri,
        elAuditItem: auditItem
    },
})

export default class project extends Vue {

    colors:any = ['#6F83F5','#B58EF9', '#0DA8F6', '#5DD5D7', '#12C680', '#61BEFF' ,'#019EFF' , '#3C87FB' ]

    map:any = [
        {VALUE: 0,NAME: "项目审计"},
        {VALUE: 0,NAME: "财务收支审计"},
        {VALUE: 0,NAME: "领导干部经济责任审计"},
        {VALUE: 0,NAME: "执法活动财物审计"},
        {VALUE: 0,NAME: "专项审计"},
        {VALUE: 0,NAME: "绩效审计"},
    ]

}
</script>
<style lang="less" scoped>

.index{
    display: grid;
    grid-template-columns: 25% 1% 74%;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .left_pie {
        > div {
            height: 30%;
            margin-bottom: 2%;
        }
    }
}
// .lie{
//   height: calc(100% - 130px);
// }
</style>
