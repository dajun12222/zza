/*
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
*/
import { FormDetail } from '../form-detail';
import FormActions from './form-actions.vue';
import initiateGoupChat from './initiate-goup-chat.vue';

export default {
  FormActionModal: () => import('./form-action-modal.vue'),
  FormActions,
  // FormActions: () => import('./form-actions.vue'),
  FormDetail: FormDetail,
  initiateGoupChat: initiateGoupChat,
};
