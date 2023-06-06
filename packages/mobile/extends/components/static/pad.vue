<template>
<div class="pad">
    <slot></slot>
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
    

}
</script>
<style lang="less" scoped>
.pad {
    padding: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    background-color: #fff;
    border-radius: 2px;
}
</style>
