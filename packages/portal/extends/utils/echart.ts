import * as echarts from 'echarts';

export default {
  pie(id: string, data: any, maps?: any, params?: any) {
    let left = '';
    let top = '';
    let center: any = [];
    switch (true) {
      case window.innerWidth >= 1600 && window.innerWidth <= 1919:
        left = '26%';
        top = '38%';
        center = ['28%', '53%'];
        break;
      case window.innerWidth >= 1440 && window.innerWidth <= 1599:
        left = '26%';
        top = '38%';
        center = ['28%', '53%'];
        break;
      case window.innerWidth >= 1280 && window.innerWidth <= 1439:
        left = '30%';
        top = '38%';
        center = ['33%', '53%'];
        break;
      case window.innerWidth >= 1920:
        left = '27%';
        top = '43%';
        center = ['28%', '53%'];
        break;
      case window.innerWidth >= 2560:
        left = '28%';
        top = '45%';
        center = ['28%', '53%'];
        break;
      default:
        break;
    }
    let chartDom: any = document.getElementById(id);
    let myChart: any = echarts.init(chartDom);
    var option;
    option = {
      tooltip: {
        trigger: 'item',
        textStyle: {
          fontSize: '0.8em',
        },
      },
      title: {
        text: params && params['text'] ? params['text'] : '', //主标题文本
        subtext: params && params['subtext'] ? params['subtext'] : '', //副标题文本
        left: left,
        top: top,
        textStyle: {
          fontSize: '2em',
          color: '#004C8F',
          // align: "center",
        },
        subtextStyle: {
          fontFamily: '微软雅黑',
          fontSize: '0.875em',
          color: '#004C8F',
        },
        x: 'center',
        textAlign: 'center',
      },
      legend: {
        itemWidth: 7,
        itemHeight: 7,
        x: 200,
        y: 'center',
        textStyle: {
          fontSize: '0.715em',
          color: '#000',
        },
      },
      series: [
        {
          name: params ? params['subtext'] : '',
          type: 'pie',
          radius: ['50%', '80%'],
          center: center,
          avoidLabelOverlap: true,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: false,
              fontSize: '1.14em',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    };
    //let option1:any = {...option, ...maps};
    let option1: any = Object.assign({}, option, maps);
    option1 && myChart.setOption(option1);
  },
};
