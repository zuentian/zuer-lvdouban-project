import fetch from 'utils/fetch';


export function insertMovieInfo(param){
  return fetch({
      url: '/movie/MovieInfoController/insertMovieInfo',
      method: 'post',
      params:param
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

export function queryMovieBaseInfoById(id){
  return fetch({
    url:'/movie/MovieInfoController/queryMovieBaseInfoById/'+id,
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

export function insertMovieInfoPictureStage(param){
  return fetch({
    url:'/movie/MovieInfoController/insertMovieInfoPictureStage',
    method:'post',
    data:param
  })
}
export function queryMoviePictureInfoByMovieIdFromSix(id){
  return fetch({
    url:'/movie/MovieInfoController/queryMoviePictureInfoByMovieIdFromSix/'+id,
    method:'get'
  })
}


export function queryMoviePictureByParam(param){
  return fetch({
    url:'/movie/MovieInfoController/queryMoviePictureByParam',
    method:'POST',
    params:param
  })
}


export function deletePictureById(id){
  return fetch({
    url:'/movie/MovieInfoController/deletePictureById/'+id,
    method:'get'
  })
}


export function moviePictureBillUpload(param){
  return fetch({
    url:'/movie/MovieInfoController/moviePictureBillUpload',
    method:'post',
    data:param
  })
}


export function queryMoviePictureBillOne(id){
  return fetch({
    url:'/movie/MovieInfoController/queryMoviePictureBillOne/'+id,
    method:'get'
  })
}