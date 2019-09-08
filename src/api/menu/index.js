import fetch from 'utils/fetch';

export function queryMenuTree(param){
    return fetch({
        url: '/api/MenuController/queryMenuTree',
        method: 'post',
        params: param
    });
}

export function queryMenuById(id){
    return fetch({
        url:'/api/MenuController/queryMenuById/'+id,
        method:'get'
    })
}

export function addMenu(param){
    return fetch({
        url:'/api/MenuController/addMenu',
        method:'post',
        params:{
            menu:param
        }
    })
}

export function updateMenu(param){
    return fetch({
        url:'/api/MenuController/updateMenu',
        method:'post',
        params:{
            menu:param
        }
    })
}

export function deleteMenuById(id){
    return fetch({
        url:'/api/MenuController/deleteMenuById/'+id,
        method:'get',
    })
}

export function queryMenuByParentIdCount(id){
    return fetch({
        url:'/api/MenuController/queryMenuByParentIdCount/'+id,
        method:'get',
    })
}