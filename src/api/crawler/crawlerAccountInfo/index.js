import fetch from 'utils/fetch';

export function addCrawlerAccount(param){
    return fetch({
        url:'/movie/CrawlerAccountController/addCrawlerAccount',
        method:'post',
        params:param
    })
}
export function updateCrawlerAccountInfoById(param){
    return fetch({
        url:'/movie/CrawlerAccountController/updateCrawlerAccountInfoById',
        method:'post',
        params:param
    })
}

export function queryById(id){
    return fetch({
        url:'/movie/CrawlerAccountController/queryById/'+id,
        method:'get',
    })
}

export function queryPage(param){
    return fetch({
        url:'/movie/CrawlerAccountController/queryPage',
        method:'post',
        params:param
    })
}

export function deleteById(id){
    return fetch({
        url:'/movie/CrawlerAccountController/deleteById/'+id,
        method:'get',
    })
}

