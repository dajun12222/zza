<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-form class="navigator-form" hideRequiredMark>
    <a-form-item
      fieldDecoratorId="title"
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      :fieldDecoratorOptions="rules.required"
      :colon="false"
      class="title-input"
    >
      <span slot="label">
        导航标题
        <em>*</em>
      </span>

      <!-- <a-input
        v-model="navigatorData.title"
        :maxLength="20"
        placeholder="请输入"
        class="app-form__input"
      /> -->
      <InternationalInput
        :valueI18n="getValueI18n(navigatorData)"
        :maxLength="40"
        @valueChange="titleValueChange($event, navigatorData)"
      />
    </a-form-item>
    <a-form-item
      fieldDecoratorId="actionType"
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      :fieldDecoratorOptions="rules.required"
      :colon="false"
    >
      <span slot="label"> 点击时 <em>*</em> </span>

      <a-select
        v-model="navigatorData.actionType"
        allowClear
        placeholder="请选择"
      >
        <a-select-option
          v-for="item in actionTypes"
          :key="item.key"
          :value="item.value"
        >
          {{ item.title }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item
      v-if="navigatorData.actionType === 'app'"
      fieldDecoratorId="app"
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      :fieldDecoratorOptions="rules.required"
      :colon="false"
    >
      <span slot="label"> 选择应用 <em>*</em> </span>

      <AppSelector :value="navigatorData.app" @input="appChange" />
    </a-form-item>

    <a-form-item
      v-if="navigatorData.actionType === 'bizModel'"
      fieldDecoratorId="bizModel"
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      :fieldDecoratorOptions="rules.required"
      :colon="false"
    >
      <span slot="label">
        选择模型
        <em>*</em>
      </span>

      <BizModelSelector :value="navigatorData.bizModel" @input="modelChange" />
    </a-form-item>

    <a-form-item
      v-if="navigatorData.actionType === 'portalPage'"
      fieldDecoratorId="portalPage"
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      :fieldDecoratorOptions="rules.required"
      :colon="false"
    >
      <span slot="label">
        选择页面
        <em>*</em>
      </span>

      <a-select
        v-model="navigatorData.portalPage"
        allowClear
        placeholder="请选择"
      >
        <a-select-option value="defaultPortalDashboard">
          工作台[系统页面]
        </a-select-option>
        <a-select-option value="defaultWorkflowCenter">
          流程中心[系统页面]
        </a-select-option>
        <a-select-option value="defaultApplicationList">
          应用列表[系统页面]
        </a-select-option>
        <!-- 增加默认的页面之后需要在遍历的页面数据中排除默认工作台的记录 -->
        <template v-for="(item, index) in pagesData">
          <a-select-option
            v-if="item.published && item.code !== 'defaultPortalDashboard'"
            :key="index"
            :value="item.code"
          >
            {{ item.name }}
          </a-select-option>
        </template>
      </a-select>
    </a-form-item>

    <a-form-item
      v-if="
        navigatorData.actionType === 'URL' && !navigatorData.isDefaultWorkbench
      "
      fieldDecoratorId="URL"
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      :fieldDecoratorOptions="rules.required"
      :colon="false"
    >
      <span slot="label">
        URL地址
        <em>*</em>
      </span>

      <a-textarea v-model="navigatorData.URL" :rows="4" />
    </a-form-item>

    <a-form-item
      fieldDecoratorId="icon"
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
      :colon="false"
    >
      <span slot="label"> 图标 </span>

      <icon-select
        id="navigator-icon-select"
        :ctrl="iconControl"
        :allowClear="false"
        :iconType="navigatorData.actionType"
        @change="onIconChange"
      />
    </a-form-item>
    <a-form-item
      label="打开方式"
      fieldDecoratorId="openMode"
      :labelCol="formItemLayout.labelCol"
      :wrapperCol="formItemLayout.wrapperCol"
    >
      <a-radio-group v-model="navigatorData.openMode">
        <a-radio value="curPage"> 当前页面 </a-radio>
        <a-radio value="newPage"> 新开页面 </a-radio>
      </a-radio-group>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import {
  Form,
  Input,
  Checkbox,
  Select,
  Tooltip,
  TreeSelect,
  Icon,
  Radio,
} from '@h3/antd-vue';
import IconSelect from '../icon-select.vue';
import {
  AppSelector,
  BizModelSelector,
  InternationalInput,
} from '@portal-designer/toolbox';
import AppCenterApi from 'cloudpivot-admin-core/src/apis/apps';
import getDownloadUrlNew from 'cloudpivot/common/src/utils/getDownloadUrlNew';

@Component({
  name: 'navigator-card',
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ASelect: Select,
    ASelectOption: Select.Option,
    ATooltip: Tooltip,
    ATreeSelect: TreeSelect,
    AIcon: Icon,
    ATextarea: Input.TextArea,
    IconSelect,
    BizModelSelector,
    AppSelector,
    InternationalInput,
  },
})
export default class FormWorkflowTrackChartCard extends Vue {
  @Prop({ default: () => {} }) navigatorData!: any;

  @Prop() changeCallBack: Function;

  @Watch('navigatorData', { deep: true })
  onDataChange() {
    this.changeCallBack();
  }

  @Prop() pagesData!: any[];

  iconControl: any = {
    value: '',
  };

  formItemLayout: Common.FormItemLayout = {
    labelCol: {
      span: 24,
    },
    wrapperCol: {
      span: 24,
    },
  };

  actionTypes: any[] = [
    {
      key: 'app',
      value: 'app',
      title: '链接到应用首页',
    },
    {
      key: 'bizModel',
      value: 'bizModel',
      title: '链接到业务模型',
    },
    {
      key: 'portalPage',
      value: 'portalPage',
      title: '链接到页面',
    },
    {
      key: 'URL',
      value: 'URL',
      title: '链接到URL',
    },
  ];

  rules: any = {};

  navigatorForm: any = {};

  tree: any[] = [];

  beforeMount() {
    this.setRules();
  }

  setRules() {
    this.rules = {
      required: {
        rules: [
          {
            required: true,
            message: '请输入所有必填字段',
          },
        ],
      },
    };
  }

  mounted() {
    this.iconControl.value = this.navigatorData.icon;
  }

  onIconChange(newVal) {
    this.navigatorData.icon = newVal;
    this.iconControl.value = newVal;
  }

  async appChange(val) {
    this.navigatorData.app = val;
    const res: any = await AppCenterApi.getAppDetail({ appCode: val });
    if (res.errcode === 0) {
      this.navigatorData.icon = this.getDownloadUrl(res.data.logoUrl);
      this.iconControl.value = this.navigatorData.icon;
    }
  }

  async modelChange(val) {
    this.navigatorData.bizModel = val;
    const res: any = await AppCenterApi.getBizmodeltitle({ schemaCode: val });
    if (res.errcode === 0) {
      this.navigatorData.icon = res.data.icon;
      this.iconControl.value = this.navigatorData.icon;
    }
  }

  getDownloadUrl(refId: string) {
    return this.getDownloadUrlNew(refId);
  }

  getDownloadUrlNew(refId: string) {
    return getDownloadUrlNew.getImageUrl(refId);
  }

  get token() {
    return window.localStorage.getItem('token');
  }

  get apiHost() {
    return 'http://172.18.15.113';
  }

  getValueI18n(item) {
    try {
      const value = JSON.parse(item.title);
      return value;
    } catch (err) {
      return {
        zh: item.title,
        en: item.title,
      };
    }
  }

  titleValueChange(value, item) {
    item.title = JSON.stringify(value);
  }
}
</script>

<style lang="less" scoped>
.navigator-form {
  width: 300px;
  padding: 20px 16px 4px 16px;
  /deep/.ant-form-item {
    margin-bottom: 16px;
    &.title-input {
      .ant-form-item-control {
        height: 30px;
      }
    }
    .ant-form-item-label {
      text-align: left;
      line-height: 20px;
      padding-bottom: 4px;
      font-size: 12px;
      label {
        color: #111218;
      }
      em {
        color: #f0353f;
      }
    }

    .ant-form-item-control {
      line-height: 30px;
      .ant-select-selection--single {
        height: 30px;
      }
      .app-form__input {
        width: 100%;
        height: 30px;
      }
      .ant-radio-group {
        display: flex;
        flex-direction: column;
        .ant-radio-wrapper:first-child {
          padding-bottom: 4px;
        }
      }
    }
  }

  .add-app__wrap {
    /deep/.ant-row {
      margin-top: 16px;
    }
  }
}
</style>
