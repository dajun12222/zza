<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div id="portal-form-list-container" class="app-menu">
    <div id="ApplicationList" ref="application" class="application-box">
      <div id="ContentTop" ref="contentTop" class="content-top">
        <template v-for="(list, index) in queryListView">
          <div
            :key="index"
            class="list-li"
            :class="{ active: curQueryListInfo.code === list.code }"
          >
            <div class="list-box" @click="changeListView(list)">
              <a-tooltip>
                <template
                  v-if="(list.length_i18n[$i18n.locale] || list.length) > 28"
                  slot="title"
                >
                  <span>{{ list.name_i18n[$i18n.locale] || list.name }}</span>
                </template>
                <span class="list-name">{{
                  list.name_i18n[$i18n.locale] || list.name
                }}</span>
              </a-tooltip>
            </div>
          </div>
        </template>
        <div
          v-if="queryListMore.length > 0"
          class="list-li"
          :class="{
            active: queryListMore.includes(curQueryListInfo),
            expend: showQueryHeaderList,
          }"
        >
          <div
            class="list-box"
            @click="showQueryHeaderList = !showQueryHeaderList"
          >
            <a-tooltip v-if="queryListMore.includes(curQueryListInfo)">
              <template
                v-if="
                  (curQueryListInfo.length_i18n[$i18n.locale] ||
                    curQueryListInfo.length) > 28
                "
                slot="title"
              >
                <span>{{
                  curQueryListInfo.name_i18n[$i18n.locale] ||
                  curQueryListInfo.name
                }}</span>
              </template>
              <span class="list-name">{{
                curQueryListInfo.name_i18n[$i18n.locale] ||
                curQueryListInfo.name
              }}</span>
            </a-tooltip>
            <span v-else class="list-name">更多</span>
            <span
              v-show="!showQueryHeaderList && showIcon"
              class="icon aufontAll"
              >&#xe88a;</span>
            <span
              v-show="showQueryHeaderList && showIcon"
              class="icon aufontAll"
              >&#xe8ac;</span>
          </div>
          <div v-if="showQueryHeaderList && showIcon" class="query-more-list">
            <div
              v-for="(list, index) in queryListMore"
              :key="index"
              class="list-item"
              :class="{ selected: curQueryListInfo.code === list.code }"
              @click="changeListView(list)"
            >
              <div
                class="item-name"
                :title="list.name_i18n[$i18n.locale] || list.name"
              >
                {{ list.name_i18n[$i18n.locale] || list.name }}
              </div>
            </div>

            <div class="filter-mask" @click="showQueryHeaderList = false"></div>
          </div>
        </div>
      </div>

      <div
        :class="
          schemaCode !== 'onlineLearning'
            ? 'list-table-box'
            : 'list-table-box list-study-box'
        "
      >
        <div
          id="list-table-body"
          :class="{
            'query-fixed': filterFixed,
            'tree-modal': modelType === 'TREE',
          }"
        >
          <!-- table操作栏 -->
          <div
            id="table-toolbar"
            class="table-toolbar"
            :style="{ 'padding-left': treeQueryBoxWidth + 'px' }"
          >
            <!-- 操作 -->
            <div class="actions-box">
              <!-- 其他操作按钮:新增/删除/... -->
              <div id="list-actions" ref="actions">
                <!-- {{ queryActionsView }} -->
                <template v-for="(ac, index) in queryActionsView">
                  <template v-if="ac">
                    <a-button
                      :id="ac && ac.attributes && ac.attributes.id"
                      v-if="
                        (ac.actionCode !== 'edit' &&
                        ac.actionCode !== 'form_track' &&
                        ac.actionCode !== 'FORM_TRACK' &&
                        ((!deleteDisabled && ac.actionCode === 'import') ||
                          (deleteDisabled &&
                            (ac.actionCode === 'batch_update' ||
                              ac.actionCode === 'delete' ||
                              ac.actionCode === 'editowner')) ||
                          ac.actionCode === 'export' ||
                          ac.actionCode === 'add' ||
                          ac.actionCode === 'batch_print' ||
                          ac.actionCode === 'qr_code' ||
                          ac.queryActionType === 7 ||
                          ac.bindAction))
                          && 
                          ac['code'] === 'collection' ? isShowCollection : true 
                      "
                      :key="index"
                      :class="
                        ac
                          ? (ac.attributes && ac.attributes.class) ||
                            `list-action-${ac.actionCode}`
                          : ''
                      "
                      :type="addPower && index === 0 ? 'primary' : 'default'"
                      :disabled="
                        (!deleteDisabled && ac && ac.actionCode === 'delete') ||
                        (exportDisabled && ac && ac.actionCode === 'export') ||
                        (exportDisabled && ac && ac.actionCode === 'qr_code') ||
                        (!deleteDisabled &&
                          ac &&
                          ac.actionCode === 'editowner') ||
                        (ac &&
                          ac.actionCode === 'batch_update' &&
                          (isCheckedWorkFlow || !deleteDisabled)) ||
                        (!total && ac && ac.actionCode === 'batch_print')
                      "
                      @click="(e) => actionClick(ac, e)"
                    >
                      {{
                        isChinese
                          ? ac && ac.name
                          : ac && (zhToen[ac.name] || ac.name)
                      }}
                    </a-button>
                  </template>
                </template>
                <div
                  v-if="
                    !(
                      modelType === 'TREE' ||
                      (queryPresentationType === 'GANTT' &&
                        listConfig.queryGanttModel.levelPropertyCode)
                    ) && queryActionsModal.length
                  "
                  class="list-actions-more"
                >
                  <a-popover
                    overlayClassName="list-actions-popover"
                    placement="bottom"
                  >
                    <template slot="content">
                      <p
                        v-for="(el, index2) in queryActionsModal"
                        :key="index2"
                        :class="
                          el.actionCode !== 'edit' &&
                          el.actionCode !== 'form_track' &&
                          el.actionCode !== 'FORM_TRACK' &&
                          ((!deleteDisabled && el.actionCode === 'import') ||
                            (deleteDisabled &&
                              (el.actionCode === 'batch_update' ||
                                el.actionCode === 'delete' ||
                                el.actionCode === 'editowner')) ||
                            el.actionCode === 'export' ||
                            el.actionCode === 'add' ||
                            el.actionCode === 'batch_print' ||
                            el.actionCode === 'qr_code' ||
                            el.queryActionType === 7 ||
                            el.bindAction)
                            ? ''
                            : 'displayNone'
                        "
                        @click="(e) => actionClick(el, e)"
                      >
                        <template v-if="el.operateType && el.hint">
                          <a-tooltip placement="top">
                            <template #title>
                              <span>{{ el.hint }}</span>
                            </template>
                            <span>
                              {{
                                isChinese
                                  ? el && el.name
                                  : el && (zhToen[el.name] || el.name)
                              }}
                            </span>
                          </a-tooltip>
                        </template>
                        <template v-else>
                          {{
                            isChinese
                              ? el && el.name
                              : el && (zhToen[el.name] || el.name)
                          }}
                        </template>
                      </p>
                    </template>
                    <!-- <i v-show="!checkeds.some(item=>item)" class="icon aufontAll h-icon-all-ellipsis-o"></i> -->
                    <i
                      v-if="queryActionsModal.length"
                      class="icon aufontAll h-icon-all-ellipsis-o"
                    ></i>
                  </a-popover>
                </div>
              </div>
            </div>
            <div class="table-toolbar-box">
              <!-- <div class="table-toolbar-title">
                <div
                  class="list-header"
                  @click="showQueryHeaderList = !showQueryHeaderList"
                >
                  <div :title="isChinese ? curTitle : curTitleNameI18n[$i18n.locale]">
                    {{ isChinese ? curTitle : curTitleNameI18n[$i18n.locale] }}
                  </div>
                  <i
                    v-show="!showQueryHeaderList && showIcon"
                    class="icon aufontAll h-icon-all-down-o"
                  ></i>
                  <i
                    v-show="showQueryHeaderList && showIcon"
                    class="icon aufontAll h-icon-all-up-o"
                  ></i>
                </div>
                <div class="query-header-list" v-if="showQueryHeaderList && showIcon">
                  <div
                    class="list-item"
                    :class="{ selected: curQueryListInfo.code === list.code }"
                    v-for="(list, index) in queryHeaderList"
                    :key="index"
                    @click="changeListView(list)"
                  >
                    <div class="item-name">
                      {{ isChinese ? list.name : list.name_i18n[$i18n.locale] }}
                    </div>
                  </div>

                  <div class="filter-mask" @click="showQueryHeaderList = false"></div>
                </div>
              </div> -->
              <!-- <a-tabs
                :activeKey="tabKey"
                class="page-header-left-tab"
                @change="changeTabs"
              >
                <a-tab-pane
                  v-for="item in tabsList"
                  :key="item.key"
                  :tab="item.value"
                />
              </a-tabs> -->
              <div class="promotedDiv">
                  <!-- <div>
                      <a-input-search
                          placeholder="当前目录下搜索知识"
                          style="width: 200px"
                          @search="onSearch"
                          @pressEnter="onPressEnter"
                      />
                  </div>
                  <div class="promoted-div">
                      <a-checkbox
                          v-model="checked"
                          class="onlyTj"
                          @change="handleCheck"
                      >
                          只看推荐
                      </a-checkbox>
                  </div> -->
                  <div
                    v-if="formTrackPermission"
                    class="table-toolbar-box-li"
                    @click="showFormTrack"
                  >
                    <i class="icon aufontAll h-icon-all-reload-time"></i>
                    <span>
                      {{ $t('cloudpivot.list.pc.FormTrack') }}
                    </span>
                  </div>

                  <div 
                  v-if="schemaCode !== 'onlineLearning' && schemaCode !== 'onlineExam' && schemaCode !== 'onlineCourseExam' && schemaCode !== 'analysis'"
                  class="table-toolbar-box-li"
                  >
                    <a-popover
                      trigger="click"
                      placement="bottomRight"
                      overlayClassName="font-setting-drag"
                      :destroyTooltipOnHide="true"
                    >
                      <template slot="content">
                        <FontSetting
                          :columns="columns"
                          :listConfig="listConfig"
                          :queryPresentationType="queryPresentationType"
                          @confirm="reRenderTable"
                          @recovery="recovery"
                          @search="filterColumns"
                        />
                      </template>
                      <i class="icon aufontAll h-icon-all-setting-fill"></i>
                      <span>
                        {{ $t('cloudpivot.list.pc.SetDisplayItems') }}
                      </span>
                    </a-popover>
                  </div>
                  <div
                    v-if="
                      !filterFixed &&
                      Array.isArray(queryConditions) &&
                      queryConditions.length
                    "
                    :class="{
                      'high-light': isShowFilterBox || queryActive,
                      'high-light2': isShowFilterBox && !queryActive,
                    }"
                    class="table-toolbar-box-li"
                    @click="toggleQueryConditions"
                  >
                    <div class="icon-background"></div>
                    <i class="icon aufontAll h-icon-all-screen"></i>
                    <span>
                      {{ $t('cloudpivot.list.pc.Screen') }}
                    </span>
                  </div>
              </div>
            </div>
          </div>

          <!-- 加载状态 -->
          <PageLoading
            v-model="isLoading"
            shadeColor="#F4F6FC"
            :shadeOpacity="1"
          />

          <!-- 列表数据 -->
          <div v-if="isShowTableBox" class="table-box">
            <!-- 表格+甘特图展示 -->
            <div
              v-if="queryPresentationType === 'GANTT'"
              class="cus-gantt-table"
            >
              <div id="tree-query-box">
                <tree-query-form
                  ref="treeQueryForm"
                  @setFilterData="setTreeFilterData"
                  @treeButtonEvent="treeButtonEvent"
                  @dropTreeQueryBoxEvent="dropTreeQueryBoxEvent"
                />
              </div>
              <div
                style="
                  width: 100%;
                  overflow: hidden;
                  display: flex;
                  flex-flow: column;
                "
              >
                <!-- <div v-show="isShowFilterBox" ref="filtersBox" class="filters-box">
                  <query-form
                    ref="queryForm"
                    :fields="queryConditions"
                    :relevanceDataList="relevanceDataList"
                    :dataItemList="dataItemList"
                    @getRelevanceDataList="getRelevanceDataList"
                    @setFilterData="setFilterData"
                    @hide="hideQueryItem"
                  />
                </div> -->
                <div id="ganttTableBox" class="gantt-table-box">
                  <div id="ganttTable" class="gantt-table">
                    <list-custom-template
                      v-if="isShowGanttTable"
                      v-show="cusColumns.length > 0"
                      ref="listCustomTemplate"
                      class="custom-template-container"
                      :pageVM="pageVM"
                      :sortConfig="
                        listConfig
                          ? listConfig.querySorts
                            ? listConfig.querySorts
                            : []
                          : []
                      "
                      :tableConfig="tableConfig"
                      :originalTableColumns="cusColumns"
                      :originalTableData="dataSource"
                      :originalNumberData="numberData"
                      :subQueryformConditions="subQueryformConditions"
                      :queryPresentationType="queryPresentationType"
                      :ganttProperties="listConfig.queryGanttModel || {}"
                      :isOpen="isOpen"
                      :onLineLearnList="onLineLearnList"
                      :onLineExamList="onLineExamList"
                      :onLineExamCourseList="onLineExamCourseList"
                      :analysisExamList="analysisExamList"
                      :modelType="
                        listConfig.queryGanttModel.levelPropertyCode
                          ? 'TREE'
                          : 'LIST'
                      "
                      @bySortGetQueryList="bySortGetQueryList"
                      @onCheck="onCheck"
                      @onResizeEnd="onResizeEnd"
                      @onExpandRow="onExpandRow"
                      @getAsyncTreeData="getAsyncTreeDataGantt"
                      @dragTable="dragTable"
                    />

                    <!--没有展示字段-->
                    <div
                      v-if="
                        cusColumns.length <= 0 &&
                        !isShowNoData &&
                        !isShowSearchNoData
                      "
                      class="no-columns"
                    >
                      <img
                        src="./components/no-data/images/no-data.png"
                        alt=""
                      />
                      <p>{{ $t('cloudpivot.list.pc.chooseColumns') }}</p>
                    </div>

                    <div
                      v-if="
                        (isShowNoData || isShowSearchNoData) && isShowGanttTable
                      "
                      class="no-data"
                    >
                      <PageNoData
                        :isShowNoData="isShowNoData || isShowSearchNoData"
                        :type="isShowSearchNoData ? 'search' : 'show'"
                        :tipText="$t('cloudpivot.list.pc.NoData')"
                      />
                    </div>
                    <div
                      id="gantt-resize"
                      v-show="isShowGanttTable"
                      :class="{ hover: isGanttResizeHover }"
                    ></div>
                    <div
                      id="gantt-hide-menu"
                      @click="ganttTableShowChange"
                      @mouseenter="indexMouseenter"
                      @mouseleave="indexMouseleave"
                    >
                      <i class="icon aufontAll h-icon-all-outdent"></i>
                    </div>
                  </div>
                  <div class="gantt-view">
                    <gantt-view
                      ref="tableGantt"
                      :schemaCode="schemaCode"
                      :curListCode="curQueryListInfo.code"
                      :listConfig="listConfig"
                      :originalTableData="flatedListData"
                      :dependencies="ganttPreRelate"
                      :scopeType="dataScopeType"
                      :sortByDirect="sortByDirect"
                      :childSchemas="childSchemas"
                      :defaultValues="queryDefaultValues"
                      :filterObjectId="filterObjectId"
                      :dataItemList="dataItemList"
                      :formPermission="loadDatas.formPermission"
                      :sheetCode="
                        loadDatas && loadDatas.bizSheet
                          ? loadDatas.bizSheet.code
                          : schemaCode
                      "
                      :isOpen="isOpen"
                      :workflowAdminManageAuthotity="
                        workflowAdminManageAuthotity
                      "
                      @onGridDataUpdate="onGridDataUpdate"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- 正常表格展示 -->
            <div
              v-if="
                queryPresentationType === 'LIST' ||
                queryPresentationType === null
              "
              ref="table"
              class="table"
            >
              <div id="tree-query-box">
                <tree-query-form
                  ref="treeQueryForm"
                  @setFilterData="setTreeFilterData"
                  @treeButtonEvent="treeButtonEvent"
                  @dropTreeQueryBoxEvent="dropTreeQueryBoxEvent"
                />
              </div>

              <div
                style="
                  overflow: hidden;
                  display: flex;
                  flex-flow: column;
                  height: 100%;
                  width: 100%;
                "
              >
                <div style="overflow: hidden; height: 100%; position: relative">
                  <!-- 加载状态 -->
                  <PageLoading
                    v-model="tableLoading"
                    shadeColor="#FFFFFFF"
                    :shadeOpacity="1"
                    :delay="500"
                  />
                  <!-- 旧版表单 -->
                  <sheet
                    v-if="
                      tableConfig.keepInOldVersion ||
                      tableConfig.version === '1.0'
                    "
                    v-show="cusColumns.length > 0"
                    :checkbox="canDelete"
                    :checkeds="checkeds"
                    :columns="cusColumns"
                    :rows="rows"
                    :columnSlots="columnSlots"
                    :rowSlots="rowSlots"
                    @check="onCheck"
                    @columnResize="onResizeEnd"
                  >
                    <!-- checkbox -->
                    <span v-if="canDelete" slot="checkboxTitle">
                      <a-checkbox
                        v-model="isSelectAll"
                        @change.stop="selectAll"
                      />
                    </span>
                    <!-- 序号 -->
                    <span slot="indexTitle" class="order-number-box">
                      <span>{{ $t('cloudpivot.list.pc.Number') }}</span>
                    </span>

                    <span
                      v-if="canDelete"
                      slot="checkbox"
                      slot-scope="{ text, row }"
                    >
                      <a-checkbox
                        v-model="row.isChecked"
                        @change.stop="onItemCheckboxChange"
                      />
                    </span>
                    <span
                      slot="index"
                      slot-scope="{ row }"
                      class="order-number-box"
                    >
                      <span>{{ JSON.stringify(row) }}</span>
                    </span>

                    <!-- 自定义的列 头 -->
                    <template v-for="(item, index) in cusColumns">
                      <span
                        v-show="item.isShow"
                        :key="index"
                        :slot="columnSlots[item.key]"
                        :title="item.vcTitle"
                        class="text-ellipsis"
                      >
                        {{
                          isChinese
                            ? item.vcTitle
                            : item.name_i18n[$i18n.locale]
                        }}
                      </span>
                    </template>

                    <!-- 自定义的列 表体 :title="text" -->
                    <template
                      v-for="(item, index) in cusColumns"
                      :slot="rowSlots[item.key]"
                      slot-scope="{ column, rowIndex }"
                    >
                      <span
                        v-show="item.isShow"
                        :key="index"
                        class="cursor text-ellipsis"
                        @click="goForm(column, rowIndex)"
                        >{{ getLabelContent(column, rowIndex) }}</span>
                    </template>
                  </sheet>
                  <!-- 新版表单 -->
                  <list-custom-template
                    v-else
                    v-show="cusColumns.length > 0"
                    ref="listCustomTemplate"
                    class="custom-template-container"
                    :pageVM="pageVM"
                    :sortConfig="
                      listConfig
                        ? listConfig.querySorts
                          ? listConfig.querySorts
                          : []
                        : []
                    "
                    :tableConfig="tableConfig"
                    :originalTableColumns="cusColumns"
                    :originalTableData="dataSource"
                    :originalNumberData="numberData"
                    :subQueryformConditions="subQueryformConditions"
                    :modelType="modelType"
                    :customButtonsRow="customButtonsRow"
                    :isOpen="isOpen"
                    :onLineLearnList="onLineLearnList"
                    :onLineExamList="onLineExamList"
                    :onLineExamCourseList="onLineExamCourseList"
                    :analysisExamList="analysisExamList"
                    :isCustomScriptOpen="isCustomScriptOpen"
                    @bySortGetQueryList="bySortGetQueryList"
                    @onCheck="onCheck"
                    @onResizeEnd="onResizeEnd"
                    @getAsyncTreeData="getAsyncTreeData"
                    @moreClick="moreClick"
                    @customScripts="customScripts"
                  />

                  <!-- 所有列取消勾选  -->
                  <div
                    v-if="
                      cusColumns.length <= 0 &&
                      !isShowNoData &&
                      !isShowSearchNoData
                    "
                    class="no-columns"
                  >
                    <img src="./components/no-data/images/no-data.png" alt="" />
                    <p>{{ $t('cloudpivot.list.pc.chooseColumns') }}</p>
                  </div>

                  <div
                    v-if="isShowNoData || isShowSearchNoData"
                    class="no-data"
                  >
                    <PageNoData
                      :isShowNoData="isShowNoData || isShowSearchNoData"
                      :type="isShowSearchNoData ? 'search' : 'show'"
                      :tipText="$t('cloudpivot.list.pc.NoData')"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="
                queryPresentationType === 'LIST' &&
                cusColumns.length > 0 &&
                modelType !== 'TREE' && 
                schemaCode !== 'analysis'
              "
              ref="paginationBox"
              class="pagination-box"
            >
              <template v-if="pagingSetting.showTotal !== false">
                <p v-if="onCheckNum > 0" class="onCheckNumP">
                  {{ $t('cloudpivot.list.pc.listSelected1') }}
                  <span>{{ onCheckNum }}</span>
                  {{ $t('cloudpivot.list.pc.listSelected2') }}
                </p>
                <a-pagination
                  v-if="modelType !== 'TREE' && total"
                  :current="curPage"
                  :total="total"
                  :showTotal="
                    (total) => $t('cloudpivot.list.pc.Total', { num: total })
                  "
                  :pageSize="pageSize"
                  :pageSizeOptions="pageSizeOptions"
                  showSizeChanger
                  showQuickJumper
                  @change="onPaginationChange"
                  @showSizeChange="onSizeChange"
                />
                <span v-else class="tree-total">
                  {{ isChinese ? `共${total}条` : `Total ${total}` }}
                </span>
              </template>
              <template v-else>
                <div class="no-show-total-pagination">
                  <span
                    class="prev-btn"
                    :class="{ disable: curPage <= 1 }"
                    :disabled="true"
                    @click="prevPage"
                  >
                    <em class="icon aufontAll h-icon-all-left"></em>
                  </span>
                  <span class="current-page">{{ curPage }}</span>
                  <span
                    class="next-btn"
                    :class="{ disable: totalPages <= curPage }"
                    @click="nextPage"
                  >
                    <em class="icon aufontAll h-icon-all-right"></em>
                  </span>

                  <a-select
                    v-model="pageSize"
                    placeholder="请选择"
                    style="width: 98px; height: 32px; margin-left: 8px"
                    @change="(value) => onSizeChange(1, value)"
                  >
                    <a-select-option
                      v-for="(items, ind) in pageSizeOptions"
                      :key="ind"
                      :value="+items"
                    >
                      {{ items }} 条/页
                    </a-select-option>
                  </a-select>
                </div>
              </template>
            </div>

            <!-- 导出图标 -->
            <div
              v-if="importIcon"
              :title="$t('cloudpivot.list.pc.exportList')"
              class="import-icon"
              @click="hideImportIcon"
            >
              <img
                src="./image/import.png"
                :alt="$t('cloudpivot.list.pc.exportList')"
              />
            </div>
          </div>

          <div class="load-fail-box">
            <PageLoadFail
              v-model="isShowLoadFailBox"
              :text="failText"
              @refresh="reload"
            />
          </div>
        </div>
        <template
          v-if="Array.isArray(queryConditions) && queryConditions.length"
        >
          <div
            v-show="filterFixed || isShowFilterBox"
            ref="filtersBox"
            class="filters-box"
            :class="filterFixed ? 'query-fixed' : ''"
          >
            <div
              class="fixed-icon"
              :title="
                filterFixed
                  ? `${$t('cloudpivot.list.pc.filterBox.unfixed')}`
                  : `${$t('cloudpivot.list.pc.filterBox.fixed')}`
              "
              @click="
                () => {
                  filterFixed = !filterFixed;
                  isShowFilterBox = true;
                }
              "
            >
              <span
                class="icon aufontAll"
                :class="filterFixed ? 'cancel-fixed' : 'fixed'"
                >&#xe86d;</span>
            </div>
            <query-form
              ref="queryForm"
              :key="queryTime"
              :fields="queryConditions"
              :relevanceDataList="relevanceDataList"
              :dataItemList="dataItemList"
              :filterFixed="filterFixed"
              :curListCode="curQueryListInfo.code"
              :schemaCode="schemaCode"
              @getRelevanceDataList="getRelevanceDataList"
              @setFilterData="setFilterData"
              @hide="hideQueryItem"
              @changeFilterFixed="changeFilterFixed"
            />
            <div
              v-if="!filterFixed"
              class="filter-mask"
              @click="
                () => {
                  isShowFilterBox = false;
                }
              "
            ></div>
          </div>
        </template>
      </div>
    </div>

    <model-table-import
      v-if="visible"
      :schemaCode="schemaCode"
      :queryCode="curQueryListInfo.code"
      :isWorkflowImport="isWorkflowImport"
      :statusParams="{
        errorMsg,
        successNum,
        failNum,
        importSize,
        importStatus,
        importFileName,
        showImportErrModal,
      }"
      @setFileName="setImportFileName"
      @setQueryField="setImportQueryField"
      @reset="reset"
      @ok="handleCancel"
      @importEnd="importEnd"
      @refreshList="getQueryList"
      @close="handleCancel"
      @setData="confirm"
      @modifyData="openFixDataModal"
    />

    <form-marking ref="FormMarking" :dataItemList="dataSource" />

    <ImportErrModal
      v-model="showImportErrModal"
      :status="secondImportStatus"
      :successNum="secondSuccessNum"
      :failNum="secondFailNum"
      :fileName="importFileName"
      :importData="importData"
      :queryCode="curQueryListInfo.code"
      @reloadList="getQueryList"
    />

    <!-- 表单导出 -->
    <DataExport
      v-model="showDataExport"
      :queryColumns="queryColumns"
      :extend1="extend1"
      :exportFileId="exportFileId"
      :type="listType"
      :code="curQueryListInfo.code"
      @exportEnd="handleExportData"
      @hideShowList="hideShowList"
    />

    <!-- 打印二维码弹窗 -->
    <PrintQrcode
      v-model="showPrintQrcode"
      :checkedLength="checkedLength"
      @createPrintQrCodeData="createPrintQrCodeData"
    />

    <PrintTemplateList
      v-model="toShowPrints"
      :printTempList="printTempList"
      @chosenTemplate="handleBatchPrintHide"
    />

    <!-- 修改表单拥有者弹框 -->
    <ModifyOwner
      ref="ModifyOwner"
      :checkeds="checkeds"
      :dataSource="dataSource"
      :pageSize="pageSize"
      :curPage="curPage"
      :schemaCode="schemaCode"
      :queryCode="curQueryListInfo.code"
      @modifyOwnerClick="onModifyOwnerClick"
    />
    <!-- 删除弹窗 -->

    <columnSetting
      v-model="showColumnSetting"
      :columns="columns"
      @confirm="reRenderTable"
      @recovery="recovery"
    />
    <div
      v-if="pdfUrl.includes('?file=') && isShowPdf"
      class="pdf-frame-div"
    ></div>
    <iframe id="pdfFrame" class="pdf-frame" :srcdoc="srcdoc"></iframe>
    <a-icon
      v-if="isShowPdf"
      type="close"
      class="close-previewPdf"
      @click="closePdf"
    />
    <!-- :options="opts" -->
    <printHtml style="height: 0px; overflow: hidden" :options="opts" />
    <template v-if="isPrintGenerateHtml">
      <GenerateHtml
        ref="printRenderer"
        :pages="draftAttributesJsonSet"
        :formdata="formdata"
      />
    </template>
    <template v-for="(i, n) of tempPrintEleArray">
      <template v-for="(tempPrintEle, v) in i">
        <TempPrintHtml
          :key="v + n + tempPrintEle.key"
          :printEle="tempPrintEle.tempPrintEle"
          :pageSettings="tempPrintPageSettings"
          @calcResult="collectorTempPrintInfo"
        />
      </template>
    </template>

    <batch-update
      :oldParams="oldParams"
      :updateOptions="updateOptions"
      @updateOver="updateOver"
      @visibleChange="updateVisibleChange"
    />

    <!-- 详情弹出层 -->

    <IframeModal
      :showIframeForm="showIframeForm"
      :IframeFormUrl="IframeFormUrl"
      @close="closeModal"
    />
    <!-- <div v-if="showIframeForm" class="iframe-shadow"></div>
    <transition name="fade-down">
      <div v-if="showIframeForm" class="iframe-form-warp">
        <div class="icon-close" @click="showIframeForm = false"> -->
    <!-- <span><a-icon type="close" /></span> -->
    <!-- <span class="icon aufontAll">&#xe996;</span>
        </div>
        <iframe
          ref="iframe"
          class="iframe-form-warp--page"
          :src="IframeFormUrl"
        ></iframe>
      </div>
    </transition> -->
    <a-modal
      :visible="showDeleteDetail"
      :title="$t('cloudpivot.list.pc.deleteData.deleteDetailTitle')"
      :zIndex="1001"
      width="800px"
      wrapClassName="delete-detail"
      @cancel="
        () => {
          showDeleteDetail = false;
        }
      "
    >
      <div class="warn-info">
        <span class="title">
          <span
            class="icon aufontAll icon aufontAll h-icon-all-info-circle-fill"
          ></span>
          {{ $t('cloudpivot.list.pc.deleteData.tipsTitle') }} </span><br />
        <span class="tips"><strong>{{ $t('cloudpivot.list.pc.deleteData.tips1strong') }}</strong>{{ $t('cloudpivot.list.pc.deleteData.tips1') }}</span><br />
        <span class="tips"><strong>{{ $t('cloudpivot.list.pc.deleteData.tips2strong') }}</strong>{{ $t('cloudpivot.list.pc.deleteData.tips2') }}</span><br />
        <span class="tips"><strong>{{ $t('cloudpivot.list.pc.deleteData.tips3strong') }}</strong>{{ $t('cloudpivot.list.pc.deleteData.tips3') }}</span><br />
      </div>
      <a-table
        :columns="deleteColumns"
        :data-source="pageDeleteData"
        bordered
        tableLayout="fixed"
        :pagination="false"
      >
        <span slot="relativeModelTitle" class="resize">
          {{ $t('cloudpivot.list.pc.deleteData.relatedModel') }}
          <a-tooltip>
            <template slot="title">
              <div>{{ $t('cloudpivot.list.pc.deleteData.tableTips1') }}</div>
              <div>{{ $t('cloudpivot.list.pc.deleteData.tableTips2') }}</div>
            </template>
            <span class="icon aufontAll icon h-icon-all-question-circle"></span>
          </a-tooltip>
        </span>
        <div
          slot="name"
          slot-scope="text, record"
          :title="record.name"
          class="dataCol"
        >
          {{ record.name }}
        </div>
        <div
          slot="relativeModel"
          slot-scope="text, record"
          :title="record.relativeModel"
          class="dataCol"
        >
          {{ record.relativeModel }}
        </div>
      </a-table>
      <div v-if="deleteData.length > 0" class="pagination">
        <a-pagination
          :pageSizeOptions="pageSizeOptions"
          :total="deleteData.length"
          :showTotal="
            (total) =>
              $t('cloudpivot.list.pc.deleteData.total', {
                num: deleteData.length,
              })
          "
          showSizeChanger
          showQuickJumper
          :defaultPageSize="pageSizeParams.size"
          :current="pageSizeParams.page"
          @change="pageChange"
          @showSizeChange="showSizeChange"
        />
      </div>
      <template slot="footer">
        <a-button
          @click="
            () => {
              showDeleteDetail = false;
            }
          "
        >
          {{ $t('cloudpivot.list.pc.deleteData.close') }}
        </a-button>
      </template>
    </a-modal>

    <!-- 自定义按钮查看列表弹框 -->
    <a-modal
      :visible="visibleOpen"
      width="1200px"
      :title="$t('cloudpivot.list.pc.listView')"
      :footer="null"
      :centered="true"
      :destroyOnClose="true"
      @cancel="onCloseInfoModal"
    >
      <custom-button-modal
        :schemaCode="customButtomModalCode"
        :viewCode="viewCodeCustom"
        @moreClick="moreClick"
      />
    </a-modal>
  </div>
</template>
<script src="./scripts/application-list.ts" />

<style lang="less" scoped>
@import './style/index.less';
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
@import './style/application-list-public.less';
.no-show-total-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 12px;
  span {
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    display: inline-block;
    min-width: 32px;
    height: 32px;
    line-height: 30px;
    text-align: center;
    padding: 0 5px;
    em {
      font-size: 12px;
    }
  }
  span:not(.disable):hover {
    color: #2970ff;
    border: 1px solid #2970ff;
  }
  .disable {
    color: rgba(0, 0, 0, 0.45);
    cursor: not-allowed;
  }
  .current-page {
    color: #2970ff;
    border: 1px solid #2970ff;
    border-radius: 2px;
    margin: 0 8px;
  }
}
</style>

<style lang="less">
@import '~cloudpivot-list/application/src/components/pc/style/custom-themes';
@import './style/application-list-private.less';
</style>
