<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div>
    <a-select
      v-if="!readonly"
      showSearch
      :value="val"
      :mode="mode"
      style="width: 100%"
      :allowClear="true"
      :disabled="readonlyFormula"
      :maxTagCount="control.maxTagCount"
      :getPopupContainer="Cus_GetPopupContainer"
      :placeholder="hasEmpty ? emptyValue : placeholder"
      :class="{
        'batch-import-select-not-value': hasSelectBatchImport,
        'ellipsis-text': control.ellipsisText,
      }"
      @change="onChange"
      @focus="getOPt"
      @search="handleSearch"
      @popupScroll="onPopupScroll"
    >
      <a-select-option v-if="hasEmpty" key="" :disabled="true">
        {{ emptyValue }}
      </a-select-option>

      <a-select-option
        v-for="(opt, index) in duplicateRemovalOptions"
        :key="opt"
        :disabled="disableds[index]"
      >
        <span :title="opt" class="select-drop-item">{{ opt }}</span>
        <!-- <a-tooltip :title="opt">
        <div class="h3-from-select-opinion">{{ opt }}</div>
      </a-tooltip> -->
      </a-select-option>
    </a-select>
    <!-- </div> -->

    <div v-else class="items">
      <span v-if="!multiple">{{ text }}</span>

      <template v-else>
        <!-- <span v-for="(x, index) in val" :key="index">{{ x }}</span> -->
        {{ text }}
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Select, Tooltip } from '@h3/antd-vue';
import { Component } from 'vue-property-decorator';
import { DropdownControl } from '../control/dropdown-control';
import { dictionaryApi } from 'cloudpivot/api';

@Component({
  name: 'dropdownMulti',
  components: {
    ATooltip: Tooltip,
    ASelect: Select,
    ASelectOption: Select.Option,
  },
})
export default class dropdownMulti extends DropdownControl {
  currentPage: number = 0; //当前页码

  searchValue: string = ''; //模糊搜索输入值

  Cus_GetPopupContainer(triggerNode) {
    return (this.control as any).isQuery
      ? document.body
      : triggerNode.parentNode;
  }

  onChange(val: any[]) {
    this.hasSelectBatchImport = false;
    if (val && val.length > 0) {
      this.setValue(Array.isArray(val) ? val.slice() : val);
    } else {
      this.ctrl.value = null;
    }
    this.val = val;
    //模糊搜索有值时
    if (this.searchValue) {
      this.searchValue = '';
      this.currentPage = 0;
      super.getOptions(this.currentPage, '');
    }

    if (!this.multiple) {
      return;
    }
    super.resetDisableds();
  }

  /**
   * 下拉框查询事件
   */
  handleSearch(value) {
    this.searchValue = value;
    this.currentPage = 0;
    super.getOptions(this.currentPage, value);
  }

  /**
   * 下拉框滚动回调事件
   */
  onPopupScroll(e) {
    //数据字典数据类型不执行滚动加载
    if (this.control.options.dictionariesData) {
      return;
    }
    const isJson = this.isJSON(this.controlOpts.options);
    //自定义数据类型不执行滚动加载
    if (!isJson) {
      return;
    }
    const { target } = e;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      const isDropDownScrollComplete = localStorage.getItem(
        'isDropDownScrollComplete',
      );
      console.log(
        '业务数据滚动加载是否完成isDropDownScrollComplete：',
        isDropDownScrollComplete,
      );
      if (isDropDownScrollComplete && isDropDownScrollComplete === 'true') {
        return;
      }
      this.currentPage++;
      super.getOptions(this.currentPage, this.searchValue);
    }
  }

  isJSON(str) {
    if (typeof str === 'string') {
      try {
        var obj = JSON.parse(str);
        if (typeof obj === 'object' && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  }

  getOPt() {
    localStorage.setItem('isDropDownScrollComplete', 'false');
    this.currentPage = 0;
    // super.getOptions(this.currentPage, '');
    // 如果是单选，复选的业务模型 , 3种数据格式
    if (this.control.type === 19) {
      //console.log(JSON.parse(this.control.options.options))
      if (this.control.options) {
        const data =
          this.control.options.options || this.control.options.labels;
        if (!data) {
          if (this.control.options.dictionariesData) {
            try {
              const dictionariesData: any = JSON.parse(
                this.control.options.dictionariesData,
              );
              if (
                dictionariesData.useDictionariesData &&
                dictionariesData.useDictionariesData.length
              ) {
                return dictionariesData.useDictionariesData.map(
                  (el) => el.name,
                );
              } else {
                dictionaryApi
                  .getEnableRecordsByDictionaryId({
                    dicId: dictionariesData.checkedDictionary,
                  })
                  .then((res: any) => {
                    if (res.errcode === 0) {
                      const resData: any[] = res.data || [];
                      this.options = resData.map((el) => el.name);
                    } else {
                      return [];
                    }
                  });
              }
            } catch (error) {
              return [];
            }
          } else {
            return [];
          }
        } else if (data.indexOf('schemaCode') !== -1) {
          console.log(JSON.parse(data));
          if (JSON.parse(data).labels && JSON.parse(data).labels.length > 0) {
            const sheetDataItem = JSON.parse(data).sheetDataItem;
            const labels = JSON.parse(data).labels;
            const options = labels.map((item) => {
              return item.data[sheetDataItem];
            });
            this.control.options.options = options.join(';');
          } else {
            super.getOptions(this.currentPage, '');
          }
        } else {
          try {
            if (
              JSON.parse(JSON.parse(data).options).labels &&
              JSON.parse(JSON.parse(data).options).labels.length > 0
            ) {
              const sheetDataItem = JSON.parse(
                JSON.parse(data).options,
              ).sheetDataItem;
              const labels = JSON.parse(JSON.parse(data).options).labels;
              const options = labels.map((item) => {
                return item.data[sheetDataItem];
              });
              this.control.options.options = options.join(';');
            } else {
              super.getOptions(this.currentPage, '');
            }
          } catch (error) {
            this.options = typeof data === 'string' ? data.split(';') : data;
          }
        }
      }
    } else {
      super.getOptions(this.currentPage, '');
    }
  }

  clearOption(change: any) {
    this.options = [];
    this.ctrl.value = null;
  }

  destroyed() {
    super.destroyed();
  }
}
</script>

<style lang="less">
.h3-from-select-opinion {
  display: inline-block;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
}
.ant-tooltip {
  max-width: 800px;
}
.items {
  word-break: break-all;
}
.batch-import-select-not-value .ant-select-selection {
  border-color: #f5222d;
  border-right-width: 1px !important;
  outline: 0;
  // box-shadow: 0 0 20px rgba(245, 34, 45, 0.2);
}
// .items > span::after {
//   // margin-right: 0.5em;
//   content: ";";
// }
.has-form-border {
  .dropdownmulti {
    div {
      height: 32px;
      .items{
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 10px;
      }
    }
    .ant-select-selection--single .select-drop-item {
      // line-height: 50px;
    }
  }
}
.ant-select-selection--multiple {
  border-radius: 2px;
}
.ellipsis-text {
  .ant-select-selection__choice__content span {
    display: inline-block;
    text-overflow: ellipsis;
    max-width: 75px;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
