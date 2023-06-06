<template>
  <a-row>
    <div v-if="dataContent && dataContent.content && dataContent.content.length > 0">
      <a-col
        v-for="item in dataContent.content"
        :key="item.id"
        :span="24"
        class="newList"
      >
        <a-col :span="24" class="title">
          <a class="title" @click="goDetail(item)">{{
            item.policyRegulationName
          }}</a>
        </a-col>
        <a-col :span="24" class="button">
          <a-button size="small">发布日期：{{ item.releaseDate }}</a-button>
          <a-button size="small">实施日期：{{ item.implementationDate }}</a-button>
          <a-button size="small">{{ item.timeliness }}</a-button>
          <a-button size="small">{{ item.category }}</a-button>
        </a-col>
      </a-col>
    </div>
    <div v-else>
      <a-empty />
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
    this.showModel = true;
    // let { href } = this.$router.resolve({
    //     name: "regulationInfo",
    //     query: {
    //         id: item['id'],
    //         isOpenPage: 'true',
    //         appCode:  this.$route.query.code
    //     }
    // });
    // window.open(href,'_blank');
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
    font-size: 12px;
    font-weight: 500;
    text-align: left;
  }
  .button {
    margin-top: 6px;
    button {
      float: left;
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
      height: 85%;
      overflow-y: auto;
    }
  }
}
/deep/ .ant-empty-description {
  font-size: 14px;
}
</style>
