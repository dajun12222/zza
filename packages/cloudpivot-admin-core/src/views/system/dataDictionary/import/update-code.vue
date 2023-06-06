<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <UpdateCodeTemplate :importVM="_self" />
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import MixinUpdateCode from '../../../../components/global/modal/import/mixins/update-code';
import UpdateCodeTemplate from '../../../../components/global/modal/import/templates/update-code-template.vue';

@Component({
  name: 'update-code',
  components: {
    UpdateCodeTemplate,
  },
})
export default class UpdateCode extends mixins(MixinUpdateCode) {
  @Prop() isCode!: boolean;

  listRule: any[] = [{}];

  mounted() {
    if (this.isCode) {
      this.listRule = [
        {
          attr: '',
          showSearch: false,
          repeatCodeName: '数据字典',
          required: false,
          codeColumns: [
            {
              title: '数据字典',
              key: 'name',
              dataIndex: 'name',
            },
            {
              title: '分类',
              key: 'classificationName',
              dataIndex: 'classificationName',
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
              scopedSlots: { customRender: 'newInput' },
            },
          ],
        },
      ];
    } else {
      this.listRule = [
        {
          attr: '',
          showSearch: false,
          repeatCodeName: '数据字典',
          required: false,
          codeColumns: [
            {
              title: '原数据字典名称',
              key: 'name',
              dataIndex: 'name',
            },
            {
              title: '新数据字典名称',
              key: 'newName',
              dataIndex: 'newName',
              scopedSlots: { customRender: 'newInput' },
            },
            {
              title: '编码',
              key: 'newCode',
              dataIndex: 'newCode',
            },
            {
              title: '分类',
              key: 'classificationName',
              dataIndex: 'classificationName',
            },
          ],
        },
      ];

      this.tableScopeInfo = {
        code: 'newName',
        placeholder: '请输入字典名称',
        duplicationTips: '该名称已存在',
      };
    }
  }

  get duplicationInfo() {
    return `检测到${
      this.isCode ? '编码' : '名称'
    }重名，修改后导入将生成新的数据字典`;
  }
}
</script>
<style lang="less" scoped></style>

<style lang="less"></style>
