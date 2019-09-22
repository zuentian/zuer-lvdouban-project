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
{
  path: '/404',
  component: _import('error/404'),
  hidden: true
},
{
  path: '/401',
  component: _import('error/401'),
  hidden: true
},
{
   path:'/',
   component:Layout,
   redirect:'/dashboard',
   name:"首页",
   hidden:true,
   children:[{
     path:'dashboard',
     //component:_import('dashboard/index')
   },
  ]
}
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
  //name:'基础配置管理',
  //icon:'setting',
  authority:'baseManager',
  children:[{
    path: 'userManager',
    //icon: 'fa-user',
    //component:'@/views/admin/user/index',
    component: _import('admin/user/index'),
    //name: '用户管理',
    authority: 'userManager'
  },{
    path: 'dictManager',
    //icon: 'dict-setting',
    component: _import('admin/dict/index'),
    //name: '数据字典',
    authority: 'dictManager'
  },{
    path: 'menuManager',
    //icon: 'menu-setting',
    component: _import('admin/menu/index'),
    //name: '菜单管理',
    authority: 'menuManager'
  },{
    path:'groupTypeManager',
    //icon:'groupType-setting',
    component:_import('admin/groupType/index'),
    //name:'角色类型管理',
    authority:'groupTypeManager'
  },{
    path: 'groupManager',
    //icon: 'group-setting',
    component: _import('admin/group/index'),
    //name: '角色权限管理',
    authority: 'groupManager'
  }]
}]