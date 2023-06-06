<template>
  <div class="empty">
        <img src="../../onlineLearning/images/search-no-data.png" alt="">
        <p>请点击从“试题库选择”</p>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Model, Watch } from "vue-property-decorator";
import { } from "@h3/antd-vue";
import axios from 'axios';
import api  from '@/../extends/api';
import { listApi as Application } from 'cloudpivot/api/index';
const qs = require('qs');
// import date from "@cloudpivot/common/src/utils/date";
@Component({
  name: "examEmpty",
  components: {
    
  },
})
export default class examEmpty extends Vue {
    
}
</script>

<style lang="less" scoped>
    .empty{
        width: 100%;
        min-height: 250px;
        position: relative;
        img{
            display: block;
            position: absolute;
            left: 50%;
            margin-left: -102px;
            top: 20px;
            width:204px;
            height: 204px;
        }
        p{
            width: 70px;
            text-align: center;
            position: absolute;
            font-size: 14px;
            color: rgba(17, 18, 24, 0.5);
            font-weight: 400;
            left: 50%;
            margin-left: -35px;
            top: 210px;
        }
    }
</style>