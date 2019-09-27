import fetch from 'utils/fetch';


export function insertMovieInfo(param){
    return fetch({
        url: '/movie/MovieInfoController/insertMovieInfo',
        method: 'post',
        params: param
      });
}
export function queryMovieInfoByParam(param){
  return fetch({
    url:'/movie/MovieInfoController/queryMovieInfoByParam',
    method:'post',
    params:param,
  });
}

export function queryMovieInfoById(id){
  return fetch({
    url:'/movie/MovieInfoController/queryMovieInfoById/'+id,
    method:'get',
  })
}