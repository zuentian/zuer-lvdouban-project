<template>
    <div class="dict container">
        <el-card  v-loading="loading" v-show='showflag'>
            <el-row :span="24">
                <el-col>
                    <span style='font-weight:bold'>电影标签选择</span>
                </el-col>
            </el-row>
            <el-row :span="24">
                <el-col>
                    <el-radio-group v-model="checktag" :change="change()">
                        <el-radio-button v-for="tag in tags" :label="tag" :key="tag" >{{tag}}</el-radio-button>
                    </el-radio-group>
                    <el-button type="warning" icon="el-icon-refresh" @click="refreshTags()"></el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-card v-show='tableflag' v-loading="loadingForTable"  >
            <el-table :data="info"   style="width: 100%" :row-style="{height:'0'}" :cell-style="{padding:'4px'}">
                <!-- <el-table-column type="index" > </el-table-column>
                <el-table-column align="center" prop="typeName" label="网站名称" min-width='100'></el-table-column>
                <el-table-column align="center" prop="type" label="网站类型" min-width='100'></el-table-column>
                <el-table-column align="center" prop="urlName"  label="url名称" min-width='100'></el-table-column> 
                <el-table-column align="center" prop="url"  label="url地址" min-width='400' ></el-table-column>
                <el-table-column fixed="right" align="center" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="updateCrawlerUrlInfo(scope.row)"  type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteCrawlerUrlInfo(scope.row)">删除</el-button>
                </template>
                </el-table-column> -->
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
            tag:null,
            loging:true,
            loading:false,
            checktag:null,
            oldchecktags:null,
            showflag:false,
            info:null,
            loadingForTable:false,
            tableflag:false,
        }
    },
    methods:{
        get(){
            getDbMovieInfo().then(res=>{

            })
        },
        searchTags(){
            this.loading=true;
            searchTags().then(res=>{
                this.showflag=true;
                this.$notify({title: '登陆成功',message: '欢迎来到['+res.loginName+']的豆瓣空间',type: 'success'});
                
                this.tags =res.tags;
                this.oldchecktags = this.checktag;
                if(this.checktag!=null&&this.tags.includes(this.checktag)){
                }else{
                    if(res.tags.length>0){
                        //this.checktag=this.tags[0];
                    }
                }
                this.tableflag=true;
                this.loadingForTable=true;
            }).catch((err) => {      
            }).finally(() => {
                this.loading = false
            })
        },
        refreshTags(){
            this.searchTags();
        },
        change(){
            console.log("this.checktag",this.checktag)
        }
    },
    created(){
        this.searchTags();
    }
}
</script>
<style scoped>

</style>