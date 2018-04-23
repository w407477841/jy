<template>
	<div class="container">
	<el-form ref="form" :model="form"  :rules="rules" label-width="80px" v-loading="loading">
  <el-form-item label="原密码" prop="oldPassword">
    <el-input v-model="form.oldPassword" clearable></el-input>
  </el-form-item>
   <el-form-item label="新密码" prop="password">
    <el-input type="password" v-model="form.password" clearable></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="password2">
    <el-input type="password" v-model="form.password2" clearable></el-input>
  </el-form-item>
  
  <el-form-item>
    <el-button type="primary" @click="onCreate">确认修改</el-button>
  </el-form-item>
</el-form>	
</div>
</template>
<script>
	
	export default{
		created(){//初始化
			
		}, 
		data(){
		var vpassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(value.length<6||value.length>18){
        	callback(new Error('请输入 6-18位'));
        } else {
          if (this.form.password !== '') {
            this.$refs.form.validateField('password2');
          }
          callback();
        }
      };
      var vpassword2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        }else if(value.length<6||value.length>18){
        	callback(new Error('请输入 6-18位'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      }
			
			
			return {
				loading:false,
				roles:[],
				form:{
				username:this.$store.state.username,
				password:'',
				//password2:'',
				oldPassword:'',
			},rules:{
			   oldPassword: [
            { required: true, message: '请输入原密码', trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ],password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
           {validator: vpassword, trigger: 'blur'}
          ],
         password2: [
         { required: true, message: '请确认密码', trigger: 'blur' },
            {validator: vpassword2, trigger: 'blur'}
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
  				url: this.$store.state.baseUrl+'/user/password',
  				params: {
    				access_token:this.$store.state.token
  				},
  				data: this.form
				}).then(response=>{
					
					this.loading=false
					this.$message({message:'修改成功,请重新登录',type:'success',showClose:true});
					this.$store.commit('logout')
					this.$router.push({path:"/login"})
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