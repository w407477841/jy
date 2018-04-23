<template>
	<div class="container">
		<el-row>
			<el-col :span="6">
		<div class="space"></div>
			</el-col>
		
			 <el-col :span="10">
		 <el-card shadow="hover">
		 <el-alert
    title="只能修改 电子邮箱、性别、出生日期，需要修改其他信息请联系管理员"
    type="warning">
  </el-alert>
	<el-form ref="form" :model="form"  :rules="rules" label-width="80px" v-loading="loading">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="form.username" readonly></el-input>
  </el-form-item>
  <el-form-item label="真实姓名" prop="realname">
    <el-input v-model="form.realname" readonly></el-input>
  </el-form-item>
   <el-form-item label="用户类型" prop="type">
    <el-input v-model="form.type" readonly ></el-input>
  </el-form-item>
  <el-form-item  v-if="form.type=='工厂用户'"  label="所属工厂" prop="factory">
    <el-input v-model="form.factory"  readonly ></el-input>
  </el-form-item>
   <el-form-item v-if="form.type=='企业用户'" label="所属部门" prop="dept">
    <el-input v-model="form.dept"  readonly ></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="phone">
    <el-input v-model="form.phone" :readonly="readonly" >
    	<el-button  slot="append" type="primary" @click="handleBindPhone">{{handleLabel}}</el-button>
    </el-input>
  </el-form-item>
  
  <el-form-item label="电子邮箱" prop="email">
    <el-input v-model="form.email"  clearable ></el-input>
  </el-form-item>
  <el-form-item label="性别" prop="sex">
<el-select v-model="form.sex">
       <el-option label="男" value='男'></el-option>
      <el-option label="女" value='女'></el-option>
</el-select>
</el-form-item>

<el-form-item label="出生日期">
     <el-date-picker
      v-model="form.birth"
      align="right"
      type="date"
      placeholder="选择日期"
      style="width: 100%;"
      value-format="yyyy-MM-dd"
     >
    </el-date-picker>
  </el-form-item>
  
  <el-form-item>
    <el-button type="primary" @click="onCreate">确认修改</el-button>
  </el-form-item>
</el-form>	
 </el-card>
 </el-col>
 	<el-col :span="8">
				<el-cord></el-cord>
			</el-col>
 </el-row>
</div>
</template>
<script>
	
	export default{
		created(){//初始化
			this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/user/info',
  				params: {
    				access_token:this.$store.state.token,
    				username:this.$store.state.username
    				
  				}
				}).then(response=>{
					this.form=response.data
					/*
					if(this.form.phone){
						this.readonly=true
					}else{
						this.readonly=false
						this.$message({message:'请绑定手机号,以免部分功能无法正常使用',type:'error',showClose:true});
					}
					*/
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
				roles:[],
				readonly:true,
				disabled :false ,//验证码按钮
				time : 120, //验证码禁用时间
				form:{
				username:'',
				realname:'',
				phone:'',
				sex:''
			},rules:{
			
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
  				url: this.$store.state.baseUrl+'/user/info',
  				params: {
    				access_token:this.$store.state.token,
    				username:this.form.username,
    				//phone:this.form.phone,
    				sex:this.form.sex,
    				birth:this.form.birth,
    				email:this.form.email
  				},
  				data: {}
				}).then(response=>{
					
					this.loading=false
					this.$message({message:'修改成功',type:'success',showClose:true});
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
    		
    	
    },handleBindPhone(){
    	this.$router.push({path:'/phone'})
    }
			
		},computed:{
		handleLabel(){
				if(this.form.phone){
					return "更改手机"
				}else{
					return "绑定手机"
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
	.space{
		min-height: 40px;
	}
</style>