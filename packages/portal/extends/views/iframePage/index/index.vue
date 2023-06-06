<template>
<div class="iframePageIndex">
    <iframe :src="`${url}`"></iframe>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
    name: 'iframePageIndex',
    components: {

    },
})
export default class iframePageIndex extends Vue {
    get url(){
        const { query } = this.$route;
        return query && query.url ? query.url : '';
    }
}
</script>
<style lang="less" scoped>
.iframePageIndex {
    width: 100%;
    height: 100%;
    iframe {
        width: 100%;
        height: 100%;
        border: 0;
    }
}
</style>