<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item"  v-if="userManager_btn_add"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加</el-button>
            
        </div>
        
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="序号" width="65"> 
                <template slot-scope="scope"><span>{{scope.row.id}}</span></template> 
            </el-table-column>
            <el-table-column width="200" align="center" label="姓名"> 
                <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
            </el-table-column>
            <el-table-column width="110" align="center" label="账户">
                <template slot-scope="scope"><span>{{scope.row.username}}</span></template> 
            </el-table-column>
            <el-table-column width="110" align="center" label="性别"> 
                <template slot-scope="scope"><span>{{scope.row.sex}}</span></template> 
            </el-table-column>
            <el-table-column width="300" align="center" label="备注"> 
                <template slot-scope="scope"><span>{{scope.row.description}}</span></template> 
            </el-table-column>
            <el-table-column width="180" align="center" label="最后时间"> 
                <template slot-scope="scope"><span>{{scope.row.updTime}}</span></template> 
            </el-table-column>
            <el-table-column width="200" align="center" label="最后更新人"> 
                <template slot-scope="scope"><span>{{scope.row.updName}}</span></template> 
            </el-table-column>
            <el-table-column align="center" label="操作" width="150"> 
                <template slot-scope="scope">
                    <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <div v-show="!listLoading&&total>0" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
    </div>
</template>
<script>
import {queryUser} from 'api/user/index'
import { mapGetters } from 'vuex';
export default {
    name:'user',
    data(){
        return {
            listQuery:{
                name:"",
                page:1,
                limit:10,
            },
            list:null,
            userManager_btn_add:true,
            listLoading:false,
            userManager_btn_edit:true,
            userManager_btn_del:true,
            tableKey:0,
            total:0,
        }
    },
    methods:{
        queryUserInfo(){
            queryUser(this.listQuery).then(res=>{

            })
        },
        handleFilter(){
            this.queryUserInfo();
        },
        handleCreate(){

        },
        handleSizeChange(val){

        },
        handleCurrentChange(val){

        },
        handleUpdate(){

        },
        handleDelete(){

        }
    },
    mounted(){
        this.queryUserInfo();
    }
}
</script>

<style scoped>

</style>