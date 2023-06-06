<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="base-info">
    <div class="info-title">规则信息</div>
    <div class="info-content">
      <div v-for="(item, index) in showList" :key="index" class="info-block">
        <span class="left"> {{ item.title }}： </span>
        <span class="right">
          {{ info[item.attr] }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'BaseInfo',
  components: {},
})
export default class BaseInfo extends Vue {
  info: any = {
    ruleCode: 'GetList',
    runTime: '2022-6-12 14:44:49',
    triggerData: '测试数据',
    runType: '回滚',
  };

  showList: any = [
    {
      title: '规则编码',
      attr: 'ruleCode',
    },
    {
      title: '执行时间',
      attr: 'runTime',
    },
    {
      title: '触发数据',
      attr: 'triggerData',
    },
    {
      title: '执行类型',
      attr: 'runType',
    },
  ];
}
</script>

<style lang="less" scoped>
.base-info {
  padding-bottom: 16px;
  .info-title {
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 24px;
  }
  .info-content {
    display: flex;
    flex-wrap: wrap;
    .info-block {
      width: 50%;
      padding-bottom: 16px;
      .left {
        color: rgba(17, 18, 24, 0.5);
      }
      .right {
        color: #111218;
      }
    }
  }
}
</style>
