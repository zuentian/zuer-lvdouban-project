<template>
    <el-row>
        <el-col :span="24">
            <el-button type="primary" v-if="groupManager_menu" @click="update">保存</el-button>
        </el-col>
        <el-col :span="5" style='margin-top:15px;'>
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
            <el-tree class="filter-tree" check-strictly :data="treeData" 
                    show-checkbox node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="menuTree" 
                    @node-click="getNodeData" default-expand-all>
            </el-tree>
        </el-col>

        <el-col :span="19" style='margin-top:15px;'>
            <el-table ref="elementTable" :data="list" border fit highlight-current-row @select="handleSelectionChange" style="width: 100%" @select-all="selectAll">
                <el-table-column v-if="groupManager_element" type="selection" width="55"></el-table-column>
                <el-table-column width="200px" align="center" label="资源编码" prop="code"></el-table-column>
                <el-table-column width="200px" align="center" label="资源类型" prop="type"></el-table-column>
                <el-table-column width="200px" align="center" label="资源名称" prop="name"></el-table-column>
                <el-table-column width="200px" align="center" label="资源地址" prop="uri"></el-table-column>
                <el-table-column width="200px" align="center" label="资源请求类型" prop="method"></el-table-column>
            </el-table>
        </el-col>
    </el-row>
</template>
<script>
import {queryMenuTree,updateMenuGroupByGroupId,queryMenuGroupByGroupId} from 'api/menu/index'
import {queryElementByMenuId,addElementGroupByGroupIdAndElementId,
        deleteElementGroupByGroupIdAndElementId,queryElementGroupByGroupId,
        addElementGroupByGroupIdAndElementIds} from 'api/element/index'
export default {
    data(){
        return{
            groupManager_menu:true,
            filterText:"",
            treeData:[],
            defaultProps:{
                children: 'children',
                label: 'title'
            },
            list:[],
            groupManager_element:true,
            menuId:"",
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
        getNodeData(data){
            queryElementByMenuId(data.id).then(res=>{
                this.list=res;
                queryElementGroupByGroupId(this.groupId).then(res=>{
                    const obj = {};
                    for (let i = 0; i < this.list.length; i++) {
                        obj[this.list[i].id] = this.list[i];
                    }
                    //const toggle = {};
                    for (let i = 0; i < res.length; i++) {
                        const id = res[i].elementId
                        if (obj[id] !== undefined) {
                            this.$refs.elementTable.toggleRowSelection(obj[res[i].elementId]);
                        }
                    }
                })
                this.menuId=data.id;
            })
        },
        filterNode(value, data) {
            if (!value) 
                return true;
            return data.label.indexOf(value) !== -1;
        },
        initAuthoritys(){
            this.list=[];//展开页面之前先把功能关联页面的数据清空
            queryMenuGroupByGroupId(this.groupId).then(res => {
                const result = [];
                for (let i = 0; i < res.length; i++) {
                    result.push(res[i].id);
                }
                this.$refs.menuTree.setCheckedKeys(result);
            });

        },
        handleSelectionChange(val,row){
            let flag = true;
            for (let i = 0; i < val.length; i++) {
                if (val[i].id === row.id) {
                    addElementGroupByGroupIdAndElementId({
                        groupId: this.groupId,
                        elementId: row.id
                    });
                    flag = false;
                    break;
                }
            }
            if (flag) {
                deleteElementGroupByGroupIdAndElementId({
                    groupId : this.groupId,
                    elementId : row.id
                });
            }
        },
        selectAll(selection){
            const ids=[];
            for(var i=0;i<selection.length;i++){
                ids.push(selection[i].id);
            }
            const vals = {};
            vals.groupId=this.groupId;
            vals.elementIds=ids.join();
            vals.menuId=this.menuId;
            addElementGroupByGroupIdAndElementIds(vals)
        }
    }
}
</script>
<style scoped>

</style>