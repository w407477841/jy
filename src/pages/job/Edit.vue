<template>
	<div class="container">
	<el-form ref="form" :model="form" label-width="80px" v-loading="loading">
  <el-form-item label="任务名">
    <el-input v-model="form.jobName" disabled clearable></el-input>
  </el-form-item>
  <el-form-item label="任务组">
    <el-input v-model="form.jobGroup" disabled clearable></el-input>
  </el-form-item>
  <el-form-item label="RESTURL">
    <el-input v-model="form.restUrl" disabled clearable></el-input>
  </el-form-item>
    <el-form-item label="cron表达式">
    <el-input v-model="form.cron" clearable></el-input>
   </el-form-item>
    <el-form-item label="认证秘钥">
    <el-input v-model="form.password" disabled clearable></el-input>
   </el-form-item>
  <el-form-item label="用户状态">
    <el-select v-model="form.status" disabled placeholder="请选择用户状态">
      <el-option label="开启" value='1'></el-option>
      <el-option label="不启用" value='2'></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onCreate">修改</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>	
</div>
</template>
<script>
	
	export default{
		created(){
			this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/'+this.module+'/'+this.$route.params.id+'/',
  				params: {
    				access_token:this.$store.state.token
  				}
				}).then(response=>{
					this.form=response.data
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
				module:'job',
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
  				data: {
  					id:this.form.id,
  					cron:this.form.cron
  				}
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
    }
			
		}
		
	}	
</script>
	
<style scoped="scoped">
.container{
		width:100%;
		margin-top: 20px;
	}	
</style>