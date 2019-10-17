
import fetch from 'utils/fetch';

export function queryCalendarMovieShowCount(param){
    return fetch({
      url:'/movie/MovieChartsController/queryCalendarMovieShowCount',
      params:param,
      method:'post',
    })
  }