<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <a-modal
    v-model="value"
    title="选择审批人发起讨论"
    :maskClosable="false"
    :okText="$t('languages.common.ok')"
    :cancelText="$t('languages.common.cancel')"
    :destroyOnClose="true"
    :keyboard="false"
    wrapClassName="form-btn-modal"
    width="680px"
    @ok="ok"
    @cancel="close"
  >
    <SmartOrg
      v-model="list"
      :options="options"
      :params="params"
      @change="change"
    />
  </a-modal>
</template>

<script lang="ts">
import { Modal } from '@h3/antd-vue';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import SmartOrg from '../../../common/components/form-staff-selector/pc/staff-selector-only-select-box.vue';

import { formApi } from 'cloudpivot/api';

@Component({
  name: 'initiateGoupChat',
  components: {
    AModal: Modal,
    SmartOrg,
  },
})
export default class initiateGoupChat extends Vue {
  @Prop({
    default: () => {
      return {};
    },
  })
  formObj!: any;

  @Prop()
  approvals!: any[];

  list: any[] = [];

  created() {
    this.onApprovalsChange(this.approvals);
  }

  @Watch('approvals', { deep: true })
  onApprovalsChange(val) {
    this.list = [...val];
  }

  change(list: any[]) {
    this.list = list;
  }

  options: any = {
    selectOrg: false,
    selectUser: true,
    mulpitle: true,
    showModel: false,
    showSelect: true,
    placeholder: '请选择',
  };

  params: any = {
    corpId: 'RELEVANCE-c4a2a1ee9459485baaddff2bd68eeb25',
  };

  @Prop()
  value!: boolean;

  close() {
    this.$emit('input', false);
  }

  ok() {
    if (this.list.length < 2) {
      this.$message.error('最少选择两个用户！');
      return;
    }
    this.createChatGroup();
    this.close();
  }

  createChatGroup() {
    formApi
      .createChatGroup({
        memberList: this.list.map((el: any) => el.id),
        groupName: this.formObj.instanceName,
      })
      .then((res: any) => {
        if (res.errcode === 0) {
          this.$message.success(res.errmsg);
        } else {
          this.$message.error(res.errmsg);
        }
      });
  }
}
</script>

<style lang="less" scoped>
.form-btn-modal {
  .ant-modal-header {
    padding: 24px;
  }
  .ant-modal-close-x {
    width: 60px;
    height: 72px;
  }
  .ant-modal-body {
    padding-top: 0;
  }
  .ant-modal-title {
    color: #111218;
    font-size: 16px;
    font-weight: 700;
    height: 24px;
    line-height: 24px;
  }
  .ant-btn {
    height: 32px;
  }
  .ant-modal-footer {
    padding-bottom: 24px;
  }
}
</style>
