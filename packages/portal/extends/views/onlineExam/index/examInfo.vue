<template>
  <div class="paper-wrapper">
    <div class="center-content">
      <div class="exam-content" style="width:80%;margin:0 auto;">
        <div class="paper-header">
          <div class="text">{{ title }}</div>
          <!-- 查看 -->
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
        <div class="question-div">
          <div></div>
          <div class="question-list">
            <div v-if="singleChoiceLists.length" class="question-type">
              <div>
                单选题
              </div>
            </div>
            <div v-for="(item, i) in singleChoiceLists" :key="i" class="question-item">
              <div class="question-header">
                <div class="title"><span class="num">{{ i + 1 }}.</span>{{ item.title }}</div>
              </div>
              <div class="choose-and-flag">
                <div class="choose-content">
                  <div class="content">
                    <p v-for="(x, index) in item.topic" :key="index"><span class="mark">{{ x.radio }}</span></p>
                  </div>
                  <div class="buttons">
                    <a-radio-group :value="item.answerInfo" :disabled="true">
                        <a-radio v-for="(option,index) in item.topic" :key="index" :value="option.label" :class="{ 'selectedGreen': isSelectedGreen(item.type,option,item.answerInfo,item.isAnswer),'selectedRed': isSelectedRed(item.type,option,item.answerInfo,item.isAnswer) }">
                            {{ option.label }}
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
          <!-- 多选题 -->
          <div class="question-list">
            <div v-if="multipleChoiceLists.length" class="question-type">
              <div>
                多选题
              </div>
            </div>
            <div v-for="(item, i) in multipleChoiceLists" :key="i" class="question-item">
              <div class="question-header">
                <div class="title"><span class="num">{{ singleChoiceLists.length + i + 1 }}.</span>{{ item.title }}
                </div>
              </div>
              <div class="choose-and-flag">
                <div class="choose-content">
                  <div class="content">
                    <p v-for="(x, index) in item.topic" :key="index"><span class="mark">{{ x.radio }}</span></p>
                  </div>
                  <div class="buttons">
                    <a-checkbox-group :value="item.answerInfo" :disabled="true">
                      <a-checkbox v-for="(option,index) in item.topic" :key="index" :value="option.label" :class="{'selectedRed': isSelectedRed(item.type,option,item.answerInfo,item.isAnswer) , 'selectedGreen': isSelectedGreen(item.type,option,item.answerInfo,item.isAnswer)}">
                          {{ option.label }}
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
          <!-- 判断 -->
          <div class="question-list">
            <div v-if="judgeQuestionList.length" class="question-type">
              <div>
                判断题
              </div>
            </div>
           <div v-for="(item, i) in judgeQuestionList" :key="i" class="question-item">
              <div class="question-header">
                <div class="title"><span class="num">{{ singleChoiceLists.length + multipleChoiceLists.length + i + 1 }}.</span>{{ item.title }}</div>
              </div>
              <div class="choose-and-flag">
                <div class="choose-content">
                  <div class="buttons">
                    <a-radio-group :value="item.answerInfo" :disabled="true">
                        <a-radio v-for="(option,index) in item.topic" :key="index" :value="option.label" :class="{ 'selectedGreen': isSelectedGreen(item.type,option,item.answerInfo,item.isAnswer),'selectedRed': isSelectedRed(item.type,option,item.answerInfo,item.isAnswer) }">
                            {{ option.label }}
                        </a-radio>
                    </a-radio-group>
                  </div>
                  <div class="analysis">
                    <p class="title">正确答案:</p>
                    <template v-for="(option,index) in item.topic">
                      <p v-if="item.trueAnswer === option.value" :key="index" class="con">{{ option.label }}</p>
                    </template>  
                  </div>
                </div>
              </div>
            </div>

          </div>
          
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
  },
})
export default class examInfo extends Vue {
  [x: string]: any;

  value: any[] = [];

  answer: any = {}; //答案记录

  singleSocre: number = 0;

  multipleSocre: number = 0;

  judgeSocre: number = 0;

  Completionsocre: number = 0;

  simpleSocre: number = 0;

  title: any = "在线考试";

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
  
  examLibraryid:any = ''  //试题库id

  onlineExamId:any = ''  //考试id

  fraction:any = '' //成绩

  answerList:any = []

  created(){
    this.examLibraryid = window.location.href.split("id=")[1];
    this.name = JSON.parse(window.sessionStorage.getItem('user')).name;
    this.getExamHistoryByid(this.examLibraryid);
  }

  mounted() {
    
  }

  time(val){
      let m: string | number = parseInt(String(val / 60));
      m = m < 10 ? "0" + m : m;
      let s: string | number = parseInt(String(val % 60));
      s = s < 10 ? "0" + s : s;
      return String(m)+ ':' + String(s) ;
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
    if(type === '多选'){
      for(var i=0; i<answer.length;i++){
        for(var j=0;j<isAnswer.length;j++){
          if(answer[i] === isAnswer[j] && option.label === answer[i]){
            return true;
          }
        }
      }
    }else{
      if(type === '判断'){
        return answer === option.value && option.value === isAnswer;
      }else{
        return answer === option.label && option.label === isAnswer;
      }
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
      if(type === '判断'){
        return answer === option.value && answer !== isAnswer;
      }else{
        return answer === option.label && answer !== isAnswer;
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "../assets/examPaper.less";

.paper-wrapper {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
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
/deep/.selectedRed{
    border-color: red!important;
    background: red!important;
    span{
        color: #fff!important;
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
    background: green!important;
    span{
        color: #fff!important;
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