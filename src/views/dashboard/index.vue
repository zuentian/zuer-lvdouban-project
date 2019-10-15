<template>
    <div class="dashboard-container">
        <component v-bind:is="currentRole"> </component>
    </div>
</template>

<script>

import EditorDashboard from './editor/index';
export default {
    components:{
        EditorDashboard
    },
    data(){
        return{
            currentRole:"EditorDashboard"
        }
    }
}
</script>

<style scoped>

</style>