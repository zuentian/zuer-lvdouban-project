<template>
    <div>
        <el-row v-if="show">
            <el-col :span="23">
                <div  class="pieCharts" id="pieCharts" :style="{height:height,width:width}"></div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import echarts from 'echarts';
import {queryPieShowMovieYearCount} from 'api/movie/movieCharts/index.js'
import { debounce } from 'utils';
const animationDuration = 3000;
export default {
    name:'pieCharts',
    data(){
        return {
            autoResize:true, 
            show:true,
        }
    },
    props:{
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
    methods:{
        initChart(){
            this.chart = echarts.init(document.getElementById('pieCharts'));
            this.chart.setOption({
                title: {
                    left: 'center',
                    text: '我看过的电影年份分布'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a}<br/>{b}占比:{d}%"
                },
                series : [{
                    name: '年份分布',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[],
                    label: {
                        normal: {
                            formatter: '{a|{b}} \n{hr|}\n {b|{c}部 } ',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                                a: {
                                    color: '#999',
                                    padding: [3, 20],
                                    lineHeight: 22,
                                    fontSize: 16,
                                    align: 'center'
                                },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    align: 'center',
                                    fontSize: 16,
                                    fontWeight:'bolder',
                                    lineHeight: 33
                                },
                                // per: {
                                //     color: '#eee',
                                //     backgroundColor: '#334455',
                                //     padding: [2, 4],
                                //     borderRadius: 2
                                // }
                            }
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            })
            this.chart.showLoading();
            var that=this;
            queryPieShowMovieYearCount(this.id).then(function(response){
                that.chart.setOption({
                    series:[{
                        data:response
                    }]
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