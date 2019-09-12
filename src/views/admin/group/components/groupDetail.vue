<template>
    <el-row>
        <el-col :span="24">
            <el-button-group>
                <el-button type="primary" v-if="groupManager_btn_add" icon="el-icon-plus" @click="handlerAdd">添加</el-button>
                <el-button type="primary" v-if="groupManager_btn_edit" icon="el-icon-edit" @click="handlerEdit">编辑</el-button>
                <el-button type="primary" v-if="groupManager_btn_del" icon="el-icon-delete" @click="handleDelete">删除</el-button>
                <el-button type="primary" v-if="groupManager_btn_resourceManager" @click="handlerAuthority">
                    <icon-svg icon-class="assignment"></icon-svg>权限分配</el-button>
                <el-button type="primary" v-if="groupManager_btn_userManager" @click="handlerUser">
                    <icon-svg icon-class="relation"></icon-svg>关联用户
                </el-button>
            </el-button-group>
        </el-col>
        <el-col :span="8" style='margin-top:15px;'>
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
            <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="groupTree" @node-click="getNodeData" default-expand-all> </el-tree>
        </el-col>
        <el-col :span="16" style='margin-top:15px;'>
            <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
            <el-form-item label="名称">
                <el-input v-model="form.name" :disabled="formEdit"></el-input>
            </el-form-item>
            <el-form-item label="编码">
                <el-input v-model="form.code" :disabled="formEdit"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input v-model="form.description" :disabled="formEdit"></el-input>
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
                <el-button type="primary" v-if="groupManager_btn_edit" @click="update">更新</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
                <el-button type="primary" v-if="groupManager_btn_add" @click="create">保存</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            </el-form>
        </el-col>

    </el-row>
</template>

<script>
import {queryTree,insertGroup,queryGroupById,updateGroupById,queryGroupByParentIdCount} from 'api/group/index'
export default {
    name:'groupDetail',
    data(){
        return {
            groupManager_btn_add:true,
            groupManager_btn_edit:true,
            groupManager_btn_del:true,
            groupManager_btn_resourceManager:true,
            groupManager_btn_userManager:true,
            groupManager_btn_edit:true,
            groupManager_btn_add:true,
            labelPosition:'right',
            filterText:"",
            treeData:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            listQuery: {
                groupTypeId: this.groupTypeId,
            },
            currentId:"",
            formEdit:true,
            form:{

            },
            formStatus:"",
        }
    } ,
    props: {
        groupTypeId: {
        
        }
    },
    created(){
        this.queryGroupRoot();
        this.queryList();
    },
    methods:{
        async queryGroupRoot(){
            await this.$store.dispatch('QueryDictByDictType',{
                dictType:'GROUPROOT'
            }).then(list=>{
                if(list.length>0){
                    this.currentId=list[0].label;
                }
            })
        },
        queryList(){
            queryTree(this.listQuery).then(res=>{
                this.treeData = res;
            })
        },
        filterNode(){

        },
        getNodeData(data){
            if (!this.formEdit) {
                this.formStatus = 'update';
            }
            queryGroupById(data.id).then(group=> {
                this.form =group;
            });
            this.currentId = data.id;
        },
        handlerAdd(){
            this.resetForm();
            this.formEdit = false;
            this.formStatus = 'create';
        },
        handlerEdit(){
            if (this.form.id) {
                this.formEdit = false;
                this.formStatus = 'update';
            }
        },
        handleDelete(){
            if(this.form.id){
                queryGroupByParentIdCount(this.form.id).then(count=>{
                    if(count<=0){
                        this.$confirm('此操作将会永久删除菜单信息，请再次确认是否删除？', '确认信息', {
                                    distinguishCancelAndClose: true,
                                    confirmButtonText: '删除',
                                    cancelButtonText: '放弃删除'
                        }).then(() => {
                            deleteGroupById(this.form.id).then((res)=>{
                                this.queryList();
                                this.onCancel();
                                this.form={};
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
                    }else{
                        this.$message({
                            type: 'info',
                            message: "删除菜单之前,请先删除子菜单"
                        })
                    }
                })
            }else{
                this.$message({
                    type: 'info',
                    message: "请选择需要删除的菜单"
                })
            }
        },
        handlerAuthority(){

        },
        handlerUser(){

        },
        resetForm() {
            this.form = {
                parentId: this.currentId,
                code: undefined,
                name: undefined,
                description: undefined,
                groupTypeId: this.groupTypeId
            };
        },
        create(){
            insertGroup(this.form).then(() => {
                this.queryList();
                this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                });
            });
        },
        update() {
            updateGroupById(this.form).then(() => {
                this.queryList();
                this.$notify({
                    title: '成功',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                });
            });
        },
        onCancel() {
            this.formEdit = true;
            this.formStatus = '';
        },
    }
}
</script>

<style scoped>

</style>