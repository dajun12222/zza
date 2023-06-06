<template>
<div class="content">
    <!-- <header style="color:#fff;">header</header> -->
    <elHead :active="active" @change="change" />
    <div class="elContent">
        <slot></slot>
    </div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import head from './head.vue';
@Component({
    name: 'elContent',
    components: {
        elHead: head
    },
})
export default class elContent extends Vue { 

    @Prop({}) active?:number;

    change(num:number){
        this.$emit('change',num);
    }

}
</script>
<style lang="less" scoped>
.content {
    width: 100%;
    height: 100%;
    background-image: url('../../style/image/bg.png');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    .elContent {
        padding: 7px;
    }
}
</style>