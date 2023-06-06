<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="query-form-wrapper">
    <div class="query-inner">
      <div class="left">
        <div class="query-form-title-box">
          <div v-if="CommonQueryList.length > 1" class="query-form-list-box">
            <div class="list-box-icon">
              <span
                v-if="expendList"
                class="icon aufontAll"
                @click="
                  () => {
                    expendList = false;
                  }
                "
                >&#xe7ed;</span>
              <span
                v-else
                class="icon aufontAll"
                @click="
                  () => {
                    expendList = true;
                  }
                "
                >&#xe7ee;</span>
            </div>
            <div v-show="expendList" class="list-box-body">
              <template v-for="(item, index) in CommonQueryList">
                <div
                  :key="index"
                  :title="item.name"
                  class="list-item"
                  :class="{ active: item.id === currentQuery.id }"
                  @click="
                    () => {
                      useCommonQuery(item);
                      expendList = false;
                    }
                  "
                >
                  {{ item.name }}
                </div>
              </template>
            </div>
            <div
              v-show="expendList"
              class="list-box-mask"
              @click="
                () => {
                  expendList = false;
                }
              "
            ></div>
          </div>
          <div class="query-form-title" :class="{ notEdit: !isEdit }">
            <div v-if="!isEdit" class="title-display">
              <a-tooltip>
                <template
                  v-if="calcLength(commonQueryParams.name) > 14"
                  slot="title"
                >
                  <span>{{ commonQueryParams.name }}</span>
                </template>
                <div class="title-text">{{ commonQueryParams.name }}</div>
              </a-tooltip>
            </div>
            <div v-else class="title-edit">
              <a-input
                ref="nameRef"
                v-model="commonQueryParams.name"
                class="nameRef"
                maxlength="20"
                @blur="
                  () => {
                    blur();
                  }
                "
              />
            </div>
          </div>
        </div>
        <div
          v-if="!currentQuery.patientia && !relevanceQueryBox"
          class="query-form-options-box"
        >
          <span class="icon aufontAll">&#xe90e;</span>
          <div class="options-box">
            <div class="options-list">
              <div class="options-item" @click="toEdit">
                {{ $t('cloudpivot.list.pc.Rename') }}
              </div>
              <div class="options-item" @click="confirmDel(currentQuery)">
                {{ $t('cloudpivot.list.pc.Delete') }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <QueryFormRenderer
          ref="QueryFormRenderer"
          :fields="fields"
          :dataItemList="dataItemList"
          :relevanceDataList="relevanceDataList"
          :GroupControlers="GroupControlers"
          :vm="this"
          :conditionType="conditionType"
          :isRelevance="relevanceQueryBox"
          @getRelevanceDataList="getRelevanceDataList"
          @valueChange="valueChange"
          @query="query"
        />
        <div v-if="!relevanceQueryBox" class="btn-lift">
          <div v-if="currentQuery.patientia" class="btn-default">
            <span
              v-if="CommonQueryList.length < maxQueryListLength"
              class="btn"
              @click="updateCommonQuery(conditionType, queryType.ADD)"
              >{{ $t('cloudpivot.list.pc.filterBox.saveAs2') }}</span>
            <span v-else class="btn disabled">{{
              $t('cloudpivot.list.pc.filterBox.saveAs2')
            }}</span>
          </div>
          <div v-else class="btn-common">
            <span
              v-if="CommonQueryList.length < maxQueryListLength"
              class="btn"
              @click="updateCommonQuery(conditionType, queryType.ADD)"
              >{{ $t('cloudpivot.list.pc.filterBox.saveAs') }}</span>
            <span v-else class="btn disabled">{{
              $t('cloudpivot.list.pc.filterBox.saveAs')
            }}</span>
            <span
              v-if="hasEdit"
              class="btn"
              @click="updateCommonQuery(conditionType, queryType.SAVE)"
              >{{ $t('cloudpivot.list.pc.filterBox.save') }}</span>
            <span v-else class="btn disabled">{{
              $t('cloudpivot.list.pc.filterBox.save')
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="filter-mask" @click="closeQueryItem"></div> -->
  </div>
</template>

<script lang="ts">
import { Button, Icon, Popconfirm } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch, Provide } from 'vue-property-decorator';

import { listApi } from 'cloudpivot/api';

import QueryFormRenderer from './query-form-renderer2.vue';
import { DataItemType } from 'cloudpivot-form/form/schema';

enum QueryType {
  UPDATE = 'update',
  UPDATE_NAME = 'update-name',
  ADD = 'add',
  SAVE = 'save',
}

const QUERYLIST_MAX_LEN = 51;

const ZH_LENGTH = 2;

const EN_LENGTH = 1;

const TIMEOUT_100 = 100;

@Component({
  name: 'query-form',
  components: {
    AButton: Button,
    AIcon: Icon,
    QueryFormRenderer,
    APopconfirm: Popconfirm,
  },
})
export default class QueryForm extends Vue {
  @Prop()
  fields!: any[];

  @Prop()
  dataItemList!: any[];

  @Prop({
    default: 3,
  })
  cols!: number;

  @Prop()
  relevanceDataList!: [];

  @Prop({ default: false })
  filterFixed!: boolean;

  @Prop()
  curListCode!: string;

  @Prop()
  schemaCode!: string;

  @Prop({ default: false })
  useControlQuery?: boolean;

  @Prop({ default: false })
  relevanceQueryBox?: boolean;

  controls = '' as any;

  menuShow: boolean = true;

  conditionType: number = 1;

  isFromAdmin: boolean = false;

  expendList: boolean = false;

  hasEdit: boolean = false;

  hasAdded: boolean = false;

  hasDel: boolean = false;

  maxQueryListLength: number = QUERYLIST_MAX_LEN;

  getRelevanceDataList() {
    this.$emit('getRelevanceDataList');
  }

  timer: any = null;

  queryType = QueryType;

  // 查询
  query(data: any, queryType?: number) {
    if (!this.currentQuery.patientia && queryType !== undefined) {
      this.updateCommonQuery(queryType, QueryType.UPDATE);
      this.$emit('setFilterData', data || {});
    } else {
      this.$emit('setFilterData', data || {});
    }
  }

  treeQuery() {
    const queryFormRenderer = this.$refs['QueryFormRenderer'] as any;
    queryFormRenderer.queryValue();
  }

  backWriteData(value: any) {
    const formRenderer = this.$refs.formRenderer as any;
    if (formRenderer) {
      formRenderer.controller.value = value;
    }
  }

  // 隐藏搜索框
  closeQueryItem() {
    this.$emit('hide');
  }

  // 以下是常用查询组代码
  commonQueryParams: any = {
    name: '默认查询',
  };

  isEdit: boolean = false;

  toEdit() {
    if (this.currentQuery.id && !this.currentQuery.patientia) {
      this.isEdit = true;

      this.$nextTick(() => {
        (this.$refs.nameRef as HTMLInputElement).select();
        this.hasAdded = false;
      });
    }
  }

  blur() {
    this.isEdit = false;

    this.updateCommonQuery(this.conditionType, QueryType.UPDATE_NAME);
  }

  GroupControlers: any[] = [];

  /**
   * 操作预处理，
   * 查询数据及修改常用查询条件组名称时不更新查询条件组数据，
   * 保存和另存为需取用当前展示的查询条件组数据
   * @param type 操作类型
   * @param queryType 查询类型
   */
  updateCommonQuery(queryType: number, type = 'update') {
    let GroupControlers = [];
    if (
      [QueryType.UPDATE, QueryType.UPDATE_NAME].includes(type as any) &&
      this.currentQuery.queryCondition
    ) {
      GroupControlers = JSON.parse(this.currentQuery.queryCondition);
    } else {
      GroupControlers = this.getCurrentGroupControler(queryType);
    }
    this.addCommonQuery(queryType, GroupControlers, type);
  }

  getCurrentGroupControler(queryType) {
    const ref: any = this.$refs.QueryFormRenderer;
    let GroupControlers = ref ? ref.getGroupControler() || [] : [];
    switch (queryType) {
      case 1:
        GroupControlers = [GroupControlers.flat()];
        break;
      case 0:
        if (GroupControlers.length === 1) {
          GroupControlers = GroupControlers[0].map((item: any) => {
            return [item];
          });
        }
        break;
      default:
        break;
    }
    if (!GroupControlers.length) {
      GroupControlers = [[]];
    }
    return GroupControlers;
  }

  adding: boolean = false;

  getCommonQueryName(type: string) {
    let name: string =
      this.commonQueryParams.name !== '默认查询'
        ? this.commonQueryParams.name
        : null;

    const names: string[] = this.CommonQueryList.map((el) => el.name);

    const testName = (beTestName: string, func: () => void) => {
      if (names.includes(beTestName) && func) {
        func();
      }
    };
    if (type === QueryType.ADD) {
      if (!this.adding) {
        this.adding = true;
      } else {
        return null;
      }
      if (this.CommonQueryList.length >= this.maxQueryListLength) {
        return null;
      }
      let length = this.CommonQueryList.length;

      name = `常用查询${length}`;

      const resetName = () => {
        length++;
        name = `常用查询${length}`;
        testName(name, resetName);
      };

      if (name) {
        testName(name, resetName);
      }
    } else if (!name) {
      this.commonQueryParams.name = this.currentQuery.name;
      this.$message.error('重命名不能为空，已重置为原名称');
      return null;
    } else {
      // Else Empty block statement
    }
    return name;
  }

  getSaveParams(queryType: number, GroupControlers, type: string) {
    const name = this.getCommonQueryName(type);
    if (!name) {
      return null;
    }

    let queryCode = this.curListCode;
    let schemaCode = this.schemaCode;
    let conditionType = queryType;
    let id = this.currentQuery.id;
    let sort = this.currentQuery.sort;
    const queryCondition = JSON.stringify(
      this.saveGroupControlersDataPretreatment(GroupControlers),
    );

    if (type === QueryType.UPDATE) {
      queryCode = this.currentQuery.queryCode;
      schemaCode = this.currentQuery.schemaCode;
      conditionType = this.currentQuery.conditionType;
    }

    if (type === QueryType.ADD) {
      id = undefined;
      sort = undefined;
    }

    return {
      queryCode,
      schemaCode,
      queryCondition,
      name,
      conditionType,
      id,
      sort,
      type: 'VIEW_QUERY',
      filterFixed: this.filterFixed,
    };
  }

  // 添加/修改常用查询
  async addCommonQuery(queryType: number, GroupControlers, type = 'add') {
    const params = this.getSaveParams(queryType, GroupControlers, type);
    if (!params) {
      return;
    }
    const res: any = await listApi.addCommonQuery(params);
    if (res.errcode === 0) {
      if (type !== QueryType.UPDATE) {
        this.$message.success(res.errmsg as string);
        if (type === QueryType.ADD) {
          this.getCommonQueryList();
          this.hasEdit = false;
          this.hasAdded = true;
          setTimeout(() => {
            this.adding = false;
          }, TIMEOUT_100);
        } else if (type === QueryType.SAVE) {
          this.hasEdit = false;
          await this.updateCommonQueryList(params);
        } else {
          this.currentQuery.name = this.commonQueryParams.name;
          await this.updateCommonQueryList();
        }
      } else {
        await this.updateCommonQueryList();
      }
    } else {
      this.$message.error(res.errmsg as string);
    }
  }

  /**
   * 修改常用分组名称，
   * 查询后会接口保存，
   * 但不重新加载常用查询条件列表，
   * 需手动做列表数据调整
   */
  async updateCommonQueryList(params?) {
    if (params) {
      const ref: any = this.$refs.QueryFormRenderer;
      await ref.getControllers();
      this.currentQuery.conditionType = params.conditionType;
      this.currentQuery.queryCondition = JSON.stringify(
        this.getGroupControlersDataPretreatment(params.queryCondition, ref),
      );
    }
    const index = this.CommonQueryList.findIndex(
      (item) => item.id === this.currentQuery.id,
    );
    if (index === 1) {
      return;
    } else {
      this.CommonQueryList.splice(index, 1);
      this.CommonQueryList.splice(1, 0, this.currentQuery);
    }
  }

  //过滤掉非必要数据后在传给后端，减小接口压力
  saveGroupControlersDataPretreatment(GroupControlers) {
    const GroupControlers1: any = [];
    if (Array.isArray(GroupControlers)) {
      GroupControlers.forEach((x) => {
        const GroupControlers1Item: any = [];
        x.forEach((y) => {
          const items = {
            key: y.key,
            value: y.value,
            filterType: y.filterType,
            souceField: y.souceField,
          };
          //关联单选特殊处理
          if (y.propertyType === DataItemType.RelevanceForm && y.value) {
            const valueForm: any = {};
            valueForm[y.options.displayField] = y.value[y.options.displayField];
            valueForm['id'] = y.value['id'];
            items.value = valueForm;
            delete items['souceField'];
          }
          //关联多选特殊处理
          if (
            y.propertyType === DataItemType.RelevanceFormEx &&
            Array.isArray(y.value)
          ) {
            const valueFormEx: any = [];
            y.value.forEach((z) => {
              const valueFormExList: any = {};
              valueFormExList[y.options.displayField] =
                z[y.options.displayField];
              valueFormExList['id'] = z['id'];
              valueFormEx.push(valueFormExList);
            });
            items.value = valueFormEx;
            delete items['souceField'];
          }
          GroupControlers1Item.push(items);
        });
        GroupControlers1.push(GroupControlers1Item);
      });
    }
    return GroupControlers1;
  }

  mounted() {
    if (!this.relevanceQueryBox) {
      this.getCommonQueryList();
    } else {
      if (this.fields.length) {
        this.init();
      }
    }
  }

  isInited: boolean = false;

  @Watch('fields')
  onFieldsChange(fields) {
    if (fields.length && !this.isInited) {
      this.init();
    }
  }

  get leftStyle() {
    return {
      'min-width': this.menuShow ? '220px' : 0,
      'max-width': this.menuShow ? '220px' : 0,
      padding: this.menuShow ? '12px 6px 12px 12px' : 0,
    };
  }

  CommonQueryList: any[] = [];

  // 获取常用组列表
  async getCommonQueryList() {
    const params = {
      queryCode: this.curListCode || this.$route.query.code,
      schemaCode: this.schemaCode || this.$route.query.code,
      type: 'VIEW_QUERY',
    };
    if (window.location.pathname === '/el.html') {
      this.CommonQueryList = [];
      this.CommonQueryList.unshift({
        name: '默认查询',
        patientia: true,
      });
      this.useDefaultCommonQuery(this.CommonQueryList[0]);
      return;
    }
    let res: any = {};
    try {
      res = await listApi.getCommonQueryList(params);
    } catch (e) {
      res = await listApi.getCommonQueryList(params);
    }
    if (res.errcode === 0) {
      this.CommonQueryList = res.data;

      if (this.CommonQueryList[0]) {
        const filterFixed = this.CommonQueryList[0].filterFixed || false;
        this.conditionType = Number(this.CommonQueryList[0].conditionType || 0);
        this.$emit('changeFilterFixed', filterFixed);
      } else {
        this.$emit('changeFilterFixed', false);
      }

      this.CommonQueryList.unshift({
        name: '默认查询',
        patientia: true,
      });

      if (res.data.length === 1) {
        this.useDefaultCommonQuery(this.CommonQueryList[0]);
      } else {
        await this.commonQueryListPreatment();
      }
    }
  }

  async commonQueryListPreatment() {
    const ref: any = this.$refs.QueryFormRenderer;
    await ref.getControllers();
    for (let i = 1; i < this.CommonQueryList.length; i++) {
      this.CommonQueryList[i].queryCondition = JSON.stringify(
        this.getGroupControlersDataPretreatment(
          this.CommonQueryList[i].queryCondition,
          ref,
        ),
      );
    }
    if (this.hasDel) {
      this.hasDel = false;
      this.useCommonQuery(this.CommonQueryList[0]);
    } else {
      this.useCommonQuery(this.CommonQueryList[1]);
    }
  }

  getGroupControlersDataPretreatment(queryConditions: string, ref) {
    const queryCondition = JSON.parse(queryConditions);
    const GroupControlers = ref.getControls();
    const GroupControlersList: any[] = [];
    if (queryCondition.length === 1) {
      const conList = [];
      for (const con of queryCondition[0]) {
        const gc = GroupControlers.find((item) => item.key === con.key);
        const res = this.syncQueryCondition(gc, con);
        if (res) {
          conList.push(res);
        }
      }
      GroupControlersList.push(conList);
    } else {
      for (const con of queryCondition) {
        const gc = GroupControlers.find((item) => item.key === con[0].key);
        const res = this.syncQueryCondition(gc, con[0]);
        if (res) {
          GroupControlersList.push([res]);
        }
      }
    }
    return GroupControlersList;
  }

  syncQueryCondition(item, source) {
    if (item && source) {
      item.value = source.value;
      item.filterType = source.filterType ? source.filterType : item.filterType;
      if (source.souceField) {
        source.souceField.visible = item.souceField.visible;
      }
      item.souceField = source.souceField ? source.souceField : item.souceField;
      if (item.souceField && item.souceField['filterType']) {
        item.souceField['filterType'] = source.filterType
          ? source.filterType
          : item.souceField['filterType'];

        if (
          [DataItemType.Date].includes(item.propertyType) &&
          ['Eq', 'NotEq', 'Gt', 'Lt', 'Gte', 'Lte'].includes(item.filterType)
        ) {
          item.souceField['startValue'] = source.value || '';
        }
      }
      return item;
    } else {
      return null;
    }
  }

  // 删除常用组
  async deleteCommonQuery(item) {
    const that = this;
    this.$confirm({
      class: 'cus-confirm-modal',
      content: (h: any) =>
        h('div', [
          h('i', { class: 'icon aufontAll h-icon-all-question-circle' }),
          h('p', [`确定要删除？`]),
        ]),
      onOk() {
        that.confirmDel(item);
      },
      okText: this.$t('languages.common.ApplicationPortal.Delete') as string,
      cancelText: this.$t(
        'languages.common.ApplicationPortal.Cancel',
      ) as string,
      onCancel() {},
    });
  }

  async confirmDel(item) {
    const params = {
      ids: item.id,
    };
    const res: any = await listApi.deleteCommonQuery(params);
    if (res.errcode === 0) {
      this.$message.success(res.errmsg as string);
      this.hasDel = true;
      this.getCommonQueryList();
    } else {
      this.$message.error(res.errmsg as string);
    }
  }

  currentQuery: any = {};

  // 使用保存的常用查询
  useCommonQuery(item) {
    if (item.patientia) {
      this.useDefaultCommonQuery(item);
    } else {
      this.currentQuery = item;
      this.GroupControlers = JSON.parse(item.queryCondition);
      this.commonQueryParams.name = item.name;
      this.conditionType = Number(item.conditionType);
    }
    if (this.hasAdded) {
      this.toEdit();
    }
  }

  // 使用默认查询
  useDefaultCommonQuery(item) {
    this.commonQueryParams.name = item.name;
    this.currentQuery = item;
    this.conditionType = 1;
    const ref: any = this.$refs.QueryFormRenderer;
    ref && ref.init();
  }

  async init() {
    this.isInited = true;
    const ref = this.$refs.QueryFormRenderer as any;
    if (!this.useControlQuery) {
      ref && (await ref.getControllers());
      this.getCommonQueryList();
    } else {
      this.commonQueryParams.name = '默认查询';
      this.currentQuery = {
        name: '默认查询',
        patientia: true,
      };
      this.conditionType = 1;
      ref.init();
    }
  }

  // 常用组排序
  async moveSortCommonQuery(item, type: string) {
    const params = {
      id: item.id,
      moveDirection: type,
    };
    const res: any = await listApi.moveSortCommonQuery(params);
    if (res.errcode === 0) {
      this.getCommonQueryList();
    } else {
      this.$message.error(res.errmsg as string);
    }
  }

  valueChange(val?) {
    if (val || val === 0) {
      this.conditionType = val;
    }
    this.hasEdit = true;
  }

  calcLength(str: string) {
    let num = 0;
    str.split('').forEach((el) => {
      if (el.match(/^[\u4e00-\u9fa5]+$/)) {
        num += ZH_LENGTH;
      } else {
        num += EN_LENGTH;
      }
    });
    return num / ZH_LENGTH;
  }
}
</script>

<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.query-form-wrapper {
  height: 100%;
}
.query-inner {
  background-color: #fff;
  border: 1px solid #eee;
  border-top: none;
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: row;
  max-height: 530px;
  height: 100%;
  .left {
    position: absolute;
    width: 344px;
    height: 56px;
    background: #f8f8fb;
    padding: 12px 52px 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1;
    .query-form-title-box {
      display: flex;
      align-items: center;
      .query-form-list-box {
        position: relative;
        .list-box-icon {
          height: 32px;
          line-height: 32px;
          margin-right: 12px;
          color: #111218;
          .icon:hover {
            cursor: pointer;
          }
        }
        .list-box-body {
          position: absolute;
          top: 31px;
          z-index: 3;
          width: 154px;
          padding: 4px 0;
          background: #ffffff;
          box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
          border-radius: 2px;
          max-height: 328px;
          overflow-y: auto;
          .list-item {
            height: 32px;
            padding: 5px 12px;
            font-size: 14px;
            font-weight: 400;
            color: #111218;
            line-height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:hover {
              background: #eef4fd;
              cursor: pointer;
            }
            &.active {
              background: rgba(0, 30, 116, 0.06);
            }
          }
        }
        .list-box-mask {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0);
          z-index: 2;
        }
      }
      .query-form-title {
        &.notEdit {
          padding: 5px 0;
        }
        .title-display {
          height: 22px;
          line-height: 22px;
          .title-text {
            display: inline-block;
            width: 212px;
            height: 22px;
            font-size: 14px;
            font-weight: 600;
            color: #111218;
            line-height: 22px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .query-form-options-box {
      position: relative;
      height: 16px;
      line-height: 16px;
      color: rgba(17, 18, 24, 0.5);
      .icon {
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 2px;
        line-height: 16px;
      }
      .icon:hover {
        cursor: pointer;
        background: rgba(0, 30, 116, 0.06);
        color: @highlightColor;
      }
      .options-box {
        display: none;
        position: absolute;
        right: 0;
        padding-top: 4px;
        width: 80px;
        .options-list {
          padding: 4px 0;
          background: #ffffff;
          box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
          border-radius: 2px;
          .options-item {
            height: 32px;
            padding: 5px 12px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #111218;
            line-height: 22px;
            &:hover {
              background: rgba(0, 30, 116, 0.06);
              cursor: pointer;
            }
          }
        }
      }
      &:hover {
        .options-box {
          display: block;
        }
      }
    }
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-top: 76px;
    position: relative;
    width: 344px;
    .btn-lift {
      position: absolute;
      bottom: 29px;
      left: 24px;
      display: flex;
      height: 22px;
      font-size: 14px;
      color: @highlightColor;
      font-weight: 400;
      line-height: 22px;
      .btn-default,
      .btn-common {
        .btn {
          cursor: pointer;
          + .btn {
            margin-left: 12px;
          }
          &.disabled {
            cursor: unset;
            color: rgba(17, 18, 24, 0.25);
          }
        }
      }
    }
  }
}
.filter-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  z-index: 1;
}
</style>
<style lang="less">
.cus-confirm-modal {
  .anticon-question-circle {
    display: none;
  }
  .ant-modal-confirm-content {
    font-size: 14px;
    color: #111218;
    line-height: 22px;
    p {
      font-size: 16px;
      font-weight: 600;
      color: #111218;
      line-height: 26px;
      margin-bottom: 0px;
      margin-left: 33px;
    }
    .h-icon-all-question-circle {
      font-weight: 400;
      color: #faad14;
      font-size: 24px;
      position: absolute;
      left: 31px;
      top: 42px;
    }
  }
  .ant-modal-confirm-btns {
    .ant-btn {
      height: 32px;
    }
  }
  .ant-btn-primary {
    background-color: #f0353f !important;
    border-color: #f0353f !important;
  }
}

.sure-delete {
  .ant-popover-content .ant-popover-arrow {
    display: inline-block;
  }
  .delete-icon {
    font-weight: 400;
    color: #faad14;
  }
  .ant-popover-message-title {
    width: 188px;
    height: 22px;
    font-size: 14px;
    font-weight: 400;
    color: #111218;
    line-height: 22px;
  }
  .ant-popover-buttons {
    .ant-btn {
      min-width: 44px;
    }
  }
}
</style>
