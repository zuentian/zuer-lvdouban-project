<template>
    <div class="app-container calendar-list-container">
        <h1 v-if='movieId' class="page-header">修改电影</h1>
        <h1 v-else class="page-header">添加电影</h1>
        <el-card shadow="always" class="card">
        <el-form ref="movieInfo" :model="movieInfo" :rules="rules" v-loading="loadingInfo" label-width="180px" label-position="right" >
            <div class="well">
                <h4>电影信息</h4>
                <el-form-item label="电影名字" prop="movieName"><el-input v-model.trim="movieInfo.movieName"></el-input></el-form-item>
                <el-form-item label="电影其他名字1" prop="movieEnglishName1"><el-input v-model.trim="movieInfo.movieName1"></el-input></el-form-item>
                <el-form-item label="电影其他名字2" prop="movieEnglishName2"><el-input v-model.trim="movieInfo.movieName2"></el-input></el-form-item>
                <el-form-item label="电影时长(分钟)" prop="movieTime"><el-input-number v-model="movieInfo.movieTime" :step="10" :min=0 placeholder="分钟"></el-input-number></el-form-item>
                <el-form-item label="电影出品方国家或地区" prop="movieCountry">
                    <el-select style="width:100%" v-model="movieCountry" multiple placeholder="请选择国家地区">
                        <el-option v-for="item in selectMovieCountrys" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>    
                </el-form-item>
                <el-form-item label="电影上映日期" prop="movieShowTime"><el-date-picker v-model="movieInfo.movieShowTime" type="date" placeholder="选择日期" value-format="timestamp"></el-date-picker></el-form-item>
                <el-form-item label="电影类型" prop="movieType">
                    <el-checkbox-group v-model="movieType"  :max="4">
                        <el-checkbox v-for="item in selectMovieTypes" :label="item" :key="item">{{item}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item v-for="(item, index) in movieRelName"  :label="'电影相关人物' + (index+1)"  :key="item.key">
                    <el-input :style="{'width':'200px'}" v-model.trim='movieRelName[index]'></el-input>
                    <el-button type="primary" plain @click="addMovieRelName" icon="el-icon-plus">新增</el-button>
                    <el-button type="warning" plain @click.prevent="removeMovieRelName(movieRelName,index)" icon="el-icon-delete" v-bind:disabled="isDisabled">删除</el-button>
                </el-form-item>

                <el-form-item label="电影简介" prop="movieDescription"><el-input type="textarea"  placeholder=""  :autosize="{ minRows: 5, maxRows: 10}" v-model="movieInfo.movieDescription"></el-input></el-form-item>
                
                <el-form-item label="电影剧照" >
                    <el-upload class="upload-moviePicture"  action=""  multiple  list-type="picture-card"  ref="upload" 
                        :on-preview="handlePictureCardPreview" 
                        :on-remove="handleRemove"
                        :http-request="uploadFile" 
                        :auto-upload="false"
                        :on-change="changeMoviePicture" >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog  :title="moviePicture" :visible.sync="dialogVisible" size="tiny"><img width="100%" :src="dialogImageUrl" alt=""></el-dialog>
                </el-form-item>
                <el-form-item>
                    <el-button v-if='movieId' type="primary" :loading="loading" @click="submitFormEdit('movieInfo')">立即修改</el-button>
                    <el-button v-else type="primary" :loading="loading" @click="submitForm('movieInfo')">立即添加</el-button>
                    <el-button  v-if='movieId' @click="close('movieInfo')">取消</el-button>
                    <el-button  v-else @click="resetForm('movieInfo')">重置</el-button>
                </el-form-item>
            </div>
        </el-form>
        </el-card>
        
        <!--回到顶部，好像没什么效果-->
        <el-backtop target=".app-wrapper .main-container" :bottom="100">
          <div style="{ height: 100%;  width: 100%; background-color: #f2f5f6; box-shadow: 0 0 6px rgba(0,0,0, .12); text-align: center;  line-height: 40px;  color: #1989fa; }" >
            UP
          </div>
        </el-backtop>

    </div>
</template>

<script>
import {Message, MessageBox} from 'element-ui';
import {insertMovieInfo,queryMovieInfoById,updateMovieInfo,insertMovieInfoPictureStage} from 'api/movie/movieInfo/index.js'
import {queryDictByDictType} from 'api/dict/index.js'
export default {
    data(){
        return{
            movieInfo:{
                movieName:null,
                movieName1:null,
                movieName2:null,
                movieTime:null,
                movieShowTime:null,
                movieDescription:null,
            },
            movieRelName:[''],
            movieCountry:[],
            movieType:[],
            loading:false,
            loadingInfo:false,
            rules: {
                movieName: [
                    { required: true, message: '请输入电影名字', trigger: 'blur' },
                    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
                ],
                movieShowTime: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
            },
            selectMovieTypes:[],
            selectMovieCountrys:[],
            isDisabled:true,
            dialogVisible: false,
            dialogImageUrl: "",
            moviePicture:"",
            fileData:[],
        }
    },
    props:{
        movieId:{
            
        }
    },
    methods:{

        submitForm(formName){
            this.fileData=[];
            const vals = {}
            vals.movieRelName=this.movieRelName.join();
            vals.movieInfo=this.movieInfo;
            vals.movieCountry=this.movieCountry.join();
            vals.movieType=this.movieType.join();

            this.loading=true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    insertMovieInfo(vals).then(res=>{
                        if(res){
                            this.insertUploadFile(res);
                            this.$notify({ title:'成功', message:'添加成功', type:'success', duration:2000 });
                            this.resetForm();
                        }
                    }).finally(()=>{
                        this.loading=false;
                    })
                } else {
                    Message({message: '信息未填写完整！', type: 'error', duration: 5 * 1000 });
                    this.loading = false
                    return false;
                }
            });
            
        },
        insertUploadFile(id){
            this.fileData=[];
            //上传文件
            this.$refs.upload.submit();
            
            var fileFormData = new FormData();//传文件要建立FormData对象
            //fileFormData.set("files",this.fileData);
            //将上传文件封装在formData
            for(var i=0;i<this.fileData.length;i++){
                fileFormData.append('files',this.fileData[i]);
            }
            fileFormData.append('id',id);
            //传文件的时候，数据要放在data里面，放在params里面出无法自动修改headers的Content-Type:multipart/form-data
            insertMovieInfoPictureStage(fileFormData).then(res=>{
                this.$refs.upload.clearFiles();//清空图片
            }).finally(()=>{
            })
        },
        submitFormEdit(formName){
            
            const vals = {};
            vals.movieRelName=this.movieRelName.join();
            vals.movieInfo=this.movieInfo;
            vals.movieCountry=this.movieCountry.join();
            vals.movieType=this.movieType.join();
            
            this.loading=true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    updateMovieInfo(vals).then(res=>{
                        this.insertUploadFile(this.movieInfo.id);
                        this.$notify({ title:'成功', message:'修改成功', type:'success', duration:2000 });
                        this.close();
                        
                    }).finally(()=>{
                        this.loading=false;
                    })
                } else {
                    Message({message: '信息未填写完整！', type: 'error', duration: 5 * 1000 });
                    this.loading = false
                    return false;
                }
            });

        },
        close(){
            this.$emit('closeMovieInfoEditDialog');
            this.resetForm();
        },
        resetForm(){
            this.movieInfo={
                movieName:null,
                movieName1:null,
                movieName2:null,
                movieTime:null,
                movieShowTime:null,
                movieDescription:null,
            };
            this.movieRelName=[''];
            this.movieCountry=[];
            this.movieType=[];
            this.isDisabled=true;
            
        },
        handlePictureCardPreview(file){
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
            this.moviePicture=file.name;
        },
        handleRemove(){

        },
        changeMoviePicture(){

        },
        uploadFile(params){
            // 文件上传
            this.fileData.push(params.file);
        },
        removeMovieRelName(item,index) {
            this.movieRelName.splice(index, 1)
            if(this.movieRelName.length<=1){
                this.isDisabled=true;
            }
        },
        addMovieRelName() {
            this.movieRelName.push('');
            if(this.movieRelName.length>1){
                this.isDisabled=false;
            }
        },
        async queryMovieDict(){
            await this.$store.dispatch('QueryDictByDictType',{
                dictType:'MOVIECOUNTRY'
            }).then(list=>{
                    this.selectMovieCountrys=list;
                }
            )
            await this.$store.dispatch('QueryDictByDictType',{
                dictType:'MOVIETYPE'
            }).then(list=>{
                    list.forEach(lists => {
                        this.selectMovieTypes.push(lists.label);
                    });
                }
            )
        },
        queryMovieInfoByMovieId(id){
            if(id){
                queryMovieInfoById(id).then(res=>{
                    this.loadingInfo=true;
                    this.movieInfo=res.movieInfo
                    this.movieInfo.movieShowTime=res.movieShowTime;//上映时间赋值
                    if(res.movieRelNameList.length){//电影相关人物
                        this.movieRelName=[];
                        for(var i=0;i<res.movieRelNameList.length;i++){
                            if(res.movieRelNameList[i].name==null||res.movieRelNameList[i].name===undefined){
                                this.movieRelName.push('未知');
                            }else{
                                this.movieRelName.push(res.movieRelNameList[i].name);
                            }
                            
                        }
                        if(this.movieRelName.length>1){
                            this.isDisabled=false;
                        }
                    }
                    
                    if(res.movieTypeList.length){//电影类型
                        this.movieType=[];
                        for(var i=0;i<res.movieTypeList.length;i++){
                            this.movieType.push(res.movieTypeList[i].type)
                        }
                    }
                    
                    if(res.movieCountryList.length){//电影国家和地区
                        this.movieCountry=[];
                        for(var i=0;i<res.movieCountryList.length;i++){
                            this.movieCountry.push(res.movieCountryList[i].countryCode)
                        }
                    }
                    
                    this.loadingInfo=false;
                }).finally(()=>{
                })
            }
        }
    },
    created(){
        this.queryMovieInfoByMovieId(this.movieId);
        this.queryMovieDict();
    }
}
</script>
<style scoped>

</style>