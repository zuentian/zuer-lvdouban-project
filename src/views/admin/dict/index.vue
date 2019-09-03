<template>
  <div class="dict container">
    <el-card>
        <div slot="header" style="display:flex;justify-content: space-between;align-items: center;">
            <label style="font-size: 16px;">数据字典</label>
            <el-button type="danger" @click="addDictInfo">新增字典<i class="el-icon-plus" style="margin-left:10px;"></i></el-button>
        </div>
                <el-row>
                <el-col  :span="3" style="text-align:left">
                    <span style="line-height:30px;font-size:16px;font-family:微软雅黑">数据字典类型：</span>
                </el-col>
                <el-col :span="5" >
                    <el-input v-model="dictType" clearable  size="small"></el-input>
                </el-col>
                <el-col  :span="2" style="text-align:center">
                  <el-button type="primary" icon="el-icon-search" size="small"  @click="query">搜索</el-button>
                </el-col>
              </el-row>

    </el-card>
    
    <el-table :data="dictInfo"   style="width: 100%" v-loading="loading" :row-style="{height:'0'}" :cell-style="{padding:'4px'}">
        <el-table-column type="index" > </el-table-column>
        <el-table-column align="center" prop="dictType" label="数据字典类型" min-width='100'></el-table-column>
        <el-table-column align="center" prop="dictTypeName" label="数据字典类型名称" min-width='100' v-loading="loadingDictTypeContent"></el-table-column>
        <el-table-column align="center" prop="dictCode"  label="数据字典编码" min-width='100'></el-table-column> 
        <el-table-column align="center" prop="dictValue"  label="数据字典数值" min-width='100' ></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="100">
        <template slot-scope="scope">
            <el-button @click="updateDictInfo(scope.row)"  type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="deleteDictInfo(scope.row)">删除</el-button>
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

    <el-dialog  title="新增数据字典" :visible.sync="dialogVisible"  width="50%" :before-close="handleClose" :loading="loadingAdd">
      <el-form ref="dictInfoAdd" :model="dictInfoAdd" :rules="rules"  label-width="140px" label-position="right" >
            <div class="well">
                <el-form-item label="数据字典类型" prop="dictType"><el-input v-model.trim="dictInfoAdd.dictType" @blur="getDictTypeContent"></el-input></el-form-item>
                <el-form-item label="数据字典类型名称" prop="dictTypeName"><el-input v-model.trim="dictInfoAdd.dictTypeName"></el-input></el-form-item>
                <el-form-item label="数据字典编码" prop="dictCode"><el-input v-model.trim="dictInfoAdd.dictCode"></el-input></el-form-item>
                <el-form-item label="数据字典数值" prop="dictValue"><el-input v-model.trim="dictInfoAdd.dictValue"></el-input></el-form-item>
            </div>
        </el-form>
      <span slot="footer" class="dialog-footer">
        
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="resetForm('dictInfoAdd')">重置</el-button>
      <el-button type="primary" @click="submitForm('dictInfoAdd')">确 定</el-button>
      </span>
    </el-dialog>

     <el-dialog  title="修改数据字典" :visible.sync="dialogVisibleEdit"  width="50%" :before-close="handleClose" :loading="loadingEdit">
      <el-form ref="dictInfoEdit" :model="dictInfoEdit" :rules="ruleEdits"  label-width="120px" label-position="right" >
            <div class="well">
                <el-form-item label="数据字典类型" prop="dictType"><el-input v-model.trim="dictInfoEdit.dictType" :disabled="true"></el-input></el-form-item>
                <el-form-item label="数据字典类型名称" prop="dictTypeName"><el-input v-model.trim="dictInfoEdit.dictTypeName" :disabled="true"></el-input></el-form-item>
                <el-form-item label="数据字典编码" prop="dictCode"><el-input v-model.trim="dictInfoEdit.dictCode"></el-input></el-form-item>
                <el-form-item label="数据字典数值" prop="dictValue"><el-input v-model.trim="dictInfoEdit.dictValue"></el-input></el-form-item>
            </div>
        </el-form>
      <span slot="footer" class="dialog-footer">
        
      <el-button @click="dialogVisibleEdit = false">取 消</el-button>
      <el-button @click="resetFormEdit('dictInfoEdit')">重置</el-button>
      <el-button type="primary" @click="submitFormEdit('dictInfoEdit')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import { mapActions } from 'vuex'
import { async } from 'q';

export default {
  name: 'dict',
  data () {
    return {
      pageSize:10,
      total:0,
      currentPage:1,
      dictInfo:[],
      isShowPagination:false,
      loading:false,
      loadingAdd:false,
      loadingEdit:false,
      loadingDictTypeContent:false,
      dictType:"",
      dialogVisible:false,
      dialogVisibleEdit:false,
      dictInfoAdd:{
          dictType:"",
          dictTypeName:"",
          dictCode:"",
          dictValue:"",
      },
      dictInfoEdit:{
        dictType:"",
        dictTypeName:"",
        dictCode:"",
        dictValue:"",
      },
      rules: {
        dictType: [
            { required: true, message: '请输入字典类型', trigger: 'blur' },
            { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        dictCode: [
            { required: true, message: '请输入字典编码', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
      },
      ruleEdits:{
        dictCode: [
            { required: true, message: '请输入字典编码', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    ...mapActions([
      'QueryDict',
      'GetDictTypeName',
      'QueryDictByDictId',
      'EditDictByDictId',
      'DeleteDictByDictId',
    ]),
    async query(pageSize,currentPage){

      this.loading = true;
      await this.$store.dispatch('QueryDict', {
        currentPage:this.currentPage,
        pageSize:this.pageSize,
        dictType:this.dictType,
      }).then(res => {
        this.dictInfo=res.list;
        this.total=res.count;
        if(this.total>0){
            this.isShowPagination=true;
        }
      }).catch((err) => {
        this.$store.commit('SHOW_ERROR_TOAST', err.data.message || err.data)        
      }).finally(() => {
        this.loading = false
      })
    },
    addDictInfo(){
      this.dialogVisible=true;
      this.dictInfoAdd={};
    },
    async submitForm(formName){
      this.loadingAdd=true;
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch("AddDict",{
            dictInfoAdd:this.dictInfoAdd,
          }).then(res=>{
            this.$notify({title: '添加成功',message: '',type: 'success'});
            this.dialogVisible=false;
            this.query(this.pageSize,this.currentPage);
          }).catch(err=>{
          }).finally(() => {
              this.loadingAdd = false
          })
        }else {
          this.$store.commit('SHOW_ERROR_TOAST', "信息不完整，无法添加")    
          this.loadingAdd = false
          return false;
        }
      })
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
      this.dictInfoAdd={};
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
    async deleteDictInfo(row){
      await this.$store.dispatch("DeleteDictByDictId",{
        dictId:row.dictId
      }).then(res=>{
        this.$notify({title: '删除成功',message: '',type: 'success'});
        this.query(this.pageSize,this.currentPage);
      }).catch(err=>{
          this.$store.commit('SHOW_ERROR_TOAST', err.data.message || err.data)    
      }).finally(() => {
      })
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
    }

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
