<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="query-conditions-prop">
    <div class="setting-icon-box">
      <span
        class="setting-icon aufontAll h-icon-all-setting-o"
        title="设置"
        @click="openSettingModal"
      ></span>
    </div>
    <div v-if="queryConditionsList.length" class="prop-value-display">
      <div class="prop-value" @click="openSettingModal">
        <span>{{ queryConditionsList.length ? '已设置' : '未设置' }}</span>
      </div>
      <div class="delete-icon-box">
        <span
          class="delete-icon aufontAll h-icon-all-delete1"
          title="删除"
          @click="clearSetting"
        ></span>
      </div>
    </div>
    <query-conditions-setter-modal
      v-model="showSettingModal"
      :conditionsList="queryConditionsList"
      :dataSource="dataSource"
      :bizModel="bizModel"
      @closeModal="closeSettingModal"
      @confirm="listChange"
    />
  </div>
</template>
<script lang="ts">
import { Component, Mixins, Prop, Watch, Vue } from 'vue-property-decorator';

import QueryConditionsSetterModal from './query-conditions-setter-modal.vue';

@Component({
  name: 'query-conditions-setter',
  components: {
    QueryConditionsSetterModal,
  },
})
export default class QueryConditionsSetter extends Vue {
  @Prop({ default: '' })
  value!: string;

  @Prop({ default: '' })
  dataSource!: string;

  @Prop({ default: '' })
  bizModel!: string;

  queryConditionsList: any = [];

  showSettingModal: boolean = false;

  listChange(val) {
    if (!this.isValueNull(val)) {
      this.$emit('valueChange', JSON.stringify(val));
    } else {
      this.$emit('valueChange', '');
    }
    this.closeSettingModal();
  }

  created() {
    this.queryConditionsList = JSON.parse((this.value as any) || '[]');
  }

  @Watch('value', { immediate: true })
  onValueChange(val: string) {
    this.queryConditionsList = JSON.parse(val || '[]');
  }

  clearSetting() {
    this.queryConditionsList = [];
    this.$emit('valueChange', '');
  }

  openSettingModal() {
    if (this.bizModel) {
      this.showSettingModal = true;
      this.queryConditionsList = JSON.parse((this.value as any) || '[]');
    } else {
      this.$message.warning('请先选择业务模型');
    }
  }

  closeSettingModal() {
    this.showSettingModal = false;
  }

  isValueNull(data) {
    if (Array.isArray(data)) {
      return data.every((l) => !(Array.isArray(l) && l.length));
    } else {
      return true;
    }
  }
}
</script>
<style lang="less" scoped>
.query-conditions-prop {
  position: relative;
  .setting-icon-box {
    position: absolute;
    right: 0;
    top: -24px;
    .setting-icon {
      font-size: 14px;
      color: #000000;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .prop-value-display {
    display: flex;
    align-items: center;
    .prop-value {
      height: 30px;
      line-height: 20px;
      background: #f1f2f6;
      border-radius: 2px;
      margin-right: 8px;
      padding: 5px 8px;
      width: 100%;
      cursor: pointer;
    }
    .delete-icon-box {
      width: 16px;
      height: 30px;
      min-width: 16px;
      line-height: 30px;
      color: rgba(17, 18, 24, 0.5);
      &:hover {
        cursor: pointer;
        color: #2970ff;
      }
    }
  }
}
</style>
