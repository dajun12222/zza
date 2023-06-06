<template>
  <div class="dataResource1">
    <div class="box">
      <div class="line">
        <div class="block">
          <el-resource
            :info="info && info.templateDataResource"
            title="模板库"
          />
        </div>
        <div class="block">
          <el-resource
            :info="info && info.regulationsDataResource"
            title="法规库"
          />
        </div>
        <div class="block">
          <el-resource
            :info="info && info.questionDataResource"
            title="问题库"
          />
        </div>
        <div class="block">
          <el-resource :info="info && info.dictDataResource" title="字典库" />
        </div>
      </div>
      <div class="line">
        <div class="block">
          <el-resource
            :info="info && info.mattersDataResource"
            title="事项库"
          />
        </div>
        <div class="block">
          <elBubble  :border="false" :title="'数据资源情况'" />
        </div>
        <div class="block">
          <el-resource :info="info && info.agentDataResource" title="中介库" />
        </div>

        <div class="block">
          <el-resource :info="info && info.talentDataResource" title="人才库" />
        </div>
      </div>
      <div class="line">
        <div class="block">
          <el-resource
            :info="info && info.dynamicDataResource"
            title="动态库"
          />
        </div>
        <div class="block">
          <el-resource
            :info="info && info.dictionaryDataResource"
            title="审计成果文件库"
          />
        </div>
        <div class="block">
          <el-resource
            :info="info && info.pigeonholeDataResource"
            title="归档项目库"
          />
        </div>
        <div class="block">
          <el-resource :info="info && info.caseDataResource" title="案例库" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import bubble from '@/../extends/views/echarts/jobOverview/bubble.vue';
import resource from '@/../extends/views/echarts/dataResource/resource.vue';
import api from '@/../extends/api';
@Component({
  name: 'dataResource',
  components: {
    elResource: resource,
    elBubble: bubble,
  },
})
export default class dataResource extends Vue {
  info: any = {};

  created() {
    console.log('测试22223')
    this.getList();
  }

  async getList() {
    const res: any = await api.dataResourceCounts();
    if (res.code === '00000') {
      //let option = res.data;
      this.info = res.data;
    } else {
      this.info = {};
    }
  }
}
</script>
<style lang="less" scoped>
.dataResource1 {
  height: 100%;
  .box {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .line {
      flex-grow: 1;
      margin: 5px;
      display: flex;
      justify-content: space-between;
      height: 33%;
      .block {
        flex-grow: 1;
        margin: 5px;
        width: 25%;

        .unitRank{
          height: 100%!important;
          width: 100%!important;
        }
      }
    }
  }
}
</style>
