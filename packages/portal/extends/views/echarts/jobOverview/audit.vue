<template>
<el-block-bg>
    111
</el-block-bg>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import * as echarts from 'echarts';
@Component({
    name: 'audit',
    components: {
        elBlockBg: blockBg
    },
})
export default class audit extends Vue { 

    @Prop({}) info?:any;

    mounted(){


    }






}
</script>
<style lang="less" scoped>
.elAudit {
   
   
}


</style>