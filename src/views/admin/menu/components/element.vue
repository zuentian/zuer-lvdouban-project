<template>
    <div class="app-container calendar-list-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="资源名称" v-model="listQuery.name"> </el-input>
            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" v-if="menuManager_btn_element_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        </div>
        <el-table  :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
            <el-table-column min-width='180px' align="center" label="资源编码"  prop="code"></el-table-column>
            <el-table-column min-width="100px" align="center" label="资源名称" prop="name"></el-table-column>
            <el-table-column min-width="80px" align="center" label="资源请求类型" prop="method" :formatter="formatterMethod"></el-table-column>
            <el-table-column v-if='menuManager_btn_element_edit||menuManager_btn_element_del' fixed="right" align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button v-if="menuManager_btn_element_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
                    <el-button v-if="menuManager_btn_element_del" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading&&total>0" style="text-align:center" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
            <el-form-item label="资源编码" prop="code">
                <el-input v-model="form.code" placeholder="请输入资源编码"></el-input>
            </el-form-item>
            <el-form-item label="资源名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入资源名称"></el-input>
            </el-form-item>
            <el-form-item label="资源请求类型" prop="method">
                <el-select class="filter-item" v-model="form.method" placeholder="请输入资源请求类型">
                <el-option v-for="item in  methodOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
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
import { mapGetters } from 'vuex';
import {query,addElement,queryElementById,updateElementById,deleteElementById} from 'api/element/index'
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
            dialogStatus:"",
            dialogFormVisible:false,
            form:{

            },
            textMap:{
                update: '编辑',
                create: '创建'
            },
            rules:{
                code: [
                    {required: true,message: '请输入资源编码',trigger: 'blur'}
                ],
                name: [
                    {required: true,message: '请输入资源名称',trigger: 'blur'},
                    {min: 2,max: 20,message: '长度在 2 到 20 个字符',trigger: 'blur'}
                ],
                method: [
                    {required: true,message: '请输入资源请求类型',trigger: 'blur'},
                    {min: 3,max: 20,message: '长度在 3 到 20 个字符',trigger: 'blur'}
                ]
            },
            typeOptions:['uri', 'button'],
            methodOptions:[],//列表资源请求类型获取
            methodMaps:null,//列表资源请求类型字典翻译
        }
    },
    computed: {
        ...mapGetters([
        'elements'
        ])
    },
    methods:{
        queryList(param){
            this.listLoading=true;
            this.listQuery.menuId = param;
            query(this.listQuery).then(res=>{
                this.list=res.list;
                this.total=res.count;
            })
            this.listLoading=false;
        },
        handleFilter(){
            this.queryList(this.menuId);
        },
        handleCreate(){
            this.reset();
            this.dialogStatus = 'create';
            this.dialogFormVisible = true;
        },
        handleCurrentChange(val){
            this.page=val;
            this.queryList();
        },
        handleSizeChange(val){
            this.limit=val;
            this.queryList();
        },
        reset(){
            this.form={}
        },
        async getElementMethods(){
            await this.$store.dispatch('QueryDictByDictType',{
                dictType:'ELEMENTMETHOD'
            }).then(list=>{
                    this.methodOptions=list;
                    const maps={};
                    for(var i=0;i<list.length;i++){
                        maps[list[i].value]=list[i].label;
                    }
                    this.methodMaps=maps
                }
            )
        },
        formatterMethod(row, column, cellValue, index){
            return this.methodMaps[cellValue];
        },
        cancel(formName) {
            this.dialogFormVisible = false;
            const set = this.$refs;
            set[formName].resetFields();
        },
        create(formName){
            const set = this.$refs;
            this.form.menuId = this.menuId;
            set[formName].validate(valid => {
                if (valid) {
                    addElement(this.form).then(() => {
                        this.dialogFormVisible = false;
                        this.queryList(this.menuId);
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
            })
        },
        update(formName){
            const set = this.$refs;
            set[formName].validate(valid => {
                if (valid) {
                    updateElementById(this.form).then(() => {
                        this.dialogFormVisible = false;
                        this.queryList(this.menuId);
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
            })
        },
        handleUpdate(row){
            queryElementById(row.id).then(data => {
                this.form = data;
                this.dialogFormVisible = true;
                this.dialogStatus = 'update';
            });
        },
        handleDelete(row){
            
            this.$confirm('此操作将会永久删除菜单信息，请再次确认是否删除？', '确认信息', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '删除',
                        cancelButtonText: '放弃删除'
            }).then(() => {
                deleteElementById(row.id).then((res)=>{
                    this.queryList(this.menuId);
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
        }
    },
    created() {
        this.getElementMethods();
        //this.menuManager_btn_element_add = this.elements['menuManager:btn_element_add'];//功能权限增删改，最好不要加权限
        //this.menuManager_btn_element_del = this.elements['menuManager:btn_element_del'];//功能权限增删改，最好不要加权限
        //this.menuManager_btn_element_edit = this.elements['menuManager:btn_element_edit'];//功能权限增删改，最好不要加权限
    }
}
</script>
<style scoped>

</style>

