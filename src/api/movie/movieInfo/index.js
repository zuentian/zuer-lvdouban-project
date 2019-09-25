import fetch from 'utils/fetch';


export function insertMovieInfo(param){
    return fetch({
        url: '/movie/MovieInfoController/insertMovieInfo',
        method: 'post',
        params: param
      });
}
