<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item"  v-if="userManager_btn_add"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加</el-button>
            
        </div>
        
        <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">

            <el-table-column  align="center" label="姓名"> 
                <template slot-scope="scope"><span>{{scope.row.name}}</span></template>
            </el-table-column>
            <el-table-column  align="center" label="账户号码">
                <template slot-scope="scope"><span>{{scope.row.username}}</span></template> 
            </el-table-column>
            <el-table-column  align="center" label="号称">
                <template slot-scope="scope"><span>{{scope.row.nameBak}}</span></template> 
            </el-table-column>
            <el-table-column align="center" label="性别"> 
                <template slot-scope="scope"><span>{{scope.row.sex}}</span></template> 
            </el-table-column>
            <el-table-column align="center" label="备注"> 
                <template slot-scope="scope"><span>{{scope.row.description}}</span></template> 
            </el-table-column>
            <el-table-column  align="center" label="最后时间"> 
                <template slot-scope="scope"><span>{{scope.row.updTime}}</span></template> 
            </el-table-column>
            <el-table-column  align="center" label="最后更新人"> 
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
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="账户号码" prop="username">
                <el-input v-if="dialogStatus == 'create'" v-model="form.username" placeholder="请输入账户"></el-input>
                <el-input v-else v-model="form.username" placeholder="请输入账户号码" readonly></el-input>
            </el-form-item>
            <el-form-item label="号称" prop="nameBak">
                <el-input v-model="form.nameBak" placeholder="请输入号称"></el-input>
            </el-form-item>
            <el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
                <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-radio-group v-model="form.sex" style="float: left;margin:10px 0px">
                    <el-radio v-for="sex in sexOptions" :label="sex.value" :key="sex.value">{{sex.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="form.description"> </el-input>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
                <el-button v-else type="primary" @click="update('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {queryUser,addUser} from 'api/user/index'
import { mapGetters } from 'vuex';
import md5 from 'js-md5'
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
            dialogFormVisible:false,
            dialogStatus:"",
            textMap: {
                update: '编辑',
                create: '创建'
            },
            form:{
                name:"",
                username:"",
                nameBak:"",
                password:"",
                sex:"0",
                description:"",
            },
            rules:{
                name: [
                    {required: true,message: '请输入用户',trigger: 'blur'},
                    {min: 1,max: 20,message: '长度在 1 到 20 个字符',trigger: 'blur'}
                ],
                username: [
                    {required: true,message: '请输入账户号码',trigger: 'blur'},
                    {min: 1,max: 20,message: '长度在 1 到 20 个字符',trigger: 'blur'}
                ],
                password: [
                    {required: true,message: '请输入密码',trigger: 'blur'},
                    {min: 6,max: 20,message: '长度在 6 到 20 个字符',trigger: 'blur'}
                ],
            },
            sexOptions:[],

        }
    },
    methods:{
        queryUserInfo(){
            queryUser(this.listQuery).then(res=>{
                this.list=res;
            })
        },
        handleFilter(){
            this.queryUserInfo();
        },
        handleCreate(){
            this.dialogFormVisible=true;
            this.dialogStatus='create';
            this.clearParams();
        },
        handleSizeChange(val){

        },
        handleCurrentChange(val){

        },
        handleUpdate(){

        },
        handleDelete(){

        },
        create(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.form.password=md5(this.form.password);//加密
                    addUser(this.form).then(() => {
                        this.dialogFormVisible = false;
                        this.queryUserInfo();
                        this.$notify({
                            title: '成功',
                            message: '创建成功',
                            type: 'success',
                            duration: 2000
                        });
                    }).catch(()=>{
                        this.form.password="";
                    })
                }else{
                    return false;
                }
            })
        },
        clearParams(){
            this.form={
                name:"",
                username:"",
                nameBak:"",
                password:"",
                sex:"0",
                description:"",
            };
        },
        async querySexs(){
            await this.$store.dispatch('QueryDictByDictType',{
                dictType:'USERSEX'
            }).then(list=>{
                this.sexOptions=list;
            })
        }
    },
    created(){
        this.queryUserInfo();
        this.querySexs();
    },
    computed: {
        ...mapGetters([
        //'elements'
        'QueryDictByDictType',
        ])
    },
    watch:{
        //'form.password2':function(newVal){
           
        //}
    }
}
</script>

<style scoped>

</style>