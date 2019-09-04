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

export function addDict(param){
  return fetch({
    url:'/api/DictController/addDict',
    method:'post',
    params:param,
  })
}

export function queryDictByDictId(param){
  return fetch({
    url:'/api/DictController/queryDictByDictId',
    method:'post',
    params:param
  })
}

export function editDictByDictId(param){
  return fetch({
    'url':'/api/DictController/editDictByDictId',
    method:'post',
    params:param
  })
}

export function deleteDictByDictId(param){
  return fetch({
    'url':'/api/DictController/deleteDictByDictId',
    method:'post',
    params:param
  })
}

export function queryDictByDictType(param){
  return fetch({
    'url':'/api/DictController/queryDictByDictType',
    method:'post',
    params:param
  })
}