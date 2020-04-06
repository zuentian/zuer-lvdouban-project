import fetch from 'utils/fetch';

export function addCrawlerUrlInfo(param){
    return fetch({
        url:'/movie/CrawlerUrlInfoController/addCrawlerUrlInfo',
        method:'post',
        params:param
    })
}
export function updateCrawlerUrlInfoById(param){
    return fetch({
        url:'/movie/CrawlerUrlInfoController/updateCrawlerUrlInfoById',
        method:'post',
        params:param
    })
}

export function queryById(id){
    return fetch({
        url:'/movie/CrawlerUrlInfoController/queryById/'+id,
        method:'get',
    })
}

export function queryPage(param){
    return fetch({
        url:'/movie/CrawlerUrlInfoController/queryPage',
        method:'post',
        params:param
    })
}

export function deleteById(id){
    return fetch({
        url:'/movie/CrawlerUrlInfoController/deleteById/'+id,
        method:'get',
    })
}

