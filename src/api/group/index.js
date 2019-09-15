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
export function queryGroupById(id){
    return fetch({
        url:'/api/GroupController/queryGroupById/'+id,
        method:'get',
    })
}

export function updateGroupById(param){
    return fetch({
        url:'/api/GroupController/updateGroupById',
        method:'post',
        params:{
            group:param
        }
    })
}

export function queryGroupByParentIdCount(parentId){
    return fetch({
        url:'/api/GroupController/queryGroupByParentIdCount/'+parentId,
        method:'get',
    })
}

export function deleteGroupById(id){
    return fetch({
        url:'/api/GroupController/deleteGroupById/'+id,
        method:'get',
    })
}