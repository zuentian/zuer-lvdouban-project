import fetch from 'utils/fetch';

export function queryUser(param){
    return fetch({
        url: '/api/UserController/queryUser',
        method: 'post',
        params: param
      });
}

export function addUser(param){
  return fetch({
    url: '/api/UserController/addUser',
    method: 'post',
    params: {
      user:param
    }
  })
}

export function queryUserById(id){
  return fetch({
    url:'/api/UserController/queryUserById/'+id,
    method:'get',
  })
}

export function updateUserById(param){
  return fetch({
    url: '/api/UserController/updateUserById',
    method: 'post',
    params: {
      user:param
    }
  })
}

export function deleteUserById(id){
  return fetch({
    url:'/api/UserController/deleteUserById/'+id,
    method:'get'
  })
}