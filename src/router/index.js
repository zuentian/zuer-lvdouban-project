import Vue from 'vue'
import Router from 'vue-router'
const _import=require('./_import_'+process.env.NODE_ENV);

import Layout from '@/views/layout/Layout';
Vue.use(Router)

export const constantRouterMap=[{
  path:'/login',
  component:_import('login/index'),
  hidden:true
},
// {
//   path:'/authredirect',
//   component:_import('login/authredirect'),
//   hidden:true
// }
]

export default new Router({
  scrollBehavior:()=>({//滚动行为
    y:0
  }),
  routes:constantRouterMap
})

export const asyncRouterMap=[{
  path:'/baseManager',
  component:Layout,
  name:'基础配置管理',
  icon:'setting',
  authority:'baseManager',
  children:[{
    path: 'userManager',
    icon: 'fa-user',
    component: _import('admin/user/index'),
    name: '用户管理',
    authority: 'userManager'
  }]
}]