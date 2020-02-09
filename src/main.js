import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'assets/custom-theme/index.css' // 换肤版本element-ui css
import NProgress from 'nprogress'// Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条 样式
import vueWaves from './directive/waves';// 水波纹指令
import IconSvg from 'components/Icon-svg';// svg 组件
import { getToken } from 'utils/auth';
import VueCropper from 'vue-cropper';//图片裁剪vue-cropper
import VueQuillEditor from 'vue-quill-editor';//富文本编辑器

Vue.use(VueQuillEditor);
Vue.use(VueCropper);
//配置icon-svg组件 start
Vue.component('icon-svg',IconSvg)
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/assets/icons', false, /\.svg$/)//要用这个'/\.svg$/'需要在webpack.base.conf.js里配置
const iconMap = requireAll(req)
//配置icon-svg组件 end
Vue.use(ElementUI);
Vue.use(vueWaves);

const whiteList=['/login','/authredirect']//不重定向白名单

Vue.config.productionTip = false

router.beforeEach((to,from,next)=>{
  NProgress.start();//开启Progress
  if(getToken()){//判断是否有token
    if(to.path=='/login'){
      next({path:'/'});
    }else{
      if (store.getters.permissionMenus==undefined) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(info => { // 拉取user_info
          console.log("未取得user_info数据,开始重新拉取：",info,store.getters.permissionMenus)
          // const menus = store.getters.menus;
          // for (let i = 0; i < info.menus.length; i++) {
          //   menus[info.menus[i].code] = true;
          // }
          store.dispatch('GenerateRoutesSimple',  store.getters.routerTrees).then(() => { // 可以生成按需懒加载访问的路由表
          //store.dispatch('GenerateRoutes', menus).then(() => { //全加载方式，此处不再采用
          
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            //这里还有一个小hack(暴力解决)的地方，就是router.addRoutes之后的next()可能会失效，因为可能next()的时候路由并没有完全add完成
            next({ ...to }); // hack方法 确保addRoutes已完成
          }).catch(err=>{
          })
        }).catch(() => {
            //前端退出
            store.dispatch('LogOut').then(() => {
            next({ path: '/login' });
          })
        })
      } else {
      //  else {
      //   // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
      //   if (hasPermission(store.getters.roles, to.meta.role)) {
      //     next();//
      //   } else {
        //console.log(to);
        if (to.matched.length === 0) { //当token等信息存在的情况下，输入错误的路由网址，会判断离开的网址，跳转回去
            // console.log("from.path",from.path);  
            // from.path ? next({
            //   path: from.path
            // }) : 
            next('/error/info'); 
        } else {
          next(); //如果匹配到正确跳转
        }
      
      //   }
      //   // 可删 ↑
      }
    }
  }else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login'); // 否则全部重定向到登录页
      NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
})

router.afterEach(() => {
  NProgress.done(); // 结束Progress
});

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
