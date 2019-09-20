<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item"  v-if="userManager_btn_add"  style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">添加</el-button>
            
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
            <el-table-column align="center" label="性别" prop="sex" :formatter="formatterSex"></el-table-column>
            <el-table-column align="center" label="创建时间" prop="crtTime" min-width='140px'></el-table-column>
            <el-table-column  align="center" label="最后时间" prop="updTime" min-width='140px'></el-table-column>
            <el-table-column  align="center" label="最后更新人" prop="updName"></el-table-column>

            <el-table-column v-if="userManager_btn_edit||userManager_btn_del"  align="center" label="操作" width="150"> 
                <template slot-scope="scope">
                    <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <div style="text-align:center" v-show="!listLoading&&total>0" class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-loading='dialogLoading'>
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="账户号码" prop="username">
                <el-input v-if="dialogStatus == 'create'" v-model="form.username" placeholder="请输入账户号码"></el-input>
                <el-input v-else v-model="form.username" placeholder="请输入账户号码" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="号称" prop="nameBak">
                <el-input v-model="form.nameBak" placeholder="请输入号称"></el-input>
            </el-form-item>
            <el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
                <el-input type="password" v-model="form.password"  auto-complete="new-password"></el-input><!--auto-complete避免密码填充-->
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
import {queryUser,addUser,queryUserById,updateUserById ,deleteUserById} from 'api/user/index'
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
            list:[],//此处最好不用null,比如用到getRowKeys(row)时，null会报错
            userManager_btn_add:false,
            listLoading:false,
            userManager_btn_edit:false,
            userManager_btn_del:false,
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
            dialogLoading:false,
            getRowKeys(row){
                return row.id;
            },
            expands:[],
        }
    },
    methods:{
        queryUserInfo(){
            queryUser(this.listQuery).then(res=>{
                this.list=res.list;
                this.total=res.count;
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
            this.listQuery.limit = val;
            this.queryUserInfo();
        },
        handleCurrentChange(val){
            this.listQuery.page=val;
            this.queryUserInfo();
        },
        handleDelete(row){
            this.$confirm('此操作将会永久删除角色信息，请再次确认是否删除？', '确认信息', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '删除',
                        cancelButtonText: '放弃删除'
            }).then(() => {
                deleteUserById(row.id).then((res)=>{
                    this.queryUserInfo();
                    this.$notify({title: '删除成功',message: '',type: 'success'});
                }).catch(err=>{
                })
            }).catch(action => {
                this.$message({
                    type: 'info',
                    message: action === 'cancel'
                    ? '放弃删除并离开页面'
                    : '停留在当前页面'
                })
            });
        },
        create(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.dialogLoading=true;
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
                    }).finally(()=>{
                         this.dialogLoading=false;
                    })
                }else{
                    return false;
                }
            })
        },
        update(formName){
            this.$refs[formName].validate(valid=>{
                if(valid){
                    this.dialogLoading=true;
                    updateUserById(this.form).then(()=>{
                        this.dialogFormVisible=false;
                        this.queryUserInfo();
                        this.$notify({
                            title:'成功',
                            message:'编辑成功',
                            type:'success',
                            duration:2000
                        })
                    }).catch(()=>{
                    }).finally(()=>{
                        this.dialogLoading=false;
                    })
                }else{
                    return false;
                }
            })
        },
        handleUpdate(row){
            queryUserById(row.id).then((user)=>{
                this.form=user;
                this.dialogFormVisible=true;
                this.dialogStatus='update';
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
        },
        formatterSex:function(row,column){
            for(var sexs of this.sexOptions){
                if(row.sex==''||row.sex==undefined){
                    return "未知";
                }
                if(sexs.value==row.sex){
                    return sexs.label;
                }
            }
        },
        cancel(formName){
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
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
        }
    },
    created(){
        this.queryUserInfo();
        this.querySexs();
        this.userManager_btn_edit = this.elements['userManager:btn_edit'];
        this.userManager_btn_del = this.elements['userManager:btn_del'];
        this.userManager_btn_add = this.elements['userManager:btn_add'];
    },
    computed: {
        ...mapGetters([
        'elements',
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