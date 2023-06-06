<template>
  <a-row>
    <div>
      <div
        v-if="
          dataContent && dataContent.content"
      >
        <a-col
          v-for="item in dataContent.content"
          :key="item.id"
          :span="24"
          class="newList"
        >
          <a-col :span="24" class="title">
            <a class="title" @click="goDetail(item)">{{ item.regulationName }}</a>
          </a-col>
          <a-col :span="24" class="button">
            <a-tag class="ant-tag-purple" size="small">发布日期：{{ item.releaseDate ? item.releaseDate.slice(0, 10) : '' }}</a-tag>
            <a-tag class="ant-tag-cyan" size="small">实施日期：{{ item.implementationDate ? item.implementationDate.slice(0, 10) : '' }}</a-tag>
            <a-tag class="ant-tag-blue" size="small">{{ item.timeliness }}</a-tag>
            <a-tag class="ant-tag-geekblue" size="small">{{
              item.classification
            }}</a-tag>
          </a-col>
        </a-col>
      </div>
      <!-- <div v-else>
        <a-empty />
      </div> -->
    </div>
    <elModal v-model="showModel">
      <elInfo :id="id" />
    </elModal>
  </a-row>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Row, Col, Button, Tag, Empty } from '@h3/antd-vue';
import elModal from '@/../extends/components/form/modal.vue';
import elInfo from '@/../extends/views/regulation/index/info.vue';
@Component({
  name: 'newList',
  components: {
    ARow: Row,
    ACol: Col,
    AButton: Button,
    ATag: Tag,
    AEmpty: Empty,
    elModal,
    elInfo,
  },
})
export default class newList extends Vue {
  showModel: boolean = false;

  id: any = '';

  @Prop({}) dataContent?: any;

  goDetail(item: any) {
    this.id = item['id'];
    // this.showModel = true;
    let { href } = this.$router.resolve({
        name: "regulationInfo",
        query: {
            id: item['id'],
            isOpenPage: 'true',
            appCode:  this.$route.query.code
        }
    });
    console.log(href);
    window.open(href,'_blank');
  }
}
</script>
<style lang="less" scoped>
.newList {
  border-bottom: solid 1px #f1f1f1;
  padding-top: 12px;
  .title {
    cursor: pointer;
    display: inline-block;
    color: #1f7a9c;
    font-size: 18px;
    font-weight: 500;
  }
  .button {
    margin: 15px 0;
    button {
      margin-right: 12px;
      margin-bottom: 12px;
      color: #1e465b;
      font-size: 12px;
    }
  }
}
/deep/ .ant-modal {
  top: 20px;
  height: 96%;
  .ant-modal-content {
    height: 100%;
    .ant-modal-body {
      height: calc(100% - 130px);
      overflow-y: auto;
    }
  }
}
.ant-tag {
  border-radius: 2px;
  opacity: 0.85;
}
//时间范围选择器底部自定义样式
.ant-tag.ant-tag-blue {
  color: #096dd9 !important;
  background: #e6f7ff !important;
  border-color: #91d5ff !important;
}
</style>
