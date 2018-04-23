<template>
	<div class="container" v-loading="loading">
		  <el-alert
    title="注意"
    type="info"
    description="如果最大用户数变动，请先修改最大用户数，再生成注册码"
    show-icon>
  </el-alert>
		<el-row>
			 <el-col :span="12">
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
    <el-button type="primary" @click="onCreate">立即修改</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>
</el-col>

<el-col :span="10" :offset="2">
	<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>注册码</span>
    <el-button style="float: right; padding: 3px 0" type="text" @click="createRegister">生成注册码</el-button>
  </div>
  <el-table
    :data="registers"
    style="width: 100%">
    <el-table-column
      type="index"
      >
    </el-table-column>
    <el-table-column
      prop="code"
      label="注册码"
      width="180">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      width="180"
      :filters="[{ text: '未使用', value: '未使用' }, { text: '已使用', value: '已使用' }]"
      :filter-method="filterTag"
      filter-placement="bottom-end"
      >
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.status === '未使用' ? 'success' : 'error'"
          close-transition>{{scope.row.status}}</el-tag>
      </template>
    </el-table-column>
  </el-table>
</el-card>
	

	</el-col>
</el-row>
	

  
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
					this.owners=this.form.owners
					this.form.owners=[]
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
			
			
			this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/registrationCode',
  				params: {
    				access_token:this.$store.state.token,
    				factoryId:this.$route.params.id
  				}
				}).then(response=>{
					this.registers=response.data
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
				module:'factory',
				owners:[],
				registers:[],
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
    },createRegister(){
    	
    	this.$http({
  				method: 'post',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/registrationCode',
  				params: {
    				access_token:this.$store.state.token,
    				factoryId:this.$route.params.id,
    				count:this.form.max
  				}
				}).then(response=>{
					this.$message({message:'生成完毕',type:'success',showClose:true});
					this.registers=this.registers.concat(response.data)
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
      filterTag(value, row) {
        return row.status === value;
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
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