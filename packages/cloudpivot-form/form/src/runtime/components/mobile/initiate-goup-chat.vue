<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="initiate-goup-chat-wrapper">
    <div class="title">选择审批人发起讨论</div>
    <mobile-staff-selector
      v-model="list"
      :options="staffSelectorOpts"
      :params="params"
      :title="$t('cloudpivot.form.runtime.modal.pleaseChoose')"
      class="staff-box"
      :required="true"
      @change="onChange"
    />

    <div class="footer">
      <span class="h3-button h3-button-small" @click="close">取消</span>
      <span class="h3-button h3-button-primary h3-button-small" @click="ok">确定</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { formApi } from 'cloudpivot/api';

import MobileStaffSelector from 'cloudpivot-form/form/src/common/components/form-staff-selector/mobile/mobile-staff-selector.vue';

import { H3Button } from 'h3-mobile-vue';

import { workflowApi } from 'cloudpivot/api';

@Component({
  name: 'initiateGoupChat',
  components: {
    MobileStaffSelector,
    H3Button,
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
  $message!: any;

  list: any[] = [];

  getApproval() {
    const id: string = this.$route.query.workflowInstanceId as string;
    if (id) {
      workflowApi
        .getApproval({
          workflowInstanceId: id,
        })
        .then((result) => {
          if (result.errcode === 0) {
            const res: any = {};
            (result.data || []).forEach((el) => {
              if (el.nodes) {
                el.nodes.forEach((el) => {
                  if (!res[el['approvaler']['id']]) {
                    res[el['approvaler']['id']] = el['approvaler'];
                  }
                });
              }
            });

            this.onApprovalsChange(Object.values(res));
          }
        });
    }
  }

  created() {
    this.getApproval();
  }

  onApprovalsChange(val) {
    this.list = [...val];
  }

  onChange(e) {
    this.$emit('submit', e);
  }

  staffSelectorOpts: any = {
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
.initiate-goup-chat-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 198;
  .title {
    padding: 0 8px;
    line-height: 1.2rem;
    text-align: left;
    font-size: 0.4rem;
    background-color: #eceff2;
    color: rgba(0, 0, 0, 0.85);
  }
}
.footer {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  span {
    display: inline-block;
    padding: 0 16px;
    line-height: 30px;
    border-radius: 15px;
    border: 1px solid #eceff2;
    font-size: 14px;
    margin-left: 8px;
  }
}
</style>
