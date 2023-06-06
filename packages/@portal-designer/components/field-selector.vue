<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="set-sort-field">
    <a-select
      class="field-select"
      dropdownClassName="field-select-item-list"
      :disabled="disabled"
      :value="selectField ? selectField.value : ''"
      :getPopupContainer="Cus_GetPopupContainer"
      @change="valueChange"
    >
      <a-select-option
        v-for="option in sortFieldDataSouce"
        :key="option.value"
        class="field-select-item"
        :disabled="isDisabled(option)"
      >
        {{ option.name }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch, Vue } from 'vue-property-decorator';

import { Select } from '@h3/antd-vue';

import { listApi } from 'cloudpivot/api';

@Component({
  name: 'field-selector',
  components: {
    ASelect: Select,
    ASelectOption: Select.Option,
  },
})
export default class FieldSelector extends Vue {
  @Prop()
  field!: any;

  @Prop()
  dataSource!: string; //数据源类型

  @Prop()
  bizModel!: string; //模型编码

  @Prop({
    default: () => {
      return [];
    },
  })
  ignoreDataItem!: any[]; //排除的数据项类型

  @Prop({
    default: () => {
      return [];
    },
  })
  fieldList?: any; //当前已经选中的展示字段数据项

  @Prop({ default: false })
  displayFieldInput?: boolean; //当前渲染的组件是在显示字段属性下还是排序字段下

  @Prop({ default: false })
  disabled: boolean;

  selectField: any = {};

  @Prop({
    default: () => {
      return [];
    },
  })
  fieldDataSource!: any[]; // 当前组件下拉框选项的数据源

  sortFieldDataSouce: any = [];

  Cus_GetPopupContainer(triggerNode) {
    return triggerNode.parentNode;
  }

  sortChange() {
    this.$emit('emitChange', this.selectField);
  }

  created() {
    this.selectField = this.field;
    this.fieldDataSourceChange();
  }

  @Watch('field', { immediate: true })
  onValueChange(val) {
    this.selectField = this.field;
  }

  @Watch('dataSource', { immediate: true })
  dataSourceChange(val) {
    this.selectField = this.field || undefined;
    this.fieldDataSourceChange();
  }

  @Watch('fieldList', { immediate: true })
  fieldListChange(val) {
    if (!this.displayFieldInput) {
      //显示字段为空时清空排序字段已选择的值
      if (this.fieldList.length === 0) {
        this.selectField = undefined;
      }
      this.fieldDataSourceChange();
    }
  }

  @Watch('bizModel', { immediate: true })
  bizModelChange(val) {
    if (this.dataSource === 'bizModel') {
      this.selectField = this.field || undefined;
      this.fieldDataSourceChange();
    }
  }

  @Watch('fieldDataSource', { immediate: true })
  fieldDataSourceChange(val?) {
    switch (this.dataSource) {
      case 'bizModel':
        this.bizModalField();
        break;
      case 'myUnfinished':
      case 'myFinished':
      case 'myRead':
      case 'myUnread':
      case 'myStart':
        this.workflowField();
        break;
      default:
        break;
    }
  }

  bizModalField() {
    if (this.fieldDataSource.length) {
      this.sortFieldDataSouce = this.fieldDataSource.filter((item) => {
        return (
          !~this.ignoreDataItem.indexOf(item.type) &&
          item.value !== 'ownerDeptQueryCode'
        );
      });
      if (this.sortFieldDataSouce.length) {
        if (
          !this.selectField ||
          !~this.sortFieldDataSouce.findIndex(
            (el) => el.value === this.selectField.value,
          )
        ) {
          if (!this.displayFieldInput) {
            this.selectField = this.sortFieldDataSouce[0];
          } else {
            const newField = this.sortFieldDataSouce.find((el) => {
              return !~this.fieldList.findIndex(
                (item) => item.value === el.value,
              );
            });
            this.selectField = newField;
          }
          this.sortChange();
        }
      } else {
        this.selectField = undefined;
      }
    } else {
      this.sortFieldDataSouce = [];
    }
  }

  workflowField() {
    if (!this.displayFieldInput) {
      this.sortFieldDataSouce = [
        {
          value: 'receiveTime',
          name: '接收时间',
          name_i18n: null,
          type: 0,
        },
      ];
      this.selectField = this.sortFieldDataSouce[0];
    } else {
      if (this.fieldDataSource.length) {
        if (!this.selectField) {
          const newField = this.fieldDataSource.find((el) => {
            return !~this.fieldList.findIndex(
              (item) => item.value === el.value,
            );
          });
          this.selectField = newField;
          this.sortChange();
        }
        this.sortFieldDataSouce = this.fieldDataSource;
      }
    }
  }

  valueChange(val) {
    const newField = this.sortFieldDataSouce.find((el) => el.value === val);
    this.selectField = newField;
    this.sortChange();
  }

  isDisabled(option) {
    if (!this.displayFieldInput) {
      return false;
    } else {
      return !!(
        ~this.fieldList.findIndex((el) => el.value === option.value) &&
        option.value !== this.field.value
      );
    }
  }
}
</script>

<style lang="less" scoped>
.set-sort-field {
  height: 30px;
  .field-select {
    width: 100%;
    height: 30px;
    /deep/.ant-select-selection--single {
      height: 30px;
    }
  }
}
</style>
<style lang="less">
.Pt-4 {
  padding-top: 4px;
}
.field-select-item-list {
  .field-select-item.ant-select-dropdown-menu-item-disabled {
    color: rgba(17, 18, 24, 0.25);
  }
}
</style>
