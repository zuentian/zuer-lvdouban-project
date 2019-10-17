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
      }
    },
    data() {
      return {
        chart: null
      };
    },
    mounted() {
      this.initChart();
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
            this.chart = echarts.init(this.$el, 'macarons');//$el指向当前组件的DOM元素
            this.chart.setOption({
                title: {
                    top: 30,
                    left: 'left',
                    text: '我的观影记录'
                },
                tooltip : {},
                visualMap: {
                    min: 0,
                    max: 10000,
                    type: 'piecewise',
                    orient: 'horizontal',
                    left: 'center',
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
                    range: '2016',
                    itemStyle: {
                        normal: {borderWidth: 0.5}
                    },
                    dayLabel:{
                        nameMap: ['日', '', '二', '', '四', '', '六'],
                    },
                    monthLabel: {
                        nameMap: 'cn'
                    },
                    yearLabel: {position: "top"}
                },
                series: {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: ""
                }
            })
            this.chart.showLoading();
            queryCalendarMovieShowCount({
                id:this.id,
                year:this.year
            }).then(function(response){
                this.chart.setOption({
                    calendar:{
                        range:'',
                    },
                    series:[{
                        data:"",
                    }]
                })
            }).catch((err) => {       
            }).finally(() => {
                this.chart.hideLoading();
            })
        },
        getVirtulData(year) {
            year = year || '2017';
            var date = +echarts.number.parseDate(year + '-01-01');
            var end = +echarts.number.parseDate((+year + 1) + '-01-01');
            var dayTime = 3600 * 24 * 1000;
            var data = [];
            for (var time = date; time < end; time += dayTime) {
                data.push([
                    echarts.format.formatTime('yyyy-MM-dd', time),
                    Math.floor(Math.random() * 10000)
                ]);
            }
            console.log("data",data)
            return data;
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