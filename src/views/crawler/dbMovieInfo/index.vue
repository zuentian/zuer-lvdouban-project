<template>
    <div class="dict container">
        <el-card  v-loading="loading">
            <el-row>
                <span>电影标签选择</span>
            </el-row>
            <el-row>
                <button v-for="tag in tags" :key="tag" @click="link(tag)">tag</button>
            </el-row>
        </el-card>
        <el-button  type="primary" v-waves icon="el-icon-search" class="filter-item" @click="get()">获取豆瓣电影名单</el-button>
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
                this.tags =res.tags;
            }).catch((err) => {      
            }).finally(() => {
                this.loading = false
            })
        },
        link(db){
            alert(db);
        }
    },
    created(){
        this.searchTags();
    }
}
</script>
<style scoped>

</style>