<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="data-rule-info-detail">
    <p class="data-rule-info-detail-title">详细信息</p>
    <div class="data-rule-info-detail-msg">
      <a-row>
        <a-col class="info-label" :span="4"> 应用 </a-col>
        <a-col :span="8">
          {{ detailData.sourceAppName }}
        </a-col>
        <a-col class="info-label" :span="4"> 模型 </a-col>
        <a-col :span="8">
          {{ detailData.sourceSchemaName }}
        </a-col>
      </a-row>
      <a-row>
        <a-col class="info-label" :span="4"> 数据规则名称 </a-col>
        <a-col :span="8">
          {{ detailData.ruleName }}
        </a-col>
        <a-col class="info-label" :span="4"> 目标模型 </a-col>
        <a-col :span="8">
          {{ detailData.targetSchemaName }}
        </a-col>
      </a-row>
      <a-row>
        <a-col class="info-label" :span="4"> 执行时间 </a-col>
        <a-col :span="8">
          {{ detailData.modifiedTime }}
        </a-col>
        <a-col class="info-label" :span="4"> 执行状态 </a-col>
        <a-col :span="8">
          {{ detailData.success ? '成功' : '失败' }}
        </a-col>
      </a-row>
    </div>
    <a-divider />
    <p class="data-rule-info-detail-title">执行情况</p>
    <div class="data-rule-info-detail-implementstate">
      <a-row>
        <a-col class="info-label" :span="4"> 触发数据动作 </a-col>
        <a-col :span="20">
          {{ triggerObj }}
        </a-col>
      </a-row>
      <a-row>
        <a-col class="info-label" :span="4"> 执行动作数据 </a-col>
        <a-col v-if="detailData.success" :span="20">
          <template v-if="actionType === 2">
            <action-updated
              v-if="detailData.updateEffectMap"
              :updateEffectMap="detailData.updateEffectMap"
            />
          </template>
          <template v-else>
            <action-insert-delete
              v-if="detailData.insertEffectList || detailData.deleteEffectList"
              :actionType="actionType"
              :insertEffectList="detailData.insertEffectList"
              :deleteEffectList="detailData.deleteEffectList"
            />
          </template>
        </a-col>
        <a-col v-else :span="20">
          {{ detailData.failLog }}
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script lang="ts">
import { Row, Col, Divider } from '@h3/antd-vue';
import { systemManageApi } from 'cloudpivot/api';
import { Component, Prop, Vue } from 'vue-property-decorator';
import ActionInsertDelete from './action-insert-delete.vue';
import ActionUpdated from './action-updated.vue';
import * as dataType from './typings/data-rule';
@Component({
  name: 'data-rule-info-detail',
  components: {
    ActionInsertDelete,
    ActionUpdated,
    ARow: Row,
    ACol: Col,
    ADivider: Divider,
  },
})
export default class DataRuleInfoDetail extends Vue {
  @Prop() id!: string;

  detailData: any = {};

  // 动作类型
  actionType: dataType.ActionType = dataType.ActionType.Insert;

  // 触发动作数据
  // triggerObj = '';

  getDetail(id: string) {
    if (!id) {
      return;
    }
    const vm: any = this;
    systemManageApi.getBizRuleLogDetail(id).then((res) => {
      if (res.errcode === 0) {
        vm.detailData = res.data;
        vm.actionType = res.data.triggerActionType;
      }
    });
  }

  created() {
    this.getDetail(this.id);
  }

  get triggerObj() {
    const detailData: any = this.detailData;
    const type: dataType.TableType = detailData.triggerTableType;
    if (!detailData.triggerMainObjectId) {
      return '';
    } else {
      switch (type) {
        case dataType.TableType.MainSheet:
          return `${detailData.triggerMainObjectName}(${detailData.triggerMainObjectId})`;
        default:
          return `主表${detailData.triggerMainObjectName}(${detailData.triggerMainObjectId}) 下id为 ${detailData.triggerObjectId}的数据`;
      }
    }
  }
}
</script>
<style lang="less" scoped>
.data-rule-info-detail {
  &-title {
    font-weight: 600;
    color: #111218;
    line-height: 22px;
    margin-bottom: 16px;
  }
  &-msg {
    /deep/.ant-row {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      .info-label {
        color: rgba(17, 18, 24, 0.5);
      }
    }
  }
  &-implementstate {
    /deep/.ant-row {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      .info-label {
        color: rgba(17, 18, 24, 0.5);
      }
    }
  }
}
</style>
