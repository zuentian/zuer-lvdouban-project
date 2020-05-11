import fetch from 'utils/fetch';
export function getDbMovieInfo(param){
    return fetch({
        url:'/movie/CrawlerController/getDbMovieInfo',
        method:'post',
        data:param,
    })
}
export function syncBatch(param){
    return fetch({
        url:'/movie/CrawlerController/syncBatch',
        method:'post',
        data:param,
    })
}
export function searchTags(){
    return fetch({
        url:'/movie/CrawlerController/searchTags',
        method:'get',
    })
}
