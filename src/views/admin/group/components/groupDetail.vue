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
import {queryTree,insertGroup} from 'api/group/index'
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
                groupType: this.type,
            },
            currentId:"",
            formEdit:true,
            form:{

            },
            formStatus:"",
        }
    } ,
    props: {
        type: {
        
        }
    },
    created(){
        this.queryList();
    },
    methods:{
        queryList(){
            queryTree(this.listQuery).then(res=>{
                
            })
        },
        filterNode(){

        },
        getNodeData(){

        },
        handlerAdd(){
            this.resetForm();
            this.formEdit = false;
            this.formStatus = 'create';
        },
        handlerEdit(){

        },
        handleDelete(){

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
                groupType: this.type
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
        onCancel() {
            this.formEdit = true;
            this.formStatus = '';
        },
    }
}
</script>

<style scoped>

</style>