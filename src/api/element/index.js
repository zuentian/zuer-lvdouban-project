import fetch from 'utils/fetch';

export function query(param){
    return fetch({
        url: '/api/ElementController/queryElementParam',
        method: 'post',
        params: param
    });
}

export function addElement(param){
    return fetch({
        url:'/api/ElementController/addElement',
        method:'post',
        params:{
            element:param
        }
    })
}

export function queryElementById(id){
    return fetch({
        url:'/api/ElementController/queryElementById/'+id,
        method:'get',
    })

}

export function updateElementById(param){
    return fetch({
        url:'/api/ElementController/updateElementById',
        method:'post',
        params:{
            element:param
        }
    })
}

export function deleteElementById(id){
    return fetch({
        url:'/api/ElementController/deleteElementById/'+id,
        method:'get',
    })
}