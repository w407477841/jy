<template>
	<div class="container">
<el-steps :active="active" finish-status="success">
  <el-step title="验证注册码"></el-step>
  <el-step title="手机号验证"></el-step>
  <el-step title="注册帐号"></el-step>
</el-steps>



<el-card class="box-card" v-if="active==0">
  <div slot="header" class="clearfix">
    <span></span>
    <el-button style="float: right; padding: 3px 0" type="text" @click="handleOpDetail">操作说明</el-button>
  </div>
  <el-alert
    title="操作说明"
    type="success"
    description="请输入10位注册码，如没有，请联系企业用户   测试：olvi1oq3c4 未使用 cjmv1c0bc2 已使用"
    show-icon>
  </el-alert>
<el-form ref="form1" :model="form1"   label-width="200px" v-loading="loading">
  <el-form-item label="注册码" prop="registerCode">
    <el-input v-model="form1.registerCode" clearable></el-input>
  </el-form-item>

  
</el-form>	
</el-card>



<el-card class="box-card" v-if="active==1">
  <div slot="header" class="clearfix">
    
  </div>
<el-form ref="form2" :model="form2"  :rules="rules2" label-width="200px" v-loading="loading">
<el-form-item label="手机号" prop="phone">
    <el-input v-model="form2.phone" clearable></el-input>
     <el-button @click="handleGetCode" :disabled="disabled">{{handleLabelCode}}</el-button>
  </el-form-item>
  

<el-form-item label="验证码" prop="code">
    <el-input v-model="form2.code" clearable></el-input>
</el-form-item>
 
</el-form>	
</el-card>

<el-card class="box-card" v-if="active==2">
  <div slot="header" class="clearfix">
    
  </div>
<el-form ref="form3" :model="form3"  :rules="rules3" label-width="200px" v-loading="loading">
<el-form-item label="手机号" prop="phone">
    <el-input v-model="form3.phone" readonly></el-input>
</el-form-item>
<el-form-item label="用户名" prop="username">
    <el-input v-model="form3.username" clearable></el-input>
</el-form-item>
<el-form-item label="姓名" prop="realname">
    <el-input v-model="form3.realname" clearable></el-input>
</el-form-item>  
<el-form-item label="密码" prop="password">
	 <el-input :type="passtype" placeholder="" v-model="form3.password" class="input-with-select">
    <el-button slot="append"  @click="passtype=='text'?passtype='password':passtype='text'">{{passtype=='text'?'隐藏':'显示'}}</el-button>
  </el-input>
</el-form-item>
<el-form-item label="性别" prop="sex">
<el-select v-model="form3.sex">
       <el-option label="男" value='男'></el-option>
      <el-option label="女" value='女'></el-option>
</el-select>

</el-form-item>
<el-form-item label="电子邮箱" prop="email">
    <el-input v-model="form3.email" clearable></el-input>
</el-form-item> 
<el-form-item label="出生日期">
     <el-date-picker
      v-model="form3.birth"
      align="right"
      type="date"
      placeholder="选择日期"
      style="width: 100%;"
      value-format="yyyy-MM-dd"
     >
    </el-date-picker>
  </el-form-item>

</el-form>	
</el-card>

<el-card class="box-card" v-if="active==3">
  <div slot="header" class="clearfix">
    <span></span>
  </div>
  <el-alert
    title="已完成注册"
    type="success"
    description="请等待管理员审核，通过后会已短信方式告知"
    show-icon>
  </el-alert>
</el-card>


  <el-button type="primary" @click="handleValidRegisterCode" v-if="active==0">下一步</el-button>
    <el-button type="primary" @click="handleValidPhoneCode" v-if="active==1">下一步</el-button>
    <el-button type="primary" @click="handleRegister" v-if="active==2">注册</el-button>
</div>
</template>
<script>
	
	export default{
		created(){//初始化
			
		}, 
		data(){
			return {
				loading :false,
				active : 0,//当前执行步骤
				passtype :'password',//密码框
				disabled :false ,//验证码按钮
				time : 120, //验证码禁用时间
				form1:{
					registerCode:''
				},
				form2:{
					phone:'',
					code:''
				},
				form3:{
					username:'',
					password:'',
					sex:'',
					phone:'',
					birth:'',
					realname:'',
					registerCode:'',
					email:''
				},
				rules2:{
					phone:[
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ min: 11, max: 11, message: '长度11位', trigger: 'blur' }
					],
					code:[
					{ required: true, message: '请输入验证码', trigger: 'blur' }
					]
				},
				rules3:{
					username:[
					{required:true,message:'请输入用户名',trigger:'blur'},
					{ min: 3, max: 18, message: '3-18位', trigger: 'blur' }
					],
					password:[
					{required:true,message:'请输入密码',trigger:'blur'},
					{ min: 6, max: 18, message: '6-18位', trigger: 'blur' }
					]
					
				}
			}
		},
		methods:{
    	handleValidRegisterCode(){//验证注册码
    		this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/validRegisterCode',
  				params: {
    				registerCode:this.form1.registerCode
  				},
  				data: {}
				}).then(response=>{
					this.$message({message:'验证通过',type:'success',showClose:true});
					this.active=1
					this.form3.registerCode=this.form1.registerCode
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
		},handleGetCode(){//获取手机验证码
			this.disabled=true
			this.time=120
			this.downTime();
			this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/phoneCode',
  				params: {
    				phone:this.form2.phone
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
		},handleValidPhoneCode(){
			 this.$refs["form2"].validate((valid) => {
          if (valid) {
          	
          		this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/validCode',
  				params: {
    				phone:this.form2.phone,
    				code:this.form2.code
  				},
  				data: {}
				}).then(response=>{
						this.$message({message:'验证通过',type:'success',showClose:true});
						this.form3.phone=this.form2.phone
          				this.active=2
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
          })
          	
          	
          	
          
          	
          	  } else {
            return false;
          }
        });
		},handleRegister(){
			//this.$message({message:'等待审核，通过后会有短信通知',type:'success',showClose:true});
			
			 this.$refs["form3"].validate((valid) => {
          if (valid) {
				this.$http({
  				method: 'post',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/register',
  				params: {
  				},
  				data: this.form3
				}).then(response=>{
					this.$message({message:'等待审核，通过后会有短信通知',type:'success',showClose:true});
					this.active=3
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
          })
          	
          } else {
            return false;
          }
        });
			
			
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
		},
		 next() {
        if (this.active++ > 2) this.active = 0;
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