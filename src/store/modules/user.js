import {getToken,setToken,removeToken} from 'utils/auth'
import {login,getUserInfo,logOut} from 'api/login'
const user={
    state:{
        name:"",
        token: getToken(),
        introduction:"",
        roles:[],
        menus:null,
        elements:[],
        avatar: '',
        userId:"",
        routerTrees:null,
        permissionMenus:null,
        elements:null,
        username:"",
        nameBak:"",
    },
    mutations:{
        SET_TOKEN:(state,token)=>{
            state.token=token;
        },
        SET_ROLES:(state,roles)=>{
            state.roles=roles;
        },
        SET_MENUS:(state,menus)=>{
            state.menus=menus;
        },
        SET_ELEMENTS:(state,elements)=>{
            state.elements=elements;
        },
        SET_INTRODUCTION:(state,introduction)=>{
            state.introduction=introduction;
        },
        SET_NAME:(state,name)=>{
            state.name=name;
        },
        SET_NAMEBAK:(state,nameBak)=>{
            state.nameBak=nameBak;
        },
        SET_USERNAME:(state,username)=>{
            state.username=username;
        },
        SET_USERID:(state,userId)=>{
            state.userId=userId;
        },
        //页面的菜单树状结构
        SET_PERMISSION_MENUS: (state, permissionMenus) => {
          state.permissionMenus = permissionMenus;
        },
        SET_AVATAR: (state, avatar) => {
          state.avatar = avatar;
        },
        //自由加载路由
        SET_MENUS_SIMPER:(state,routerTrees)=>{
            state.routerTrees=routerTrees;
        },
        //功能按钮权限
        SET_ELEMENT:(state,elements)=>{
            state.elements=elements;
        }
    },
    actions:{
        //登录
        Login({commit},userInfo){
            const username=userInfo.username.trim();
            commit('SET_TOKEN','');
            commit('SET_ROLES',[]);
            commit('SET_MENUS',undefined);
            commit('SET_ELEMENTS',undefined);
            removeToken();
            return new Promise((resolve,reject)=>{
                login(username,userInfo.password).then(token=>{
                    setToken(token);
                    commit('SET_TOKEN',token);
                    resolve();
                }).catch(err=>{
                    reject(err);
                })
            })
        },
        GetInfo({commit,state}){
            return new Promise((resolve,reject)=>{
                getUserInfo(state.token).then(res=>{
                    
                    const data=res;
                    commit('SET_ROLES','admin');
                    commit('SET_USERNAME',data.username);
                    commit('SET_NAME',data.name);
                    commit('SET_NAMEBAK',data.nameBak);
                    commit('SET_USERID',data.id);
                    commit('SET_AVATAR',data.avatar);// 'http://zuentian.gitee.io/zuer-lvdouban-project-picture/photo/girl01.jpg');//默认图片路径，部署在gitee上面的，但需要联网，所以此处不采用
                    commit('SET_INTRODUCTION',data.description);
                    
                    commit('SET_PERMISSION_MENUS',data.menuTrees);
                    // const menus={}
                    // for(let i=0;i<data.menus.length;i++){
                    //     menus[data.menus[i].code]=true;
                    // }
                    // commit('SET_MENUS',menus);
                    commit('SET_MENUS_SIMPER',data.routerTrees);


                    const elements = {};
                    for (let i = 0; i < data.elements.length; i++) {
                        elements[data.elements[i].code] = true;
                    }
                    console.log("功能权限限制：",elements);
                    commit('SET_ELEMENT',elements);

                    resolve(res);
                }).catch(error => {
                    reject(error);
                });
            })
        },
        LogOut({commit}){
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                commit('SET_MENUS', undefined);
                commit('SET_ELEMENTS', undefined);
                commit('SET_PERMISSION_MENUS', undefined);
                removeToken();
                logOut().then(res=>{
                    resolve();
                }).catch(err=>{
                    reject(err);
                })
            });
        },
        SetAvatar({commit},avatar){
            return new Promise(resolve => {
                commit('SET_AVATAR',avatar);
            });
        }
    }
}

export default user;