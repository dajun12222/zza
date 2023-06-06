<template>
  <div class="paper-wrapper">
    <a-modal v-model="visible" :closable="false" :footer="null" :maskClosable="false">
      <p>考试时间已到，3秒后自动交卷</p>
    </a-modal>
    <div class="center-content">
      <div class="exam-content">
        <div class="paper-header">
          <div class="text">{{ title }}</div>
          <!-- 答题 -->
          <div class="exam-info">
            <div class="info">
              <div class="line-two">
                <div>姓名：{{ name }}</div>
                <div>试卷总分：{{ totleScore }}分</div>
                <!-- <div>合格总分：{{ qualifiedScore }}分</div> -->
                <!-- <div>试题数量：{{ countNum }}题</div> -->
              </div>
              <div class="line-two">
                <div>开考时间：{{ startTime }}</div>
                <div>考试用时：{{ examTime }}分钟</div>
              </div>
            </div>
            <div class="count">
              考试已用时: <span class="time">{{ elapsedTime }}</span>
            </div>
          </div>
        </div>
        <div class="question-div">
          <div></div>
          <div class="question-list">
            <div v-if="singleChoiceLists.length" class="question-type">
              <div>
                单选题（本类题共{{ singleChoiceLists.length }}小题，共{{ singleSocre }}分）
              </div>
            </div>
            <div v-for="(item, i) in singleChoiceLists" :key="i" class="question-item">
              <div class="question-header">
                <div class="title"><span class="num">{{ i + 1 }}.</span>{{ item.title }}</div>
                <div class="item-count">本题{{ item.socre }}分</div>
              </div>
              <div class="choose-and-flag">
                <div class="choose-content">
                  <div class="content">
                    <p v-for="(x, index) in item.topic" :key="index"><span class="mark">{{ x.radio }}</span></p>
                  </div>
                  <div class="buttons">
                    <a-radio-group :options="item.topic" @change="((e) => { onChangeRadio(e, i, item) })" />
                  </div>
                </div>
                <!-- <div class="flag" @click="flagsign(item)">
                  <span class="flag-text" :style="item.flagstatus ? { color: 'red' } : { color: '#838d99' }">标记</span>
                  <a-icon type="flag" theme="filled"
                    :class="{ flagactivered: item.flagstatus, flagactive: !item.flagstatus }" />
                </div> -->
              </div>
            </div>

          </div>
          <!-- 多选题 -->
          <div class="question-list">
            <div v-if="multipleChoiceLists.length" class="question-type">
              <div>
                多选题（本类题共{{ multipleChoiceLists.length }}小题，共{{ multipleSocre }}分）
              </div>
            </div>
            <div v-for="(item, i) in multipleChoiceLists" :key="i" class="question-item">
              <div class="question-header">
                <div class="title"><span class="num">{{ singleChoiceLists.length + i + 1 }}.</span>{{ item.title }}
                </div>
                <div class="item-count">本题{{ item.socre }}分</div>
              </div>
              <div class="choose-and-flag">
                <div class="choose-content">
                  <div class="content">
                    <p v-for="(x, index) in item.topic" :key="index"><span class="mark">{{ x.radio }}</span></p>
                  </div>
                  <div class="buttons">
                    <a-checkbox-group :options="item.topic" @change="((e) => { onChangeMultiple(e, i, item) })" />
                  </div>
                </div>
                <!-- <div class="flag" @click="flagsign(item)">
                  <span class="flag-text" :style="item.flagstatus ? { color: 'red' } : { color: '#838d99' }">标记</span>
                  <a-icon type="flag" theme="filled"
                    :class="{ flagactivered: item.flagstatus, flagactive: !item.flagstatus }" />
                </div> -->
              </div>
            </div>
          </div>
          <!-- 判断 -->
          <div class="question-list">
            <div v-if="judgeQuestionList.length" class="question-type">
              <div>
                判断题（本类题共{{ singleChoiceLists.length }}小题，共{{ judgeSocre }}分）
              </div>
            </div>
            <div v-for="(item, i) in judgeQuestionList" :key="i" class="question-item">
              <div class="question-header">
                <div class="title"><span class="num">{{ singleChoiceLists.length + multipleChoiceLists.length + i + 1 }}.</span>
                  {{ item.title }}
                </div>
                <div class="item-count">本题{{ item.socre }}分</div>
              </div>
              <div class="choose-and-flag">
                <div class="choose-content">
                  <!-- <div class="content">
                    <p v-for="(x, i) in item.topic" :key="i"><span class="mark">{{ x.radio }}</span></p>

                  </div> -->
                  <div class="buttons">
                    <a-radio-group :options="item.topic" @change="((e) => { onChangeJudge(e, i, item) })" />
                  </div>
                </div>
                <!-- <div class="flag" @click="flagsign(item)">
                  <span class="flag-text" :style="item.flagstatus ? { color: 'red' } : { color: '#838d99' }">标记</span>
                  <a-icon type="flag" theme="filled"
                    :class="{ flagactivered: item.flagstatus, flagactive: !item.flagstatus }" />
                </div> -->
              </div>
            </div>

          </div>
          <!-- 填空 -->
          <!-- <div class="question-list">
            <div class="question-type" v-if="completionLists.length">填空题（本类题共{{ completionLists.length
            }}小题，共{{ Completionsocre }}分）
            </div>
            <div class="question-item" v-for="(item, i) in completionLists" :key="i">
              <div class="question-header">
                <div class="title"><span class="num">{{ singleChoiceLists.length +
                    multipleChoiceLists.length + judgeQuestionList.length + i + 1
                }}.</span>{{ item.title }}</div>
                <div class="item-count">本题{{ item.socre }}分</div>
              </div>
              <div class="choose-and-flag">
                <div class="choose-content">

                  <div class="content" v-for="(x, index) in item.topic" :key="index">
                    <p><span class="mark">答案{{ index + 1 }}：</span></p>
                    <a-input @change="(e) => onChangeCompletion(e, i, index)" />
                  </div>
                </div>
                <div class="flag" @click="flagsign(item)">
                  <span class="flag-text" :style="item.flagstatus ? { color: 'red' } : { color: '#838d99' }">标记</span>
                  <a-icon type="flag" theme="filled"
                    :class="{ flagactivered: item.flagstatus, flagactive: !item.flagstatus }" />
                </div>
              </div>
            </div>
          </div> -->
          <!-- 简答 -->
          <!-- <div class="question-list">
            <div class="question-type" v-if="simpleLists.length">简单题（本类题共{{ simpleLists.length
            }}小题，共{{ simpleSocre }}分）
            </div>
            <div class="question-item" v-for="(item, i) in simpleLists" :key="i">
              <div class="question-header">
                <div class="title"><span class="num">{{ singleChoiceLists.length +
                    multipleChoiceLists.length + judgeQuestionList.length + 
                    completionLists.length + i + 1
                }}.</span>{{ item.title }}</div>
                <div class="item-count">本题{{ item.socre }}分</div>
              </div>
              <div class="choose-and-flag">
                <div class="choose-content">
                  <div class="content" v-for="(x, index) in item.topic" :key="index">
                    <p><span class="mark">答案：</span></p>
                    <a-textarea @change="(e) => onChangeSimple(e, i)" :rows="10" />
                  </div>
                </div>
                <div class="flag" @click="flagsign(item)">
                  <span class="flag-text" :style="item.flagstatus ? { color: 'red' } : { color: '#838d99' }">标记</span>
                  <a-icon type="flag" theme="filled"
                    :class="{ flagactivered: item.flagstatus, flagactive: !item.flagstatus }" />
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <!-- 答题卡 -->
      <div class="right-aside">
        <div class="nav-content">
          <div class="nav-header">考题导航</div>
          <div class="fixed-card">
            <div class="answer">答题卡</div>
            <div class="answer-content">
              <div class="question-num">
                <div v-for="(i, index) in answer" :key="index" class="icon"
                  :style="String(i).length ? { 'background-color': '#ddd' } : {}"
                > {{ index }} 
                </div>
              </div>
              <p class="progress">已完成<span class="finish-num">{{ complete }}</span>道题,共<span>{{ countNum }}</span>道题</p>
              <div class="submit-answer" @click="subanswer">提交答案</div>
              <div class="mark-flag">
                <div class="mark-item"><span class="block-undo"></span><span class="mark-text">未做</span></div>
                <div class="mark-item"><span class="block-done"></span><span class="mark-text">已做</span></div>
                <!-- <div class="mark-item"><span class="block-cur"></span><span class="mark-text">当前</span></div> -->
                <!-- <div class="mark-item">
                  <span class="block-mark">
                    <a-icon type="flag" theme="filled" :style="{ color: '#f14d00', fontSize: '12px' }" />
                  </span>
                  <span class="mark-text">标记</span>
                </div> -->
              </div>
            </div>
          </div>
          <div v-show="leaveTime" class="time-tip">您还剩<span>10</span>分钟考试时间!</div>
        </div>
      </div>

    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Model, Watch } from "vue-property-decorator";
import { Icon, Radio, Checkbox, Input, Modal, Popconfirm, message } from "@h3/antd-vue";
import api  from '@/../extends/api';
const qs = require('qs');
// import date from "@cloudpivot/common/src/utils/date";
@Component({
  name: "onlineExam",
  components: {
    AIcon: Icon,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ACheckbox: Checkbox,
    ACheckboxGroup: Checkbox.Group,
    AInput: Input,
    ATextarea: Input.TextArea,
    AModal: Modal,
    APopconfirm: Popconfirm,
  },
})
export default class onlineExam extends Vue {
  [x: string]: any;

  value: any[] = [];

  answer: any = {}; //答案记录

  complete: number = 0; //已完成

  singleSocre: number = 0;

  multipleSocre: number = 0;

  judgeSocre: number = 0;

  Completionsocre: number = 0;

  simpleSocre: number = 0;

  visible: boolean = false;

  startTime ="" ;//开考时间

  title: any = "在线考试";

  countNum: Number = 0; //试题总题数

  name: any = "考试人";

  totleScore: Number = 0; //总分

  qualifiedScore: Number = 0; //合格分

  examTime: any = 0; //考试总时长

  counttime: any = 0;

  elapsedTime: any = 0; //考试已用时,开始考试后，根据设定的考试时长examTime，进行倒计时

  //   倒计时10分钟前提醒功能：您还剩10分钟
  leaveTime: boolean = false;
  //单选题
  // singleChoiceLists: any = [
  //   {
  //     title: "测试第一题题目",
  //     socre: 20,
  //     flagstatus: false,
  //     answer: "", //自答答案存放
  //     answerInfo:"A",// 查看答案存放
  //     topic: [
  //       { radio: "A. 测试第一题选项A", label: "A", value: "A" },
  //       { radio: "B. 测试第一题选项B", label: "B", value: "B" },
  //       { radio: "C. 测试第一题选项C", label: "C", value: "C" },
  //       { radio: "D. 测试第一题选项D", label: "D", value: "D" },
  //     ],
  //   },
  //   {
  //     title: "测试第二题题目",
  //     socre: 20,
  //     flagstatus: false,
  //     answer: "",
  //     answerInfo:"B",// 查看答案存放
  //     topic: [
  //       { radio: "A. 第二题选项A", label: "A", value: "A" },
  //       { radio: "B. 第二题选项B", label: "B", value: "B" },
  //       { radio: "C. 第二题选项C", label: "C", value: "C" },
  //     ],
  //   },
  //   {
  //     title: "测试第3题题目",
  //     socre: 10,
  //     flagstatus: false,
  //     answer: "",
  //     answerInfo:"C",// 查看答案存放
  //     topic: [
  //       { radio: "A. 试第3题选项A", label: "A", value: "A" },
  //       { radio: "B. 试第3题选项B", label: "B", value: "B" },
  //       { radio: "C. 试第3题选项C", label: "C", value: "C" },
  //       { radio: "E. 试第3题选项E", label: "E", value: "E" },
  //     ],
  //   },
  // ];

  singleChoiceLists: any = []

  //多选题
  // multipleChoiceLists: any = [
  //   {
  //     title: "测试第一题题目",
  //     socre: 20,
  //     flagstatus: false,
  //     answer: [],
  //     answerInfo:['A','B'],// 查看答案存放
  //     topic: [
  //       { radio: "A. 测试第一题选项A", label: "A", value: "A",isTrue:1},
  //       { radio: "B. 测试第一题选项B", label: "B", value: "B",isTrue:1},
  //       { radio: "C. 测试第一题选项C", label: "C", value: "C",isTrue:0 },
  //       { radio: "D. 测试第一题选项D", label: "D", value: "D",isTrue:0 },
  //     ],
  //   },
  //   {
  //     title: "测试第二题题目",
  //     socre: 20,
  //     flagstatus: false,
  //     answer: [],
  //     answerInfo:['A','D'],// 查看答案存放
  //     topic: [
  //       { radio: "A. 第二题选项A", label: "A", value: "A",isTrue:0 },
  //       { radio: "B. 第二题选项B", label: "B", value: "B",isTrue:1 },
  //       { radio: "C. 第二题选项C", label: "C", value: "C",isTrue:1 },
  //       { radio: "D. 第二题选项D", label: "D", value: "D",isTrue:0 },
  //     ],
  //   },
  // ];

  multipleChoiceLists: any = []

  //判断题JudgeQuestionList
  // judgeQuestionList: any = [
  //   {
  //     title: "测试第一题题目",
  //     socre: 20,
  //     flagstatus: false,
  //     answer: "",
  //     answerInfo:'true',// 查看答案存放
  //     topic: [
  //       { radio: "对", label: "√", value: "true" },
  //       { radio: "错", label: "x", value: "false" },
  //     ],
  //   },
  //   {
  //     title: "测试第二题题目",
  //     socre: 20,
  //     flagstatus: false,
  //     answer: "",
  //     answerInfo:'false',// 查看答案存放
  //     topic: [
  //       { radio: "对", label: "√", value: "true" },
  //       { radio: "错", label: "x", value: "false" },
  //     ],
  //   },
  //   {
  //     title: "测试第3题题目",
  //     socre: 10,
  //     flagstatus: false,
  //     answer: "",
  //     answerInfo:'false',// 查看答案存放
  //     topic: [
  //       { radio: "对", label: "√", value: "true" },
  //       { radio: "错", label: "x", value: "false" },
  //     ],
  //   },
  // ];

  judgeQuestionList: any = []
  
  //填空题
  completionLists: any = [
    {
      title: "测试第一题题目",
      socre: 20,
      flagstatus: false,
      answer: {},
      topic: [{ message: "答案1" }, { message: "答案2" }],
    },
    {
      title: "测试第二题题目",
      socre: 20,
      flagstatus: false,
      answer: {},
      topic: [{ message: "答案1" }, { message: "答案2" }],
    },
    {
      title: "测试第3题题目",
      socre: 10,
      flagstatus: false,
      answer: {},
      topic: [{ message: "答案1" }, { message: "答案2" }],
    },
  ];

   //简单题
  simpleLists: any = [
    {
      title: "测试第一题题目",
      socre: 20,
      flagstatus: false,
      answer: {},
      topic: [{ message: "答案1" }],
    },
    {
      title: "测试第二题题目",
      socre: 20,
      flagstatus: false,
      answer: {},
      topic: [{ message: "答案1" }],
    },
    {
      title: "测试第3题题目",
      socre: 10,
      flagstatus: false,
      answer: {},
      topic: [{ message: "答案1" }],
    },
  ];

  examLibraryid:any = ''  //试题库id

  onlineExamId:any = ''  //考试id

  fraction:any = '' //成绩

  saveAnswerInfo:any = {}

  answerList:any = []

  saveFraction:any = 0;

  remarkFraction:any = []

  closeTime:any = ''

  passScore:any = ''

  kstype:any = ''

  //标记变色
  flagsign(item) {
    item.flagstatus = !item.flagstatus;
  }

  //计时
  countDown() {
    if (this.examTime * 60 - this.counttime === 600) {
      this.leaveTime = true;
    }
    if (this.examTime * 60 === this.counttime) {
      this.visible = true;
      setTimeout(() => {
        this.visible = false;
        this.saveAnswer();
      }, 3000);
      // this.ClosePage()
    }
    if (this.counttime <= this.examTime * 60) {
      let msec = this.counttime; //顺序计时
      // let msec = this.examTime * 60 - this.counttime//倒计时
      let m: string | number = parseInt(String(msec / 60));
      m = m < 10 ? "0" + m : m;
      let s: string | number = parseInt(String(msec % 60));
      s = s < 10 ? "0" + s : s;
      this.elapsedTime = String(m) + "分" + String(s) + "秒";
    }
  }

  //关闭当前页面
  ClosePage() {
    setTimeout(() => {
      let userAgent = navigator.userAgent;
      if (
        userAgent.indexOf("Firefox") !== -1 ||
        userAgent.indexOf("Chrome") !== -1
      ) {
        window.location.href = "about:blank";
        window.close();
      } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
      }
    }, 3000);
  }

  Time() {
    setInterval(() => {
      this.counttime += 1;
      this.countDown();
    }, 1000);
  }

  created(){
    this.setTimes();
    this.examLibraryid = window.location.href.split("id=")[1].split('&type')[0];
    this.kstype =  window.location.href.split("type=")[1];
    this.name = JSON.parse(window.sessionStorage.getItem('user')).name;
    this.getOnlineExamByid(this.examLibraryid);
  }

  mounted() {
      // this.completionLists.length +
      // this.simpleLists.length;
    window.addEventListener("beforeunload", this.beforeUnloadHandler, false)

    Modal.info({
      title: "提示",
      content: "考试开始后不能停止，请确认是否开始考试？",
      okText: "确定",
      onOk: () => {
        this.Time();
      },
    });
  }
  
  destroyed() {
    window.removeEventListener("beforeunload", this.beforeUnloadHandler, false)
  } 

  beforeUnloadHandler(e) {
    if(this.examTime * 60 - this.counttime > 0 && this.complete !== this.countNum){
      e.returnValue = "离开此页面考试内容不会被保存，确认离开此页面？"
    }
  }

  //   单选题
  onChangeRadio(e, index, item) {
    // console.log(e)
    // console.log(item)
    // console.log("单选题选中值", e.target.value);
    if (!this.singleChoiceLists[index].answer) {
      this.complete += 1; //已完成
    }
    item.topic.forEach(ele => {   //算分
      if(ele.value === e.target.value){
        if(ele.isTrue === 1){
          if(!this.remarkFraction[index] || this.remarkFraction[index] === 0){
            this.saveFraction += item.socre;
            this.remarkFraction[index] = 1;
            this.answerList[index].isTrue = 1;
          }
        }else{
          if(!this.remarkFraction[index]){
            this.remarkFraction[index] = 0;
            this.answerList[index].isTrue = 0;
          }
          if(this.remarkFraction[index] !== 0){
            this.saveFraction -= item.socre;
            this.remarkFraction[index] = 0;
            this.answerList[index].isTrue = 0;
          }
        }
      }
    });
    this.singleChoiceLists[index].answer = e.target.value;
    this.answer[index + 1] = e.target.value;
  }

  //   多选题
  onChangeMultiple(e, index, item) {
    // console.log(`多选题第${index + 1}题`);
    // console.log("多选题选中值", e);
    let key = this.singleChoiceLists.length + index + 1;
    if (item.answer.length === 0) {
      this.complete += 1;
      this.answer[key] = e;
    } else {
      if (e.length === 0) {
        this.complete -= 1;
        this.answer[key] = "";
        this.remarkFraction[key-1] = 0;
      } else {
        this.answer[key] = e;
      }
    }
    item.answer = e;
    if(this.checkisTrue(index,e)) {
        // 加分
        if(!item.hasCheck) {
          this.saveFraction += item.socre;
          item.hasCheck = true;
          this.answerList[key-1].isTrue = 1;
        }
      } else {
        // 不加分
        if(item.hasCheck) {
          this.saveFraction -= item.socre;
          item.hasCheck = false;
          this.answerList[key-1].isTrue = 0;
        }
      }
  }

  //   判断题
  onChangeJudge(e, index,item) {
    // console.log(`判断题第${index + 1}题`);
    // console.log("判断题选中值", e.target.value);
    let key =
      this.singleChoiceLists.length +
      this.multipleChoiceLists.length +
      index +
      1;
    if (!this.judgeQuestionList[index].answer) {
      this.complete += 1; //已完成
    }
    item.topic.forEach(ele => {   //算分
      if(ele.value === e.target.value){
        if(ele.isTrue === 1){
          if(!this.remarkFraction[key-1] || this.remarkFraction[key-1] === 0){
            this.saveFraction += item.socre;
            this.remarkFraction[key-1] = 1;
            this.answerList[key-1].isTrue = 1;
          }
        }else{
          if(!this.remarkFraction[key-1]){
            this.remarkFraction[key-1] = 0;
            this.answerList[key-1].isTrue = 0;
          }
          if(this.remarkFraction[key-1] !== 0){
            this.saveFraction -= item.socre;
            this.remarkFraction[key-1] = 0;
            this.answerList[key-1].isTrue = 0;
          }
        }
      }
    });
    this.judgeQuestionList[index].answer = e.target.value;
    this.answer[key] = e.target.value;
  }

  //   填空题
  onChangeCompletion(e, i, index) {
    console.log(`填空题第${i + 1}题中答案${index + 1}`);
    console.log("填空题选中值", e.target.value);
    let key =
      this.singleChoiceLists.length +
      this.multipleChoiceLists.length +
      this.judgeQuestionList.length +
      i +
      1;
    if (Object.keys(this.completionLists[i].answer).length !== 0) {
      if (!e.target.value.trim()) {
        delete this.completionLists[i].answer[`答案${index + 1}`];
        if (Object.keys(this.completionLists[i].answer).length === 0) {
          this.complete -= 1;
          this.answer[key] = "";
        }
      } else {
        this.completionLists[i].answer[`答案${index + 1}`] =
          e.target.value.trim();
        this.answer[key] = this.completionLists[i].answer;
      }
    } else {
      if (e.target.value.trim()) {
        this.completionLists[i].answer[`答案${index + 1}`] =
          e.target.value.trim();
        this.complete += 1;
        this.answer[key] = this.completionLists[i].answer;
      }
    }
  }

  //简单题
  onChangeSimple(e,index){
    console.log(`填空题第${index + 1}题`);
    console.log("填空题选中值", e.target.value);
    let key =
      this.singleChoiceLists.length +
      this.multipleChoiceLists.length +
      this.judgeQuestionList.length +
      this.simpleLists.length +
      index +
      1;
      if (!this.simpleLists[index].answer && e.target.value.trim()) {
        this.complete += 1; //已完成
      }
      this.simpleLists[index].answer = e.target.value.trim();
      this.answer[key] = e.target.value.trim();
  }

  subanswer() {
    if(this.complete !== this.countNum){
       Modal.warning({
        title: "提示",
        content: "有试题未作答，请作答后交卷",
        okText: "确定",
      });
    }else{
      Modal.confirm({
        title: "提示",
        content: "确认提交答案吗？",
        okText: "确定",
        cancelText:'取消',
        onOk: () => {
          this.saveAnswer();
        },
      });
      
    }
  }

  saveAnswer(){
    for (let i in this.answer) {
      let v = Number(i);
      this.answerList[v-1]["myAnswer"] = this.answer[i].toString();
    }
    this.saveAnswerInfo['id'] = this.onlineExamId?this.onlineExamId:'';
    this.saveAnswerInfo['examid']= this.examLibraryid;
    this.saveAnswerInfo['openTime'] = this.startTime;
    this.saveAnswerInfo['fraction'] = this.saveFraction;
    this.saveAnswerInfo['examTime'] = this.counttime;
    this.saveAnswerInfo['examQuestionList'] = this.answerList;
    this.saveAnswerInfo['examName'] = this.title;
    this.saveAnswerInfo['isTrue'] = this.saveFraction >= this.passScore ? 1 : 0;
    this.saveOnlineExam(this.saveAnswerInfo);
  }

  async getOnlineExamByid(id){
      let option = qs.stringify({
          "examLibraryid": id
        })
      let res:any = await api.getOnlineExamByid(option);
      if(res.errcode === 0){
        this.title = res.data.examinationName;
        this.examTime = res.data.testDuration;
        this.totleScore = res.data.totalScore;
        this.onlineExamId = res.data.onlineExamId;
        this.fraction = res.data.fraction;
        this.passScore = res.data.passScore;
        let questionList = res.data.questionList;
        for(let i in questionList){
            let answerInfo: any = {
              questionId:questionList[i].id,
              isTrue:0
            }
            let option = {
                title:questionList[i].questionTitle,
                socre:questionList[i].scoreNum,
                paperId: questionList[i].paperId,
                orderNum: questionList[i].orderNum,
                topic:[]
            }
            questionList[i].optionList.forEach(element => {
              let param:any = {
                    radio:element.optionCode+"、"+element.describes,
                    label:questionList[i].questionType !== '判断' ? element.optionCode : element.describes,
                    value:element.optionCode,
                    isTrue:element.isTrue
                  }
                  option['topic'].push(param);
            });
            if(questionList[i].questionType === '单选'){
              option['answer'] = ''
              this.singleChoiceLists.push(option);
              this.singleChoiceLists.sort((a,b) => {return a.orderNum-b.orderNum});
            }else if(res.data.questionList[i].questionType === '多选'){
              option['answer'] = []
              this.multipleChoiceLists.push(option);
              this.multipleChoiceLists.sort((a,b) => {return a.orderNum-b.orderNum});
            }else{
              option['answer'] = ''
              this.judgeQuestionList.push(option);
              this.multipleChoiceLists.sort((a,b) => {return a.orderNum-b.orderNum});
            }
            this.answerList.push(answerInfo);
        };
         this.countNum =
          this.singleChoiceLists.length +
          this.multipleChoiceLists.length +
          this.judgeQuestionList.length;
          for (let i = 1; i <= this.countNum; i++) {
            this.answer[i] = "";
          }
          for (let i = 0; i < this.singleChoiceLists.length; i++) {
            this.singleSocre += this.singleChoiceLists[i].socre;
          }
          for (let i = 0; i < this.multipleChoiceLists.length; i++) {
            this.multipleSocre += this.multipleChoiceLists[i].socre;
          }
          for (let i = 0; i < this.judgeQuestionList.length; i++) {
            this.judgeSocre += this.judgeQuestionList[i].socre;
          }
          for (let i = 0; i < this.completionLists.length; i++) {
            this.Completionsocre += this.completionLists[i].socre;
          }
          for (let i = 0; i < this.simpleLists.length; i++) {
            this.simpleSocre += this.simpleLists[i].socre;
          }
      }
  }

  async saveOnlineExam(param){
      let res:any = await api.saveOnlineExam(param);
      if(res.errcode === 0){
        message.success("提交成功");
        if(this.kstype === '1'){
          setTimeout(() => {
            const { href } = this.$router.resolve({
              path: '/application/OnlineLearning/application-list/onlineExam',
            });
            window.open(href, '_self');
          },1500);
        }else{
          setTimeout(() => {
            window.open('/application/OnlineLearning/audit/examInfo?isOpenPage=true&id='+res.data.msg, '_self');
          },1500);
        }
      }else{
        message.error(res.errmsg);
      }
  }

  setTimes() {
   var _this = this;
   let yy = new Date().getFullYear();
   let mm = new Date().getMonth() + 1;
   let dd = new Date().getDate();
   let hh = new Date().getHours();
   let mf = new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes();
   let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
   this.startTime = yy + "-" + mm + "-" + dd + ' ' +hh + ":" + mf + ":" + ss;
  }

  checkisTrue(index,e) {
      let flag = true;
      let topicList = this.multipleChoiceLists[index].topic;
      for (let i = 0; i < topicList.length; i++) {
        if(topicList[i].isTrue === 1) {
          // 正确
          if(e.indexOf(topicList[i].value) === -1) {
            flag = false;
          }
        } else {
          //错误
          if(e.indexOf(topicList[i].value) !== -1) {
            flag = false;
          }
        }
      }
      return flag;
  }

}
</script>

<style lang="less" scoped>
@import "../assets/examPaper.less";

.paper-wrapper {
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
}

/deep/.ant-radio-wrapper,
/deep/.ant-checkbox-wrapper {
  border: 1px solid #cdcdcd;
  padding: 5px;
  width: 90px;
  border-radius: 3px;
  margin-right: 20px;

  &:hover {
    background: #0099ff;
    color: #ffffff;
    border: 1px solid #0099ff;
  }
}

/deep/.ant-radio-wrapper-checked,
/deep/.ant-checkbox-wrapper-checked {
  background: #0099ff;
  color: #ffffff;
  border: 1px solid #0099ff;
}

/deep/.ant-checkbox-checked .ant-checkbox-inner {
  background: #ffffff;
}

/deep/.ant-checkbox-checked .ant-checkbox-inner::after {
  border-color: #2970ff;
}

.flagactive {
  color: #d5d5d5;
}

.flagactivered {
  color: #f14d00;
  border: 1px solid red;
  background-color: #fdeed7;
}
.analysis{
  width:100%;
  padding: 10px 15px;
  border:1px solid #cdcdcd;
  background: #f5f5f5;
  .title{
    color:rgb(17, 18, 24);
    font-size: 12px;
    opacity:.5;
  }
  .con{
    font-size: 13px;
    color: rgba(82, 82, 82);
    line-height: 18px;
    margin-top: 8px;
  }
}
/deep/.ant-radio-wrapper-disabled, /deep/.ant-checkbox-wrapper-disabled{
   border:1px solid #eee;
}
/deep/.ant-radio-wrapper-disabled:hover,/deep/.ant-checkbox-wrapper-disabled:hover{
  background: #fff;
  border:1px solid #eee;
}
/deep/.ant-radio-wrapper-disabled:hover{
  /deep/.ant-radio-inner{
    border-color: #d9d9d9;
  }
}
/deep/.ant-checkbox-wrapper-disabled:hover{
  /deep/.ant-checkbox-inner{
    border-color: #d9d9d9;
  }
}
</style>