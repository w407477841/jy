<template>
	<div class="container" @keypress.enter="search" >
		<el-input placeholder="请输入项目名称" v-model="query.xmmc" class="input-with-select">
	 <el-button slot="prepend" icon="el-icon-plus" @click="add"></el-button>
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
  </el-input>
		 <el-table
    :data="tableData"
    style="width: 100%" @sort-change="sortFun" v-loading="loading">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="时间">
            <span>{{ props.row.sbsj }}</span>
          </el-form-item>
          <el-form-item label="部门">
            <span>{{ props.row.bm }}</span>
          </el-form-item>
          <el-form-item label="员工">
            <span>{{ props.row.yg }}</span>
          </el-form-item>
            <el-form-item label="项目编号">
            <span>{{ props.row.xmbh }}</span>
          </el-form-item>
          <el-form-item label="客户全称">
            <span>{{ props.row.khqc }}</span>
          </el-form-item>
           <el-form-item label="客户联系人">
            <span>{{ props.row.khlxr }}</span>
          </el-form-item>
             <el-form-item label="联系方式">
            <span>{{ props.row.lxfs }}</span>
          </el-form-item>
          <el-form-item label="项目名称">
            <span>{{ props.row.xmmc }}</span>
          </el-form-item>
          <el-form-item label="商机来源">
            <span>{{ props.row.sjly }}</span>
          </el-form-item>
          <el-form-item label="预算合同金额">
            <span>{{ props.row.yshtje }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="项目编号"
      prop="xmbh" sortable="custom">
    </el-table-column>
    <el-table-column
      label="项目名称"
      prop="xmmc" sortable="custom">
    </el-table-column>
    <el-table-column
      label="审核状态"
      prop="shzt" :formatter="shztFormatter" sortable="custom">
    </el-table-column>
    <el-table-column
      label="公示状态"
      prop="gszt" :formatter="gsztFormatter" sortable="custom">
    </el-table-column>
    <!--
  <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleView(scope.row.id)" type="text" size="small">查看</el-button>
      </template>
    </el-table-column>
    -->
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
	</div>
	
</template>
<script>
	export default {
		created(){
			this.search()
		},
    data() {
      return {
      	module:'shangjiInfo',
      	loading:false,
      	pageSize : 10,
    	pageNum : 1,
    	sort : 'desc',
    	column :'sbsj',
    	total : 0,
    	query:{//分页查询查询条件
    		xmmc:'',
    		yg:this.$store.state.username
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
      	this.$router.push({ path: ('/shangji/start') })
      },
      handleView(id){
      	this.$router.push({ path: (this.module+'/view/'+id) })
      },
      handleEdit(id){
      	this.$router.push({ path: (this.module+'/edit/'+id) })
      },
      gsztFormatter(row, column, cellValue){
    		if(cellValue==0) return '未公示'
    		else if(cellValue==1) return '已公示'
    		else  return '异常'
    	},
    	shztFormatter(row, column, cellValue){
    		if(cellValue==-1) return '未审核'
    		else if(cellValue==0) return '不同意'
    		else if(cellValue==1) return '同意'
    		else  return '异常'
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
      						//Forbidden
      						//org.springframework.security.access.AccessDeniedException
      						//不允许访问
      						
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