import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import app from './modules/app';
import dict from './modules/dict';
import permission from './modules/permission'
import getters from './getters'
Vue.use(Vuex);
const store=new Vuex.Store({
    modules:{
        app,
        user,
        dict,
        permission,
    },
    getters
});

export default store