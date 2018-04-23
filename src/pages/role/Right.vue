<template>
	<div class="container">
	<el-form ref="form" :model="form" label-width="80px" v-loading="loading">
  <el-form-item label="角色名">
    <el-input v-model="form.roleName" disabled></el-input>
  </el-form-item>
   <el-form-item label="角色介绍">
    <el-input v-model="form.intro" disabled></el-input>
  </el-form-item>
   <el-form-item label="权限">
    <el-checkbox-group v-model="form.rightIds" size="medium">
      <el-checkbox border v-for="right in form.rights" :label="right.id" :key="right.id">{{right.rightName}}--{{right.rightTxt}}</el-checkbox>
    </el-checkbox-group>
  </el-form-item>
   <el-form-item label="功能">
   	 <el-checkbox-group v-model="form.menuIds" size="medium">
   	 	<Checkbox  :menus="form.menus" ></Checkbox>
    </el-checkbox-group>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onCreate">修改权限</el-button>
    <el-button>取消</el-button>
  </el-form-item>
</el-form>	
</div>
</template>
<script>
 import Checkbox from '@/components/Checkbox'
	export default{
		created(){
			this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/'+this.module+'/right/'+this.$route.params.id+'/',
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
				module:'role',
				form:{
				}, 
				defaultProps: {
          			children: 'childs',
         			 label: 'txt'
        }
			}
		},
		methods:{
    	onCreate(){//创建
    	this.loading=true
				this.$http({
  				method: 'put',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/'+this.module+'/right',
  				params: {
    				access_token:this.$store.state.token
  				},
  				data: {
  					id:this.form.id,
  					rightIds:this.form.rightIds,
  					menuIds:this.form.menuIds
  				}
				}).then(response=>{
					this.$message({message:'修改成功',type:'success',showClose:true});
					this.loading=false
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
    }
			
		},
	components:{
  	Checkbox
  }
		
		
	}
</script>
	
<style scoped="scoped">
.container{
		width:100%;
		margin-top: 20px;
	}	
</style>