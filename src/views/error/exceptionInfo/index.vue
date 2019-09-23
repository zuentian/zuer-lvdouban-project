<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-date-picker  v-model="listQuery.startTime"  type="datetime" placeholder="选择开始时间"  align="right" value-format="timestamp" :picker-options="pickerOptions"></el-date-picker>
            <el-date-picker  v-model="listQuery.endTime"  type="datetime" placeholder="选择结束时间"  align="right" value-format="timestamp" :picker-options="pickerOptions"></el-date-picker>
            <el-button  type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
        </div>
        <el-table :data="exceptionInfoList"   style="width: 100%" v-loading="loading" :row-style="{height:'0'}" :cell-style="{padding:'4px'}">
            <el-table-column type="index" > </el-table-column>
            <el-table-column align="center" prop="errType" label="错误类型" min-width='180'></el-table-column>
            <el-table-column align="center" prop="errMessage"  label="错误信息" min-width='150'></el-table-column> 
            <el-table-column align="center" prop="status"  label="状态码" min-width='80' ></el-table-column>
            <el-table-column align="center" prop="errMethod"  label="错误方法" min-width='300' ></el-table-column>
            <el-table-column align="center" prop="errFileName"  label="错误类名" min-width='200' ></el-table-column>
            <el-table-column align="center" prop="errLineNumber"  label="行数" min-width='50' ></el-table-column>
            <el-table-column align="center" prop="crtTime"  label="出现时间" min-width='180' ></el-table-column>
            <el-table-column align="center" prop="crtName"  label="操作人" min-width='100' ></el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="150">
            <template slot-scope="scope">
                <el-button @click="showDetail(scope.row)"  type="text" size="small">查看错误详情信息</el-button>
            </template>
            </el-table-column>
    
        </el-table>
        <div v-show="total>0" class="block" text-align="center">
            <el-pagination 
                @size-change="handleSizeChange"  
                @current-change="handleCurrentChange" 
                :current-page="listQuery.currentPage"
                :page-sizes="[5,10,20, 50]"
                :page-size="listQuery.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog title="查看错误详情信息" :visible.sync="dialogFormVisible" width="50%">
            <textarea readonly style="width:100%;height:400px;font-family: 'Microsoft YaHei'" v-model="errDetail"></textarea>
        </el-dialog>
    </div>
</template>
<script>
import {queryExceptionInfoByParam} from 'api/exceptionInfo/index.js'
import {
  Message,
  MessageBox
} from 'element-ui';
export default {
    data(){
        return{
            loading:false,
            exceptionInfoList:null,
            total:0,
            listQuery:{
                startTime:'',
                endTime:'',
                pageSize:10,
                currentPage:1,
            },
            pickerOptions: {
               shortcuts: [{
                        text: '今天',
                        onClick(picker) {picker.$emit('pick', new Date());}
                    }, {
                        text: '昨天',
                        onClick(picker) { const date = new Date(); date.setTime(date.getTime() - 3600 * 1000 * 24); picker.$emit('pick', date);}
                    }, {
                        text: '一周前',
                        onClick(picker) { const date = new Date(); date.setTime(date.getTime() - 3600 * 1000 * 24 * 7); picker.$emit('pick', date);
                    }
                }]
            },
            dialogFormVisible:false,
            errDetail:""
        }
    },
    created(){
        this.queryExceptionInfo();
    },
    methods:{
        queryExceptionInfo(){
            console.log(this.listQuery.endTime);
            if((this.listQuery.endTime!=''&&this.listQuery.endTime!=null)
                &&this.listQuery.endTime<this.listQuery.startTime){
                    Message({
                        message: '开始时间必须小于结束时间！',
                        type: 'error',
                        duration: 5 * 1000
                    });
                    return 
            }
            queryExceptionInfoByParam(this.listQuery).then(res=>{
                this.exceptionInfoList=res.list;
                this.total=res.count;
            })
        },
        handleFilter(){
            this.queryExceptionInfo();
        },
        handleSizeChange(val){
            this.listQuery.pageSize=val;
        },
        handleCurrentChange(){
            this.listQuery.currentPage=val
        },
        showDetail(row){
            this.dialogFormVisible=true;
            if(row.errDetail==null||row.errDetail==''||row.errDetail===undefined){
                this.errDetail="暂无详细信息";
            }else{
                this.errDetail=row.errDetail;
            }
        }
    }
}
</script>
<style scoped>

.block{
    margin:20px auto;
    text-align:center;
}

</style>