<template> 
    <div ref="studyCon" class="studyCon">
        <a-row ref="studyRow" class="studyRow" :gutter="16">
            <a-col 
                v-for="(item, index) of list.list"
                :key="index" 
                class="gutter-row" 
                @click="goCon(item)"
            >
                <div class="posR">
                    <img v-if="item.coursereCommend === '是'" class="tj" src="../images/tj2.png" alt="" />
                    <img :src="newLocalHref + item.coursePage[0].refId + '&T=' + token" :alt="item.courseName" />
                    <div class="pd8">
                        <div class="title">{{ item.courseName }}</div>
                        <div class="creatorDiv">
                            <span>分类：</span>
                            <span>{{ item. knowledgeType }}</span>
                        </div>
                        <div class="progress">
                            <div>进度：</div>
                            <div class="bar">
                                <p class="barP" :style="'width:' + item.learnRate + '%'"></p>
                            </div>
                            <div> {{ item.learnRate }}%</div>
                        </div>
                        <div class="tabDiv">
                            <a-tag v-if="item.courseDifficulty" color="purple">{{ item.courseDifficulty }}</a-tag>
                            <template v-if="item.responsibilities">
                                <a-tag v-for="items in (item.responsibilities.split(';'))" :key="items" color="pink">
                                    {{ items }}
                                </a-tag>
                            </template>
                            <template v-if="item.duties">
                                <a-tag v-for="items in (item.duties.split(';'))" :key="items" color="orange">
                                    {{ items }}
                                </a-tag>
                            </template>
                            <template v-if="item.talentClassify">
                                <a-tag v-for="items in (item.talentClassify.split(';'))" :key="items" color="cyan">
                                    {{ items }}
                                </a-tag>
                            </template>
                            <template v-if="item.workYears">
                                <a-tag v-for="items in (item.workYears.split(';'))" :key="items" color="blue">
                                    {{ items }}
                                </a-tag>
                            </template>
                            <div class="clear"></div>
                        </div>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Col, Row ,Tag} from "@h3/antd-vue";

// @@ 组件定义
@Component({
  name: 'studyCon',
  components: {
        ACol: Col,
        ARow: Row,
        ATag: Tag,
  },
})
export default class studyCon extends Vue {
    @Prop() list?: any; 

    @Prop() localHref?: any; 

    newLocalHref:any = ''

    token:any = ''

    screenSize:any = ''

    created(){
        this.token = localStorage.getItem('token');
        this.newLocalHref = this.localHref+'api/api/aliyun/download?refId='
    }

    mounted(){
    }

    goCon(item){
        let { href } = this.$router.resolve({ 
            name: 'studyView', 
            query: {
                courseName:encodeURIComponent(item.courseName),
                courseBlurb:item.courseBlurb,
                learnDuration:item.learnDuration,
                learningDuration:item.learningDuration,
                courseId:item.id,
                refId:item.appendix[0].refId,
                learnRate:item.learnRate,
                refName:encodeURIComponent(item.appendix[0].name),
            },
        });
        window.open(href,'_blank')
    }

}
</script>

<style lang="less" scoped>
.studyCon{
    width: 100%;
    padding: 10px 0;
    background: #fff;
}
/deep/.studyRow{
    display: grid;
    grid-template-columns: repeat(4, minmax(210px,1fr));
}

/deep/.studyRow::before {
    content: none;
}
/deep/.studyRow::after {
    content: none;
}
.gutter-row{
    height: 315px;
    margin-bottom: 10px;
    cursor: pointer;
}
.gutter-row > div{
    height: 315px;
    border: 1px solid #f5f3f3;
    border-radius: 5px;
    box-shadow: 0px 0px 5px #dde6f7;
    img{
        width: 100%;
        height: 130px;
        object-fit: cover;
    }
    .title{
        width:100%;
        height: 40px;
        font-size: 16px;
        color: #333;
        line-height: 20px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /* 超出几行省略 */
        overflow: hidden;
    }
    .creatorDiv{
        font-size: 12px;
        color: #999;
        display: flex;
        justify-content: left;
        margin:5px 0 2px 0;
        span:nth-child(2){
            display: inline-block;
            max-width:calc(100% - 40px);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
     .mt0{
        margin-top: 0;
     }
    .font13{
        font-size: 13px;
    }
    .progress{
        font-size: 12px;
        color: #999;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .bar{
            width: calc(100% - 73px);
            background: #e2e2e2;
            height: 10px;
            margin-top: 5px;
            .barP{
                height: 100%;
                background: #85b585;
            }
        }
    }
}
.pd8{
    padding: 8px;
}
.posR{
    position: relative;
    overflow: hidden;
}
.tj{
    position: absolute;
    left:0;
    top:0;
    width: 50px !important;
    height:50px !important;
}
.tabDiv{
    margin-top: 5px;
    .tab{
        padding: 1px 3px;
        font-size: 12px;
        float: left;
        color: #fff;
        margin: 0 3px 2px 0;
    }
    .gray{
        background: #9a8c98;
    }
    .blue{
        background: #4b4e6d;
    }
    .orange{
        background: #f79f79;
    }
    .pink{
        background: #fd7f7a;
    }
    .mauve{
        background: #8c7ae6;
    }
    .clear{
        clear: both;
    }
}
/deep/ .ant-tag {
    padding: 0 5px;
    border-radius: 2px;
    margin-bottom: 8px;
    margin-right: 6px;
}
</style>