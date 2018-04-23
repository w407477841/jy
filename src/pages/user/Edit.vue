<template>
	<div class="container">
	<el-form ref="form" :model="form" :rules="rules" label-width="200px" v-loading="loading">
  <el-form-item label="用户名" >
    <el-input v-model="form.username" readonly></el-input>
  </el-form-item>
  <el-form-item label="真实姓名" >
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
    <el-button type="primary" @click="onCreate">立即修改</el-button>
    <el-button>返回</el-button>
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
  				url: 'http://192.168.0.166:8090/user/'+this.$route.params.id+'/',
  				params: {
    				access_token:this.$store.state.token
  				}
				}).then(response=>{
					this.roles=response.data.roles
					let form={
						id:response.data.id,
						username:response.data.username,
						roleIds:response.data.roleIds,
						realname:response.data.realname,
						status:response.data.status
					}
					this.form=form
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
				realname:'',
				roleIds:[],
				status:'1'
					},
					rules:{
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
  				method: 'put',
  				responseType : 'json',
  				url: 'http://192.168.0.166:8090/user',
  				params: {
    				access_token:this.$store.state.token
  				},
  				data: this.form
				}).then(response=>{
					this.$message({message:'修改成功',type:'success',showClose:true});
					this.loading=false
					
					this.$store.commit('sendMessage',{to:this.form.username,msg:'你的账户信息已被['+this.$store.state.username+']修改'})
					
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