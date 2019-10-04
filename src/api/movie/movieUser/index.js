import fetch from 'utils/fetch';


export function insertMovieUser(param){
  return fetch({
      url: '/movie/MovieUserController/insertMovieUser',
      method: 'post',
      params:param
  });
}


export function queryMovieUserByMovieIdAndUserId(param){
  return fetch({
      url: '/movie/MovieUserController/queryMovieUserByMovieIdAndUserId',
      method: 'post',
      params:param
  });
}