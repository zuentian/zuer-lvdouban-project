<template>
    <div class="dict container">
        <el-card  v-loading="loading" v-show='showflag'>
            <el-row >
                <el-col :span="22" >
                    <span style='font-weight:bold'>电影标签选择</span>
                </el-col>
                <el-col :span="2" >
                      <el-button type="warning" icon="el-icon-refresh" @click="refreshTags()"></el-button>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col>
                     <el-tabs v-model="checktag" @tab-click="handleClick">
                        <el-tab-pane :label="tag" v-for="tag in tags" :name="tag"  :key="tag"></el-tab-pane>
                    </el-tabs>
                </el-col>
                <el-col>
                    <el-radio-group v-model="sort" @change="changSort()">
                        <el-radio label='recommend'>按热度排序</el-radio>
                        <el-radio label='time'>按时间排序</el-radio>
                        <el-radio label="rank">按评价排序</el-radio>
                    </el-radio-group>
                </el-col>
            </el-row>
        </el-card>
        <el-card v-show='tableflag' v-loading="loadingForTable"  >
            <el-table :data="info"   style="width: 100%" :row-style="{height:'0'}" :cell-style="{padding:'4px'}" :row-class-name="tableRowClassName">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column align="center" prop="title" label="电影名字" min-width='150'></el-table-column>
                <el-table-column align="center" prop="rate"  label="评分" min-width='50'></el-table-column> 
                <el-table-column align="center" prop="is_new"  label="新鲜度" min-width='60'>
                    <template slot-scope="scope">
                        <el-tag effect="plain" v-if='scope.row.is_new == "true"' :type="'danger'"  :disable-transitions="false" >{{scope.row.is_new | isNewFilter}}</el-tag>
                    </template>    
                </el-table-column> 
                <el-table-column align="center" prop="playable"  label="是否可播放" min-width='80'>
                    <template slot-scope="scope">
                        <el-tag effect="plain"  v-if="scope.row.playable" :disable-transitions="false" >{{scope.row.playable | playableFilter}}</el-tag>
                        <el-tag effect="plain" :type="'info'" v-else  :disable-transitions="false" >{{scope.row.playable | playableFilter}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="base64Photo" label="海报"  min-width='100'>
                    <template slot-scope="scope">
                        <el-image  style="width: 48px; height: 72px" 
                            :src="'data:image/png;base64,'+scope.row.base64Photo"
                            :preview-src-list="['data:image/png;base64,'+scope.row.base64Photo]">
                        </el-image>
                    </template> 
                </el-table-column>  
                <el-table-column align="center" prop="url"  label="豆瓣查看地址" min-width='50'>
                    <template slot-scope="scope"  >
                        <a href='javascript:;' @click="open(scope.row.url)">
                            <icon-svg  :style="{height:30,width:30}" icon-class="lookDBMovie"></icon-svg>
                        </a>
                    </template>    
                </el-table-column> 
                <el-table-column fixed="right" align="center" label="操作" width="100">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.syncFlag=='0'" size="small">同步</el-button>
                        <el-button v-else>重新同步</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
import {getDbMovieInfo,searchTags} from 'api/crawler/dbMovieInfo/index.js'
export default {
    data(){
        return{
            tags:[],
            loging:true,
            loading:false,
            checktag:null,
            oldchecktags:null,
            showflag:false,
            info:null,
            loadingForTable:false,
            tableflag:false,
            sort:'recommend',
            type:'movie',
            page_limit:10,
            page_start:0,
        }
    },
    methods:{
        tableRowClassName({row, rowIndex}) {
            if (rowIndex %2 == 1) {
            return 'warning-row';
            } else if (rowIndex %2 == 0) {
            return 'success-row';
            }
            return '';
        },
        get(){
            this.loadingForTable=true;
            getDbMovieInfo({
                type:this.type,
                tag:this.checktag,
                page_limit:this.page_limit,
                page_start:this.page_start,
                sort:this.sort,
            }).then(res=>{
                this.info = res;
            }).finally(() => {
              this.loadingForTable = false
            })
        },
        searchTags(){
            this.loading=true;
            searchTags().then(res=>{
                this.showflag=true;
                if(res.status == 'success'){
                    this.$notify({title: '登陆成功',message: '欢迎来到['+res.loginName+']的豆瓣空间',type: 'success'});
                }else{
                    this.$notify.error({title: '登陆失败('+res.description+')',message: '切换[游客]登录豆瓣空间'});
                }
                this.tags =res.tags;
               
                if(this.checktag!=null&&this.tags.includes(this.checktag)){

                }else{
                    if(res.tags.length>0){
                        this.checktag=this.tags[0];
                    }
                }
                if(this.checktag != this.oldchecktags){//这次点击的和上一次点击是同一个，则不用刷新页面
                    this.oldchecktags = this.checktag;
                    this.get();
                }
                this.oldchecktags = this.checktag;
                this.tableflag = true;
            }).catch((err) => {      
            }).finally(() => {
                this.loading = false
            })
        },
        refreshTags(){
            this.searchTags();
        },
        handleClick(tab, event){
            if(this.checktag != this.oldchecktags){//这次点击的和上一次点击是同一个，则不用刷新页面
                this.oldchecktags = this.checktag;
                this.get();
            }
        },
        open(url){
            window.open(url, '_blank');
        },
        changSort(){
            this.get();
        },
        sycnFlag(id){
            console.log(id);
        }
    },
    created(){
        this.searchTags();
    },
    filters:{
      isNewFilter(val){
        if(val == "true"){
            return "新";
        }else{
            return "";
        }
      },
      playableFilter(val){
          if(val == "true"){
              return "可播放";
          }else{
              return "不可播放"
          }
      },
    },
}
</script>
<!-->>>这个符号可以穿透加样式，不用去掉scoped -->
<style scoped>
    .el-table >>> .warning-row { 
        background: oldlace;
    }

    .el-table >>> .success-row {
        background: #f0f9eb;
    }
</style>