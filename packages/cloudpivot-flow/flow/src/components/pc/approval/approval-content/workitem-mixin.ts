/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { Component, Prop, Vue } from 'vue-property-decorator';
import { workflowEnum } from 'cloudpivot-flow/flow';
import { workflowActionStatus } from 'cloudpivot-flow/flow/src/typings/workflow-enum';

@Component
export default class ListBtn extends Vue {
  @Prop()
  contentData!: any;

  get WorkActionType() {
    return workflowEnum.WorkActionType;
  }

  get toUsers() {
    if (!this.contentData.workActionType) {
      return [];
    }
    return (
      (this.contentData.bizComment &&
        this.contentData.bizComment.userInfos.map((item) => {
          return item.name;
        })) ||
      []
    );
  }

  /**
   * 获取流程行为状态
   * @param approvalActionStatus
   */
  getWorkflowActionStatus(approvalActionStatus: number) {
    if (!approvalActionStatus && approvalActionStatus !== 0) {
      approvalActionStatus = 99;
    }
    if (workflowActionStatus[approvalActionStatus.toString()]) {
      let btnConfigList: any = sessionStorage.getItem('btnConfigList');
      if (btnConfigList) {
        btnConfigList = JSON.parse(btnConfigList);
        for (const con of btnConfigList) {
          if (
            workflowActionStatus[
              approvalActionStatus.toString()
            ].toLowerCase() === con.code.toLowerCase() &&
            con.displayName
          ) {
            return con.displayName;
          }
          if (approvalActionStatus === 8) {
            //驳回特殊处理
            if (con.code === 'rejects' && con.displayName) {
              return con.displayName;
            }
          }
          if (approvalActionStatus === 16) {
            if (con.code === 'circulate' && con.displayName) {
              return con.displayName;
            }
          }
        }
      }
      return this.$t(
        `cloudpivot.flow.pc.WorkflowActionStatus.${
          workflowActionStatus[approvalActionStatus.toString()]
        }`,
      );
    }
    return '';
  }
}
