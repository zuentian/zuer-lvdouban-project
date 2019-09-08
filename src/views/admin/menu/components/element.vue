<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="资源名称" v-model="listQuery.name"> </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" v-if="menuManager_btn_element_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        </div>
        <el-table  :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column min-width='100px' align="center" label="资源编码"  prop="code"></el-table-column>
            
            <el-table-column fixed="right" align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button v-if="menuManager_btn_element_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button v-if="menuManager_btn_element_del" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading&&total>0" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
    </div>
</template>
<script>
import {query} from 'api/element/index'
export default { 
    
    props: ["menuId"],
    
    data(){
        return{
            listQuery:{
                page:1,
                limit:10,
                name:"",
                menuId:"",
            },
            menuManager_btn_element_add:true,
            listLoading:false,
            total:0,
            list:[],
            menuManager_btn_element_edit:true,
            menuManager_btn_element_del:true,
        }
    },
    methods:{
        async queryList(){
            this.listLoading=true;
            this.listQuery.menuId = this.menuId;
            await query(this.listQuery).then(res=>{

            })
            this.listLoading=false;
        },
        handleFilter(){

        },
        handleCreate(){

        },
        handleCurrentChange(val){
            this.page=val;
            this.queryList();
        },
        handleSizeChange(val){
            this.limit=val;
            this.queryList();
        },
        //async queryMenuRoot(){
           // await this.$store.dispatch('QueryDictByDictType',{
               // dictType:'MENUROOT'
            //}).then(list=>{
                //if(list.length>0){
                    //this.menuId=list[0].label;
                //}
           // })
            //this.queryList();
        //}
        
    },
    created() {
        //this.queryMenuRoot();
    }
}
</script>
<style scoped>

</style>

