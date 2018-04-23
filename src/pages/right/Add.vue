<template>
	<div class="container">
	<el-form ref="form" :model="form" label-width="80px" v-loading="loading">
  <el-form-item label="权限名">
    <el-input v-model="form.rightName" clearable></el-input>
  </el-form-item>
  <el-form-item label="权限描述">
    <el-input v-model="form.rightTxt" clearable></el-input>
  </el-form-item>
  <el-form-item label="URL">
    <el-input v-model="form.url" clearable></el-input>
  </el-form-item>
  <el-form-item label="模块编号">
    <el-input v-model="form.moduleId" clearable></el-input>
  </el-form-item>
    <el-form-item label="可用设备">
    <el-input v-model="form.availableDevices"  @focus="handleADFocus"  clearable></el-input>
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
		}, 
		data(){
			return {
				loading:false,
				module:'right',
				form:{
					
				}
			}
		},
		methods:{
			handleADFocus(){
				 this.$notify({
          title: '警告',
          message: '由三位0/1组成； 1代表可用、0代表不可用 ；第一位代表WEB端、第二位代表安卓、第三位代表IOS。 例如：111',
          type: 'warning'
        });
			},
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