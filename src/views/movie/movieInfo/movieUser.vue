<template >
    <div >
        <el-row :gutter="5" v-if='movieUserInfo.state!="1"&&movieUserInfo.state!="2"'>
            <el-col :span="4">
                <el-tag color="#8be2ea" @click="setLookBefore()" style="color:black">想看</el-tag>
                <el-tag color="#8be2ea" @click="setLookAfter()" style="color:black">看过</el-tag>
            </el-col>
            <el-col  :span="2" style="margin:5px">
                <span style="float:right">评价：</span>
            </el-col>
            <el-col style="margin:7px 0" :span="4">
                <el-rate v-model="score" show-text :texts='texts' @change="scoreChange()"></el-rate>
            </el-col>
        </el-row>
        <el-row v-if='movieUserInfo.state=="2"||movieUserInfo.state=="1"'>
            <el-col style="margin:8px 0" :span="4"  v-if='movieUserInfo.state=="2"'>
                <span>我看过这部电影 {{movieUserInfo.watchAfterTime}}</span>
            </el-col>
            <el-col style="margin:8px 0" :span="4"  v-if='movieUserInfo.state=="1"'>
                <span>我想看这部电影 {{movieUserInfo.watchBeforeTime}}</span>
            </el-col>
            <el-col style="margin:7px 0" :span="4">
                 <el-button size="mini" type="success" @click="update()">修改</el-button>
                 <el-button size="mini" type="danger" @click="del()">删除</el-button>
            </el-col>
        </el-row>
        <el-row v-if='movieUserInfo.state=="2"'>
            <el-col style="margin:5px 0" :span="2">
                <span>我的评价：</span>
            </el-col>
            <el-col style="margin:8px 0" :span="4">
                <el-rate v-model="movieUserInfo.score" disabled show-text :texts='texts'></el-rate>
            </el-col>
        </el-row>
        <el-row v-if='movieUserInfo.state=="2"||movieUserInfo.state=="1"'>
            <el-col style="margin:7px 0" :span="24">
                <span>{{movieUserInfo.shortCommand}}</span>
            </el-col>
        </el-row>

        
    <el-dialog  :title="title" :visible.sync="dialogVisible"  width="50%" :before-close="handleClose" :loading="loading">
      <div v-if="state=='2'">
        <span>给个评价吧?(可选): </span>
        <el-rate v-model="score" show-text :texts='texts'></el-rate>
      </div>
      <span>简短评论：</span>
      <textarea rows="5" cols="100"  v-model="shortCommand"></textarea>
      <span slot="footer" class="dialog-footer"><el-button type="primary" @click="submitForm()">确 定</el-button></span>
    </el-dialog>

    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import {insertMovieUser,queryMovieUserByMovieIdAndUserId} from 'api/movie/movieUser/index.js'
export default {
    data(){
        return {
            movieUserInfo:{
                lookAfterTime:null,
                lookBeforeTime:null,
                score:0,
                shortCommand:'',
                state:'',
            },
            score:0,
            texts:['很差', '较差', '还行', '推荐', '力荐'],
            state:"0",
            shortCommand:'',
            title:'',
            loading:false,
            dialogVisible:false,
        }
    },
    computed: {
      ...mapGetters([
        'userId',
      ]),
    },
    methods:{
        submitForm(){
            insertMovieUser({
                movieId:this.movieId,
                userId:this.userId,
                score:this.score,
                shortCommand:this.shortCommand,
                state:this.state,
            }).then(res=>{
                this.$notify({ title:'成功', message:'评论成功', type:'success', duration:2000 });
                this.dialogVisible=false;
                this.queryList();
                this.$emit('queryMovieInfoList',this.movieId);
            })
        },
        queryList(){
            queryMovieUserByMovieIdAndUserId({
                movieId:this.movieId,
                userId:this.userId,
            }).then(res=>{
                this.movieUserInfo=res;
                this.movieUserInfo.score=parseFloat(this.movieUserInfo.score);
            })
        },
        setLookBefore(){
            this.dialogVisible=true;
            this.title="我想看这部电影";
            this.state='1'
        },
        setLookAfter(){
            this.dialogVisible=true;
            this.title="我看过这部电影";
            this.state='2'
        },
        handleClose(done){
            this.$confirm('确认关闭？').then(_ => {
                this.rollback();
                done();
            }).catch(_ => {});
        },
        rollback(){
            this.lookBeforeState='N';
            this.lookAfterState='N';
            this.shortCommand='';
            this.title='';
            this.score=0;
        },
        scoreChange(){
            this.setLookAfter();
        }
    },
    created(){
        this.queryList();
    },
    props:{
        movieId:{
            type:String,
            required:true,
        }
    }
}
</script>
<style scoped>
</style>