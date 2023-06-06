<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <UpdateCodeTemplate :importVM="_self" />
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import MixinUpdateCode from '../../../../../components/global/modal/import/mixins/update-code';
import UpdateCodeTemplate from '../../../../../components/global/modal/import/templates/update-code-template.vue';

@Component({
  name: 'update-code',
  components: {
    UpdateCodeTemplate,
  },
})
export default class UpdateCode extends mixins(MixinUpdateCode) {
  listRule: any[] = [
    {
      attr: '',
      showSearch: false,
      repeatCodeName: '应用',
      required: false,
      codeColumns: [
        {
          title: '目录',
          key: 'groupName',
          dataIndex: 'groupName',
        },
        {
          title: '服务方法',
          key: 'serviceName',
          dataIndex: 'serviceName',
        },
        {
          title: '原编码',
          key: 'oldCode',
          dataIndex: 'oldCode',
        },
        {
          title: '新编码',
          key: 'newCode',
          dataIndex: 'newCode',
          scopedSlots: { customRender: 'newInput' },
        },
      ],
    },
  ];

  get duplicationInfo() {
    return '检测到服务方法重名,修改后导入将生成新的编码';
  }
}
</script>
<style lang="less" scoped>
.input-error {
  border-color: #f4454e;

  /deep/ .ant-input:focus {
    border-color: #f4454e;
    box-shadow: none;
  }
}

.h-icon-all-close-circle {
  color: #f4454e;
  font-size: 20px;
  &:hover {
    color: #f4454e;
  }
}
</style>

<style lang="less">
.import-server-hint {
  .ant-tooltip-inner {
    background-color: #f4454e;
  }
}
</style>
