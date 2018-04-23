<template>
	<div class="container" @keypress.enter="search" >
		<!--el-input placeholder="请输入角色名" v-model="query.roleName" class="input-with-select">
	 <el-button slot="prepend" icon="el-icon-plus" @click="add"></el-button>
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
  </el-input-->
		 <el-table
    :data="tableData"
    style="width: 100%" @sort-change="sortFun" v-loading="loading">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="任务编号">
            <span>{{ props.row.id }}</span>
          </el-form-item>
          <el-form-item label="任务名">
            <span>{{ props.row.name }}</span>
          </el-form-item>
          <el-form-item label="创建时间">
            <span>{{ props.row.createTime }}</span>
          </el-form-item>
          <el-form-item label="所属人">
            <span>{{ props.row.assignee }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="任务编号"
      prop="id" >
    </el-table-column>
    <el-table-column
      label="任务名称"
      prop="name" >
    </el-table-column>
  <el-table-column
      fixed="right"
      label="操作"
      width="180">
      <template slot-scope="scope">
        <el-button @click="handleView(scope.row.id)" type="text" size="small">流程图</el-button>
        <el-button v-show="!scope.row.assignee" @click="handleClaim(scope.row.id)" type="text" size="small">签收</el-button>
        <el-button v-show="scope.row.assignee" @click="handleDo(scope.row.id)" type="text" size="small">办理</el-button>
      </template>
    </el-table-column>
  </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
  title="流程图"
  :visible.sync="dialogVisible"
  width="60%"
  >
   <el-card :body-style="{ padding: '0px' }">
      <img :src="url" class="image" >
    </el-card>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">关闭</el-button>
  </span>
</el-dialog>
	</div>
	
</template>
<script>
	export default {
		created(){
			this.search()
		},
    data() {
      return {
      	module:'flow',
      	dialogVisible:false,
      	url:'',
      	loading:false,
      	pageSize : 10,
    	pageNum : 1,
    	sort : 'desc',
    	column :'role_name',
    	total : 0,
    	query:{//分页查询查询条件
    		assignee:this.$store.state.username
    	},
        tableData: []
      }
      
    },
    methods :{
    	sortFun(s){//触发排序事件的回调方法
		this.sort=s.order=='descending'?'desc':'asc'
		this.column=s.prop.replace(/([A-Z])/g,"_$1").toLowerCase()//驼峰转_
		this.search()
    	},
       handleSizeChange(val) {//触发修改分页大小的事件的回调方法
        this.pageSize=val;
        this.search()
      },
      handleCurrentChange(val) {//触发修改当前页的事件的回调方法
        this.pageNum=val
        this.search()
      },
      add(){
      	this.$router.push({ path: (this.module+'/add') })
      },
      handleView(id){
      	this.url=this.$store.state.baseUrl+'/flow/processImage?taskId='+id+'&access_token='+this.token
      	this.dialogVisible=true
      },
      handleDo(id){
      	this.$router.push({ path: ('/'+this.module+'/loadform/'+id) })
      },handleClaim(id){
      	this.loading=true
				this.$http({
  				method: 'post',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/'+this.module+'/claim',
  				params: {
    				access_token:this.token,
    				pageSize : this.pageSize,
    				pageNum : this.pageNum,
    				sort : this.sort,
    				column : this.column
  				},
  				data: {
  					userId:this.$store.state.username,
  					taskId:''+id
  				}
				}).then(response=>{
					if(response.status==200){
					this.$message({message:'签收完毕',type:'success',showClose:true})
					for(let index in this.tableData){
						if(this.tableData[index].id==id){
							this.tableData[index].assignee=this.$store.state.username
							break
						}
					}
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
      						this.$message({message:'用户名/密码错误',type:'error',showClose:true});
      					}else if(error.response.status==400){
      						this.$message({message:error.response.data.msg,type:'error',showClose:true});
      					}
   					 } else {
      					this.$message({message:'签收失败',type:'error',showClose:true});
    				}			
          })
      },
    search(){//查询方法
    	this.loading=true
				this.$http({
  				method: 'post',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/'+this.module+'/todotasks/page/',
  				params: {
    				access_token:this.token,
    				pageSize : this.pageSize,
    				pageNum : this.pageNum,
    				sort : this.sort,
    				column : this.column
  				},
  				data: this.query
				}).then(response=>{
					if(response.status==200){
					this.tableData=response.data.records
					this.total=response.data.total
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
    computed:{
    	token(){
    		return this.$store.state.token
    	}
    }
  }
</script>
<style scoped="scoped">
	.container{
		width:100%;
		margin-top: 20px;
	}
	.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .image {
    width: 80%;
    display: block;
  }
</style>