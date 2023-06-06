<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="query-conditions-group">
    <div v-if="index" class="query-conditions-group-line">
      <span>或</span>
    </div>
    <div class="query-conditions-group-box">
      <div class="conditions-title">
        <div class="query-field">
          <span>数据项名称</span>
        </div>
        <div class="query-type">
          <span>对比方式</span>
        </div>
        <div class="query-value">
          <span>值</span>
        </div>
      </div>
      <template v-for="(control, idx) in useFields">
        <query-conditions-item
          :key="`${control.key}_${time}`"
          :ref="`item_${idx}`"
          :control="control"
          :dataItemControls="dataItemControls"
          :index="idx"
          @delFieldItem="delFieldItem"
          @valueChange="valueChange"
          @fieldChange="fieldChange"
          @conditionChange="conditionChange"
        />
      </template>
      <div class="add-condition">
        <span @click="addFieldItem(false)">
          <span class="add-and-icon aufontAll h-icon-all-plus-o"></span>
          <span>添加且条件</span>
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import QueryConditionsItem from './query-conditions-item.vue';

@Component({
  name: 'query-conditions-group',
  components: {
    QueryConditionsItem,
  },
})
export default class QueryConditionsGroup extends Vue {
  @Prop({
    default: () => {
      return [];
    },
  })
  dataConditions: any[];

  @Prop({
    default: () => {
      return [];
    },
  })
  dataItemControls: any[];

  @Prop() index!: number;

  cur_controls: any[] = [];

  useFields: any[] = [];

  time: number = new Date().getTime();

  fieldChange(data) {
    const dataItemControl = this.dataItemControls.find(
      (el) => el.key === data.key,
    );

    this.useFields[data.index] = JSON.parse(JSON.stringify(dataItemControl));
    this.time = new Date().getTime();
  }

  conditionChange(data) {
    this.useFields[data.index] = data.control;
    this.time = new Date().getTime();
  }

  valueChange() {
    // this.$emit('valueChange');
    this.getData();
  }

  delFieldItem(propertyCode, index) {
    this.useFields.splice(index, 1);
    this.time = new Date().getTime();

    if (this.useFields.length === 0) {
      // 没有字段之后删除组
      this.$emit('delGroup', this.index);
    }

    // this.$emit('valueChange');
  }

  getValue() {
    return this.getData();
  }

  getData() {
    const res: any[] = [];
    this.useFields.forEach((el, index) => {
      const ref: any =
        this.$refs['item_' + index] && this.$refs['item_' + index][0];
      if (ref && ref.getValue) {
        const ResVal = ref.getValue();
        res.push(ResVal);
      }
    });
    return res;
  }

  addFieldItem(el?: any) {
    if (el) {
      this.useFields.push(el);
    } else {
      const item = JSON.parse(JSON.stringify(this.dataItemControls[0]));
      this.useFields.push(item);
    }
  }

  created() {
    this.cur_controls = [...this.dataConditions];

    this.cur_controls.forEach((el) => {
      this.addFieldItem(el);
    });
  }

  getConditions() {
    return this.useFields;
  }
}
</script>
<style lang="less" scoped>
.query-conditions-group {
  &-line {
    text-align: center;
    height: 22px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    margin: 12px 0;
    position: relative;
    &::before {
      content: '';
      width: 268px;
      border-top: 1px solid #d8d8d8;
      display: block;
      position: absolute;
      top: 11px;
      left: 0;
    }
    &::after {
      content: '';
      width: 268px;
      border-top: 1px solid #d8d8d8;
      display: block;
      position: absolute;
      top: 11px;
      right: 0;
    }
  }
  &-box {
    width: 592px;
    background: #f1f2f6;
    border-radius: 4px;
    padding: 16px 24px;
    .conditions-title {
      display: flex;
      align-items: center;
      padding-bottom: 8px;
      .query-field {
        margin-right: 8px;
        width: 206px;
        height: 22px;
        font-size: 12px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
      }
      .query-type {
        margin-right: 8px;
        width: 88px;
        height: 22px;
        font-size: 12px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
      }
      .query-value {
        margin-right: 12px;
        width: 206px;
        height: 22px;
        font-size: 12px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
      }
    }
    .add-condition {
      height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #2970ff;
      line-height: 22px;
      margin: 0 auto;
      text-align: center;
      margin-top: 12px;
      > span {
        cursor: pointer;
        .add-and-icon {
          font-size: 12px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
