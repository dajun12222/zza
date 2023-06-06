<!--
禁止修改!此文件是产品代码的一部分，后续可能变更或者不再开放。
若有问题，请参考前端相关二开文档。
-->
<template>
  <div class="list-wrapper">
    <div class="data-dictionary-list">
      <a-table
        class="table-user-list"
        :columns="columns"
        :pagination="false"
        :dataSource="data"
        :loading="loading"
        :rowKey="(record) => record.id"
        :ellipsis="true"
        :scroll="{ y: scrollHeight }"
      >
        <span slot="indexTitle" class="text-ellipsis">
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
          />
        </span>

        <!-- :scroll="{ y: 300 }" -->
        <!-- 序号 -->
        <template slot="index" slot-scope="text, record, index">
          <span
            @mouseenter="showCheckBox(record)"
            @mouseleave="hideCheckBox(record, index)"
          >
            <a-checkbox
              v-show="record.isShowCheckBox"
              :checked="record.checked"
              @change="() => rowSelection(record)"
            />
            <span v-show="!record.isShowCheckBox">{{ text }}</span>
          </span>
        </template>

        <!-- 字典类型 -->
        <template slot="dictionaryType" slot-scope="text">
          <span>{{ !text ? '简单键值' : '树形结构' }}</span>
        </template>

        <!-- 字典分类 -->
        <template slot="classificationName" slot-scope="text">
          <span>{{ text ? text : '--' }}</span>
        </template>

        <!-- 状态 -->
        <template slot="status" slot-scope="text">
          <p class="status-wrapper">
            <span class="dot" :class="{ green: text }"></span>
            <span :class="{ green: !text }">{{ text ? '有效' : '失效' }}</span>
          </p>
        </template>

        <!-- 操作 -->
        <template slot="operation" slot-scope="text, record">
          <div class="operation-btns operation">
            <i class="edit" @click="edit(record)">编辑</i>
            <i @click="changeItemStatus(record)">{{
              record.status ? '禁用' : '启用'
            }}</i>
          </div>
        </template>
      </a-table>
    </div>
    <div class="pagination-box">
      <a-pagination
        showQuickJumper
        :current="searchParams.pageNum"
        :total="total"
        :pageSizeOptions="pageSizeOptions"
        showSizeChanger
        :showTotal="showTotal"
        :pageSize="searchParams.pageSize"
        @change="pageChange"
        @showSizeChange="onShowSizeChange"
      >
        <template slot="buildOptionText" slot-scope="props">
          <span>{{ props.value }}条/页</span>
        </template>
      </a-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import dataDictionaryApi from 'cloudpivot-admin-core/src/apis/system/data-dictionary.api';
import { Table, Pagination, Checkbox } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component({
  name: 'DataDictionaryList',
  components: {
    ATable: Table,
    APagination: Pagination,
    ACheckbox: Checkbox,
  },
})
export default class DataDictionaryList extends Vue {
  @Prop({
    default: '',
  })
  classificationId!: string;

  @Prop({
    default: '',
  })
  searchWord!: string;

  @Prop({
    default: false,
  })
  isBeginSerch!: boolean;

  @Watch('isBeginSerch')
  onIsBeginSerchChange(isBeginSerch) {
    if (isBeginSerch) {
      this.searchDictionary();
    }
  }

  loading: boolean = false;

  data: any[] = [];

  // 获取列表数据
  async searchDictionary() {
    const params: any = {
      page: this.searchParams.pageNum || 1,
      size: this.searchParams.pageSize || 10,
      searchWord: this.searchWord || '',
      classificationId: this.classificationId || '',
      sortColumn: this.sortBy,
      sortDirection: this.sortType === 'ascend' ? 'asc' : 'desc',
    };
    const res: any = await dataDictionaryApi.searchDictionary(params);
    if (res.errcode === 0) {
      const { data } = res;
      if (Array.isArray(data.content)) {
        data.content.forEach((item, index) => {
          item.index =
            index +
            1 +
            (this.searchParams.pageNum - 1) * this.searchParams.pageSize;
          item.checked = false;
        });
      }
      this.data = data.content || [];
      this.total = data.totalElements;
      this.plainOptions.length = 0;
      this.indeterminate = false;
      this.$emit('totalChange', data.totalElements);
      this.$emit('checkedChange', this.plainOptions);

      this.isStartSort = false;
    }
  }

  // 禁用/启用
  async changeItemStatus(item) {
    const _this = this;
    this.$confirm({
      title: `确定要${item.status ? '禁用' : '启用'}当前字典？`,
      cancelText: '取消',
      okText: '确定',
      async onOk() {
        const res: any = await dataDictionaryApi.updateDictionaryStatus({
          id: item.id,
          status: !item.status,
        });
        if (res.errcode === 0) {
          _this.searchDictionary();
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  scrollHeight: number = 0;

  getScrollHeight() {
    // @ts-ignore
    this.scrollHeight =
      document.querySelector('.data-dictionary-list').scrollHeight - 95;
  }

  edit(item) {
    this.$emit('edit', item);
  }

  isStartSort: boolean = false;

  sortBy: string = '';

  sortType: string = '';

  sort(arg, sortBy) {
    if (this.isStartSort) {
      return;
    }
    if (arg[2] && (this.sortBy === '' || arg[2] !== this.sortType)) {
      this.isStartSort = true;
      this.searchParams.pageNum = 1;
      this.sortBy = sortBy;
      this.sortType = arg[2];
      this.searchDictionary();
    }
  }

  columns = [
    {
      slots: { title: 'indexTitle' },
      dataIndex: 'index',
      scopedSlots: { customRender: 'index' },
      align: 'center',
      width: 80,
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      align: 'left',
      width: '8%',
      ellipsis: true,
    },
    {
      title: '字典类型',
      dataIndex: 'dictionaryType',
      scopedSlots: { customRender: 'dictionaryType' },
      align: 'left',
      width: '8%',
      ellipsis: true,
    },
    {
      title: '字典分类',
      dataIndex: 'classificationName',
      scopedSlots: { customRender: 'classificationName' },
      align: 'left',
      width: '8%',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'left',
      scopedSlots: { customRender: 'status' },
      width: '8%',
    },

    {
      title: '创建人',
      dataIndex: 'createdBy',
      align: 'left',
      width: '8%',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      align: 'left',
      width: '13%',
      sorter: (...arg) => this.sort(arg, 'createdTime'),
    },
    {
      title: '修改人',
      dataIndex: 'modifiedBy',
      align: 'left',
      /* width: '8%', */
    },
    {
      title: '修改时间',
      dataIndex: 'modifiedTime',
      align: 'left',
      width: '13%',
    },

    {
      title: '说明',
      dataIndex: 'remarks',
      align: 'left',
      ellipsis: true,
      width: '12%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'left',
      scopedSlots: { customRender: 'operation' },
      width: 90,
    },
  ];

  //分页 start
  pageSizeOptions = ['10', '20', '30', '40', '50'];

  total = 0;

  showQuickJumper = true;

  showTotal(total, range) {
    return '共' + total + '条';
  }

  onShowSizeChange(current, pageSize) {
    this.searchParams.pageNum = 1;
    this.searchParams.pageSize = pageSize;
    this.searchDictionary();
  }

  pageChange(pageNumber) {
    this.searchParams.pageNum = 1;
    this.searchParams.pageNum = pageNumber;
    this.searchDictionary();
  }

  //分页 end
  searchParams = {
    pageSize: 20,
    pageNum: 1,
  };

  created() {
    this.searchDictionary();
  }

  mounted() {
    this.getScrollHeight();
  }

  hideCheckBox(e, index) {
    if (e.checked) {
      return;
    }
    this.$set(e, 'isShowCheckBox', false);
  }

  showCheckBox(e) {
    this.$set(e, 'isShowCheckBox', true);
  }

  plainOptions: any = [];

  indeterminate: any = false;

  checkAll: any = false;

  rowSelection(item) {
    const temp = item.checked;
    this.$set(item, 'checked', !temp);
    if (temp) {
      this.plainOptions = this.plainOptions.filter((el) => el.id !== item.id);
    } else {
      this.plainOptions.push(item);
    }

    this.indeterminate =
      !!this.plainOptions.length && this.plainOptions.length < this.data.length;
    this.checkAll = this.plainOptions.length === this.data.length;

    this.$emit('checkedChange', this.plainOptions);
  }

  /**
   * 全选
   */
  onCheckAllChange(e) {
    Object.assign(this, {
      checkedList: e.target.checked ? this.data : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });

    this.data.forEach((item) => {
      item['checked'] = e.target.checked;
      this.$set(item, 'isShowCheckBox', e.target.checked);
    });
    if (e.target.checked) {
      this.plainOptions = JSON.parse(JSON.stringify(this.data));
    } else {
      this.plainOptions = [];
    }
    this.$emit('checkedChange', this.plainOptions);
  }
}
</script>
<style lang="less" scoped>
@import '../../../styles/table.less';
.list-wrapper {
  height: 100%;
  min-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  .data-dictionary-list {
    padding: 0 24px;
    flex: 1;
    overflow: hidden;
  }
}

.pagination-box {
  margin: 0;
  border-top: thin solid #eee;
  position: fixed;
  bottom: 0;
  right: 24px;
  background: #fff;
  padding: 10px 0;
  width: 100%;
  text-align: right;
}
.operation-btns {
  width: 100%;
  span {
    cursor: pointer;
    color: @primary-color;
  }
  .edit {
    margin-right: 20px;
  }
}

.status-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}
.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: rgba(17, 18, 24, 0.25);
  border-radius: 3px;
  margin-right: 7px;
  vertical-align: center;
  &.green {
    background-color: @primary-color;
  }
}
.green {
  color: rgba(17, 18, 24, 0.25);
}
</style>
<style lang="less">
.data-dictionary-list {
  .ant-table-small > .ant-table-content > .ant-table-body {
    margin: 0;
  }
  .ant-table-column-title {
    white-space: nowrap;
  }
  td {
    white-space: nowrap !important;
  }

  .ant-table-wrapper,
  .ant-spin-nested-loading,
  .ant-spin-container,
  .ant-table {
    height: 100%;
  }
}
</style>
