<template>
	<div class="container" @keypress.enter="search" >
		<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>用户管理</span>
    <el-button style="float: right; padding: 3px 0" type="text" @click="handleOpDetail">操作说明</el-button>
  </div>
  <el-alert
    title="操作说明"
    type="success"
    description="删除/修改需要 单击列表选择后操作；选中后的行会高亮显示"
    show-icon>
  </el-alert>
    <el-input  placeholder="搜索..." v-model="query.key" class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
  </el-input>
  <Right :rights="rights" :module="module" :currentRow="currentRow" :tableData="tableData" :moduleId="3" v-on:initRight="initRight" v-on:deleteRow="deleteRow"></Right>
 
  <!--template v-for="right in rights">
 
  	<el-button v-if="right.rightTxt=='新增'" type="success"  icon="el-icon-plus" @click="add"></el-button>
  	<el-button v-if="right.rightTxt=='修改'" type="primary" icon="el-icon-edit" @click="handleEdit"></el-button>
  	<el-button v-if="right.rightTxt=='删除'" type="danger" icon="el-icon-delete" @click="handleDelete"></el-button>
  
  </template -->
		 <el-table
    :data="tableData"
    style="width: 100%" @sort-change="sortFun" v-loading="loading"
    highlight-current-row 
    @current-change="handleRowChange"
    >
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="用户编号">
            <span>{{ props.row.id }}</span>
          </el-form-item>
          <el-form-item label="用户名">
            <span>{{ props.row.username }}</span>
          </el-form-item>
          <el-form-item label="用户姓名">
            <span>{{ props.row.realname }}</span>
          </el-form-item>
          <el-form-item label="密码">
            <span>{{ props.row.password }}</span>
          </el-form-item>
          <el-form-item label="状态">
            <span>{{ props.row.status }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="用户 ID"
      prop="id" sortable="custom">
    </el-table-column>
    <el-table-column
      label="用户名"
      prop="username" sortable="custom">
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
import Right from '@/components/Right'	
	export default {
		created(){
			this.search()
			//this.loadright()
		},
    data() {
      return {
      	module:'user',
      	loading:false,
      	pageSize : 10,
    	pageNum : 1,
    	sort : 'desc',
    	column :'username',
    	total : 0,
    	query:{//分页查询查询条件
    		key:''
    	},
    	shown:[//切换显示div
    	true,false,false,false,false
    	],
    	form:{
    		username:'',
    		password:'',
    		realname:'',
    		status:0
    	},
        tableData: [],
         rights:[],
        currentRow : null
      }
      
    },
    methods :{
    	sortFun(s){//触发排序事件的回调方法
		this.sort=s.order=='descending'?'desc':'asc'
		this.column=s.prop
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
     handleRowChange(val){
      	this.currentRow =val
      },
      handleOpDetail(){
      	
      },
    search(){//查询方法
    	this.loading=true
				this.$http({
  				method: 'post',
  				responseType : 'json',
  				url: this.$store.state.baseUrl+'/'+this.module+'/key/',
  				params: {
    				access_token:this.token,
    				pageSize : this.pageSize,
    				pageNum : this.pageNum,
    				sort : this.sort,
    				column : this.column,
    				key : this.query.key
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
    },initRight(payload){//加载
				this.rights=payload.rights
	},deleteRow(payload){//删除
				this.tableData.remove(payload.currentRow)
				this.currentRow=null
				
	}
    },components:{
  	Right
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