<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
           <el-card>
                <el-row :gutter="1">
                    <el-col :span="3">
                        <span style="margin:10px 0;float:right">电影名字：</span>
                    </el-col>
                    <el-col  :span="4" >
                        <el-input @keyup.enter.native="handleFilter" style="width: 100%;"  v-model="listQuery.name"></el-input>
                    </el-col>
                    <el-col :span="4">
                        <span style="margin:10px 0;float:right">电影类型：</span>
                    </el-col>
                    <el-col  :span="4" >
                        <el-select v-model="listQuery.movieType" filterable placeholder="请选择">
                            <el-option v-for="item in optionsFromMovieType" :key="item.value" :label="item.label" :value="item.label"> </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <span style="margin:10px 0;float:right">出品方国家或地区：</span>
                    </el-col>
                    <el-col  :span="4" >
                        <el-select v-model="listQuery.movieCountry" filterable placeholder="请选择">
                            <el-option v-for="item in optionsFromMovieCountry" :key="item.value" :label="`${item.value}-${item.label}`" :value="item.value"> </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row :gutter="1">
                    <el-col :span="3">
                        <span style="margin:10px 0;float:right">电影上映时间段：</span>
                    </el-col>
                    <el-col  :span="9" >
                        <el-date-picker  v-model="listQuery.startTime"  style="width: 150px;" type="date"   placeholder="开始时间" value-format="timestamp" ></el-date-picker>
                        <span>至</span>
                        <el-date-picker  v-model="listQuery.endTime"  style="width: 150px;" type="date"  placeholder="结束时间"  value-format="timestamp" ></el-date-picker>
                    </el-col>
                    <el-col :span="3">
                        <span style="margin:10px 0;float:right">评分分段：</span>
                    </el-col>
                    <el-col  :span="9" >
                        <el-input-number v-model="listQuery.startScore" class="filter-item" :precision="1" :step="0.1" :max="10" :min="0"></el-input-number>
                        <span>至</span>
                        <el-input-number v-model="listQuery.endScore"  class="filter-item" :precision="1" :step="0.1" :max="10" :min="0"></el-input-number>
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
                @expand-change="expandSelect" :row-key="getRowKeys">
            <el-table-column type="index" width="40"> </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-row>
                            <el-col :span="2"><span align="center" style="font-weight:bold" >备注</span></el-col>
                            <el-col :span="22"><span>{{ props.row.description }}</span></el-col>
                        </el-row>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column  align="center" label="电影名字" prop="movieName" min-width='150px'></el-table-column>
            <el-table-column  align="center" label="电影别名" prop="movieName1" min-width='120px'> </el-table-column>
            <el-table-column  align="center" label="上映时间" prop="movieShowTime" min-width='100px'></el-table-column>
            <el-table-column  align="center" label="电影评分" prop="score"></el-table-column>
            <el-table-column align="center" label="出品方国家(地区)" min-width='200px' prop="movieCountry" :formatter="pp">
                <template slot-scope="scope">
                    <el-tag effect="plain" :type="'success'" :key="tag.key" v-for="tag in scope.row.movieCountryList"  :disable-transitions="false" >{{tag.countryCode |pp}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="类型" min-width='200px' prop="movieType">
                <template slot-scope="scope">
                    <el-tag effect="dark" :type="'warning'" :key="tag.key" v-for="tag in scope.row.movieTypeList"  :disable-transitions="false" >{{tag.type}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" prop="crtTime" min-width='160px'></el-table-column>
            <el-table-column  align="center" label="最后时间" prop="updTime" min-width='160px'></el-table-column>
            <el-table-column  align="center" label="最后更新人" prop="updName"></el-table-column>

            <el-table-column v-if="movieInfo_btn_edit"  align="center" label="操作" width="150"> 
                <template slot-scope="scope">
                    <el-button v-if="movieInfo_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <div style="text-align:center" v-show="total>0" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>


    </div>
    
</template>
<script>
import {queryMovieInfoByParam} from 'api/movie/movieInfo/index.js'
import {  Message, MessageBox } from 'element-ui';
export default {
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
            list:[],
            movieInfo_btn_edit:true,
            total:0,
            expands:[],
            optionsFromMovieType:null,
            optionsFromMovieCountry:null,
            getRowKeys(row){
                return row.id;
            },
            tagsFromMovieType:[],
            tagsFromMovieCountry:[],
        }
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
        pp(){
            return '10'
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
        expandSelect(row, expandedRows) {
            var that = this
            if (expandedRows.length) {
                that.expands = []
                if (row) {
                that.expands.push(row.id)// 每次push进去的是每行的ID
                }
            } else {
                that.expands = []// 默认不展开
            }
        },
        formatterCountry(row){

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