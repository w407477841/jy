<template>
	<div class="container">
		<el-card class="box-card" >
  <div slot="header" class="clearfix">
    <span>更改手机号</span>
    <el-button style="float: right; padding: 3px 0" type="text" @click="handleOpDetail">操作说明</el-button>
  </div>
<el-form ref="form" :model="form"  :rules="rules" label-width="80px" v-loading="loading">
  <el-form-item label="手机号" prop="phone">
    <el-input v-model="form.phone" >
    </el-input>
  </el-form-item>
   <el-form-item label="验证码" prop="code">
    <el-input v-model="form.code"  >
    	<el-button  slot="append" type="primary" @click="handleGetCode" :disabled="disabled">{{handleLabelCode}}</el-button>
    </el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onCreate">确认修改</el-button>
  </el-form-item>
</el-form>	
</el-card>
		
	
</div>
</template>
<script>
	
	export default{
		created(){//初始化
			
		}, 
		data(){
			
			
			return {
				loading:false,
				roles:[],
				readonly:true,
				disabled :false ,//验证码按钮
				time : 120, //验证码禁用时间
				form:{
				phone:'',
				code:''
			},rules:{
			 phone:[
			 { required: true, message: '请输入手机号', trigger: 'blur' },
			 { min: 11, max: 11, message: '长度11位', trigger: 'blur' }
			 ],
			 code:[
			 {required: true, message: '请输入验证码', trigger: 'blur'}
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
  				url: this.$store.state.baseUrl+'/user/phone',
  				params: {
    				access_token:this.$store.state.token,
    				username:this.$store.state.username,
    				phone:this.form.phone,
    				code:this.form.code
  				},
  				data: {}
				}).then(response=>{
					
					this.loading=false
					this.$message({message:'修改成功',type:'success',showClose:true});
					this.disabled=false;
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
    	
    	
    },handleGetCode(){
    	this.disabled=true
    	this.time=120
    	this.downTime()
    	this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/user/phoneCode',
  				params: {
  					access_token:this.$store.state.token,
    				phone:this.form.phone
  				},
  				data: {}
				}).then(response=>{
					this.$message({message:'验证码已发送到手机，请注意查收',type:'success',showClose:true});
				
				}).catch(error => {
					this.disabled=false
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
    	
    },downTime(timer){
			if(this.disabled){
			if(timer){
				clearTimeout(timer)
			}
			if(this.time>1){
				this.time--;
			let newTimer=setTimeout(newTimer=>{
				this.downTime(newTimer)
			},1000);
			}else{
				this.disabled=false
			}
		}
		}
			
		},computed:{
		handleLabelCode(){
				if(this.disabled){
					return this.time+'s'+' 验证码'
				}
				else{
					return '验证码'
				}
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