<template>
	<div class="container" @keypress.enter="search" >
		<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>任务调度管理</span>
    <el-button style="float: right; padding: 3px 0" type="text" @click="handleOpDetail">操作说明</el-button>
  </div>
  <el-alert
    title="操作说明"
    type="success"
    description="用户操作日志"
    show-icon>
  </el-alert>
		<el-input placeholder="请输入请求方法" v-model="query.method" class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
  </el-input>
		 <el-table
    :data="tableData"
    style="width: 100%" @sort-change="sortFun" v-loading="loading">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="日志编号">
            <span>{{ props.row.id }}</span>
          </el-form-item>
          <el-form-item label="操作方法">
            <span>{{ props.row.method }}</span>
          </el-form-item>
          <el-form-item label="请求参数">
            <span>{{ props.row.param }}</span>
          </el-form-item>
          <el-form-item label="返回结果">
            <span>{{ props.row.result }}</span>
          </el-form-item>
       
          <el-form-item label="操作时间">
            <span>{{ props.row.opeTime }}</span>
          </el-form-item>
          <el-form-item label="消耗时间">
            <span>{{ props.row.expTime }}</span>
          </el-form-item>
          <el-form-item label="执行人">
            <span>{{ props.row.operator }}</span>
          </el-form-item>
          <el-form-item label="请求URL">
            <span>{{ props.row.url }}</span>
          </el-form-item>
           </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="日志 ID"
      prop="id" sortable="custom">
    </el-table-column>
    <el-table-column
      label="操作方法"
      prop="method" sortable="custom">
    </el-table-column>
      <el-table-column
      label="操作时间"
      prop="opeTime" sortable="custom" :formatter="opeTimeFormatter">
    </el-table-column>
  	<el-table-column
  	  label="请求URL"
  	  prop="url" sortable="custom">
  	</el-table-column>
  	<el-table-column
      label="返回结果"
      prop="result" sortable="custom">
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
    </el-card> 
	</div>
	
</template>
<script>
	export default {
		created(){
			this.search()
		},
    data() {
      return {
      	module:'log',
      	loading:false,
      	pageSize : 10,
    	pageNum : 1,
    	sort : 'desc',
    	column :'ope_Time',
    	total : 0,
    	query:{//分页查询查询条件
    		method:''
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
      opeTimeFormatter(row, column, cellValue){
      	
      	let newDate=new Date()
      	newDate.setTime(cellValue)
      	
      	return newDate.toLocaleString();
      },
    search(){//查询方法
    	this.loading=true
				this.$http({
  				method: 'post',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/'+this.module+'/page/',
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
</style>