<template>
  <div class="paper-wrapper">
    <returnTemplate />
    <a-modal v-model="visible" :closable="false" :footer="null" :maskClosable="false">
      <p>考试时间已到，3秒后自动交卷</p>
    </a-modal>
    <div class="exam-info">
        <div class="info">
          <div>考试用时：{{ examTime }}分钟</div>
          <div>已用时: <span class="time">{{ elapsedTime }}</span></div>
        </div>
    </div>
    <a-carousel
      ref="varousel"
      arrows
      :speed="300"
      :infinite="false"
      :afterChange="handleAfterChange"
    >
      <template v-if="singleChoiceLists.length">
        <div v-for="(item, i) in singleChoiceLists" :key="i" class="question-list">
          <div class="question-type">
            <div>单选题</div>
            <div><span>{{ i + 1 }}</span>/{{ countNum }}</div>
          </div>
          <div class="question-item">
            <div class="question-header">
              <div class="title">{{ item.title }}</div>
            </div>
            <div class="choose-and-flag">
              <div class="choose-content">
                <div class="buttons">
                  <a-radio-group @change="((e) => { onChangeRadio(e, i, item) })">
                    <a-radio 
                      v-for="(x, index) of item.topic" 
                      :key="index"
                      :value="x.value" 
                     >{{ x.radio }}
                    </a-radio>
                  </a-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="multipleChoiceLists.length">
        <div v-for="(item, i) in multipleChoiceLists" :key="i" class="question-list">
          <div class="question-type">
            <div>多选题</div>
            <div><span>{{ singleChoiceLists.length + i + 1 }}</span>/{{ countNum }}</div>
          </div>
          <div class="question-item">
            <div class="question-header">
              <div class="title">{{ item.title }}</div>
            </div>
            <div class="choose-and-flag">
              <div class="choose-content">
                <div class="buttons">
                  <a-checkbox-group @change="((e) => { onChangeMultiple(e, i, item) })">
                    <a-checkbox 
                      v-for="(x, index) of item.topic" 
                      :key="index"
                      :value="x.value" 
                     >{{ x.radio }}
                    </a-checkbox>
                  </a-checkbox-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="judgeQuestionList.length">
        <div v-for="(item, i) in judgeQuestionList" :key="i" class="question-list">
          <div class="question-type">
            <div>判断题</div>
            <div><span>{{ singleChoiceLists.length + multipleChoiceLists.length + i + 1 }}</span>/{{ countNum }}</div>
          </div>
          <div class="question-item">
            <div class="question-header">
              <div class="title">{{ item.title }}</div>
            </div>
            <div class="choose-and-flag">
              <div class="choose-content">
                <div class="buttons">
                  <a-radio-group @change="((e) => { onChangeJudge(e, i, item) })">
                    <a-radio 
                      v-for="(x, index) of item.topic" 
                      :key="index"
                      :value="x.value" 
                     >{{ x.radio }}
                    </a-radio>
                  </a-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </a-carousel>
    <div class="saveDiv">
      <div>
        <div v-if="currentPage > 1" @click="prev">
           <a-icon type="arrow-left-o" /> 上一题
        </div>
      </div>
      <div class="saveUp" @click="subanswer"><a-icon type="form-o" /> 交卷</div>
      <div>
        <div v-if="currentPage < countNum" @click="next">
          下一题 <a-icon type="arrow-right-o" />
        </div>
      </div>
    </div>
    <div v-show="showIsChoice" class="showIsChoice">
      <div class="choiceModal">
        <div class="title">{{ showChoiceTitle }}</div>
        <div class="showIsChoiceBtn">
          <p @click="hideShowNoChoice">取消</p>
          <p v-if="complete !== countNum" @click="hideShowNoChoice">确定</p>
           <p v-else @click="saveAnswer">确定</p>
        </div>
      </div>
    </div>
    <div v-show="showMessage" class="showMessage">
      <img v-if="messageImg" src="../images/cg.png" />
      <img v-else src="../images/lose.png" />
      <div>{{ messageTitle }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Model, Watch } from "vue-property-decorator";
import { Icon, Radio, Checkbox, Input, Modal, Popconfirm, message, Carousel } from "@h3/antd-vue";
import returnTemplate from '../../../components/return/index.vue';
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
     ACarousel: Carousel,
     returnTemplate
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

  showIsChoice: boolean = false;   //确认是否交卷

  showChoiceTitle:any = ''; 

  showMessage:any = false;

  messageTitle:any = "";

  messageImg:any = false;

  startTime ="" ;//开考时间

  title: any = "在线考试";

  countNum: Number = 0; //试题总题数

  name: any = "考试人";

  totleScore: Number = 0; //总分

  qualifiedScore: Number = 0; //合格分

  examTime: any = 0; //考试总时长

  counttime: any = 0;

  elapsedTime: any = 0; //考试已用时,开始考试后，根据设定的考试时长examTime，进行倒计时

  passScore:any = ''

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

  currentPage:any = 1;


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
    this.examLibraryid = window.location.href.split("id=")[1];
    this.getOnlineExamByid(this.examLibraryid);
  }

  mounted() {
      // this.completionLists.length +
      // this.simpleLists.length;
    window.addEventListener("beforeunload", this.beforeUnloadHandler, false)
    this.Time();

    // Modal.info({
    //   title: "提示",
    //   content: "考试开始后不能停止，请确认是否开始考试？",
    //   okText: "确定",
    //   onOk: () => {
    //     this.Time();
    //   },
    // });
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
    this.showIsChoice = true;
    if(this.complete !== this.countNum){
      let answerList:any = Object.values(this.answer);
      for(var i=0; i<answerList.length; i++){
        if(answerList[i] === ''){
          let num = i+1
          this.showChoiceTitle = "第" + num + "题未作答，请作答后交卷！"
          return;
        }
      }
    }else{
      this.showChoiceTitle = "确认提交答案吗？"
    }
  }

  saveAnswer(){
    this.showIsChoice = false;
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
            let option:any = {
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
        this.messageTitle = "提交成功！"
        this.messageImg = true;
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
          const { href } = (this as any).$router.push({
            path: '/apps/apps-form-list/onlineExam',
          });
          window.open(href, '_self');
        },1500);
      }else{
        this.messageTitle = "提交失败！"
        this.messageImg =false;
        this.showMessage = true;
        setTimeout(() => {
          this.showMessage = false;
        },1500);
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

  next(){
    const varousel: any = (this.$refs.varousel as Vue & { next: () => any })
    varousel.next();
  }

  prev(){
    const varousel: any = (this.$refs.varousel as Vue & { prev: () => any })
    varousel.prev();
  }

  hideShowNoChoice(){
    this.showIsChoice = false;
  }

  handleAfterChange(index) {
    this.currentPage = index + 1;
  }

}
</script>

<style lang="less" scoped>
@foot-height: 100px;
// @import "../assets/examPaper.less";

.paper-wrapper {
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: relative;
  overflow-x: hidden;
}
//新
.exam-info{
  height: 1rem;
  width: 100%;
  position: fixed;
  left: 0;
  top: 45px;
  background: #f8f8f8;
  padding: 0 .3rem;
  line-height: 1rem;
  .info{
    display: flex;
    justify-content: space-between;
    font-size: .4rem;
    .time{
      color: red;
    }
  }
}
.ant-carousel{
  margin-top: 2.3rem;
  height: calc(100% - 2.3rem);
  width: 100%;
  background: #fff;
  padding: 0 .3rem;
}
.question-type{
  display: flex;
  justify-content: space-between;
  font-size: .42rem;
  height: 1rem;
  align-items: center;
  margin-bottom: .5rem;
  div:nth-child(1){
    border-left: .1rem solid red;
    height: .5rem;
    line-height: .5rem;
    padding-left: .15rem;
  }
  div:nth-child(2){
    line-height: 1rem;
    height: 100%;
    span{
      font-size:.48rem;
      color: red;
    }
  }
}
.question-header{
  font-size: .45rem;
  text-align: left;
  color: #333;
  margin-bottom: .8rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
  .title{
    line-height: .55rem;
    font-weight: 600;
  }
}
.ant-radio-group,.ant-checkbox-group{
  text-align: left;
  width: 100%;
}
.ant-radio-wrapper,.ant-checkbox-wrapper{
    width: 100%;
    font-size: .4rem;
    display: block;
    text-align: left;
    display: flex;
    justify-content: left;
    align-items: center;
    margin-bottom: .3rem;
    margin-left: 0;
}
 /deep/ .ant-radio-wrapper > span:nth-child(2),/deep/ .ant-checkbox-wrapper > span:nth-child(2){
      display: inline-block;
      line-height: .5rem;
      white-space: break-spaces;
 }
 .saveDiv{
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 1.5rem;
  display: flex;
  padding: 0 .3rem;
  font-size: .42rem;
  justify-content: space-between;
  height: 1rem;
  line-height: 1rem;
 }
 .saveDiv > div{
  width: 33.33%;
 }
  .saveDiv > div:nth-child(1){
    text-align: left;
  }
  .saveDiv > div:nth-child(3){
    text-align: right;
  }
 .saveUp{
  color: #1852d9;
 }
/deep/.ant-modal-body > p{
  font-size: .45rem!important;
  margin-bottom: 0;
}
.showIsChoice{
  width: 100%;
  position: fixed;
  left:0;
  top: 0;
  height: 100%;
  background: rgba(0,0,0,.5);
  z-index: 11;
  .choiceModal{
    width:80%;
    height: 3rem;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    position: fixed;
    left: 10%;
    top: 50%;
    margin-top: -1.5rem;
    .title{
      font-size: .4rem;
      height: 2rem;
      line-height: 2rem;
      border-bottom: 1px solid #eee;
      color: #000;
    }
    .showIsChoiceBtn{
      display: flex;
      height: 1rem;
      line-height: 1rem;
      p{
        width: 50%;
        font-size: .38rem;
        height: 100%;
        margin-bottom: 0;
      }
      p:nth-child(1){
        border-right: 1px solid #eee;
      }
    }
  }
}
.showMessage{
  position: fixed;
  background: #fff;
  height: 1.5rem;
  top: .5rem;
  width: 50%;
  margin-left: 25%;
  display: flex;
  justify-content: center;
  font-size: .45rem!important;
  align-items: center;
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  img{
    width: .8rem;
    height: .8rem;
    border-radius: 50%;
    margin-right: .3rem;
  }
}
</style>