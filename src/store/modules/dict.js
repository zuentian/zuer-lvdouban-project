
import {queryDict} from 'api/dict'

const dict={
    state:{

    },
    mutations:{
    
    },
    actions: {
        QueryDict({dispatch,commit,state},params){
            return queryDict(params);
        },
    }
}

export default dict;