import * as apiMap from './api.mappings';

import { FormApi } from './form.api';

import { WorkflowApi } from './workflow.api';

import { DataRuleApi } from './data-rule.api';

import { WorkbenchApi } from './workbench.api';
import { ThemesApi } from './themes.api';

import { WorkflowCenterApi } from './workflow-center.api';

import { ListApi } from './application.api';

import { UserApi } from './user.api';

import { InitialInstanceApi } from './initial-instances.api';

import { OrganizationApi } from './mobile/organization.api';

import { HomeApi } from './mobile/home.api';

import { ExternalLinkApi } from './externallink.api';

import { BizpropertyApi } from './bizproperty.api';

import { DingTalkApi } from './dingtalk.api';

import { WechatApi } from './wechatApi/wechat.api';

import { CommonApi } from './common.api';

import { SystemManageApi } from './system-manage.api';

import { FormComment } from './form-comment.api';

import { DictionaryApi } from './data-dictionary.api';

import OAuthApi_ from './oauth.api';

import * as form from './form-params';

import * as bizproperty from './bizproperty-params';

import * as workflow from './workflow-params';

import * as workflowCenter from './workflow-center-params';

import * as listParams from './application';

import * as initialInstanceParams from './initial-instances-params';

import * as mobileHome from './mobile/home-params';

import * as dingTalk from './dingtalk-params';

import * as systemManage from './system-manage-params';

import * as user from './users.typings';

import * as formCommentParams from './form-comment.params';

export {
  apiMap,
  form,
  workflow,
  workflowCenter,
  listParams,
  initialInstanceParams,
  mobileHome,
  bizproperty,
  dingTalk,
  systemManage,
  user,
  formCommentParams,
};

export const formApi = new FormApi();

export const workflowApi = new WorkflowApi();

export const workflowCenterApi = new WorkflowCenterApi();

export const listApi = new ListApi();

export const userApi = new UserApi();

export const initialInstanceApi = new InitialInstanceApi();

export const organizationApi = new OrganizationApi();

export const homeApi = new HomeApi();

export const externalLinkApi = new ExternalLinkApi();

export const bizpropertyApi = new BizpropertyApi();

export const dingTalkApi = new DingTalkApi();
export const wechatApi = new WechatApi();

export const commonApi = new CommonApi();

export const systemManageApi = new SystemManageApi();

export const FormCommentApi = new FormComment();

export const dictionaryApi = new DictionaryApi();

export const workbenchApi = new WorkbenchApi();

export const dataRuleApi = new DataRuleApi();

export const themesApi = new ThemesApi();

export const OAuthApi = OAuthApi_;
