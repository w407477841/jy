<template>
	<div class="container">
		<el-row v-show="!isLogin" v-loading="loading">
  <el-col :span="6"><div class="space"></div></el-col>
  <el-col :span="6">
  	<div class="login-container">
  	<el-form ref="form"  label-width="80px">
  		 <el-form-item :label="labels[type].username2">
   	<el-input
    :placeholder="'输入'+labels[type].username"
    v-model="username"
    >
    <i slot="prefix" class="el-input__icon el-icon-search"></i>
    <el-button slot="append" @click="type==0?type=1:type=0" >切 换</el-button>
  	</el-input>
  </el-form-item>
  <el-form-item :label="labels[type].password">
  	<el-input
    :placeholder="'输入'+labels[type].password"
    v-model="password"
    >
    <i slot="prefix" class="el-input__icon el-icon-search"></i>
  	<el-button v-if="type==1" :disabled="disabled" slot="append" @click="handleGetCode" >{{handleLabelCode}}</el-button>
  	</el-input>
  	
  	 </el-form-item>
  	<el-form-item>
  	<el-button type="primary" @click="login"  @keypress.enter="login">登录</el-button>
  	<el-button @click="register" >注册</el-button>
  	</el-form-item>
  	</el-form>
  	
  	</div>
  </el-col>
  <el-col :span="6"><div class="space"></div></el-col>
		</el-row>
		<el-row v-show="isLogin">
			<el-col :span="6"><div class="space"></div></el-col>
			<el-col :span="12">
			<div class="login-container">
				 <el-card shadow="hover">
				 	欢迎 【{{username}}】 登录系统	
    			 </el-card>
			 	
				 	 <el-card shadow="hover">
				 	 	<el-button type="info" @click="personalinfo" >完善个人</el-button>
			<el-button type="danger" @click="updpassword" >修改密码</el-button>
				 	 </el-card>
			
    			
			 <!--el-card shadow="hover">
			 	<div class="block">
  			<span class="demonstration">切换主题</span>
  			<el-color-picker v-model="color"></el-color-picker>
			</div>
    			 </el-card-->
			 <el-card shadow="hover">
				 	<el-button type="primary" @click="logout" >退出</el-button>
				 	 </el-card>
			</div>
			</el-col>
			<el-col :span="6"><div class="space"></div></el-col>
				
		</el-row>	
	</div>
</template>
<script>
	import Vue from 'vue'
	export default{
		created(){
			if(this.isLogin){
				this.username=this.$store.state.username
				this.password=''
				this.loading=false
			}else{
				this.username=''
				this.password=''
				this.loading=false
			}
			
		},
		data(){
			return {
				type:0,
				labels:[{username:"用户名/手机号",username2:"用户名",password:"密码"},{username:"手机号",username2:"手机号",password:"验证码"}],
				disabled:false,
				time:120,
				loginMethod:["normal","phone"]
			}
		},
		methods:{
			loadMenu(){
				this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/menu/sort?username='+this.$store.state.username,
  				params: {
    				access_token:this.$store.state.token
  				}
				}).then(response=>{
					this.$store.commit('loadmenu',{menus:response.data})
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
  				
          })
				
			},
			login(){
				this.loading=true
				this.$http({
  				method: 'post',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/login',
  				/*headers:{
  					Authorization : 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTUxOTcwMDI4NywiYXV0aHMiOiJbUk9MRV91c2VyX2FkZCwgUk9MRV91c2VyX2RlbGV0ZWQsIFJPTEVfdXNlcl91cGRhdGUsIFJPTEVfdXNlcl9pbmZvLCBST0xFX3VzZXJfcGFnZSwgUk9MRV91c2VyX2FsbCwgUk9MRV9yb2xlX2FkZCwgUk9MRV9yb2xlX2RlbGV0ZWQsIFJPTEVfcm9sZV91cGRhdGUsIFJPTEVfcm9sZV9pbmZvLCBST0xFX3JvbGVfcGFnZSwgUk9MRV9yb2xlX2FsbCwgUk9MRV9yb2xlX3Blcm1zLCBST0xFX3JpZ2h0X2FkZCwgUk9MRV9yaWdodF9kZWxldGVkLCBST0xFX3JpZ2h0X3VwZGF0ZSwgUk9MRV9yaWdodF9pbmZvLCBST0xFX3JpZ2h0X3BhZ2UsIFJPTEVfcmlnaHRfYWxsLCBST0xFX3JvbGVSaWdodF9hZGQsIFJPTEVfcm9sZVJpZ2h0X2RlbGV0ZWQsIFJPTEVfcm9sZVJpZ2h0X3VwZGF0ZSwgUk9MRV9yb2xlUmlnaHRfaW5mbywgUk9MRV9yb2xlUmlnaHRfcGFnZSwgUk9MRV9yb2xlUmlnaHRfYWxsLCBST0xFX2xvZ19hZGQsIFJPTEVfbG9nX2RlbGV0ZWQsIFJPTEVfbG9nX3VwZGF0ZSwgUk9MRV9sb2dfaW5mbywgUk9MRV9sb2dfcGFnZSwgUk9MRV9sb2dfYWxsLCBST0xFX3VzZXJfdXBkcGFzc3dvcmQsIFJPTEVfam9iX2FkZCwgUk9MRV9qb2JfZGVsZXRlZCwgUk9MRV9qb2JfdXBkYXRlLCBST0xFX2pvYl9pbmZvLCBST0xFX2pvYl9wYWdlLCBST0xFX2pvYl9hbGxdIn0.oqD1vuSTAli2WlxnPCRuaeApejofTEs864fZ4v21G_cuylCjSm8amv2Vj3Mv-FlArf8yV7CxtHvlftijLh7HhA'
  				}*/
  				data: {
    				username:this.username,
    				password:this.password,
    				loginMethod:this.loginMethod[this.type]
  				}
				}).then(response=>{
					if(response.status==200&&response.data.status==0){
						//this.username=response.data.username
						this.disabled=false;
						this.$store.commit('login',{token:response.data.access_token,username:response.data.username})
						this.$message({message:'登录成功',type:'success',showClose:true});
						this.loadMenu()
						
						
					}else{
						this.$message({message:'未知错误',type:'error',showClose:true});
						this.$store.commit('logout')
					}
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
      						this.$message({message:error.response.data.msg,type:'error',showClose:true});
      					}else if(error.response.status==400){
      						this.$message({message:error.response.data.msg,type:'error',showClose:true});
      					}
   					 } else {
      					this.$message({message:'服务器异常，请联系管理员',type:'error',showClose:true});
    				}
          })
				
				
			},
			logout(){
				this.$message({message:'退出成功',type:'success',showClose:true});
				this.$store.commit('logout')
			},
			updpassword(){
				this.$router.push({path:"/password"});
			},
			personalinfo(){
				this.$router.push({path:"/personalinfo"});
			},
			register(){
				this.$router.push({path:"/register"});
			},handleGetCode(){//获取手机验证码
				this.time=120
				this.disabled=true
				this.downTime();
				
			this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/loginCode',
  				params: {
    				phone:this.username
  				},
  				data: {}
				}).then(response=>{
					this.$message({message:'验证码已发送到手机，请注意查收',type:'success',showClose:true});
				}).catch(error => {
					if (error.response) {
						this.disabled=false
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
				this.time--
			let newTimer=setTimeout(newTimer=>{
				this.downTime(newTimer)
			},1000);
			}else{
				this.disabled=false
			}
			}
		},handleThemeChange(){
			this.$store.commit('changeTheme',{color:this.color})
		}
		},
		computed:{
			isLogin(){
				return this.$store.state.isLogin
			},
			handleLabelCode(){
				if(this.disabled){
					return this.time+'s'+' 验证码'
				}
				else{
					return '验证码'
				}
			},
			color:{
				get:function(){
					return this.$store.state.themecolor
				},
				set:function(val){
					this.$store.commit('changeTheme',{color:val})
				}
			}
		}
		
		
	}
</script>
<style scoped="scoped">
	.space{
	border-radius: 4px;
    min-height: 36px;	
	}
	
	.container{
		width:100%;
		margin-top: 20px;
	}
	.login-container{
		width:100%;
		min-height: 400px;
		padding-top:100px ;
		
	}
</style>