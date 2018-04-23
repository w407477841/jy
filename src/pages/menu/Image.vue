<template>
<div class="container">
<template v-show="name==''">
	请输入图片名
</template>
<input v-model="name">
<template v-show="!name==''">
<el-upload 
  class="avatar-uploader"
  :action="action"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
</template>

</div>
</template>
<script>
	
	export default{
		created(){
			
		}, 
		data(){
			return {
				name:'',
				imageUrl:''
				
			}
		},
		methods:{
			  handleAvatarSuccess(res, file) {
        //this.imageUrl = URL.createObjectURL(file.raw);
        this.imageUrl=this.$store.state.baseUrl+"/upload/image/"+this.name
      	},
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
		}, computed:{
    	action(){
    		return this.$store.state.baseUrl+"/upload/image?access_token="+this.$store.state.token+"&type=images&name="+this.name
    	}
		
		}
		
	}
</script>
	
<style scoped="scoped">
.container{
		width:100%;
		margin-top: 20px;
	}	
	.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>