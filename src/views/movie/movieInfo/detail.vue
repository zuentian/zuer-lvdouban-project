<template>
    <div class="movieDetail container">
        <el-card>
            <div>
                <h1> <strong>{{movieInfo.movieName}}({{titleMovieYear}}) </strong></h1>
            </div>
            <el-row>
                <el-col :span="4" >
                    <div >
                        <el-image style="width: 150px; height: 200px" :src="moviePictureBill">
                            <div slot="error" class="image-slot">
                                <div class='img' v-if="movieInfoBill_btn_edit">
                                    <span class="dot" style="color:red" @click="upLoadBill()">上传海报</span>
                                </div>
                                <div class='img' v-else>
                                    <span class="dot">暂无海报</span>
                                </div>
                            </div>
                        </el-image>
                    </div>
                    <div style="width:150px" >
                        <span v-if="movieInfoBill_btn_edit" style="color:red;display:block;text-align: center;" @click="upLoadBill()">编辑海报</span>
                    </div>
                </el-col>
                <el-col :span="10">
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
                <el-col :span="1" >
                    <el-divider direction="vertical"></el-divider>
                </el-col>
                <el-col :span="9">
                    <span>豆瓣评分</span>
                    <el-row :gutter="20">
                        <el-col :span="3" v-if='movieInfo.score>0'>
                            <h1>{{scoreBig}}</h1>
                        </el-col >
                        <el-col :span="12" style="margin:7px 0px" >
                            <el-rate v-model="movieInfo.score" disabled></el-rate>
                            <span v-if='movieInfo.score>0'>{{movieInfo.personScoreCount}}人评价</span>
                        </el-col>
                    </el-row>
                    <div  v-if='movieInfo.score>0'>
                        <el-row v-for="item in scoreSectionCount" :key="item.key" :span="12">
                            <el-col :span="2" ><span>{{item.score}}</span></el-col >
                            <el-col :span="10" style="margin:4px 0px"><el-progress :percentage="item.percentage"></el-progress></el-col>
                        </el-row>
                    </div>
                    <div v-if='showNoScore==true&&(movieInfo.score<=0)'>暂无评分</div>
                    <div v-if='showNoTime==true'>尚未上映</div>
                </el-col>
            </el-row>

        </el-card>
        <el-card>
            <movie-user :movieId="movieInfo.id" @queryMovieInfoList='queryMovie'></movie-user>
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
            <div class="grid-content bg-purple">
                <h3>{{movieInfo.movieName}}的电影海报和剧照(<router-link style="color:#6340e6" :to="{path:'/movie/moviePicture/'+this.movieInfo.id}">全部图片{{moviePictureInfoBaseCount}}张</router-link>)：</h3>
            </div>
            <el-carousel v-if="moviePictureInfoBaseCount>0" :interval="4000"  type="card" height="400px">
                  <el-carousel-item v-for="(item,index) in moviePictureInfo" :key="index">
                  <h3 align="center">{{ item.fileName}}</h3>
                  <el-image style="width: 400px; height:400px;margin:0px 200px;"  :src="item.fileUri" fit='contain'></el-image>
                  <!-- <img style="width: 100%; height: auto;" :src="item.fileUri" class="image"> -->
                  </el-carousel-item>
            </el-carousel>
        </el-card>
        <el-card >
            <movie-user-short-command :movieId="movieInfo.id" :movieName="movieInfo.movieName" ref="movieUserShortCommand"></movie-user-short-command>
        </el-card>

        <el-dialog title="上传海报" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" :close-on-press-escape=false	:close-on-click-modal=false>
            <cropper ref="billUpload" :width=150 :height=200 :url='moviePictureBill' @upload="upload"></cropper>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="billUpload()" v-loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {queryMovieInfoById,queryMoviePictureInfoByMovieIdFromSix,moviePictureBillUpload,
        queryMoviePictureBillOne} from 'api/movie/movieInfo/index.js';
import {queryMovieScoreInfo} from 'api/movie/movieUser/index.js';
import MovieUser from './movieUser.vue'
import MovieUserShortCommand from './movieUserShortCommand.vue'
import Cropper from 'components/Cropper';
import { mapGetters } from 'vuex';
export default {
    data(){
        return{
            movieInfo:{
                id:this.$route.params.id,
                movieName:'',
                movieDescription:'',
                score:0,
                personScoreCount:0
            },
            titleMovieYear:'',
            movieOtherName:'',
            movieRelNameList:'',
            movieCountrys:'',
            movieTypes:'',
            rondomColor:'',
            optionsFromMovieCountry:'',
            showNoScore:true,
            showNoTime:false,
            moviePictureInfo:null,
            moviePictureInfoBaseCount:0,
            scoreBig:'',
            scoreSectionCount:[],
            movieInfoBill_btn_edit:false,
            dialogVisible:false,
            moviePictureBill:'',
            loading:false,
        }
    },
    components: { 
        MovieUser,
        MovieUserShortCommand,
        Cropper,
    },
    computed: {
        ...mapGetters([
        'elements',
        ])
    },
    methods:{
        queryMovie(id){
            queryMovieInfoById(id).then(res=>{
                this.movieInfo=res.movieInfo;
                this.scoreBig=this.movieInfo.score;
                if(this.movieInfo.score==null){
                    this.movieInfo.score="0";
                }
                this.movieInfo.score=parseFloat(this.movieInfo.score)/2;
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
                this.movieCountrys="";
                if(res.movieCountryList){
                    for(var i=0;i<res.movieCountryList.length;i++){
                        if(i==0){
                            this.movieCountrys=this.movieCountrys+this.getMovieCountry(res.movieCountryList[i].countryCode);
                        }else{
                            this.movieCountrys=this.movieCountrys+" / "+this.getMovieCountry(res.movieCountryList[i].countryCode);
                        }
                    }
                }
                this.movieTypes="";
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
            
            queryMovieScoreInfo(id).then(res=>{
                this.scoreSectionCount=res;
            })
            if (this.$refs.movieUserShortCommand!== undefined) {
                this.$refs.movieUserShortCommand.queryList();//但新增评论或修改评论之后，也要刷新评论区的数据
            }
            this.queryMoviePictureBill(id);//查询海报
            this.queryMoviePictureInfoByMovieIdFromSix(id);//查询电影海报及图片
        },
        queryMoviePictureBill(id){
            queryMoviePictureBillOne(id).then(res=>{
                this.moviePictureBill=res.fileUri;
            })
        },
        queryMoviePictureInfoByMovieIdFromSix(id){
            queryMoviePictureInfoByMovieIdFromSix(id).then(res=>{
                this.moviePictureInfo=res.moviePictureInfoList;
                this.moviePictureInfoBaseCount=res.moviePictureCount;
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
        upLoadBill(){
            this.dialogVisible=true;
        },
        upload(formData){
            console.log("海报编辑上传formData",formData);
            formData.append("id",this.movieInfo.id);
            moviePictureBillUpload(formData).then(moviePictureBill=>{
                this.$notify({ title:'成功', message:'头像设置成功', type:'success', duration:2000 });
                if(moviePictureBill!=null){
                    this.moviePictureBill=moviePictureBill;
                }
                this.queryMoviePictureInfoByMovieIdFromSix(this.movieInfo.id);
            }).finally(()=>{
                this.loading=false;
                this.dialogVisible=false;
            })
        },
        billUpload(){
            this.loading=true;
            if(this.$refs.billUpload !== undefined) {
                this.$refs.billUpload.finish();//调用子组件上传图片的方法
            }
        },
        handleClose(done) {
            done();
        }
    },
    created(){
        this.queryDict();
        this.queryMovie(this.$route.params.id);
        this.movieInfoBill_btn_edit = this.elements['movieInfoBill_btn_edit'];
    },
}
</script>
<style  rel="stylesheet/scss" lang="scss"  scoped>
.el-divider--vertical {
    display: inline-block;
    width: 1px;
    height: 12em;
    margin: 0 8px;
    vertical-align: middle;
    position: relative;
}
.img{
    width: 150px;
    height: 200px;
    background-color:yellow;
    
}
.dot{
    text-align: center;
    display:block;
    line-height:200px;
}
</style>