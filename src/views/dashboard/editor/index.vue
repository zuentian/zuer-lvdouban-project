<template>
    <div class="dashboard-editor-container">
        <a href="https://github.com/zuentian/zuer-lvdouban-project" target="_blank" class="github-corner" aria-label="View source on Github">
          <svg width="80" height="80" viewBox="0 0 250 250" style="fill:#4AB7BD; color:#fff; position: absolute; top: 50px; border: 0; right: 0;"
            aria-hidden="true">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
              fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
            <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
              fill="currentColor" class="octo-body"></path>
          </svg>
		    </a>
        <el-row class="btn-group">
            <el-col :span="6">
              <el-card class="box-card">
                  <div slot="header" class="box-card-header">
                    <pan-thumb class="panThumb" :image="avatar||''"> 你的角色:
                      <div class="pan-info-roles" :key='item.key' v-for="item in roles">{{item.name}}</div>
                    </pan-thumb>
                  </div>
                  <span class="display_name">{{name}}</span>
                  <el-row>
                    <el-col :span="12">
                      <div class="info-item">
                      <span class="info-item-text" style="font-weight:bold">称号</span>
                      <icon-svg icon-class="nameBak" class="dashboard-editor-icon"></icon-svg>
                      <span>{{nameBak}}</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                        <span class="info-item-text" style="font-weight:bold">段位</span>
                        <icon-svg icon-class="level" class="dashboard-editor-icon"></icon-svg>
                        <span>{{watchAfterCount | getLevel}}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <div class="info-item">
                      <span class="info-item-text" style="font-weight:bold">标记看过</span>
                      <icon-svg icon-class="watchAfterCount" class="dashboard-editor-icon"></icon-svg>
                      <span>{{watchAfterCount}}部</span>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-item">
                      <span class="info-item-text" style="font-weight:bold">标记想看</span>
                      <icon-svg icon-class="watchBeforeCount" class="dashboard-editor-icon"></icon-svg>
                      <span>{{watchBeforeCount}}部</span>
                      </div>
                    </el-col>
                  </el-row>

                  <el-row>
                    <el-col :span="24">
                      <div class="info-item">
                      <span class="info-item-text" style="font-weight:bold">注册时间</span>
                      <icon-svg icon-class="crtDate" class="dashboard-editor-icon"></icon-svg>
                      <span>{{crtTime}}</span>
                      </div>
                    </el-col>
                  </el-row>
              </el-card>
            </el-col>
            <el-col :span="16">
                <!--钟表-->
                <clock></clock>
            </el-col>
        </el-row>

        <el-row class="btn-group">
          <!--我的观影记录 日历坐标系-->
          <el-card>
            <calendar-charts :id='userId' :crtYear='crtYear' :nowYear='nowYear'></calendar-charts>
          </el-card>
        </el-row>
        <el-row class="btn-group">
          <el-col :span="12">
            <!--我最常看的电影类型 柱状-->
            <el-card>
              <bar-charts :id='userId'></bar-charts>
            </el-card>
          </el-col>
          <el-col :span="12">
            <!--我最常看的电影年份分布 饼状图-->
            <el-card>
              <pie-charts :id='userId'></pie-charts>
            </el-card>
          </el-col>
        </el-row>
    </div>
</template>
<script>
import {mapGetters} from 'vuex';
import panThumb from 'components/PanThumb';//这个组件相当惊艳，展示头像图片，鼠标移上去会放在图片露出图片下面的内容
//import countTo from 'vue-count-to';//这个组件是数字滚动插件，暂时没有什么用处，不过可以用来表现数字上升或减少的效果
import calendarCharts from './CalendarCharts'
import barCharts from './BarCharts'
import pieCharts from './PieCharts'
import Clock from './Clock'

import {queryWatchMovieCount} from 'api/movie/movieUser/index.js'

var that;//定义一个全局变量
export default {
    data(){
      return{
        levelList:[],
        crtYear:null,
        nowYear:null,
        watchAfterCount:0,
        watchBeforeCount:0,
      }
    },
    components: { 
      panThumb,
      calendarCharts,
      Clock,
      barCharts,
      pieCharts,
    },
    created(){
      this.queryDict();
      var date=new Date();
      this.nowYear=date.getFullYear();
      if(this.crtTime!=null){
        this.crtYear=parseInt(this.crtTime.substr(0,4));
      };
      this.queryWatchMovieCount();
    },
    beforeCreate: function () {
        that = this;
    },
    filters:{
      getLevel(val){
        for(var i=0;i<that.levelList.length;i++){
          if(that.levelList[i].value>=val){
            return that.levelList[i].label;
          }
        }
      }
    },
    methods:{
      queryDict(){
        this.$store.dispatch('QueryDictByDictType',{
            dictType:'USERLEVEL'
        }).then(list=>{
          list.sort(function(a,b){
            return parseInt(a.value)-parseInt(b.value);
          })
          this.levelList=list;
        })
      },
      queryWatchMovieCount(){
        queryWatchMovieCount(this.userId).then(res=>{
          this.watchAfterCount=res.watchAfterCount;
          this.watchBeforeCount=res.watchBeforeCount;
        })
      }
    },
    computed:{
        ...mapGetters([
            'name',
            'avatar',
            'roles',
            'username',
            'nameBak',
            'level',
            'userId',
            'crtTime',
        ])
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
    margin: 30px;
    .btn-group {
        margin-bottom: 20px;
    }
    .box-card-header {
        position: relative;
        height: 160px;
    }
    .panThumb {
        z-index: 100;
        height: 150px;
        width: 150px;
        position: absolute;
        left: 0px;
        right: 0px;
        margin: auto;
    }
    .display_name{
        font-size: 30px;
        display: block;
    }
    .info-item{
        display: inline-block;
        margin-top: 10px;
        font-size: 14px;
        &:last-of-type{
            margin-left: 0px;
        }
    }
}
</style>
