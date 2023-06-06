<template>
<div>
    <template v-if="obj && obj.content">
        <pad v-for="(item) in obj.content" :key="item.id">
            <div @click="showNewInfo(item)">
                <h3>{{ item.policyRegulationName }}</h3>
                <p>
                    {{ item.releaseDate }}发布&nbsp;&nbsp;&nbsp;&nbsp;{{ item.implementationDate }}实施&nbsp;&nbsp;&nbsp;&nbsp;
                    {{ item.timeliness }}有效&nbsp;&nbsp;&nbsp;&nbsp; {{ item.releaseNumber }} 
                    <!-- <i class="icon aufontAll h-icon-all-download-o"></i> -->
                </p>
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

    showNewInfo(item:any) {

        this.$emit('showNewInfo',item);
    }
   

}
</script>
<style lang="less" scoped>
div {
    position: relative;
    cursor: pointer;
    h3 {
        font-weight: normal;
        color: #2970ff;
    }
    i {
        position: absolute;
        right: 0;
        bottom: 10px;
    }
}
</style>
