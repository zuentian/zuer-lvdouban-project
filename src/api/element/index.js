import fetch from 'utils/fetch';

export function query(param){
    return fetch({
        url: '/api/ElementController/queryElementParam',
        method: 'post',
        params: param
    });
}