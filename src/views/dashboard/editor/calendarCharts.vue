<template>
  <div class="charts" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts';
import {queryCalendarMovieShowCount} from 'api/movie/movieCharts/index.js'
require('echarts/theme/macarons'); // echarts 主题
const animationDuration = 3000;
export default {
    name: 'charts',//这个name在charts里面特别重要，对应div里class
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '300px'
      },
      id:{
          type:String,
      },
      year:{
          type:Number,
      },
      autoResize: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        chart: null
      };
    },
    mounted() {
      this.initChart();
      if (this.autoResize) {
        this.__resizeHanlder = debounce(() => {
          if (this.chart) {
            this.chart.resize()
          }
        }, 100)
        window.addEventListener('resize', this.__resizeHanlder)
      }
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      this.chart.dispose();
      this.chart = null;
    },
    methods: {
        initChart() {
            this.chart = echarts.init(this.$el);//$el指向当前组件的DOM元素
            this.chart.setOption({
                title: {
                    top: 30,
                    left: 'left',
                    text: '我的观影记录'
                },
                tooltip : {},
                visualMap: {
                    splitNumber:3,
                    pieces: [
                        {gt: 0, lte: 1,label: '少'}, // 不指定 max，表示 max 为无限大（Infinity）。
                        {gt: 1, lte: 2,label: '中'},
                        {gt: 2,label: '多'},
                    ],
                    type: 'piecewise',
                    orient: 'horizontal',
                    left: 'left',
                    top: 65,
                    textStyle: {
                        color: '#000'
                    }
                },
                calendar: {
                    top: 150,
                    left: 50,
                    right: 30,
                    cellSize: ['auto', 13],
                    range: this.year,
                    itemStyle: {
                        normal: {borderWidth: 0.5}
                    },
                    orient :'horizontal',
                    dayLabel:{
                        nameMap: ['日', '', '二', '', '四', '', '六'],
                    },
                    monthLabel: {
                        nameMap: 'cn',
                    },
                    yearLabel: {position: "top"}
                },
                series: {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: null
                }
            })
            this.chart.showLoading();
            var that=this;
            queryCalendarMovieShowCount({
                id:this.id,
                year:this.year
            }).then(function(response){
                console.log("response",response)
                that.chart.setOption({
                    series:{
                        type: 'heatmap',
                        coordinateSystem: 'calendar',
                        data:response
                    }
                })
            }).catch((err) => {       
            }).finally(() => {
                that.chart.hideLoading();
            })
        }
    }
}
</script>

<style scoped>
/* .echartsShow{
    margin:50px auto;
    text-align:center;
    width:50%;
} */
</style>