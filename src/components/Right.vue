<template>
	<el-row>
  <template v-for="right in rights">
 
  	<el-button v-if="right.rightTxt=='新增'" type="success"  icon="el-icon-plus" @click="add">新增</el-button>
  	<el-button v-if="right.rightTxt=='修改'" type="primary" icon="el-icon-edit" @click="handleEdit">修改</el-button>
  	<el-button v-if="right.rightTxt=='删除'" type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
  	<el-button v-if="right.rightTxt=='分配权限'" type="info" icon="el-icon-share" @click="handleRight">分配权限</el-button>
  	<el-button v-if="right.rightTxt=='调度'" type="info" icon="el-icon-share" @click="handlePause">{{currentRow!=null?(currentRow.status=='1'?'暂停':'开启'):'调度'}}</el-button>
  	
  </template>
  </el-row>
</template>

<script>
export default {
  name: 'Right',
  
  created(){
  	this.loadright()
  },
  
  props:{
  rights: Array,
  module:String,
  currentRow:Object,
  tableData:Array,
  moduleId:Number
  },methods:{
  	  add(){
      	this.$router.push({ path: (this.module+'/add') })
      },
      handleView(id){
      	this.$router.push({ path: (this.module+'/view/'+id) })
      },
      handleEdit(id){
      	if( this.currentRow){
      	this.$router.push({ path: (this.module+'/edit/'+this.currentRow.id) })	
      	}else{
      	this.$message({message:'你还未选中一行，单击选中',type:'error',showClose:true});	
      	}
  },handleRight(id){
  		if( this.currentRow){
  			this.$router.push({ path: (this.module+'/right/'+this.currentRow.id)})
      	}else{
      	this.$message({message:'你还未选中一行，单击选中',type:'error',showClose:true});	
      	}
      	
      },handleDelete(){//查询方法
					if( this.currentRow){
						  this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          					confirmButtonText: '确定',
         					 cancelButtonText: '取消',
          					type: 'warning'
        }).then(() => {
         this.$http({
  				method: 'delete',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/'+this.module+'/'+this.currentRow.id+'/',
  				params: {
    				access_token:this.token,
  				},data :{}
  				
				}).then(response=>{
					if(response.status==200){
					this.$message({message:'删除成功',type:'success',showClose:true});
					 this.$emit('deleteRow',{currentRow:this.currentRow})
					}
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
      					}else if(error.response.status==400){
      						this.$message({message:error.response.msg,type:'error',showClose:true});
      					}
   					 } else {
      					this.$message({message:'服务器异常，请联系管理员',type:'error',showClose:true});
    				}			
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      	}else{
      	this.$message({message:'你还未选中一行，单击选中',type:'error',showClose:true});	
      	}
    },loadright(){//加载
				this.$http({
  				method: 'get',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/right/'+this.moduleId+'/user/'+this.$store.state.username+'/',
  				params: {
  					access_token:this.token
  				},data :{
  				}
				}).then(response=>{
					if(response.status==200){
					//this.rights=response.data
					 this.$emit('initRight',{rights:response.data})
					}
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
				handlePause(){
					if( this.currentRow){
					this.$http({
  				method: 'put',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/'+this.module+'/pause',
  				params: {
    				access_token:this.$store.state.token
  				},
  				data: {
  					id:this.currentRow.id,
  					status:this.currentRow.status
  				}
				}).then(response=>{
					this.$message({message:'修改成功',type:'success',showClose:true});
					this.$emit('changeStatus',{currentRow:this.currentRow})
					/*
						for(let index in this.tableData){//重置状态，可用重新查询代替
      						if(this.tableData[index].id=id){
      						this.tableData[index].status=(status=='1'?'2':'1')
      						}
      					}*/
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
      }else{
      		this.$message({message:'你还未选中一行，单击选中',type:'error',showClose:true});
      }
      }
  },computed:{
    	token(){
    		return this.$store.state.token
    	}
    }
  }
</script>

