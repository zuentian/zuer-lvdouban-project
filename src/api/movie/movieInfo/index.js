import fetch from 'utils/fetch';


export function insertMovieInfo(param,config){
  return fetch({
      url: '/movie/MovieInfoController/insertMovieInfo',
      method: 'post',
      params:param,
      data:config
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

export function updateMovieInfo(param){
  return fetch({
    url: '/movie/MovieInfoController/updateMovieInfo',
    method: 'post',
    params: param
  });
}

export function queryMovieDetailById(id){
  return fetch({
    url:'/movie/MovieInfoController/queryMovieDetailById/'+id,
    method:'get'
  })
}


export function deleteMovieInfoById(id){
  return fetch({
    url:'/movie/MovieInfoController/deleteMovieInfoById/'+id,
    method:'get'
  })
}
