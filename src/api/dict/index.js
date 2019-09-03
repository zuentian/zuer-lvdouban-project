import fetch from 'utils/fetch';

export function queryPageFromDict(param){
  return fetch({
      url: '/api/DictController/queryPageFromDict',
      method: 'post',
      params: param
  });
}

export function getDictTypeName(param){
  return fetch({
    url:'/api/DictController/getDictTypeName',
    method:'post',
    params:param
  })
}