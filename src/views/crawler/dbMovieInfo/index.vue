<template>
    <div class="dict container">
        <el-card>
            <el-row>
                <el-col :span="1">
                    <span style="margin:5px 0;float:right">标签：</span>
                </el-col>
                <el-col  :span="4" >
                    <el-select v-model="tag" clearable  filterable placeholder="请选择" size="small">
                        <el-option v-for="item in tags" :key="item.value" :label="item.label" :value="item.label" > </el-option>
                    </el-select>
                </el-col>
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
        }
    },
    methods:{
        get(){
            getDbMovieInfo().then(res=>{

            })
        },
        searchTags(){
            searchTags().then(res=>{
                console.log(res);
                tags = res.tags;
            })
        },
    },
    created(){
        this.searchTags();
    }
}
</script>
<style scoped>

</style>