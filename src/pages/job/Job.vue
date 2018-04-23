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
    description="最好别删除"
    show-icon>
  </el-alert>
		<el-input placeholder="请输入任务名" v-model="query.jobName" class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
  </el-input>
  <Right :rights="rights" :module="module" :currentRow="currentRow" :tableData="tableData" :moduleId="8" v-on:initRight="initRight" v-on:deleteRow="deleteRow" v-on:changeStatus="changeStatus"></Right>
		 <el-table
    :data="tableData"
    style="width: 100%" @sort-change="sortFun" v-loading="loading"
      highlight-current-row 
    @current-change="handleRowChange">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="任务编号">
            <span>{{ props.row.id }}</span>
          </el-form-item>
          <el-form-item label="任务名">
            <span>{{ props.row.jobName }}</span>
          </el-form-item>
          <el-form-item label="任务组">
            <span>{{ props.row.jobGroup }}</span>
          </el-form-item>
          <el-form-item label="请求api">
            <span>{{ props.row.restUrl}}</span>
          </el-form-item>
          <el-form-item label="删除状态">
            <span>{{ props.row.deleted }}</span>
          </el-form-item>
          <el-form-item label="cron表达式">
            <span>{{ props.row.cron }}</span>
          </el-form-item>
          <el-form-item label="认证秘钥">
            <span>{{ props.row.password }}</span>
          </el-form-item>
          <el-form-item label="状态">
            <span>{{ props.row.status }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="任务ID"
      prop="id" sortable="custom">
    </el-table-column>
    <el-table-column
      label="任务名"
      prop="jobName" sortable="custom">
    </el-table-column>
  <!--el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleEdit(scope.row.id)" type="text" size="small">编辑</el-button>
        <el-button @click="handlePause(scope.row.id,scope.row.status)" type="text" size="small">{{scope.row.status=='1'?'暂停':'开启'}}</el-button>
      </template>
    </el-table-column-->
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
	import Right from '@/components/Right'
	export default {
		created(){
			this.search()
		},
    data() {
      return {
      	module:'job',
      	loading:false,
      	pageSize : 10,
    	pageNum : 1,
    	sort : 'desc',
    	column :'job_name',
    	total : 0,
    	query:{//分页查询查询条件
    		rightName:''
    	},
        tableData: [],
        currentRow:null,
        rights:[]
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
      },   handleRowChange(val){
      	this.currentRow =val
      },changeStatus(payload){
      	for(let index in this.tableData){//重置状态，可用重新查询代替
				if(this.tableData[index].id=payload.currentRow.id){
					let status=payload.currentRow.status=='1'?'2':'1'
      			this.tableData[index].status=status
      			this.currentRow.status=status
      			}
      		}
      
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
    },initRight(payload){//加载
				this.rights=payload.rights
	},deleteRow(payload){//删除
				this.tableData.remove(payload.currentRow)
				this.currentRow=null
				
	}
    },
    computed:{
    	token(){
    		return this.$store.state.token
    	}
    },components:{
    	Right
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