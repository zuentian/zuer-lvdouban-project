<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-button-group>
            <el-button type="primary" v-if="menuManager_btn_add" icon="el-icon-plus" @click="handlerAdd">添加</el-button>
            <el-button type="primary" v-if="menuManager_btn_edit" icon="el-icon-edit" @click="handlerEdit">编辑</el-button>
            <el-button type="primary" v-if="menuManager_btn_del" icon="el-icon-delete" @click="handleDelete">删除</el-button>
            </el-button-group>
        </div>
        
    <el-row>
        <el-col :span="8" style='margin-top:15px;'>
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
            <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode"
            ref="menuTree" @node-click="getNodeData" default-expand-all  >
            </el-tree>
        </el-col>
        <el-col :span="16" style='margin-top:15px;'>
            <el-card class="box-card">
            <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
            <el-form-item label="路径编码" prop="code">
                <el-input v-model="form.code" :disabled="formEdit&&formAdd" placeholder="请输入路径编码"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" :disabled="formEdit&&formAdd"  placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="当前节点" prop="id" v-if="form.id">
                <el-input v-model="form.id" :disabled="formEdit&&formAdd" placeholder="请输入父级节点"   readonly></el-input>
            </el-form-item>
            <el-form-item label="父级节点" prop="parentId" v-if="form.parentId">
                <el-input v-model="form.parentId" :disabled="formEdit&&formAdd" placeholder="请输入父级节点"   readonly></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input v-model="form.icon" :disabled="formEdit&&formAdd" placeholder="请输入图标"></el-input>
            </el-form-item>
                <el-form-item label="资源路径" prop="href">
                <el-input v-model="form.href" :disabled="formEdit&&formAdd" placeholder="请输入资源路径"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select class="filter-item" v-model="form.type"  :disabled="formEdit&&formAdd"  placeholder="请输入资源请求类型">
                <el-option v-for="item in  typeOptions" :key="item" :label="item" :value="item"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="orderNum">
                <el-input v-model="form.orderNum" :disabled="formEdit&&formAdd" placeholder="请输入排序"></el-input>
            </el-form-item>
            <el-form-item label="描述"   prop="description">
                <el-input v-model="form.description" :disabled="formEdit&&formAdd" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
                <el-button type="primary" @click="update">更新</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
                <el-button type="primary" @click="create">保存</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            </el-form>
            </el-card>
            <el-card class="box-card">
                <span>按钮或资源</span>
                <menu-element :menuId='currentId' ref="menuElement"></menu-element>
            </el-card>
        </el-col>


    </el-row>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import {queryMenuTree,queryMenuById,addMenu,updateMenu,deleteMenuById,queryMenuByParentIdCount} from 'api/menu/index'
export default {
    //name:'menu',
    components:{
        'menu-element': () => import('./components/element')
    },
    data(){
        return {
            menuManager_btn_add:false,
            menuManager_btn_edit:false,
            menuManager_btn_del:false,
            filterText:"",
            listQuery: {
                title: ""//因为用的是element自带的过滤方法，所以用不到
            },
            treeData:[],
            defaultProps: {
                children: 'children',
                label: 'title'
            },
            form:{
                id:undefined,
                parentId:undefined,
                orderNum:undefined,
                title:undefined,
                type:undefined,
                icon:undefined,
                code:undefined,
                href:undefined,
                path:undefined,
                description:undefined,
            },
            formStatus:"",
            labelPosition:'right',
            formEdit:true,
            formAdd:true,
            typeOptions:['dirt','menu'],
            currentId:"",
            root:"",
        }
    },
    computed: {
        ...mapGetters([
        'elements'
        ])
    },
    methods:{
        queryList(){
            queryMenuTree(this.listQuery).then(list=>{
                this.treeData=list;
            })
        },
        handlerAdd(){
            if(this.formAdd){
                this.formEdit=true;
                this.resetForm();
                this.formAdd=false;
                this.formStatus='create';
            }
        },
        handlerEdit(){
            this.formAdd=true;
            this.formStatus='';
            if(this.form.id){
                this.formEdit=false;
                this.formStatus='update';
            }
        },
        handleDelete(){
            if(this.form.id){
                queryMenuByParentIdCount(this.form.id).then(count=>{
                    if(count<=0){
                        this.$confirm('此操作将会永久删除菜单信息，请再次确认是否删除？', '确认信息', {
                                    distinguishCancelAndClose: true,
                                    confirmButtonText: '删除',
                                    cancelButtonText: '放弃删除'
                        }).then(() => {
                            deleteMenuById(this.form.id).then((res)=>{
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
        filterNode(value,data){
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        getNodeData(data,node,){
            if(node.level!=1||node.expanded){
                this.formAdd=true;
                this.formStatus='';
                if (!this.formEdit) {
                    this.formStatus = 'update';
                }
                queryMenuById(data.id).then(menu => {
                    this.form = menu;
                    this.formEdit=true;
                    this.currentId = menu.id;
                }).finally(() => {
                    this.$refs.menuElement.queryList(this.currentId);//如果将这个子类里方法放在then里面，会比this.currentId先执行
                });
                
            }else{
                this.form={};
                this.form.id=this.root;
                this.formAdd=true;
                this.formStatus='';
                this.formEdit=true;

                this.currentId="";
                this.$refs.menuElement.queryList(this.currentId);
            }
        },
        resetForm(){
            this.form={
                parentId:this.form.id,
                orderNum:undefined,
                title:undefined,
                type:undefined,
                icon:undefined,
                code:undefined,
                href:undefined,
                path:undefined,
                description:undefined,
            };
        },
        onCancel(){
            this.formEdit = true;
            this.formAdd=true;
            this.formStatus = '';
        },
        create(){
            addMenu(this.form).then(() => {
                this.queryList();
                this.onCancel();
                this.$notify({
                    title: '成功',
                    message: '保存成功',
                    type: 'success',
                    duration: 2000
                });
            });
        },
        update(){
            updateMenu(this.form).then(()=>{
                this.queryList();
                this.onCancel();
                this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                });
            })
        },
        async queryMenuRoot(){
            await this.$store.dispatch('QueryDictByDictType',{
                dictType:'MENUROOT'
            }).then(list=>{
                if(list.length>0){
                    this.root=list[0].label;
                    this.form.id=list[0].label;
                }
            })
            this.queryList();
            this.$refs.menuElement.queryList("");
        },
    },
    created(){
        this.queryMenuRoot();
        this.menuManager_btn_add = this.elements['menuManager:btn_add'];
        this.menuManager_btn_del = this.elements['menuManager:btn_del'];
        this.menuManager_btn_edit = this.elements['menuManager:btn_edit'];
    },
    watch: {
        filterText(val) {
            this.$refs.menuTree.filter(val);
        }
    }
}
</script>
<style scoped>

</style>