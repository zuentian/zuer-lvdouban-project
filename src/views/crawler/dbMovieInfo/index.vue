<template>
    <div class="dict container">
        <el-card  v-loading="loading" v-show='showflag'>
            <el-row >
                <el-col :span="20" >
                    <span style='font-weight:bold'>电影标签选择</span>
                </el-col>
                <el-col :span="4" >
                      <el-button type="warning" icon="el-icon-refresh" @click="refreshTags()"></el-button>
                      <el-button type="success" icon="el-icon-upload" @click="syncBatch()">批量同步</el-button>
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
            <el-table :data="info"   style="width: 100%" :row-style="{height:'0'}" :cell-style="{padding:'4px'}" :row-class-name="tableRowClassName" ref="multipleTable"  @selection-change="handleSelectionChange">
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
            <div v-show="isShowPagination" class="block" text-align="center">
                <el-button :disabled="currentPage<=1" @click="backPage()"><i class="el-icon-arrow-left"></i>上一页</el-button>
                <span>第{{currentPage}}页</span>
                <el-button :disabled='maxPageFlag' @click="goPage()">下一页<i class="el-icon-arrow-right"></i></el-button>
            </div>
        </el-card>
    </div>
</template>
<script>
import {getDbMovieInfo,searchTags,syncBatch} from 'api/crawler/dbMovieInfo/index.js'
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
            multipleSelection: [],
            currentPage:1,
            pageSize:10,
            maxPageFlag:false,
            isShowPagination:false,
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
                if(res!=null){
                    this.info = res;
                    this.isShowPagination = true;
                }else{
                    this.maxPageFlag = true;//达到最大页数
                    this.$message({type: 'warning',message: '没有更多数据'});       
                }
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
                    this.rollPage();
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
                this.rollPage();
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
        },
        handleSelectionChange(val){
            this.multipleSelection = val.map(item=>{
                var o=new Object();
                o.id = item.id;
                o.url = item.url;
                return o;
            });
        },
        syncBatch(){//批量同步
            var len = this.multipleSelection.length;
            if(len>0){
                this.$confirm('此操作将, 是否继续?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'
                    }).then(() => {
                        syncBatch(this.multipleSelection).then(res=>{
                            this.$message({type: 'success',message: '已批量同步'});      
                        })
                    }).catch(() => {
                        this.$message({type: 'info',message: '批量同步异常'});          
                    });
            }else{
                this.$alert('未选择同步内容', '提醒', {confirmButtonText: '确定',});
            }
        },
        backPage(){
            this.currentPage--;
            this.page_start=this.page_limit*(this.currentPage-1)+1;
            this.get();
        },
        goPage(){
            this.currentPage++;
            this.page_start=this.page_limit*(this.currentPage-1)+1;
            this.get();
        },
        rollPage(){//页数回退初识值
            this.page_limit=10;
            this.page_start=0;
            this.currentPage=1;
            this.pageSize=10;
            this.maxPageFlag=false;
            this.isShowPagination=false;
        },
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
    .block{
        margin:20px auto;
        text-align:center;
    }
</style>