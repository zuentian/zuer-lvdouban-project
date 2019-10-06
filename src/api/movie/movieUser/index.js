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

export function updateMovieUserByMovieIdAndUserId(param){
  return fetch({
      url: '/movie/MovieUserController/updateMovieUserByMovieIdAndUserId',
      method: 'post',
      params:param
  });
}
export function queryMovieScoreInfo(id){
  return fetch({
    url:'/movie/MovieUserController/queryMovieScoreInfo/'+id,
    method:'get',
  })
}


export function deleteMovieUserByMovieIdAndUserId(param){
  return fetch({
      url: '/movie/MovieUserController/deleteMovieUserByMovieIdAndUserId',
      method: 'post',
      params:param
  });
}

export function queryShortCommandByMovieId(param){
  return fetch({
      url: '/movie/MovieUserController/queryShortCommandByMovieId',
      method: 'post',
      params:param
  });
}
