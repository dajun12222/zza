<template>
  <div class="indexSearch">
    <div class="indexSearchGroup">
      <div
        :class="
          searchList && searchList.searchClass
            ? 'groupDiv groupSpace'
            : 'groupDiv'
        "
      >
        <a-input
          v-model="title"
          :placeholder="ph ? ph : '请输入关键字'"
          class="indexInput"
          @keyup.enter="toSearch"
        />
        <a-date-picker
          v-if="searchList && searchList.searchClass"
          v-model="startDate"
          class="indexDate"
          @change="changeStartDate"
        />
        <span
          v-if="searchList && searchList.searchClass"
          style="color: rgb(217, 217, 217); line-height: 40px"
          >—</span>
        <a-date-picker
          v-if="searchList && searchList.searchClass"
          v-model="endDate"
          class="indexDate"
          @change="changeEndDate"
        />
        <a-select
          v-if="searchList && searchList.searchClass"
          ref="select"
          style="width: 120px"
          :value="sourceType"
          @change="changeSelect"
        >
          <a-select-option value="全部">全部</a-select-option>
          <a-select-option value="内部数据">内部数据</a-select-option>
          <a-select-option value="外部数据">外部数据</a-select-option>
        </a-select>
        <a-button type="primary" size="small" @click="toSearch">检索</a-button>
      </div>
    </div>
    <div
      v-if="searchList && (searchList.searchClass || searchList.searchTag)"
      class="searchTag"
    >
      <p style="min-width: 60px">检索条件：</p>
      <div>
        <a-tag
          v-for="item in searchList.objData"
          :key="item.typeId"
          closable
          class="indexTag"
          :typeId="item.typeId"
          @close="closeTag(item)"
        >
          {{ item.name1 }} ：{{ item.name2 ? item.name2 : item.name1 }}
        </a-tag>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { Input, DatePicker, Select, Button, Tag } from '@h3/antd-vue';
import { prop } from 'lodash/fp';
@Component({
  name: 'searchList',
  components: {
    AInput: Input,
    ADatePicker: DatePicker,
    ASelect: Select,
    ASelectOption: Select.Option,
    AButton: Button,
    ATag: Tag,
  },
})
export default class searchList extends Vue {
  @Prop() searchList?: any;

  @Prop() ph?: '';

  title: string = ''; //关键词

  sourceType: string = '全部'; //数据来源

  startDate: any = null;

  endDate: any = null;

  changeStartDate(fn, date) {
    this.startDate = date;
  }

  changeEndDate(fn, date) {
    this.endDate = date;
  }

  changeSelect(val) {
    this.sourceType = val;
  }

  toSearch() {
    let option = {
      title: this.title,
      sourceType: this.sourceType === '全部' ? '' : this.sourceType,
      startDate: this.startDate,
      endDate: this.endDate,
    };
    this.$emit('searchInfo', option);
  }

  closeTag(data) {
    let index = this.searchList.objData.findIndex((item) => {
      return item['name1'] === data['name1'];
    });
    if (index > -1) {
      this.searchList.objData.splice(index, 1);
    }
    this.$emit('tagClose', data.typeId);
  }
}
</script>
<style lang="less" scoped>
.indexSearch {
  background: #fff;
  margin: 0 0 24px;
  padding: 12px;
  border-radius: 2px;
  .indexSearchGroup {
    display: flex;
    justify-content: space-between;
    .groupSpace {
      justify-content: space-evenly;
    }
    .groupDiv {
      width: 100%;
      padding: 0 12px;
      display: flex;
      align-items: center;
      .indexInput {
        width: 33%;
        height: 40px;
        font-size: 16px;
      }
      .indexDate {
        width: 18%;
      }
      /deep/.ant-input {
        height: 40px;
        font-size: 16px;
      }
      /deep/.ant-select-selection {
        height: 40px;
      }
      /deep/.ant-select-selection-selected-value {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
      }
      /deep/.ant-btn {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
      }
    }
  }
  .searchTag {
    display: flex;
    align-items: center;
    margin-top: 20px;
    font-size: 12px;
    padding: 0 12px;
    p {
      color: rgba(0, 0, 0, 0.85);
    }
    .indexTag {
      color: #096dd9;
      background: #e6f7ff;
      border-color: #91d5ff;
      border-radius: 2px;
      margin-bottom: 5px;
    }
    /deep/.anticon-close {
      color: #096dd9;
    }
  }
}
</style>
