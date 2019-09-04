
import {queryPageFromDict,getDictTypeName,
    addDict,queryDictByDictId,editDictByDictId,deleteDictByDictId,queryDictByDictType} from 'api/dict'

const dict={
    state:{

    },
    mutations:{
    
    },
    actions: {
        QueryPageFromDict({dispatch,commit,state},params){
            return queryPageFromDict(params);
        },
        GetDictTypeName({dispatch,commit,state},params){
            return getDictTypeName(params);
        },
        AddDict({dispatch,commit,state},params){
            return addDict(params);
        },
        QueryDictByDictId({dispatch,commit,state},params){
            return queryDictByDictId(params);
        },
        EditDictByDictId({dispatch,commit,state},params){
            return editDictByDictId(params);
        },
        DeleteDictByDictId({dispatch,commit,state},params){
            return deleteDictByDictId(params);
        },
        QueryDictByDictType({dispatch,commit,state},params){
            return queryDictByDictType(params);
        }
    }
}

export default dict;