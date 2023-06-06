<template>
<div>
    <template v-if="obj && obj.content">
        <pad v-for="(item) in obj.content" :key="item.id">
            <div @click="showNewInfo(item)">
                <h3>{{ item.regulationName }}</h3>
                <a-tag class="ant-tag-purple" size="small">发布：{{ item.releaseDate ? item.releaseDate.slice(0, 10) : '' }}</a-tag>
                <a-tag class="ant-tag-cyan" size="small">实施：{{ item.implementationDate ? item.implementationDate.slice(0, 10) : '' }}</a-tag>
                <a-tag class="ant-tag-blue" size="small">{{ item.timeliness }}</a-tag>
                <a-tag class="ant-tag-geekblue" size="small">{{ item.classification }}</a-tag>
                <!-- <p>
                    发布:{{ item.releaseDate ? item.releaseDate.slice(0, 10) : '' }}<br />实施:{{ item.implementationDate ? item.implementationDate.slice(0, 10) : '' }}&nbsp;&nbsp;&nbsp;&nbsp;
                    {{ item.timeliness }}{{ item.classification }}  
                </p> -->
            </div>
        </pad>
    </template>
</div>
    
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import pad from '@/../extends/components/static/pad.vue';
@Component({
  name: 'NewList',
  components: {
    pad
  },
})

export default class NewList extends Vue {
    
    @Prop() obj: any;

    @Watch('obj',{ deep: true, immediate: true })
    onChangeMessage(newVal:any){

    }

    // showNewInfo(item:any) {

    //     this.$emit('showNewInfo',item);
    // }

    showNewInfo(item: any) {
    // this.showModel = true;
    let { href } = this.$router.resolve({
        name: "regulationInfo",
        query: {
            id: item['id'],
            isOpenPage: 'true',
            appCode:  this.$route.query.code
        }
    });
    window.open(href,'_blank');
  }
   

}
</script>
<style lang="less" scoped>
div {
    position: relative;
    cursor: pointer;
    h3 {
        font-weight: normal;
        color: #1f7a9c;
    }
    i {
        position: absolute;
        right: 0;
        bottom: 10px;
    }
}
.ant-tag{
    margin-bottom: 10px;
}
</style>
