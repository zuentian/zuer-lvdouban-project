<template>
<el-form label-width="80px">
    <el-form-item label="群主|领导">
        <el-select v-model="leaders" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteLeaderMethod" :loading="loading" style="width:500px">
            <el-option v-for="item in lItems" :key="item.id" :label="`${item.nameBak}-${item.name}(${item.username})`" :value="item.id"> </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="组员|下属">
        <el-select v-model="members" multiple filterable remote placeholder="请输入关键词" :remote-method="remoteMemberMethod" :loading="loading" style="width:500px">
        <el-option v-for="item in mItems" :key="item.id" :label="`${item.nameBak}-${item.name}(${item.username})`" :value="item.id"> </el-option>
        </el-select>
    </el-form-item>
    <el-form-item>
        <el-button type="primary" v-if="groupManager_btn_userManager" @click="onSubmit">保存</el-button>
    </el-form-item>
</el-form>
</template>
<script>
import {queryUserByGroupId,queryUserLikeUserNames,updateUserByGroupId} from 'api/user/index'
export default {
    data(){
        return{
            leaders:[],
            members:[],
            loading:false,
            lItems:[],
            mItems:[],
            groupManager_btn_userManager:true,
        }
    },
    props:{
        groupId:{
            
        }
    },
    methods:{
        initUsers(){
            queryUserByGroupId(this.groupId).then(res=>{
                this.lItems=res.leaders;
                this.mItems=res.members;
                let leas=[];
                let mems=[];
                for (let i = 0; i < res.leaders.length; i++) {
                    leas.push(res.leaders[i].id);
                }
                for(let i=0;i<res.members.length;i++){
                    mems.push(res.members[i].id);
                }
                this.leaders=leas;
                this.members=mems;
            })
        },
        onSubmit(){
            const vals = {};
            if (this.leaders.length > 0) vals.leaders = this.leaders.join();
            if (this.members.length>0) vals.members=this.members.join();
            vals.groupId=this.groupId;
            updateUserByGroupId(vals).then(() => {
                    this.$emit('closeUserDialog');
                    this.$notify({
                    title: '成功',
                    message: '保存成功',
                    type: 'success',
                    duration: 2000
                });
            });
        },
        remoteLeaderMethod(query){
            if (query !== '') {
                this.loading = true;
                queryUserLikeUserNames({
                    name: query
                }).then(response => {
                    this.lItems = response;
                    this.loading = false;
                });
            } else {
                this.lItems = [];
            }
        },
        remoteMemberMethod(query){
            if (query !== '') {
                this.loading = true;
                queryUserLikeUserNames({
                    name: query
                }).then(response => {
                    this.mItems = response;
                    this.loading = false;
                });
            } else {
                this.mItems = [];
            }
        }
    },
    created() {
        this.initUsers();
    },
}
</script>
<style scoped>

</style>