import fetch from 'utils/fetch';


export function queryExceptionInfoByParam(param){
    return fetch({
        url:'/api/ExceptionInfoController/queryExceptionInfoByParam',
        method:'post',
        params:param
    })
}
