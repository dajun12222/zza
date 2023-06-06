<template>
  <div class="elApage">
    <a-pagination
      size="small"
      :pageSizeOptions="pageSizeOptions"
      :total="total"
      :showTotal="(total) => $t('languages.common.form.Total', { num: total })"
      showSizeChanger
      showQuickJumper
      :defaultPageSize="10"
      :current="page"
      @change="pageChange"
      @showSizeChange="showSizeChange"
    />
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Pagination } from '@h3/antd-vue';
@Component({
  name: 'Page',
  components: {
    APagination: Pagination,
  },
})
export default class Page extends Vue {
  pageSizeOptions: Array<string> = ['10', '20', '50', '100'];

  total: any = 0; // 无参与者总数

  page: number = 0;

  size: number = 0;

  // 分页 page change 回调
  @Prop() obj: any;

  @Watch('obj', { deep: true, immediate: true })
  onChangeObj(newVal: any) {
    if (newVal && newVal.total) {
      this.total = parseInt(newVal.total);
    } else {
      this.total = 0;
    }
    if (newVal && newVal.page) {
      this.page = parseInt(newVal.page);
    } else {
      this.page = 0;
    }
  }

  pageChange(page: number, pageSize: number) {
    this.$emit('searchPage', {
      page: page,
      size: pageSize,
    });
  }

  showSizeChange(current: number, size: number) {
    this.$emit('searchPage', {
      page: current,
      size: size,
    });
  }
}
</script>
<style lang="less" scoped>
.elContent .elApage {
    // position: absolute;
    // bottom: 20px;
    // right: 10px;
    /deep/.ant-pagination{
      color: #fff;
      .ant-pagination-item-link{
        color: #fff;
      }
      .ant-pagination-total-text{
        color: #fff;
      }
      .ant-pagination-item{
        a{
          color: #fff;
        }
      }
    }
}
</style>
