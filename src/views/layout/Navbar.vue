<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <levelbar></levelbar>
    <tabs-view></tabs-view>
    <!-- <error-log v-if="log.length>0" class="errLog-container" :logsList="log"></error-log> -->
    <!-- <screenfull class='screenfull'></screenfull> --><!--全屏功能，暂时不用-->
    
    <el-dropdown class="avatar-container" >
      <div class="avatar-wrapper"> 
        <i class="el-icon-caret-bottom"></i> 
        <span trigger="click">{{nameBak}}-{{name}}</span>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class='inlineBlock' to="/">
          <el-dropdown-item> 首页 </el-dropdown-item>
        </router-link>
        <!-- <a target='_blank' href="">
          <el-dropdown-item> 项目地址 </el-dropdown-item>
        </a> -->
        <el-dropdown-item divided><span @click="logout" style="display:block;">退出</span></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="avatar-container1" >
      <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'" @click="editAvatar">
    </div>
        
    <el-dialog title="设置头像" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <cropper></cropper>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-menu>

</template>

<script>
import { mapGetters } from 'vuex';
import Levelbar from './Levelbar';
import TabsView from './TabsView';
import Cropper from 'components/Cropper';
import Hamburger from 'components/Hamburger';
//import Screenfull from 'components/Screenfull';
//import ErrorLog from 'components/ErrLog';
//import errLogStore from 'store/errLog';
export default {
  components: {
    Levelbar,
    TabsView,
    Hamburger,
    Cropper,
    //ErrorLog,
    //Screenfull
  },
  data() {
    return {
      //log: errLogStore.state.errLog
      dialogVisible:false,
    }
  },
  mounted(){
  },
  computed: { ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'nameBak',
    ])
    
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut')
        .then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    editAvatar(){
      console.log("编辑图片")
      this.dialogVisible=true;
    },
    handleClose(done) {
      done();
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0 !important;
    .hamburger-container {
        line-height: 58px;
        height: 50px;
        float: left;
        padding: 0 10px;
    }
    .errLog-container {
        display: inline-block;
        position: absolute;
        right: 150px;
    }
    .screenfull {
        position: absolute;
        right: 90px;
        top: 16px;
        color: red;
    }
    .avatar-container1 {
      float:right;
      height: 40px;
      margin-right: 0px;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
      
    }
    .avatar-container {
      float:right;
      height: 50px;
      margin-right: 20px;
      .avatar-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .el-icon-arrow-down {
          margin-left: 5px;
        }
      }
    }
}
</style>
