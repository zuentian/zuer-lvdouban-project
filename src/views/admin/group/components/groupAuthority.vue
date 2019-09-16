<template>
    <el-row>
        <el-col :span="24">
            <el-button type="primary" v-if="groupManager_menu" @click="update">保存</el-button>
        </el-col>
        <el-col :span="8" style='margin-top:15px;'>
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
            <el-tree class="filter-tree" check-strictly :data="treeData" 
                    show-checkbox node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="menuTree" 
                    @node-click="getNodeData" default-expand-all>
            </el-tree>
        </el-col>
    </el-row>
</template>
<script>
import  {queryMenuTree,updateMenuGroupByGroupId,queryMenuGroupByGroupId} from 'api/menu/index'
export default {
    data(){
        return{
            groupManager_menu:true,
            filterText:"",
            treeData:[],
            defaultProps:{
                children: 'children',
                label: 'title'
            }
        }
    },
    watch: {
        filterText(val) {
            this.$refs.menuTree.filter(val);
        }
    },
    created() {
        this.queryList();
    },
    props:{
        groupId:{
            
        }
    },
    methods:{
        queryList(){
            queryMenuTree().then(res=>{
                this.treeData = res;
                this.initAuthoritys();
            })
        },
        update(){
            this.$emit('closeAuthorityDialog');
            const nodes = this.$refs.menuTree.getCheckedNodes();
            const ids = [];
            for (let i = 0; i < nodes.length; i++) {
                ids.push(nodes[i].id);
            }
            updateMenuGroupByGroupId({
                menuTrees: ids.join(),
                groupId:this.groupId,
            }).then(() => {
                this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                duration: 2000
                });
            });
        },
        getNodeData(){

        },
        filterNode(value, data) {
            if (!value) 
                return true;
            return data.label.indexOf(value) !== -1;
        },
        initAuthoritys(){
            queryMenuGroupByGroupId(this.groupId).then(data => {
                const result = [];
                for (let i = 0; i < data.data.length; i++) {
                    result.push(data.data[i].id);
                }
                this.$refs.menuTree.setCheckedKeys(result);
            });

        }
    }
}
</script>
<style scoped>

</style>