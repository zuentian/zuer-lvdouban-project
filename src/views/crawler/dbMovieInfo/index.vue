<template>
    <div>


        <el-button  type="primary" v-waves icon="el-icon-search" class="filter-item" @click="get()">搜索</el-button>


    </div>
</template>
<script>
import {getDbMovieInfo} from 'api/crawler/index.js'
export default {
    data(){
        return{

        }
    },
    methods:{
        get(){
            getDbMovieInfo().then(res=>{

            })
        }
    }
}
</script>
<style scoped>

</style>