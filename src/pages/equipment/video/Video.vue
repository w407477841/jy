<template>
	<div class="container" @keypress.enter="search">
 <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>视频配置管理</span>
    <el-button style="float: right; padding: 3px 0" type="text" @click="handleOpDetail">操作说明</el-button>
  </div>
  <el-alert
    title="操作说明"
    type="success"
    description="删除/修改需要 单击列表选择后操作；选中后的行会高亮显示;企业用户可操作所有视频,工厂用户只能操作所属工厂的视频"
    show-icon>
  </el-alert>
  		
		<el-input placeholder="请输入视频名称" v-model="query.videoName" class="input-with-select">
    <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
  </el-input>
  <Right :rights="rights" :module="module" :currentRow="currentRow" :tableData="tableData" :moduleId="24" v-on:initRight="initRight" v-on:deleteRow="deleteRow"></Right>
  
		 <el-table
    :data="tableData"
    style="width: 100%" @sort-change="sortFun" v-loading="loading"
    highlight-current-row 
    @current-change="handleRowChange"
    >
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="视频编号">
            <span>{{ props.row.id }}</span>
          </el-form-item>
         <el-form-item label="视频IP地址">
            <span>{{ props.row.ipAddr }}</span>
          </el-form-item>
          <el-form-item label="视频端口号">
            <span>{{ props.row.port }}</span>
          </el-form-item>
           <el-form-item label="视频名称">
            <span>{{ props.row.videoName }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="视频ID"
      prop="id" sortable="custom">
    </el-table-column>
    <el-table-column
      label="视频名称"
      prop="videoName" sortable="custom">
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
		},
    data() {
      return {
      	module:'videoConfig',
      	loading:false,
      	pageSize : 10,
    	pageNum : 1,
    	sort : 'desc',
    	column :'factory_id',
    	total : 0,
    	query:{//分页查询查询条件
    		videoName:''
    	},
        tableData: [],
        rights:[],
        currentRow : null
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
      handleRowChange(val){
      	this.currentRow =val
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
  				},data :this.queryData
  				
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
    	},
    	queryData(){
    		if(this.$store.state.userType=='企业用户'){
    			return {
    				videoName : this.query.videoName
    			}
    		}
    		
    		return {
    				videoName : this.query.videoName,
    				factoryId : this.$store.state.factory 
    		}
    		
    	}
    	
    },
    components:{
    	Right
    }
  }
</script>

<style>
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