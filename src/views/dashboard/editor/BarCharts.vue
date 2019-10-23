<template>
    <div>
        <el-row >
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
                      left: 'left',
                      text: '我最爱看的电影类型'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '2%',
                    containLabel: true
                },
                yAxis: {
                    type: 'category',
                    // data: ['巴西','印尼','美国','印度','中国','世界人口(万)'],
                    // axisTick: {
                    //     alignWithLabel: true
                    // }
                },
                xAxis: {
                    show:false,
                },
                //color:['#f9c603','#e0b616'],
                series: [{
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideLeft'
                        }
                    },
                    itemStyle:{
                        barBorderRadius:[0, 5, 5, 0],
                    },
                    encode:{
                        x:'count',
                        y:'type'
                    },
                    barWidth :'90%',
                    //data: [18203, 23489, 29034, 104970, 131744, 630230]
                }],
                dataset:{
                    source:[
                        ['count','type'],
                        ['100','恐怖'],
                        ['200','爱情'],
                        ['900','科幻'],
                        ['400','动画'],
                        ['10','冒险'],
                        ['800','战争'],
                        ['700','家庭'],
                        ['200','动作'],
                    ]
                },
                visualMap: {
                    show :false,
                    type: 'continuous',
                    min: 10,
                    max: 1000,
                    inRange: {
                        color: ['#D1DA8B', '#115457']
                    }
                },
            })
            this.chart.showLoading();
            var that=this;
            queryBarMovieShowCount(this.id).then(function(response){
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

</style>