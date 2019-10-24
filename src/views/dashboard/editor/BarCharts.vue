<template>
    <div>
        <el-row v-if="show">
            <el-col :span="22" :offset="1">
                <div  class="barCharts" id="barCharts" :style="{height:height,width:width}"></div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import echarts from 'echarts';
import {queryBarMovieShowCount} from 'api/movie/movieCharts/index.js'
require('echarts/theme/macarons'); // echarts 主题
import { debounce } from 'utils';
const animationDuration = 3000;
export default {
    name:'barCharts',
    data(){
        return{
            autoResize:true,
            data:[],
            show:true,
        }
    },
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
        initChart(){
            this.chart = echarts.init(document.getElementById('barCharts'));
            this.chart.setOption({
                title: {
                    left: 'center',
                    text: '我看过的电影类型'
                },
                grid: {left: '3%',right: '4%',bottom: '2%',containLabel: true},
                yAxis: {
                    type: 'category',
                    axisTick: {alignWithLabel: true}
                },
                xAxis: {show:false,},
                series: [{
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideLeft',
                            formatter:function(p){
                                return p.data[1]+"部"
                            },
                        }
                    },
                    itemStyle:{
                        barBorderRadius:[0, 5, 5, 0],
                    },
                    encode:{x:'type',y:'count'},
                    barWidth :'90%',
                }],
                dataset:{
                    source:[],
                },
                visualMap: {
                    show :false,
                    type: 'continuous',
                    dimension: 0,
                    inRange: {
                        color: ['#D7DA8B', '#E15457']
                    }
                },
            })
            this.chart.showLoading();
            var that=this;
            queryBarMovieShowCount(this.id).then(function(response){
                var d=['count','type'];
                response.data.unshift(d);
                that.data=response.data;
                that.chart.setOption({
                    dataset:{
                        source:that.data
                    },
                    visualMap:{
                        max:response.max
                    }
                })
            }).catch((err) => {  
                this.show=false;     
            }).finally(() => {
                that.chart.hideLoading();
            })
        }
    }
}
</script>
<style scoped>

</style>