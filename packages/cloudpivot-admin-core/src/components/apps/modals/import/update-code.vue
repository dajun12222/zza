<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <UpdateCodeTemplate :importVM="_self" />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ImportStrategy from './importStrategy/importStrategy';
import { mixins } from 'vue-class-component';
import MixinUpdateCode from '../../../../components/global/modal/import/mixins/update-code';
import UpdateCodeTemplate from '../../../../components/global/modal/import/templates/update-code-template.vue';

@Component({
  name: 'updateCode',
  components: {
    UpdateCodeTemplate,
  },
})
export default class UpdateCode extends mixins(MixinUpdateCode) {
  @Prop() repeated!: any; //记录模型是否重复

  @Prop() isCoverable!: any;

  @Prop() strategy!: ImportStrategy;

  tabPaneConfig: any[] = [
    {
      listKey: 'codeList',
      tabName: '模型',
      required: true,
      showSearch: false,
      dataSource: [],
      tableColumnsConfig: [
        {
          title: '模型',
          key: 'name',
          dataIndex: 'name',
        },
        {
          title: '原编码',
          key: 'code',
          dataIndex: 'code',
        },
        {
          title: '新编码',
          key: 'newCode',
          dataIndex: 'newCode',
          scopedSlots: { customRender: 'newCode' },
        },
      ],
    },
    {
      listKey: 'sheetList',
      tabName: '子表',
      required: true,
      showSearch: true,
      dataSource: [],
      tableColumnsConfig: [
        {
          title: '子表',
          key: 'name',
          dataIndex: 'name',
        },
        {
          title: '原编码',
          key: 'code',
          dataIndex: 'code',
        },
        {
          title: '新编码',
          key: 'newCode',
          dataIndex: 'newCode',
          scopedSlots: { customRender: 'newCode' },
        },
      ],
    },
    {
      listKey: 'bizFormsList',
      tabName: '表单',
      showSearch: true,
      required: false,
      dataSource: [],
      tableColumnsConfig: [
        {
          title: '表单',
          key: 'name',
          dataIndex: 'name',
        },
        {
          title: '原编码',
          key: 'code',
          dataIndex: 'code',
        },
        {
          title: '新编码',
          key: 'newCode',
          dataIndex: 'newCode',
          scopedSlots: { customRender: 'newCode' },
        },
      ],
    },
    {
      listKey: 'workflowsList',
      tabName: '流程',
      required: false,
      showSearch: false,
      dataSource: [],
      tableColumnsConfig: [
        {
          title: '流程',
          key: 'workflowName',
          dataIndex: 'workflowName',
        },
        {
          title: '原编码',
          key: 'workflowCode',
          dataIndex: 'workflowCode',
        },
        {
          title: '新编码',
          key: 'newCode',
          dataIndex: 'newCode',
          scopedSlots: { customRender: 'newCode' },
        },
      ],
    },
    {
      listKey: 'reportsList',
      tabName: '报表',
      required: true,
      showSearch: false,
      dataSource: [],
      tableColumnsConfig: [
        {
          title: '报表',
          key: 'name',
          dataIndex: 'name',
        },
        {
          title: '原编码',
          key: 'code',
          dataIndex: 'code',
        },
        {
          title: '新编码',
          key: 'newCode',
          dataIndex: 'newCode',
          scopedSlots: { customRender: 'newCode' },
        },
      ],
    },
  ];

  mounted() {
    this.strategy.afterUpdateMounted(this);
    this.refreshDataSource();
  }

  @Watch('list')
  onListChange() {
    this.refreshDataSource();
  }

  submit() {
    return this.strategy.updateCodeSubmit(this);
  }

  get showTabWhileRequired() {
    return this.repeated && !this.isCoverable;
  }

  get notMultiList() {
    return false;
  }

  /**
   * 校验时出现重复编码或其他属性时，显示的提示信息
   */
  get duplicationInfo() {
    return '检测到编码重名，修改后导入将生成新的业务模型';
  }
}
</script>

<style lang="less"></style>
