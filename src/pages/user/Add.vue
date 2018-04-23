<template>
	<div class="container">
	<el-form ref="form" :model="form"  :rules="rules" label-width="200px" v-loading="loading">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="form.username" clearable></el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input v-model="form.password" clearable></el-input>
  </el-form-item>
  <el-form-item label="真实姓名" prop="realname">
    <el-input v-model="form.realname" clearable></el-input>
  </el-form-item>
  <el-form-item label="角色" prop="roleIds">
  	<el-select v-model="form.roleIds" multiple placeholder="请选择">
    <el-option
      v-for="item in roles"
      :key="item.id"
      :label="item.intro"
      :value="item.id">
    </el-option>
  </el-select>
  </el-form-item>
<el-form-item label="用户状态" prop="status">
    <el-select v-model="form.status" placeholder="请选择用户状态">
      <el-option label="禁用" value='0'></el-option>
      <el-option label="启用" value='1'></el-option>
    </el-select>
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
		created(){//初始化
			this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: 'http://192.168.0.166:8090/role?deleted=0',
  				params: {
    				access_token:this.$store.state.token
  				}
				}).then(response=>{
					this.roles=response.data
				}).catch(error => {
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
				roles:[],
				form:{
				username:'',
				password:'',
				roleIds:[],
				realname:'',
				status:'1'
			},rules:{
			   username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
          ],password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ],
          roleIds: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择用户状态', trigger: 'change' }
          ]
         
			}
			}
		},
		methods:{
    	onCreate(){//创建
    		
    	 this.$refs["form"].validate((valid) => {
          if (valid) {
          	this.loading=true
				this.$http({
  				method: 'post',
  				responseType : 'json',
  				url: 'http://192.168.0.166:8090/user',
  				params: {
    				access_token:this.$store.state.token
  				},
  				data: this.form
				}).then(response=>{
					this.$message({message:'创建成功',type:'success',showClose:true});
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
          	
          } else {
            return false;
          }
        });
    		
    	
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