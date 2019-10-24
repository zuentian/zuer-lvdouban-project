<template>
  <div>
    <el-row v-if='show'>
      <el-col :span="1">
        <div @click="upYear()">
          <icon-svg  v-if='year<nowYear' icon-class="left-charts" :style="{height:height,width:width}"></icon-svg>
          <icon-svg  v-else icon-class="left-charts-no-select" :style="{height:height,width:width}" ></icon-svg>
        </div>
      </el-col>
      <el-col :span="22">
        <div class="charts" id="charts" :style="{height:height,width:width}"></div>
      </el-col>
      <el-col :span="1">
        <div v-on:click="downYear()">
          <icon-svg v-if='year>crtYear' icon-class="right-charts" :style="{height:height,width:width}"></icon-svg>
          <icon-svg v-else icon-class="right-charts-no-select" :style="{height:height,width:width}"></icon-svg>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts';
import {queryCalendarMovieShowCount} from 'api/movie/movieCharts/index.js'
require('echarts/theme/macarons'); // echarts 主题
import { debounce } from 'utils';
const animationDuration = 3000;
export default {
    name: 'charts',//这个name在charts里面特别重要，对应div里class
    props: {
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
      crtYear:{
          type:Number,
      },
      nowYear:{
          type:Number,
      },
      autoResize: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        chart: null,
        year:null,
        show:true,
      };
    },
    created(){
      this.year=this.nowYear;
    },
    mounted() {
      this.initChart();
      if (this.autoResize) {
        this.__resizeHanlder = debounce(() => {//dom的拖拽
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
            this.chart = echarts.init(document.getElementById('charts'));//this.$el指向当前组件的DOM元素
            this.chart.setOption({
                title: {
                      top: 30,
                      left: 'left',
                      text: '我的观影记录('+(this.crtYear==this.nowYear?this.crtYear:(this.crtYear+'-'+this.nowYear))+'年间)'
                },
                tooltip : {
                  position:'top',
                  formatter:function(p){
                    var format=echarts.format.formatTime('yyyy-MM-dd',p.data[0]);
                    return format+': '+p.data[1]+"部";
                  }
                },
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
                    yearLabel: {
                      position: "top",
                      color:["#35ea14"]
                    }
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
                that.chart.setOption({
                    series:{
                        type: 'heatmap',
                        coordinateSystem: 'calendar',
                        data:response
                    }
                })
            }).catch((err) => { 
                this.show=false;        
            }).finally(() => {
                that.chart.hideLoading();
            })
        },
        upYear(){
          this.year=this.year+1;
          this.initChart();
        },
        downYear(){
          this.year=this.year-1;
          this.initChart();
        },
    }
}
</script>

<style scoped>
/* .charts{
    margin:50px auto;
    text-align:center;
    width:50%;
} */
</style>