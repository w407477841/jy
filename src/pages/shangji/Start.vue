<template>
	<div class="container">
	<el-form ref="form" :model="form" label-width="180px" v-loading="loading">
  <el-form-item label="申报时间">
  	 <el-date-picker
      v-model="form.sbsj"
      align="right"
      type="date"
      placeholder="选择日期"
      style="width: 100%;"
      value-format="yyyy-MM-dd"
     >
    </el-date-picker>

  </el-form-item>
  <el-form-item label="员工">
    <el-input v-model="form.yg" disabled></el-input>
  </el-form-item>
<el-form-item label="客户全称">
    <el-input v-model="form.khqc"  clearable></el-input>
  </el-form-item>
  <el-form-item label="客户联系人">
    <el-input v-model="form.khlxr" clearable></el-input>
  </el-form-item>
  <el-form-item label="联系方式">
    <el-input v-model="form.lxfs" clearable></el-input>
  </el-form-item>
  <el-form-item label="项目名称">
    <el-input v-model="form.xmmc" clearable></el-input>
  </el-form-item>
  <el-form-item label="商机来源">
    <el-input v-model="form.sjly" clearable></el-input>
  </el-form-item>
  <el-form-item label="预算合同金额">
    <el-input v-model="form.yshtje" clearable></el-input>
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
			this.form.yg=this.$store.state.username
		}, 
		data(){
			return {
				loading:false,
				module:'shangjiInfo',
				form:{
					
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