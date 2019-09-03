import fetch from 'utils/fetch';

export function queryDict(param){
    return fetch({
        url: '/api/DictController/queryDict',
        method: 'post',
        params: param
      });
}