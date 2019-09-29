<template>
    <div class="movieDetail container">
        <el-card>
            <div>
                <h1> <strong>{{movieInfo.movieName}}({{titleMovieYear}}) </strong></h1>
            </div>
            <el-row>
                <el-col :span="12">
                    <div>
                        <strong>电影名字：</strong>
                        <span >{{movieOtherName}}</span>
                    </div>
                    <div>
                        <strong>制片国家/地区：</strong>
                        <span >{{movieCountrys}}</span>
                    </div>
                    <div>
                        <strong>电影类型：</strong>
                        <span>{{movieTypes}}</span>
                    </div>
                    <div>
                        <strong>上映时间：</strong>
                        <span >{{movieInfo.movieShowTime}}</span>
                    </div>
                    <div>
                        <strong>片长：</strong>
                        <span >{{movieInfo.movieTime}}分钟</span>
                    </div>
                </el-col>
                <el-col :span="1">
                    <el-divider direction="vertical"></el-divider>
                </el-col>
                <el-col :span="10">
                    <span>豆瓣评分</span>
                    <el-row>
                        <el-col :span="12" v-if='movieInfo.score>0'>
                            {{movieInfo.score}}
                        </el-col >
                        <el-col :span="12">
                            <el-rate v-model="movieInfo.score" disabled  text-color="#ff9900" ></el-rate>
                        </el-col>
                    </el-row>
                    <div v-if='showNoScore==true'>暂无评分</div>
                    <div v-if='showScore==true'></div>
                    <div v-if='showNoTime==true'>暂未上映</div>
                </el-col>
            </el-row>

        </el-card>
        <el-card>
            

        </el-card>

        <el-card >
            <h3>{{movieInfo.movieName}}的剧情简介 · · · · · ·</h3>
            <span>
                {{movieInfo.movieDescription}}
            </span>
        </el-card>
        <el-card >
            <h3>{{movieInfo.movieName}}的相关人物  · · · · · ·</h3>
            <el-row>
                <el-col :span="3" v-for="(movieRelName, index) in movieRelNameList" :key="movieRelName.key" :offset="index > 0 ?1 : 0">
                    <el-card :body-style="{ padding: '0px' }">
                        <!-- <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image"> -->
                        <div style="text-align:center">
                            <span>{{movieRelName.name}}</span>
                            
                        </div>
                        <div style="text-align:center;color:#909399">
                            <span color="#909399">演员</span>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
        <el-card >
            <h3>{{movieInfo.movieName}}的短评 · · · · · ·</h3>
        </el-card>

    </div>
</template>
<script>
import {queryMovieInfoById} from 'api/movie/movieInfo/index.js';

export default {
    data(){
        return{
            movieInfo:{
                movieName:'',
                movieDescription:'',
                score:0,
            },
            titleMovieYear:'',
            movieOtherName:'',
            movieRelNameList:'',
            movieCountrys:'',
            movieTypes:'',
            rondomColor:'',
            optionsFromMovieCountry:'',
            showNoScore:true,
            showScore:false,
            showNoTime:false,
        }
    },
    methods:{
        queryMovie(id){
            queryMovieInfoById(id).then(res=>{
                this.movieInfo=res.movieInfo;
                this.movieRelNameList=res.movieRelNameList;
                var date = new Date(res.movieShowTime);
                this.titleMovieYear=date.getFullYear();
                var dateNow=new Date();
                if(date>dateNow){//上映时间如果大于今天，就展示暂无上映的评分
                    this.showNoScore=false;
                    this.showNoTime=true;
                }
                this.movieOtherName=this.movieInfo.movieName;
                if(this.movieInfo.movieName1!=null&&this.movieInfo.movieName1!=''&&this.movieInfo.movieName1!==undefined){
                    this.movieOtherName=this.movieOtherName+" / "+ this.movieInfo.movieName1;
                }
                if(this.movieInfo.movieName2!=null&&this.movieInfo.movieName2!=''&&this.movieInfo.movieName2!==undefined){
                    this.movieOtherName=this.movieOtherName+" / "+ this.movieInfo.movieName2;
                }
                if(res.movieCountryList){
                    for(var i=0;i<res.movieCountryList.length;i++){
                        if(i==0){
                            this.movieCountrys=this.movieCountrys+this.getMovieCountry(res.movieCountryList[i].countryCode);
                        }else{
                            this.movieCountrys=this.movieCountrys+" / "+this.getMovieCountry(res.movieCountryList[i].countryCode);
                        }
                    }
                }
                if(res.movieTypeList){
                    for(var i=0;i<res.movieTypeList.length;i++){
                        if(i==0){
                            this.movieTypes=this.movieTypes+res.movieTypeList[i].type;
                        }else{
                            this.movieTypes=this.movieTypes+" / "+res.movieTypeList[i].type;
                        }
                    }
                }
            })
        },
        getMovieCountry(code){
            for(var i=0;i<this.optionsFromMovieCountry.length;i++){
                if(code==this.optionsFromMovieCountry[i].value){
                    return this.optionsFromMovieCountry[i].label;
                }
            }
        },
        async queryDict(){
            await this.$store.dispatch('QueryDictByDictType',{
                dictType:'MOVIECOUNTRY'
            }).then(list=>{
                    this.optionsFromMovieCountry=list;
                }
            )
        },
    },
    created(){
        this.queryDict();
        this.queryMovie(this.$route.params.id);
    }
}
</script>
<style scoped>

</style>