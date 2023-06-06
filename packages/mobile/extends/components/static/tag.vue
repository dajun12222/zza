<template>
<div class="tag-content">
   <a-tag 
   v-for="(item) in list" :key="item.id"
   :color=" item.id === value ? '#2970ff' : '' "
   @click="toggleAudit(item)"
   >
    {{ isChinese ? item.name : item.name_i18n }}</a-tag>
</div>
    
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'Pad',
  components: {
    
  },
})
export default class Pad extends Vue {

    @Prop() list:any;

    @Prop() value?: number;

    // 判断当前是否是中文版本
    
    get isChinese() {
        return !(this.$i18n.locale && this.$i18n.locale === "en");
    }

    toggleAudit(item:any){
        this.$emit('input',item.id);
    }
}
</script>
<style lang="less" scoped>
.tag-content {
    display: flex;
    flex: 1;
    overflow-x: auto;
    padding-bottom: 10px;
    /deep/ .ant-tag {
        cursor: pointer;
    }
}
</style>
