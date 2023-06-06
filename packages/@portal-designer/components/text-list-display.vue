<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div ref="textListDisplay" class="text-list-display">
    <div v-if="totalPage > 1" class="header-btn">
      <span
        class="btn aufontAll"
        :class="{ disabled: page === 0 }"
        @click="checkPage(-1)"
        >&#xe7ec;</span>
      <span
        class="btn aufontAll"
        :class="{ disabled: page === totalPage - 1 }"
        @click="checkPage(1)"
        >&#xe7eb;</span>
    </div>
    <div v-if="!!list.length" class="text-list-wrapper">
      <template v-for="(item, index) in list">
        <div
          :key="index"
          class="list-item"
          :style="textStyle"
          :class="`${listIcon}`"
          @click="openDetail(item)"
        >
          <template v-for="(field, fieldIndex) in displayFieldList">
            <span
              v-if="getFieldData(item, field)"
              :key="fieldIndex"
              class="item-field"
              :class="`item-field-${displayFieldList.length}-${fieldIndex}`"
              :title="getFieldData(item, field)"
              :style="textStyle"
            >
               <label>{{ getFieldData(item, field) }}</label>
            </span>
          </template>
        </div>
      </template>
    </div>
    <template v-else-if="loadListComplete">
      <div v-if="runMode === 'runtime'" class="runtime-mode">
        <img
          v-if="!heightNoMoreThanMAX"
          :src="require('./assets/images/no-data.png')"
          alt="暂无图片"
        />
        <span>暂无数据</span>
      </div>
      <EmptyDataSource
        v-else
        emptyText="您还没配置组件样式或展示内容哦～"
        :showEmptyImg="showEmptyImg"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from 'vue-property-decorator';

import EmptyDataSource from './empty-data-source.vue';

import { workflowCenterApi, listApi } from 'cloudpivot/api';

import { DataItemType } from 'cloudpivot-form/form/schema';
import zhToEn from 'cloudpivot-form/form/locales/zhToEn';

const TEXT_LINE_HEIGHT = 46;

const SEQUENCE_STATUS = {
  DRAFT: '草稿',
  PROCESSING: '进行中',
  COMPLETED: '已完成',
  CANCELED: '已作废',
};
@Component({
  name: 'text-list-display',
  components: {
    EmptyDataSource,
  },
})
export default class textListDisplay extends Vue {
  @Inject({
    default: () => {},
  })
  showFormDetail: Function;

  @Prop()
  dataSource!: string;

  @Prop()
  bizModel!: string;

  @Prop()
  tabOption!: string;

  @Prop({ default: [] })
  displayFieldList!: any[];

  @Prop({
    default: false,
  })
  showFieldTitle!: boolean;

  @Prop({
    default: '',
  })
  queryConditions!: string;

  @Prop({ default: {} })
  sortField!: any;

  @Prop({
    default: '',
  })
  sortRule!: string;

  @Prop({ default: '' })
  listIcon!: string;

  @Prop()
  runMode!: string;

  @Prop()
  textStyle!: any;

  @Prop()
  fromDashboard: any;

  list: any[] = [];

  totalPage: number = 0;

  page: number = 0;

  pageSize: number = 0;

  showEmptyImg: boolean = true;

  loadListComplete: boolean = false; //数据是否加载完毕，请求过程中不展示缺省图

  heightNoMoreThanMAX: boolean = false; //用作计算运行态缺省图是否显示

  getPageSize() {
    const textDisplayBox = this.$refs['textListDisplay'] as HTMLElement;
    if (textDisplayBox) {
      const textDisplayBoxHeight = textDisplayBox.offsetHeight;
      if (textDisplayBoxHeight > 106) {
        this.showEmptyImg = true;
      } else {
        this.showEmptyImg = false;
      }
      return Math.floor(textDisplayBoxHeight / TEXT_LINE_HEIGHT);
    } else {
      return 0;
    }
  }

  mounted() {
    setTimeout(() => {
      this.getPageSizeAndGetList();
    }, 500);
    const resizeObserver = new ResizeObserver(() => {
      {
        this.getPageSizeAndGetList();
      }
    });
    const textDisplayBox = this.$refs['textListDisplay'] as HTMLElement;
    resizeObserver.observe(textDisplayBox);

    const Max = 226;
    if (textDisplayBox && textDisplayBox.clientHeight - 58 < Max) {
      this.heightNoMoreThanMAX = true;
    }
  }

  getPageSizeAndGetList() {
    this.pageSize = this.getPageSize();
    this.getList();
  }

  checkConfig() {
    if (
      !this.dataSource ||
      (this.dataSource === 'bizModel' && !this.bizModel) ||
      !this.displayFieldList.length
    ) {
      return false;
    } else {
      return true;
    }
  }

  @Watch('dataSource')
  dataSourceChange() {
    if (this.pageSize) {
      this.getList();
    } else {
      this.pageSize = this.getPageSize();
      this.getList();
    }
  }

  @Watch('bizModel')
  bizModelChange() {
    if (this.pageSize) {
      this.getList();
    } else {
      this.pageSize = this.getPageSize();
      this.getList();
    }
  }

  @Watch('displayFieldList')
  displayFieldListChange() {
    if (this.pageSize) {
      this.getList();
    } else {
      this.pageSize = this.getPageSize();
      this.getList();
    }
  }

  @Watch('sortField')
  sortFieldListChange() {
    if (this.pageSize) {
      this.getList();
    } else {
      this.pageSize = this.getPageSize();
      this.getList();
    }
  }

  @Watch('sortRule')
  sortRuleListChange() {
    if (this.pageSize) {
      this.getList();
    } else {
      this.pageSize = this.getPageSize();
      this.getList();
    }
  }

  @Watch('queryConditions')
  queryConditionsChange() {
    if (this.pageSize) {
      this.getList();
    } else {
      this.pageSize = this.getPageSize();
      this.getList();
    }
  }

  getVal(val){
    this.getList(val);
  }

  async getList(val?:any) {
    if (!this.checkConfig()) {
      this.list = [];
      this.totalPage = 0;
      this.loadListComplete = true;
      return;
    }
    const params = {
      dataSource: this.dataSource,
      bizModel: this.bizModel,
      displayField: this.displayFieldList.map((el) => el.value),
      sortField: [this.sortField.value],
      sortRule: this.sortRule === 'descending' ? 2 : 1,
      pageSize: this.pageSize,
      page: this.page,
    };
    this.list = await this.getDisplayList(params,val);
    this.loadListComplete = true;
  }

  async getDisplayList(params,val) {
    switch (params.dataSource) {
      case 'bizModel':
        const queryCondition = this.queryConditions
          ? JSON.parse(this.queryConditions)
          : [];
        // const bizModelParams = {
        //   filters: [],
        //   mobile: false,
        //   orderByFields: params.sortField,
        //   orderType: params.sortRule,
        //   page: params.page,
        //   queryCondition: [queryCondition],
        //   options: {
        //     queryDisplayType: '1',
        //     customDisplayColumns: params.displayField,
        //   },
        //   queryCode: params.bizModel,
        //   schemaCode: params.bizModel,
        //   size: params.pageSize,
        //   showTotal: true,
        // };
        let user = JSON.parse(sessionStorage.getItem('user'))
        const bizModelParams = {
          mobile: false,
          userName:user.username,
          corpId:user.corpId,
          dynamic:val?val:this.tabOption,
        }
        return await this.getBizModalData(bizModelParams);
      case 'myUnfinished':
        const unFinishedParams = {
          workflowName: undefined,
          workflowCode: undefined,
          originator: undefined,
          wd: undefined,
          batchOperate: false,
          page: params.page,
          size: params.pageSize,
        };
        return await this.getMyUnFinishedData(unFinishedParams);
      case 'myFinished':
        const finishedParams = {
          workflowName: undefined,
          workflowCode: undefined,
          originator: undefined,
          unitType: undefined,
          instanceState: undefined,
          startTime: undefined,
          endTime: undefined,
          page: params.page,
          size: params.pageSize,
        };
        return await this.getMyFinishedData(finishedParams);
      case 'myRead':
        const readParams = {
          workflowName: undefined,
          workflowCode: undefined,
          originator: undefined,
          unitType: undefined,
          instanceState: undefined,
          startTime: undefined,
          endTime: undefined,
          page: params.page,
          size: params.pageSize,
        };
        return await this.getMyReadData(readParams);
      case 'myUnread':
        const unReadParams = {
          wd: undefined,
          workflowName: undefined,
          workflowCode: undefined,
          originator: undefined,
          workflowTplName: {},
          unitType: undefined,
          page: params.page,
          size: params.pageSize,
        };
        return await this.getMyUnreadData(unReadParams);
      case 'myStart':
        const startParams = {
          workflowName: undefined,
          workflowCode: undefined,
          startTime: undefined,
          endTime: undefined,
          instanceState: '',
          page: params.page,
          size: params.pageSize,
        };
        return await this.getMyStartData(startParams);
      default:
        return [];
    }
  }

  lastBizModalDataParams: any = {};

  async getBizModalData(params) {
    if (
      JSON.stringify(params) === JSON.stringify(this.lastBizModalDataParams)
    ) {
      return this.list;
    } else {
      this.lastBizModalDataParams = params;
    }
    const bizModelRes = await listApi.getDynamicList(params as any);
    if (bizModelRes.errcode === 0 && bizModelRes.data) {
      // this.totalPage = bizModelRes.data.totalPages;
      this.$emit('auditUnit',bizModelRes.data.isAuditUnit);
      return bizModelRes.data.list;
    } else {
      // this.totalPage = 0;
      return [];
    }
  }

  lastMyUnFinishedDataParams: any = {};

  async getMyUnFinishedData(params) {
    if (
      JSON.stringify(params) === JSON.stringify(this.lastMyUnFinishedDataParams)
    ) {
      return this.list;
    } else {
      this.lastMyUnFinishedDataParams = params;
    }
    const unFinishedRes = await workflowCenterApi.searchWorkitems(params);
    if (unFinishedRes.errcode === 0 && unFinishedRes.data) {
      this.totalPage = unFinishedRes.data.totalPages;
      return unFinishedRes.data.content;
    } else {
      this.totalPage = 0;
      return [];
    }
  }

  lastMyFinishedDataParams: any = {};

  async getMyFinishedData(params) {
    if (
      JSON.stringify(params) === JSON.stringify(this.lastMyFinishedDataParams)
    ) {
      return this.list;
    } else {
      this.lastMyFinishedDataParams = params;
    }
    const finishedRes = await workflowCenterApi.listFinishedWorkitems(params);
    if (finishedRes.errcode === 0 && finishedRes.data) {
      this.totalPage = finishedRes.data.totalPages;
      return finishedRes.data.content;
    } else {
      this.totalPage = 0;
      return [];
    }
  }

  lastMyUnreadDataParams: any = {};

  async getMyUnreadData(params) {
    if (
      JSON.stringify(params) === JSON.stringify(this.lastMyUnreadDataParams)
    ) {
      return this.list;
    } else {
      this.lastMyUnreadDataParams = params;
    }
    const unReadRes = await workflowCenterApi.searchCirculates(params);
    if (unReadRes.errcode === 0 && unReadRes.data) {
      this.totalPage = unReadRes.data.totalPages;
      return unReadRes.data.content;
    } else {
      this.totalPage = 0;
      return [];
    }
  }

  lastMyReadDataParams: any = {};

  async getMyReadData(params) {
    if (JSON.stringify(params) === JSON.stringify(this.lastMyReadDataParams)) {
      return this.list;
    } else {
      this.lastMyReadDataParams = params;
    }
    const readRes = await workflowCenterApi.listReadWorkitems(params);
    if (readRes.errcode === 0 && readRes.data) {
      this.totalPage = readRes.data.totalPages;
      return readRes.data.content;
    } else {
      this.totalPage = 0;
      return [];
    }
  }

  lastMyStartDataParams: any = {};

  async getMyStartData(params) {
    if (JSON.stringify(params) === JSON.stringify(this.lastMyStartDataParams)) {
      return this.list;
    } else {
      this.lastMyStartDataParams = params;
    }
    const startRes = await workflowCenterApi.getMyInstanceList(params);
    if (startRes.errcode === 0 && startRes.data) {
      this.totalPage = startRes.data.totalPages;
      return startRes.data.content;
    } else {
      this.totalPage = 0;
      return [];
    }
  }

  checkPage(pageOptions) {
    if (
      this.page + pageOptions < 0 ||
      this.page + pageOptions >= this.totalPage
    ) {
      return;
    }
    this.page += pageOptions;
    this.getList();
  }

  getFieldData(source, dataItemType) {
    const sourceData = source.data || source;
    if (!sourceData[dataItemType.value]) {
      return '--';
    }
    switch (dataItemType.type) {
      case DataItemType.ShortText:
        if (
          ['sequenceStatus', 'workflowInstanceState'].includes(
            dataItemType.value,
          )
        ) {
          return SEQUENCE_STATUS[sourceData[dataItemType.value]];
        } else if (dataItemType.value === 'participants') {
          return sourceData[dataItemType.value].name;
        } else {
          if(dataItemType.value === "company"){
            if(this.tabOption === '内部数据'){
              return sourceData['internalDynamics'];
            }else{
              return sourceData['externalDynamics'];
            }
          }else{
            return sourceData[dataItemType.value];
          }
        }
      case DataItemType.Number:
        if (['costTime', 'stayTime'].includes(dataItemType.value)) {
          const day = Math.floor(
            sourceData[dataItemType.value] / (24 * 60 * 60 * 1000),
          );
          const hour = Math.floor(
            (sourceData[dataItemType.value] % (24 * 60 * 60 * 1000)) /
              (60 * 60 * 1000),
          );
          const min = Math.floor(
            ((sourceData[dataItemType.value] % (24 * 60 * 60 * 1000)) %
              (60 * 60 * 1000)) /
              (60 * 1000),
          );
          return (
            (day ? `${day}天` : '') +
            (day || hour ? `${hour}小时` : '') +
            (day || hour || min ? `${min}秒` : '--')
          );
        } else {
          return sourceData[dataItemType.value];
        }
      case DataItemType.StaffSingle:
      case DataItemType.StaffMulti:
      case DataItemType.DeptSingle:
      case DataItemType.DeptMulti:
      case DataItemType.StaffDeptMix:
        return sourceData[dataItemType.value].map((i) => i.name).join(';');
      // default:
        // return sourceData[dataItemType.value];
    }
  }

  // 打开最近使用

  openDetail(obj) {
    console.log(obj,"obj");
    debugger
    if (this.runMode !== 'runtime') {
      return;
    }

    let url: string = '';
    if (
      ['myFinished', 'myUnfinished', 'myUnread', 'myRead'].includes(
        this.dataSource,
      )
    ) {
      // 我的已办、我的待办、我的待阅、我的已阅
      url = `/form/detail?workitemId=${obj.id}&workflowInstanceId=${obj.instanceId}&workitemType=finishedWorkitem`;
    } else if (this.dataSource === 'myStart') {
      // 我的流程
      url = `/form/detail?workflowInstanceId=${obj.id}`;
    } else {
      console.log(obj.workflowInstanceId,'obj.workflowInstanceId')
      if (obj.workflowInstanceId) {
        url = `/form/detail?sheetCode=&workflowInstanceId=${obj.workflowInstanceId}&objectId=${obj.id}&isWorkFlow=true&_viewCode=${obj.schemaCode}`;
      } else {
        if (this.fromDashboard) {
          
          url = `/form/detail?objectId=${obj.id}&schemaCode=${obj.schemaCode}&isWorkFlow=false&_viewCode=${obj.schemaCode}&fromDashboard=true`;
        } else {
          url = `/form/detail?objectId=${obj.id}&schemaCode=${obj.schemaCode}&isWorkFlow=false&_viewCode=${obj.schemaCode}`;
          
        }
      }
    }

    if (this.isDingTalk) {
      this.$router
        .push({
          path: url,
        })
        .catch((err: any) => {
          console.error(err);
        });
    } else {
      this.showFormDetail(url, () => {
        this.getList();
      });
    }
  }

  getFieldName(field) {
    let name = field.name;

    if (field.name_i18n) {
      const name_i18n =
        typeof field.name_i18n === 'object'
          ? field.name_i18n
          : JSON.parse(field.name_i18n);
      name = name_i18n[this.$i18n.locale] || name;
    }
    if (this.$i18n.locale === 'en') {
      name = zhToEn[name] || name;
    }
    return name;
  }
}
</script>
<style lang="less" scoped>
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
.text-list-display {
  position: relative;
  height: 100%;
  display: flex;
  flex-flow: column;
  overflow: hidden;
  .header-btn {
    position: absolute;
    height: 58px;
    line-height: 58px;
    top: -58px;
    right: 24px;
    .btn {
      display: inline-block;
      width: 18px;
      height: 18px;
      background: #eef4fd;
      border-radius: 2px;
      line-height: 18px;
      font-size: 12px;
      text-align: center;
      margin-left: 4px;
      color: @textColor;
      cursor: pointer;
      &.disabled {
        background-color: #f1f2f6;
        color: rgba(17, 18, 24, 0.25);
        cursor: no-drop;
      }
    }
  }
  .text-list-display-title {
    padding: 10px 16px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 22px;
    width: 100%;
    overflow: hidden;
    height: 42px;
    min-height: 42px;
    background: rgba(17, 18, 24, 0.04);
    box-shadow: 0px 1px 0px 0px #e4e7ee;
    margin-bottom: 6px;
    .item-field {
      height: 22px;
      font-size: 14px;
      font-weight: 600 !important;
      color: #111218;
      line-height: 22px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &-1-0 {
        width: 100%;
        padding: 0 8px;
      }
      &-2-0,
      &-2-1,
      &-3-0,
      &-4-0,
      &-5-0,
      &-6-0,
      &-7-0,
      &-8-0,
      &-9-0,
      &-10-0 {
        width: 50%;
        padding: 0 8px;
      }
      &-3-1,
      &-3-2 {
        width: 25%;
        padding: 0 8px;
      }
      &-4-1,
      &-4-2,
      &-4-3 {
        width: 16.67%;
        padding: 0 8px;
      }
      &-5-1,
      &-5-2,
      &-5-3,
      &-5-4 {
        width: 12.5%;
        padding: 0 8px;
      }
      &-6-1,
      &-6-2,
      &-6-3,
      &-6-4,
      &-6-5 {
        width: 10%;
        padding: 0 8px;
      }
      &-7-1,
      &-7-2,
      &-7-3,
      &-7-4,
      &-7-5,
      &-7-6 {
        width: 8.33%;
        padding: 0 8px;
      }
      &-8-1,
      &-8-2,
      &-8-3,
      &-8-4,
      &-8-5,
      &-8-6,
      &-8-7 {
        width: 7.14%;
        padding: 0 8px;
      }
      &-9-1,
      &-9-2,
      &-9-3,
      &-9-4,
      &-9-5,
      &-9-6,
      &-9-7,
      &-9-8 {
        width: 6.25%;
        padding: 0 8px;
      }
      &-10-1,
      &-10-2,
      &-10-3,
      &-10-4,
      &-10-5,
      &-10-6,
      &-10-7,
      &-10-8,
      &-10-9 {
        width: 5.55%;
        padding: 0 8px;
      }
    }
  }
  
    .text-list-wrapper {
      flex: 1;
      overflow: auto;
      overflow-y: scroll;
      margin-bottom: 36px;
      padding-top: 24px;
      .list-item {
        width: 100%;
      padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 22px;
      margin-bottom: 22px;
      // margin-bottom: 18px;
        width: 100%;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          .item-field {
            color: @highlightColor !important;
            opacity: 1;
            &:first-child {
              color: @highlightColor !important;
              opacity: 1;
            }
          }
          &.dot {
            &::before {
              color: @highlightColor !important;
            }
          }
          &.diamond {
            &::before {
              //color: @highlightColor !important;
              // color: #F08801;
              
            }
          }
        }
        &:last-child {
          // margin-bottom: 0;
        }
        .item-field {
          height: 22px;
          font-size: 14px;
          font-weight: 400!important;
          line-height: 22px;
          color: rgba(17, 18, 24);
          opacity: 0.5;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:first-child {
            color: #111218;
            opacity: 1;
            padding-left: 3px;
            width: 75%;
          }
          &-1-0 {
            width: 100%;
            padding: 0 8px;
          }
          &-2-0,
          &-2-1,
          &-3-0,
          &-4-0,
          &-5-0,
          &-6-0,
          &-7-0,
          &-8-0,
          &-9-0,
          &-10-0 {
            width: 50%;
            padding: 0 8px;
          }
          &-3-1,
          &-3-2 {
            width: 25%;
            min-width: 25%;
            padding: 0 8px;
          }
          &-4-1,
          &-4-2,
          &-4-3 {
            width: 16.67%;
            padding: 0 8px;
          }
          &-5-1,
          &-5-2,
          &-5-3,
          &-5-4 {
            width: 12.5%;
            padding: 0 8px;
          }
          &-6-1,
          &-6-2,
          &-6-3,
          &-6-4,
          &-6-5 {
            width: 10%;
            padding: 0 8px;
          }
          &-7-1,
          &-7-2,
          &-7-3,
          &-7-4,
          &-7-5,
          &-7-6 {
            width: 8.33%;
            padding: 0 8px;
          }
          &-8-1,
          &-8-2,
          &-8-3,
          &-8-4,
          &-8-5,
          &-8-6,
          &-8-7 {
            width: 7.14%;
            padding: 0 8px;
          }
          &-9-1,
          &-9-2,
          &-9-3,
          &-9-4,
          &-9-5,
          &-9-6,
          &-9-7,
          &-9-8 {
            width: 6.25%;
            padding: 0 8px;
          }
          &-10-1,
          &-10-2,
          &-10-3,
          &-10-4,
          &-10-5,
          &-10-6,
          &-10-7,
          &-10-8,
          &-10-9 {
            width: 5.55%;
            padding: 0 8px;
          }
	        
        }
        .item-field-3-1 {
          label {
            padding: 3px 12px;
            border-radius: 2px;
            background: rgba(35,110,235,0.1);
            font-size: 10px;
            color: #2970FF;
          }
        }
        &.dot {
          counter-reset: dot 2;
          padding-left: 36px;
          position: relative;
          &::before {
            position: absolute;
            left: 22px;
            content: counter(dot, disc) ' ';
            font-size: 24px;
            display: inline-block;
          }
        }
        &.diamond {
          counter-reset: diamond 2;
        padding-left: 42px;
          position: relative;
          &::before {
            position: absolute;
            left: 26px;
            top: 6px;
            content: '';
            // content: counter(diamond, square) ' ';
            // font-size: 25px;
            width: 9px;
            height: 9px;
            border-radius: 1px;
            transform: rotate(45deg);
            background-image: linear-gradient(180deg, #F8B700 0%, #F08801 100%);;
            // -webkit-background-clip: text;
            // color: transparent;
            // color: #F08801;
          }
        }
      }
    }
    .runtime-mode {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      img {
        width: 204px;
        height: 204px;
      }
      span {
        font-size: 12px;
        color: rgba(17, 18, 24, 0.5);
        line-height: 22px;
      }
    }
}
</style>
