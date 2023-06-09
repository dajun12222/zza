<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-modal
    :title="title"
    :visible="true"
    width="536px"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Save')"
    :maskClosable="false"
    @cancel="onCancel"
    @ok="onOk"
  >
    <div class="row">
      <a-radio :checked="isFixed" @click="setValueType('')">
        选择组织架构
      </a-radio>
      <staff-selector
        v-model="staff"
        :options="staffSelectorOpts"
        :disabled="!isFixed"
      />
    </div>

    <template v-if="isOrgRoot">
      <div class="row">
        <a-radio :checked="isRef" @click="setValueType('ref')">表单字段</a-radio>

        <a-select v-model="refControlKey" :disabled="!isRef">
          <a-select-option
            v-for="c of deptControls"
            :key="c.key"
            :value="c.key"
            >{{ c.options.name }}</a-select-option>
        </a-select>
      </div>

      <div class="row">
        <a-radio :checked="isCreator" @click="setValueType('originatorDept')">创建人部门</a-radio>
      </div>
    </template>

    <template v-else>
      <div class="row">
        <a-radio :checked="isCreator" @click="setValueType(null)">创建人相关</a-radio>

        <a-select
          showSearch
          :value="selectValue"
          :disabled="!isCreator"
          @change="(e) => setValueType(e)"
        >
          <a-select-option v-if="selectUser" value="originator">创建人</a-select-option>
          <a-select-option v-if="selectOrg" value="originatorDept">创建人部门</a-select-option>
        </a-select>
      </div>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { schema } from 'cloudpivot-form/form';
import rendererComponents from 'cloudpivot-form/form/src/renderer/components/pc';
import { Modal, Select } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { ModalAttributeType } from '../form-property/typings/form-attribute';

@Component({
  name: 'user-select-value-setting',
  components: {
    AModal: Modal,
    StaffSelector: rendererComponents.StaffSelector,
    ASelect: Select,
    ASelectOption: Select.Option,
  },
})
export default class UserSelectValueSetting extends Vue {
  @Prop({
    type: Object,
  })
  modalData!: any;

  @Prop()
  dataItem!: any;

  @Prop()
  getFormControls!: () => { [key: string]: schema.FormControl };

  selectOrg = false;

  selectUser = false;

  staffSelectorOpts = {
    key: 'orgRoot',
    selectOrg: false,
    selectUser: false,
    mulpitle: false,
    showModel: true,
    showSelect: true,
    placeholder: '点击选择',
  };

  opts: schema.StaffSelectorOptions = {} as any;

  valueType = '';

  staff: any[] = [];

  refControlKey = '';

  get title() {
    const data = this.modalData;
    if (!data || !data.label) {
      return '';
    }
    return data.label;
  }

  get isCreator() {
    const type = this.valueType;
    return (
      type === schema.StaffSelectorValueType.Originator ||
      type === schema.StaffSelectorValueType.OriginatorDept
    );
  }

  get isFixed() {
    return this.valueType === schema.StaffSelectorValueType.None;
  }

  get isRef() {
    return this.valueType === schema.StaffSelectorValueType.Ref;
  }

  /**
   * 组织根节点
   */
  get isOrgRoot() {
    return this.modalData.type === ModalAttributeType.UserSelectOrgValueSetting;
  }

  get deptControls() {
    if (!this.getFormControls) {
      return [];
    }

    const controls = this.getFormControls();

    if (!controls) {
      return [];
    }
    const isChild = !!this.dataItem.parentCode;
    const depts: any[] = [];
    for (const ctrlKey of Object.keys(controls)) {
      const ctrl: any = controls[ctrlKey];
      if (
        (ctrl.type === schema.FormControlType.StaffSelector ||
          ctrl.type === schema.FormControlType.StaffMultiSelector ||
          ctrl.type === schema.FormControlType.DepartmentSelector ||
          ctrl.type === schema.FormControlType.DepartmentMultiSelector) &&
        ctrl.options.deptVisible === schema.StaffSelectorSelectType.Org &&
        ctrl.key !== this.dataItem.code
      ) {
        depts.push(ctrl);
      } else if (ctrl.type === schema.FormControlType.Tabs) {
        const loop = [ctrl];
        while (loop.length) {
          const _tabs = loop.shift();
          for (const _panel of _tabs.panels) {
            for (const _ctrlKey of Object.keys(_panel.controls)) {
              const _ctrl = _panel.controls[_ctrlKey];
              if (
                (_ctrl.type === schema.FormControlType.StaffSelector ||
                  _ctrl.type === schema.FormControlType.StaffMultiSelector ||
                  _ctrl.type === schema.FormControlType.DepartmentSelector ||
                  _ctrl.type ===
                    schema.FormControlType.DepartmentMultiSelector) &&
                _ctrl.options.deptVisible ===
                  schema.StaffSelectorSelectType.Org &&
                _ctrl.key !== this.dataItem.code
              ) {
                depts.push(_ctrl);
              } else if (_ctrl.type === schema.FormControlType.Tabs) {
                loop.push(_ctrl);
              } else if (
                isChild &&
                _ctrl.type === schema.FormControlType.Sheet &&
                _ctrl.key === this.dataItem.parentCode
              ) {
                (_ctrl as any).columns.forEach((subItem) => {
                  if (
                    (subItem.type === schema.FormControlType.StaffSelector ||
                      subItem.type ===
                        schema.FormControlType.StaffMultiSelector ||
                      subItem.type ===
                        schema.FormControlType.DepartmentSelector ||
                      subItem.type ===
                        schema.FormControlType.DepartmentMultiSelector) &&
                    subItem.options.deptVisible ===
                      schema.StaffSelectorSelectType.Org &&
                    subItem.key !== this.dataItem.code
                  ) {
                    depts.push({
                      ...subItem,
                      key: `${_ctrl.key}.${subItem.key}`,
                    });
                  }
                });
              } else {
                //Else Empty block statement
              }
            }
          }
        }
      } else {
        //Else Empty block statement
      }
      if (
        isChild &&
        ctrl.type === schema.FormControlType.Sheet &&
        ctrl.key === this.dataItem.parentCode
      ) {
        (ctrl as any).columns.forEach((subItem) => {
          if (
            (subItem.type === schema.FormControlType.StaffSelector ||
              subItem.type === schema.FormControlType.StaffMultiSelector ||
              subItem.type === schema.FormControlType.DepartmentSelector ||
              subItem.type ===
                schema.FormControlType.DepartmentMultiSelector) &&
            subItem.options.deptVisible ===
              schema.StaffSelectorSelectType.Org &&
            subItem.key !== this.dataItem.code
          ) {
            depts.push({
              ...subItem,
              key: `${ctrl.key}.${subItem.key}`,
            });
          }
        });
      }
    }
    // const depts = Object.keys(controls)
    //   .map(k => controls[k])
    //   .filter(
    //     c =>{
    //       if ((c.type === schema.FormControlType.StaffSelector ||
    //         c.type === schema.FormControlType.StaffMultiSelector ||
    //         c.type === schema.FormControlType.DepartmentSelector ||
    //         c.type === schema.FormControlType.DepartmentMultiSelector) &&
    //         c.options.deptVisible === schema.StaffSelectorSelectType.Org &&
    //         c.key !== this.dataItem.code) {
    //           return true
    //       }
    //     });

    return depts;
  }

  @Watch('modalData', {
    immediate: true,
  })
  onModalDataChange(modalData: any) {
    if (!modalData.data) {
      this.opts = {} as any;
      this.staff = [];
      return;
    }

    this.opts = modalData.data;
    this.valueType = this.isOrgRoot
      ? this.opts.orgRootValueType
      : this.opts.defaultValueType;

    this.selectOrg = false;
    this.selectUser = false;

    let mulpitle = false;

    if (this.isOrgRoot) {
      mulpitle = true;
      this.selectOrg = true;
      this.selectUser = false;
      this.valueType = this.opts.orgRootValueType;

      if (
        this.valueType === schema.StaffSelectorValueType.None &&
        Array.isArray(this.opts.orgRoot)
      ) {
        this.staff = this.opts.orgRoot;
      } else {
        this.staff = [];

        if (
          this.valueType === schema.StaffSelectorValueType.Ref &&
          this.opts.orgRoot &&
          typeof this.opts.orgRoot === 'string'
        ) {
          let refControlKey = this.opts.orgRoot;
          if (refControlKey) {
            const keys = this.deptControls.map((c) => c.key);
            refControlKey = refControlKey.substr(1, refControlKey.length - 2);
            if (keys.indexOf(refControlKey) > -1) {
              this.refControlKey = refControlKey;
            }
          }
        }
      }
    } else {
      mulpitle = this.opts.multi;

      this.valueType = this.opts.defaultValueType;

      this.staff =
        this.valueType === schema.StaffSelectorValueType.None
          ? this.opts.defaultValue || []
          : [];

      switch (this.opts.deptVisible) {
        case schema.StaffSelectorSelectType.All:
          this.selectOrg = true;
          this.selectUser = true;
          break;
        case schema.StaffSelectorSelectType.User:
          this.selectOrg = false;
          this.selectUser = true;
          break;
        case schema.StaffSelectorSelectType.Org:
          this.selectOrg = true;
          this.selectUser = false;
          break;
        default:
          break;
      }
    }

    this.staffSelectorOpts = Object.assign(this.staffSelectorOpts, {
      selectOrg: this.selectOrg,
      selectUser: this.selectUser,
      mulpitle,
    });
  }

  get selectValue() {
    if (this.isCreator) {
      return this.valueType;
    }
    return '';
  }

  setValueType(type: string) {
    if (type === null) {
      this.valueType =
        this.opts.deptVisible === schema.StaffSelectorSelectType.Org
          ? schema.StaffSelectorValueType.OriginatorDept
          : schema.StaffSelectorValueType.Originator;
    } else {
      this.valueType = type;
    }
  }

  onOk() {
    let value: any;

    if (this.isOrgRoot) {
      if (this.valueType === schema.StaffSelectorValueType.Ref) {
        value = this.refControlKey ? `{${this.refControlKey}}` : null;
      } else {
        value = this.staff.length === 0 ? null : this.staff;
      }
    } else {
      value = this.staff.length === 0 ? null : this.staff;
    }

    const data = {
      type: this.valueType,
      value,
    };
    this.$emit('backData', data);
  }

  onCancel() {
    this.$emit('closeModal');
  }
}
</script>

<style lang="less" scoped>
.row {
  display: flex;
  // align-items: center;

  &:not(:last-child) {
    margin-bottom: 24px;
  }

  & > div:last-child {
    flex-grow: 1;
  }
}

/deep/.ant-radio-wrapper {
  width: 116px;
  margin-top: 0.4em;
}

/deep/.h3-organization {
  display: inline-block;
}
</style>
