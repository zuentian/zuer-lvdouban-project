<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
           <el-card>
                <el-row :gutter="1">
                    <el-col :span="3">
                        <span style="margin:5px 0;float:right">电影名字：</span>
                    </el-col>
                    <el-col  :span="4" >
                        <el-input @keyup.enter.native="handleFilter" style="width: 100%;"  v-model="listQuery.name" size="small"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <span style="margin:5px 0;float:right">电影类型：</span>
                    </el-col>
                    <el-col  :span="4" >
                        <el-select v-model="listQuery.movieType" filterable placeholder="请选择" size="small">
                            <el-option v-for="item in optionsFromMovieType" :key="item.value" :label="item.label" :value="item.label" > </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <span style="margin:5px 0;float:right">出品方国家或地区：</span>
                    </el-col>
                    <el-col  :span="4" >
                        <el-select v-model="listQuery.movieCountry" filterable placeholder="请选择" size="small">
                            <el-option v-for="item in optionsFromMovieCountry" :key="item.value" :label="`${item.value}-${item.label}`" :value="item.value"> </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row :gutter="1">
                    <el-col :span="3">
                        <span style="margin:5px 0;float:right">电影上映时间段：</span>
                    </el-col>
                    <el-col  :span="8" >
                        <el-date-picker  v-model="listQuery.startTime"  style="width: 190px;" type="date"   placeholder="开始时间" value-format="timestamp" size="small"></el-date-picker>
                        <span>至</span>
                        <el-date-picker  v-model="listQuery.endTime"  style="width: 190px;" type="date"  placeholder="结束时间"  value-format="timestamp" size="small"></el-date-picker>
                    </el-col>
                    <el-col :span="2" >
                        <span style="margin:5px 0;float:right">评分分段：</span>
                    </el-col>
                    <el-col  :span="11" >
                        <el-input-number v-model="listQuery.startScore" class="filter-item" :precision="1" :step="0.1" :max="10" :min="0" size="small"></el-input-number>
                        <span>至</span>
                        <el-input-number v-model="listQuery.endScore"  class="filter-item" :precision="1" :step="0.1" :max="10" :min="0" size="small"></el-input-number>
                    </el-col>
                </el-row>
                <el-row :gutter="1">
                    <el-col :offset="11" :span="8" >
                        <el-button  type="info" v-waves icon="el-icon-refresh-right" class="filter-item" @click="reset">重置</el-button>
                        <el-button  type="primary" v-waves icon="el-icon-search" class="filter-item" @click="handleFilter">搜索</el-button>
                    </el-col>
                </el-row>

           </el-card>
           
            
        </div>
        <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" :expand-row-keys="expands" 
                @expand-change="expandSelect" :row-key="getRowKeys"
                >
            <el-table-column type="index" width="40"> </el-table-column>
            <el-table-column type="expand" >
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand"  v-loading="expandsLoading"	>
                        <el-row>
                            <el-col :span="2" style="margin:10px 0px"><span align="center" style="font-weight:bold;" >电影相关人物</span></el-col>
                            <el-col :span="22">
                                <el-tag  :type="'danger'" style="margin:5px" :key="tag.key" v-for="tag in props.row.movieRelNameList"  :disable-transitions="false" >{{tag.name}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="电影名字" prop="movieName" min-width='150px'></el-table-column>
            <el-table-column  align="center" label="电影别名" prop="movieName1" min-width='120px'> </el-table-column>
            <el-table-column  align="center" label="上映时间" prop="movieShowTime" min-width='100px'></el-table-column>
            <el-table-column  align="center" label="电影评分" prop="score" :formatter="scoreFormatter"></el-table-column>
            <el-table-column  align="center" label="电影时长(分钟)" prop="movieTime" ></el-table-column>
            <el-table-column align="center" label="出品方国家(地区)" min-width='150px' prop="movieCountry">
                <template slot-scope="scope">
                    <el-tag effect="plain" :type="'success'" :key="tag.key" v-for="tag in scope.row.movieCountryList"  :disable-transitions="false" >{{tag.countryCode | getCountry(optionsFromMovieCountry)}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="类型" min-width='200px' prop="movieType">
                <template slot-scope="scope">
                    <el-tag effect="dark" :type="'warning'" :key="tag.key" v-for="tag in scope.row.movieTypeList"  :disable-transitions="false" >{{tag.type}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" prop="crtTime" min-width='160px'></el-table-column>
            <el-table-column  align="center" label="最后时间" prop="updTime" min-width='160px'></el-table-column>
            <el-table-column  align="center" label="最后更新人" prop="updName" min-width='100px'></el-table-column>

            <el-table-column v-if="movieInfo_btn_edit"  align="center" label="操作" min-width='80px'> 
                <template slot-scope="scope">
                    <el-button v-if="movieInfo_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <div style="text-align:center" v-show="total>0" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>


        <el-dialog :title="dialogMovieInfoEdit" :visible.sync="dialogMovieInfoEditVisible">
            <movie-info-edit :movieId="currentId" @closeMovieInfoEditDialog="closeMovieInfoEditDialog" ref="movieInfoEdit"></movie-info-edit>
        </el-dialog>

    </div>
    
</template>
<script>
import {queryMovieInfoByParam,queryMovieInfoById} from 'api/movie/movieInfo/index.js'
import {  Message, MessageBox } from 'element-ui';
var that;//定义一个全局变量
export default {
    components: {
        'movie-info-edit': () => import('views/movie/movieInfoAdd/index'),
    },
    data(){
        return{
            listQuery:{
                name:"",
                startTime:null,
                endTime:null,
                startScore:null,
                endScore:null,
                page:0,
                limit:10,
                movieCountry:null,
                movieType:null,
            },
            listLoading:false,
            expandsLoading:false,
            list:[],
            movieInfo_btn_edit:true,
            total:0,
            expands:[],
            optionsFromMovieType:null,
            optionsFromMovieCountry:'',
            getRowKeys(row){
                return row.id;
            },
            tagsFromMovieType:[],
            tagsFromMovieCountry:[],
            movieDescription:'',
            dialogMovieInfoEdit:'',
            dialogMovieInfoEditVisible:false,
            currentId:'',
        }
    },
    beforeCreate: function () {
        that = this;
    },
    filters:{
        getCountry:function(value,optionsFromMovieCountry){
            for(var i=0;i<optionsFromMovieCountry.length;i++){
                if(optionsFromMovieCountry[i].value==value){
                    return optionsFromMovieCountry[i].label;
                }
            }
        },
    },
    methods:{
        async queryDict(){
            await this.$store.dispatch('QueryDictByDictType',{
                dictType:'MOVIECOUNTRY'
            }).then(list=>{
                    this.optionsFromMovieCountry=list;
                }
            )
            await this.$store.dispatch('QueryDictByDictType',{
                dictType:'MOVIETYPE'
            }).then(list=>{
                    this.optionsFromMovieType=list;
                }
            )
        },
        scoreFormatter(row, column, cellValue){
            
            if(cellValue==null||cellValue===undefined||cellValue==0){
                return "暂无评分";
            }else{
                return cellValue;
            }
        },
        queryList(){
            if((this.listQuery.endTime!=''&&this.listQuery.endTime!=null)
                &&this.listQuery.endTime<this.listQuery.startTime){
                    Message({
                        message: '结束时间不能小于开始时间！',
                        type: 'error',
                        duration: 5 * 1000
                    });
                    return 
            }
            if(this.listQuery.endScore<this.listQuery.startScore){
                    Message({
                        message: '后段分数值不能小于前段分数值！',
                        type: 'error',
                        duration: 5 * 1000
                    });
                    return 
            }
            this.listLoading=true;
            queryMovieInfoByParam(this.listQuery).then(res=>{
                this.list=res.list;
                this.total=res.count;
                
            }).finally(()=>{
                this.listLoading=false;
            })
        },
        reset(){
            this.listQuery={
                name:"",
                startTime:null,
                endTime:null,
                startScore:null,
                endScore:null,
                movieCountry:null,
                movieType:null,
                page:this.listQuery.page,
                limit:this.listQuery.limit,
            };
        },
        handleFilter(){
            this.queryList();
        },
        handleSizeChange(val){
            this.listQuery.limit=val;
        },
        handleCurrentChange(){
            this.listQuery.page=val;
        },
        closeMovieInfoEditDialog(){
            this.dialogMovieInfoEditVisible=false;
            if (this.$refs.movieInfoEdit !== undefined) {
               this.$refs.movieInfoEdit.resetForm();
            }
        },
        //展示的时候只是默认展示一行，其他行关闭
        expandSelect(row, expandedRows) { 
            
            if (expandedRows.length) {
                this.expands = []
                if (row) {
                    this.expands.push(row.id)// 每次push进去的是每行的ID
                }
            } else {
                this.expands = []// 默认不展开
            }
        },
        handleUpdate(row){
            this.currentId=row.id;
            this.dialogMovieInfoEditVisible=true;
            if (this.$refs.movieInfoEdit !== undefined) {
               this.$refs.movieInfoEdit.queryMovieInfoByMovieId(this.currentId);
            }
        }
        
    },
    created(){
        this.queryDict();
        this.queryList();
    }
}
</script>
<style scoped>
.el-row {
    margin-bottom: 20px;
  }
</style>