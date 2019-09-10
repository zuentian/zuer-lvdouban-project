import fetch from 'utils/fetch';


export function addGroupType(param){
    return fetch({
        url:'/api/GroupTypeController/addGroupType',
        method:'post',
        params:{
            groupType:param
        }
    })
}

export function queryGroupTypeByParam(param){
    return fetch({
        url:'/api/GroupTypeController/queryGroupTypeByParam',
        method:'post',
        params:{
            groupType:param
        }
    })
}

export function queryGroupTypeById(id){
    return fetch({
        url:'/api/GroupTypeController/queryGroupTypeById/'+id,
        method:'get',
    })
}

export function updateGroupTypeById(param){
    return fetch({
        url:'/api/GroupTypeController/updateGroupTypeById',
        method:'post',
        params:{
            groupType:param
        }
    })
}

export function deleteGroupTypeById(id){
    return fetch({
        url:'/api/GroupTypeController/deleteGroupTypeById/'+id,
        method:'get',
    })
}