<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="电影名字" v-model="listQuery.name"> </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
            
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
            <el-table-column  align="center" label="姓名" prop="name" min-width='100px'></el-table-column>
            <el-table-column  align="center" label="账户号码" prop="username"></el-table-column>
            <el-table-column  align="center" label="号称" prop="nameBak"></el-table-column>
            <el-table-column align="center" label="国家" prop="sex" :formatter="formatterCountry"></el-table-column>
            <el-table-column align="center" label="创建时间" prop="crtTime" min-width='140px'></el-table-column>
            <el-table-column  align="center" label="最后时间" prop="updTime" min-width='140px'></el-table-column>
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
export default {
    data(){
        return{
            listQuery:{
                name:"",
                page:0,
                limit:10,
            },
            listLoading:false,
            list:[],
            movieInfo_btn_edit:true,
            total:0,
            expands:[],
            getRowKeys(row){
                return row.id;
            },
        }
    },
    methods:{
        handleFilter(){

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
    }
}
</script>
<style scoped>

</style>