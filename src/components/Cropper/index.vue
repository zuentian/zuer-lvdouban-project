<template>
    <div>
        <el-row>
            <el-col :span="16">
                <div class="cropper-content" >
                <div class="cropper">
                    <vueCropper
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :info="true"
                    :full="option.full"
                    :canMove="option.canMove"
                    :canMoveBox="option.canMoveBox"
                    :original="option.original"
                    :autoCrop="option.autoCrop"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :fixedBox="option.fixedBox"
                    :centerBox="option.centerBox"
                    :fixed="option.fixed"
                    :fixedNumber="option.fixedNumber"
                    :maxImgSize="option.maxImgSize"
                    @realTime="realTime"
                    ></vueCropper>
                </div>
                </div> 
            </el-col >
            <el-col :span="8">
                <div style="margin-left:20px;">
                    <div class="show-preview" :style="previews.div" >
                    <!-- <div class="show-preview" :style="{'height':'200px','width':'200px'}" > -->
                        <img :src="previews.url" :style="previews.img">
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-upload class="upload-demo" action=""   :auto-upload="false" :show-file-list="false" :on-change='changeUpload'>
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload >
        
    </div>
</template>
<script>
export default {
    data(){
        return {
            headImg:"",
            previews: {},
            option:{
                img: '', // 裁剪图片的地址
                info: true, // 裁剪框的大小信息
                outputSize: 1, // 裁剪生成图片的质量
                outputType: 'jpg', // 裁剪生成图片的格式
                canScale: false, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: this.width, // 默认生成截图框宽度
                autoCropHeight: this.height, // 默认生成截图框高度
                fixedBox: true, // 固定截图框大小 不允许改变
                fixed: true, // 是否开启截图框宽高固定比例
                fixedNumber: [1, 1], // 截图框的宽高比例
                full: true, // 是否输出原图比例的截图
                canMoveBox: false, // 截图框能否拖动
                original: false, // 上传图片按照原始比例渲染
                centerBox: true, // 截图框是否被限制在图片里面
                infoTrue: true ,// true 为展示真实输出图片宽高 false 展示看到的截图框宽高
                //maxImgSize:200,
            },
            fileName:'',
        }
    },
    methods:{
        changeUpload(file, fileList) {
            this.fileName=file.name;
            const isLt5M = file.size / 1024 / 1024 < 5
            if (!isLt5M) {
                this.$message.error('上传文件大小不能超过 5MB!')
                return false
            }
            // 上传成功后将图片地址赋值给裁剪框显示图片
            this.$nextTick(() => {
                this.option.img = URL.createObjectURL(file.raw)//文件格式转成url
            })
        },// 实时预览函数 
        realTime(data) { 
            this.previews = data 
        }, 
         //上传图片（点击上传按钮）
        finish(){ 
            let _this = this;
            let formData = new FormData();
            this.$refs.cropper.getCropBlob((data) => {
                formData.append("file",data);
                formData.append("name",_this.fileName);
                this.$emit('upload',formData);//调用父组件的upload,启动上传
            })
            
        }
    },
    created(){
        this.option.img=this.url||"";
    },
    props:{
        url:{
        },
        width:{
            type:Number,
            required:true,
        },
        height:{
            type:Number,
            required:true,
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss"  scoped >

.cropper-content{//这儿是裁剪画布，必须要加
    
    .cropper{
        width: auto;
        height: 300px;
    }
  }
  .cropper-content .show-preview .preview {margin-left: 100;}

  .show-preview{
      overflow:hidden;
  }
</style>