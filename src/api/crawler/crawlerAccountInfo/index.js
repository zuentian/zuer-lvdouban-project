import fetch from 'utils/fetch';

export function addCrawlerAccount(param){
    return fetch({
        url:'/movie/CrawlerAccountController/addCrawlerAccount',
        method:'post',
        params:param
    })
}

export function queryPage(param){
    return fetch({
        url:'/movie/CrawlerAccountController/queryPage',
        method:'post',
        params:param
    })
}