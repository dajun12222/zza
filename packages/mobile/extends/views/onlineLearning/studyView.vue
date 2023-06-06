<template>
  <div ref="studyView" class="studyView">
    <returnTemplate />
    <div ref="viewDiv" class="viewDiv">
      <div class="title">{{ courseName }}</div>
      <div class="barDiv">
        <div class="viewBg">
          <p class="viewBar" :style="'width:' + learnRate + '%'"></p>
        </div>
        <div>{{ learnRate }}%</div>
        <div v-if="!learnShow" class="learnDiv">恭喜您已完成本页的学习</div>
        <div v-if="learnShow" class="learnDiv">
          还需
          <span class="learnSecond">{{ countVal }}</span> 可完成学习，加油！
        </div>
      </div>
    </div>
    <div class="iframe" :height="iframeHeight">
      <iframe
        ref="iframe"
        :src="localHref"
        width="100%"
        :height="iframeHeight"
        allowfullscreen="true"
        frameborder="0"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
      ></iframe>
    </div>
    <div ref="studyInfo" class="studyInfo">
      <!-- <a-collapse :activeKey="activeKey" @change="changeCollapse">
        <a-collapse-panel key="1" header="课程简介">
          <p class="infoTitle">{{ courseName }}</p>
          <p v-if="courseBlurb" class="infoView">{{ courseBlurb }}</p>
          <div v-else class="infoNone">暂无数据</div>
        </a-collapse-panel>
      </a-collapse> -->
      <a-tabs :activeKey="activeKey" @change="changeTabs">
          <a-tab-pane key="1" tab="课程简介">
            <div>
              <div class="infoTitle">{{ courseName }}</div>
              <div v-if="courseBlurb" class="infoView">{{ courseBlurb }}</div>
              <div v-else class="infoNone">暂无数据</div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="学习笔记">
            <div>
              <div class="posR">
                <div class="coursePane">
                  <img v-if="user.imgUrl !== null" :src="user.imgUrl" alt="" />
                  <a-icon
                    v-else
                    class="imgIcon"
                    type="smile-o"
                  />
                  <a-textarea
                    v-model="experience"
                    :maxLength="2000"
                    placeholder="添加你的笔记心得吧"
                    class="cb-modal-textarea"
                  />
                </div>
                <a-button class="submitBtn" type="primary" @click="submit">发表</a-button>
              </div>
              <div v-for="(item,index) in experienceList" :key="index" class="courseNode">
                <img v-if="user.imgUrl !== null" :src="user.imgUrl" alt="" />
                <a-icon
                  v-else
                  class="imgIcon"
                  type="smile-o"
                />
                <div>
                  <p class="name">{{ user.name }}</p>
                  <p>{{ item.Experience }}</p>
                  <p class="time">{{ item.createdTime }}</p>
                </div>
              </div>
            </div>
          </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import api from '@/../extends/api';
import { Col, Row, Tabs, Modal, Collapse,Input,Button,Icon } from '@h3/antd-vue';
import returnTemplate from '../../components/return/index.vue';
const qs = require('qs');

// @@ 组件定义
@Component({
  name: 'studyView',
  components: {
    ACol: Col,
    ARow: Row,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    AModal: Modal,
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
    returnTemplate,
    AInput: Input,
    ATextarea: Input.TextArea,
    AButton: Button,
    AIcon: Icon
  },
})
export default class studyView extends Vue {
  activeKey: any = "1";

  courseName: any = '';

  courseBlurb: any = '';

  learnDuration: any = 0; //观看时长

  learningDuration: any = 0; //总时长

  learnRate: any = ''; //学习进度

  newLearnDuration: any = 0; //倒计时时的观看时长

  courseId: any = '';

  learnShow: any = true;

  refId: any = '';

  @Watch('$route')
  countdown: any = 0; //倒计时

  timeUp: any = 0;

  timeAll: any = 0;

  localHref: any = '';

  countVal: any = ''; //倒计时转换时分秒

  iframeHeight: any = '';

  user:any = ""

  experience:any = '';

  experienceList:any = [];

  created() {
    this.setMyIframeHeight();
    let courseName: any = this.$route.query.courseName;
    this.courseName = decodeURIComponent(courseName);
    this.courseBlurb = this.$route.query.courseBlurb;
    this.learnDuration = this.$route.query.learnDuration; //观看时长
    this.learningDuration = this.$route.query.learningDuration; // 总时长
    this.courseId = this.$route.query.courseId;
    this.refId = this.$route.query.refId;
    this.user = JSON.parse(JSON.stringify(sessionStorage.getItem('user')));
    let attrSrc =
      window.location.href.split('mobile')[0] === 'http://localhost:8089/'
        ? 'http://192.168.0.16/'
        : window.location.href.split('mobile')[0];
    let token = localStorage.getItem('token');
    let refName: any = this.$route.query.refName;
    this.localHref =
      'http://192.168.0.88:8001/view/url?url=' +
      encodeURIComponent(
        attrSrc +
          'api/api/aliyun/download?refId=' +
          this.$route.query.refId +
          '&T=' +
          token,
      ) +
      '&name=' +
      decodeURIComponent(refName);
    this.getCountdown();
    this.getList();
    this.selectExperienceBylearnId();
  }

  getCountdown() {
    if (sessionStorage.getItem('learnDuration')) {
      this.countdown =
        Number(this.learningDuration) -
        Number(sessionStorage.getItem('learnDuration'));
    } else {
      this.countdown =
        Number(this.learningDuration) - Number(this.learnDuration);
    }

    let clock = window.setInterval(() => {
      if (this.countdown <= 0) {
        this.learnRate = 100;
        this.learnShow = false;
        window.clearInterval(clock);
        this.newLearnDuration = Number(this.learningDuration);
      } else {
        this.countdown--;
        this.timeUp++;
        this.learnShow = true;
        this.newLearnDuration =
          Number(this.learnDuration) + Number(this.timeUp);
        sessionStorage.setItem('learnDuration', this.newLearnDuration);
        if ((this.newLearnDuration / this.learningDuration) * 100 > 100) {
          sessionStorage.setItem('learnRate', '100');
        } else {
          let val: any = parseInt(
            String((this.newLearnDuration / this.learningDuration) * 100),
          );
          sessionStorage.setItem('learnRate', val);
        }
        this.learnRate = sessionStorage.getItem('learnRate')
          ? sessionStorage.getItem('learnRate')
          : this.$route.query.learnRate;
        let h =
          Math.floor((this.countdown / 3600) % 24) < 10
            ? '0' + Math.floor((this.countdown / 3600) % 24)
            : Math.floor((this.countdown / 3600) % 24);

        let m =
          Math.floor((this.countdown / 60) % 60) < 10
            ? '0' + Math.floor((this.countdown / 60) % 60)
            : Math.floor((this.countdown / 60) % 60);

        let s =
          Math.floor(this.countdown % 60) < 10
            ? '0' + Math.floor(this.countdown % 60)
            : Math.floor(this.countdown % 60);

        this.countVal = '';

        if (h !== '00') this.countVal += `${h}时`;

        if (m !== '00') this.countVal += `${m}分`;

        this.countVal += `${s}秒`;
      }
    }, 1000);
  }

  async saveOnlineLearn() {
    let newLearnRate: any = Number(
      (parseInt(this.newLearnDuration) / parseInt(this.learningDuration)) *
        100 >
        100
        ? 100
        : (parseInt(this.newLearnDuration) / parseInt(this.learningDuration)) *
            100,
    );
    let pageOption = {
      courseId: this.courseId,
      learnRate: parseInt(newLearnRate),
      learnDuration: this.newLearnDuration,
    };

    // fetch('/api/api/onlineLearn/saveOnlineLearn?courseId='+this.courseId+'&learnRate='+parseInt(newLearnRate)+'&learnDuration='+this.newLearnDuration,{
    //   method: 'post',
    //   headers:{
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + localStorage.getItem('token') // getToken 返回 token
    //   },
    //   keepalive: true
    // }).then((res) => {
    //   console.log(res)
    // });
    await api.saveOnlineLearn(pageOption);
  }

  getList() {
    const timer = setInterval(() => {
      this.saveOnlineLearn();
      if (this.learnRate === 100) {
        clearInterval(timer);
      }
    }, 1000);
  }

  setMyIframeHeight() {
    // 页面可视高-顶部实际高-底部实际高-多余部分高度
    let that = this;
    this.$nextTick(() => {
      let headerHeight: any = (this.$refs.viewDiv as HTMLDivElement)
        .offsetHeight;
      let bodyHeight: any = document.body.clientHeight;
      let footerHeight: any = (this.$refs.studyInfo as HTMLDivElement)
        .offsetHeight;
      let outHeight = bodyHeight - headerHeight - footerHeight - 79 + 'px';
      this.iframeHeight = outHeight;
    });
  }

  changeCollapse(key) {
    // if(key.length > 0){
    //   this.topScrollClick();
    // }else{
    //   this.bottomScrollClick();
    // }
  }

  topScrollClick() {
    let that = this;
    this.$nextTick(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  bottomScrollClick() {
    let that = this;
    this.$nextTick(() => {
      let scrollEl = (that as any).$refs.studyView[0];
      scrollEl.scrollTop = scrollEl.scrollHeight;
    });
  }

  async selectExperienceBylearnId(){
      const option = qs.stringify({
          learnId:this.courseId,
      });
      let res:any = await api.selectExperienceBylearnId(option);
      if(res.errcode === 0){
          this.experienceList = res.data;
      }
  }

  async saveExperience() {
    let pageOption = {
      learnId: this.courseId,
      experience: this.experience,
    };
    let res:any = await api.saveExperience(pageOption);
    if(res.errcode === 0){
        this.experience = '';
        this.selectExperienceBylearnId();
    }
  }

  submit(){
    if(this.experience){
      this.saveExperience();
    }else{
       this.$message.error('请填写学习心得');
    }
  }

  changeTabs(key){
    this.activeKey = key
  }
}
</script>

<style lang="less" scoped>
.studyView {
  // .iframe{
  //   height: calc(100% - 60px);
  // }
  background: #fff;
  .viewDiv {
    height: 1.5rem;
    line-height: 1.5rem;
    background-color: #14191e;
    padding: 0 0.2rem;
    color: #fff;
    display: flex;
    justify-content: space-between;
    margin-top: 44px;
    .title {
      font-size: 0.36rem;
      font-weight: 600;
      max-width: 30%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .barDiv {
      display: flex;
      color: #bbb;
      font-size: 0.32rem;
    }
    .viewBg {
      width: 2rem;
      height: 0.2rem;
      background: #fff;
      margin: 0.65rem 0.1rem 0.65rem 0;
    }
    .viewBar {
      height: 100%;
      background: #3070b8;
    }
    .learnDiv {
      margin-left: 0.2rem;
      .learnSecond {
        font-size: 14px;
        color: #fff;
      }
    }
  }
  .studyInfo {
    margin: 0.2rem 0.3rem;
    box-shadow:0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    padding: .2rem;
    /deep/.ant-collapse {
      font-size: 0.43rem;
      line-height: 1rem;
    }
    /deep/.ant-collapse > .ant-collapse-item > .ant-collapse-header {
      padding: 0.3rem 0.4rem;
      line-height: 0.6rem;
      text-align: left;
      padding-left: 1.2rem;
    }
    /deep/.ant-collapse
      > .ant-collapse-item
      > .ant-collapse-header
      .ant-collapse-arrow {
      font-size: 0.4rem;
    }
    /deep/.ant-collapse-content > .ant-collapse-content-box {
      padding: 0.3rem;
    }
    .infoTitle {
      font-size: 0.38rem;
      line-height: 0.5rem;
      text-align: left;
      color: #333;
      margin-bottom: 0.2rem;
    }
    .infoView {
      font-size: 0.34rem;
      line-height: 0.5rem;
      text-align: left;
      color: rgba(102, 102, 102);
    }
    .infoTime {
      color: #999;
      margin: 10px 0;
      span {
        color: #333;
      }
    }
  }
  .infoNone {
    font-size: 0.42rem;
    text-align: left;
    color: #999;
  }
  /deep/.ant-tabs-nav-container{
    font-size: .4rem;
  }
  .courseNode{
    display: flex;
    margin-bottom: .6rem;
    div{
      width: calc(100% - 32px);
      line-height: .4rem;
      color: #11121B;
      text-align: left;
      font-size: .4rem;
      p{
        white-space: normal;
        word-break: break-all;
      }
      .name{
        font-size: .38rem;
        font-weight: 600;
        margin-bottom: .1rem;
      }
      .time{
        font-size: .33rem;
        color: #999;
        margin-top: .1rem;
      }
    }
  }
  .coursePane{
    display: flex;
    img{
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 20px;
    }
  }
  .imgIcon{
    border-radius: 50%;
      margin-right: .2rem;
    font-size: .6rem;
    color:#ffb131 ;
  }
  .cb-modal-textarea{
    height: 3rem;
    font-size: .4rem;
    padding: .2rem;
    line-height: .5rem;
  }
  .submitBtn{
    font-size: .45rem;
    height: .85rem;
    line-height: .85rem;
    position: absolute;
    right: 0;
    margin-top: .3rem;
  }
  .posR{
    position: relative;
    margin-bottom: 1.5rem;
  }
}
</style>
