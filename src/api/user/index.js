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

export function queryUserByGroupId(groupId){
  return fetch({
    url:'/api/UserController/queryUserByGroupId/'+groupId,
    method:'get'
  })
}

export function queryUserLikeUserNames(name){
  return fetch({
    url:'/api/UserController/queryUserLikeUserNames',
    method:'post',
    params:name,
  })
}


export function updateUserByGroupId(data){
  return fetch({
    url:'/api/UserController/updateUserByGroupId',
    method:'post',
    params:data
  })
}


export function avatarUpload(param){
  return fetch({
    url:'/api/UserController/avatarUpload',
    method:'post',
    data:param
  })
}