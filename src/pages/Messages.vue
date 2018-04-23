<template>
	<div class="container">
		<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>消息</span>
    <el-button style="float: right; padding: 3px 0" type="text" @click="handleOpDetail">操作说明</el-button>
  </div>
	<el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{prop:'time',order:'descending'}"
      >
      <el-table-column
        prop="time"
        label="时间"
        :formatter="timeformatter"
        >
      </el-table-column>
      <el-table-column
        prop="msg"
        label="内容"
        >
      </el-table-column>
    </el-table>
    </el-card>
   </div>
</template>

<script>
	export default{
		computed:{
			tableData(){
				return this.$store.state.message
			}
		},
		methods:{
			
			timeformatter(row, column, cellValue, index){
				console.log(cellValue)
				let d=new Date()
				d.getSeconds()
				return (1900+cellValue.getYear())+'-'
				+((cellValue.getMonth()+1)<10?'0'+(cellValue.getMonth()+1):(cellValue.getMonth()+1))+'-'
				+(cellValue.getDate()<10?'0'+cellValue.getDate():cellValue.getDate())+' '
				+(cellValue.getHours()<10?'0'+cellValue.getHours():cellValue.getHours())+':'
				+(cellValue.getMinutes()<10?'0'+cellValue.getMinutes():cellValue.getMinutes())+':'
				+(cellValue.getSeconds()<10?'0'+cellValue.getSeconds():cellValue.getSeconds())
			}
		}
	}
</script>

<style>
		.container{
		width:100%;
		margin-top: 20px;
	}
</style>