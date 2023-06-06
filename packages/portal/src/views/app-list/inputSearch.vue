<template>
<div class="inputSearch">
    <div class="inputContent">
        <span data-v-3b922408="" class="icon aufontAll h-icon-all-search-zj"></span>
        <input v-model="searchVal" :allowClear="allowClear" :placeholder="placeholder" class="ant-input" />
    </div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
    name: 'inputSearch',
    components: {
   
    },
})
export default class inputSearch extends Vue {

    @Prop({ default: true }) allowClear?:boolean;

    @Prop({ default: '请输入搜索内容' }) placeholder?:string;

    searchVal:string = '';

    @Prop({ default: '' }) value?:string;
    
    @Watch('value',{ deep: true, immediate: true })
    onChangeValue(newVal:string,oldVal:string){
        if(newVal !== oldVal){
            this.searchVal = newVal;
        }
    }

    @Watch('searchVal',{ deep: true, immediate: true })
    onChangeSearchVal(newVal:string){
        this.$emit('input',newVal);
        this.$emit('search');
    }

 

    
}
</script>
<style lang="less" scoped>
.inputSearch {
    width: 100%;
    height: 104px;
    margin-bottom: 30px;
    background-image: url('../../assets/images/inputSearch.png');
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    .inputContent {
        position: relative;
        width: 740px;
        height: 44px;
        .h-icon-all-search-zj {
            position: absolute;
            top: 13px;
            bottom: 0;
            z-index: 9;
            left: 14px;
            font-size: 14px;
            color: rgba(17,18,24,.25);
            width: 14px;
            height: 21px;
        }
        input {
            width: 100%;
            height: 100%;
            padding-left: 40px;
            padding-right: 20px;
            background: #FFFFFF;
            border: 1px solid rgba(227,227,227,1);
            box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.05);
            border-radius: 2px;
        }
    }
    
}
</style>