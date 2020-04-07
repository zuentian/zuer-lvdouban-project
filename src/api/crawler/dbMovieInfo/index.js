import fetch from 'utils/fetch';
export function getDbMovieInfo(){

}

export function searchTags(){
    return fetch({
        url:'/movie/CrawlerController/searchTags',
        method:'get',
    })
}