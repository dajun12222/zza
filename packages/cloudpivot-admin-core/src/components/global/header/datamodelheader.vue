<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="app-header">
    <div class="header-left">
      <!-- <router-link
        tag="i"
        :to="{ name: 'appitem', params: { appCode: appCode } }"
        class="icon aufontAll h-icon-all-arrow-left-o"
      /> -->
      <span class="text-ellipsis" :title="modelNameInfo.name">{{
        modelNameInfo.name
      }}</span>
      <span v-if="!modelNameInfo.published" class="no-publish"> 未发布 </span>
    </div>
    <div class="header-content flex-center">
      <ul>
        <template v-for="(module, index) in modules">
          <li
            v-if="module.code === 'FormDesign'"
            :key="index"
            class="flex-center cursor-pointer"
            :class="{ active: module.active }"
            @click.stop="clickMenu('form')"
            @mouseenter.stop="mouseEnterMenu('form')"
            @mouseleave.stop="mouseLeaveMenu('form')"
          >
            <!--  -->
            {{ $t('languages.Apps.' + module.code) }}
          </li>

          <li
            v-else-if="module.code === 'WorkFlowDesign'"
            :key="index"
            class="flex-center cursor-pointer"
            :class="{ active: module.active }"
            @click.stop="clickMenu('wf')"
            @mouseenter.stop="mouseEnterMenu('wf')"
            @mouseleave.stop="mouseLeaveMenu('wf')"
          >
            {{ $t('languages.Apps.' + module.code) }}
          </li>

          <li
            v-else-if="module.code === 'ListDesign'"
            :key="index"
            class="flex-center cursor-pointer"
            :class="{ active: module.active }"
            @click="clickMenu('list')"
          >
            {{ $t('languages.Apps.' + module.code) }}
          </li>

          <li
            v-else
            :key="index"
            class="flex-center cursor-pointer"
            :class="{ active: module.active }"
            @click.stop="goDataModel"
          >
            <!-- {{ module.name }} -->
            {{ $t('languages.Apps.' + module.code) }}
          </li>
        </template>
      </ul>
      <div
        v-show="showForms"
        class="forms"
        @mouseenter.stop="mouseEnterMenu('form')"
        @mouseleave.stop="mouseLeaveMenu('form')"
      >
        <!-- @mouseleave.stop="mouseLeaveMenu('form')" -->
        <div class="content">
          <Draggable
            :id="appCode"
            v-if="isFormEdit"
            element="div"
            :list="forms"
            :options="dragItemOptions"
            @end="onSortEnd"
          >
            <div
              :id="form.code"
              v-for="form in forms"
              :key="form.code"
              class="cursor-pointer cursor-move"
              :class="{ edit: isFormEdit }"
              @click.stop="goForm(form)"
            >
              <i
                class="icon aufontAll"
                :class="[form.icon ? form.icon : 'h-icon-all-operation-log-o']"
              ></i>
              <div class="menu-title" :title="form.name">
                {{ form.name }}
              </div>
              <span
                v-if="isFormEdit"
                class="close-icon"
                @click.stop="openDeleteConfirm(1, form.code, form.name)"
                >&times;</span>
            </div>
          </Draggable>

          <div
            v-for="form in forms"
            v-else
            :key="form.code"
            class="cursor-pointer"
            :class="{ edit: isFormEdit }"
            @click.stop="goForm(form)"
          >
            <i
              class="icon aufontAll"
              :class="[form.icon ? form.icon : 'h-icon-all-operation-log-o']"
            ></i>
            <div class="menu-title" :title="form.name">
              {{ form.name }}
            </div>
            <span
              v-if="isFormEdit"
              class="close-icon"
              @click.stop="openDeleteConfirm(1, form.code, form.name)"
              >&times;</span>
          </div>

          <div v-if="!forms.length" class="empty">暂无内容，请新建表单</div>
        </div>
        <div v-if="!isFormEdit" class="footer">
          <div v-if="!isFormEdit" class="btn" @click="addItem(1)">新建</div>
          <div
            v-if="!isFormEdit"
            class="btn"
            :class="{ disabled: !forms.length }"
            @click.stop="changeModel(1)"
          >
            编辑
          </div>
          <div v-if="isFormEdit" class="cancel" @click.stop="cancel">取消</div>
        </div>
      </div>

      <div
        v-show="showWorkflows"
        class="workflow"
        @mouseenter.stop="mouseEnterMenu('wf')"
        @mouseleave.stop="mouseLeaveMenu('wf')"
      >
        <template v-if="workflows.length >= 2">
          <div class="content">
            <div
              v-for="workflow in workflows"
              :key="workflow.workflowCode"
              class="cursor-pointer"
              :class="{ edit: isWorkflowEdit }"
              @click.stop="goWorkflow(workflow)"
            >
              <i
                class="icon aufontAll"
                :class="[
                  workflow.icon ? workflow.icon : 'h-icon-all-operation-log-o',
                ]"
              ></i>
              <div class="menu-title">
                <span
                  v-if="$i18n.locale === 'zh'"
                  :title="workflow.workflowName"
                  >{{ workflow.workflowName }}</span>
                <span v-else :title="workflow.name_i18n[$i18n.locale]">{{
                  workflow.name_i18n[$i18n.locale]
                }}</span>
              </div>
              <span
                v-if="isWorkflowEdit"
                class="close-icon"
                @click.stop="
                  openDeleteConfirm(
                    2,
                    workflow.workflowCode,
                    workflow.workflowName,
                  )
                "
                >&times;</span>
            </div>
            <div v-if="!workflows.length" class="empty">
              暂无内容，请新建流程
            </div>
          </div>
          <div class="footer">
            <!-- <div
              class="btn"
              v-if="!isWorkflowEdit"
              @click="addItem(2)">新建</div> -->
            <div
              v-if="!isWorkflowEdit"
              class="cancel"
              :class="{ disabled: !workflows.length }"
              @click.stop="changeModel(2)"
            >
              编辑
            </div>
            <div v-if="isWorkflowEdit" class="cancel" @click.stop="cancel">
              取消
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 新建表单弹窗 -->
    <AddFormModal
      v-model="isShowAddFormModal"
      :data="curItemData"
      :schemaCode="bizSchemaCode"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script lang="ts">
import * as formApiOld from 'cloudpivot-admin-core/src/apis/form';
import * as listApi from 'cloudpivot-admin-core/src/apis/list/list.api';
import AddFormModal from 'cloudpivot-admin-core/src/components/apps/modals/addForm.vue';
import AddListModal from 'cloudpivot-admin-core/src/components/apps/modals/addList.vue';
import AddWorkflowModal from 'cloudpivot-admin-core/src/components/apps/modals/addWorkflow.vue';
import * as AppErrors from 'cloudpivot-admin-core/src/typings/app-error';
import * as ModelAction from 'cloudpivot-admin-core/src/typings/model-action';
import { formApi } from 'cloudpivot/api';
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import Draggable from 'vuedraggable';
import { namespace } from 'vuex-class';

const DataModelModule = namespace('Apps/DataModel');
const AppItemModule = namespace('Apps/AppItem');

const WorkflowModule = namespace('Apps/Workflow');

const AppCenterModule = namespace('Apps/AppCenter');

import { EventBus } from 'cloudpivot-form/form/src/schema/event-bus';

@Component({
  name: 'Datamodel',
  components: {
    AddFormModal,
    AddWorkflowModal,
    AddListModal,
    Draggable,
  },
})
export default class Datamodel extends Vue {
  @DataModelModule.Action('getBizmodeltitle') getBizmodeltitle: any;

  @DataModelModule.Action('getReservedWords') getReservedWords: any;

  @DataModelModule.Mutation('setBizSchemaCode') setBizSchemaCode: any;

  @AppItemModule.Action('deleteWorkflow') deleteWorkflow: any;

  @WorkflowModule.State('workflowMenus') workflows: any[];

  @WorkflowModule.Action('getWorkflowList') getWorkflowList: any;

  @DataModelModule.State('formData') formData: any;

  @AppCenterModule.State('appInfo') appInfo: any;

  @Prop() modelNameInfo!: any;

  modules: Array<Common.AppModule> = [];

  moduleName: string = '';

  bizSchemaCode: string = '';

  bizModeltitle: string = '';

  forms: any[] = [];

  showForms = false;

  showWorkflows = false;

  isShowAddFormModal: boolean = false;

  curItemData: any = {};

  curWorkflowData: any = {};

  curListData: any = {};

  manageType: any = {
    form: 1,
    workflow: 2,
    list: 3,
  };

  isFormEdit: boolean = false;

  isWorkflowEdit: boolean = false;

  dragItemOptions: any = {
    animation: 150,
    ghostClass: 'ghostClass',
    forceFallback: true,
    fallbackClass: 'dragClass',
    touchStartThreshold: 20,
    delay: 100,
  };

  get isChinese() {
    return !(this.$i18n.locale && this.$i18n.locale === 'en');
  }

  onSortEnd(evt: any) {
    const sheetCode = evt.item.id as string;
    const sortKey: number = parseInt(evt.newIndex, 10) + 1;
    const params = {
      sheetCode,
      sortKey,
      schemaCode: this.bizSchemaCode,
    };

    formApi.updateSortkey(params).then((res) => {
      if (res.errcode === 0) {
        this.getForms();
      }
    });
  }

  get appCode() {
    return this.$route.params.appCode;
  }

  beforeMount() {
    this.modules = [
      {
        name: 'dataModel',
        code: 'DataModel',
        active: true,
        url: `/apps/model/${this.appCode}/${this.bizSchemaCode}/data/dataModel`,
      },
      {
        name: 'form-design',
        code: 'FormDesign',
        active: false,
        url: `/apps/model/${this.appCode}/${this.bizSchemaCode}/form-design`,
      },
      {
        name: 'workflowDesign',
        code: 'WorkFlowDesign',
        active: false,
        url: `/apps/model/${this.appCode}/${this.bizSchemaCode}/workflowDesign`,
      },
      {
        name: 'list-design',
        code: 'ListDesign',
        active: false,
        url: `/apps/model/${this.appCode}/${this.bizSchemaCode}/list-design`,
      },
    ];
    let name: string = this.$route.name as string;
    if (name === 'workflowEmpty') {
      name = 'workflowDesign';
    }

    this.changeHeightLight(name);
  }

  created() {
    this.initial();
  }

  initial() {
    this.bizSchemaCode = this.$route.params.bizSchemaCode;
    if (!this.bizSchemaCode) {
      return;
    }

    this.setBizSchemaCode(this.bizSchemaCode);
    this.getBizmodeltitle().then((res: any) => {
      if (res.errcode === 0) {
        let name_i18n = res.data.name_i18n;
        if (typeof name_i18n === 'string') {
          name_i18n = JSON.parse(name_i18n);
        }
        this.bizModeltitle = this.isChinese
          ? res.data.name
          : name_i18n[(this as any).$i18n.locale];
        this.setTitle();
      } else {
        const msg: string = res.errmsg || '接口请求失败';
        this.$message.error(msg);
      }
    });

    this.getForms();

    this.getWorkflows();

    this.getReservedWords().then((res: any) => {
      if (res.errcode === 0 && res.data) {
        window.localStorage.setItem('reservedWords', res.data);
      }
    });
  }

  // 点击其他区域取消弹出显示
  mounted() {
    const that = this;
    document.addEventListener('click', (e) => {
      if (that.showWorkflows) {
        that.showWorkflows = false;
      }
      if (that.showForms) {
        that.showForms = false;
      }
    });
    switch (this.$route.name) {
      case 'dataModel':
      case 'busRules':
      case 'dataPermission':
      case 'dataRuleCalculation':
      case 'biz-rule':
        this.changeHeightLight('dataModel');
        break;
      default:
        break;
    }
  }

  // 获取表单列表
  getForms() {
    formApiOld.list(this.bizSchemaCode).then((res: any) => {
      if (res.data && Array.isArray(res.data)) {
        this.forms = res.data.filter((f: any) => f.name);
      }
    });
  }

  // 获取流程列表
  getWorkflows() {
    const params = {
      schemaCode: this.bizSchemaCode,
    };
    this.getWorkflowList(params);
  }

  clickMenu(type: string) {
    EventBus.$emit('hiddenMenu');
    switch (type) {
      case 'form':
        this.showWorkflows = false;
        this.showForms = true;
        this.isFormEdit = false;
        if (this.forms.length === 1) {
          this.goForm(this.forms[0]);
        }
        break;

      case 'wf':
        this.showForms = false;
        this.showWorkflows = true;
        this.isWorkflowEdit = false;
        if (this.workflows.length === 1) {
          this.goWorkflow(this.workflows[0]);
        }
        // 如果一个流程都没有,跳转空页面
        if (this.workflows.length === 0) {
          if (this.$route.name === 'workflowEmpty') {
            return;
          }
          this.$router.push({ name: 'workflowEmpty' }).catch((err: any) => {
            console.log(err);
          });
        }
        break;

      case 'list':
        this.showWorkflows = false;
        this.showForms = false;
        this.goList();
        break;
      default:
        break;
    }
  }

  mouseEnterMenu(type: string) {
    switch (type) {
      case 'form':
        this.showForms = true;
        break;

      case 'wf':
        this.showWorkflows = true;
        break;

      default:
        break;
    }
  }

  mouseLeaveMenu(type: string) {
    switch (type) {
      case 'form':
        this.showWorkflows = false;
        this.showForms = false;
        this.isFormEdit = false;
        break;

      case 'wf':
        this.showForms = false;
        this.showWorkflows = false;
        this.isWorkflowEdit = false;
        break;

      case 'list':
        this.showWorkflows = false;
        this.showForms = false;
        break;
      default:
        break;
    }
  }

  // 编辑自定义表单
  editForm(code: string) {
    const _this = this;
    const hideLoader = (_this.$message as any).loading();
    formApiOld.get(this.bizSchemaCode, code).then((res: any) => {
      _this.curItemData = res.data;
      _this.isShowAddFormModal = true;
      hideLoader();
    });
  }

  goForm(form: any) {
    EventBus.$emit('hiddenMenu');
    // return
    if (this.isFormEdit) {
      this.openDeleteConfirm(1, form.code, form.name);
    } else if (form.sheetType === 1) {
      this.editForm(form.code);
    } else {
      this.$router
        .push({
          name: 'form-design',
          params: {
            bizSchemaCode: this.bizSchemaCode,
            sheetCode: form.code,
          },
        })
        .catch((err: any) => {
          console.log(err);
        });
      this.showForms = false;
      this.saveModelAction(ModelAction.ModalActionTypes.Form, form.code);
    }
  }

  goList() {
    listApi.getList(this.bizSchemaCode).then((res: any) => {
      if (res.data && Array.isArray(res.data)) {
        const lists = res.data.filter((l: any) => l.name)[0];
        const code = lists ? lists.code : '';
        this.$router
          .push({
            name: 'list-design',
            params: {
              bizSchemaCode: this.bizSchemaCode,
              code,
            },
          })
          .catch((err: any) => {
            console.log(err);
          });
        this.saveModelAction(ModelAction.ModalActionTypes.List, code);
      }
    });
  }

  goWorkflow(workflow: any) {
    if (this.isWorkflowEdit) {
      this.openDeleteConfirm(2, workflow.workflowCode, workflow.workflowName);
    } else {
      this.$router
        .push({
          name: 'workflowDesign',
          params: {
            workflowCode: workflow.workflowCode,
          },
        })
        .catch((err: any) => {
          console.log(err);
        });
      this.showWorkflows = false;
    }
    this.saveModelAction(
      ModelAction.ModalActionTypes.Workflow,
      workflow.workflowCode,
    );
  }

  goDataModel() {
    EventBus.$emit('hiddenMenu');
    this.$router
      .push({
        name: 'dataModel',
        params: {
          appCode: this.appCode,
          bizSchemaCode: this.bizSchemaCode,
        },
      })
      .catch((err: any) => {
        console.log(err);
      });
    this.saveModelAction(ModelAction.ModalActionTypes.DataModel, '');
  }

  /**
   * @desc 存储操作痕迹
   * @params type 当前操作类型
   * @params code 当前操作项的code
   */
  saveModelAction(type: number, code: string) {
    if (!type) {
      return;
    }
    const modelActions = window.localStorage.getItem('ModelAction') as string;
    const { bizSchemaCode } = this.$route.params;
    const obj: ModelAction.ModelActionItem = {
      type,
      code,
      bizSchemaCode,
    };
    if (!modelActions) {
      window.localStorage.setItem('ModelAction', JSON.stringify([obj]));
    } else {
      const modelActionsArray = JSON.parse(modelActions);
      const newReords: any = modelActionsArray.filter(
        (item: any) =>
          item.bizSchemaCode !== bizSchemaCode && item.code !== code,
      );
      newReords.push(obj);
      window.localStorage.setItem('ModelAction', JSON.stringify(newReords));
    }
  }

  /*  新建：1: 表单  2: 流程  3: 列表 */
  addItem(type: number) {
    switch (type) {
      case this.manageType.form:
        this.curItemData = {};
        this.isShowAddFormModal = true;
        break;

      case this.manageType.workflow:
        this.curWorkflowData = {};
        break;

      default:
        break;
    }
  }

  handleConfirm(formData: any) {
    this.getForms();
    this.isShowAddFormModal = false;
    // 新增表单跳转到新增的表单页面
    if (formData.sheetType !== '1') {
      this.goForm(formData);
    }
  }

  handleCancel() {
    this.isShowAddFormModal = false;
  }

  // 改变模式：是否为编辑模式 1: 表单  2: 流程  3: 列表
  changeModel(type: number) {
    switch (type) {
      case this.manageType.form:
        if (this.forms.length) {
          this.isFormEdit = true;
        }
        break;

      case this.manageType.workflow:
        if (this.workflows.length) {
          this.isWorkflowEdit = true;
        }
        break;

      default:
        break;
    }
  }

  // 取消
  cancel() {
    this.isFormEdit = false;
    this.isWorkflowEdit = false;
  }

  // 打开删除弹窗
  openDeleteConfirm(type: number, code: string, name: string) {
    EventBus.$emit('hiddenMenu');

    const vm = this;
    /* 删除单项 */
    this.$confirm({
      title: this.$t('languages.Apps.ConfirmDelete', {
        name,
      }), // `确定要删除“${'默认表单'}”吗？`,
      okType: 'danger',
      okText: this.$t('languages.Apps.Delete').toString(),
      cancelText: this.$t('languages.Apps.Cancel').toString(),
      onOk() {
        switch (type) {
          case 1:
            vm.deleteForm(code);
            break;
          case 2:
            vm.handleDeleteWorkflow(code);
            break;
          default:
            break;
        }
      },
    });
  }

  // 删除表单
  deleteForm(code: string) {
    const _this = this;
    const hideLoader = (_this.$message as any).loading();
    formApiOld
      .remove(this.bizSchemaCode, code)
      .then((res: any) => {
        hideLoader();
        _this.$message.success(_this.$t('languages.DeleteSuccess').toString());
        _this.getForms();

        if (
          _this.$route.name === 'form-design' &&
          code === _this.$route.params.sheetCode
        ) {
          sessionStorage.setItem('isDelModel', 'true');
          _this.$router
            .push({
              name: 'form-design',
              params: {
                bizSchemaCode: this.bizSchemaCode,
                sheetCode: this.forms[0].code,
              },
            })
            .catch((err: any) => {
              console.log(err);
            });
        }
      })
      .catch((e: any) => {
        if (e.errcode === 50000) {
          return;
        }
        // 不可删除逻辑
        if (e.errcode && e.errcode > 0 && e.data.length > 0) {
          const errMsg: any = e.data[0];
          const errorCode: number = errMsg.errCode;
          const errorContent: string = errMsg.errContent;
          this.handleDisplayError(errorCode, errorContent);
        }
      })
      .finally(() => hideLoader());
  }

  // 删除流程
  handleDeleteWorkflow(code: any) {
    const params: any = { workflowCode: code };
    this.deleteWorkflow(params).then((res: any) => {
      if (res.errcode === 0) {
        if (
          this.$route.name === 'workflowDesign' &&
          code === this.$route.params.workflowCode
        ) {
          this.$router
            .push(
              `/apps/model/${this.appCode}/${this.bizSchemaCode}/data/dataModel`,
            )
            .catch((err: any) => {
              console.log(err);
            });
        }
        this.$message.success(res.errmsg);
        this.getWorkflows();
      } else if (res.errcode && res.errcode > 0 && res.data.length > 0) {
        // 不可删除逻辑
        const errMsg: any = res.data[0];
        const errorCode: number = errMsg.errCode;
        const errorContent: string = errMsg.errContent ? errMsg.errContent : '';
        this.handleDisplayError(errorCode, errorContent);
      } else {
        //Else Empty block statement
      }
    });
  }

  /**
   * 处理错误提示
   * @param errcode 错误代码
   * @param errContent 错误信息
   */
  handleDisplayError(errcode: number, errContent: string) {
    let _errString: any;
    if (errContent.indexOf(':') > -1) {
      _errString = errContent.split(':');
    } else {
      _errString = errContent;
    }
    switch (errcode) {
      // 表单删除
      case AppErrors.ErrorCodes.FormBindByActivity:
        this.displayError(
          this.$t('languages.Apps.FormBindByActivity', {
            workflow: _errString[0],
            activity: _errString[1],
          }),
        );
        break;
      case AppErrors.ErrorCodes.FormBindByDraftWorkflow:
        this.displayError(
          this.$t('languages.Apps.FormBindByDraftWorkflow', {
            workflow: _errString[0],
            activity: _errString[1],
          }),
        );
        break;
      case AppErrors.ErrorCodes.FormBindByList:
        this.displayError(
          this.$t('languages.Apps.FormBindByList', { list: _errString }),
        );
        break;
      case AppErrors.ErrorCodes.DefaultForm:
        this.displayError(this.$t('languages.Apps.DefaultForm'));
        break;

      // 流程删除
      case AppErrors.ErrorCodes.WorkflowBindByList:
        this.displayError(
          this.$t('languages.Apps.WorkflowBindByList', { list: _errString }),
        );
        break;
      case AppErrors.ErrorCodes.WorkflowBindAsSubWorkflowDraft:
        this.displayError(
          this.$t('languages.Apps.WorkflowBindAsSubWorkflowDraft', {
            list: _errString,
          }),
        );
        break;
      case AppErrors.ErrorCodes.WorkflowBindAsSubWorkflow:
        this.displayError(
          this.$t('languages.Apps.WorkflowBindAsSubWorkflow', {
            list: _errString,
          }),
        );
        break;
      case AppErrors.ErrorCodes.WorkflowInstanceExist:
        this.displayError(this.$t('languages.Apps.WorkflowInstanceExist'));
        break;

      default:
        break;
    }
  }

  /**
   * 展示错误提示
   * @param content 错误信息
   */
  displayError(content: any) {
    if (!content) {
      return;
    }
    this.$warning({
      title: content,
      okText: this.$t('languages.Apps.DeleteOk').toString(),
    });
  }

  changeHeightLight(val: string) {
    //
    for (let i = 0; i < this.modules.length; i += 1) {
      if (this.modules[i].name === val) {
        this.modules[i].active = true;
        this.moduleName =
          '' + this.$t('languages.Apps.' + this.modules[i].code);
      } else {
        this.modules[i].active = false;
      }
    }
    this.setTitle();
  }

  setTitle() {
    if (this.bizModeltitle) {
      document.title = this.bizModeltitle + '-' + this.moduleName;
    }
  }

  @Watch('$route')
  onRouteChange() {
    switch (this.$route.name) {
      case 'dataModel':
      case 'busRules':
      case 'dataPermission':
      case 'dataRuleCalculation':
      case 'biz-rule':
        this.changeHeightLight('dataModel');
        break;
      case 'form-design':
        this.changeHeightLight('form-design');
        break;
      case 'list-design':
        this.changeHeightLight('list-design');
        break;
      default:
        this.changeHeightLight('workflowDesign');
        break;
    }
    this.initial();
  }

  @Watch('formData')
  onDataItemChange() {
    // 当表单设计页面更改了表单名称时,更新头部的菜单项内的表单名称
    if (this.formData && this.formData.name) {
      const form = this.forms.find((f: any) => f.id === this.formData.id);
      if (form) {
        form.name = this.formData.name;
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-admin-core/src/styles/themes/index.less';
@import '~cloudpivot-admin-core/src/styles/color/colors.less';
.app-header {
  position: relative;
  background-color: #fff;
  // border-bottom: 1px solid rgb(228, 228, 228, 0.5);
  // box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05),
  //   0px 1px 0px 0px rgba(228, 228, 228, 0.5);

  .header-right > div i {
    color: @nav-font-color;
  }
  .header-left {
    position: absolute;
    left: 24px;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    font-size: 18px;
    color: @nav-font-color;

    span {
      // display: inline-block;
      max-width: 180px;
      text-align: left;

      &.no-publish {
        display: inline-block;
        width: unset;
        max-width: unset;
        text-align: center;
        height: 20px;
        line-height: 18px;
        padding: 0 8px;
        background-color: rgba(17, 18, 24, 0.05);
        color: @nav-font-color;
        border: 1px solid rgba(17, 18, 24, 0.1);
        font-size: 12px;
        font-weight: 400;
        border-radius: 10px;
        margin-left: 8px;
      }
    }
    .h-icon-all-arrow-left-o {
      cursor: pointer;
    }
  }
  .header-content {
    width: 100%;
    height: 100%;
    ul > li {
      & > .aufontAll {
        margin-left: 8px;
      }
    }
    // background: #052535;
    @media screen and (min-width: 850px) {
      ul {
        height: 100%;
        margin: 0;
        li {
          position: relative;
          height: 100%;
          float: left;
          margin: 0 20px;
          font-weight: 400;
          color: @nav-font-color;
          font-size: 16px;
          cursor: default;
          &:hover {
            color: @nav-font-color;
            font-weight: 600;
          }
          &.active {
            cursor: default !important;
            color: @primary-color;
            font-weight: 600;
            &::after {
              content: '';
              position: absolute;
              bottom: 4px;
              left: 0;
              width: 100%;
              height: 0;
              border-bottom: 3px solid @primary-color;
            }
          }
        }
      }
    }
    @media screen and (max-width: 850px) {
      ul {
        display: none;
      }
    }
  }
}

.forms,
.workflow,
.lists {
  position: absolute;
  z-index: 19999;
  margin: auto;
  background-color: #fff;
  min-width: 161px;
  max-width: 644px;
  // min-height: 105px;
  max-height: 304px;
  top: 60px;
  text-align: left;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px;

  .content {
    overflow: auto;
    max-height: 267px;
    font-size: 0;

    /deep/ .cursor-pointer {
      width: 161px;
      height: 67px;
      position: relative;
      display: inline-block;
      font-size: 14px;
      font-weight: 400;

      & > i {
        color: #fdaa3f;
        font-size: 28px;
        float: left;
        line-height: 67px;
        margin: 0 10px 0 16px;
      }

      & > div {
        line-height: 67px;
        color: rgba(17, 18, 24, 0.5);
      }
      .close-icon {
        position: absolute;
        right: 6px;
        width: 12px;
        height: 12px;
        top: 6px;
        color: rgba(17, 18, 24, 0.5);
        cursor: pointer;
      }
    }
    /deep/ .cursor-move {
      cursor: move !important;
    }

    .cursor-pointer.edit {
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
    }
    .empty {
      font-size: 12px;
      text-align: center;
      height: 100%;
      min-height: 67px;
      line-height: 67px;
      color: rgba(17, 18, 24, 0.5);
    }

    /deep/.ghostClass {
      opacity: 1;
      background-color: #fff;
      // border: 1px dashed red;
      &.cursor-pointer.edit {
        border: 1px dashed @primary-color;
      }

      * {
        opacity: 0;
      }
    }
    /deep/.dragClass {
      opacity: 1 !important;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
    }
  }

  .footer {
    background: #fafafa;
    overflow: hidden;
    width: 100%;
    .btn:first-child {
      border-right: 1px solid #e8e8e8;
    }
    .btn {
      width: 50%;
      float: left;
      text-align: center;
      margin: 8px 0;
      color: @primary-color;
      cursor: pointer;
    }
    .disabled {
      color: rgba(17, 18, 24, 0.5);
      cursor: not-allowed;
    }
    .cancel {
      text-align: center;
      margin: 8px 0;
      color: @primary-color;
      cursor: pointer;
    }
  }

  .menu-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 12px;
  }
}
.forms {
  margin-left: -54px;
}
.workflow {
  margin-left: 50px;
}
.lists {
  margin-left: 150px;
}
</style>
