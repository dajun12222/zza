<template>
  <div class="index">
    <div class="lie left_pie">
      <div
        v-for="(item, index) in echartsData.type"
        :key="index"
        class="unitRank"
      >
        <el-block-bg :title="echartsData.title[index]" :year="false">
          <div class="echartsDiv"></div>
        </el-block-bg>
      </div>
    </div>
    <div></div>
    <div class="lie">
      <!-- <div class="unitRank ">
            <el-block-bg title="审计单位人才情况">
                <div class="chooseDiv">
                    <p class="numCount">共 {{total}} 条记录</p>
                    <div class="status">
                        <div class="normal">正常</div>
                        <div class="unsaturation">不饱和</div>
                        <div class="standard">超标</div>
                    </div>
                </div>
                <tableTemplate @getTotal='getTotal'/>
            </el-block-bg>
        </div> -->
      <tableTemplate />
    </div>
  </div>
</template>
<script lang="ts">
import { Col, Spin, Select, Table } from '@h3/antd-vue';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import tableList from '@/../extends/views/echarts/components/table.vue';
import blockBg from '@/../extends/components/maps/blockBg.vue';
import tableTemplate from '@/../extends/views/echarts/table/people.vue';
import axios from 'axios';
import api from '@/../extends/api';
import * as echarts from 'echarts';
// import Divider from "../../../../../admin/src/views/print-template/center-panel/divider.vue";
const qs = require('qs');

@Component({
  name: 'people',
  components: {
    ACol: Col,
    ASpin: Spin,
    ASelect: Select,
    ASelectOption: Select.Option,
    ATable: Table,
    tableList,
    elBlockBg: blockBg,
    tableTemplate,
  },
})
export default class people extends Vue {
  colors: any = [
    '#6F83F5',
    '#B58EF9',
    '#0DA8F6',
    '#5DD5D7',
    '#12C680',
    '#61BEFF',
    '#019EFF',
    '#3C87FB',
  ];

  spinning: false;

  tableColumns: any = [
    {
      title: '序号',
      customRender: (text, record, index) => `${index + 1}`,
      width: '60px',
    },
    {
      title: '审计单位',
      dataIndex: 'courseName',
      key: 'courseName',
      ellipsis: true,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = value;
        } else {
          obj = '-';
        }
        return obj;
      },
    },
    {
      title: '审计人员',
      dataIndex: 'updateTime',
      key: 'updateTime',
      ellipsis: true,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = value;
        } else {
          obj = '-';
        }
        return obj;
      },
    },
    {
      title: '职业证书数',
      dataIndex: 'enabled',
      key: 'enabled',
      ellipsis: true,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = '发布';
        } else {
          obj = '未发布';
        }
        return obj;
      },
    },
    {
      title: '职业人才占比',
      dataIndex: 'questionsCount',
      key: 'questionsCount',
      ellipsis: true,
      customRender: (value, row, index) => {
        let obj = '';
        if (value) {
          obj = value;
        } else {
          obj = '-';
        }
        return obj;
      },
    },
    {
      title: '本科及以上学占比',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    },
  ];

  tableData: any = {
    columns: [
      {
        title: '序号',
        customRender: (text, record, index) => `${index + 1}`,
        width: '60px',
        align: 'center',
      },
      {
        title: '审计单位',
        dataIndex: 'unitName',
        key: 'unitName',
        ellipsis: true,
        customRender: (value, row, index) => {
          let obj = '';
          if (value) {
            obj = value;
          } else {
            obj = '-';
          }
          return obj;
        },
        align: 'center',
      },
      {
        title: '审计人员',
        dataIndex: 'talentCounts',
        key: 'talentCounts',
        ellipsis: true,
        customRender: (value, row, index) => {
          let obj = '';
          if (value) {
            obj = value;
          } else {
            obj = '-';
          }
          return obj;
        },
        width: '120px',
        align: 'center',
      },
      {
        title: '职业证书数',
        dataIndex: 'certificateCounts',
        key: 'certificateCounts',
        ellipsis: true,
        width: '120px',
        align: 'center',
      },
      {
        title: '职业人才占比',
        dataIndex: 'occupationTalentProportion',
        key: 'occupationTalentProportion',
        ellipsis: true,
        customRender: (value, row, index) => {
          let obj = '';
          if (value) {
            obj = value;
          } else {
            obj = '-';
          }
          return obj;
        },
        width: '120px',
        align: 'center',
      },
      {
        title: '本科及以上学历占比',
        dataIndex: 'degreeProportion',
        key: 'degreeProportion',
        align: 'center',
        width: '150px',
      },
    ],
    data: {},
  };

  total: any = '';

  echartsData: any = {
    type: ['pie', 'pie', 'bar'],
    radius: ['array', '', ''],
    title: ['内外人才占比', '审计单位人才学历分布', '审计单位职业证书分布'],
    data: [],
    color: [
      [
        '#6F83F5',
        '#B58EF9',
        '#0DA8F6',
        '#5DD5D7',
        '#12C680',
        '#61BEFF',
        '#019EFF',
        '#3C87FB',
      ],
      [
        '#6F83F5',
        '#B58EF9',
        '#0DA8F6',
        '#5DD5D7',
        '#12C680',
        '#61BEFF',
        '#019EFF',
        '#3C87FB',
      ],
      [
        '#6F83F5',
        '#B58EF9',
        '#0DA8F6',
        '#5DD5D7',
        '#12C680',
        '#61BEFF',
        '#019EFF',
        '#3C87FB',
      ],
    ],
  };

  talentProportionList: any = [];

  async mounted() {
    await this.talentResourceCounts();
    // await this.auditTalentInfo();
  }

  async talentResourceCounts() {
    let arr = ['', '内部'];
    let option = {};
    let res: any = {};
    for (let i = 0; i < arr.length; i++) {
      option = qs.stringify({
        type: arr[i],
      });
      res = await api.talentResourceCounts(option);
      if (res.code === '00000') {
        if (arr[i] === '') {
          this.echartsData.data[0] = this.arrList(
            res.data.talentProportionList,
          );
        } else {
          this.echartsData.data[1] = this.arrList(
            res.data.educationProportionList,
          );
          this.echartsData.data[2] = res.data.talentTagsMap;
        }
      }
    }
    this.init(this.echartsData);
  }

  init(params: any) {
    console.log(params);

    let chartDom: any = document.getElementsByClassName('echartsDiv');
    let center: any = ['28%', '50%'];
    let left = '26%';
    switch (true) {
      case window.innerWidth >= 1280 && window.innerWidth <= 1439:
        center = ['33%', '50%'];
        left = '30%'
        break;
      default:
        break;
    }
    for (var i = 0; i < chartDom.length; i++) {
      let myChart: any = echarts.init(chartDom[i] as HTMLElement);
      let option: any = {
        legend: {
          orient: 'vertical',
          x: 'right', //可设定图例在左、右、居中
          y: 'center',
          itemWidth: 7, // 图例标记的图形宽度
          itemHeight: 7,
          align: 'left',
          padding: [0, 15, 20, 0],
          //图例中文字的样式
          textStyle: {
            fontSize: '0.715em',

            fontStyle: 'nomal',
            color: '#000', //文字的颜色
            // fontSize: 20, //文字的字号
            // lineHeight: 12, //行高
          },
        },
        color: params.color[i],
      };
      if (params.type[i] === 'bar') {
        option['legend'] = {
          show: false,
        };
        option['tooltip'] = {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (list) {
            console.log(list[0].value);
            let nameVal = list[0].name + ':' + list[0].value;
            // let nameVal = '人才数量:';
            // let relVal = "";
            // let numCount = 0;
            // console.log()
            // for (let i = 0, l = list.length; i < l; i++) {
            //     console.log(list[i])
            //     if (list[i].value) {
            //         nameVal += list[i].seriesName
            //         numCount += Number(list[i].value);
            //         relVal +=  list[i].seriesName + ':' + list[i].value + '&nbsp'
            //     }
            // }
            return nameVal;
          }, // 让为0的值不显示
        };
        option['grid'] = {
          left: '4%',
          right: '4%',
          bottom: '3%',
          top: '8%',
          containLabel: true,
        };
        option['yAxis'] = {
          name: '人数',
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#666', //坐标轴字体颜色
            },
          },
          nameTextStyle: {
            //纵坐标单位文字
            //字体样式
            color: '#666',
          },
        };
        option['xAxis'] = {
          name: '职业证书',
          type: 'category',
          nameLocation: 'center',
          nameGap: 25,
          data: Object.keys(params.data[i]),
          axisLabel: {
            textStyle: {
              fontSize: '0.715em',
              color: '#666', //坐标轴字体颜色
            },
          },
          nameTextStyle: {
            //纵坐标单位文字
            //字体样式
            color: '#666',
          },
        };
        option['series'] = [
          {
            name: '内部人才',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
            },
            emphasis: {
              focus: 'series',
            },
            data: Object.values(params.data[i]),
          },
        ];
      } else if (params.type[i] === 'pie') {
        let dataNum = 0;
        params.data[i].forEach((e) => {
          dataNum += e.value;
        });
        option['tooltip'] = {
          trigger: 'item',
          formatter: params.title[i] + '<br/>{b} : {c} ({d}%)',
        };
        if (params.radius[i] === 'array') {
          option['title'] = {
            text: dataNum, //主标题文本
            subtext: '审计人员', //副标题文本
            left: left,
            top: '33%',
            textStyle: {
              fontSize: '1.14em',
              color: '#004C8F',
              // align: "center",
            },
            subtextStyle: {
              fontFamily: '微软雅黑',
              fontSize: '1em',
              color: '#004C8F',
            },
            x: 'center',
            textAlign: 'center',
          };
        }
        option['series'] = [
          {
            type: 'pie',
            center: center,
            radius: params.radius[i] === 'array' ? ['46%', '78%'] : '78%',
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
              normal: {
                show: false,
                textStyle: {
                  color: '#red',
                },
              },
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            labelLine: {
              show: false,
              length: 10,
            },
            data: params.data[i],
          },
        ];
      } else if (params.type[i] === 'line') {
        option.legend.y = 'top';
        option['tooltip'] = {
          trigger: 'axis',
        };
        option['grid'] = {
          left: '3%',
          right: '4%',
          bottom: '5%',
          containLabel: true,
        };
        option['yAxis'] = {
          type: 'value',
          axisLine: {
            show: true, //隐藏X轴轴线
            lineStyle: {
              color: '#163a5f',
              width: 1,
            },
          },
        };
        option['xAxis'] = {
          type: 'category',
          data: [
            '1月',
            '2月',
            '3月',
            '4月',
            '5月',
            '6月',
            '7月',
            '8月',
            '9月',
            '10月',
            '11月',
            '12月',
          ],
          axisLine: {
            show: true, //隐藏X轴轴线
            lineStyle: {
              color: '#163a5f',
              width: 1,
            },
          },
        };
        option['series'] = [
          {
            name: '今年',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: '去年',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310],
          },
        ];
      }
      option && myChart.setOption(option);
    }
  }

  arrList(params: any) {
    let arr = params.map((item) => {
      return {
        name: item.type,
        value: Number(item.count),
      };
    });
    return arr;
  }
  // async auditTalentInfo(){
  //     let option = qs.stringify({
  //         page : 1,
  //         size: 15
  //     })
  //     const res:any = await api.auditTalentInfo(option);
  //     if(res.code === '00000'){
  //         this.tableData.data = res.data;
  //         this.total = res.data.total
  //     }
  // }
}
</script>
<style lang="less" scoped>
.unitRank {
  width: 100%;
  position: relative;
}

.index {
  display: grid;
  grid-template-columns: 25% 1% 74%;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .left_pie {
    > div {
      height: 30%;
      margin-bottom: 2%;
    }
  }
  .echartsDiv {
    height: 80%;
    width: 93%;
    margin: auto;
  }
  // .lie {
  //   height: calc(100% - 130px);
  // }
  .chooseDiv {
    display: flex;
    justify-content: space-between;
    color: rgb(46, 85, 241);
    margin: 30px 5px 10px 0.775rem;
  }
  .numCount {
    font-size: 14px;
    line-height: 32px;
  }
  .status {
    display: flex;
  }
  .normal,
  .standard,
  .unsaturation {
    position: relative;
    margin-right: 45px;
  }
  .normal:after,
  .standard:after,
  .unsaturation:after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    left: -16px;
    top: 4px;
    background: rgba(95, 126, 222);
  }
  .standard:after {
    background: rgba(186, 0, 33);
  }
  .unsaturation:after {
    background: rgba(192, 136, 61);
  }
  .ant-table-wrapper {
    margin: 0 5px 20px 0.775rem;
  }
  /deep/.ant-table-thead > tr > th {
    padding: 8px;
    background: rgb(237, 240, 249);
    color: #296fff;
  }
  // .echartsDiv {
  //   margin-top: 15px;
  // }
}
.ant-pagination {
  color: #000;
  /deep/ .ant-pagination-total-text {
    color: #000;
  }
}
</style>
