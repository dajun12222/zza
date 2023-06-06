<template>
<div class="CaseSort">
<a-row>
    <a-col :span="4">
        {{ $t('languages.common.sort') }}：
    </a-col>
    <a-col :span="8" class="elSort" @click="sort">
        {{ $t('languages.common.uploadTime') }} 
        <i v-if="type === 'desc'" class="icon aufontAll h-icon-all-arrow-up-o"></i>
        <i v-if="type === 'asc'" class="icon aufontAll h-icon-all-arrow-down-o"></i>
    </a-col>
    <a-col :span="12">
        {{ $t('languages.common.retriev') }}{{ count }}{{ $t('languages.common.article') }}
    </a-col>
</a-row>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row,Col, } from "@h3/antd-vue";
@Component({
  name: 'CaseSort',
  components: {
    ARow: Row,
    ACol: Col,
  },
})

export default class CaseSort extends Vue {

    type:string = 'desc';

    @Prop({ default: 0}) count?: number;

    sort(){
        if(this.type === 'desc' ){
            this.type = 'asc';
        }else{
            this.type = 'desc';
        }
        this.$emit('setSort',this.type);
    }
    
}
</script>
<style lang="less" scoped>
.CaseSort {
    padding-bottom: 7px;
    .elSort {
        color: #2970ff;
        cursor: pointer;
    }
}
</style>
