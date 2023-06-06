<template>

    <div class="index">
        <div class="lie left_pie">
            <elProjectStart :colors="colors" />
            <elProjectComplete :colors="colors" />
            <rectificaProblem :colors="colors" />
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
import projectStart from './index/projectStart.vue';
import projectComplete from './index/projectComplete.vue';
import rectificaProblem from "@/../extends/views/echarts/jobOverview/rectificaProblem.vue";
import amountTri from './index/amountTri.vue';
import auditItem from './index/auditItem.vue';
import api  from '@/../extends/api';


@Component({
    name: 'project',
    components: {
        elProjectStart: projectStart,
        elProjectComplete: projectComplete,
        rectificaProblem,
        elAuditItem: auditItem
    },
})

export default class project extends Vue {

    colors:any = ['#6F83F5','#B58EF9', '#0DA8F6', '#5DD5D7', '#12C680', '#61BEFF' ,'#019EFF' , '#3C87FB' ]


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
</style>
