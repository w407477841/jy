<template>
	<div class="container">
	<el-form ref="form" :model="form" label-width="200px" v-loading="loading">
  <el-form-item label="工厂编号">
    <el-input v-model="form.bh" clearable></el-input>
  </el-form-item>
  <el-form-item label="工厂名称">
    <el-input v-model="form.name" clearable></el-input>
  </el-form-item>
  <el-form-item label="工厂地址">
    <el-input v-model="form.addr" clearable></el-input>
  </el-form-item>
  <el-form-item label="联系方式">
    <el-input v-model="form.phone" clearable></el-input>
  </el-form-item>
  <el-form-item label="责任人">
  	 <el-select v-model="form.owner" placeholder="请选择责任人">
      <el-option v-for="owner in owners" :label="owner.realname" :value="owner.id" :key="owner.id"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="开始时间">
     <el-date-picker
      v-model="form.startDay"
      align="right"
      type="date"
      placeholder="选择日期"
      style="width: 100%;"
      value-format="yyyy-MM-dd"
     >
    </el-date-picker>
  </el-form-item>
  <el-form-item label="结束时间">
    <el-date-picker
      v-model="form.endDay"
      align="right"
      type="date"
      placeholder="选择日期"
      style="width: 100%;"
      value-format="yyyy-MM-dd"
     ></el-date-picker>
  </el-form-item>
  <el-form-item label="最大用户数">
  	<el-input-number v-model="form.max"  :min="1" :max="100" label="最大用户数"></el-input-number>
  </el-form-item>
   <el-form-item label="工厂状态">
    <el-select v-model="form.status" placeholder="请选择状态">
      <el-option label="正常" value="正常"></el-option>
      <el-option label="到期" value="到期"></el-option>
      <el-option label="禁用" value="禁用"></el-option>
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
		created(){
			this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/user',
  				params: {
    				access_token:this.$store.state.token
  				}
				}).then(response=>{
					this.owners=response.data
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
				module:'factory',
				owners:[],
				form:{
					max:1,
					status:'正常'
				}
			}
		},
		methods:{
    	onCreate(){//创建
    	this.loading=true
				this.$http({
  				method: 'post',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/'+this.module,
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