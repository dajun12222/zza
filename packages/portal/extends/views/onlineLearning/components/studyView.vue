<template>
  <div ref="studyView" class="studyView">
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
import { Col, Row, Tabs, Modal, Collapse,Input,Button,Icon} from '@h3/antd-vue';
import api from '@/../extends/api';
import iframeView from './iframeView.vue';

import axios from 'axios';
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

  courseNote:any = ''

  experience:any = '';

  experienceList:any = [];

  imgSrc:any = 'https://cn.bing.com/images/search?view=detailV2&ccid=ymK%2fSlmp&id=763DE54B674C5F2B9B1D8F7BAB23DEDC4ADBE0CC&thid=OIP.ymK_Slmp8Ln4e983jHFOBQAAAA&mediaurl=https%3a%2f%2ftupian.qqw21.com%2farticle%2fUploadPic%2f2020-5%2f202053023174123232.jpg&exph=450&expw=450&q=%e5%a4%b4%e5%83%8f&simid=608022208291752776&FORM=IRPRST&ck=A40F7ED748A091CE79EC2C207ADD1573&selectedIndex=16&ajaxhist=0&ajaxserp=0';

  user:any = ""

  created() {
    this.setMyIframeHeight();
    let courseName: any = this.$route.query.courseName;
    this.courseName = decodeURIComponent(courseName);
    this.courseBlurb = this.$route.query.courseBlurb;
    this.learnDuration = this.$route.query.learnDuration; //观看时长
    this.learningDuration = this.$route.query.learningDuration; // 总时长
    this.courseId = this.$route.query.courseId;
    this.refId = this.$route.query.refId;
    this.user = JSON.parse(sessionStorage.getItem('user'));
    let attrSrc =
      window.location.href.split('audit')[0] === 'http://localhost:9100/'
        ? 'http://192.168.0.16/'
        : window.location.href.split('audit')[0];
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
    this.selectExperienceBylearnId();
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

  setMyIframeHeight() {
    // 页面可视高-顶部实际高-底部实际高-多余部分高度
    let that = this;
    this.$nextTick(() => {
      let headerHeight: any = (this.$refs.viewDiv as HTMLDivElement)
        .offsetHeight;
      let bodyHeight: any = document.body.clientHeight;
      let footerHeight: any = (this.$refs.studyInfo as HTMLDivElement)
        .offsetHeight;
      let outHeight = bodyHeight - headerHeight - footerHeight - 35 + 'px';
      this.iframeHeight = outHeight;
    });
  }

  bottomScrollClick() {
    let that = this;
    this.$nextTick(() => {
      let scrollEl = that.$refs.studyView[0];
      scrollEl.scrollTop = scrollEl.scrollHeight;
    });
  }

  changeTabs(key){
    console.log(key)
    this.activeKey = key
  }
}
</script>

<style lang="less" scoped>
.studyView {
  // .iframe{
  //   height: calc(100% - 60px);
  // }
  .viewDiv {
    height: 60px;
    line-height: 60px;
    background-color: #14191e;
    padding: 0 70px 0 30px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    .title {
      font-size: 16px;
      font-weight: 600;
    }
    .barDiv {
      display: flex;
      color: #bbb;
      font-size: 12px;
    }
    .viewBg {
      width: 100px;
      height: 10px;
      background: #fff;
      margin: 25px 10px;
    }
    .viewBar {
      height: 100%;
      background: #3070b8;
    }
    .learnDiv {
      margin-left: 20px;
      .learnSecond {
        font-size: 14px;
        color: #fff;
      }
    }
  }
  .studyInfo {
    padding: 20px 30px;
    margin: 15px 30px;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    .infoTitle {
      font-size: 18px;
      color: #333;
      margin-bottom: 10px;
    }
    .infoView {
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
    color: #999;
  }
  .courseNode{
    display: flex;
    margin-bottom: 30px;
    img{
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 20px;
    }
    div{
      width: calc(100% - 80px);
      line-height: 20px;
      color: #11121B;
      .name{
        font-size: 15px;
        font-weight: 600;
        margin-bottom: 5px;
      }
      .time{
        font-size: 12px;
        color: #999;
        margin-top: 5px;
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
  .posR{
    position: relative;
    padding-bottom: 55px;
  }
  .submitBtn{
    margin-top: 10px;
    position: absolute;
    right: 0;
  }
  .cb-modal-textarea{
    height: 130px;
  }
}
.imgIcon{
    border-radius: 50%;
    margin-right: 20px;
  font-size: 42px;
  color:#ffb131 ;
}
</style>
