<template>
<div class="index">
    <div class="lie left_pie">
        <elProjectStart :colors="colors" />
        <elProjectComplete :colors="colors" />
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
import projectStart from './project/projectStart.vue';
import projectComplete from './project/projectComplete.vue';
import amountTri from './project/amountTri.vue';
import auditItem from './project/auditItem.vue';
import api  from '@/../extends/api';


@Component({
    name: 'project',
    components: {
        elProjectStart: projectStart,
        elProjectComplete: projectComplete,
        elAmountTri: amountTri,
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
