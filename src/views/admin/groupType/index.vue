<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" v-if="groupTypeManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        </div>
        <el-table  :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="编码" min-width='100px' prop="code"></el-table-column>
            <el-table-column align="center" label="类型名称" min-width='100px' prop="name"></el-table-column>
            <el-table-column align="center" label="描述" min-width='100px' prop="description"></el-table-column>
            <el-table-column align="center" label="最后更新时间" min-width='100px' prop="updTime"></el-table-column>
            <el-table-column align="center" label="最后更新人" min-width='100px' prop="updName"></el-table-column>
            <el-table-column align="center" label="最后更新主机" min-width='100px' prop="updHost"></el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button v-if="groupTypeManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
                    </el-button>
                    <el-button v-if="groupTypeManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="编码" prop="code">
                <el-input v-model="form.code" placeholder="请输入编码"></el-input>
            </el-form-item>
            <el-form-item label="类型名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入类型名称"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="description">
                <el-input v-model="form.description" placeholder="请输入描述"></el-input>
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
import {addGroupType,queryGroupTypeByParam,queryGroupTypeById,updateGroupTypeById,deleteGroupTypeById} from 'api/groupType/index'
export default {
    data(){
        return {
            groupTypeManager_btn_add:true,
            groupTypeManager_btn_edit:true,
            groupTypeManager_btn_del:true,
            listQuery:{
                page: 1,
                limit: 20,
                name:"",
            },
            textMap: {
                update: '编辑',
                create: '创建'
            },
            dialogStatus:"",
            dialogFormVisible:false,
            form:{

            },
            total:0,
            listLoading:false,
            list:[],
            rules:{
                code: [
                        { required: true, message: '请输入编码', trigger: 'blur' }, 
                        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                    ],
                name: [
                        { required: true, message: '请输入类型名称', trigger: 'blur' }, 
                        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                    ],
                description: [
                    { required: true, message: '请输入描述', trigger: 'blur' }, 
                    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.queryList();
    },
    methods:{
        queryList() {
            this.listLoading = true;
            queryGroupTypeByParam(this.listQuery).then(res => {
                this.list=res.list;
                this.total = res.count;
                this.listLoading = false;
            })
        },
        handleFilter(){
            this.queryList();
        },
        handleCreate(){
            this.resetTemp();
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
        },
        handleUpdate(row){
            queryGroupTypeById(row.id).then(res=>{
                this.form=res;
            })
            this.dialogFormVisible=true;
            this.dialogStatus='update'
        },
        cancel(formName) {
            this.dialogFormVisible = false;
            this.$refs[formName].resetFields();
        },
        create(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    addGroupType(this.form).then(() => {
                        this.dialogFormVisible = false;
                        this.queryList();
                        this.$notify({
                            title: '成功',
                            message: '创建成功',
                            type: 'success',
                            duration: 2000
                        });
                    })
                } else {
                    return false;
                }
            });
        },
        update(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    updateGroupTypeById(this.form).then(() => {
                        this.dialogFormVisible = false;
                        this.queryList();
                        this.$notify({
                            title: '成功',
                            message: '编辑成功',
                            type: 'success',
                            duration: 2000
                        });
                    })
                } else {
                    return false;
                }
            });
        },
        handleDelete(row) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteGroupTypeById(row.id).then(() => {
                    this.$notify({
                        title: '成功',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    });
                    const index = this.list.indexOf(row);
                    this.list.splice(index, 1);
                });
            });
        },
        resetTemp() {
            this.form = {
                username: undefined,
                name: undefined,
                sex:   undefined,
                password: undefined,
                description: undefined
            };
        }
    }
}
</script>
<style scoped>

</style>