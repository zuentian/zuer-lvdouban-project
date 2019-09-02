import fetch from 'utils/fetch';

export function queryUser(param){
    return fetch({
        url: '/api/UserController/queryUser',
        method: 'post',
        params: param
      });
}