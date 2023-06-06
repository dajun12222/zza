<template>
<a-row class="elRow">
    <a-col v-if="showType === '1'" :span="7">
        <a-select v-model="sheetDataItem" showSearch style="width: 100%">
            <a-select-option
                v-for="(item) in list"
                :key="item.id"
                :value="item.id"
            >{{ item.name }}</a-select-option>
        </a-select>
    </a-col>
    <a-col :span="showType === '1' ? 13 : 20">
        <a-input 
            v-model="searchKey"
            :placeholder="$t('languages.common.form.placeholder')"
            class="input-search"
            allowClear
        />
    </a-col>
    <a-col :span="4">
        <a-button 
            type="primary"
            class="btns"
            @click="search"
            >
            {{ $t('languages.common.form.search') }}
        </a-button>
    </a-col>
</a-row>
    
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Select,Input,Button,Row,Col, } from "@h3/antd-vue";
@Component({
  name: 'Search',
  components: {
    ARow: Row,
    ACol: Col,
    ASelect: Select,
    ASelectOption: Select.Option,
    AInput: Input,
    AButton: Button,
  },
})
export default class Search extends Vue {

    @Prop({ default: '1' }) showType?:string;

    @Prop({ default: '' }) value?:string;

    @Prop() list:any;

    sheetDataItem: string = 'regulationName';

    searchKey: string = '';

    // @Watch('value',{ deep:true,immediate: true })
    // onChangeValue(newVal:string,oldVal:string){
    //     if(newVal !== oldVal){
    //         this.searchKey = newVal;
    //     }
    // }

    // @Watch('searchKey',{ deep:true,immediate: true })
    // onChangeSearchKey(newVal:string){
    //     this.$emit('input',newVal);
    // }

    getSearch(){
        return {
            type: this.sheetDataItem,
            word: this.searchKey
        };
    }

    // 判断当前是否是中文版本

    get isChinese() {
        return !(this.$i18n.locale && this.$i18n.locale === "en");
    }
    // @Watch('sheetDataItem')
    // onChangeSheetDataItem(){
    //     this.search();
    // }
    // @Watch('searchKey')
    // onChangeSearchKey(){
    //     this.search();
    // }

    search(){
        this.$emit('search',{
            type: this.sheetDataItem,
            word: this.searchKey
        })
    }

}
</script>
<style lang="less" scoped>
div {
  
    .elRow {
        padding-top: 0;
    }
    /deep/ .ant-btn-primary {
        min-width: 57px;
    }
}
</style>
