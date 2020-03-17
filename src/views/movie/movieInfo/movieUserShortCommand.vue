<template>
    <div >
        <h3>{{movieName}}的短评 · · · · · ·(全部{{shortCommandInfo.length}}条)</h3>
        <el-divider></el-divider>

        <div v-for='item in shortCommandInfo' :key="item.key" >
            <el-row :gutter="5">
                <el-col :span="2">
                    <el-image style="width: 50px; height:50px"  :src="item.avatar" fit='contain'></el-image>
                </el-col>
                <el-col :span="18">
                    <el-row>
                        <el-col :span="2"><span style="color:#ef1018;font-weight:bold">{{item.name}}</span></el-col>
                        <el-col :span="2"><span style="font-weight:bold">{{item.state| getState}}</span></el-col>
                        <el-col :span="4"><el-rate v-model="item.score" disabled ></el-rate></el-col>
                        <el-col :span="4" style="font-weight:bold">{{item.watchAfterTime}}</el-col>
                    </el-row>
                    <el-row style='margin-top:15px;'>
                        <span>{{item.shortCommand}}</span>
                    </el-row>
                    
                </el-col>
            </el-row>
            <el-divider></el-divider>
        </div>


    </div>
</template>
<script>
import {queryShortCommandByMovieId} from 'api/movie/movieUser/index.js'
export default {
    data(){
        return{
            shortCommandInfo:[],
        }
    },
    created(){
        this.queryList();
    },
    filters:{
        getState:function(val){
            if(val==2){
                return "看过"
            }
            if(val==1){
                return "想看"
            }
        }
    },
    methods:{
        //暂时不分页，全部展示出来
        queryList(){
            queryShortCommandByMovieId({
                movieId:this.movieId
            }).then(res=>{
                this.shortCommandInfo=res;
            })
        }
    },
    props:{
        movieId:{
            type:String,
            required:true,
        },
        movieName:{
            type:String,
            required:true,
        }
    }
}
</script>
<style scoped>

</style>