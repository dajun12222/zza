<template>
    <div class="returnTemplate">
       <a-icon type="left-o" class="aIcon" @click="goBack" />
    </div>
</template>
<script lang="ts">
import { Component, Vue, Model, Watch } from "vue-property-decorator";
import { Row, Icon } from '@h3/antd-vue';

@Component({
  name: 'returnTemplate',
  components: {
    AIcon: Icon,
  },
})
export default class returnTemplate extends Vue {
  goBack(){
    this.$router.go(-1);
  }
}
</script>
<style lang="less" scoped>
    .returnTemplate{
        width: 100%;
        height: 44px;
        background: #fff;
        position: fixed;
        left: 0;
        top: 0;
        display: flex;
        z-index: 10;
        padding: 0 .4rem;
        .aIcon{
          font-size: .5rem;
          font-weight: 600;
          /deep/svg{
            position: relative;
            top: 50%;
            transform: translateY(-50%);
          }
        }
    }
</style>
