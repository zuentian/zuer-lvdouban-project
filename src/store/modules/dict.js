
import {queryPageFromDict,getDictTypeName} from 'api/dict'

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
        }
    }
}

export default dict;