import fetch from 'utils/fetch';


export function queryTree(param){
    return fetch({
        url:'/api/GroupController/queryTree',
        method:'post',
        params:param
    })
}

export function insertGroup(param){
    return fetch({
        url:'/api/GroupController/insertGroup',
        method:'post',
        params:{
            group:param
        }
    })
}