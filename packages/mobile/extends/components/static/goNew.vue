<template>
<a class="goNew" @click="goNew">
    {{ title }}
</a>
    
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
    name: 'goNew',
    components: {
    
    },
})
export default class goNew extends Vue {

    @Prop({ default: '进入审计法规库'}) title?:string;

    @Prop({ default: 'https://covaudit.com/ZST/Area_ZST/MasterTemplate' }) url?:string;
    
    goNew(){
        (window as any).open(this.url,'_blank');
    }
}
</script>
<style lang="less" scoped>
.goNew {
    cursor: pointer;
    font-size: 12px;
    color: #2970ff;
}
</style>
    