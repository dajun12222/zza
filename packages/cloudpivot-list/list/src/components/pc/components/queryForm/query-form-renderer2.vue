<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="query-renderer">
    <div class="query-type">
      <span>{{ $t('cloudpivot.list.pc.filterBox.filterTip1') }}</span>
      <a-select
        v-model="queryType"
        :placeholder="$t('languages.PlaceHolder.Select')"
        class="select"
        @change="queryTypeChange"
      >
        <a-select-option key="1" :value="1">
          {{ $t('cloudpivot.list.pc.filterBox.all') }}
        </a-select-option>
        <a-select-option key="0" :value="0">
          {{ $t('cloudpivot.list.pc.filterBox.any') }}
        </a-select-option>
      </a-select>
      <span>{{ $t('cloudpivot.list.pc.filterBox.filterTip2') }}</span>
    </div>
    <div id="scroll-box-mix" class="scroll-box">
      <template v-for="(item, index) in queryGroup">
        <queryFieldGroup
          :ref="'group_' + index"
          :key="time + '-' + index"
          :controls="item"
          :index="index"
          :isReset="isReset"
          :isRelevance="isRelevance"
          @valueChange="valueChange"
          @resetOver="resetOver"
          @delGroup="delGroup"
        />
      </template>
    </div>

    <div :class="{ disabled: queryGroup.length >= 10 }" class="btn-group">
      <div class="btn-right">
        <a-button class="btn" @click="clear">{{
          $t('cloudpivot.list.pc.filterBox.clear')
        }}</a-button>
        <a-button class="btn" type="primary" @click="queryValue">{{
          $t('cloudpivot.list.pc.filterBox.filter')
        }}</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Button, Icon, Select } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch, Provide } from 'vue-property-decorator';
import { listApi } from 'cloudpivot/api';
import { renderer } from 'cloudpivot-form/form';
import formPc from 'cloudpivot-form/form/src/renderer/components/pc';
import zhToEn from '../../locales/zhToEn';
import * as ControlFactory from '../../helper/control-factory';
import { DataItemType } from 'cloudpivot-form/form/schema';

import { toFormControl, toFormControlType } from './query-form-util';

import queryFieldGroup from './query-field-group2.vue';

@Component({
  name: 'QueryFormRenderer',
  components: {
    PcFormRenderer: formPc.FormRenderer,
    AButton: Button,
    AIcon: Icon,
    queryFieldGroup,
    ASelect: Select,
    ASelectOption: Select.Option,
  },
})
export default class QueryFormRenderer extends Vue {
  @Provide()
  getController() {
    return this.controls[0];
  }

  @Provide()
  getFormControls(keys?: string[]) {
    return this.controls;
  }

  @Provide()
  valChange(keys: string, fun: Function) {}

  @Provide()
  getDataItem(keys: string, parentKey?: string) {
    return this.controls.find((el) => el.key === keys);
  }

  @Provide()
  async getRelativeDataList(isList?: boolean) {
    if (!this.relevanceDataList || !this.relevanceDataList.length) {
      let { schemaCode } = this.$route.params;
      if (!schemaCode) {
        schemaCode = this.$route.params.bizSchemaCode;
      }
      if (!schemaCode) {
        schemaCode = this.$route.query.schemaCode as string;
      }
      if (!schemaCode) {
        return;
      }
      const res = await listApi.getDataItemList({
        schemaCode,
      });
      const { errcode, errmsg, data } = res;
      if (errcode === 0) {
        return data;
      } else {
        this.$message.error(errmsg as string);
      }
    }
    return this.relevanceDataList;
  }

  @Provide()
  getSourceType() {
    return;
  }

  @Provide()
  layoutTypeFn() {
    return localStorage.getItem('layoutType') === 'vertical'; //使用本地缓存 防止上下布局发布时渲染数据先左右布局
  }

  @Prop()
  fields!: any[];

  @Prop()
  dataItemList!: any[];

  @Prop({
    default: 3,
  })
  cols!: number;

  @Prop()
  relevanceDataList!: [];

  @Prop()
  GroupControlers?: any[];

  @Prop() vm!: any;

  @Prop() isRelevance!: boolean;

  @Prop({ default: 1 }) conditionType?: number;

  queryType: number = 1;

  time: any = new Date().getTime();

  isReset: boolean = false;

  timer: any = null;

  @Watch('GroupControlers')
  onGroupControlersChange(val) {
    let groupControlers = JSON.parse(JSON.stringify(val));

    if (groupControlers.length > 1) {
      this.queryType = 0;
      if (this.queryType !== this.conditionType) {
        this.queryType = this.conditionType;
      }
    } else {
      this.queryType = 1;
      if (this.queryType !== this.conditionType) {
        this.queryType = this.conditionType;
      }
    }
    groupControlers =
      groupControlers && groupControlers.length > 0
        ? [groupControlers.flat()]
        : [];
    this.isReset = true;
    this.time = new Date().getTime();

    const group = [];
    if (Array.isArray(groupControlers) && groupControlers.length > 0) {
      groupControlers.forEach((el) => {
        const controls: any[] = JSON.parse(JSON.stringify(this.controls));
        const res: any[] = [];
        controls.forEach((item) => {
          const ctrl = el.find((x) => x.key === item.key);
          if (ctrl) {
            ctrl.isUsed = true;
            res.push(ctrl);
          } else {
            item.isUsed = false;
            res.push(item);
          }
        });
        group.push(res);
        let sorts: number = 0;
        el.forEach((y) => {
          for (const con of group) {
            for (let i = 0; i < con.length; i++) {
              if (con[i].key === y.key) {
                con[i].sorts = sorts;
                sorts++;
              }
            }
          }
        });
      });
    } else if (Array.isArray(groupControlers) && groupControlers.length === 0) {
      const controls: any[] = JSON.parse(JSON.stringify(this.controls));
      const res: any[] = [];
      controls.forEach((item) => {
        item.isUsed = false;
        res.push(item);
      });
      group.push(res);
    } else {
      //Else Empty block statement
    }

    this.queryGroup = group;

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.query();
    }, 300);
  }

  resetOver(index: number) {
    if (index === this.GroupLen - 1) {
      this.isReset = false;
    }
  }

  @Watch('fields', {
    immediate: true,
  })
  async setFields(fields: any[]) {
    //如果是Admin端调用的
    if (this.vm && this.vm.isFromAdmin) {
      this.init();
    }
  }

  queryGroup: any[] = [];

  get GroupLen() {
    return this.queryGroup.length;
  }

  delGroup(index) {
    if (this.queryGroup.length > 1) {
      const queryGroup = this.getGroupControler();
      queryGroup.splice(index, 1);
      this.onGroupControlersChange(queryGroup);
    }
  }

  addGroup(type?: any) {
    if (this.GroupLen >= 10) {
      return;
    }
    const controls: any[] = JSON.parse(JSON.stringify(this.controls));
    controls.forEach((el, index) => {
      if (type === 'init') {
        el.isUsed = true;
      } else {
        if (index === 0) {
          el.isUsed = true;
        } else {
          el.isUsed = false;
        }
      }
    });
    this.queryGroup.push(controls);
    this.$nextTick(() => {
      const scrollBox = document.querySelector('#scroll-box-mix');
      if (scrollBox) {
        scrollBox.scrollTop = scrollBox.scrollHeight;
      }
    });
  }

  valueChange() {
    this.$emit('valueChange');
  }

  queryTypeChange(val) {
    this.queryType = val;
    this.$emit('valueChange', val);
  }

  clear() {
    this.queryGroup.forEach((el, index) => {
      const ref: any =
        this.$refs['group_' + index] && this.$refs['group_' + index][0];
      if (ref && ref.clearValue) {
        const ResVal = ref.clearValue();
      }
    });
    this.getGroupValue();
  }

  queryValue() {
    const res = this.getGroupValue();
    this.$emit('query', res, this.queryType);
  }

  getGroupValue() {
    let res: any[] = [];
    this.queryGroup.forEach((el, index) => {
      const ref: any =
        this.$refs['group_' + index] && this.$refs['group_' + index][0];
      if (ref && ref.getValue) {
        const ResVal = ref.getValue();
        res.push(ResVal);
      }
    });

    switch (this.queryType) {
      case 1:
        res = [res.flat()];
        break;
      case 0:
        if (res.length === 1) {
          res = res[0].map((item: any) => {
            return [item];
          });
        }
        break;
      default:
        break;
    }
    return res;
  }

  // 获取所有分组Controler
  getGroupControler() {
    const res: any[] = [];
    this.queryGroup.forEach((el, index) => {
      const ref: any =
        this.$refs['group_' + index] && this.$refs['group_' + index][0];
      if (ref && ref.getControler) {
        const ResVal = ref.getControler();
        res.push(ResVal);
      }
    });
    return res;
  }

  // 获取并生成所有可使用的控件
  async getControllers() {
    if (!this.fields || !this.fields.length) {
      return;
    }

    let { schemaCode } = this.$route.params;
    if (!schemaCode) {
      schemaCode = this.$route.params.bizSchemaCode;
    }
    if (!schemaCode) {
      schemaCode = this.$route.query.schemaCode as string;
    }
    let res: any = {};
    if (schemaCode) {
      res = await listApi.getDataItemList({
        schemaCode,
      });
    }

    const controls: any = {};
    this.fields.forEach((field: any) => {
      // 工单——#105129 20230224--关联单选弹出框下拉数据项作为查询条件不是下拉框-建发-6.11/6.12/develop  https://rdmp.authine.cn/project/#/team/LSY1vbUE/task/SDocKmVzb10a33d2
      // if (
      //   this.$route.name === 'form-detail' &&
      //   [
      //     renderer.DataItemType.Radio,
      //     renderer.DataItemType.Checkbox,
      //     renderer.DataItemType.Dropdown,
      //     renderer.DataItemType.DropdownMulti,
      //   ].includes(field.propertyType)
      // ) {
      //   // 关联表单的查询条件中涉及到下拉框单选多选、单选、复选时，无论设置的常量还是变量，在组合查询运行时都展示为输入框
      //   field.displayType = 0;
      // }

      const source = this.dataItemList.find(
        (d) => d.code === field.propertyCode,
      );

      if (source && source.options && field.options === undefined) {
        field.options = source.options;
        let dictionaryData = JSON.parse(field.options);
        if (
          !dictionaryData.dictionaryData &&
          dictionaryData.options &&
          dictionaryData.options.includes('checkedDictionary')
        ) {
          dictionaryData = JSON.parse(dictionaryData.options);
        }
        if (dictionaryData && dictionaryData.checkedDictionary) {
          // 单选、多选、下拉单选、下拉多选使用了数据字典数据
          const resOptions = dictionaryData.useDictionariesData.map(
            (el: any) => el.name,
          );
          field.options = resOptions.join(';');
          field.dictionariesData = JSON.stringify(dictionaryData);
        } else if (dictionaryData && dictionaryData.dictionaryData) {
          console.log('33', dictionaryData);
        } else if (dictionaryData.options) {
          field.options = dictionaryData.options;
        } else {
          //Else Empty block statement
        }
      }

      const control = toFormControl(field);

      if (source) {
        control.options.displayField = source.relativePropertyCode;
      }

      // 关联表单设置可见字段
      if (control.type === 80) {
        try {
          control.options.relativePropertyCode = res.data.filter(
            (el: any) => control.key === el.code,
          )[0]['relativePropertyCode'];
        } catch (error) {}
      }
      // @ts-ignore
      control.edit = true;
      controls[field.propertyCode] = control;
      if (this.isRelevance) {
        if (
          [
            DataItemType.Checkbox,
            DataItemType.Radio,
            DataItemType.Dropdown,
            DataItemType.DropdownMulti,
          ].includes(control.propertyType)
        ) {
          const controler: any = control;
          controler.type = renderer.FormControlType.Text;
          if (Array.isArray(controler.options.defaultValue)) {
            controler.options.defaultValue =
              controler.options.defaultValue.join(';');
          }
          controler.value = controler.options.defaultValue;
        }
      }
    });

    renderer.components.FormRendererHelper.mergeValue(
      Object.values(controls),
      {},
      true,
    );
    this.controls = Object.values(controls);
  }

  getControls() {
    return this.controls;
  }

  async init() {
    // this.$emit("getRelevanceDataList");
    await this.getControllers();
    this.queryGroup = [];
    this.time = new Date().getTime();
    this.queryType = this.conditionType;
    this.addGroup('init');
    setTimeout(() => {
      this.query();
    }, 100);
  }

  controls = [] as any;

  collapsed = true;

  daily = false;

  loadFirst: boolean = true;

  // 查询
  query(isInit?: boolean) {
    if (this.loadFirst) {
      this.loadFirst = false;
    } else {
      return;
    }
    const res = this.getGroupValue();
    this.$emit('query', res);
  }

  findControl(key: string) {
    const formRenderer = this.$refs.formRenderer as any;
    if (formRenderer) {
      const ctrl = formRenderer.controller.findChild(key);
      return ctrl;
    }
  }

  backWriteData(value: any) {
    const formRenderer = this.$refs.formRenderer as any;
    if (formRenderer) {
      formRenderer.controller.value = value;
    }
  }

  closeQueryItem() {
    this.$emit('hide');
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';

.query-renderer {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 202px);
  .query-type {
    padding: 0 24px;
    height: 22px;
    font-size: 14px;
    font-weight: 400;
    color: #111218;
    line-height: 22px;
    display: flex;
    align-items: center;
    .select {
      height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: @highlightColor;
      line-height: 22px;
      /deep/.ant-select-selection--single {
        border: unset;
        height: 20px;
        box-shadow: unset;
        .ant-select-selection__rendered {
          margin-left: 8px;
          margin-right: 21px;
          height: 22px;
          .ant-select-selection-selected-value {
            height: 22px;
            line-height: 22px;
          }
        }
        .ant-select-arrow {
          right: 8px;
          color: @highlightColor;
        }
      }
    }
  }
}
.btn-group {
  height: 80px;
  min-height: 80px;
  max-height: 80px;
  text-align: right;
  font-size: 14px;
  color: @highlightColor;
  padding: 24px;
  .btn {
    margin-left: 8px;
  }
}
.scroll-box {
  flex: 1;
  overflow: auto;
}
</style>
