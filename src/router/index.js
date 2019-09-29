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
  path: '/error',
  component:Layout,
  //redirect:'/404',
  hidden: true,
  name:'错误',
  children:[{
    path:'info',
    name:'错误提示',
    component: _import('error/404'),
  }]
},
//这是展示电影详细信息的模块，因为不需要从数据库里取数据，又要实现跳转，所以没有采用动态加载
{
  path: '/movie',
  component:Layout,
  hidden: true,
  name:'电影频道',
  children:[{
    path:'movieDetail/:id',
    name:'电影详细信息',
    component: _import('movie/movieInfo/detail'),
  }]
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