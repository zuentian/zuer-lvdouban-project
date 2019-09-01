import fetch from 'utils/fetch'

export function login(username,password){
    const data={
        username,
        password
    };
    return fetch({
        url:'/api/LoginController/login',
        method:'post',
        data
    })
}
export function getUserInfo(token){
    return fetch({
        url:'/api/UserController/getUserInfo',
        method:'get',
        params:{token}
    });
}

export function logOut(){
    return fetch({
        url:'/api/LoginController/logOut',
        method:'post',
        params:{}
    })
}

export function getAllMenus(){
    return fetch({
        url:'/api/MenuController/queryAllMenu',
        method:'get'
    })
}

export function getMenuTree(token){
    return fetch({
        url:'/api/MenuController/getMenuTree',
        methode:'get',
        params:{token}
    })

}