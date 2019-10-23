
import fetch from 'utils/fetch';

export function queryCalendarMovieShowCount(param){
  return fetch({
    url:'/movie/MovieChartsController/queryCalendarMovieShowCount',
    params:param,
    method:'post',
  })
}


export function queryBarMovieShowCount(id){
  return fetch({
    url:'/movie/MovieInfoController/queryBarMovieShowCount/'+id,
    method:'get',
  })
}