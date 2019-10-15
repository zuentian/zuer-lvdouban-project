<template>
    <div class="moviePicture container">
        <el-card>
            <div>
                <h1> <strong>{{movieName}}的全部图片</strong></h1>
            </div>
            <el-card>
                <h3>海报· · · · · ·(共{{totalBill}}张)</h3>
                <el-row>
                    <el-col v-for="(picture) in pictureListBill" :key="picture.key"  :span="4">
                        <el-image style="width: 200px; height:200px"  :src="picture.fileUri" fit='contain'></el-image>
                        <div style="width: 200px;height:30px"  >
                            <span style="display:block;text-align: center;overflow-wrap:break-word;">{{picture.fileName}}</span>
                        </div>
                        <div class="bottom clearfix" style="text-align:center;">
                            <el-button type="text" class="button" @click='onPreview(picture.fileUri)'>查看大图</el-button>
                            <el-button v-if='moviePicture_btn_del' type="text" class="button" @click="deletePicture(picture.id)">删除图片</el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-col>
                <div style="text-align:center" v-show="total>0" class="pagination-container">
                    <el-pagination background @size-change="handleSizeChangeBill" @current-change="handleCurrentChangeBill" :current-page.sync="listQueryBill.page" :page-sizes="[10,20,30, 50]" :page-size="listQueryBill.limit" layout=" prev, pager, next, jumper" :total="totalBill"> </el-pagination>
                </div>
                </el-col>
            </el-card>
            <el-card>
                <h3>剧照· · · · · ·(共{{total}}张)</h3>
                <el-row>
                    <el-col v-for="(picture) in pictureList" :key="picture.key"  :span="4">
                        <el-image style="width: 200px; height:200px"  :src="picture.fileUri" fit='contain'></el-image>
                        <div style="width: 200px;height:30px"  >
                            <span style="display:block;text-align: center;overflow-wrap:break-word;">{{picture.fileName}}</span>
                        </div>
                        <div class="bottom clearfix" style="text-align:center;">
                            <el-button type="text" class="button" @click='onPreview(picture.fileUri)'>查看大图</el-button>
                            <el-button v-if='moviePicture_btn_del' type="text" class="button" @click="deletePicture(picture.id)">删除图片</el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-col>
                <div style="text-align:center" v-show="total>0" class="pagination-container">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout=" prev, pager, next, jumper" :total="total"> </el-pagination>
                </div>
                </el-col>
            </el-card>
        </el-card>

        <el-image-viewer 
                     v-if="showViewer" 
                     :on-close="closeViewer" 
                     :url-list="[url]" />
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
// 导入组件
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { queryMoviePictureByParam,queryMovieBaseInfoById,deletePictureById} from 'api/movie/movieInfo/index.js'
export default {
    data(){
        return {
            listQuery:{
                page:1,
                limit:18,
            },
            listQueryBill:{
                page:1,
                limit:6,
            },
            type:'',
            total:0,
            movieId:'',
            movieName:'',
            pictureList:[],
            showViewer:false,
            url:"",
            moviePicture_btn_del:false,
            totalBill:0,
            pictureListBill:[],
        }
    },
    components: { 
        ElImageViewer 
    },
    computed: {
        ...mapGetters([
        'elements',
        ])
    },
    methods:{
        queryList(){
            queryMoviePictureByParam({...this.listQuery,movieId:this.movieId,type:'S'}).then(res=>{
                this.total=res.count;
                this.pictureList=res.list;
            })
            queryMoviePictureByParam({...this.listQueryBill,movieId:this.movieId,type:'B'}).then(res=>{
                this.totalBill=res.count;
                this.pictureListBill=res.list;
            })
        },
        queryMovieInfo(){
            queryMovieBaseInfoById(this.movieId).then(res=>{
                this.movieName=res.movieName;
            })
        },
        handleSizeChange(val){
            this.listQuery.limit=val;
            this.queryList();
        },
        handleCurrentChange(val){
            this.listQuery.page=val;
            this.queryList();
        },
        handleSizeChangeBill(val){
            this.listQueryBill.limit=val;
            this.queryList();
        },
        handleCurrentChangeBill(val){
            this.listQueryBill.page=val;
            this.queryList();
        },
        deletePicture(id){
            this.$confirm('此操作将会永久删除该张图片，请再次确认是否删除？', '确认信息', {
                        distinguishCancelAndClose: true,
                        confirmButtonText: '删除',
                        cancelButtonText: '放弃删除'
            }).then(() => {
                deletePictureById(id).then((res)=>{
                    this.queryList();
                    this.$notify({title: '删除成功',message: '',type: 'success'});
                }).catch(err=>{
                })
            }).catch(action => {
                this.$message({
                    type: 'info',
                    message: action === 'cancel'
                    ? '放弃删除并离开页面'
                    : '停留在当前页面'
                })
            });
        },
        onPreview(fileUri) {
            this.url=fileUri;
            this.showViewer = true
        },
        // 关闭查看器
        closeViewer() {
          this.showViewer = false
        }
    },
    created(){
        this.movieId=this.$route.params.id;
        this.queryMovieInfo();
        this.queryList();
        this.moviePicture_btn_del = this.elements['moviePicture_btn_del'];
    }
}
</script>
<style scoped>

</style>