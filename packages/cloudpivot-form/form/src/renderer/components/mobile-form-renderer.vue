<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<script lang="ts">
import { listApi } from 'cloudpivot/api';
import { H3SwiperItem } from 'h3-mobile-vue';
import { Component, Prop, Provide } from 'vue-property-decorator';
import { FormRenderer } from './form-renderer';
import FormGroup from './layout/form-group.vue';
import ControlAdapter from './mobile/control-adapter.vue';
import FormCol from './mobile/form-col.vue';
import FormRow from './mobile/form-row.vue';
import FormTabs from './mobile/form-tabs.vue';

@Component({
  name: 'mobile-form-renderer',
  components: {
    ControlAdapter,
    FormCol,
    FormRow,
    FormGroup,
    FormTabs,
    H3SwiperItem,
    // TabsPane
  },
})
export default class MobileFormRenderer extends FormRenderer {
  @Prop() relevanceDataList!: [];

  @Prop() schemaCode!: string;

  // 关联组织介入之后需要根据某些参数去获取不同场景的用户
  @Prop()
  sourceType!: string;

  @Provide()
  getController() {
    return this.controller;
  }

  @Provide()
  findController(key: string | number) {
    if (!this.controller) {
      return;
    }
    return this.controller.findChild(key);
  }

  @Provide()
  getFormControls(keys?: string[]) {
    return super.findFormControls(keys);
  }

  @Provide()
  emitScrollTop(top: number) {
    this.$emit('scrollTop', top);
  }

  @Provide()
  emitScrollLock(lock: boolean) {
    this.$emit('scrollLock', lock);
  }

  @Provide()
  emitUpdateLatestSignature(data: any, isNew: boolean = false) {
    this.$emit('updateLatestSignature', data, isNew);
  }

  @Provide()
  valChange(keys: string, fun: Function) {
    if (this && this.controller) {
      const _ctrl: any = this.controller.findChild(keys);
      // if (!_ctrl) { return ; }
      _ctrl.valueChange.subscribe((change) => {
        fun(change);
      });
    }
  }

  @Provide()
  getSourceType() {
    return this.sourceType;
  }

  @Provide()
  getDataItem(keys: string, parentKey?: string) {
    if (parentKey) {
      const sheet = this.dataItems.find((res) => {
        return res.code === parentKey;
      });
      if (sheet && sheet.subSchema) {
        return sheet.subSchema.properties.find((res) => res.code === keys);
      }
    } else {
      return this.dataItems.find((res) => res.code === keys);
    }
  }

  @Provide()
  async getRelativeDataList(isList?: boolean) {
    if (this.relevanceDataList && this.relevanceDataList.length) {
      return this.relevanceDataList;
    } else {
      let { schemaCode } = this.$route.params;
      if (!schemaCode) {
        schemaCode = this.$route.params.bizSchemaCode;
      }
      if (!schemaCode) {
        schemaCode = this.$route.query.schemaCode as string;
      }
      if (!schemaCode) {
        schemaCode = this.schemaCode;
      }
      if (isList && this.schemaCode) {
        schemaCode = this.schemaCode;
      }
      if (!schemaCode) {
        return;
      }
      const res = await listApi.getDataItemList({ schemaCode });
      const { errcode, errmsg, data } = res;
      if (errcode === 0) {
        this.relevanceDataList = data;
        return data;
      } else {
        this.$message.error(errmsg as string);
      }
    }
  }

  @Provide()
  controlRemove(id) {
    this.$emit('controlRemove', id);
  }

  @Provide()
  valueChange(data) {
    console.log(data);
  }

  render(h: Function) {
    return super.render(h, true);
  }
}
</script>

<style lang="less" scoped>
/deep/.h3-panel {
  & > .h3-panel-header {
    background-color: #f8f8f8;
    border-bottom: 1px solid #eeeeee;
  }

  & > .h3-panel-body {
    // overflow-x: hidden;
  }
}
</style>
