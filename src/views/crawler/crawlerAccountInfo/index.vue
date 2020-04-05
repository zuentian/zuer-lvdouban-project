<template>
  <div class="dict container">
    <el-card>
        <div slot="header" style="display:flex;justify-content: space-between;align-items: center;">
            <label style="font-size: 16px;">登录账号信息</label>
            <el-button type="danger" @click="addCrawlerAccountInfo">新增登录账号<i class="el-icon-plus" style="margin-left:10px;"></i></el-button>
        </div>
                <el-row>
                <el-col  :span="3" style="text-align:left">
                    <span style="line-height:30px;font-size:16px;font-family:微软雅黑">网站名称：</span>
                </el-col>
                <el-col :span="5" >
                    <el-input v-model="web" clearable  size="small"></el-input>
                </el-col>
                <el-col  :span="2" style="text-align:center">
                  <el-button type="primary" icon="el-icon-search" size="small"  @click="query">搜索</el-button>
                </el-col>
              </el-row>

    </el-card>
    
    <el-table :data="crawlerAccountInfo"   style="width: 100%" v-loading="loading" :row-style="{height:'0'}" :cell-style="{padding:'4px'}">
        <el-table-column type="index" > </el-table-column>
        <el-table-column align="center" prop="web" label="网站标识" min-width='100'></el-table-column>
        <el-table-column align="center" prop="webName" label="网站名称" min-width='100'></el-table-column>
        <el-table-column align="center" prop="account"  label="账号" min-width='100'></el-table-column> 
        <el-table-column align="center" prop="flag"  label="状态" :formatter="flagFormatter" min-width='100' ></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="100">
        <template slot-scope="scope">
            <el-button @click="updateCrawlerAccountInfo(scope.row)"  type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="deleteCrawlerAccountInfo(scope.row)">删除</el-button>
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
      <el-form ref="crawlerAccountInfoAdd" :model="crawlerAccountInfoAdd" :rules="rules"  label-width="140px" label-position="right" >
            <div class="well">
                <el-form-item label="网站标识" prop="web"><el-input v-model.trim="crawlerAccountInfoAdd.web"></el-input></el-form-item>
                <el-form-item label="网站名称" prop="webName"><el-input v-model.trim="crawlerAccountInfoAdd.webName"></el-input></el-form-item>
                <el-form-item label="账号" prop="account"><el-input v-model.trim="crawlerAccountInfoAdd.account"></el-input></el-form-item>
                <el-form-item label="密码" prop="password"><el-input type="password" auto-complete="new-password" v-model.trim="crawlerAccountInfoAdd.password"></el-input></el-form-item>
                <el-form-item label="状态" prop="flag">
                  <el-select v-model="crawlerAccountInfoAdd.flag" placeholder="请选择" >
                    <el-option v-for="item in flags" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
            </div>
        </el-form>
      <span slot="footer" class="dialog-footer">
        
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="resetForm('crawlerAccountInfoAdd')">重置</el-button>
      <el-button type="primary" @click="submitForm('crawlerAccountInfoAdd')">确 定</el-button>
      </span>
    </el-dialog>

     <el-dialog  title="修改登录账号" :visible.sync="dialogVisibleEdit"  width="50%" :before-close="handleClose" :loading="loadingEdit">
      <el-form ref="crawlerAccountInfoEdit" :model="crawlerAccountInfoEdit" :rules="ruleEdits"  label-width="140px" label-position="right" >
            <div class="well">
                <el-form-item label="网站标识" prop="web"><el-input v-model.trim="crawlerAccountInfoEdit.web" :disabled="true"></el-input></el-form-item>
                <el-form-item label="网站名称" prop="webName"><el-input v-model.trim="crawlerAccountInfoEdit.webName" :disabled="true"></el-input></el-form-item>
                <el-form-item label="账号" prop="account"><el-input v-model.trim="crawlerAccountInfoEdit.account"></el-input></el-form-item>
                <el-form-item label="密码" prop="password"><el-input  type="password" auto-complete="new-password" v-model.trim="crawlerAccountInfoEdit.password" autoComplete="on" ></el-input></el-form-item>
                <el-form-item label="状态" prop="flag">
                  <el-select v-model="crawlerAccountInfoEdit.flag" placeholder="请选择" >
                    <el-option v-for="item in flags" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
            </div>
        </el-form>
      <span slot="footer" class="dialog-footer">
        
      <el-button @click="dialogVisibleEdit = false">取 消</el-button>
      <el-button @click="resetFormEdit('crawlerAccountInfoEdit')">重置</el-button>
      <el-button type="primary" @click="submitFormEdit('crawlerAccountInfoEdit')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {  Message, MessageBox } from 'element-ui';
import {addCrawlerAccount,queryPage} from 'api/crawler/crawlerAccountInfo/index.js'

export default {
  name: 'crawlerAccountInfo',
  data () {
    return {
      pageSize:10,
      total:0,
      currentPage:1,
      crawlerAccountInfo:[],
      isShowPagination:false,
      loading:false,
      loadingAdd:false,
      loadingEdit:false,
      loadingDictTypeContent:false,
      web:"",
      dialogVisible:false,
      dialogVisibleEdit:false,
      crawlerAccountInfoAdd:{
        web:"",
        webName:"",
        account:"",
        password:"",
        flag:"",
      },
      crawlerAccountInfoEdit:{
        dictType:"",
        dictTypeName:"",
        dictCode:"",
        dictValue:"",
      },
      rules: {
        web: [
            { required: true, message: '请输入网站标识', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        webName: [
            { required: true, message: '请输入网站名称', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
        flag: [
            { required: true, message: '请选择状态', trigger: 'blur' },
        ],
      },
      ruleEdits:{
        dictCode: [
            { required: true, message: '请输入字典编码', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
      },
      flags:[{
        value:"0",
        label:'禁用',
      },{
        value:"1",
        label:'启用',
      }]
    }
  },
  methods:{
    async query(pageSize,currentPage){
      this.loading = true;
      queryPage({
        currentPage:this.currentPage,
        pageSize:this.pageSize,
        web:this.web,
      }).then(res => {
        this.crawlerAccountInfo=res.list;
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
      this.crawlerAccountInfoAdd={};
    },
    async submitForm(formName){
      this.loadingAdd=true;
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          addCrawlerAccount({
            crawlerAccountInfoAdd:this.crawlerAccountInfoAdd,
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
      this.crawlerAccountInfoAdd={};
    },
    handleSizeChange(val){
        this.pageSize=val;
        this.query(this.pageSize,this.currentPage);
    },
    handleCurrentChange(val){
        this.currentPage=val;
        this.query(this.pageSize,this.currentPage);
    },
    async updateDictInfo(row){
      this.dialogVisibleEdit=true;
      this.loadingAdd=true;
      await this.$store.dispatch("QueryDictByDictId",{
        dictId:row.dictId,
      }).then(dictInfo=>{
        this.dictInfoEdit=dictInfo;
      }).catch(err=>{
        this.$store.commit('SHOW_ERROR_TOAST', err.data.message || err.data)
        this.dialogVisibleEdit=false;
      }).finally(() => {
        this.loadingAdd = false
      })
    },
    deleteDictInfo(row){
      this.$confirm('此操作将会永久删除，请再次确认是否删除？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '删除',
        cancelButtonText: '放弃删除'
      }).then(() => {
        this.$store.dispatch("DeleteDictByDictId",{
          dictId:row.dictId
        }).then(res=>{
          this.$notify({title: '删除成功',message: '',type: 'success'});
          this.query(this.pageSize,this.currentPage);
        }).catch(err=>{
            this.$store.commit('SHOW_ERROR_TOAST', err.data.message || err.data)    
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
    async getDictTypeContent(){
      if(this.dictInfoAdd.dictType!=null&&this.dictInfoAdd.dictType!=''&&this.dictInfoAdd.dictType!=undefined){
        this.loadingDictTypeContent=true;
        await this.$store.dispatch("GetDictTypeName",{
          dictType:this.dictInfoAdd.dictType
        }).then(dictTypeName=>{
          if(dictTypeName!=null&&dictTypeName!=''){
            this.dictInfoAdd.dictTypeName=dictTypeName;
          }
        }).catch(err=>{
        }).finally(() => {
          this.loadingDictTypeContent=false;
        })
      }
    },
    async submitFormEdit(formName){
      this.loadingEdit=true;
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch("EditDictByDictId",{
            dictInfoEdit:this.dictInfoEdit,
          }).then(res=>{
            this.$notify({title: '修改成功',message: '',type: 'success'});
            this.dialogVisibleEdit=false;
            this.query(this.pageSize,this.currentPage);
          }).catch(err=>{
          }).finally(() => {
              this.loadingEdit = false
          })
        }else {
          this.$store.commit('SHOW_ERROR_TOAST', "信息不完整，无法添加")    
          this.loadingEdit = false
          return false;
        }
      })
    },
    flagFormatter(row, column, cellValue){
      for(var flag of this.flags){
          if(flag.value==row.flag){
              return flag.label;
          }
      }
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
