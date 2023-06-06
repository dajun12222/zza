<template>
<span>
    <a-tooltip>
        <template #title>刷新</template>
        <i class="icon aufontAll h-icon-all-sync-o" @click="refer"></i>
    </a-tooltip>
</span>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row,Col,Button,Table,Tooltip } from "@h3/antd-vue";

@Component({
    name: 'showStyle',
    components: {
        ATable: Table,
        ATooltip: Tooltip,
    },
})
export default class showStyle extends Vue {

    refer(){
        this.$emit('refer');
    }

}
</script>
<style lang="less" scoped>
span {
    display: flex;
    width: 30px;
    height: 30px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
</style>