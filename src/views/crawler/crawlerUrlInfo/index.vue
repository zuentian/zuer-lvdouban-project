<template>
  <div class="dict container">
    <el-card>
        <div slot="header" style="display:flex;justify-content: space-between;align-items: center;">
            <label style="font-size: 16px;">爬虫地址信息</label>
            <el-button type="danger" @click="addCrawlerAccountInfo">新增爬虫地址<i class="el-icon-plus" style="margin-left:10px;"></i></el-button>
        </div>
                <el-row>
                <el-col  :span="3" style="text-align:left">
                    <span style="line-height:30px;font-size:16px;font-family:微软雅黑">网站名称：</span>
                </el-col>
                <el-col :span="5" >
                    <el-input v-model="typeName" clearable  size="small"></el-input>
                </el-col>
                <el-col  :span="2" style="text-align:center">
                  <el-button type="primary" icon="el-icon-search" size="small"  @click="query">搜索</el-button>
                </el-col>
              </el-row>

    </el-card>
    
    <el-table :data="crawlerUrlInfo"   style="width: 100%" v-loading="loading" :row-style="{height:'0'}" :cell-style="{padding:'4px'}">
        <el-table-column type="index" > </el-table-column>
        <el-table-column align="center" prop="typeName" label="网站名称" min-width='100'></el-table-column>
        <el-table-column align="center" prop="type" label="网站类型" min-width='100'></el-table-column>
        <el-table-column align="center" prop="urlName"  label="url名称" min-width='100'></el-table-column> 
        <el-table-column align="center" prop="url"  label="url地址" min-width='400' ></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="100">
        <template slot-scope="scope">
            <el-button @click="updateCrawlerUrlInfo(scope.row)"  type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="deleteCrawlerUrlInfo(scope.row)">删除</el-button>
        </template>
        </el-table-column>
  
    </el-table>
    <div v-show="isShowPagination" class="block" text-align="center">
        <el-pagination 
            @size-change="handleSizeChange"  
            @current-change="handleCurrentChange" 
            :current-page="currentPage"
            :page-sizes="[5,10,20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
    <div class="movieInfo  container">
        
    </div>

    <el-dialog  title="新增登录账号" :visible.sync="dialogVisible"  width="50%" :before-close="handleClose" :loading="loadingAdd">
      <el-form ref="crawlerUrlInfoAdd" :model="crawlerUrlInfoAdd" :rules="rules"  label-width="140px" label-position="right" >
            <div class="well">
                <el-form-item label="网站名称" prop="typeName"><el-input v-model.trim="crawlerUrlInfoAdd.typeName"></el-input></el-form-item>
                <el-form-item label="网站类型" prop="type"><el-input v-model.trim="crawlerUrlInfoAdd.type"></el-input></el-form-item>
                <el-form-item label="url名称" prop="urlName"><el-input v-model.trim="crawlerUrlInfoAdd.urlName"></el-input></el-form-item>
                <el-form-item label="url地址" prop="url"><el-input v-model.trim="crawlerUrlInfoAdd.url"></el-input></el-form-item>
            </div>
        </el-form>
      <span slot="footer" class="dialog-footer">
        
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="resetForm('crawlerUrlInfoAdd')">重置</el-button>
      <el-button type="primary" @click="submitForm('crawlerUrlInfoAdd')">确 定</el-button>
      </span>
    </el-dialog>

     <el-dialog  title="修改登录账号" :visible.sync="dialogVisibleEdit"  width="50%" :before-close="handleClose" :loading="loadingEdit">
      <el-form ref="crawlerUrlInfoEdit" :model="crawlerUrlInfoEdit" :rules="ruleEdits"  label-width="140px" label-position="right" >
            <div class="well">
                <el-form-item label="网站名称" prop="typeName"><el-input v-model.trim="crawlerUrlInfoEdit.typeName"></el-input></el-form-item>
                <el-form-item label="网站类型" prop="type"><el-input v-model.trim="crawlerUrlInfoEdit.type"></el-input></el-form-item>
                <el-form-item label="url名称" prop="urlName"><el-input v-model.trim="crawlerUrlInfoEdit.urlName"></el-input></el-form-item>
                <el-form-item label="url地址" prop="url"><el-input v-model.trim="crawlerUrlInfoEdit.url"></el-input></el-form-item>
            </div>
        </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisibleEdit = false">取 消</el-button>
      <el-button type="primary" @click="submitFormEdit('crawlerUrlInfoEdit')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {  Message, MessageBox } from 'element-ui';
import { addCrawlerUrlInfo,queryPage,queryById,deleteById,updateCrawlerUrlInfoById } from 'api/crawler/crawlerUrlInfo/index.js'

export default {
  name: 'crawlerUrlInfo',
  data () {
    return {
      pageSize:10,
      total:0,
      currentPage:1,
      crawlerUrlInfo:[],
      isShowPagination:false,
      loading:false,
      loadingAdd:false,
      loadingEdit:false,
      typeName:"",
      dialogVisible:false,
      dialogVisibleEdit:false,
      crawlerUrlInfoAdd:{
        id:"",
        typeName:"",
        type:"",
        urlName:"",
        url:"",
      },
      crawlerUrlInfoEdit:{
        id:"",
        typeName:"",
        type:"",
        urlName:"",
        url:"",
      },
      rules: {
        typeName: [
            { required: true, message: '请输入网站名称', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        type: [
            { required: true, message: '请输入网站类型', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        urlName: [
            { required: true, message: '请输入url名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
      },
      ruleEdits:{
        typeName: [
            { required: true, message: '请输入网站名称', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        type: [
            { required: true, message: '请输入网站类型', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        urlName: [
            { required: true, message: '请输入url名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    async query(pageSize,currentPage){
      this.loading = true;
      queryPage({
        currentPage:this.currentPage,
        pageSize:this.pageSize,
        typeName:this.typeName,
      }).then(res => {
        this.crawlerUrlInfo=res.list;
        this.total=res.count;
        if(this.total>0){
            this.isShowPagination=true;
        }
      }).catch((err) => {      
      }).finally(() => {
        this.loading = false
      })
    },
    addCrawlerAccountInfo(){
      this.dialogVisible=true;
      this.crawlerUrlInfoAdd={};
    },
    async submitForm(formName){
      this.loadingAdd=true;
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          addCrawlerUrlInfo({
            crawlerUrlInfoAdd:this.crawlerUrlInfoAdd,
          }).then(res=>{
            this.$notify({title: '添加成功',message: '',type: 'success'});
            this.dialogVisible=false;
            this.query(this.pageSize,this.currentPage);
          }).catch(err=>{
          }).finally(() => {
              this.loadingAdd = false
          })
        }else { 
          this.loadingAdd = false
          return false;
        }
      })
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
      this.crawlerUrlInfoAdd={};
    },
    handleSizeChange(val){
        this.pageSize=val;
        this.query(this.pageSize,this.currentPage);
    },
    handleCurrentChange(val){
        this.currentPage=val;
        this.query(this.pageSize,this.currentPage);
    },
    async updateCrawlerUrlInfo(row){
      this.dialogVisibleEdit=true;
      this.loadingAdd=true;
      queryById(row.id).then(info=>{
        this.crawlerUrlInfoEdit=info;
      }).catch(err=>{
        this.dialogVisibleEdit=false;
      }).finally(() => {
        this.loadingAdd = false
      })
    },
    deleteCrawlerUrlInfo(row){
      this.$confirm('此操作将会永久删除，请再次确认是否删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃删除'
      }).then(() => {
        deleteById(row.id).then(res=>{
          this.$notify({title: '删除成功',message: '',type: 'success'});
          this.query(this.pageSize,this.currentPage);
        }).catch(err=>{
        }).finally(() => {
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
    handleClose(done) {
        //this.$confirm('确认关闭？')
         // .then(_ => {
            done();
        //}).catch(_ => {});
    },
    async submitFormEdit(formName){
      this.loadingEdit=true;
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          updateCrawlerUrlInfoById({
            crawlerUrlInfoEdit:this.crawlerUrlInfoEdit,
          }).then(res=>{
            this.$notify({title: '修改成功',message: '',type: 'success'});
            this.dialogVisibleEdit=false;
            this.query(this.pageSize,this.currentPage);
          }).catch(err=>{
          }).finally(() => {
              this.loadingEdit = false
          })
        }else {  
          this.loadingEdit = false
          return false;
        }
      })
    },
  },
  mounted(){
    this.query(this.pageSize,this.currentPage);
  }
}
</script>

<style scoped>
.block{
    margin:20px auto;
    text-align:center;
}
</style>
