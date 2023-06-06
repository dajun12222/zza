<template>
  <div class="paper-wrapper">
    <returnTemplate />
    <!-- <div class="exam-content"> -->
      <div class="exam-info">
        <div class="text">{{ title }}</div>
        <div class="exam-score">
          <div class="score-info">
            <div>
              <img src="../images/df.png" alt="考试成绩" />
              <div>考试成绩</div>
              <div class="scoreDiv">{{ fraction }}</div>
            </div>
          </div>
          <div class="score-info">
            <div>
              <img class="img-time" src="../images/time.png" alt="用时" />
              <div>考试用时</div>
              <div class="scoreDiv">{{ examTime }}</div>
            </div>
          </div>
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
            </div>
            <div class="question-item">
              <div class="question-header">
                <div class="title">{{ item.title }}</div>
              </div>
              <div class="choose-and-flag">
                <div class="choose-content">
                  <div class="buttons">
                    <a-radio-group :value="item.answerInfo" :disabled="true">
                      <a-radio 
                        v-for="(x, index) of item.topic" 
                        :key="index"
                        :value="x.value" 
                        :class="{ 'selectedGreen': isSelectedGreen(item.type,x,item.answerInfo,item.isAnswer),'selectedRed': isSelectedRed(item.type,x,item.answerInfo,item.isAnswer) }"
                       >{{ x.radio }}
                      </a-radio>
                    </a-radio-group>
                  </div>
                  <div class="analysis">
                    <p class="title">正确答案:</p>
                    <p class="con">{{ item.trueAnswer }}</p>
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
            </div>
            <div class="question-item">
              <div class="question-header">
                <div class="title">{{ item.title }}</div>
              </div>
              <div class="choose-and-flag">
                <div class="choose-content">
                  <div class="buttons">
                    <a-checkbox-group :value="item.answerInfo" :disabled="true">
                      <a-checkbox 
                        v-for="(x, index) of item.topic" 
                        :key="index"
                        :value="x.value"
                        :class="{'selectedRed': isSelectedRed(item.type,x,item.answerInfo,item.isAnswer) , 'selectedGreen': isSelectedGreen(item.type,x,item.answerInfo,item.isAnswer)}"
                       >{{ x.radio }}
                      </a-checkbox>
                    </a-checkbox-group>
                  </div>
                  <div class="analysis">
                    <p class="title">正确答案:</p>
                    <p class="con">{{ item.trueAnswer.map(e => e.toString() + "；").join("") }}</p>
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
            </div>
            <div class="question-item">
              <div class="question-header">
                <div class="title">{{ item.title }}</div>
              </div>
              <div class="choose-and-flag">
                <div class="choose-content">
                  <div class="buttons">
                    <a-radio-group :value="item.answerInfo" :disabled="true">
                      <a-radio 
                        v-for="(x, index) of item.topic" 
                        :key="index"
                        :value="x.value"
                        :class="{ 'selectedGreen': isSelectedGreen(item.type,x,item.answerInfo,item.isAnswer),'selectedRed': isSelectedRed(item.type,x,item.answerInfo,item.isAnswer) }" 
                       >{{ x.radio }}
                      </a-radio>
                    </a-radio-group>
                  </div>
                  <div class="analysis">
                    <p class="title">正确答案:</p>
                    <p class="con">{{ item.trueAnswer }}</p>
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
        <!-- <div class="saveUp" @click="subanswer"><a-icon type="form-o" /> 交卷</div> -->
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
             <!-- <p v-else @click="saveAnswer">确定</p> -->
          </div>
        </div>
      </div>
      <div v-show="showMessage" class="showMessage">
        <img v-if="messageImg" src="../images/cg.png" />
        <img v-else src="../images/lose.png" />
        <div>{{ messageTitle }}</div>
      </div>
    <!-- </div> -->
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
  name: "examInfo",
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
export default class examInfo extends Vue {
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

  title: any = "在线考试";

  countNum: Number = 0; //试题总题数

  name: any = "考试人";

  totleScore: Number = 0; //总分

  examTime: any = 0; //考试总时长


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


  // //标记变色
  // flagsign(item) {
  //   item.flagstatus = !item.flagstatus;
  // }


  time(val){
    let m: string | number = parseInt(String(val / 60));
    m = m < 10 ? "0" + m : m;
    let s: string | number = parseInt(String(val % 60));
    s = s < 10 ? "0" + s : s;
    return String(m)+ ':' + String(s) ;
  }

  created(){
    this.examLibraryid = window.location.href.split("id=")[1];
    // this.name = JSON.parse(window.sessionStorage.getItem('user')).name;

    // this.title = window.location.href.split('type=')[1].split('&isOpenPag')[0] === '1'? '在线考试' : '课程练习'

    this.getExamHistoryByid(this.examLibraryid);
  }

  mounted() {
      // this.completionLists.length +
      // this.simpleLists.length;
    // window.addEventListener("beforeunload", this.beforeUnloadHandler, false)
    // this.Time();

    // Modal.info({
    //   title: "提示",
    //   content: "考试开始后不能停止，请确认是否开始考试？",
    //   okText: "确定",
    //   onOk: () => {
    //     this.Time();
    //   },
    // });
  }

  async getExamHistoryByid(id){
      let option = qs.stringify({
          "examHistoryid": window.location.href.split('id=')[1]
        })
      let res:any = await api.getExamHistoryByid(option);
     
      if(res.errcode === 0){
        this.title = res.data.examinationName;
        this.examTime = this.time(res.data.examTime);
        this.totleScore = res.data.totalScore;
        this.onlineExamId = res.data.onlineExamId;
        this.fraction = res.data.fraction;
        this.countNum = res.data.paperNum;
        let questionList = res.data.questionList;
        for(let i in questionList){
            let answerInfo: any = {
              questionId:questionList[i].id
            }
            let option:any = {
                title:questionList[i].questionTitle,
                socre:questionList[i].scoreNum,
                paperId: questionList[i].paperId,
                orderNum: questionList[i].orderNum,
                topic:[],
                type:questionList[i].questionType,
                isAnswer: questionList[i].questionType === '多选' ? [] : '',
                trueAnswer:questionList[i].questionType === '多选' ? [] : '',
            }
            questionList[i].optionList.forEach(element => {
              let param:any = {
                    radio:element.optionCode+"、"+element.describes,
                    label:questionList[i].questionType !== '判断' ? element.optionCode : element.describes,
                    value:element.optionCode,
                    isTrue:element.isTrue
                  }
                  if(questionList[i].questionType === '多选'){
                    if(element.isTrue === 1){
                      option.isAnswer.push(element.optionCode) 
                      option.trueAnswer.push(element.optionCode)
                    }
                  }else{
                    if(element.isTrue === 1){
                      option.isAnswer = element.optionCode
                      option.trueAnswer = element.optionCode
                    }
                  }
                  option['topic'].push(param);
            });
            if(questionList[i].questionType === '单选'){
              option['answerInfo'] = questionList[i].myAnswer;
              this.singleChoiceLists.push(option);
              this.singleChoiceLists.sort((a,b) => {return a.orderNum-b.orderNum});
            }else if(res.data.questionList[i].questionType === '多选'){
              option['answerInfo'] = questionList[i].myAnswer.split(',');
              this.multipleChoiceLists.push(option);
              this.multipleChoiceLists.sort((a,b) => {return a.orderNum-b.orderNum});
            }else{
              option['answerInfo'] = questionList[i].myAnswer;
              this.judgeQuestionList.push(option);
              this.multipleChoiceLists.sort((a,b) => {return a.orderNum-b.orderNum});
            }
            this.answerList.push(answerInfo);
        };
      }
  }

  isSelectedGreen(type,option,answer,isAnswer){
    console.log(type,option,answer,isAnswer);
    
    if(type === '多选'){
      for(var i=0; i<answer.length;i++){
        for(var j=0;j<isAnswer.length;j++){
          if(answer[i] === isAnswer[j] && option.label === answer[i]){
            return true;
          }
        }
      }
    }else{
      return answer === option.label && option.label === isAnswer;
    }
  }
  
  isSelectedRed(type,option,answer,isAnswer){
     if(type === '多选'){
      for(var i=0; i<answer.length;i++){
        for(var j=0;j<isAnswer.length;j++){
          if(answer[i] === option.label && answer[i] !== isAnswer[j]){
            return true;
          }
        }
      }
    }else{
      return answer === option.label && answer !== isAnswer;
    }
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
  margin-top: 45px;
  .text {
    font-size: 0.5rem;
    font-weight: 600;
    color: #363636;
    align-self: center;
  }
}
//新
.exam-info{
  height: 1.8rem;
  width: 100%;
  position: fixed;
  left: 0;
  top: 45px;
  background: #fff;
  padding: 0 .3rem;
  line-height: 1rem;
  z-index: 1;
  // box-shadow: 0px 5px 3px #eee;
  .info{
    display: flex;
    justify-content: space-between;
    font-size: .4rem;
    .time{
      color: red;
    }
  }
}

.exam-score{
  display: flex;
  font-size: .4rem;
  // height: 50px;
  .score-info{
      width: 50%;
      height: 100%;
      position: relative;
      > div{
          display: flex;
          align-items: center;
          justify-content: center;
          img{
              width: 25px;
              height: 25px;
          }
          .img-time{
              width: 22px;
              height: 22px;
              // margin-top: 2px;
          }
          div{
              color: rgba(102,102,102);
              line-height: 30px;
              margin-left: 15px;
          }
          .scoreDiv{
              color: red;
              font-size: .5rem;
              margin-left: 5px;
          }
      }
      
  }
  .score-info:nth-child(1){
      border-right: 1px solid rgba(233,233,233);
  }
}
.ant-carousel{
  margin-top: 1.8rem;
  height: calc(100% - 1.8rem);
  width: 100%;
  background: #fff;
  padding: 0 .3rem;
  // margin-bottom: 2.3rem;
}
.question-type{
  display: flex;
  justify-content: space-between;
  font-size: .42rem;
  height: 1rem;
  align-items: center;
  margin-bottom: .3rem;
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
  margin-bottom: .3rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3rem;
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

.analysis{
  width:100%;
  padding: 0px 15px;
  border:1px solid #ebebeb;
  background: #f5f5f5;
  border-radius: 5px;
  text-align: left;
  .title{
    font-size: 0.4rem;
    color: rgb(126, 126, 126);
    line-height: 18px;
    margin: 8px 0;
  }
  .con{
    font-size: 0.56rem;
    color: rgba(82, 82, 82);
    line-height: 18px;
    margin-bottom: 8px;
    
  }
}

/deep/.selectedRed{
    border-color: red!important;
    span{
      // color: #fff!important;
        color: red!important;
        &.ant-radio-inner{
            border-color: #d9d9d9 !important;
        }
        &.ant-radio-inner:after{
            border-color: rgba(0, 0, 0, 0.2) !important;
            background-color: red !important;
        }
        &.ant-checkbox-inner{
            border-color: red !important;
        }
        &.ant-checkbox-inner::after{
            border-color: red!important;
            background-color: #fff !important;
        }
    }
}
/deep/.selectedGreen{
    border-color: green!important;
    // background: green!important;
    span{
        color: green !important;
        &.ant-radio-inner{
            border-color: #d9d9d9 !important;
        }
        &.ant-radio-inner:after{
            border-color: rgba(0, 0, 0, 0.2) !important;
            background-color: green !important;
        }
        &.ant-checkbox-checked{
          .ant-checkbox-inner{
              border-color: green !important;
          }
        }
        &.ant-checkbox-inner::after{
            border-color: green !important;
            background-color: #fff !important;
        }
    }
}
/deep/.center-content .selectedRed .ant-checkbox-checked .ant-checkbox-inner::after{
  border-color: red!important;
}
/deep/.center-content .selectedGreen .ant-checkbox-checked .ant-checkbox-inner::after{
  border-color: green!important;
}
</style>