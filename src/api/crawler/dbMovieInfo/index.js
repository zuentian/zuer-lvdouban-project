import fetch from 'utils/fetch';
export function getDbMovieInfo(){

}

export function searchTags(){
    return fetch({
        url:'/api/CrawlerController/searchTags',
        method:'get',
    })
}