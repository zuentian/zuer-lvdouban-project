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