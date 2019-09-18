
import {getAllMenus} from 'api/login'
import {asyncRouterMap,constantRouterMap} from '@/router'
const permission={
    state:{
        routers:constantRouterMap,
        addRouters:[]
    },
    mutations:{
        SET_ROUTERS:(state,routers)=>{
            state.addRouters=routers
            state.routers=constantRouterMap.concat(routers)
        }
    },
    actions:{
        GenerateRoutes({commit},menus){
            return new Promise(resolve=>{
                console.log("menus---------",menus);
                const accessedRouters=formate(menus);
                console.log("accessedRouters---",menus)
                // getAllMenus().then(data=>{
                //     const menuDatas={};
                //     for(let i=0;i<data.length;i++){
                //         menuDatas[data[i].code]=data[i];
                //     }
                //     const accessedRouters=filterAsyncRouter(asyncRouterMap,menus,menuDatas);
                //     console.log("符合用户角色权限的路由accessedRouters",accessedRouters);
                //     commit('SET_ROUTERS',accessedRouters);
                //     resolve();
                // })
            })
        }
    }
}
function formate(menus){
    for(var i=0;i<menus.length;i++){
        menus[i].component=getViews(menus[i].component);
        if(menus[i].children!=null&&menus[i].children.length>0){
            formate(menus[i].children);
        }
    }
}
function getViews(path) {
    return resolve => {
      require.ensure([], (require) => {
        resolve(require('@/view' + path + '.vue'))
      })
    }
  }
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap,menus,menuDatas){
    console.log("asyncRouterMap,menus,menuDatas1111:",asyncRouterMap);
    console.log("asyncRouterMap,menus,menuDatas2222:",menus);
    console.log("asyncRouterMap,menus,menuDatas3333:",menuDatas);
    const accessedRouters=asyncRouterMap.filter(route=>{
        if(hasPermission(menus,route)){
            route.name=menuDatas[route.authority].title;
            route.icon=menuDatas[route.authority].icon;
            if(route.children && route.children.length){
                route.children=filterAsyncRouter(route.children,menus,menuDatas);
            }
            return true
        }
        return false
    })
   
    return accessedRouters
}

function hasPermission(menus,route){
    console.log("menus,route",menus,route)
    if(route.authority){
        if(menus[route.authority]!==undefined){
            return menus[route.authority];
        }else{
            return false;
        }
    }else{
        return true;
    }
}
export default permission;