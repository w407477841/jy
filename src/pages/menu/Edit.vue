<template>
	<div class="container">
	<el-form ref="form" :model="form" label-width="80px" v-loading="loading">
  <el-form-item label="菜单">
    <el-input v-model="form.txt" clearable></el-input>
  </el-form-item>
  <el-form-item label="菜单地址">
    <el-input v-model="form.url" clearable></el-input>
  </el-form-item>
  <el-form-item label="status">
  	<el-select v-model="form.status" placeholder="菜单状态">
       <el-option label="禁用" :value='0'></el-option>
       <el-option label="启用" :value='1'></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="父级菜单">
    	<el-select v-model="form.pid" placeholder="菜单状态">
    		<el-option :label="'根目录'" :value='0'></el-option>
        <el-option v-for="p in parents" :label="p.txt" :value='p.id' :key="p.id"></el-option>
    </el-select>
    </el-form-item>
      <el-form-item label="图片">
    <el-upload
  	class="avatar-uploader"
  	:action="action"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
    </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onCreate">立即创建</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>	
</div>
</template>
<script>
	
	export default{
		created(){
			this.loadparents()
			this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/'+this.module+'/'+this.$route.params.id+'/',
  				params: {
    				access_token:this.$store.state.token
  				}
				}).then(response=>{
					this.form=response.data
					//this.$store.state.baseUrl+"/upload/image"+this.form.url
				}).catch(error => {
						 this.loading=false
					if (error.response) {
     			 // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      					if(error.response.status==403){
      						this.$message({message:'登录过期',type:'error',showClose:true});
      						this.$store.commit('logout')
      						this.$router.push({ path: ('/login') })
      					}else if(error.response.status==401){
      						this.$message({message:'用户名/密码错误',type:'error',showClose:true});
      					}else if(error.response.status==400){
      						this.$message({message:error.response.data.msg,type:'error',showClose:true});
      					}
   					 } else {
      					this.$message({message:'服务器异常，请联系管理员',type:'error',showClose:true});
    				}
  					 // console.log(error.config);
					//this.$message({message:'用户名/密码错误',type:'error',showClose:true});
          })
		}, 
		data(){
			return {
				loading:false,
				version:1,
				module:'menu',
				parents:[],
				form:{
					
				}
			}
		},
		methods:{
    	onCreate(){//创建
    	this.loading=true
				this.$http({
  				method: 'put',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/'+this.module,
  				params: {
    				access_token:this.$store.state.token
  				},
  				data: this.form
				}).then(response=>{
					this.$message({message:'修改成功',type:'success',showClose:true});
					this.loading=false
				}).catch(error => {
					this.loading=false
					if (error.response) {
     			 // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      					if(error.response.status==403){
      						this.$message({message:'登录过期',type:'error',showClose:true});
      						this.$store.commit('logout')
      						this.$router.push({ path: ('/login') })
      					}else if(error.response.status==401){
      						this.$message({message:'用户名/密码错误',type:'error',showClose:true});
      					}else if(error.response.status==400){
      						this.$message({message:error.response.data.msg,type:'error',showClose:true});
      					}
   					 } else {
      					this.$message({message:'服务器异常，请联系管理员',type:'error',showClose:true});
    				}
          })
    },loadparents(){
			this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: 'http://192.168.0.166:8090/'+this.module+'?status=1',
  				params: {
    				access_token:this.$store.state.token
  				}
				}).then(response=>{
					this.parents=response.data
				}).catch(error => {
					if (error.response) {
     			 // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      					if(error.response.status==403){
      							if(error.response.data.exception){//无权访问
      						this.$message({message:'无权限',type:'error',showClose:true});	
      						}else{
      						this.$message({message:'登录过期',type:'error',showClose:true});
      						this.$store.commit('logout')
      						this.$router.push({ path: ('/login') })
      						}
      					}else if(error.response.status==401){
      						this.$message({message:'用户名/密码错误',type:'error',showClose:true});
      					}
   					 } else {
      					this.$message({message:'服务器异常，请联系管理员',type:'error',showClose:true});
    				}
  					 // console.log(error.config);
					//this.$message({message:'用户名/密码错误',type:'error',showClose:true});
          })
		},handleAvatarSuccess(res, file) {
        this.version+=1
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
    		return this.$store.state.baseUrl+"/upload/image"+this.form.url+"?access_token="+this.$store.state.token+"&type=images"
    	},
    	imageUrl(){
    		return this.$store.state.baseUrl+"/upload/image"+this.form.url+"?version="+this.version
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