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

export const asyncRouterMap=[]