
<template>
  <div class="exam-list">
    <returnTemplate />
    <div>
      <div
        v-show="isNoEmpty"
        ref="scroll"
        class="mescroll"
        :pageSize="20"
        style="border-top: 1px solid #eee;top: 45px;height: calc(100% - 3.3rem);"
      >
        <div class="exam-list-wrapper">
          <div ref="examTitle" class="exam-title">{{ title }}名称：<span style="color: #5291ff">{{ name }}</span></div>
            <div v-for="item in examData" :key="item.examId" class="exam-item">
              <div class="exam-detail">
                <p>考试分数：<span style="font-size: 0.45rem;">{{ item.examScore }}</span> 分</p>
                <p>是否及格：<span :style="item.isPass === 1 ? 'color:green' : 'color:red'">{{ item.isPass === 1 ? '及格' : '不及格' }}</span></p>
                <p>考试时间：{{ item.examTime }}</p>
                <p>考试时长：{{ time(item.examDuration) }}</p>
              </div>
              <div class="exam-action">
                <a class="goExam" @click="goToDetails(item)">历史{{ title }}详情</a>
              </div>
            </div>
        </div>
        <a-button v-if="size >= 10" @click="goMore">加载更多</a-button>
        <span v-else>加载完毕</span>
      </div>
      <div v-show="!isNoEmpty" class="empty-box">
        <Empty />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import common from 'cloudpivot/common/mobile';
import { Col, Row, Button,Icon } from '@h3/antd-vue';
import form from 'cloudpivot-form/form/src/renderer/components/mobile';
import returnTemplate from '../../../components/return/index.vue';
import api from '@/../extends/api';

const qs = require('qs');

// @@ 组件定义
@Component({
  name: 'historyExam',
  components: {
    H3Scroll: form.H3Scroll,
    Empty: common.components.Empty,
    ACol: Col,
    ARow: Row,
    AButton: Button,
    AIcon: Icon,
    returnTemplate
  },
})

export default class historyExam extends Vue{
  examData:any =  []; // 考试数据列表

  examLibraryid:any = '';

  name:any = ''

  title:any = ''

  isNoEmpty: boolean = false;

  pageSize: number = 10;

  curPage:any = 1;

  totalPages: any = 0;

  size: any = 0;

  mounted() {
    this.examLibraryid = window.location.href.split('id=')[1].split('&name')[0];
    this.name = decodeURIComponent(window.location.href.split('name=')[1])
    this.loadExamData();
    this.title = window.location.href.split('type=')[1].split('&isOpenPag')[0] === '1'? '考试' : '练习'
  }

  // 加载考试数据
  async loadExamData() {

    const option = qs.stringify({
        page: this.curPage,
        pageSize: this.pageSize,
        examId:this.examLibraryid
    });
    try {
      let res:any = await api.selectExamHistoryList(option);
        if(res.errcode === 0){
          if (this.curPage === 1) {
            
            this.examData = res.data.list;
          } else {
            this.examData = this.examData.concat(res.data.list);
            
          }
          this.curPage = res.data.pageNum;
          this.totalPages = res.data.pages;
          this.size = res.data.size;
          this.isNoEmpty = true
        }
    } catch (error) {
      console.log("加载考试数据出错", error);
      this.isNoEmpty = false
    }
  }

  time(val){
      let m: string | number = parseInt(String(val / 60));
      m = m < 10 ? "0" + m : m;
      let s: string | number = parseInt(String(val % 60));
      s = s < 10 ? "0" + s : s;
      return String(m)+ ':' + String(s) ;
  }

  // 跳转到详情页面
  goToDetails(item) {
    // TODO: 跳转到详情页面
    this.$router.push({
      name: 'examInfo',
      query: {
        id: item.id,
      },
    }); 
  }

  goMore() {
    this.curPage = this.curPage + 1
    this.loadExamData()
  }

  // loadMore(page: any, done?: any) {
  //   const vm: any = this;
  //   vm.params.queryCondition = this.params.queryCondition;
  //   vm.params.page = page.num;
  //   this.params.showTotal = this.pagingSetting.showTotal;

  //   // 查看时是否有为 actionDone 的触发埋下的数据
  //   const templateActionStorage = (window as any)[
  //     this.temporaryActionStorageKey
  //   ] as any;
  //   (window as any)[this.temporaryActionStorageKey] = null;
  //   if(this.schemaCode === 'onlineLearning'){
  //     api
  //     .getOnlineLearnlist({
  //       page:vm.params.page,
  //       pageSize:vm.params.size,
  //       knowledgeType:'',
  //       courseName:'',
  //       showTotal:false
  //     })
  //     .then((res: any) => {
  //       if (res.errcode === 0) {
  //         if (done) {
  //           done(vm.params.size, res.data.total);
  //         }
  //         // 记录列表长度
  //         this.totalElements = res.data.total;
  //         if (vm.params.page === 1) {
  //           vm.formList = res.data.list;
  //         } else {
  //           vm.formList = vm.formList.concat(res.data.list);
  //           if (this.showFilter && this.selectAll) {
  //             this.selectNum = vm.formList.length;
  //           }
  //         }
  //         vm.isNoEmpty = !!vm.formList.length;
  //       } else {
  //         vm.formList = [];
  //         vm.isNoEmpty = false;
  //         // 展示字段为空时，提示‘列表显示字段不能为空！’
  //         if (res.errcode === 303026) {
  //           this.$h3.toast.show({
  //             text: `${res.errmsg}`,
  //             iconType: 'close',
  //           });
  //         }
  //       }
  //       vm.formList.forEach((item) => {
  //         item.select = false;
  //       });
  //     });
  //   }else if(this.schemaCode === 'onlineExam'){
  //     api
  //     .selectOnlineExamList({
  //       page:vm.params.page,
  //       pageSize:vm.params.size,
  //       examName:'',
  //       showTotal:false
  //     })
  //     .then((res: any) => {
  //       if (res.errcode === 0) {
  //         if (done) {
  //           done(vm.params.size, res.data.total);
  //         }
  //         // 记录列表长度
  //         this.totalElements = res.data.total;
  //         if (vm.params.page === 1) {
  //           vm.formList = res.data.list;
  //         } else {
  //           vm.formList = vm.formList.concat(res.data.list);
  //           if (this.showFilter && this.selectAll) {
  //             this.selectNum = vm.formList.length;
  //           }
  //         }
  //         vm.isNoEmpty = !!vm.formList.length;
  //       } else {
  //         vm.formList = [];
  //         vm.isNoEmpty = false;
  //         // 展示字段为空时，提示‘列表显示字段不能为空！’
  //         if (res.errcode === 303026) {
  //           this.$h3.toast.show({
  //             text: `${res.errmsg}`,
  //             iconType: 'close',
  //           });
  //         }
  //       }
  //       vm.formList.forEach((item) => {
  //         item.select = false;
  //       });
  //     });
  //   }
  // }

};
</script>

<style lang="less" scoped>
.exam-list {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  overflow-x: hidden;
  &-wrapper {
    overflow-x: hidden;
  }
}
.exam-title {
  font-size: 0.45rem;
  color: #2b2b2b;
  margin: 15px;
  text-align: left;
  font-weight: 600;
}

.exam-item {
  display: flex;
  justify-content: space-between;
  transition: 0.3s;
  flex: 1;
  align-items: center;
  margin: 0.26666667rem;
  padding: 0.4rem;
  border-radius: 0.21333333rem;
  background: #fff;
  word-break: break-all;
  box-shadow: 0px 0px 10px #d6e8f8;
}

.exam-detail {
  font-size: 14px;
  text-align: left;
  p {
    margin-bottom: 10px;
  }
}

.exam-action {
  background: aliceblue;
  border-radius: 3px;
  text-align: center;
  padding: 5px 0;
  .goExam{
    font-size: 0.4rem;
    color: #5291ff;
  }
}
/deep/ .ant-btn {
  font-size: 0.4rem;
  line-height: 1;
}
</style>